package com.sistema.biblioteca.DTOs.request.patch;

import jakarta.validation.constraints.Positive;

public record LivroPatchRequest(
        String titulo,
        String autor,
        String genero,
        @Positive(message = "ano de publicação deve ser maior que zero")
        Integer anoPublicacao,
        @Positive(message = "Quantidade total deve ser maior que zero")
        Integer quantidadeTotal
) {
}
