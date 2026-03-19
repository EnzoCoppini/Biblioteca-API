package com.sistema.biblioteca.controller;

import com.sistema.biblioteca.DTOs.request.LivroRequest;
import com.sistema.biblioteca.DTOs.request.LivroUpdateRequest;
import com.sistema.biblioteca.DTOs.request.patch.LivroPatchRequest;
import com.sistema.biblioteca.DTOs.response.LivroResponse;
import com.sistema.biblioteca.service.LivroService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/livros")
public class LivroController {

    private final LivroService livroService;

    public LivroController(LivroService livroService){
        this.livroService = livroService;
    }


    @PostMapping
    public ResponseEntity<LivroResponse> adicionarLivro(@RequestBody @Valid LivroRequest request){
        LivroResponse livroResponse = livroService.adicionarLivro(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(livroResponse);
    }

    @GetMapping
    public ResponseEntity<List<LivroResponse>> listarLivros(){
        return ResponseEntity.ok(livroService.listarLivros());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LivroResponse> buscarLivroPorId(@PathVariable Long id){
        return ResponseEntity.ok(livroService.buscarPorId(id));
    }

    @GetMapping("/titulo/{titulo}")
    public ResponseEntity<LivroResponse> buscarLivroPorTitulo(@PathVariable String titulo){
        return ResponseEntity.ok(livroService.buscarPorTitulo(titulo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarlivroPorId(@PathVariable Long id){
        livroService.deletarPorId(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<LivroResponse> atualizarParcialmente(@PathVariable Long id, @RequestBody @Valid LivroPatchRequest patchRequest){
        return ResponseEntity.ok(livroService.atualizarParcialmente(id,patchRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LivroResponse> atualizarLivro(@PathVariable Long id, @RequestBody @Valid LivroUpdateRequest updateRequest){
        return ResponseEntity.ok(livroService.atualizarPorCompleto(id, updateRequest));

    }
}
