using ECommerce.DataAccess.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.DataAccess.Repository.Abstract
{
    public interface IReturnRepository
    {
        void Add(Return entity);
        Task<Return> GetByIdAsync(int id);
        IEnumerable<Return> GetAll();
        IEnumerable<Return> GetByCustomerId(int customerId);
        Task UpdateAsync(Return entity);
        void Save();
        Task ApproveAsync(int i);
        Task RejectAsync(int id);
        IEnumerable<Return> GetApprovedReturnsByDateRange(DateOnly startDate, DateOnly endDate);
        int GetTotalReturnCount();


    }
}
