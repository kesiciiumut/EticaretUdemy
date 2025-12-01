using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using ECommerce.DataAccess.Entity;


public class StockTransfer
{
    [Key]
    public int Id { get; set; }
    public int ProductId { get; set; }
    public int FromStoreId { get; set; }
    public int ToStoreId { get; set; }
    public int Quantity { get; set; }
    public DateTime TransferDate { get; set; }

    [ForeignKey(nameof(ProductId))]
    public virtual Product Product { get; set; }
    [ForeignKey(nameof(FromStoreId))]
    public virtual Store FromStore { get; set; }
    [ForeignKey(nameof(ToStoreId))]
    public virtual Store ToStore { get; set; }

}
