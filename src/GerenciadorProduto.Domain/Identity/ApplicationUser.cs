using Microsoft.AspNetCore.Identity;
using GerenciadorProduto.Domain.Entities;

namespace GerenciadorProduto.Domain.Identity;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;

    public ICollection<Product> Products { get; set; } = new List<Product>();
}
