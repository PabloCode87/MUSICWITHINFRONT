import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { EventoService } from '../../services/evento.service';
import { AuthService } from '../../services/auth.service';
import { Evento } from '../../interfaces/evento';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evento-list',
  templateUrl: './evento-list.component.html',
  styleUrls: ['./evento-list.component.css']
})
export class EventoListComponent implements OnInit {
  eventos: Evento[] = [];
  userId: number | null = null;
  
  username ?: string;
  user: any;
  isAdmin: boolean = false;

  constructor(private eventoService: EventoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerEventos();
    this.obtenerUsuarioConectado();
    this.username = this.authService.getUsername();
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (this.username) {
      this.authService.obtenerTipoUsuario(this.username).subscribe(tipo => {
        this.isAdmin = tipo === 'ADMIN';
      });
    }
  }

  obtenerEventos(): void {
    this.eventoService.obtenerTodosLosEventos().subscribe({
      next: (eventos) => {
        this.eventos = eventos;
      },
      error: (error) => {
        console.error('Error al obtener los eventos', error);
      }
    });
  }

  obtenerUsuarioConectado(): void {
    const username = this.authService.getUsername();
    if (username) {
      this.authService.getUserId(username).subscribe({
        next: (userId) => {
          this.userId = userId;
        },
        error: (error) => {
          console.error('Error al obtener el ID del usuario conectado', error);
        }
      });
    }
  }

  eliminarEvento(eventoID: number | undefined): void {
    if (eventoID !== undefined) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "Escribe BORRAR para confirmar la eliminación",
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        showLoaderOnConfirm: true,
        preConfirm: (inputValue) => {
          if (inputValue !== 'BORRAR') {
            Swal.showValidationMessage(
              'Debes escribir BORRAR para confirmar'
            );
            return false;
          }
          return true;
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed && result.value === true) {
          this.eventoService.eliminarEvento(eventoID).subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Evento eliminado',
                showConfirmButton: false,
                timer: 1500
              });
              this.obtenerEventos();
            },
            error: (error) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar el evento',
              });
              console.error('Error al eliminar el evento', error);
            }
          });
        }
      });
    } else {
      console.error('EventoID no puede ser undefined');
    }
  }

  unirseEvento(eventoID: number | undefined): void {
    if (eventoID !== undefined && this.userId !== null) {
      this.eventoService.unirseEvento(eventoID, this.userId).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Se unió al evento',
            showConfirmButton: false,
            timer: 1500
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo unir al evento',
          });
          console.error('Error al unirse al evento', error);
        }
      });
    } else {
      console.error('EventoID or userId cannot be undefined or null');
    }
  }
  

  salirseEvento(eventoID: number | undefined): void {
    if (eventoID !== undefined && this.userId !== null) {
      Swal.fire({
        title: '¿Estás seguro de que quieres dejar el evento?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.eventoService.salirseEvento(eventoID, this.userId!).subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Saliste del evento',
                showConfirmButton: false,
                timer: 1500
              });
            },
            error: (error) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo salir del evento',
              });
              console.error('Error al salir del evento', error);
            }
          });
        }
      });
    } else {
      console.error('EventoID or userId cannot be undefined or null');
    }
  }

  detallesEvento(eventoID: number | undefined): void {
    if (eventoID !== undefined) {
      this.router.navigate(['/evento', eventoID]);
    } else {
      console.error('EventoID no puede ser undefined');
    }
  }

}
