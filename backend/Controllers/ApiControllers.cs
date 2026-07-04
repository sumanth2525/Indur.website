using Microsoft.AspNetCore.Mvc;
using NizamProperty.Api.Models;
using NizamProperty.Api.Services;

namespace NizamProperty.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PropertiesController : ControllerBase
{
    private readonly LocalDataStore _store;

    public PropertiesController(LocalDataStore store) => _store = store;

    [HttpGet]
    public ActionResult<IEnumerable<Property>> GetAll([FromQuery] string? type, [FromQuery] string? location)
    {
        var props = _store.GetProperties().Where(p => p.Status == "active");
        if (!string.IsNullOrEmpty(type) && type != "all")
            props = props.Where(p => p.Type == type);
        if (!string.IsNullOrEmpty(location) && location != "Nizamabad")
            props = props.Where(p => p.Location.Area == location || p.Location.City == location);
        return Ok(props);
    }

    [HttpGet("{id}")]
    public ActionResult<Property> GetById(string id)
    {
        var prop = _store.GetProperties().FirstOrDefault(p => p.Id == id);
        return prop is null ? NotFound() : Ok(prop);
    }

    [HttpPost]
    public ActionResult<Property> Create([FromBody] CreatePropertyRequest req, [FromHeader(Name = "X-User-Id")] string userId)
    {
        var props = _store.GetProperties();
        var property = new Property
        {
            Id = LocalDataStore.NewId(),
            Type = req.Type,
            Title = req.Title,
            Description = req.Description,
            Price = req.Price,
            Location = req.Location,
            Images = req.Images ?? [],
            SellerId = userId,
            Sqft = req.Sqft,
            Bedrooms = req.Bedrooms,
            Facing = req.Facing,
            ReadyToMove = req.ReadyToMove,
        };
        props.Insert(0, property);
        _store.SaveProperties(props);
        return CreatedAtAction(nameof(GetById), new { id = property.Id }, property);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(string id)
    {
        var props = _store.GetProperties();
        var idx = props.FindIndex(p => p.Id == id);
        if (idx < 0) return NotFound();
        props.RemoveAt(idx);
        _store.SaveProperties(props);
        return NoContent();
    }
}

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly LocalDataStore _store;

    public UsersController(LocalDataStore store) => _store = store;

    [HttpGet("{id}")]
    public ActionResult<User> GetById(string id)
    {
        var user = _store.GetUsers().FirstOrDefault(u => u.Id == id);
        return user is null ? NotFound() : Ok(user);
    }
}

[ApiController]
[Route("api/[controller]")]
public class ConversationsController : ControllerBase
{
    private readonly LocalDataStore _store;

    public ConversationsController(LocalDataStore store) => _store = store;

    [HttpGet]
    public ActionResult<IEnumerable<Conversation>> GetForUser([FromQuery] string userId)
    {
        var convs = _store.GetConversations()
            .Where(c => c.BuyerId == userId || c.SellerId == userId)
            .OrderByDescending(c => c.UpdatedAt);
        return Ok(convs);
    }

    [HttpPost("{id}/messages")]
    public ActionResult<ChatMessage> SendMessage(string id, [FromBody] SendMessageRequest req, [FromHeader(Name = "X-User-Id")] string userId)
    {
        var convs = _store.GetConversations();
        var idx = convs.FindIndex(c => c.Id == id);
        if (idx < 0) return NotFound();

        var msg = new ChatMessage
        {
            Id = LocalDataStore.NewId(),
            SenderId = userId,
            Text = req.Text,
        };
        convs[idx].Messages.Add(msg);
        convs[idx].UpdatedAt = DateTime.UtcNow;
        _store.SaveConversations(convs);
        return Ok(msg);
    }
}

[ApiController]
[Route("api/[controller]")]
public class SupportController : ControllerBase
{
    private readonly LocalDataStore _store;

    public SupportController(LocalDataStore store) => _store = store;

    [HttpPost]
    public ActionResult<SupportTicket> Create([FromBody] CreateTicketRequest req, [FromHeader(Name = "X-User-Id")] string userId)
    {
        var tickets = _store.GetTickets();
        var ticket = new SupportTicket
        {
            Id = LocalDataStore.NewId(),
            UserId = userId,
            Subject = req.Subject,
            Message = req.Message,
        };
        tickets.Insert(0, ticket);
        _store.SaveTickets(tickets);
        return Ok(ticket);
    }
}

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(new { status = "ok", app = "NizamProperty API", storage = "local-json" });
}
