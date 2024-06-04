import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from '../interfaces/evento';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  private baseUrl = 'http://localhost:8080';

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
}
