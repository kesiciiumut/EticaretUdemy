using ECommerce.DataAccess.Context;
using ECommerce.DataAccess.Entity;
using ECommerce.DataAccess.Repository.Abstract;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.DataAccess.Repository.Concrete
{
    public class ProductRepository : IProductRepository
    {
        private readonly DataContext _dataContext;

        public ProductRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<List<Product>> GetAllProducts()
        {
            return await _dataContext.Products
                .Include(p => p.Stocks)
                    .ThenInclude(s => s.Store)
                .ToListAsync();
        }

        public async Task<List<Product>> GetProductById(int id)
        {
            return await _dataContext.Products
                .Where(p => p.Id == id)
                .Include(p => p.Stocks)
                    .ThenInclude(s => s.Store)
                .ToListAsync();
        }

        public async Task<Product> AddNewProductAsync(Product product)
        {
            // Varsayım: product.Stocks içinde her mağaza için stok bilgisi var
            if (product.Stocks != null)
            {
                foreach (var stock in product.Stocks)
                {
                    stock.Product = product;
                }
            }

            await _dataContext.Products.AddAsync(product);
            await _dataContext.SaveChangesAsync();
            return product;
        }
        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _dataContext.Products
                .Include(p => p.Stocks)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return false;

            // Eğer ürünün stokları varsa önce onları sil
            if (product.Stocks != null && product.Stocks.Any())
            {
                _dataContext.Stocks.RemoveRange(product.Stocks);
            }

            _dataContext.Products.Remove(product);
            await _dataContext.SaveChangesAsync();
            return true;
        }
        public async Task<Product?> UpdateProductAsync(int id, Product updatedProduct)
        {
            var product = await _dataContext.Products.FirstOrDefaultAsync(p => p.Id == id);
            if (product == null)
                return null;

            // Sadece ürün bilgilerini güncelle (stoklar hariç)
            product.Name = updatedProduct.Name;
            product.Category = updatedProduct.Category;
            product.Description = updatedProduct.Description;
            product.Price = updatedProduct.Price;
            product.ImageUrl = updatedProduct.ImageUrl;
            product.IsActive = updatedProduct.IsActive;

            await _dataContext.SaveChangesAsync();
            return product;
        }

        public async Task<Product?> GetProductByIdSingle(int id)
        {
            return await _dataContext.Products
                .FirstOrDefaultAsync(p => p.Id == id);
        }

    }

}
