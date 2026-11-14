package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.NotSortable;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.time.temporal.Temporal;
import java.time.temporal.TemporalAmount;
import java.util.Collection;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.data.domain.Sort;

/**
 * Checks the properties of a sort against the fields of an entity.
 * <p>
 * An entity can be sorted by its columns, and by the columns of an entity it relates to (one level, like
 * {@code relationship.name}), but not by a field marked {@link NotSortable}, nor by a transient or a static field, nor by a
 * {@link UUID} but the id, whose order only keeps the pages of a list stable.
 */
public final class SortValidator {

    private static final Map<String, Boolean> SORTABLE_PROPERTIES = new ConcurrentHashMap<>();

    private SortValidator() {}

    /**
     * Whether the entity can be sorted by every property of the sort.
     *
     * @param entityClass the class of the entity.
     * @param sort the sort.
     * @return {@code true} if the entity can be sorted by every property of the sort.
     */
    public static boolean isSortable(Class<?> entityClass, Sort sort) {
        return sort
            .stream()
            .map(Sort.Order::getProperty)
            .allMatch(property -> isSortableProperty(entityClass, property));
    }

    /**
     * Checks that the entity can be sorted by every property of the sort.
     *
     * @param entityClass the class of the entity.
     * @param sort the sort.
     * @param entityName the name of the entity in the error.
     * @throws BadRequestAlertException for the first property the entity cannot be sorted by.
     */
    public static void checkSortable(Class<?> entityClass, Sort sort, String entityName) {
        sort.stream()
            .map(Sort.Order::getProperty)
            .filter(property -> !isSortableProperty(entityClass, property))
            .findFirst()
            .ifPresent(property -> {
                throw BadRequestAlertException.notsortable(entityName, property);
            });
    }

    private static boolean isSortableProperty(Class<?> entityClass, String property) {
        return SORTABLE_PROPERTIES.computeIfAbsent(entityClass.getName() + "#" + property, key -> isSortable(entityClass, property));
    }

    private static boolean isSortable(Class<?> entityClass, String property) {
        String[] path = property.split("\\.", -1);
        if (path.length > 2) {
            return false;
        }
        Optional<Field> field = sortableField(entityClass, path[0]);
        if (path.length == 1) {
            return field.filter(SortValidator::isColumn).isPresent();
        }
        return field
            .filter(relationship -> !isColumn(relationship) && !isCollection(relationship.getType()))
            .flatMap(relationship -> sortableField(relationship.getType(), path[1]))
            .filter(SortValidator::isColumn)
            .isPresent();
    }

    private static Optional<Field> sortableField(Class<?> type, String name) {
        for (Class<?> current = type; current != null && current != Object.class; current = current.getSuperclass()) {
            for (Field field : current.getDeclaredFields()) {
                if (field.getName().equals(name)) {
                    int modifiers = field.getModifiers();
                    boolean sortable =
                        !Modifier.isStatic(modifiers) && !field.isSynthetic() && !field.isAnnotationPresent(NotSortable.class);
                    return sortable ? Optional.of(field) : Optional.empty();
                }
            }
        }
        return Optional.empty();
    }

    private static boolean isColumn(Field field) {
        return (
            isSimpleType(field.getType()) &&
            (UUID.class != field.getType() || isId(field)) &&
            !Modifier.isTransient(field.getModifiers()) &&
            !hasTransientAnnotation(field)
        );
    }

    private static boolean isId(Field field) {
        return (
            field.isAnnotationPresent(jakarta.persistence.Id.class) ||
            field.isAnnotationPresent(org.springframework.data.annotation.Id.class)
        );
    }

    private static boolean hasTransientAnnotation(Field field) {
        return (
            field.isAnnotationPresent(jakarta.persistence.Transient.class) ||
            field.isAnnotationPresent(org.springframework.data.annotation.Transient.class)
        );
    }

    private static boolean isCollection(Class<?> type) {
        return type.isArray() || Collection.class.isAssignableFrom(type) || Map.class.isAssignableFrom(type);
    }

    private static boolean isSimpleType(Class<?> type) {
        return (
            type.isPrimitive() ||
            type.isEnum() ||
            CharSequence.class.isAssignableFrom(type) ||
            Number.class.isAssignableFrom(type) ||
            Boolean.class == type ||
            Character.class == type ||
            UUID.class == type ||
            Temporal.class.isAssignableFrom(type) ||
            TemporalAmount.class.isAssignableFrom(type)
        );
    }
}
