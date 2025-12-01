using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ECommerce.DataAccess.Entity
{
    public class Stock
    {
        [Key]
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int StoreId { get; set; }
        public int Quantity { get; set; }

        [ForeignKey(nameof(ProductId))]
        [JsonIgnore]
        public virtual Product Product { get; set; }

        [ForeignKey(nameof(StoreId))]
        [JsonIgnore]

        public virtual Store Store { get; set; }
    }
}
