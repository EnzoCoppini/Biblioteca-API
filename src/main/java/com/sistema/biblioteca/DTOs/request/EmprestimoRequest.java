package com.sistema.biblioteca.DTOs.request;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record EmprestimoRequest(
        @NotNull(message = "Id do usuario é obrigatório")
        Long idUsuario,

        @NotNull(message = "Id do livro é obrigatório")
        Long idLivro,

        @NotNull(message = "Data devolução prevista é obrigatório")
        LocalDate dataDevolucaoPrevista
) {
}
