package com.sistema.biblioteca.DTOs.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record UsuarioUpdateRequest(
        @NotBlank(message = "Usuario é obrigatório")
        @Length(min = 3, max = 100)
        String nomeUsuario,

        @NotBlank(message = "Email é obrigatório")
        @Email(message = "Email invalido")
        String emailUsuario,

        @NotBlank(message = "Telefone é obrigatório")
        String telefoneUsuario,

        @NotNull(message = "O campo não pode ser nulo")
        Boolean ativo
) {
}
