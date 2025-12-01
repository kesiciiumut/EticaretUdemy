using ECommerce.DataAccess.Context;
using ECommerce.DataAccess.Entity;
using ECommerce.DataAccess.Repository.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.DataAccess.Repository.Concrete
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly DataContext _context;
        public CustomerRepository(DataContext context) => _context = context;

        public Customer? GetByEmail(string email) =>
            _context.Customers.SingleOrDefault(x => x.Email == email);

        public void Add(Customer customer)
        {
            _context.Customers.Add(customer);
            _context.SaveChanges();
        }

        public void Update(Customer customer)
        {
            _context.Customers.Update(customer);
            _context.SaveChanges();
        }
        public Customer GetById(int id)
        {
            return _context.Customers.FirstOrDefault(x => x.Id == id);
        }


    }
}
