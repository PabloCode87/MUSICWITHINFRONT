import { Component } from '@angular/core';
import { Album } from '../../interfaces/album';
import { Cancion } from '../../interfaces/cancion';
import { AlbumService } from '../../services/album.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-album-management',
  templateUrl: './album-management.component.html',
  styleUrls: ['./album-management.component.css']
})
export class AlbumManagementComponent {
  albums: Album[] = [];
  selectedOriginAlbum: Album | null = null;
  selectedDestinationAlbum: Album | null = null;
  originAlbumSongs: Cancion[] = [];
  destinationAlbumSongs: Cancion[] = [];
  selectedSongs: { [songID: number]: boolean } = {};
  nombreAlbum: string = '';
  artistaAlbum: string = '';
  anioAlbum: number = 0;

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private albumService: AlbumService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.albumService.getAllAlbums().subscribe(albums => {
      this.albums = albums;
    });
  }

  onOriginAlbumSelected(album: Album | null): void {
    this.selectedOriginAlbum = album;
    if (album) {
      this.albumService.getCancionesPorAlbumId(album.albumID).subscribe(songs => {
        this.originAlbumSongs = songs;
      });
    } else {
      this.originAlbumSongs = [];
    }
  }

  onDestinationAlbumSelected(album: Album | null): void {
    this.selectedDestinationAlbum = album;
    if (album) {
      this.albumService.getCancionesPorAlbumId(album.albumID).subscribe(songs => {
        this.destinationAlbumSongs = songs;
      });
    } else {
      this.destinationAlbumSongs = [];
    }
  }

  moveSongs(): void {
    const selectedSongIds: number[] = [];
    for (const songId in this.selectedSongs) {
      if (this.selectedSongs[songId]) {
        selectedSongIds.push(parseInt(songId, 10));
      }
    }

    if (selectedSongIds.length === 0) {
      this.showSnackBar('Por favor, selecciona al menos una canción.', 'error');
      return;
    }
    if (!this.selectedDestinationAlbum) {
      this.showSnackBar('Por favor, selecciona un álbum destino.', 'error');
      return;
    }

    selectedSongIds.forEach((songId: number) => {
      if (this.selectedOriginAlbum) {
        this.albumService.moveSongToAlbum(songId, this.selectedOriginAlbum.albumID, this.selectedDestinationAlbum?.albumID || 0)
          .subscribe(
            () => {
              this.showSnackBar('Las canciones se han movido exitosamente.', 'success');
              this.onOriginAlbumSelected(this.selectedOriginAlbum);
              this.onDestinationAlbumSelected(this.selectedDestinationAlbum);
            },
            () => {
              this.showSnackBar('Hubo un error al mover las canciones.', 'error');
            }
          );
      }
    });
  }

  crearAlbum(): void {
    if (!this.nombreAlbum || !this.artistaAlbum || !this.anioAlbum) {
      this.showSnackBar('Por favor, complete todos los campos.', 'error');
      return;
    }

    const nuevoAlbum: Album = {
      albumID: 0, // Esto se ajustará automáticamente en el backend
      album_name: this.nombreAlbum,
      artist: this.artistaAlbum,
      year: this.anioAlbum
    };

    this.albumService.insertAlbum(nuevoAlbum).subscribe(
      () => {
        this.showSnackBar('Álbum creado exitosamente.', 'success');
        this.nombreAlbum = '';
        this.artistaAlbum = '';
        this.anioAlbum = 0;
        // Aquí podrías recargar la lista de álbumes si fuera necesario
      },
      () => {
        this.showSnackBar('Hubo un error al crear el álbum.', 'error');
      }
    );
  }

  showSnackBar(message: string, type: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: type === 'error' ? ['error-toast'] : ['success-toast']
    });
  }
}
