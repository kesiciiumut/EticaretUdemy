using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.DataAccess.Entity.Dtos
{
    public class StockQueryDto
    {
        public int StoreId { get; set; }
        public List<int> ProductIds { get; set; }
    }

}
