import { Injectable } from '@angular/core';
import auth0 from 'auth0-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth0 = new auth0.WebAuth({
    clientID : 'Zk6cu1vEmtK4jHSrw0vkpN7SYKSmmXf2',
    domain: 'single-page-app-io.auth0.com',
    redirectUri: 'http://localhost:4200',
    responseType: 'token id_token',
    audience: 'https://single-page-app-io.auth0.com/userinfo'
  });

  constructor() { }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    this.auth0.parseHash((error, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (error) {
        console.log(error);
      }
    });
  }

  setSession(authResult){
    const expiredAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiredAt);
  }
}
