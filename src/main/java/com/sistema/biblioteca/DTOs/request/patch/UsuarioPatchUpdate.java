package com.sistema.biblioteca.DTOs.request.patch;

import jakarta.validation.constraints.Email;
import org.hibernate.validator.constraints.Length;

public record UsuarioPatchUpdate(
       @Length(min = 3, max = 100)
       String nomeUsuario,
       @Email(message = "email Invalido")
       String emailUsuario,
       String telefoneUsuario,
       Boolean ativo
) {
}
