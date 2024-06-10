import { Component } from '@angular/core';
import { Album } from '../../interfaces/album';
import { Cancion } from '../../interfaces/cancion';
import { AlbumService } from '../../services/album.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

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
  selectedAlbumId: number = 0;
  selectedAlbum: Album | null = null;

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private albumService: AlbumService,
    private snackBar: MatSnackBar,
    private toastService: ToastrService
  ) { }

  ngOnInit(): void {
    this.albumService.getAllAlbums().subscribe(albums => {
      this.albums = albums;
    });
  }

  onAlbumSelected(album: Album): void {
    this.selectedAlbum = album;
    // Cargar los detalles del álbum seleccionado en el formulario
    this.nombreAlbum = album.album_name;
    this.artistaAlbum = album.artist;
    this.anioAlbum = album.year;
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
    if (!this.validateForm()) {
      return;
    }

    const nuevoAlbum: Album = {
      albumID: 0,
      album_name: this.nombreAlbum,
      artist: this.artistaAlbum,
      year: this.anioAlbum!
    };
    this.albumService.insertAlbum(nuevoAlbum).subscribe(
      () => {
        this.toastService.success('Álbum creado exitosamente.');
        this.resetForm();
      },
      () => {
        this.toastService.error('Hubo un error al crear el álbum.');
      }
    );
  }

  validateForm(): boolean {
    return !!this.nombreAlbum && !!this.artistaAlbum && this.anioAlbum !== null;
  }

  resetForm(): void {
    this.nombreAlbum = '';
    this.artistaAlbum = '';
    this.anioAlbum = 0;
  }

  showSnackBar(message: string, type: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: type === 'error' ? ['error-toast'] : ['success-toast']
    });
  }

  onCreateAlbumClick(): void {
    if (!this.validateForm()) {
      this.toastService.error('Por favor, completa todos los campos.');
    } else {
      this.crearAlbum();
    }
  }


  eliminarAlbum(albumID: number): void {
    if (albumID !== undefined) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Escribe BORRAR para confirmar la eliminación',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        showLoaderOnConfirm: true,
        preConfirm: (inputValue) => {
          if (inputValue !== 'BORRAR') {
            Swal.showValidationMessage('Debes escribir BORRAR para confirmar');
            return false;
          }
          return true;
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed && result.value === true) {
          this.albumService.deleteAlbum(albumID).subscribe(
            () => {
              Swal.fire({
                icon: 'success',
                title: 'Álbum eliminado',
                showConfirmButton: false,
                timer: 1500
              });
              this.albumService.getAllAlbums().subscribe(albums => {
                this.albums = albums;
              });
            },
            () => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar el álbum',
              });
              console.error('Error al eliminar el álbum');
            }
          );
        }
      });
    } else {
      console.error('albumID no puede ser undefined');
    }
  }

  updateAlbum(): void {
    if (!this.validateForm()) {
      return;
    }
  
    if (!this.selectedAlbum) {
      return;
    }
  
    const updatedAlbum: Album = {
      ...this.selectedAlbum,
      album_name: this.nombreAlbum,
      artist: this.artistaAlbum,
      year: this.anioAlbum!
    };
  
    this.albumService.updateAlbum(this.selectedAlbum.albumID, updatedAlbum).subscribe(
      () => {
        this.toastService.success('Álbum actualizado exitosamente.');
        // Opcional: Recargar la lista de álbumes después de actualizar
        this.albumService.getAllAlbums().subscribe(albums => {
          this.albums = albums;
        });
      },
      () => {
        this.toastService.error('Hubo un error al actualizar el álbum.');
      }
    );
  }

}
