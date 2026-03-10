package com.sistema.biblioteca.DTOs.response;

public record UsuarioResponse(
        Long idusuario,
        String nomeUsuario,
        String emailUsuario,
        String telefoneUsuario,
        Boolean ativo
) {
}
