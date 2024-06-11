import { Component, OnInit } from '@angular/core';
import { Playlist } from '../../interfaces/playlist';
import { PlaylistService } from '../../services/playlist.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-busqueda-playlist',
  templateUrl: './busqueda-playlist.component.html',
  styleUrl: './busqueda-playlist.component.css'
})
export class BusquedaPlaylistComponent implements OnInit {
  playlists: Playlist[] = [];
  searchName: string = '';
  searchStatus: string = '';
  loading: boolean = false;

  constructor(
    private playlistService: PlaylistService,
    private router:Router,
    private toastr: ToastrService,
    private authService:AuthService
  ) { }

  ngOnInit(): void {

  }

  buscarPlaylists(): void {
    this.loading = true;

    this.playlistService.buscarPlaylists(this.searchName, this.searchStatus)
      .subscribe(
        (data: Playlist[]) => {
          this.playlists = data;
          this.loading = false;
        },
        (error) => {
          console.error('Error trayendo playlists', error);
          this.loading = false;
        }
      );
  }
  irAPlaylist(playlistID: number, playlistUsuarioID: number, status: string): void {
    const username = this.authService.getUsername();
    this.authService.getUserId(username).pipe(
      map((currentUserID: number | null) => {
        if (status === 'PRIVADA' && playlistUsuarioID !== currentUserID) {
          this.toastr.error('No tienes permiso para ver esta playlist privada');
        } else {
          this.router.navigate(['/playlist', playlistID]);
        }
      })
    ).subscribe();
  }

}
