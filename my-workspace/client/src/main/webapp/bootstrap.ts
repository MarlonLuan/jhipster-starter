import { bootstrapApplication } from '@angular/platform-browser';

import { appConfig } from 'app/app.config';

import App from './app/app';

bootstrapApplication(App, appConfig)
  // eslint-disable-next-line no-console
  .then(() => console.log('Application started'))
  .catch((err: unknown) => console.error(err)); // NOSONAR
