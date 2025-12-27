namespace CadastroPessoas.Api.Dtos;

public record CategoryResponseDto
{
    public Guid Id { get; init; }
    public string Description { get; init; } = string.Empty;
    public string Purpose { get; init; } = string.Empty;
}
