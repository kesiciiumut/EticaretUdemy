using ECommerce.DataAccess.Context;
using ECommerce.DataAccess.Entity;
using ECommerce.DataAccess.Repository.Abstract;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace ECommerce.DataAccess.Repository.Concrete
{
    public class CartRepository : ICartRepository
    {
        private readonly DataContext _context;

        public CartRepository(DataContext context)
        {
            _context = context;
        }

        public Cart GetCartByCustomerId(int customerId)
        {
            return _context.Carts
                .Include(c => c.Items)
                .FirstOrDefault(c => c.CustomerId == customerId);
        }

        public void AddCart(Cart cart)
        {
            _context.Carts.Add(cart);
        }

        public void UpdateCart(Cart cart)
        {
            _context.Carts.Update(cart);
        }

        public void RemoveCart(int cartId)
        {
            var cart = _context.Carts.Include(c => c.Items).FirstOrDefault(c => c.Id == cartId);
            if (cart != null)
            {
                _context.CartItems.RemoveRange(cart.Items);
                _context.Carts.Remove(cart);
            }
        }


        public void Save()
        {
            _context.SaveChanges();
        }
    }
}

