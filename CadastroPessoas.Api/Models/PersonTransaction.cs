namespace CadastroPessoas.Api.Models;

public enum TransactionType
{
    Despesa,
    Receita
}

public class PersonTransaction
{
    public Guid Id { get; set; }
    public Guid PersonId { get; set; }
    public Guid CategoryId { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime CreatedAt { get; set; }
    public TransactionType Type { get; set; }

    public Person Person { get; set; } = null!;
    public Category Category { get; set; } = null!;
}
