using GerenciadorProduto.Application.DTOs.Auth;

namespace GerenciadorProduto.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default);
    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
    Task<UserResponse> UpdateProfileAsync(string userId, UpdateProfileRequest request, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<UserResponse>> GetUsersAsync(CancellationToken cancellationToken = default);
    Task<UserResponse> UpdateUserRoleAsync(string currentUserId, string userId, UpdateUserRoleRequest request, CancellationToken cancellationToken = default);
}
