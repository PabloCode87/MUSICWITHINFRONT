import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CancionService } from '../../services/cancion.service';
import { Cancion } from '../../interfaces/cancion';

@Component({
  selector: 'app-buscar-canciones',
  templateUrl: './buscar-canciones.component.html',
  styleUrls: ['./buscar-canciones.component.css']
})
export class BuscarCancionesComponent implements OnInit {
  songName: string = '';
  artist: string = '';
  genre: string = '';
  canciones: Cancion[] = [];
  generos: string[] = [];
  showNoResults: boolean = false;

  constructor(private cancionService: CancionService, private router: Router) { }
  ngOnInit(): void {
    this.obtenerGeneros();
  }

  obtenerGeneros(): void {
    this.cancionService.todosLosGeneros().subscribe(
      generos => {
        this.generos = generos;
      },
      error => {
        console.error('Error al obtener los géneros:', error);
      }
    );
  }

  buscarCanciones(): void {
    this.cancionService.buscarCancionesPorFiltros(this.songName, this.artist, this.genre)
      .subscribe(
        (data: Cancion[]) => {
          this.canciones = data;
          if (this.canciones.length === 0) {
            setTimeout(() => {
              this.showNoResults = true;
            }, 8000); // 8 segundos
          }
        },
        (error) => {
          console.error('Error al buscar canciones:', error);
        }
      );
  }

  verDetalleCancion(cancionId: number): void {
    // Navegar a la URL de detalle de la canción
    this.router.navigate(['/cancion', cancionId]);
  }
}
