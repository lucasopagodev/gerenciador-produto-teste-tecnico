using Microsoft.AspNetCore.Http;

namespace GerenciadorProduto.Application.Interfaces;

public interface IFileStorageService
{
    Task<string> SaveProductImageAsync(IFormFile file, CancellationToken cancellationToken = default);
    void DeleteIfExists(string? relativePath);
}
