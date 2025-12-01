using System.Collections.Generic;

namespace ECommerce.DataAccess.Entity
{
    public class Sale
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public decimal TotalPrice { get; set; }
        public DateOnly SaleDate { get; set; }
        public bool IsReturn { get; set; }
        public string? Status { get; set; }
        public string? SaleNo { get; set; }

        public Customer Customer { get; set; }
        public ICollection<SaleItem> SaleItems { get; set; } = new List<SaleItem>();
    }
}
