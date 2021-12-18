// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.



const BASE_URL = '';
const BASE_URL_RATE = '';
const BASE_URL_WS = '';

export const environment = {
  production: false,
  API_URL: BASE_URL,
  API_URL_RATE: BASE_URL_RATE,
  API_URL_WS: BASE_URL_WS
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
