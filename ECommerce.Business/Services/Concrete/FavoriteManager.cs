using ECommerce.Business.Services.Abstract;
using ECommerce.DataAccess.Entity;
using ECommerce.DataAccess.Repository.Abstract;
using System.Collections.Generic;

namespace ECommerce.Business.Services.Concrete
{
    public class FavoriteManager : IFavoriteService
    {
        private readonly IFavoriteRepository _favoriteRepository;

        public FavoriteManager(IFavoriteRepository favoriteRepository)
        {
            _favoriteRepository = favoriteRepository;
        }

        public void AddFavorite(int customerId, int productId)
        {
            var existing = _favoriteRepository.GetFavorite(customerId, productId);
            if (existing == null)
            {
                var favorite = new Favorite { CustomerId = customerId, ProductId = productId };
                _favoriteRepository.AddFavorite(favorite);
                _favoriteRepository.Save();
            }
        }

        public void RemoveFavorite(int favoriteId)
        {
            _favoriteRepository.RemoveFavorite(favoriteId);
            _favoriteRepository.Save();
        }

        public List<Favorite> GetFavoritesByCustomerId(int customerId)
        {
            return _favoriteRepository.GetFavoritesByCustomerId(customerId);
        }

        public Favorite GetFavorite(int customerId, int productId)
        {
            return _favoriteRepository.GetFavorite(customerId, productId);
        }
    }
}
