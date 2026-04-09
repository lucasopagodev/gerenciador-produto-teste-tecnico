using GerenciadorProduto.API.Extensions;
using GerenciadorProduto.Application.DTOs.Products;
using GerenciadorProduto.Application.Interfaces;
using GerenciadorProduto.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GerenciadorProduto.API.Controllers;

[ApiController]
[Route("products")]
[Authorize]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly IFileStorageService _fileStorageService;

    public ProductsController(IProductService productService, IFileStorageService fileStorageService)
    {
        _productService = productService;
        _fileStorageService = fileStorageService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyCollection<ProductResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyCollection<ProductResponse>>> GetProducts([FromQuery] ProductListQuery query, CancellationToken cancellationToken)
    {
        var userId = User.GetRequiredUserId();
        var isManager = User.IsInRole(RoleNames.Manager);
        var baseUrl = $"{Request.Scheme}://{Request.Host}";

        var response = await _productService.GetProductsAsync(userId, isManager, query, baseUrl, cancellationToken);
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ProductResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<ProductResponse>> GetProductById(Guid id, CancellationToken cancellationToken)
    {
        var userId = User.GetRequiredUserId();
        var isManager = User.IsInRole(RoleNames.Manager);
        var baseUrl = $"{Request.Scheme}://{Request.Host}";

        var response = await _productService.GetProductByIdAsync(id, userId, isManager, baseUrl, cancellationToken);
        return Ok(response);
    }

    [HttpPost]
    [Authorize(Roles = RoleNames.Manager)]
    [ProducesResponseType(typeof(ProductResponse), StatusCodes.Status201Created)]
    public async Task<ActionResult<ProductResponse>> CreateProduct([FromBody] CreateProductRequest request, CancellationToken cancellationToken)
    {
        var userId = User.GetRequiredUserId();
        var baseUrl = $"{Request.Scheme}://{Request.Host}";

        var response = await _productService.CreateProductAsync(userId, request, baseUrl, cancellationToken);
        return CreatedAtAction(nameof(GetProductById), new { id = response.Id }, response);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = RoleNames.Manager)]
    [ProducesResponseType(typeof(ProductResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<ProductResponse>> UpdateProduct(Guid id, [FromBody] UpdateProductRequest request, CancellationToken cancellationToken)
    {
        var userId = User.GetRequiredUserId();
        var baseUrl = $"{Request.Scheme}://{Request.Host}";

        var response = await _productService.UpdateProductAsync(id, userId, request, baseUrl, cancellationToken);
        return Ok(response);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = RoleNames.Manager)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteProduct(Guid id, CancellationToken cancellationToken)
    {
        var userId = User.GetRequiredUserId();
        await _productService.DeleteProductAsync(id, userId, cancellationToken);
        return NoContent();
    }

    [HttpPost("upload")]
    [Authorize(Roles = RoleNames.Manager)]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(UploadProductImageResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<UploadProductImageResponse>> Upload([FromForm] UploadProductImageRequest request, CancellationToken cancellationToken)
    {
        var imagePath = await _fileStorageService.SaveProductImageAsync(request.File, cancellationToken);
        var baseUrl = $"{Request.Scheme}://{Request.Host}";

        return Ok(new UploadProductImageResponse
        {
            ImagePath = imagePath,
            ImageUrl = $"{baseUrl}/{imagePath}"
        });
    }
}
