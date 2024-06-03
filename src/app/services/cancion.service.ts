import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { Cancion } from '../interfaces/cancion';

@Injectable({
  providedIn: 'root'
})
export class CancionService {

  private apiUrl = 'http://localhost:8080/cancion';

  constructor(private http: HttpClient, private router:Router) { }

  obtenerCanciones(): Observable<Cancion[]> {
    return this.http.get<Cancion[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  obtenerCancionPorId(cancionID: number): Observable<Cancion> {
    return this.http.get<Cancion>(`${this.apiUrl}/${cancionID}`).pipe(
      catchError(this.handleError)
    );
  }

  buscarCanciones(songName: string): Observable<Cancion[]> {
    const params = new HttpParams().set('song_name', songName);
  
    return this.http.get<Cancion[]>(`${this.apiUrl}/buscar-cancion`, { params }).pipe(
      catchError(this.handleError)
    );
  }



  insertarCancion(cancion: Cancion, audioFile: File): Observable<Cancion> {
    const formData = new FormData();
    formData.append('song_name', cancion.song_name);
    formData.append('artist', cancion.artist);
    formData.append('genre', cancion.genre);
    formData.append('duration', cancion.duration.toString());
    if (cancion.albumID !== null) {
      formData.append('albumID', cancion.albumID.toString());
    }
    formData.append('audio_file', audioFile);
    formData.append('userID', cancion.uploaded_by.toString());

    return this.http.post<Cancion>(this.apiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  actualizarCancion(cancionID: number, cancion: Cancion): Observable<Cancion> {
    return this.http.put<Cancion>(`${this.apiUrl}/${cancionID}`, cancion).pipe(
        catchError(this.handleError)
    );
  }
  

  // Eliminar una canción
  eliminarCancion(cancionID: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${cancionID}`).pipe(
      catchError(this.handleError)
    );
  }

  eliminarCancionPlaylist(cancionID: number): Observable<void> {
    console.log(cancionID);
    return this.http.delete<void>(`http://localhost:8080/cancionPlaylist/${cancionID}`).pipe(
      catchError(this.handleError)
    );
  }

  buscarCancionesPorFiltros(songName: string, artist: string, genre: string): Observable<Cancion[]> {
    let params = new HttpParams();
    if (songName) {
      params = params.set('song_name', songName);
    }
    if (artist) {
      params = params.set('artist', artist);
    }
    if (genre) {
      params = params.set('genre', genre);
    }
  
    return this.http.get<Cancion[]>(`${this.apiUrl}/buscar`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  todosLosGeneros(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/generos`);
  }

  obtenerCancionesUsuario(userID: number): Observable<Cancion[]> {
    return this.http.get<Cancion[]>(`${this.apiUrl}/usuario/${userID}`).pipe(
      catchError(this.handleError)
    );
  }

  obtenerIdUsuarioPorIdCancion(cancionID: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${cancionID}/uploader`).pipe(
      catchError(this.handleError)
    );
  }


  // Manejo de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
