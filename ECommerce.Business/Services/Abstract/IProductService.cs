using ECommerce.DataAccess.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Business.Services.Abstract
{
    public interface IProductService
    {
        Task<List<Product>> GetAllProducts();

        Task<List<Product>> GetProductById(int id);
        Task<Product> AddNewProductAsync(Product product);
        Task<bool>DeleteProductAsync(int id);
        Task<Product?> UpdateProductAsync(int id, Product updatedProduct);
        Task<Product?> GetProductByIdSingle(int id);


    }

}
