package com.sistema.biblioteca.repository;

import com.sistema.biblioteca.entity.Emprestimo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmprestimoRepository extends JpaRepository<Emprestimo, Long> {

}
