import { HttpErrorResponse } from '@angular/common/http';
import { FieldTree, TreeValidationResult } from '@angular/forms/signals';

import { Observable, catchError, lastValueFrom, map, of } from 'rxjs';

import { getServerProblem, isConstraintViolation } from 'app/shared/jhipster/problem-details';

/**
 * The errors of the fields the server refused, which mark them invalid with the message of their errors.
 * Only the given fields are marked, the ones showing the error of the server: Angular clears the error of a field
 * when its value changes, so an error nobody sees would block every later submission.
 * The errors of the other fields stay in the alert.
 */
export const getServerFieldErrors = <T>(
  form: FieldTree<T>,
  fieldNames: readonly (keyof T & string)[],
  error: unknown,
): TreeValidationResult => {
  const problem = getServerProblem(error instanceof HttpErrorResponse ? error.error : undefined);
  if (!isConstraintViolation(problem)) {
    return undefined;
  }
  const fieldTrees = form as unknown as Record<string, FieldTree<unknown> | undefined>;
  const shownFieldNames: readonly string[] = fieldNames;
  return problem.fieldErrors.flatMap(({ field, message }) => {
    const fieldTree = shownFieldNames.includes(field) ? fieldTrees[field] : undefined;
    return fieldTree ? [{ kind: 'server', message, fieldTree }] : [];
  });
};

/**
 * The result of the submission of a form by a request: nothing when the request succeeds, the errors of the given fields
 * the server refused when it fails (see `getServerFieldErrors`), nothing either when it completes without a value.
 */
export const toSubmissionResult = <T>(
  form: FieldTree<T>,
  fieldNames: readonly (keyof T & string)[],
  request: Observable<unknown>,
): Promise<TreeValidationResult> =>
  lastValueFrom(
    request.pipe(
      map((): TreeValidationResult => undefined),
      catchError((error: unknown) => of(getServerFieldErrors(form, fieldNames, error))),
    ),
    { defaultValue: undefined },
  );
