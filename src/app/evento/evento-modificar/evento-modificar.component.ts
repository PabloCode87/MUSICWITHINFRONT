import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../interfaces/evento';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-evento',
  templateUrl: './evento-modificar.component.html',
  styleUrls: ['./evento-modificar.component.css']
})
export class ModificarEventoComponent implements OnInit {
  evento: Evento = {
    eventoID: 0,
    nombre_evento: '',
    fecha_creacion: new Date(),
    lugar_evento: '',
    userID: 0
  };
  fechaCreacionInput: string = '';

  constructor(
    private eventoService: EventoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const eventoID = +this.route.snapshot.paramMap.get('id')!;
    this.eventoService.obtenerEventoPorID(eventoID).subscribe({
      next: (evento) => {
        this.evento = evento;
        this.fechaCreacionInput = this.formatDateForInput(evento.fecha_creacion);
      },
      error: (error) => {
        console.error('Error al obtener el evento', error);
      }
    });
  }

  formatDateForInput(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  onSubmit(): void {
    this.evento.fecha_creacion = new Date(this.fechaCreacionInput);
    if (this.evento.eventoID !== undefined) {
      this.eventoService.modificarEvento(this.evento.eventoID, this.evento).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Evento modificado',
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigate(['/eventos']);
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo modificar el evento',
          });
          console.error('Error al modificar el evento', error);
        }
      });
    } else {
      console.error('eventoID no puede ser undefined');
    }
  }
}
