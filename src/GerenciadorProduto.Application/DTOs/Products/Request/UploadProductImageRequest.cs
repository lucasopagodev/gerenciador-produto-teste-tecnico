using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace GerenciadorProduto.Application.DTOs.Products;

public class UploadProductImageRequest
{
    [Required]
    public IFormFile File { get; set; } = null!;
}
