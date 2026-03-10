package com.sistema.biblioteca.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Table(name = "livro")
@Entity
public class Livro {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_livro")
    private Long idLivro;

    @Column(length = 100, nullable = false)
    private String titulo;

    @Column(length = 100, nullable = false)
    private String autor;

    @Column(length = 50, nullable = false)
    private String genero;

    @Column(name = "ano_publicacao", nullable = false)
    private Integer anoPublicacao;

    @Column(unique = true, nullable = false)
    private String isbn;

    @Column(name = "quantidade_total", nullable = false)
    private Integer quantidadeTotal;

    @Column(name = "quantidade_disponivel", nullable = false)
    private Integer quantidadeDisponivel;

    @OneToMany(mappedBy = "livro")
    private List<Emprestimo> emprestimos;


}
