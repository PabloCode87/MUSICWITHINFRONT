import { Component, OnInit } from '@angular/core';
import { Evento } from '../../interfaces/evento'; // Update path if Evento is in a different location
import { EventoService } from '../../services/evento.service'; // Update path if EventoService is in a different location
import { ActivatedRoute } from '@angular/router';
import { Usuario } from '../../interfaces/usuario'; // Update path if Usuario is in a different location

@Component({
  selector: 'app-evento-detalle',
  templateUrl: './evento-detalle.component.html',
  styleUrls: ['./evento-detalle.component.css']
})
export class EventoDetalleComponent implements OnInit {

  evento: Evento | undefined;
  usuariosAsistentes: Usuario[] = [];

  constructor(
    private eventoService: EventoService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const eventoID = parseInt(this.activatedRoute.snapshot.params['id']);
    this.eventoService.obtenerEventoPorID(eventoID)
      .subscribe(evento => {
        this.evento = evento;
        if (evento.usuariosAsistentes && Array.isArray(evento.usuariosAsistentes)) {
          this.usuariosAsistentes = evento.usuariosAsistentes as Usuario[];
        } else {
          this.usuariosAsistentes = [];
        }
      });
}


  obtenerUsuariosAsistentes(eventoID: number) {
    this.eventoService.obtenerUsuariosAsistentes(eventoID)
      .subscribe(usuarios => this.usuariosAsistentes = usuarios);
  }
}
