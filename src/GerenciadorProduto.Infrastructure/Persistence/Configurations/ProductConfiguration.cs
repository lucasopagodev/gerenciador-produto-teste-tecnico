using GerenciadorProduto.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GerenciadorProduto.Infrastructure.Persistence.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products");

        builder.HasKey(product => product.Id);

        builder.Property(product => product.Name)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(product => product.Description)
            .HasMaxLength(1000);

        builder.Property(product => product.Price)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        builder.Property(product => product.ImagePath)
            .HasMaxLength(500);

        builder.Property(product => product.CreatedAt)
            .IsRequired();

        builder.Property(product => product.UserId)
            .IsRequired();

        builder.HasIndex(product => product.CreatedAt);
        builder.HasIndex(product => product.Price);

        builder.HasOne(product => product.User)
            .WithMany(user => user.Products)
            .HasForeignKey(product => product.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
