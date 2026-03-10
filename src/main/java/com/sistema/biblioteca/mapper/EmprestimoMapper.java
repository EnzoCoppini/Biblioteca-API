package com.sistema.biblioteca.mapper;

import com.sistema.biblioteca.DTOs.request.EmprestimoRequest;
import com.sistema.biblioteca.DTOs.response.EmprestimoResponse;
import com.sistema.biblioteca.entity.Emprestimo;
import com.sistema.biblioteca.entity.Livro;
import com.sistema.biblioteca.entity.Usuario;
import com.sistema.biblioteca.entity.enums.StatusEmprestimo;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class EmprestimoMapper {

    public Emprestimo toEntity(EmprestimoRequest emprestimoRequest, Usuario usuario, Livro livro){
        Emprestimo emprestimo = new Emprestimo();
        emprestimo.setUsuario(usuario);
        emprestimo.setLivro(livro);
        emprestimo.setDataEmprestimo(LocalDate.now());
        emprestimo.setDataDevolucaoPrevista(emprestimoRequest.dataDevolucaoPrevista());
        emprestimo.setDataDevolucaoReal(null);
        emprestimo.setStatus(StatusEmprestimo.EM_ANDAMENTO);
        return emprestimo;
    }

    public EmprestimoResponse toResponse(Emprestimo emprestimo){
        return new EmprestimoResponse(
                emprestimo.getIdEmprestimo(),
                emprestimo.getDataEmprestimo(),
                emprestimo.getDataDevolucaoPrevista(),
                emprestimo.getDataDevolucaoReal(),
                emprestimo.getStatus(),
                emprestimo.getUsuario().getIdUsuario(),
                emprestimo.getUsuario().getNomeUsuario(),
                emprestimo.getUsuario().getEmailUsuario(),
                emprestimo.getLivro().getIdLivro(),
                emprestimo.getLivro().getTitulo(),
                emprestimo.getLivro().getAutor()
        );
    }
}
