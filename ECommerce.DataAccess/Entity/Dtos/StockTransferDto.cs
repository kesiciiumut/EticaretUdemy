using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.DataAccess.Entity.Dtos
{
    public class StockTransferDto
    {
        public int FromStoreId { get; set; }
        public int ToStoreId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }

}
