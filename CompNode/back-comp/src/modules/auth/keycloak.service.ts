// import { Injectable } from '@nestjs/common';
// import KeycloakConnect, {
//   AuthZRequest,
//   Keycloak,
//   KeycloakConfig,
//   KeycloakOptions,
//   GaurdFn,
//   EnforcerOptions,
//   Grant,
//   GrantManager,
//   GrantProperties,
//   Token,
// } from 'keycloak-connect';
// @Injectable()
// export class KeycloakService {
//   keycloakCnf: KeycloakConfig = {
//     'auth-server-url': 'http://1.44.4.7/auth',
//     'confidential-port': 5,
//     'ssl-required': 'true',
//     realm: 'bigan',
//     resource: 'investigacion',
//   };
//   keycloakOptions: KeycloakOptions = {};
//   keycloak: KeycloakConnect.Keycloak;
//   /**
//    * test
//    */
//   public test() {}
//   keycloakCnf: Keycloak.KeycloakConfig = {
//     clientId: 'investigacion',
//     realm: 'bigan',
//     url: 'http://1.44.4.7/auth',
//   };
//   public kCloak = Keycloak(this.keycloakCnf);
//   * https://is.gd/tF8QT7 (Angular 2, usar como "ejemplo")
//   static keycloakAuth: KeycloakClient = Keycloak();
//   static init(options?: any): Promise<any> {
//       return new Promise((resolve, reject) => {
//           KeycloakService.keycloakAuth.init(options)
//               .success(() => {
//                   resolve();
//               })
//               .error((errorData: any) => {
//                   reject(errorData);
//               });
//       });
//   }
//   authenticated(): boolean {
//       return KeycloakService.keycloakAuth.authenticated;
//   }
//   login() {
//       KeycloakService.keycloakAuth.login();
//   }
//   logout() {
//       KeycloakService.keycloakAuth.logout();
//   }
//   account() {
//       KeycloakService.keycloakAuth.accountManagement();
//   }
//   getToken(): Promise<string> {
//       return new Promise<string>((resolve, reject) => {
//           if (KeycloakService.keycloakAuth.token) {
//               KeycloakService.keycloakAuth
//                   .updateToken(5)
//                   .success(() => {
//                       resolve(<string>KeycloakService.keycloakAuth.token);
//                   })
//                   .error(() => {
//                       reject('Failed to refresh token');
//                   });
//           } else {
//               reject('Not loggen in');
//           }
//       });
//   }
// }
