package com.sistema.biblioteca.DTOs.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record LivroUpdateRequest(
        @NotBlank(message = "Titulo é obrigatório")
        String titulo,

        @NotBlank(message = "Autor é obrogatório")
        String autor,

        @NotBlank(message = "Gênero é obrigatório")
        String genero,

        @NotNull(message = "Ano de publicação é obrigatório")
        @Positive(message = "ano de publicação deve ser maior que zero")
        Integer anoPublicacao,

        @NotNull(message = "Quantidade total é obrigatória")
        @Positive(message = "Quantidade total deve ser maior que zero")
        Integer quantidadeTotal
) {
}
