package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.mycompany.myapp.domain.NotSortable;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.time.Duration;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Sort;

/**
 * Test class for the {@link SortValidator} utility class.
 */
class SortValidatorTest {

    static class Related {

        Long id;

        String name;

        @NotSortable
        String secret;

        Related parent;
    }

    static class Base {

        Long id;
    }

    static class Sample extends Base {

        static final String CONSTANT = "constant";

        String name;

        Instant createdDate;

        Duration duration;

        byte[] picture;

        transient String computed;

        @org.springframework.data.annotation.Transient
        String notStored;

        @jakarta.persistence.Transient
        String notPersisted;

        @NotSortable
        String secret;

        Related related;

        @NotSortable
        Related hidden;

        Set<Related> others;

        UUID reference;
    }

    static class WithUuidId {

        @jakarta.persistence.Id
        UUID id;

        String name;
    }

    @Test
    void acceptsTheColumnsAndTheColumnsOfARelationship() {
        assertThat(
            SortValidator.isSortable(Sample.class, Sort.by("id", "name", "createdDate", "duration", "related.id", "related.name"))
        ).isTrue();
    }

    @Test
    void acceptsAUuidIdOnly() {
        assertThat(SortValidator.isSortable(WithUuidId.class, Sort.by("id", "name"))).isTrue();
        assertThat(SortValidator.isSortable(Sample.class, Sort.by("reference"))).isFalse();
    }

    @Test
    void acceptsNoSort() {
        assertThat(SortValidator.isSortable(Sample.class, Sort.unsorted())).isTrue();
    }

    @Test
    void rejectsAFieldMarkedNotSortable() {
        assertThat(SortValidator.isSortable(Sample.class, Sort.by("name", "secret"))).isFalse();
    }

    @Test
    void rejectsAFieldOfARelationshipMarkedNotSortable() {
        assertThat(SortValidator.isSortable(Sample.class, Sort.by("related.secret"))).isFalse();
    }

    @Test
    void rejectsARelationshipMarkedNotSortable() {
        assertThat(SortValidator.isSortable(Sample.class, Sort.by("hidden.name"))).isFalse();
    }

    @Test
    void rejectsWhatIsNotAColumn() {
        for (String property : new String[] {
            "doesNotExist",
            "CONSTANT",
            "computed",
            "notPersisted",
            "notStored",
            "picture",
            "related",
            "others",
            "others.name",
        }) {
            assertThat(SortValidator.isSortable(Sample.class, Sort.by(property)))
                .as(property)
                .isFalse();
        }
    }

    @Test
    void rejectsAPathDeeperThanARelationship() {
        assertThat(SortValidator.isSortable(Sample.class, Sort.by("related.parent.name"))).isFalse();
        assertThat(SortValidator.isSortable(Sample.class, Sort.by("related.doesNotExist"))).isFalse();
    }

    @Test
    void tellsTheFirstPropertyItCannotSortBy() {
        assertThatCode(() ->
            SortValidator.checkSortable(Sample.class, Sort.by("name", "related.name"), "sample")
        ).doesNotThrowAnyException();
        assertThatThrownBy(() ->
            SortValidator.checkSortable(Sample.class, Sort.by("name", "secret", "picture"), "sample")
        ).isInstanceOfSatisfying(BadRequestAlertException.class, exception -> {
            assertThat(exception.getErrorKey()).isEqualTo("notsortable");
            assertThat(exception.getBody().getTitle()).isEqualTo("A sample cannot be sorted by secret");
        });
    }
}
