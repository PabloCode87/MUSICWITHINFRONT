import { Component, OnInit } from '@angular/core';
import { Evento } from '../../interfaces/evento';
import { EventoService } from '../../services/evento.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evento-busqueda',
  templateUrl: './evento-busqueda.component.html',
  styleUrls: ['./evento-busqueda.component.css']
})
export class EventoBusquedaComponent implements OnInit {

  eventos: Evento[] = [];
  nombreEvento: string = '';
  fechaCreacion: Date | null = null;
  lugarEvento: string = '';

  constructor(private eventoService: EventoService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  buscarEventos() {
    const fechaCreacionToSend = this.fechaCreacion ? this.fechaCreacion : undefined;
    this.eventoService.buscarEventos(this.nombreEvento, fechaCreacionToSend, this.lugarEvento)
      .subscribe(eventos => {
        if (eventos.length === 0) {
          this.mostrarToastSinResultados();
        }
        this.eventos = eventos;
      });
  }

  mostrarToastSinResultados() {
    this.toastr.info('No se encontraron eventos con los parámetros proporcionados. Por favor,intente con diferentes parámetros.', 'Sin resultados', {
      closeButton: true,
      timeOut: 2000
    });
  }
}
