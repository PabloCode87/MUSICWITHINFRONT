import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Evento } from '../interfaces/evento';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  private baseUrl = 'http://localhost:8085';

  constructor(private http: HttpClient) { }

  crearEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(`${this.baseUrl}/evento`, evento);
  }

  obtenerTodosLosEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/evento`);
  }

  obtenerEventoPorID(eventoID: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseUrl}/evento/${eventoID}`);
  }

  modificarEvento(eventoID: number, evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.baseUrl}/evento/${eventoID}`, evento);
  }

  eliminarEvento(eventoID: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/evento/${eventoID}`);
  }

  unirseEvento(eventoID: number, userID: number): Observable<void> {
    const url = `${this.baseUrl}/evento/${eventoID}/usuario/${userID}`;
    return this.http.post<any>(url, {}).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }

  salirseEvento(eventoID: number, userID: number): Observable<void> {
    const url = `${this.baseUrl}/evento/${eventoID}/usuario/${userID}`;
    return this.http.delete<void>(url).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }

  buscarEventos(nombreEvento?: string, fechaCreacion?: Date, lugarEvento?: string): Observable<Evento[]> {
    const url = `${this.baseUrl}/evento/buscar`;

    let params = new HttpParams();
    if (nombreEvento) params = params.set('nombreEvento', nombreEvento);
    if (fechaCreacion) params = params.set('fechaCreacion', fechaCreacion.toISOString());
    if (lugarEvento) params = params.set('lugarEvento', lugarEvento);
    return this.http.get<Evento[]>(url, { params }).pipe(
        catchError(error => {
          return throwError(error);
        })
      );
}

  obtenerUsuariosAsistentes(eventoID: number): Observable<Usuario[]> {
    const url = `${this.baseUrl}/evento/${eventoID}/usuarios`;
    return this.http.get<Usuario[]>(url)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

}
