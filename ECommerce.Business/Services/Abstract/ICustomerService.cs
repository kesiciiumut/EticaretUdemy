using ECommerce.DataAccess.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Business.Services.Abstract
{
    public interface ICustomerService
    {
        void Register(Customer customer);
        string Login(string email, string password);
        Customer GetById(int id);
    }
}
