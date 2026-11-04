package com.sistema.biblioteca.config;

import com.sistema.biblioteca.entity.Emprestimo;
import com.sistema.biblioteca.entity.Livro;
import com.sistema.biblioteca.entity.Usuario;
import com.sistema.biblioteca.entity.enums.StatusEmprestimo;
import com.sistema.biblioteca.repository.EmprestimoRepository;
import com.sistema.biblioteca.repository.LivroRepository;
import com.sistema.biblioteca.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final LivroRepository livroRepository;
    private final EmprestimoRepository emprestimoRepository;

    public DataInitializer(UsuarioRepository usuarioRepository, LivroRepository livroRepository, EmprestimoRepository emprestimoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.livroRepository = livroRepository;
        this.emprestimoRepository = emprestimoRepository;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() == 0 && livroRepository.count() == 0) {
            Usuario u1 = new Usuario(null, "Ana Maria Silva", "ana.silva@email.com", "(11) 98765-4321", true, null);
            Usuario u2 = new Usuario(null, "Carlos Eduardo Pereira", "carlos.pereira@email.com", "(21) 99876-5432", true, null);
            Usuario u3 = new Usuario(null, "Beatriz Souza Oliveira", "beatriz.souza@email.com", "(31) 97654-3210", true, null);
            Usuario u4 = new Usuario(null, "Lucas Mendes Lima", "lucas.mendes@email.com", "(41) 98888-7777", false, null);
            usuarioRepository.saveAll(List.of(u1, u2, u3, u4));

            Livro l1 = new Livro(null, "Dom Casmurro", "Machado de Assis", "Romance", 1899, "978-8535914849", 5, 4, null);
            Livro l2 = new Livro(null, "1984", "George Orwell", "Ficção Científica", 1949, "978-8535902778", 4, 3, null);
            Livro l3 = new Livro(null, "O Pequeno Príncipe", "Antoine de Saint-Exupéry", "Infantil", 1943, "978-8522031481", 6, 6, null);
            Livro l4 = new Livro(null, "Clean Code", "Robert C. Martin", "Tecnologia", 2008, "978-0132350884", 3, 2, null);
            Livro l5 = new Livro(null, "O Senhor dos Anéis: A Sociedade do Anel", "J.R.R. Tolkien", "Fantasia", 1954, "978-8595084759", 5, 5, null);
            livroRepository.saveAll(List.of(l1, l2, l3, l4, l5));

            Emprestimo e1 = new Emprestimo(null, LocalDate.now().minusDays(5), LocalDate.now().plusDays(10), null, StatusEmprestimo.EM_ANDAMENTO, u1, l1);
            Emprestimo e2 = new Emprestimo(null, LocalDate.now().minusDays(15), LocalDate.now().minusDays(1), null, StatusEmprestimo.ATRASADO, u2, l2);
            Emprestimo e3 = new Emprestimo(null, LocalDate.now().minusDays(20), LocalDate.now().minusDays(5), LocalDate.now().minusDays(6), StatusEmprestimo.DEVOLVIDO, u3, l4);
            emprestimoRepository.saveAll(List.of(e1, e2, e3));
        }
    }
}

