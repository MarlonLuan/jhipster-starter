# jhipster

This application was generated using JHipster 9.4.1-snapshot, you can find documentation and help at [https://www.jhipster.tech/documentation-archive/v9.4.1-snapshot](https://www.jhipster.tech/documentation-archive/v9.4.1-snapshot).

## Project Structure

## Development

Before you can build this project, you must install and configure the following dependencies on your machine:

1. [Node.js](https://nodejs.org/): Node is used to run a development web server and build the project.
   Depending on your system, you can install Node either from source or as a pre-packaged bundle.

After installing Node, you should be able to run the following command to install development tools.
You will only need to run this command when dependencies change in [package.json](package.json).

```bash
npm install
```

We use npm scripts and [Angular CLI](https://angular.dev/tools/cli) with esbuild as our build system.

Run the following commands in two separate terminals to create a blissful development experience where your browser
auto-refreshes when files change on your hard drive.

```bash
npm run backend:start
npm run start
```

Npm is also used to manage CSS and JavaScript dependencies used in this application. You can upgrade dependencies by
specifying a newer version in [package.json](package.json). You can also run `npm update` and `npm install` to manage dependencies.
Add the `help` flag on any command to see how you can use it. For example, `npm help update`.

The `npm run` command will list all the scripts available to run for this project.

### PWA Support

JHipster ships with PWA (Progressive Web App) support, and it's turned off by default. One of the main components of a PWA is a service worker.

The service worker initialization code is disabled by default. To enable it, uncomment the following code in `src/main/webapp/app/app.config.ts`:

```typescript
ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
```

### Managing dependencies

For example, to add [Leaflet](https://leafletjs.com/) library as a runtime dependency of your application, you would run the following command:

```bash
npm install --save --save-exact leaflet
```

To benefit from TypeScript type definitions from [DefinitelyTyped](https://definitelytyped.org/) repository in development, you would run the following command:

```bash
npm install --save-dev --save-exact @types/leaflet
```

Then you would import the JS and CSS files specified in library's installation instructions so that [esbuild][] knows about them:
Edit [src/main/webapp/app/app.config.ts](src/main/webapp/app/app.config.ts) file:

```typescript
import 'leaflet/dist/leaflet.js';
```

Edit [src/main/webapp/content/scss/vendor.scss](src/main/webapp/content/scss/vendor.scss) file:

```typescript
@import 'leaflet/dist/leaflet.css';
```

Note: There are still a few other things remaining to do for Leaflet that we won't detail here.

For further instructions on how to develop with JHipster, have a look at [Using JHipster in development](https://www.jhipster.tech/development/).

### Using Angular CLI

You can also use [Angular CLI](https://angular.dev/tools/cli) to generate some custom client code.

For example, the following command:

```bash
ng generate component my-component
```

will generate few files:

```bash
create src/main/webapp/app/my-component/my-component.html
create src/main/webapp/app/my-component/my-component.ts
update src/main/webapp/app/app.config.ts
```

## Building for production

## Testing

### Client tests

Unit tests are run by Vitest. They're located near components and can be run with:

```bash
npm test
```

## References

- [JHipster Homepage and latest documentation](https://www.jhipster.tech/)
- [JHipster 9.4.1-snapshot archive](https://www.jhipster.tech/documentation-archive/v9.4.1-snapshot)
- [Using JHipster in development](https://www.jhipster.tech/documentation-archive/v9.4.1-snapshot/development/)
- [Using Docker and Docker-Compose](https://www.jhipster.tech/documentation-archive/v9.4.1-snapshot/docker-compose)
- [Using JHipster in production](https://www.jhipster.tech/documentation-archive/v9.4.1-snapshot/production/)
- [Running tests page](https://www.jhipster.tech/documentation-archive/v9.4.1-snapshot/running-tests/)
- [Code quality page](https://www.jhipster.tech/documentation-archive/v9.4.1-snapshot/code-quality/)
- [Setting up Continuous Integration](https://www.jhipster.tech/documentation-archive/v9.4.1-snapshot/setting-up-ci/)
- [Node.js](https://nodejs.org/)
- [NPM](https://www.npmjs.com/)
- [Vitest](https://vitest.dev)
- [Leaflet](https://leafletjs.com/)
- [DefinitelyTyped](https://definitelytyped.org/)
- [Angular CLI](https://angular.dev/tools/cli)
