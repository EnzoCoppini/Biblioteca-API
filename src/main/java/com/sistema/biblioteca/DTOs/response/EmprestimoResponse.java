package com.sistema.biblioteca.DTOs.response;

import com.sistema.biblioteca.entity.enums.StatusEmprestimo;

import java.time.LocalDate;

public record EmprestimoResponse(
        Long idEmprestimo,
        LocalDate dataEmprestimo,
        LocalDate dataDevolucaoPrevista,
        LocalDate dataDevolucaoReal,
        StatusEmprestimo status,
        Long idUsuario,
        String nomeUsuario,
        String emailUsuario,
        Long idLivro,
        String tituloLivro,
        String autorLivro
) {
}
