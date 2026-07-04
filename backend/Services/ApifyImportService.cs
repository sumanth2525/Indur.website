using System.Net.Http.Json;
using System.Text.Json;
using NizamProperty.Api.Models;

namespace NizamProperty.Api.Services;

public class ApifyImportService
{
    private const string ActorId = "fatihtahta~99acres-scraper";
    private const string ApifyBase = "https://api.apify.com/v2";

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _config;
    private readonly ILogger<ApifyImportService> _logger;

    public ApifyImportService(
        IHttpClientFactory httpClientFactory,
        IConfiguration config,
        ILogger<ApifyImportService> logger)
    {
        _httpClientFactory = httpClientFactory;
        _config = config;
        _logger = logger;
    }

    public bool IsConfigured =>
        !string.IsNullOrWhiteSpace(_config["Apify:Token"] ?? Environment.GetEnvironmentVariable("APIFY_TOKEN"));

    public async Task<IReadOnlyList<Property>> FetchListingsAsync(
        string location,
        string purpose = "sell",
        int limit = 30,
        CancellationToken ct = default)
    {
        var token = _config["Apify:Token"] ?? Environment.GetEnvironmentVariable("APIFY_TOKEN");
        if (string.IsNullOrWhiteSpace(token))
            throw new InvalidOperationException("Apify token not configured. Set Apify:Token or APIFY_TOKEN.");

        var dealType = purpose == "rent" ? "residential_rent" : "residential_sale";
        var input = new
        {
            location = new[] { location },
            deal_type = dealType,
            with_photo = true,
            limit,
        };

        var url = $"{ApifyBase}/acts/{ActorId}/run-sync-get-dataset-items?token={Uri.EscapeDataString(token)}";
        var client = _httpClientFactory.CreateClient();
        client.Timeout = TimeSpan.FromMinutes(10);

        _logger.LogInformation("Calling Apify 99acres scraper for {Location} ({Purpose})", location, purpose);

        using var response = await client.PostAsJsonAsync(url, input, ct);
        var body = await response.Content.ReadAsStringAsync(ct);

        if (!response.IsSuccessStatusCode)
            throw new InvalidOperationException($"Apify request failed ({(int)response.StatusCode}): {body[..Math.Min(body.Length, 500)]}");

        using var doc = JsonDocument.Parse(body);
        var root = doc.RootElement;

        // Response may be a bare array or wrapped in { data: [...] }
        var items = root.ValueKind == JsonValueKind.Array
            ? root
            : root.TryGetProperty("data", out var data) && data.ValueKind == JsonValueKind.Array
                ? data
                : root;

        if (items.ValueKind != JsonValueKind.Array)
            throw new InvalidOperationException("Unexpected Apify response format.");

        var properties = new List<Property>();
        foreach (var item in items.EnumerateArray())
        {
            var mapped = MapItem(item, purpose);
            if (mapped != null) properties.Add(mapped);
        }

        return properties;
    }

    private static Property? MapItem(JsonElement item, string purpose)
    {
        var recordId = GetString(item, "record_id");
        if (string.IsNullOrEmpty(recordId)) return null;

        var entity = item.TryGetProperty("entity", out var e) ? e : default;
        var listing = item.TryGetProperty("listing", out var l) ? l : default;
        var pricing = item.TryGetProperty("pricing", out var p) ? p : default;
        var prop = item.TryGetProperty("property", out var pr) ? pr : default;
        var loc = item.TryGetProperty("location", out var lo) ? lo : default;
        var media = item.TryGetProperty("media", out var m) ? m : default;

        var title = GetString(entity, "title") ?? GetString(listing, "title") ?? "Property listing";
        var description = GetString(entity, "description") ?? title;
        var propertyTypeRaw = GetString(listing, "property_type") ?? "";
        var type = MapPropertyType(propertyTypeRaw);

        decimal price = 0;
        if (pricing.ValueKind == JsonValueKind.Object)
        {
            if (pricing.TryGetProperty("min_price", out var minP) && minP.TryGetDecimal(out var d)) price = d;
            else if (pricing.TryGetProperty("average_price", out var avg) && avg.TryGetDecimal(out d)) price = d;
        }

        var sqft = 0;
        if (prop.TryGetProperty("area", out var area) && area.TryGetProperty("builtup_sqft", out var sq)
            && sq.TryGetDouble(out var sqd))
            sqft = (int)sqd;

        var bedrooms = prop.TryGetProperty("bedrooms", out var beds) && beds.TryGetInt32(out var b) ? b : 0;

        var images = new List<string>();
        if (media.TryGetProperty("photos", out var photos) && photos.ValueKind == JsonValueKind.Array)
        {
            foreach (var photo in photos.EnumerateArray())
            {
                var url = photo.GetString();
                if (!string.IsNullOrEmpty(url)) images.Add(url);
            }
        }
        var mainImage = GetString(media, "main_image");
        if (images.Count == 0 && !string.IsNullOrEmpty(mainImage)) images.Add(mainImage);

        var locality = GetString(loc, "locality") ?? GetString(loc, "city") ?? "Nizamabad";
        var city = GetString(loc, "city") ?? "Nizamabad";
        double lat = 18.6725, lng = 78.0941;
        if (loc.TryGetProperty("coordinates", out var coords))
        {
            if (coords.TryGetProperty("latitude", out var latEl) && latEl.TryGetDouble(out var latV)) lat = latV;
            if (coords.TryGetProperty("longitude", out var lngEl) && lngEl.TryGetDouble(out var lngV)) lng = lngV;
        }

        var readyToMove = listing.TryGetProperty("deal_type", out _)
            && (GetString(listing, "deal_type")?.Contains("sale") ?? true);

        return new Property
        {
            Id = $"99acres-{recordId}",
            Type = type,
            Purpose = purpose,
            Title = title,
            Description = description,
            Price = price,
            Location = new PropertyLocation { Area = locality, City = city.Contains("Nizamabad", StringComparison.OrdinalIgnoreCase) ? "Nizamabad" : city, Lat = lat, Lng = lng },
            Images = images,
            SellerId = "user-ravi",
            Status = "active",
            Sqft = sqft,
            Bedrooms = bedrooms,
            Facing = "East",
            ReadyToMove = type is "apartment" or "house",
            Views = 0,
            CreatedAt = DateTime.UtcNow,
        };
    }

    private static string MapPropertyType(string raw)
    {
        var t = raw.ToLowerInvariant();
        if (t.Contains("agri") || t.Contains("farm")) return "agriculture";
        if (t.Contains("land") || t.Contains("plot")) return "land";
        if (t.Contains("house") || t.Contains("villa") || t.Contains("bungalow")) return "house";
        return "apartment";
    }

    private static string? GetString(JsonElement parent, string name)
    {
        if (parent.ValueKind != JsonValueKind.Object) return null;
        return parent.TryGetProperty(name, out var el) && el.ValueKind == JsonValueKind.String
            ? el.GetString()
            : null;
    }
}

public record Import99AcresRequest(string Location = "Nizamabad", string Purpose = "sell", int Limit = 30);
