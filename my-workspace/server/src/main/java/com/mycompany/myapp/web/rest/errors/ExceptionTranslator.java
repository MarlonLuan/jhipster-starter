package com.mycompany.myapp.web.rest.errors;

import static org.springframework.core.annotation.AnnotatedElementUtils.findMergedAnnotation;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import java.net.URI;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.TransientObjectException;
import org.hibernate.query.sqm.UnknownPathException;
import org.jspecify.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springdoc.api.OpenApiResourceNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSourceResolvable;
import org.springframework.core.env.Environment;
import org.springframework.dao.ConcurrencyFailureException;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.core.PropertyReferenceException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageConversionException;
import org.springframework.orm.ObjectRetrievalFailureException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.validation.method.ParameterErrors;
import org.springframework.web.ErrorResponse;
import org.springframework.web.ErrorResponseException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import tech.jhipster.config.JHipsterConstants;
import tech.jhipster.web.rest.errors.ProblemDetailWithCause;
import tech.jhipster.web.rest.errors.ProblemDetailWithCause.ProblemDetailWithCauseBuilder;
import tech.jhipster.web.util.HeaderUtil;

/**
 * Controller advice to translate the server side exceptions to client-friendly JSON structures.
 * The error response follows RFC7807 - Problem Details for HTTP APIs (https://tools.ietf.org/html/rfc7807).
 */
@ControllerAdvice
public class ExceptionTranslator extends ResponseEntityExceptionHandler {

    private static final String FIELD_ERRORS_KEY = "fieldErrors";
    private static final String MESSAGE_KEY = "message";
    private static final String PATH_KEY = "path";
    private static final boolean CAUSAL_CHAIN_ENABLED = false;
    private static final Pattern QUALIFIED_CLASS_NAME = Pattern.compile("\\b[a-z_][a-z0-9_]*+(?:\\.[a-z_][a-z0-9_]*+)*+\\.[A-Z]");

    private static final Logger LOG = LoggerFactory.getLogger(ExceptionTranslator.class);

    @Value("${jhipster.clientApp.name:jhipster}")
    private String applicationName;

    private final Environment env;

    public ExceptionTranslator(Environment env) {
        this.env = env;
    }

    @ExceptionHandler
    public ResponseEntity<Object> handleAnyException(Throwable ex, NativeWebRequest request) {
        LOG.debug("Converting Exception to Problem Details:", ex);
        ProblemDetailWithCause pdCause = wrapAndCustomizeProblem(ex, request);
        return handleExceptionInternal((Exception) ex, pdCause, buildHeaders(ex), HttpStatusCode.valueOf(pdCause.getStatus()), request);
    }

    @SuppressWarnings("java:S2638")
    @Nullable
    @Override
    protected ResponseEntity<Object> handleExceptionInternal(
        Exception ex,
        @Nullable Object body,
        HttpHeaders headers,
        HttpStatusCode statusCode,
        WebRequest request
    ) {
        if (!(body instanceof ProblemDetailWithCause)) {
            ProblemDetailWithCause problem = getProblemDetailWithCause(ex);
            problem.setStatus(statusCode.value());
            if (body instanceof ProblemDetail problemDetail) problem.setDetail(problemDetail.getDetail());
            body = customizeProblem(problem, ex, (NativeWebRequest) request);
        }
        HttpHeaders alertHeaders = buildHeaders(ex);
        if (alertHeaders != null) {
            alertHeaders.putAll(headers);
            headers = alertHeaders;
        }
        return super.handleExceptionInternal(ex, body, headers, statusCode, request);
    }

    protected ProblemDetailWithCause wrapAndCustomizeProblem(Throwable ex, NativeWebRequest request) {
        return customizeProblem(getProblemDetailWithCause(ex), ex, request);
    }

    private ProblemDetailWithCause getProblemDetailWithCause(Throwable ex) {
        if (
            ex instanceof ErrorResponseException exp && exp.getBody() instanceof ProblemDetailWithCause problemDetailWithCause
        ) return problemDetailWithCause;
        return ProblemDetailWithCauseBuilder.instance().withStatus(toStatus(ex).value()).build();
    }

    protected ProblemDetailWithCause customizeProblem(ProblemDetailWithCause problem, Throwable err, NativeWebRequest request) {
        if (problem.getStatus() <= 0) problem.setStatus(toStatus(err));

        if (problem.getType() == null || problem.getType().equals(URI.create("about:blank"))) problem.setType(getMappedType(err));

        // higher precedence to Custom/ResponseStatus types
        String title = extractTitle(err, problem.getStatus());
        String problemTitle = problem.getTitle();
        if (problemTitle == null || !problemTitle.equals(title)) {
            problem.setTitle(title);
        }

        problem.setDetail(getCustomizedErrorDetails(err, problem.getDetail()));

        Map<String, Object> problemProperties = problem.getProperties();
        if (problemProperties == null || !problemProperties.containsKey(MESSAGE_KEY)) problem.setProperty(
            MESSAGE_KEY,
            getMappedMessageKey(err) != null ? getMappedMessageKey(err) : "error.http." + problem.getStatus()
        );

        if (problemProperties == null || !problemProperties.containsKey(PATH_KEY)) problem.setProperty(PATH_KEY, getPathValue(request));

        setFieldErrors(problem, err, problemProperties);

        problem.setCause(buildCause(err.getCause(), request).orElse(null));

        return problem;
    }

    private void setFieldErrors(ProblemDetailWithCause problem, Throwable err, Map<String, Object> problemProperties) {
        if (problemProperties != null && problemProperties.containsKey(FIELD_ERRORS_KEY)) return;

        if (err instanceof MethodArgumentNotValidException fieldException) {
            problem.setProperty(FIELD_ERRORS_KEY, getFieldErrors(fieldException));
        } else if (err instanceof HandlerMethodValidationException methodValidationException) {
            problem.setProperty(FIELD_ERRORS_KEY, getFieldErrors(methodValidationException));
        } else if (err instanceof ConstraintViolationException constraintViolationException) {
            problem.setProperty(FIELD_ERRORS_KEY, getFieldErrors(constraintViolationException));
        }
    }

    private String extractTitle(Throwable err, int statusCode) {
        return getCustomizedTitle(err) != null ? getCustomizedTitle(err) : extractTitleForResponseStatus(err, statusCode);
    }

    private List<FieldErrorVM> getFieldErrors(MethodArgumentNotValidException ex) {
        return ex.getBindingResult().getFieldErrors().stream().map(this::toFieldError).toList();
    }

    /**
     * The errors of a method validated as a whole, which a constraint on one of its parameters asks for: the ones of
     * the fields of a validated argument, like the request body, and the ones of the other parameters, by their name.
     */
    private List<FieldErrorVM> getFieldErrors(HandlerMethodValidationException ex) {
        return ex
            .getParameterValidationResults()
            .stream()
            .flatMap(result ->
                result instanceof ParameterErrors errors
                    ? errors.getFieldErrors().stream().map(this::toFieldError)
                    : result
                          .getResolvableErrors()
                          .stream()
                          .map(error ->
                              new FieldErrorVM(
                                  StringUtils.uncapitalize(result.getMethodParameter().getContainingClass().getSimpleName()),
                                  result.getMethodParameter().getParameterName(),
                                  error.getDefaultMessage(),
                                  getCode(error)
                              )
                          )
            )
            .toList();
    }

    private FieldErrorVM toFieldError(FieldError f) {
        return new FieldErrorVM(
            f.getObjectName().replaceFirst("DTO$", ""),
            f.getField(),
            f.isBindingFailure() || StringUtils.isBlank(f.getDefaultMessage()) ? f.getCode() : f.getDefaultMessage(),
            f.getCode()
        );
    }

    private String getCode(MessageSourceResolvable error) {
        String[] codes = error.getCodes();
        return codes == null || codes.length == 0 ? null : codes[codes.length - 1];
    }

    private List<FieldErrorVM> getFieldErrors(ConstraintViolationException ex) {
        return ex
            .getConstraintViolations()
            .stream()
            .map(violation ->
                new FieldErrorVM(
                    StringUtils.uncapitalize(violation.getRootBeanClass().getSimpleName()).replaceFirst("DTO$", ""),
                    violation.getPropertyPath().toString(),
                    violation.getMessage(),
                    violation.getConstraintDescriptor().getAnnotation().annotationType().getSimpleName()
                )
            )
            .toList();
    }

    private String extractTitleForResponseStatus(Throwable err, int statusCode) {
        var specialStatus = extractResponseStatus(err);
        return specialStatus == null ? HttpStatus.valueOf(statusCode).getReasonPhrase() : specialStatus.reason();
    }

    private String extractURI(NativeWebRequest request) {
        HttpServletRequest nativeRequest = request.getNativeRequest(HttpServletRequest.class);
        return nativeRequest != null ? nativeRequest.getRequestURI() : StringUtils.EMPTY;
    }

    private HttpStatus toStatus(final Throwable throwable) {
        // Let the ErrorResponse take this responsibility
        if (throwable instanceof ErrorResponse err) return HttpStatus.valueOf(err.getBody().getStatus());

        return Optional.ofNullable(getMappedStatus(throwable)).orElse(
            Optional.ofNullable(resolveResponseStatus(throwable)).map(ResponseStatus::value).orElse(HttpStatus.INTERNAL_SERVER_ERROR)
        );
    }

    private ResponseStatus extractResponseStatus(final Throwable throwable) {
        return resolveResponseStatus(throwable);
    }

    private ResponseStatus resolveResponseStatus(final Throwable type) {
        final ResponseStatus candidate = findMergedAnnotation(type.getClass(), ResponseStatus.class);
        return candidate == null && type.getCause() != null ? resolveResponseStatus(type.getCause()) : candidate;
    }

    private URI getMappedType(Throwable err) {
        if (isValidationFailure(err)) return ErrorConstants.CONSTRAINT_VIOLATION_TYPE;
        return ErrorConstants.DEFAULT_TYPE;
    }

    private String getMappedMessageKey(Throwable err) {
        if (isValidationFailure(err)) {
            return ErrorConstants.ERR_VALIDATION;
        } else if (err instanceof ConcurrencyFailureException || err.getCause() instanceof ConcurrencyFailureException) {
            return ErrorConstants.ERR_CONCURRENCY_FAILURE;
        } else if (isDataIntegrityViolation(err)) {
            return ErrorConstants.ERR_DATA_INTEGRITY_VIOLATION;
        }
        return null;
    }

    private String getCustomizedTitle(Throwable err) {
        if (isValidationFailure(err)) return "Method argument not valid";
        return null;
    }

    private boolean isValidationFailure(Throwable err) {
        return (
            err instanceof MethodArgumentNotValidException ||
            err instanceof HandlerMethodValidationException ||
            err instanceof ConstraintViolationException
        );
    }

    private String getCustomizedErrorDetails(Throwable err, String currentDetail) {
        // Where we disagree with Spring defaults
        if (err instanceof NoResourceFoundException) return HttpStatus.NOT_FOUND.getReasonPhrase();
        if (currentDetail != null) return currentDetail;

        // The message of such an exception is its whole body, the message key of the problem tells the error
        if (err instanceof ErrorResponseException exp && exp.getBody() instanceof ProblemDetailWithCause) return null;
        // The message of such an exception starts with the code and the name of its status
        if (err instanceof ResponseStatusException exp) return getReasonOrStatus(exp);

        Collection<String> activeProfiles = List.of(env.getActiveProfiles());
        if (activeProfiles.contains(JHipsterConstants.SPRING_PROFILE_PRODUCTION)) {
            String productionDetail = getProductionErrorDetails(err);
            if (productionDetail != null) return productionDetail;
        }
        // higher precedence to cause
        String detail = err.getCause() != null ? err.getCause().getMessage() : err.getMessage();
        return activeProfiles.contains(JHipsterConstants.SPRING_PROFILE_PRODUCTION) && containsPackageName(detail)
            ? "Unexpected runtime exception"
            : detail;
    }

    private String getProductionErrorDetails(Throwable err) {
        if (err instanceof HttpMessageConversionException) return "Unable to convert http message";
        if (isInvalidSortProperty(err)) return "Invalid sort property";
        if (isDataIntegrityViolation(err)) return "Data integrity violation";
        if (err instanceof DataAccessException) return "Failure during data access";
        return null;
    }

    private HttpStatus getMappedStatus(Throwable err) {
        // Where we disagree with Spring defaults
        if (err instanceof AccessDeniedException) return HttpStatus.FORBIDDEN;
        if (err instanceof ConcurrencyFailureException) return HttpStatus.CONFLICT;
        if (err instanceof AuthenticationException) return HttpStatus.UNAUTHORIZED;
        if (err instanceof ConstraintViolationException) return HttpStatus.BAD_REQUEST;
        if (err instanceof OpenApiResourceNotFoundException) return HttpStatus.NOT_FOUND;
        if (isInvalidSortProperty(err)) return HttpStatus.BAD_REQUEST;
        if (isDataIntegrityViolation(err)) return HttpStatus.BAD_REQUEST;
        return null;
    }

    private String getReasonOrStatus(ResponseStatusException err) {
        return err.getReason() != null ? err.getReason() : HttpStatus.valueOf(err.getStatusCode().value()).getReasonPhrase();
    }

    private URI getPathValue(NativeWebRequest request) {
        if (request == null) return URI.create("about:blank");
        return URI.create(extractURI(request));
    }

    private HttpHeaders buildHeaders(Throwable err) {
        return err instanceof BadRequestAlertException badRequestAlertException
            ? HeaderUtil.createFailureAlert(
                  applicationName,
                  true,
                  badRequestAlertException.getEntityName(),
                  badRequestAlertException.getErrorKey(),
                  badRequestAlertException.getMessage()
              )
            : null;
    }

    public Optional<ProblemDetailWithCause> buildCause(final Throwable throwable, NativeWebRequest request) {
        if (throwable != null && isCausalChainEnabled()) {
            return Optional.of(customizeProblem(getProblemDetailWithCause(throwable), throwable, request));
        }
        return Optional.empty();
    }

    private boolean isCausalChainEnabled() {
        // Customize as per the needs
        return CAUSAL_CHAIN_ENABLED;
    }

    private boolean isInvalidSortProperty(Throwable err) {
        // A query with its own select fails when it runs instead of when the sort is read.
        for (Throwable cause = err; cause != null; cause = cause.getCause()) {
            if (cause instanceof UnknownPathException) return true;
        }
        return err instanceof PropertyReferenceException;
    }

    private boolean isDataIntegrityViolation(Throwable err) {
        // A reference to an entity without id fails before a statement is sent to the database.
        for (Throwable cause = err; cause != null; cause = cause.getCause()) {
            if (cause instanceof TransientObjectException) return true;
        }
        // A reference to an unknown entity may fail when the referenced entity is loaded.
        if (err instanceof ObjectRetrievalFailureException) return true;
        return err instanceof DataIntegrityViolationException;
    }

    private boolean containsPackageName(String message) {
        return message != null && QUALIFIED_CLASS_NAME.matcher(message).find();
    }
}
