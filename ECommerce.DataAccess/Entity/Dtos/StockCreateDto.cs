using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.DataAccess.Entity.Dtos
{
    public class StockCreateDto
    {
        public int ProductId { get; set; }
        public int StoreId { get; set; }
        public int Quantity { get; set; }
    }

}
