using ECommerce.DataAccess.Entity;
using System.Collections.Generic;

namespace ECommerce.Business.Services.Abstract
{
    public interface IFavoriteService
    {
        void AddFavorite(int customerId, int productId);
        void RemoveFavorite(int favoriteId);
        List<Favorite> GetFavoritesByCustomerId(int customerId);
        Favorite GetFavorite(int customerId, int productId);
    }
}
