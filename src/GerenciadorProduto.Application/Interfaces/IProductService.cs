using GerenciadorProduto.Application.DTOs.Products;

namespace GerenciadorProduto.Application.Interfaces;

public interface IProductService
{
    Task<IReadOnlyCollection<ProductResponse>> GetProductsAsync(string userId, bool isManager, ProductListQuery query, string baseUrl, CancellationToken cancellationToken = default);
    Task<ProductResponse> GetProductByIdAsync(Guid id, string userId, bool isManager, string baseUrl, CancellationToken cancellationToken = default);
    Task<ProductResponse> CreateProductAsync(string userId, CreateProductRequest request, string baseUrl, CancellationToken cancellationToken = default);
    Task<ProductResponse> UpdateProductAsync(Guid id, string userId, UpdateProductRequest request, string baseUrl, CancellationToken cancellationToken = default);
    Task DeleteProductAsync(Guid id, string userId, CancellationToken cancellationToken = default);
}
