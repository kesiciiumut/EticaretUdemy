using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ECommerce.DataAccess.Entity
{
    public class Store
    {
        [Key]
        public int Id { get; set; }
        public string? StoreName { get; set; }
        public bool IsActive { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? City { get; set; }
        public string? District { get; set; }
        public string? Address { get; set; }

        public virtual ICollection<Stock> Stocks { get; set; } = new List<Stock>();
    }
}
