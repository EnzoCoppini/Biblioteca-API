package com.sistema.biblioteca.exception;

import java.time.LocalDateTime;

public record ErrorResponse(
        LocalDateTime timestamp,
        Integer status,
        String error,
        String menssage,
        String patch
) {
}
