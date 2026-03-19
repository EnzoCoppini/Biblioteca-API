package com.sistema.biblioteca.repository;

import com.sistema.biblioteca.entity.Livro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LivroRepository extends JpaRepository<Livro, Long> {

    boolean existsByTituloIgnoreCase(String titulo);
    boolean existsByIsbn(String isbn);
    Optional<Livro> findByTituloIgnoreCase(String titulo);

}
