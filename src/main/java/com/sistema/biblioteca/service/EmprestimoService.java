package com.sistema.biblioteca.service;

import com.sistema.biblioteca.DTOs.request.EmprestimoRequest;
import com.sistema.biblioteca.DTOs.response.EmprestimoResponse;
import com.sistema.biblioteca.entity.Emprestimo;
import com.sistema.biblioteca.entity.Livro;
import com.sistema.biblioteca.entity.Usuario;
import com.sistema.biblioteca.exception.EntidadeNaoEncontradaException;
import com.sistema.biblioteca.mapper.EmprestimoMapper;
import com.sistema.biblioteca.repository.EmprestimoRepository;
import com.sistema.biblioteca.repository.LivroRepository;
import com.sistema.biblioteca.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmprestimoService {

    private final EmprestimoRepository emprestimoRepository;
    private final UsuarioRepository usuarioRepository;
    private final LivroRepository livroRepository;
    private final EmprestimoMapper emprestimoMapper;

    public EmprestimoService(EmprestimoRepository emprestimoRepository, EmprestimoMapper emprestimoMapper, LivroRepository livroRepository,UsuarioRepository usuarioRepository){
        this.emprestimoRepository = emprestimoRepository;
        this.emprestimoMapper = emprestimoMapper;
        this.livroRepository = livroRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public EmprestimoResponse criarEmprestimo(EmprestimoRequest request){

        Usuario usuario = usuarioRepository.findById(request.idUsuario()).orElseThrow(() -> new EntidadeNaoEncontradaException("Nenhum usuário com o id: " + request.idUsuario() + " foi encontrado"));

        Livro livro = livroRepository.findById(request.idLivro()).orElseThrow(() -> new EntidadeNaoEncontradaException("Nenhum livro com o id: " + request.idLivro() + " foi encontrado"));

        Emprestimo emprestimo = emprestimoMapper.toEntity(request, usuario, livro);
        Emprestimo emprestimoSalvo = emprestimoRepository.save(emprestimo);

        return emprestimoMapper.toResponse(emprestimoSalvo);
    }

    public List<EmprestimoResponse> listarEmprestimos(){
        return emprestimoRepository.findAll().stream().map(emprestimoMapper::toResponse).toList();
    }

    public EmprestimoResponse buscarPorId(Long id){
        Emprestimo emprestimo = emprestimoRepository.findById(id).orElseThrow(()-> new EntidadeNaoEncontradaException("Emprestimo com o id: " + id + ", não econtrado"));
        return emprestimoMapper.toResponse(emprestimo);
    }




}
