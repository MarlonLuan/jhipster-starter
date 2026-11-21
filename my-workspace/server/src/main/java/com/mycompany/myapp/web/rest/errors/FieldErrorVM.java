package com.mycompany.myapp.web.rest.errors;

import java.io.Serial;
import java.io.Serializable;

public class FieldErrorVM implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private final String objectName;

    private final String field;

    private final String message;

    private final String code;

    public FieldErrorVM(String dto, String field, String message, String code) {
        this.objectName = dto;
        this.field = field;
        this.message = message;
        this.code = code;
    }

    public String getObjectName() {
        return objectName;
    }

    public String getField() {
        return field;
    }

    public String getMessage() {
        return message;
    }

    public String getCode() {
        return code;
    }
}
