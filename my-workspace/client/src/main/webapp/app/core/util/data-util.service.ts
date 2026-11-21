import { Service } from '@angular/core';

import { Observable, Observer } from 'rxjs';

import { type BlobType, byteSize, openFile, toBase64 } from 'app/shared/jhipster/data-utils';

export type FileLoadErrorType = 'not.image' | 'could.not.extract';

export interface LoadedFile {
  data: string;
  contentType: string;
}

export interface FileLoadError {
  message: string;
  key: FileLoadErrorType;
  params?: any;
}

/**
 * A utility service for data.
 */
@Service()
export class DataUtils {
  /**
   * Method to find the byte size of the string provides
   */
  byteSize(base64String: string): string {
    return byteSize(base64String);
  }

  /**
   * Method to open file
   */
  openFile(data: string, contentType: string | null | undefined, blobType?: BlobType): void {
    openFile(data, contentType, blobType);
  }

  /**
   * Loads the base 64 data & file type of the 1st file on the event (event.target.files[0]).
   *
   * @param event the object containing the file (at event.target.files[0])
   * @param isImage boolean representing if the file represented by the event is an image
   * @returns an observable that emits the loaded file and completes if successful
   *      or returns error as FileLoadError on failure
   */
  loadFile(event: Event, isImage: boolean): Observable<LoadedFile> {
    return new Observable((observer: Observer<LoadedFile>) => {
      const eventTarget: HTMLInputElement | null = event.target as HTMLInputElement | null;
      if (eventTarget?.files?.[0]) {
        const file: File = eventTarget.files[0];
        if (isImage && !file.type.startsWith('image/')) {
          const error: FileLoadError = {
            message: `File was expected to be an image but was found to be '${file.type}'`,
            key: 'not.image',
            params: { fileType: file.type },
          };
          observer.error(error);
        } else {
          toBase64(file, (base64Data: string) => {
            observer.next({ data: base64Data, contentType: file.type });
            observer.complete();
          });
        }
      } else {
        const error: FileLoadError = {
          message: 'Could not extract file',
          key: 'could.not.extract',
          params: { event },
        };
        observer.error(error);
      }
    });
  }
}
