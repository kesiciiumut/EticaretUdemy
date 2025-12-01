using ECommerce.DataAccess.Entity;

public class Return
{
    public int Id { get; set; }
    public int SaleId { get; set; }
    public int CustomerId { get; set; }
    public int ProductId { get; set; } // Ürün Id

    public DateOnly ReturnDate { get; set; }
    public string? ReturnReason { get; set; }
    public string? ReturnStatus { get; set; }
    public string ReturnCode { get; set; }

    public Sale Sale { get; set; }
    public Product Product { get; set; } // <-- DÜZELTİLDİ
    public Customer Customer { get; set; }
}
