package com.sistema.biblioteca.exception;

public class RegraDeNegocioException extends RuntimeException{
    public RegraDeNegocioException(String mensagem){
        super(mensagem);
    }
}
