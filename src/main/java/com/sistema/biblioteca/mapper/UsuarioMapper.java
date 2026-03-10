package com.sistema.biblioteca.mapper;

import com.sistema.biblioteca.DTOs.request.UsuarioRequest;
import com.sistema.biblioteca.DTOs.request.UsuarioUpdateRequest;
import com.sistema.biblioteca.DTOs.response.UsuarioResponse;
import com.sistema.biblioteca.entity.Usuario;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    public Usuario toEntity(UsuarioRequest usuarioRequest){
        Usuario usuario = new Usuario();
        usuario.setNomeUsuario(usuarioRequest.nomeUsuario());
        usuario.setEmailUsuario(usuarioRequest.emailUsuario());
        usuario.setTelefoneUsuario(usuarioRequest.telefoneUsuario());
        usuario.setAtivo(usuarioRequest.ativo());
        return usuario;
    }

    public UsuarioResponse toResponse(Usuario usuario){
        return new UsuarioResponse(
                usuario.getIdUsuario(),
                usuario.getNomeUsuario(),
                usuario.getEmailUsuario(),
                usuario.getEmailUsuario(),
                usuario.isAtivo()
        );
    }

    public void updateEntityFromPatch(UsuarioRequest request, Usuario usuario){
        if (request.nomeUsuario() != null){
            usuario.setNomeUsuario(request.nomeUsuario());
        }
        if (request.emailUsuario() != null){
            usuario.setEmailUsuario(request.emailUsuario());
        }
        if (request.telefoneUsuario() != null){
            usuario.setTelefoneUsuario(request.telefoneUsuario());
        }
        if (request.ativo() != null){
            usuario.setAtivo(request.ativo());
        }
    }

    public void updateEntityFromDto(UsuarioUpdateRequest updateRequest, Usuario usuario){
        usuario.setNomeUsuario(updateRequest.nomeUsuario());
        usuario.setEmailUsuario(updateRequest.emailUsuario());
        usuario.setTelefoneUsuario(updateRequest.telefoneUsuario());
        usuario.setAtivo(updateRequest.ativo());
    }

}
