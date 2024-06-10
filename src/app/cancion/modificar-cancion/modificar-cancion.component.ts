import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cancion } from '../../interfaces/cancion';
import { CancionService } from '../../services/cancion.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-modificar-cancion',
  templateUrl: './modificar-cancion.component.html',
  styleUrls: ['./modificar-cancion.component.css']
})
export class ModificarCancionComponent implements OnInit {


//AHORA HAY QUE HACER EL BORRADO DE LA CANCION, mira que primero este en algun playlist, y borramos primero de esos playlists, sean privados o no

  cancion: Cancion | null = null;

  constructor(
    private route: ActivatedRoute,
    private cancionService: CancionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cancionService.obtenerCancionPorId(Number(id)).subscribe((data: Cancion) => {
        this.cancion = data;
      });
    }
  }

  onSubmit(modificarForm: NgForm) {
    if (this.cancion && this.cancion.songID) {
      this.cancionService.actualizarCancion(this.cancion.songID, this.cancion).subscribe(
        () => {
          this.router.navigate(['/cancion', this.cancion!.songID]);
        },
        (error) => {
          console.error('Error al modificar la canción', error);
        }
      );
    } else {
      console.error('No se puede actualizar la canción porque la canción o su ID es nulo.');
    }
  }
}
