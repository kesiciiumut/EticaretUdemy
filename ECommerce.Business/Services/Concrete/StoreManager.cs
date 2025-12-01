using ECommerce.Business.Services.Abstract;
using ECommerce.DataAccess.Entity;
using ECommerce.DataAccess.Repository.Abstract;

namespace ECommerce.Business.Services.Concrete
{
    public class StoreManager : IStoreService
    {
        private readonly IStoreRepository _storeRepository;

        public StoreManager(IStoreRepository storeRepository)
        {
            _storeRepository = storeRepository;
        }

        public async Task<List<Store>> GetAllStores()
        {
            return await _storeRepository.GetAllAsync();
        }

        public async Task<Store?> GetStoreById(int id)
        {
            return await _storeRepository.GetByIdAsync(id);
        }

        public async Task<Store> AddStore(Store store)
        {
            return await _storeRepository.AddAsync(store);
        }

        public async Task<Store?> UpdateStore(int id, Store store)
        {
            var existing = await _storeRepository.GetByIdAsync(id);
            if (existing == null) return null;

            // Güncellenebilir alanlar
            existing.StoreName = store.StoreName;
            existing.IsActive = store.IsActive;
            existing.Email = store.Email;
            existing.PhoneNumber = store.PhoneNumber;
            existing.City = store.City;
            existing.District = store.District;
            existing.Address = store.Address;

            return await _storeRepository.UpdateAsync(existing);
        }

        public async Task<bool> DeleteStore(int id)
        {
            return await _storeRepository.DeleteAsync(id);
        }
    }
}
