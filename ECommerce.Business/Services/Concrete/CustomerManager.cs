using ECommerce.Business.Helpers;
using ECommerce.Business.Services.Abstract;
using ECommerce.DataAccess.Entity;
using ECommerce.DataAccess.Repository.Abstract;
using ECommerce.DataAccess.Repository.Concrete;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Business.Services.Concrete
{
    public class CustomerManager : ICustomerService
    {
        private readonly ICustomerRepository _repo;
        private readonly string _jwtSecret;

        public CustomerManager(ICustomerRepository repo, IConfiguration config)
        {
            _repo = repo;
            _jwtSecret = config["Jwt:Key"];
        }

        public void Register(Customer customer)
        {
            if (_repo.GetByEmail(customer.Email) != null)
                throw new Exception("Email already exists.");

            PasswordHelper.CreatePasswordHash(customer.Password!, out var hash, out var salt);
            customer.PasswordHash = hash;
            customer.PasswordSalt = salt;
            customer.IsActive = true;
            customer.CreatedAt = DateTime.UtcNow;
            customer.Password = null;

            _repo.Add(customer);
        }

        public string Login(string email, string password)
        {
            var customer = _repo.GetByEmail(email);
            if (customer == null || !customer.IsActive)
                throw new Exception("User not found or inactive.");

            if (!PasswordHelper.VerifyPassword(password, customer.PasswordHash, customer.PasswordSalt))
                throw new Exception("Invalid password.");

            customer.LastLoginAt = DateTime.UtcNow;
            _repo.Update(customer);

            return JwtHelper.GenerateJwtToken(customer, _jwtSecret);
        }
        public Customer GetById(int id)
        {
            return _repo.GetById(id);
        }
    }
}
