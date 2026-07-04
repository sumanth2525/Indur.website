using System.Text.Json;
using NizamProperty.Api.Models;

namespace NizamProperty.Api.Services;

/// <summary>
/// In-memory JSON file store — mirrors frontend localStorage for MVP.
/// Replace with Firebase/Postgres when ready.
/// </summary>
public class LocalDataStore
{
    private readonly string _dataDir;
    private readonly object _lock = new();

    public LocalDataStore(IWebHostEnvironment env)
    {
        _dataDir = Path.Combine(env.ContentRootPath, "Data");
        Directory.CreateDirectory(_dataDir);
        SeedIfEmpty();
    }

    private string PathFor(string key) => System.IO.Path.Combine(_dataDir, $"{key}.json");

    private List<T> ReadList<T>(string key)
    {
        var path = PathFor(key);
        if (!File.Exists(path)) return [];
        var json = File.ReadAllText(path);
        return JsonSerializer.Deserialize<List<T>>(json) ?? [];
    }

    private void WriteList<T>(string key, List<T> data)
    {
        var path = PathFor(key);
        var json = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
        File.WriteAllText(path, json);
    }

    public List<User> GetUsers() { lock (_lock) return ReadList<User>("users"); }
    public void SaveUsers(List<User> users) { lock (_lock) WriteList("users", users); }

    public List<Property> GetProperties() { lock (_lock) return ReadList<Property>("properties"); }
    public void SaveProperties(List<Property> props) { lock (_lock) WriteList("properties", props); }

    public List<Conversation> GetConversations() { lock (_lock) return ReadList<Conversation>("conversations"); }
    public void SaveConversations(List<Conversation> convs) { lock (_lock) WriteList("conversations", convs); }

    public List<SupportTicket> GetTickets() { lock (_lock) return ReadList<SupportTicket>("tickets"); }
    public void SaveTickets(List<SupportTicket> tickets) { lock (_lock) WriteList("tickets", tickets); }

    public static string NewId() => $"{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}-{Guid.NewGuid():N}"[..24];

    private void SeedIfEmpty()
    {
        if (GetProperties().Count > 0) return;

        var users = new List<User>
        {
            new() { Id = "user-ravi", Name = "Ravi Kumar", Phone = "+91 98765 43210", Email = "ravi@example.com", AuthProvider = "google", Location = "Nizamabad", Views = 142 },
            new() { Id = "user-priya", Name = "Priya Sharma", Phone = "+91 91234 56789", Email = "priya@example.com", AuthProvider = "phone", Location = "Kanteshwar", Views = 89 },
        };

        var properties = new List<Property>
        {
            new()
            {
                Id = "prop-1", Type = "house", Title = "2BHK Independent House, Kanteshwar",
                Description = "Spacious 2BHK independent house with east-facing entrance.",
                Price = 6800000, SellerId = "user-ravi", Sqft = 1200, Bedrooms = 2, Facing = "East", ReadyToMove = true, Views = 56,
                Location = new PropertyLocation { Area = "Kanteshwar", City = "Nizamabad", Lat = 18.6725, Lng = 78.0941 },
                Images = ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"],
            },
            new()
            {
                Id = "prop-2", Type = "land", Title = "Residential Plot, Armoor Road",
                Description = "Clear-title residential plot ideal for building your dream home.",
                Price = 4500000, SellerId = "user-priya", Sqft = 2400, Facing = "North", Views = 34,
                Location = new PropertyLocation { Area = "Armoor Road", City = "Nizamabad", Lat = 18.685, Lng = 78.11 },
                Images = ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"],
            },
        };

        SaveUsers(users);
        SaveProperties(properties);
    }
}
