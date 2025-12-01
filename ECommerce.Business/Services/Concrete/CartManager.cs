using ECommerce.Business.Services.Abstract;
using ECommerce.DataAccess.Entity;
using ECommerce.DataAccess.Repository.Abstract;
using System.Linq;

namespace ECommerce.Business.Services.Concrete
{
    public class CartManager : ICartService
    {
        private readonly ICartRepository _cartRepository;

        public CartManager(ICartRepository cartRepository)
        {
            _cartRepository = cartRepository;
        }

        public Cart GetCartByCustomerId(int customerId)
        {
            return _cartRepository.GetCartByCustomerId(customerId);
        }

        public void AddToCart(int customerId, int productId, int quantity, decimal unitPrice)
        {
            var cart = _cartRepository.GetCartByCustomerId(customerId) ?? new Cart { CustomerId = customerId };
            var item = cart.Items.FirstOrDefault(i => i.ProductId == productId);

            if (item != null)
            {
                item.Quantity += quantity;
            }
            else
            {
                cart.Items.Add(new CartItem
                {
                    ProductId = productId,
                    Quantity = quantity,
                    UnitPrice = unitPrice
                });
            }

            if (cart.Id == 0)
                _cartRepository.AddCart(cart);
            else
                _cartRepository.UpdateCart(cart);

            _cartRepository.Save();
        }

        public void RemoveFromCart(int customerId, int productId)
        {
            var cart = _cartRepository.GetCartByCustomerId(customerId);
            if (cart == null) return;

            var item = cart.Items.FirstOrDefault(i => i.ProductId == productId);
            if (item != null)
            {
                cart.Items.Remove(item);
                _cartRepository.UpdateCart(cart);
                _cartRepository.Save();
            }
        }

        public void ClearCart(int customerId)
        {
            var cart = _cartRepository.GetCartByCustomerId(customerId);
            if (cart != null)
            {
                cart.Items.Clear();
                _cartRepository.UpdateCart(cart);
                _cartRepository.Save();
            }
        }
    }
}
