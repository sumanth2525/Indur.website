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
                Images =
                [
                    "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
                    "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800",
                ],
            },
            new()
            {
                Id = "prop-2", Type = "land", Title = "Residential Plot, Armoor Road",
                Description = "Clear-title residential plot ideal for building your dream home.",
                Price = 4500000, SellerId = "user-priya", Sqft = 2400, Facing = "North", Views = 34,
                Location = new PropertyLocation { Area = "Armoor Road", City = "Nizamabad", Lat = 18.685, Lng = 78.11 },
                Images =
                [
                    "https://images.pexels.com/photos/1118448/pexels-photo-1118448.jpeg?auto=compress&cs=tinysrgb&w=800",
                ],
            },
            new()
            {
                Id = "prop-6", Type = "apartment", Title = "1BHK Starter Flat, Jakranpally",
                Description = "Affordable 1BHK flat ideal for singles or young couples.",
                Price = 3200000, SellerId = "user-priya", Sqft = 650, Bedrooms = 1, Facing = "North", ReadyToMove = true, Views = 28,
                Location = new PropertyLocation { Area = "Jakranpally", City = "Nizamabad", Lat = 18.68, Lng = 78.10 },
                Images =
                [
                    "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=800",
                ],
            },
            new()
            {
                Id = "prop-3", Type = "apartment", Title = "3BHK Apartment, Bodhan Road",
                Description = "Modern 3BHK apartment in a gated community.",
                Price = 9200000, SellerId = "user-ravi", Sqft = 1850, Bedrooms = 3, Facing = "West", ReadyToMove = true, Views = 78,
                Location = new PropertyLocation { Area = "Bodhan Road", City = "Nizamabad", Lat = 18.66, Lng = 78.08 },
                Images =
                [
                    "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800",
                    "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=800",
                ],
            },
            new()
            {
                Id = "prop-7", Type = "agriculture", Title = "Agriculture Land, 2 Acres — Bodhan",
                Description = "Fertile agriculture land suitable for paddy and cotton. Borewell available.",
                Price = 2400000, SellerId = "user-ravi", Sqft = 0, Bedrooms = 0, Facing = "East", Views = 45,
                Location = new PropertyLocation { Area = "Bodhan", City = "Nizamabad", Lat = 18.66, Lng = 77.89 },
                Images =
                [
                    "https://images.pexels.com/photos/956491/pexels-photo-956491.jpeg?auto=compress&cs=tinysrgb&w=800",
                    "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800",
                ],
            },
        };

        SaveUsers(users);
        SaveProperties(properties);
    }
}
