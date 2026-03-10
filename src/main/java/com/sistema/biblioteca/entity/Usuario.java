package com.sistema.biblioteca.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Table(name = "usuario")
@Entity
public class Usuario {

    @Column(name = "id_usuario")
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Id
    private Long idUsuario;

    @Column(name = "nome_usuario", nullable = false)
    private String nomeUsuario;

    @Column(name = "email_usuario", nullable = false, unique = true)
    private String emailUsuario;

    @Column(name = "telefone_usuario", nullable = false)
    private String telefoneUsuario;

    @Column(nullable = false)
    private boolean ativo;

    @OneToMany(mappedBy = "usuario")
    private List<Emprestimo> emprestimos;

}
