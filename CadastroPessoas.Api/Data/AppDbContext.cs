using CadastroPessoas.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CadastroPessoas.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Person> People => Set<Person>();
    public DbSet<PersonTransaction> Transactions => Set<PersonTransaction>();
    public DbSet<Category> Categories => Set<Category>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var person = modelBuilder.Entity<Person>();
        person.HasKey(p => p.Id);
        person.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(200);
        person.Property(p => p.Age)
            .IsRequired();
        person.ToTable(t =>
            t.HasCheckConstraint("CK_Person_Age_Positive", "\"Age\" > 0"));

        var transaction = modelBuilder.Entity<PersonTransaction>();
        transaction.HasKey(t => t.Id);
        transaction.Property(t => t.Description)
            .IsRequired()
            .HasMaxLength(300);
        transaction.Property(t => t.Amount)
            .HasPrecision(18, 2)
            .IsRequired();
        transaction.Property(t => t.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .IsRequired();
        transaction.Property(t => t.Type)
            .HasConversion<string>()
            .IsRequired();
        transaction.ToTable(t =>
            t.HasCheckConstraint(
                "CK_Transaction_Type_Allowed",
                "\"Type\" IN ('Despesa','Receita')"));

        transaction.HasOne(t => t.Person)
            .WithMany(p => p.Transactions)
            .HasForeignKey(t => t.PersonId)
            .OnDelete(DeleteBehavior.Cascade);

        transaction.HasOne(t => t.Category)
            .WithMany()
            .HasForeignKey(t => t.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        var category = modelBuilder.Entity<Category>();
        category.HasKey(c => c.Id);
        category.Property(c => c.Description)
            .IsRequired()
            .HasMaxLength(200);
        category.Property(c => c.Purpose)
            .HasConversion<string>()
            .IsRequired();
        category.ToTable(t =>
            t.HasCheckConstraint(
                "CK_Category_Purpose_Allowed",
                "\"Purpose\" IN ('Despesa','Receita','Ambas')"));
    }
}
