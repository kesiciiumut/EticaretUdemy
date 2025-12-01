using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace ECommerce.DataAccess.Entity.Dtos
{
    public class SaleListDto
    {
        public int Id { get; set; }
        public string? SaleNo { get; set; }
        public string? Status { get; set; }
        public DateOnly SaleDate { get; set; }

        public decimal TotalPrice { get; set; }
        public string? CustomerName { get; set; } // Eklendi
    }
}

