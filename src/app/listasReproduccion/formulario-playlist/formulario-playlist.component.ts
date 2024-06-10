import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlaylistService } from '../../services/playlist.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-formulario-playlist',
  templateUrl: './formulario-playlist.component.html',
  styleUrls: ['./formulario-playlist.component.css']
})
export class FormularioPlaylistComponent implements OnInit {
  playlistForm!: FormGroup;
  userId: number | undefined;
  creationDate?: string;

  constructor(
    private formBuilder: FormBuilder,
    private playlistService: PlaylistService,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/crear-playlists') {
          window.location.reload();
        }
      }
    });
    this.playlistForm = this.formBuilder.group({
      playlist_name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      status: ['PUBLICA', Validators.required]
    });

    // Obtener el ID del usuario conectado al iniciar el componente
    const username = this.authService.getUsername();
    this.authService.getUserId(username).subscribe(
      (userId: number | null) => {
        if (userId !== null) {
          this.userId = userId;
        } else {
          console.error('No se pudo obtener el ID del usuario.');
        }
      },
      (error) => {
        console.error('Error al obtener el ID del usuario:', error);
      }
    );

    // Obtener la fecha actual en el formato necesario (ISO 8601)
    this.creationDate = new Date().toISOString();
  }

  onSubmit(): void {
    if (this.playlistForm.invalid || !this.userId) {
      this.toastr.error('Por favor, completa todos los campos del formulario correctamente.', 'Error');
      return;
    }

    const playlistData = {
      ...this.playlistForm.value,
      creation_date: this.creationDate, // Agregar la fecha de creación
      usuario: { userID: this.userId } // Agregar el ID del usuario a los datos de la playlist
    };

    this.playlistService.createPlaylist(playlistData).subscribe(
      () => {
        this.toastr.success('La playlist ha sido creada correctamente.', 'Éxito');

        // Redirigir a la vista 'ver-tus-playlists' después de 1 segundo
        setTimeout(() => {
          this.router.navigate(['/ver-tus-playlists']);
        }, 1000);
      },
      (error) => {
        console.error('Error al crear la playlist:', error);
        this.toastr.error('Se produjo un error al crear la playlist. Por favor, inténtalo de nuevo más tarde.', 'Error');
      }
    );
  }

  getFormControlError(controlName: string, errorType: string): boolean {
    const control = this.playlistForm.get(controlName);
    return control ? control.hasError(errorType) && (control.dirty || control.touched) : false;
  }
}
