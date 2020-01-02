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
    audience: 'https://single-page-app-io.auth0.com/userinfo',
    scope: 'openid profile'
  });

  profile: any;

  constructor() { }

  login(): void {
    this.auth0.authorize();
  }

  handleAuthentication(): void {
    this.auth0.parseHash((error, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        this.fetchProfile();
        window.location.hash = '';
      } else if (error) {
        console.log(error);
      }
    });
  }

  setSession(authResult): void {
    const expiredAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiredAt);
  }

  isAuthenticated(): boolean {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
  }

  fetchProfile(): void {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('Access token requried for fetching a profile')
    }
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (err) {
        console.log(err);
        return;
      }
      this.profile = profile;
    });
  }
}
