package com.sistema.biblioteca.repository;

import com.sistema.biblioteca.entity.Livro;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LivroRepository extends JpaRepository<Livro, Long> {
}
