using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.DataAccess.Entity.Dtos
{
    public class ReturnRequestDto
    {
        public int SaleId { get; set; }
        public int CustomerId { get; set; }
        public int ProductId { get; set; }
        public string? ReturnReason { get; set; }
        public DateOnly ReturnDate { get; set; } = DateOnly.FromDateTime(DateTime.Now);

    }
}
