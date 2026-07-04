namespace NizamProperty.Api.Models;

public class User
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string AuthProvider { get; set; } = string.Empty;
    public string Location { get; set; } = "Nizamabad";
    public List<string> Saved { get; set; } = [];
    public int Views { get; set; }
}

public class PropertyLocation
{
    public string Area { get; set; } = string.Empty;
    public string City { get; set; } = "Nizamabad";
    public double Lat { get; set; }
    public double Lng { get; set; }
}

public class Property
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = "house";
    public string Purpose { get; set; } = "sell";
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public PropertyLocation Location { get; set; } = new();
    public List<string> Images { get; set; } = [];
    public string SellerId { get; set; } = string.Empty;
    public string Status { get; set; } = "active";
    public int Sqft { get; set; }
    public int Bedrooms { get; set; }
    public string Facing { get; set; } = string.Empty;
    public bool ReadyToMove { get; set; }
    public int Views { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class ChatMessage
{
    public string Id { get; set; } = string.Empty;
    public string SenderId { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}

public class Conversation
{
    public string Id { get; set; } = string.Empty;
    public string PropertyId { get; set; } = string.Empty;
    public string BuyerId { get; set; } = string.Empty;
    public string SellerId { get; set; } = string.Empty;
    public List<ChatMessage> Messages { get; set; } = [];
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class SupportTicket
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Status { get; set; } = "open";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public record CreatePropertyRequest(
    string Type,
    string Title,
    string Description,
    decimal Price,
    PropertyLocation Location,
    List<string>? Images,
    int Sqft,
    int Bedrooms,
    string Facing,
    bool ReadyToMove
);

public record SendMessageRequest(string Text);

public record CreateTicketRequest(string Subject, string Message);
