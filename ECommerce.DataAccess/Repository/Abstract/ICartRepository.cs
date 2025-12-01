using ECommerce.DataAccess.Entity;
using System.Collections.Generic;

namespace ECommerce.DataAccess.Repository.Abstract
{
    public interface ICartRepository
    {
        Cart GetCartByCustomerId(int customerId);
        void AddCart(Cart cart);
        void UpdateCart(Cart cart);
        void RemoveCart(int cartId);
        void Save();
    }
}

