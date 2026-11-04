package com.sistema.biblioteca.controller;

import com.sistema.biblioteca.DTOs.request.EmprestimoRequest;
import com.sistema.biblioteca.DTOs.response.EmprestimoResponse;
import com.sistema.biblioteca.service.EmprestimoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/emprestimos")
public class EmprestimoController {

    private final EmprestimoService emprestimoService;

    public EmprestimoController(EmprestimoService emprestimoService) {
        this.emprestimoService = emprestimoService;
    }

    @PostMapping
    public ResponseEntity<EmprestimoResponse> criarEmprestimo(@RequestBody @Valid EmprestimoRequest request) {
        EmprestimoResponse emprestimoResponse = emprestimoService.criarEmprestimo(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(emprestimoResponse);
    }

    @GetMapping
    public ResponseEntity<List<EmprestimoResponse>> listarEmprestimos() {
        return ResponseEntity.ok(emprestimoService.listarEmprestimos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmprestimoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(emprestimoService.buscarPorId(id));
    }

    @PatchMapping("/{id}/devolucao")
    public ResponseEntity<EmprestimoResponse> registrarDevolucao(@PathVariable Long id) {
        return ResponseEntity.ok(emprestimoService.registrarDevolucao(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPorId(@PathVariable Long id) {
        emprestimoService.deletarPorId(id);
        return ResponseEntity.noContent().build();
    }
}

