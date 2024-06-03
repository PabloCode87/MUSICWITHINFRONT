import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FollowerUserService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  seguirUsuario(followerID: number, followedID: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/follow/${followerID}/${followedID}`, {});
  }

  dejarDeSeguirUsuario(followerID: number, followedID: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/unfollow/${followerID}/${followedID}`, {});
  }
}
