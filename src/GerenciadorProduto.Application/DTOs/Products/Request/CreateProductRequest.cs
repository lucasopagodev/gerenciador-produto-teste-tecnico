using System.ComponentModel.DataAnnotations;

namespace GerenciadorProduto.Application.DTOs.Products;

public class CreateProductRequest
{
    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Range(0.01, 999999999.99)]
    public decimal Price { get; set; }

    [MaxLength(500)]
    public string? ImagePath { get; set; }
}
