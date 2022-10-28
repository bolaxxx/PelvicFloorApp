import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { User } from   '../types/user';
//import { getToken } from '@angular/router/src/utils/preactivation';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: User;
  private token: string;

  constructor(private http: HttpClient) {}
  public getusuario(): User {
    if (this.user != null) {
      return this.user;
    } else if (
      sessionStorage.getItem('usuario') != null &&
      this.user == null
    ) {
      this.user = JSON.parse(sessionStorage.getItem('usuario'));
      return this.user;
    }
    return new User();
  }
 public getTokenn(): string {

    if (this.token != null) {
      console.log('token distinto de null');
      return this.token;
    } else if (sessionStorage.getItem('token') != null && this.token == null ) {
      console.log('token null y distinto de null en el storage');
      this.token = sessionStorage.getItem('token');
      return this.token;
    }
  }

  login(user: User): Observable<any> {
    const urlEndPoint = 'http://localhost:8080/oauth/token';
    const credenciales = btoa('angularapp' + ':' + '12345');
    console.log(credenciales + 'estas son las credenciales ');
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + credenciales
    });
    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', user.email);
    params.set('password', user.psw);
    console.log(params.toString());
    return this.http.post<any>(urlEndPoint, params.toString(), {
      headers: httpHeaders
    });
  }

  guardarUsuario(accessToken: string): void {
    let payload = this.obtenerDatosToken(accessToken);
    this.user = new User();
    this.user.id = payload.id_usuario;
    this.user.roles = payload.authorities;
    this.user.username = payload.user_name;
    sessionStorage.setItem('usuario', JSON.stringify(this.user));
  }
  guardarToken(accessToken: string): void {
    this.token = accessToken;
    sessionStorage.setItem('token', accessToken);
  }
  obtenerDatosToken(accessToken: string): any {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split('.')[1]));
    }
    return null;
  }

 public isAuthenticated(): boolean {
    let payload = this.obtenerDatosToken(this.getTokenn());
    console.log(JSON.stringify(payload ) + ' este es el payload ');
    if ( payload != null && payload.user_name && payload.user_name.length > 0) {
      console.log('paso el if de authenticated = true');
      return true;
    }
    console.log('no paso por el if');
    return false;
  }

  logout(): void {
    console.log('logout del service');
    this.token = null;
    this.user = null;
    localStorage.clear();
  }

  hasRoles(roles: string): boolean {
    console.log(this.user + ' this usuario desde el metodo has role');
    if (this.getusuario().roles.includes(roles)) {
      return true;
    }
    return false;

  }
}
