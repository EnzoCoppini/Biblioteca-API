package com.sistema.biblioteca.service;

import com.sistema.biblioteca.DTOs.request.EmprestimoRequest;
import com.sistema.biblioteca.DTOs.response.EmprestimoResponse;
import com.sistema.biblioteca.entity.Emprestimo;
import com.sistema.biblioteca.entity.Livro;
import com.sistema.biblioteca.entity.Usuario;
import com.sistema.biblioteca.entity.enums.StatusEmprestimo;
import com.sistema.biblioteca.exception.EntidadeNaoEncontradaException;
import com.sistema.biblioteca.exception.RegraDeNegocioException;
import com.sistema.biblioteca.mapper.EmprestimoMapper;
import com.sistema.biblioteca.repository.EmprestimoRepository;
import com.sistema.biblioteca.repository.LivroRepository;
import com.sistema.biblioteca.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class EmprestimoService {

    private final EmprestimoRepository emprestimoRepository;
    private final UsuarioRepository usuarioRepository;
    private final LivroRepository livroRepository;
    private final EmprestimoMapper emprestimoMapper;

    public EmprestimoService(EmprestimoRepository emprestimoRepository, EmprestimoMapper emprestimoMapper, LivroRepository livroRepository, UsuarioRepository usuarioRepository){
        this.emprestimoRepository = emprestimoRepository;
        this.emprestimoMapper = emprestimoMapper;
        this.livroRepository = livroRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public EmprestimoResponse criarEmprestimo(EmprestimoRequest request){
        Usuario usuario = usuarioRepository.findById(request.idUsuario())
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Nenhum usuário com o id: " + request.idUsuario() + " foi encontrado"));

        if (!usuario.isAtivo()) {
            throw new RegraDeNegocioException("Usuário está inativo e não pode realizar empréstimos");
        }

        Livro livro = livroRepository.findById(request.idLivro())
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Nenhum livro com o id: " + request.idLivro() + " foi encontrado"));

        if (livro.getQuantidadeDisponivel() == null || livro.getQuantidadeDisponivel() <= 0) {
            throw new RegraDeNegocioException("Não há exemplares disponíveis deste livro para empréstimo");
        }

        livro.setQuantidadeDisponivel(livro.getQuantidadeDisponivel() - 1);
        livroRepository.save(livro);

        Emprestimo emprestimo = emprestimoMapper.toEntity(request, usuario, livro);
        Emprestimo emprestimoSalvo = emprestimoRepository.save(emprestimo);

        return emprestimoMapper.toResponse(emprestimoSalvo);
    }

    public List<EmprestimoResponse> listarEmprestimos(){
        return emprestimoRepository.findAll().stream().map(emprestimoMapper::toResponse).toList();
    }

    public EmprestimoResponse buscarPorId(Long id){
        Emprestimo emprestimo = emprestimoRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Empréstimo com o id: " + id + ", não encontrado"));
        return emprestimoMapper.toResponse(emprestimo);
    }

    @Transactional
    public EmprestimoResponse registrarDevolucao(Long id) {
        Emprestimo emprestimo = emprestimoRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Empréstimo com o id: " + id + " não encontrado"));

        if (emprestimo.getStatus() == StatusEmprestimo.DEVOLVIDO) {
            throw new RegraDeNegocioException("Este empréstimo já foi devolvido anteriormente");
        }

        LocalDate hoje = LocalDate.now();
        emprestimo.setDataDevolucaoReal(hoje);

        if (hoje.isAfter(emprestimo.getDataDevolucaoPrevista())) {
            emprestimo.setStatus(StatusEmprestimo.ATRASADO);
        } else {
            emprestimo.setStatus(StatusEmprestimo.DEVOLVIDO);
        }

        Livro livro = emprestimo.getLivro();
        if (livro != null) {
            int disponivel = (livro.getQuantidadeDisponivel() != null ? livro.getQuantidadeDisponivel() : 0) + 1;
            livro.setQuantidadeDisponivel(Math.min(disponivel, livro.getQuantidadeTotal()));
            livroRepository.save(livro);
        }

        Emprestimo salvo = emprestimoRepository.save(emprestimo);
        return emprestimoMapper.toResponse(salvo);
    }

    @Transactional
    public void deletarPorId(Long id) {
        Emprestimo emprestimo = emprestimoRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Empréstimo com o id: " + id + " não encontrado"));

        if (emprestimo.getStatus() == StatusEmprestimo.EM_ANDAMENTO) {
            Livro livro = emprestimo.getLivro();
            if (livro != null) {
                int disponivel = (livro.getQuantidadeDisponivel() != null ? livro.getQuantidadeDisponivel() : 0) + 1;
                livro.setQuantidadeDisponivel(Math.min(disponivel, livro.getQuantidadeTotal()));
                livroRepository.save(livro);
            }
        }

        emprestimoRepository.deleteById(id);
    }
}
