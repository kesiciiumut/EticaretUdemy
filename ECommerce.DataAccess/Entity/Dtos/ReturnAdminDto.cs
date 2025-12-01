using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.DataAccess.Entity
{
    namespace ECommerce.DataAccess.Entity
    {
        public class ReturnAdminDto
        {
            public int Id { get; set; }
            public string ProductName { get; set; }
            public string CustomerName { get; set; }
            public string saleNo { get; set; }
            public DateOnly ReturnDate { get; set; }
            public string ReturnReason { get; set; }
            public string ReturnStatus { get; set; }
        }
    }

    
}
