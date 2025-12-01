using ECommerce.DataAccess.Entity;

namespace ECommerce.Business.Services.Abstract
{
    public interface ICartService
    {
        Cart GetCartByCustomerId(int customerId);
        void AddToCart(int customerId, int productId, int quantity, decimal unitPrice);
        void RemoveFromCart(int customerId, int productId);
        void ClearCart(int customerId);
    }
}

