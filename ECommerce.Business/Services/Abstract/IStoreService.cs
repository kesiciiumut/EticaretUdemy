using ECommerce.DataAccess.Entity;

namespace ECommerce.Business.Services.Abstract
{
    public interface IStoreService
    {
        Task<List<Store>> GetAllStores();
        Task<Store?> GetStoreById(int id);
        Task<Store> AddStore(Store store);
        Task<Store?> UpdateStore(int id, Store store);
        Task<bool> DeleteStore(int id);
    }
}
