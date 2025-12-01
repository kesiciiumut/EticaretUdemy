using ECommerce.DataAccess.Entity;

namespace ECommerce.DataAccess.Repository.Abstract
{
    public interface IStoreRepository
    {
        Task<List<Store>> GetAllAsync();
        Task<Store?> GetByIdAsync(int id);
        Task<Store> AddAsync(Store store);
        Task<Store?> UpdateAsync(Store store);
        Task<bool> DeleteAsync(int id);
    }
}
