import { Component, OnInit } from '@angular/core';
import { Cancion } from '../../interfaces/cancion';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CancionService } from '../../services/cancion.service';
import { AuthService } from '../../services/auth.service';
import { Playlist } from '../../interfaces/playlist';
import { PlaylistService } from '../../services/playlist.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Comentario } from '../../interfaces/comentario';
import { ComentarioService } from '../../services/comentario.service';


@Component({
  selector: 'app-cancion-detalle',
  templateUrl: './cancion-detalle.component.html',
  styleUrls: ['./cancion-detalle.component.css']
})
export class CancionDetalleComponent implements OnInit {

  cancion: Cancion | null = null;
  audioUrl: SafeUrl | null = null;
  currentUserID: number | null = null;
  showDeleteButton: boolean = false;
  comentarios: Comentario[] = [];
  playlists: Playlist[] = [];
  uploadedByID: number | null = null;
  playlistForm!: FormGroup;
  userId: number | undefined;

  username ?: string;
  user: any;
  isAdmin: boolean = false;
  isSupervisor: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private cancionService: CancionService,
    private comentarioService: ComentarioService,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private playlistService: PlaylistService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.playlistForm = this.formBuilder.group({
      playlist_name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      status: ['PUBLICA']
    });

    this.username = this.authService.getUsername();
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (this.username) {
      this.authService.obtenerTipoUsuario(this.username).subscribe(tipo => {
        this.isAdmin = tipo === 'ADMIN';
        this.isSupervisor = tipo === 'SUPERVISOR';
      });
    }

    const username = this.authService.getUsername();
    this.authService.getUserId(username).subscribe((userId: number | null) => {
      this.currentUserID = userId;
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cancionService.obtenerCancionPorId(Number(id)).subscribe((data: Cancion) => {
        this.cancion = data;
        this.audioUrl = this.sanitizer.bypassSecurityTrustUrl('data:audio/mp3;base64,' + data.audio_file);
        if (this.currentUserID && this.cancion && this.currentUserID === this.cancion.uploaded_by) {
          this.showDeleteButton = true;
        }
        this.cancionService.obtenerIdUsuarioPorIdCancion(this.cancion.songID).subscribe((uploadedByID: number | null) => {
          this.uploadedByID = uploadedByID;
        });
        this.cargarComentarios(Number(id));
      });
    }
    this.authService.getUserId(username).subscribe((userId: number | null) => {
      if (userId) {
        this.playlistService.obtenerPlaylistsPorUsuario(userId).subscribe((playlists: Playlist[]) => {
          this.playlists = playlists;
        });
      }
    });
  }

  cargarComentarios(cancionID: number): void {
    this.comentarioService.obtenerComentariosPorCancion(cancionID).subscribe(
      (comentarios: Comentario[]) => {
        this.comentarios = comentarios;
      },
      (error) => {
        console.error('Error al cargar comentarios:', error);
      }
    );
  }

  abrirModalComentario(): void {
    Swal.fire({
      title: 'Publicar Comentario',
      input: 'textarea',
      inputLabel: 'Escribe tu comentario',
      inputPlaceholder: 'Ingresa tu comentario aquí...',
      showCancelButton: true,
      confirmButtonText: 'Publicar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'El comentario no puede estar vacío';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const comentarioContent = result.value;
        this.publicarComentario(comentarioContent);
      }
    });
  }

  publicarComentario(content: string): void {
    if (this.cancion && this.currentUserID) {
      const comentario: Comentario = {
        content: content,
        user: {
          username: this.username || 'Desconocido'
        }
      };
      const cancionID = this.cancion.songID;
      const userID = this.currentUserID;

      this.authService.getUserRoleId(userID).subscribe(
        (roleID) => {
          if (roleID !== null) {
            this.comentarioService.agregarComentario(cancionID, userID, roleID, comentario).subscribe(
              (nuevoComentario: Comentario) => {
                this.comentarios.push(nuevoComentario);
                Swal.fire({
                  icon: 'success',
                  title: 'Comentario publicado',
                  text: 'Tu comentario ha sido publicado exitosamente.'
                });
              },
              (error) => {
                console.error('Error al publicar comentario:', error);
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'No se pudo publicar el comentario. Inténtalo de nuevo más tarde.'
                });
              }
            );
          } else {
            console.error('No se pudo obtener el Role ID del usuario');
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo obtener el Role ID del usuario. Inténtalo de nuevo más tarde.'
            });
          }
        },
        (error) => {
          console.error('Error al obtener el Role ID del usuario:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener el Role ID del usuario. Inténtalo de nuevo más tarde.'
          });
        }
      );
    }
  }

  openPlaylistModal() {
    // @ts-ignore
    $('#playlistModal').modal('show');
  }

  addToPlaylist(playlistId: number) {
    const cancionId = this.cancion?.songID || 0;
    this.playlistService.addToPlaylist(playlistId, cancionId).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Canción agregada',
          text: 'La canción se agregó correctamente a la playlist.'
        });
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo agregar la canción a la playlist. Inténtalo de nuevo más tarde.'
        });
      }
    );
  }

  modificarCancion() {
    if (this.cancion) {
      this.router.navigate(['/modificar', this.cancion.songID]);
    }
  }

  eliminarCancion() {
    Swal.fire({
      title: 'Confirmar eliminación',
      text: 'Para confirmar la eliminación, escribe "BORRAR" en mayúsculas:',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      preConfirm: (inputText) => {
        if (inputText === 'BORRAR') {
          const cancionId = this.cancion?.songID || 0;
          return this.cancionService.eliminarCancionPlaylist(cancionId).toPromise();
        } else {
          Swal.showValidationMessage('Debes escribir "BORRAR" en mayúsculas para confirmar la eliminación.');
          return undefined;
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Canción eliminada',
          text: 'La canción se ha eliminado correctamente.'
        });
        this.router.navigate(['/']);
      }
    }).catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar la canción. Inténtalo de nuevo más tarde.'
      });
    });
  }
  
  

  onSubmit(): void {
    if (this.playlistForm.invalid) {
      this.toastr.error('Por favor, completa todos los campos del formulario correctamente.', 'Error');
      return;
    }
  
    const playlistData = this.playlistForm.value;
  
    this.playlistService.createPlaylist(playlistData).subscribe(
      () => {
        this.toastr.success('Playlist creado', 'Éxito');
        // Cerrar el modal si es necesario
        document.getElementById('playlistModal')?.click();
      },
      (error) => {
        console.error('Error al crear la playlist:', error);
        this.toastr.error('No se pudo crear la playlist.', 'Error');
      }
    );
  }
  

  getFormControlError(controlName: string, errorType: string): boolean {
    const control = this.playlistForm.get(controlName);
    return control ? control.hasError(errorType) && (control.dirty || control.touched) : false;
  }

  redirigirACrearPlaylist() {
    this.router.navigate(['/crear-playlists']);
  }

  compartirCancion() {
    if (this.cancion) {
      const songUrl = window.location.href;
      navigator.clipboard.writeText(songUrl).then(
        () => {
          this.toastr.success('Enlace copiado al portapapeles', 'Éxito');
        },
        (error) => {
          this.toastr.error('No se pudo copiar el enlace', 'Error');
        }
      );
    }
  }


  eliminarComentario(commentID?: number): void {
    if (commentID !== undefined) {
      Swal.fire({
        title: 'Confirmar eliminación',
        text: '¿Estás seguro de que quieres eliminar este comentario?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6'
      }).then((result) => {
        if (result.isConfirmed) {
          this.comentarioService.eliminarComentario(commentID).subscribe(
            () => {
              this.comentarios = this.comentarios.filter(comentario => comentario.commentID !== commentID);
              Swal.fire({
                icon: 'success',
                title: 'Comentario eliminado',
                text: 'El comentario ha sido eliminado correctamente.'
              });
            },
            (error) => {
              console.error('Error al eliminar el comentario:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar el comentario. Inténtalo de nuevo más tarde.'
              });
            }
          );
        }
      });
    } else {
      console.error('El ID del comentario es undefined');
    }
  }

}
