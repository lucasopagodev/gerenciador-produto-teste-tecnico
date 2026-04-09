using GerenciadorProduto.Application.DTOs.Auth;
using GerenciadorProduto.Application.Exceptions;
using GerenciadorProduto.Application.Interfaces;
using GerenciadorProduto.Domain.Constants;
using GerenciadorProduto.Domain.Identity;
using GerenciadorProduto.Infrastructure.Authentication;
using GerenciadorProduto.Infrastructure.Time;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace GerenciadorProduto.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly JwtTokenGenerator _jwtTokenGenerator;

    public AuthService(UserManager<ApplicationUser> userManager, JwtTokenGenerator jwtTokenGenerator)
    {
        _userManager = userManager;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default)
    {
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser is not null)
        {
            throw new ConflictException("Email is already registered.");
        }

        var user = new ApplicationUser
        {
            FullName = request.FullName.Trim(),
            Email = request.Email.Trim(),
            UserName = request.Email.Trim(),
            EmailConfirmed = true
        };

        var createResult = await _userManager.CreateAsync(user, request.Password);
        if (!createResult.Succeeded)
        {
            var errors = string.Join("; ", createResult.Errors.Select(error => error.Description));
            throw new ValidationException(errors);
        }

        var roleResult = await _userManager.AddToRoleAsync(user, RoleNames.User);
        if (!roleResult.Succeeded)
        {
            var errors = string.Join("; ", roleResult.Errors.Select(error => error.Description));
            throw new ValidationException(errors);
        }

        return await BuildAuthResponseAsync(user);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user is null)
        {
            throw new ValidationException("Invalid email or password.");
        }

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, request.Password);
        if (!isPasswordValid)
        {
            throw new ValidationException("Invalid email or password.");
        }

        return await BuildAuthResponseAsync(user);
    }

    public async Task<UserResponse> UpdateProfileAsync(string userId, UpdateProfileRequest request, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user is null)
        {
            throw new NotFoundException("User not found.");
        }

        var existingUser = await _userManager.FindByEmailAsync(request.Email.Trim());
        if (existingUser is not null && existingUser.Id != user.Id)
        {
            throw new ConflictException("Email is already registered.");
        }

        user.FullName = request.FullName.Trim();
        user.Email = request.Email.Trim();
        user.UserName = request.Email.Trim();

        var updateResult = await _userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
        {
            var errors = string.Join("; ", updateResult.Errors.Select(error => error.Description));
            throw new ValidationException(errors);
        }

        var currentRoles = await _userManager.GetRolesAsync(user);

        return new UserResponse
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email ?? string.Empty,
            Role = currentRoles.FirstOrDefault() ?? RoleNames.User
        };
    }

    public async Task<IReadOnlyList<UserResponse>> GetUsersAsync(CancellationToken cancellationToken = default)
    {
        var users = await _userManager.Users
            .OrderBy(user => user.FullName)
            .ThenBy(user => user.Email)
            .ToListAsync(cancellationToken);

        var responses = new List<UserResponse>(users.Count);

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            responses.Add(new UserResponse
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email ?? string.Empty,
                Role = roles.FirstOrDefault() ?? RoleNames.User
            });
        }

        return responses;
    }

    public async Task<UserResponse> UpdateUserRoleAsync(string currentUserId, string userId, UpdateUserRoleRequest request, CancellationToken cancellationToken = default)
    {
        if (string.Equals(currentUserId, userId, StringComparison.Ordinal))
        {
            throw new ForbiddenException("You cannot change your own role.");
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user is null)
        {
            throw new NotFoundException("User not found.");
        }

        var targetRole = request.Role.Trim();
        if (!RoleNames.All.Contains(targetRole))
        {
            throw new ValidationException("Role must be Manager or User.");
        }

        var currentRoles = await _userManager.GetRolesAsync(user);
        var currentRole = currentRoles.FirstOrDefault() ?? RoleNames.User;
        if (string.Equals(currentRole, targetRole, StringComparison.Ordinal))
        {
            return new UserResponse
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email ?? string.Empty,
                Role = currentRole
            };
        }

        if (currentRoles.Count > 0)
        {
            var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
            if (!removeResult.Succeeded)
            {
                var errors = string.Join("; ", removeResult.Errors.Select(error => error.Description));
                throw new ValidationException(errors);
            }
        }

        var addRoleResult = await _userManager.AddToRoleAsync(user, targetRole);
        if (!addRoleResult.Succeeded)
        {
            var errors = string.Join("; ", addRoleResult.Errors.Select(error => error.Description));
            throw new ValidationException(errors);
        }

        return new UserResponse
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email ?? string.Empty,
            Role = targetRole
        };
    }

    private async Task<AuthResponse> BuildAuthResponseAsync(ApplicationUser user)
    {
        var roles = await _userManager.GetRolesAsync(user);
        var (token, expiresAtUtc) = _jwtTokenGenerator.GenerateToken(user, roles);

        return new AuthResponse
        {
            Token = token,
            ExpiresAt = BrazilDateTime.ToSaoPaulo(expiresAtUtc),
            User = new UserResponse
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email ?? string.Empty,
                Role = roles.FirstOrDefault() ?? RoleNames.User
            }
        };
    }
}
