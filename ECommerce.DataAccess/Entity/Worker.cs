using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.DataAccess.Entity
{
    public class Worker
    {
        public int Id { get; set; }
        public int StoreId { get; set; }
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public string? Email { get; set; }
        public string? Role { get; set; }
        public string? Position { get; set; }
        public string? Status { get; set; }
        public Store? Store { get; set; }
    }
}
