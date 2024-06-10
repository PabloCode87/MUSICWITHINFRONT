import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CancionService } from '../../services/cancion.service';
import { PlaylistService } from '../../services/playlist.service';
import { Page } from '../../interfaces/page';
import { Playlist } from '../../interfaces/playlist';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: any;
  canciones: any[] = [];
  playlists: any[] = [];
  page: Page<Playlist> | null = null;
  userID: number | undefined;
  currentPage = 0;
  pageSize = 10;
  username?: string;

  constructor(
    private authService: AuthService,
    private cancionService: CancionService,
    private playlistService: PlaylistService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (this.username) {
      this.authService.getUserByUsername(this.username).subscribe((user: any) => {
        this.currentUser = user;
        if (this.currentUser) {
          this.cargarCancionesUsuario(user.userID);
          this.authService.getUserId(this.username!).subscribe((id: number | null) => {
            if (id !== null) {
              this.userID = id;
              this.cargarPlaylists(this.currentPage, this.pageSize);
            } else {
              console.error('No se pudo obtener el userID.');
            }
          });
        } else {
          console.error('No se pudo obtener el currentUser.');
        }
      });
    }
  }

  cargarCancionesUsuario(userID: number): void {
    this.cancionService.obtenerCancionesUsuario(userID).subscribe(
      (canciones) => {
        this.canciones = canciones;
      },
      (error) => {
        console.error('Error al obtener las canciones del usuario:', error);
      }
    );
  }

  cargarPlaylists(page: number, size: number): void {
    this.playlistService.obtenerPlaylists(page, size).subscribe(data => {
      this.page = data;
      this.playlists = data.content;
    });
  }

  irACancion(songID:number){
    console.log(songID);
    this.router.navigate(['/cancion', songID]);
  }

  irAPlaylist(playlistID:number){
    this.router.navigate(['/playlist', playlistID]);
  }

  logout() {
    this.authService.logout();
  }
}
