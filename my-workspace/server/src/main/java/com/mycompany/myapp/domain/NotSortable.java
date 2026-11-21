package com.mycompany.myapp.domain;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Marks a property the list of an entity cannot be sorted by, like a secret.
 * <p>
 * On a relationship, the list cannot be sorted by any property of the related entity.
 */
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface NotSortable {}
