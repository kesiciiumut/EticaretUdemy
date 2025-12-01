using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using ECommerce.DataAccess.Entity;
using Microsoft.AspNetCore.Mvc.ModelBinding;

public class Customer
{
    [Key]
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Surname { get; set; }
    public string? Email { get; set; }
    public string? PhoneNo { get; set; }

    [JsonIgnore]
    [BindNever]
    public string? PasswordHash { get; set; } = null!;

    [JsonIgnore]
    [BindNever]
    public string? PasswordSalt { get; set; } = null!;

    [JsonIgnore]
    [BindNever]
    public bool IsActive { get; set; } = true;

    [JsonIgnore]
    [BindNever]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [JsonIgnore]
    [BindNever]
    public DateTime? LastLoginAt { get; set; }

    [JsonIgnore]
    [BindNever]
    public ICollection<Sale>? Sales { get; set; }

    [NotMapped]
    public string? Password { get; set; }
}
