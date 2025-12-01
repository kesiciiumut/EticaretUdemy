using System;
using System.Collections.Generic;

namespace ECommerce.DataAccess.Entity
{
    // Sepet ana entity'si
    public class Cart
    {
        public int Id { get; set; }
        public int CustomerId { get; set; } // Müşteri Id (int olarak tutuldu)
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation property
        public Customer Customer { get; set; }
        public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
    }

    // Sepet içindeki ürünler
    public class CartItem
    {
        public int Id { get; set; }
        public int CartId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; } // Sepete eklenirkenki fiyat

        // Navigation property
        public Cart Cart { get; set; }
        public Product Product { get; set; }
    }
}
