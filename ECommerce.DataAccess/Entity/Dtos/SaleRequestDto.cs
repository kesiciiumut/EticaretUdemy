using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.DataAccess.Entity.Dtos
{
    public class SaleRequestDto
    {
        public int CustomerId { get; set; }
        public decimal TotalPrice { get; set; }
        public DateOnly SaleDate { get; set; }
        public string? Status { get; set; }
        public List<SaleItemDto> Items { get; set; }
    }

    public class SaleItemDto
    {
        public int ProductId { get; set; }
        public int StoreId { get; set; }
        public int StockId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
   


}
