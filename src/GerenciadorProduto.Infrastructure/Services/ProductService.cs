using GerenciadorProduto.Application.DTOs.Products;
using GerenciadorProduto.Application.Exceptions;
using GerenciadorProduto.Application.Interfaces;
using GerenciadorProduto.Domain.Entities;
using GerenciadorProduto.Infrastructure.Persistence;
using GerenciadorProduto.Infrastructure.Time;
using Microsoft.EntityFrameworkCore;

namespace GerenciadorProduto.Infrastructure.Services;

public class ProductService : IProductService
{
    private readonly AppDbContext _dbContext;
    private readonly IFileStorageService _fileStorageService;

    public ProductService(AppDbContext dbContext, IFileStorageService fileStorageService)
    {
        _dbContext = dbContext;
        _fileStorageService = fileStorageService;
    }

    public async Task<IReadOnlyCollection<ProductResponse>> GetProductsAsync(
        string userId,
        bool isManager,
        ProductListQuery query,
        string baseUrl,
        CancellationToken cancellationToken = default)
    {
        var productsQuery = _dbContext.Products.AsNoTracking();

        if (isManager)
        {
            productsQuery = productsQuery.Where(product => product.UserId == userId);
        }

        productsQuery = ApplySorting(productsQuery, query);

        var products = await productsQuery.ToListAsync(cancellationToken);
        return products.Select(product => MapToResponse(product, baseUrl)).ToArray();
    }

    public async Task<ProductResponse> GetProductByIdAsync(
        Guid id,
        string userId,
        bool isManager,
        string baseUrl,
        CancellationToken cancellationToken = default)
    {
        var product = await _dbContext.Products.AsNoTracking()
            .FirstOrDefaultAsync(item => item.Id == id, cancellationToken);

        if (product is null)
        {
            throw new NotFoundException("Product not found.");
        }

        EnsureManagerOwnsProduct(product, userId, isManager);
        return MapToResponse(product, baseUrl);
    }

    public async Task<ProductResponse> CreateProductAsync(
        string userId,
        CreateProductRequest request,
        string baseUrl,
        CancellationToken cancellationToken = default)
    {
        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Description = request.Description?.Trim(),
            Price = request.Price,
            ImagePath = NormalizeImagePath(request.ImagePath),
            CreatedAt = BrazilDateTime.UtcNow(),
            UserId = userId
        };

        _dbContext.Products.Add(product);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return MapToResponse(product, baseUrl);
    }

    public async Task<ProductResponse> UpdateProductAsync(
        Guid id,
        string userId,
        UpdateProductRequest request,
        string baseUrl,
        CancellationToken cancellationToken = default)
    {
        var product = await _dbContext.Products.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (product is null)
        {
            throw new NotFoundException("Product not found.");
        }

        EnsureManagerOwnsProduct(product, userId, true);

        if (!string.Equals(product.ImagePath, request.ImagePath, StringComparison.OrdinalIgnoreCase))
        {
            _fileStorageService.DeleteIfExists(product.ImagePath);
        }

        product.Name = request.Name.Trim();
        product.Description = request.Description?.Trim();
        product.Price = request.Price;
        product.ImagePath = NormalizeImagePath(request.ImagePath);
        product.UpdatedAt = BrazilDateTime.UtcNow();

        await _dbContext.SaveChangesAsync(cancellationToken);
        return MapToResponse(product, baseUrl);
    }

    public async Task DeleteProductAsync(Guid id, string userId, CancellationToken cancellationToken = default)
    {
        var product = await _dbContext.Products.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (product is null)
        {
            throw new NotFoundException("Product not found.");
        }

        EnsureManagerOwnsProduct(product, userId, true);

        _dbContext.Products.Remove(product);
        await _dbContext.SaveChangesAsync(cancellationToken);
        _fileStorageService.DeleteIfExists(product.ImagePath);
    }

    private static IQueryable<Product> ApplySorting(IQueryable<Product> productsQuery, ProductListQuery query)
    {
        var sortBy = query.SortBy?.Trim().ToLowerInvariant();
        var descending = string.Equals(query.SortDirection, "desc", StringComparison.OrdinalIgnoreCase);

        return sortBy switch
        {
            "price" => descending
                ? productsQuery.OrderByDescending(product => product.Price).ThenByDescending(product => product.CreatedAt)
                : productsQuery.OrderBy(product => product.Price).ThenBy(product => product.CreatedAt),
            "createdat" or "created_at" or null or "" => descending
                ? productsQuery.OrderByDescending(product => product.CreatedAt)
                : productsQuery.OrderBy(product => product.CreatedAt),
            _ => throw new ValidationException("SortBy must be 'createdAt' or 'price'.")
        };
    }

    private static void EnsureManagerOwnsProduct(Product product, string userId, bool isManager)
    {
        if (isManager && product.UserId != userId)
        {
            throw new ForbiddenException("You do not have access to this product.");
        }
    }

    private static ProductResponse MapToResponse(Product product, string baseUrl)
    {
        return new ProductResponse
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            ImagePath = product.ImagePath,
            ImageUrl = BuildImageUrl(baseUrl, product.ImagePath),
            CreatedAt = BrazilDateTime.ToSaoPaulo(product.CreatedAt),
            UpdatedAt = BrazilDateTime.ToSaoPaulo(product.UpdatedAt),
            UserId = product.UserId
        };
    }

    private static string? NormalizeImagePath(string? imagePath)
    {
        return string.IsNullOrWhiteSpace(imagePath) ? null : imagePath.Trim().Replace("\\", "/");
    }

    private static string? BuildImageUrl(string baseUrl, string? imagePath)
    {
        if (string.IsNullOrWhiteSpace(imagePath))
        {
            return null;
        }

        return $"{baseUrl.TrimEnd('/')}/{imagePath.TrimStart('/')}";
    }
}
