using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.DataAccess.Entity.Dtos
{

    public class SaleNotificationDto
    {
        public string Title { get; set; }          
        public string Description { get; set; }    
        public DateTime SaleDate { get; set; }
    }

}
