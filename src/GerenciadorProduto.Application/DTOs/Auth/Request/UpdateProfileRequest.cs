using System.ComponentModel.DataAnnotations;
namespace GerenciadorProduto.Application.DTOs.Auth;

public class UpdateProfileRequest
{
    [Required]
    [MaxLength(150)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}
