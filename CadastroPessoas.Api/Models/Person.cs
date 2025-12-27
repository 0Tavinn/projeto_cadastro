namespace CadastroPessoas.Api.Models;

public class Person
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Age { get; set; }

    public List<PersonTransaction> Transactions { get; set; } = new();
}
