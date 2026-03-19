package com.sistema.biblioteca.mapper;

import com.sistema.biblioteca.DTOs.request.patch.LivroPatchRequest;
import com.sistema.biblioteca.DTOs.request.LivroRequest;
import com.sistema.biblioteca.DTOs.request.LivroUpdateRequest;
import com.sistema.biblioteca.DTOs.response.LivroResponse;
import com.sistema.biblioteca.entity.Livro;
import org.springframework.stereotype.Component;

@Component
public class LivroMapper {

    public Livro toEntity(LivroRequest request){
        Livro livro = new Livro();
        livro.setTitulo(request.titulo());
        livro.setAutor(request.autor());
        livro.setGenero(request.genero());
        livro.setAnoPublicacao(request.anoPublicacao());
        livro.setIsbn(request.isbn());
        livro.setQuantidadeTotal(request.quantidadeTotal());
        livro.setQuantidadeDisponivel(request.quantidadeTotal());
        return livro;
    }

    public LivroResponse toResponse(Livro livro){
        return new LivroResponse(
                livro.getIdLivro(),
                livro.getTitulo(),
                livro.getAutor(),
                livro.getGenero(),
                livro.getAnoPublicacao(),
                livro.getIsbn(),
                livro.getQuantidadeTotal(),
                livro.getQuantidadeDisponivel()
        );
    }

    public void updateEntityFromPatch(LivroPatchRequest request, Livro livro) {
        if (request.titulo() != null) {
            livro.setTitulo(request.titulo());
        }
        if (request.autor() != null) {
            livro.setAutor(request.autor());
        }
        if (request.genero() != null) {
            livro.setGenero(request.genero());
        }
        if (request.anoPublicacao() != null) {
            livro.setAnoPublicacao(request.anoPublicacao());
        }
    }

    public void updateEntityFromDto(LivroUpdateRequest request, Livro livro) {
        livro.setTitulo(request.titulo());
        livro.setAutor(request.autor());
        livro.setGenero(request.genero());
        livro.setAnoPublicacao(request.anoPublicacao());
        livro.setQuantidadeTotal(request.quantidadeTotal());
    }
}

