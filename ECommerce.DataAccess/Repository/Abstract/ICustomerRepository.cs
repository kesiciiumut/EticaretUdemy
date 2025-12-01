using ECommerce.DataAccess.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.DataAccess.Repository.Abstract
{
    public interface ICustomerRepository
    {
        Customer? GetByEmail(string email);
        void Add(Customer customer);
        void Update(Customer customer);
        Customer GetById(int id);
        
    }
}
