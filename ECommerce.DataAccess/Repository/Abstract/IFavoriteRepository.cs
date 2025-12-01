using ECommerce.DataAccess.Entity;
using System.Collections.Generic;

namespace ECommerce.DataAccess.Repository.Abstract
{
    public interface IFavoriteRepository
    {
        void AddFavorite(Favorite favorite);
        void RemoveFavorite(int favoriteId);
        List<Favorite> GetFavoritesByCustomerId(int customerId);
        Favorite GetFavorite(int customerId, int productId);
        void Save();
    }
}
