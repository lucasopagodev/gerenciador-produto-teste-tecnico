using GerenciadorProduto.Domain.Constants;
using GerenciadorProduto.Domain.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace GerenciadorProduto.Infrastructure.Persistence.Seed;

public class IdentitySeedService
{
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;

    public IdentitySeedService(
        RoleManager<IdentityRole> roleManager,
        UserManager<ApplicationUser> userManager,
        IConfiguration configuration)
    {
        _roleManager = roleManager;
        _userManager = userManager;
        _configuration = configuration;
    }

    public async Task SeedAsync()
    {
        foreach (var roleName in RoleNames.All)
        {
            if (!await _roleManager.RoleExistsAsync(roleName))
            {
                await _roleManager.CreateAsync(new IdentityRole(roleName));
            }
        }

        var shouldSeedUsers = _configuration.GetValue("SeedData:SeedTestUsers", true);
        if (!shouldSeedUsers)
        {
            return;
        }

        await SeedUserAsync("manager@test.com", "Usuário Manager", "Teste@123", RoleNames.Manager);
        await SeedUserAsync("user@test.com", "Usuário User", "User@123", RoleNames.User);
    }

    private async Task SeedUserAsync(string email, string fullName, string password, string role)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user is null)
        {
            user = new ApplicationUser
            {
                FullName = fullName,
                Email = email,
                UserName = email,
                EmailConfirmed = true
            };

            var createResult = await _userManager.CreateAsync(user, password);
            if (!createResult.Succeeded)
            {
                var errors = string.Join("; ", createResult.Errors.Select(error => error.Description));
                throw new InvalidOperationException($"Failed to seed user {email}: {errors}");
            }
        }

        if (!await _userManager.IsInRoleAsync(user, role))
        {
            await _userManager.AddToRoleAsync(user, role);
        }
    }
}
