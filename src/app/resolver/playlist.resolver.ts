import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Cancion } from '../interfaces/cancion';
import { PlaylistPlayerService } from '../services/playlist-player.service';

@Injectable({
  providedIn: 'root'
})
export class PlaylistResolver implements Resolve<Cancion[]> {

  constructor(private playlistPlayerService: PlaylistPlayerService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Cancion[]> {
    const playlistID = route.params['playlistID']; // Access 'playlistID' using ['playlistID']
    return this.playlistPlayerService.getCancionesByPlaylistID(playlistID).pipe(
      catchError(error => {
        console.error('Error fetching playlist songs:', error);
        // Handle error gracefully, for example, redirect to an error page or return an empty array
        return of([]);
      })
    );
  }
}
