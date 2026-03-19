package com.sistema.biblioteca.service;

import com.sistema.biblioteca.DTOs.request.UsuarioRequest;
import com.sistema.biblioteca.DTOs.request.patch.UsuarioPatchUpdate;
import com.sistema.biblioteca.DTOs.response.UsuarioResponse;
import com.sistema.biblioteca.entity.Usuario;
import com.sistema.biblioteca.exception.EntidadeNaoEncontradaException;
import com.sistema.biblioteca.mapper.UsuarioMapper;
import com.sistema.biblioteca.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;

    public UsuarioService(UsuarioRepository usuarioRepository, UsuarioMapper usuarioMapper){
        this.usuarioRepository = usuarioRepository;
        this.usuarioMapper = usuarioMapper;
    }

    public List<UsuarioResponse> listarUsuarios(){
        return usuarioRepository.findAll().stream().map(usuarioMapper::toResponse).toList();
    }

    public UsuarioResponse buscarPorId(Long id){
        Usuario usuario = usuarioRepository.findById(id).orElseThrow(()-> new EntidadeNaoEncontradaException("Usuario não encontrado"));
        return usuarioMapper.toResponse(usuario);
    }

    public UsuarioResponse criarUsuario(UsuarioRequest usuarioRequest){
        Usuario usuario = usuarioMapper.toEntity(usuarioRequest);
        Usuario usuarioSalvo = usuarioRepository.save(usuario);
        return usuarioMapper.toResponse(usuarioSalvo);
    }


    public void deletarPorId(Long id){
        Usuario usuario = usuarioRepository.findById(id).orElseThrow(()-> new EntidadeNaoEncontradaException("Usuario não encontrado"));
        usuarioRepository.deleteById(id);
    }

    public UsuarioResponse atualizarParcialmente(Long id, UsuarioPatchUpdate update){
        Usuario usuario = usuarioRepository.findById(id).orElseThrow(() -> new EntidadeNaoEncontradaException("Usuario não encontrado"));
        usuarioMapper.updateEntityFromPatch(update,usuario);
        Usuario usuarioAtualizado = usuarioRepository.save(usuario);
        return usuarioMapper.toResponse(usuarioAtualizado);
    }

    public UsuarioResponse atualizarPorCompleto(Long id, UsuarioRequest request){
        Usuario usuario = usuarioRepository.findById(id).orElseThrow(() -> new EntidadeNaoEncontradaException("Usuario não encontrado"));
        usuarioMapper.updateEntityFromDto(request, usuario);
        Usuario usuarioAtualizado = usuarioRepository.save(usuario);
        return usuarioMapper.toResponse(usuarioAtualizado);
    }

}
