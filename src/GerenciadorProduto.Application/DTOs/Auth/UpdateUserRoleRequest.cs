using System.ComponentModel.DataAnnotations;
using GerenciadorProduto.Domain.Constants;

namespace GerenciadorProduto.Application.DTOs.Auth;

public class UpdateUserRoleRequest
{
    [Required]
    [RegularExpression($"^({RoleNames.Manager}|{RoleNames.User})$", ErrorMessage = "Role must be Manager or User.")]
    public string Role { get; set; } = string.Empty;
}
