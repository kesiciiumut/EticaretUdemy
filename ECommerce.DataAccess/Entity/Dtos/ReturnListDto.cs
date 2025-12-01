using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.DataAccess.Entity.Dtos
{
    public class ReturnListDto
    {
        public int Id { get; set; } // Talep No
        public string ProductName { get; set; } // Ürün
        public string Status { get; set; } // Durum
        public DateTime RequestDate { get; set; } // Tarih
        public string ReturnReason { get; set; } // İade Nedeni
    }
}

