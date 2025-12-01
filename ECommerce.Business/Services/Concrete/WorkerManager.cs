using ECommerce.Business.Services.Abstract;
using ECommerce.DataAccess.Entity;
using ECommerce.DataAccess.Repository.Abstract;

namespace ECommerce.Business.Services.Concrete
{
    public class WorkerManager : IWorkerService
    {
        private readonly IWorkerRepository _workerRepository;

        public WorkerManager(IWorkerRepository workerRepository)
        {
            _workerRepository = workerRepository;
        }

        public async Task<List<Worker>> GetAllWorkers()
        {
            return await _workerRepository.GetAllAsync();
        }

        public async Task<Worker?> GetWorkerById(int id)
        {
            return await _workerRepository.GetByIdAsync(id);
        }

        public async Task<Worker?> GetWorkerByStoreId(int storeId)
        {
            return await _workerRepository.GetByStoreIdAsync(storeId);
        }

        public async Task<Worker> AddWorker(Worker worker)
        {
            return await _workerRepository.AddAsync(worker);
        }

        public async Task<Worker?> UpdateWorker(int id, Worker worker)
        {
            var existing = await _workerRepository.GetByIdAsync(id);
            if (existing == null) return null;

            existing.Name = worker.Name;
            existing.Surname = worker.Surname;
            existing.Email = worker.Email;
            existing.Role = worker.Role;
            existing.Position = worker.Position;
            existing.Status = worker.Status;
            existing.StoreId = worker.StoreId;

            return await _workerRepository.UpdateAsync(existing);
        }

        public async Task<bool> DeleteWorker(int id)
        {
            return await _workerRepository.DeleteAsync(id);
        }
    }
}
