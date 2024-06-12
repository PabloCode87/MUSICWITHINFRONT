import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comentario } from '../interfaces/comentario';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

  
  private baseUrl = 'http://localhost:8085/comentario';

  constructor(private http: HttpClient) { }

  agregarComentario(cancionID: number, userID: number, roleID: number, comentario: Comentario): Observable<Comentario> {
    return this.http.post<Comentario>(`${this.baseUrl}/cancion/${cancionID}?userID=${userID}&roleID=${roleID}`, comentario);
  }

  obtenerComentariosPorCancion(cancionID: number): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(`${this.baseUrl}/cancion/${cancionID}/comentarios`);
  }

  eliminarComentario(commentID: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${commentID}`);
  }
}
