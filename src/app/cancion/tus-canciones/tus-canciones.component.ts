import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cancion } from '../../interfaces/cancion';
import { CancionService } from '../../services/cancion.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tus-canciones',
  templateUrl: './tus-canciones.component.html',
  styleUrls: ['./tus-canciones.component.css']
})
export class TusCancionesComponent implements OnInit {

  canciones: Cancion[] = [];

  constructor(
    private cancionService: CancionService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Obtener el objeto almacenado en sessionStorage
    const userData = sessionStorage.getItem('user');

    // Verificar si userData está presente
    if (userData) {
      // Convertir el string JSON a objeto
      const user = JSON.parse(userData);

      // Obtener el userID del objeto
      const userID = user.userID;

      // Llamar a la función para obtener las canciones del usuario
      this.obtenerCancionesUsuario(userID);
    } else {
      console.error('No se encontraron datos de usuario en sessionStorage');
    }
  }

  obtenerCancionesUsuario(userID: number): void {
    // Llamar al servicio para obtener las canciones del usuario
    // Suponiendo que tienes una función en el servicio para obtener las canciones del usuario actual
    this.cancionService.obtenerCancionesUsuario(userID).subscribe(
      (canciones) => {
        this.canciones = canciones;
      },
      (error) => {
        console.error('Error al obtener las canciones del usuario:', error);
      }
    );
  }

  verDetallesCancion(cancionID: number): void {
    // Navegar a la página de detalles de la canción
    this.router.navigate(['/cancion', cancionID]);
  }

}
