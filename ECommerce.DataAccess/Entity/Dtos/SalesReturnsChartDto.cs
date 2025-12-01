using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.DataAccess.Entity.Dtos
{
    public class SalesReturnsChartDto
    {
        public string Day { get; set; } // "Pzt", "Sal", ...
        public decimal SalesAmount { get; set; }
        public decimal ReturnAmount { get; set; }
    }
}
