import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cancion } from '../../interfaces/cancion';
import { CancionService } from '../../services/cancion.service';
import { Album } from '../../interfaces/album';
import { AlbumService } from '../../services/album.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-upload-cancion',
  templateUrl: './upload-cancion.component.html',
  styleUrls: ['./upload-cancion.component.css']
})
export class UploadCancionComponent implements OnInit {
  cancion: Partial<Cancion> = {};
  audioFile: File | null = null;
  albums: Album[] = [];

  constructor(private cancionService: CancionService, private router: Router, private albumService: AlbumService) {
    const sessionStorageData = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (sessionStorageData && sessionStorageData.userID) {
      this.cancion.uploaded_by = sessionStorageData.userID;
    }
  }

  ngOnInit(): void {
    this.albumService.getAllAlbums().subscribe(albums => {
      this.albums = albums;
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.audioFile = event.target.files[0];
    }
  }

  onSubmit(cancionForm: NgForm) {
    if (!this.cancion.song_name || !this.cancion.artist || !this.cancion.genre || !this.cancion.duration || !this.cancion.albumID || !this.audioFile) {
      console.error('Por favor, completa todos los campos del formulario.');
      return;
    }

    if (this.cancion.duration) {
      const [hours, minutes] = this.cancion.duration.split(':');
      this.cancion.duration = `${hours}:${minutes}:00`;
    }

    this.cancionService.insertarCancion(this.cancion as Cancion, this.audioFile).subscribe(
      (result) => {
        console.log('Canción subida con éxito:', result);
        // Verificar si el resultado contiene el ID de la canción
        if (result && result.songID) {
          // Construir la URL de la página de la canción
          const songId = result.songID;
          this.router.navigate(['/cancion/' + songId]);
        } else {
          console.error('El resultado de la solicitud no contiene el ID de la canción');
        }
      },
      (error) => {
        console.error('Error al subir la canción', error);
      }
    );
  }
}
