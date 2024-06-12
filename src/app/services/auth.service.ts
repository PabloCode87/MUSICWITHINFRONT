import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private router:Router) { }

  login(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password });
  }

  getUserByUsername(username: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuario/username/${username}`);
  }

  actualizarUsuario(usuarioID: number, usuario: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/usuario/${usuarioID}`, usuario);
  }

  eliminarUsuario(usuarioID: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/usuario/${usuarioID}`).pipe(
      catchError(error => {
        console.error('Error al eliminar el usuario:', error);
        return of(null);
      })
    );
  }

  crearUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuario`, usuario, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  logout(){
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('password');
    sessionStorage.removeItem('user');
    this.router.navigate(['/login']);
    window.location.reload();
  }

  getToken() {
    return sessionStorage.getItem('token');
  }

  getUsername(){
    return sessionStorage.getItem('username') || '';
  }

  getLoggedInUser(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return of(null);
    }
    return this.http.get<any>(`${this.apiUrl}/user`).pipe(
      map(user => {
        sessionStorage.setItem('user', JSON.stringify(user));
        return user;
      }),
      catchError(error => {
        console.error('Error al obtener el usuario:', error);
        return of(null);
      })
    );
  }

  getUserId(username: string): Observable<number | null> {
    console.log('username service: '+username);
    return this.http.get<any>(`${this.apiUrl}/usuario/username/${username}`).pipe(
      map(response => response.userID),
      catchError(error => {
        console.error('Error al obtener el ID del usuario:', error);
        return of(null);
      })
    );
  }

  uploadPhoto(usuarioID: number, formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/uploadFoto/${usuarioID}`, formData).pipe(
      catchError(error => {
        console.error('Error al subir la foto:', error);
        return of(null);
      })
    );
  }

  recoverPassword(username: string, email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/recuperarPassword`, { username, email });
  }

  buscarUsuarios(keyword: string): Observable<any> {
    const url = keyword ? `${this.apiUrl}/usuario/buscar?keyword=${keyword}` : `${this.apiUrl}/usuario/buscar`;
    return this.http.get<any>(url).pipe(
      catchError(error => {
        console.error('Error al buscar usuarios:', error);
        return of(null);
      })
    );
  }

  obtenerTipoUsuario(username: string): Observable<string> {
    const url = `${this.apiUrl}/usuario/${username}/tipo`;
    return this.http.get<any>(url).pipe(
      catchError(error => {
        console.error('Error al obtener el tipo de usuario:', error);
        return of(null);
      }),
      map(response => {
        if (typeof response === 'string') {
          return response;
        } else if (response && response.tipoUsuario) {
          return response.tipoUsuario;
        } else {
          return 'Tipo de usuario no encontrado';
        }
      })
    );
  }

  getUserRoleId(userID: number): Observable<number | null> {
    return this.http.get<any>(`${this.apiUrl}/usuario/rol/${userID}`).pipe(
      map(response => response as number),
      catchError(error => {
        console.error('Error al obtener el roleID del usuario:', error);
        return of(null);
      })
    );
  }

  getFollowedUsersByUserID(userID: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario/seguidos/${userID}`).pipe(
      catchError(error => {
        console.error('Error al obtener los usuarios seguidos:', error);
        return of([]);
      })
    );
  }

}
