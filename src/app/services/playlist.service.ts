import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Page } from '../interfaces/page';
import { Playlist } from '../interfaces/playlist';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private apiUrl = 'http://localhost:8080/playlist';

  constructor(private http: HttpClient) { }

  obtenerPlaylists(page: number, size: number): Observable<Page<Playlist>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Page<Playlist>>(this.apiUrl, { params });
  }

  createPlaylist(playlist: Playlist): Observable<Playlist> {
    return this.http.post<Playlist>(this.apiUrl, playlist);
  }

  deletePlaylist(playlistID: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${playlistID}`);
  }

  updatePlaylist(playlistID: number, playlist: Playlist): Observable<Playlist> {
    return this.http.put<Playlist>(`${this.apiUrl}/${playlistID}`, playlist);
  }

  obtenerPlaylistsPorUsuario(usuarioID: number): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${this.apiUrl}/usuario/${usuarioID}`);
  }

  addToPlaylist(playlistID: number, cancionID: number): Observable<any> {
    const url = `${this.apiUrl}/${playlistID}/cancion/${cancionID}`;
    return this.http.post<any>(url, {}).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }

  removeFromPlaylist(playlistID: number, cancionID: number): Observable<any> {
    const url = `http://localhost:8080/playlistsong/${playlistID}/${cancionID}`;
    return this.http.delete<any>(url).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }

  buscarPlaylists(nombre?: string, estado?: string): Observable<Playlist[]> {
    let params = new HttpParams();
    if (nombre) {
      params = params.set('playlist_name', nombre);
    }
    if (estado) {
      params = params.set('status', estado);
    }
    return this.http.get<Playlist[]>(`${this.apiUrl}/buscar`, { params });
  }
  
  // Nuevo método para obtener detalles del playlist
  getPlaylistById(playlistID: number): Observable<Playlist> {
    return this.http.get<Playlist>(`${this.apiUrl}/${playlistID}`).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }
}
