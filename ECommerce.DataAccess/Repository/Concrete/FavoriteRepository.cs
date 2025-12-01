using ECommerce.DataAccess.Context;
using ECommerce.DataAccess.Entity;
using ECommerce.DataAccess.Repository.Abstract;
using System.Collections.Generic;
using System.Linq;

namespace ECommerce.DataAccess.Repository.Concrete
{
    public class FavoriteRepository : IFavoriteRepository
    {
        private readonly DataContext _context;

        public FavoriteRepository(DataContext context)
        {
            _context = context;
        }

        public void AddFavorite(Favorite favorite)
        {
            _context.Favorites.Add(favorite);
        }

        public void RemoveFavorite(int favoriteId)
        {
            var favorite = _context.Favorites.Find(favoriteId);
            if (favorite != null)
                _context.Favorites.Remove(favorite);
        }

        public List<Favorite> GetFavoritesByCustomerId(int customerId)
        {
            return _context.Favorites
                .Where(f => f.CustomerId == customerId)
                .ToList();
        }

        public Favorite GetFavorite(int customerId, int productId)
        {
            return _context.Favorites
                .FirstOrDefault(f => f.CustomerId == customerId && f.ProductId == productId);
        }

        public void Save()
        {
            _context.SaveChanges();
        }
    }
}
