using Microsoft.AspNetCore.Mvc;
using NizamProperty.Api.Services;

namespace NizamProperty.Api.Controllers;

[ApiController]
[Route("api/import")]
public class ImportController : ControllerBase
{
    private readonly ApifyImportService _apify;
    private readonly LocalDataStore _store;

    public ImportController(ApifyImportService apify, LocalDataStore store)
    {
        _apify = apify;
        _store = store;
    }

    /// <summary>
    /// Fetch listings from 99acres via Apify and merge into local store.
    /// Requires Apify:Token or APIFY_TOKEN env var.
    /// </summary>
    [HttpPost("99acres")]
    public async Task<IActionResult> Import99Acres([FromBody] Import99AcresRequest? request, CancellationToken ct)
    {
        request ??= new Import99AcresRequest();

        if (!_apify.IsConfigured)
        {
            return StatusCode(503, new
            {
                error = "Apify token not configured",
                hint = "Set Apify:Token in appsettings or APIFY_TOKEN environment variable",
                curlExample = GetCurlExample(request),
            });
        }

        try
        {
            var imported = await _apify.FetchListingsAsync(request.Location, request.Purpose, request.Limit, ct);
            var existing = _store.GetProperties();
            var byId = existing.ToDictionary(p => p.Id);
            foreach (var p in imported)
                byId[p.Id] = p;

            var merged = byId.Values.OrderByDescending(p => p.CreatedAt).ToList();
            _store.SaveProperties(merged);

            return Ok(new
            {
                imported = imported.Count,
                total = merged.Count,
                purpose = request.Purpose,
                location = request.Location,
                properties = imported,
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message, curlExample = GetCurlExample(request) });
        }
    }

    [HttpGet("99acres/status")]
    public IActionResult Status() => Ok(new
    {
        apifyConfigured = _apify.IsConfigured,
        actor = "fatihtahta/99acres-scraper",
    });

    private static object GetCurlExample(Import99AcresRequest request)
    {
        var dealType = request.Purpose == "rent" ? "residential_rent" : "residential_sale";
        var jsonBody = $"{{\"location\":[\"{request.Location}\"],\"deal_type\":\"{dealType}\",\"with_photo\":true,\"limit\":{request.Limit}}}";
        var command = "curl -X POST \"https://api.apify.com/v2/acts/fatihtahta~99acres-scraper/run-sync-get-dataset-items?token=<YOUR_TOKEN>\" "
            + "-H \"Content-Type: application/json\" "
            + $"-d '{jsonBody}'";

        return new
        {
            note = "Use location + deal_type (not startUrls) for fatihtahta/99acres-scraper",
            command,
        };
    }
}
