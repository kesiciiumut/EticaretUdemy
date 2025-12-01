using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.DataAccess.Entity.Dtos
{
    public class TopSellingProductDto
    {
        public string Product { get; set; }
        public int Sold { get; set; }
        public decimal Revenue { get; set; }
    }

}
