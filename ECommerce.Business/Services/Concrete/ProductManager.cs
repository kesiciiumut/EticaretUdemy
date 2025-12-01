using ECommerce.Business.Services.Abstract;
using ECommerce.DataAccess.Entity;
using ECommerce.DataAccess.Repository.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Business.Services.Concrete
{
    public class ProductManager : IProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductManager(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<List<Product>> GetAllProducts()
        {
            return await _productRepository.GetAllProducts();
        }
        public async Task<List<Product>> GetProductById(int id)
        {
            var data = await _productRepository.GetProductById(id);
            if (data.Count < 1) throw new Exception("Ürün Bulunamadı.");
            return data;
        }

        public async Task<Product> AddNewProductAsync(Product product)
        {
            if (string.IsNullOrWhiteSpace(product.Name))
                throw new ArgumentException("Ürün adı boş olamaz.");

            if (string.IsNullOrWhiteSpace(product.Price))
                throw new ArgumentException("Fiyat boş olamaz.");

            return await _productRepository.AddNewProductAsync(product);
        }
        public async Task<bool> DeleteProductAsync(int id)
        {
            return await _productRepository.DeleteProductAsync(id);
        }
        public async Task<Product?> UpdateProductAsync(int id, Product updatedProduct)
        {
            return await _productRepository.UpdateProductAsync(id, updatedProduct);
        }

        public async Task<Product?> GetProductByIdSingle(int id)
        {
            // Eğer repository'de yoksa ekleyin:
            return await _productRepository.GetProductByIdSingle(id);
        }

    }
}
