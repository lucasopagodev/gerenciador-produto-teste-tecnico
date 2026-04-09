using GerenciadorProduto.Application.Exceptions;
using GerenciadorProduto.Application.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace GerenciadorProduto.Infrastructure.Services;

public class LocalFileStorageService : IFileStorageService
{
    private static readonly string[] AllowedExtensions = [".jpg", ".jpeg", ".png"];
    private static readonly string[] AllowedContentTypes = ["image/jpeg", "image/png"];

    private readonly string _webRootPath;
    private readonly string _uploadsRootPath;

    public LocalFileStorageService(IWebHostEnvironment environment)
    {
        _webRootPath = environment.WebRootPath;
        if (string.IsNullOrWhiteSpace(_webRootPath))
        {
            _webRootPath = Path.Combine(environment.ContentRootPath, "wwwroot");
        }

        _uploadsRootPath = Path.Combine(_webRootPath, "uploads", "products");
        Directory.CreateDirectory(_uploadsRootPath);
    }

    public async Task<string> SaveProductImageAsync(IFormFile file, CancellationToken cancellationToken = default)
    {
        if (file.Length == 0)
        {
            throw new ValidationException("The image file is empty.");
        }

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension))
        {
            throw new ValidationException("Only .jpg, .jpeg and .png files are allowed.");
        }

        if (!AllowedContentTypes.Contains(file.ContentType.ToLowerInvariant()))
        {
            throw new ValidationException("Only JPEG and PNG images are allowed.");
        }

        var fileName = $"{Guid.NewGuid():N}{extension}";
        var filePath = Path.Combine(_uploadsRootPath, fileName);

        await using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream, cancellationToken);

        return Path.Combine("uploads", "products", fileName).Replace("\\", "/");
    }

    public void DeleteIfExists(string? relativePath)
    {
        if (string.IsNullOrWhiteSpace(relativePath))
        {
            return;
        }

        var normalizedPath = relativePath.Replace('/', Path.DirectorySeparatorChar);
        var fullPath = Path.Combine(_webRootPath, normalizedPath);

        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
        }
    }
}
