package com.sistema.biblioteca.controller;


import com.sistema.biblioteca.DTOs.request.UsuarioRequest;
import com.sistema.biblioteca.DTOs.request.patch.UsuarioPatchUpdate;
import com.sistema.biblioteca.DTOs.response.UsuarioResponse;
import com.sistema.biblioteca.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService){
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public ResponseEntity<UsuarioResponse> adicionarUsuario(@RequestBody @Valid UsuarioRequest request){
        UsuarioResponse usuarioResponse = usuarioService.criarUsuario(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioResponse);
    }

    @GetMapping
    public ResponseEntity <List<UsuarioResponse>> listarUsuarios(){
        return ResponseEntity.ok(usuarioService.listarUsuarios());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> buscarUsuarioPorId(@PathVariable Long id){
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarUsuarioPorId(@PathVariable Long id){
        usuarioService.deletarPorId(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UsuarioResponse> atualizarParcialmente(@PathVariable Long id, @RequestBody @Valid UsuarioPatchUpdate patchUpdate){
        return ResponseEntity.ok(usuarioService.atualizarParcialmente(id, patchUpdate));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponse> atualizarUsuario(@PathVariable Long id, @RequestBody @Valid UsuarioRequest request){
        return ResponseEntity.ok(usuarioService.atualizarPorCompleto(id, request));
    }



}
