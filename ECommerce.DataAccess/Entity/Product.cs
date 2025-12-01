using System.ComponentModel.DataAnnotations;
using ECommerce.DataAccess.Entity;

public class Product
{
    [Key]
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Code { get; set; }
    public string? Description { get; set; }
    public string? Category { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsActive { get; set; }
    public string? Price { get; set; }

    public virtual ICollection<Stock>? Stocks { get; set; }

    public Product()
    {
        this.Stocks = new List<Stock>();
    }
}
