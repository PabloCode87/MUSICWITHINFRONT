import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { EventoService } from '../../services/evento.service';
import { AuthService } from '../../services/auth.service';
import { Evento } from '../../interfaces/evento';

@Component({
  selector: 'app-evento-list',
  templateUrl: './evento-list.component.html',
  styleUrls: ['./evento-list.component.css']
})
export class EventoListComponent implements OnInit {
  eventos: Evento[] = [];
  userId: number | null = null;

  constructor(private eventoService: EventoService, private authService: AuthService) {}

  ngOnInit(): void {
    this.obtenerEventos();
    this.obtenerUsuarioConectado();
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
}
