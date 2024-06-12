import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { Album } from '../interfaces/album';
import { Cancion } from '../interfaces/cancion';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private apiUrl = 'http://localhost:8085/album'; 

  constructor(private http: HttpClient) { }

  getAllAlbums(): Observable<Album[]> {
    return this.http.get<Album[]>(this.apiUrl);
  }

  getAlbumById(albumID: number): Observable<Album> {
    const url = `${this.apiUrl}/${albumID}`;
    return this.http.get<Album>(url);
  }

  insertAlbum(album: Album): Observable<Album> {
    return this.http.post<Album>(this.apiUrl, album);
  }

  updateAlbum(albumID: number, album: Album): Observable<Album> {
    const url = `${this.apiUrl}/${albumID}`;
    return this.http.put<Album>(url, album);
  }

  deleteAlbum(albumID: number): Observable<void> {
    const url = `${this.apiUrl}/${albumID}`;
    return this.http.delete<void>(url);
  }

  moveSongToAlbum(cancionID: number, albumOrigenID: number, albumDestinoID: number): Observable<Album> {
    const url = `${this.apiUrl}/${albumOrigenID}/mover-cancion/${cancionID}/${albumDestinoID}`;
    return this.http.post<Album>(url, {});
  }

  getCancionesPorAlbumId(albumId: number): Observable<Cancion[]> {
    const url = `${this.apiUrl}/${albumId}/canciones`;
    return this.http.get<Cancion[]>(url);
  }
}
