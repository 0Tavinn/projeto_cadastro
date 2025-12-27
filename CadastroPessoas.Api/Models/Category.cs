namespace CadastroPessoas.Api.Models;

public enum CategoryPurpose
{
    Despesa,
    Receita,
    Ambas
}

public class Category
{
    public Guid Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public CategoryPurpose Purpose { get; set; }
}
