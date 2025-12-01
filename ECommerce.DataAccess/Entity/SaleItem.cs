using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerce.DataAccess.Entity
{
    public class SaleItem
    {
        public int Id { get; set; }
        public int SaleId { get; set; }
        public int ProductId { get; set; }
        public int StoreId { get; set; }
        public int StockId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }

        [ForeignKey(nameof(SaleId))]
        public Sale Sale { get; set; }

        [ForeignKey(nameof(ProductId))]
        public Product Product { get; set; }

        [ForeignKey(nameof(StoreId))]
        public Store Store { get; set; }

        [ForeignKey(nameof(StockId))]
        public Stock Stock { get; set; }
    }
}
