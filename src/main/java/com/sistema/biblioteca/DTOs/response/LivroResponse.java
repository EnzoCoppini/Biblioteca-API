package com.sistema.biblioteca.DTOs.response;

public record LivroResponse(
        Long idLivro,
        String titulo,
        String autor,
        String genero,
        Integer anoPublicacao,
        String isbn,
        Integer quantidadeTotal,
        Integer quantidadeDisponivel
) {
}
