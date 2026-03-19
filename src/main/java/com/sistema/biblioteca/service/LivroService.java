package com.sistema.biblioteca.service;


import com.sistema.biblioteca.DTOs.request.LivroRequest;
import com.sistema.biblioteca.DTOs.request.LivroUpdateRequest;
import com.sistema.biblioteca.DTOs.request.patch.LivroPatchRequest;
import com.sistema.biblioteca.DTOs.response.LivroResponse;
import com.sistema.biblioteca.entity.Livro;
import com.sistema.biblioteca.exception.EntidadeNaoEncontradaException;
import com.sistema.biblioteca.exception.RegraDeNegocioException;
import com.sistema.biblioteca.mapper.LivroMapper;
import com.sistema.biblioteca.repository.LivroRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LivroService {

    private final LivroRepository livroRepository;
    private final LivroMapper livroMapper;

    public LivroService(LivroRepository livroRepository, LivroMapper livroMapper){
        this.livroRepository =livroRepository;
        this.livroMapper = livroMapper;
    }

    public List<LivroResponse> listarLivros(){
        return livroRepository.findAll().stream().map(livroMapper::toResponse).toList();
    }

    public LivroResponse buscarPorId(Long id){
        Livro livro = livroRepository.findById(id).orElseThrow(()-> new EntidadeNaoEncontradaException("Livro com o id: " + id + " não encontrado"));
        return livroMapper.toResponse(livro);
    }

    public LivroResponse buscarPorTitulo(String titulo){
        Livro livro = livroRepository.findByTituloIgnoreCase(titulo).orElseThrow(()-> new EntidadeNaoEncontradaException("Livro com o titulo: " + titulo +" , não encontrado"));
        return livroMapper.toResponse(livro);
    }

    public LivroResponse adicionarLivro(LivroRequest livroRequest){

        if (livroRepository.existsByTituloIgnoreCase(livroRequest.titulo())){
            throw new RegraDeNegocioException("Titulo ja foi cadastrado");
        }

        if (livroRepository.existsByIsbn(livroRequest.isbn())){
            throw new RegraDeNegocioException("Já existe um livro cadastrado com esse ISBN");
        }

        Livro livro = livroMapper.toEntity(livroRequest);
        Livro livroSalvo = livroRepository.save(livro);
        return livroMapper.toResponse(livroSalvo);
    }

    public void deletarPorId(Long id){
        Livro livro = livroRepository.findById(id).orElseThrow(()-> new EntidadeNaoEncontradaException("Livro com o id: " + id + " não encontrado."));
        livroRepository.deleteById(id);
    }

    public LivroResponse atualizarParcialmente(Long id, LivroPatchRequest request){
        Livro livro = livroRepository.findById(id).orElseThrow(()-> new EntidadeNaoEncontradaException("Livro com o id: " + id + " não encontrado."));

        if (request.quantidadeTotal() != null){
        int emprestados = livro.getQuantidadeTotal() - livro.getQuantidadeDisponivel();

        if (request.quantidadeTotal() < emprestados){
            throw new RegraDeNegocioException("A quantidade total não pode ser maior do que a quantidade de livros emprestados");
        }

        livro.setQuantidadeTotal(request.quantidadeTotal());
        livro.setQuantidadeDisponivel(request.quantidadeTotal() - emprestados);
        }

        livroMapper.updateEntityFromPatch(request,livro);
        Livro livroAtualizado = livroRepository.save(livro);
        return livroMapper.toResponse(livroAtualizado);
    }

    public LivroResponse atualizarPorCompleto(Long id, LivroUpdateRequest request){
        Livro livro = livroRepository.findById(id).orElseThrow(() -> new EntidadeNaoEncontradaException("Livro com o id: " + id + " não encontrado."));

        if (request.quantidadeTotal() != null){
            int emprestados = livro.getQuantidadeTotal() - livro.getQuantidadeDisponivel();

            if (request.quantidadeTotal() < emprestados){
                throw new RegraDeNegocioException("A quantidade total não pode ser maior do que a quantidade de livros emprestados");
            }

            livro.setQuantidadeTotal(request.quantidadeTotal());
            livro.setQuantidadeDisponivel(request.quantidadeTotal() - emprestados);
        }

        livroMapper.updateEntityFromDto(request, livro);
        Livro livroAtualizado = livroRepository.save(livro);
        return livroMapper.toResponse(livroAtualizado);
    }


}
