import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FollowerUserService } from '../../services/follwer-user.service';

@Component({
  selector: 'app-buscar-usuario',
  templateUrl: './buscar-usuario.component.html',
  styleUrls: ['./buscar-usuario.component.css']
})
export class BuscarUsuarioComponent implements OnInit {

  usuarios: any[] = [];
  keyword: string = '';
  currentUserID?: number;

  constructor(
    private authService: AuthService,
    private followerUserService: FollowerUserService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const username = this.authService.getUsername();
    this.authService.getUserId(username).subscribe(
      (userID) => {
        if (userID !== null) {
          this.currentUserID = userID;
        } else {
          this.toastr.error('No se pudo obtener el ID del usuario');
        }
      },
      (error) => {
        this.toastr.error('Error al obtener el ID del usuario');
        console.error('Error al obtener el ID del usuario:', error);
      }
    );
  }

  buscarUsuarios() {
    this.authService.buscarUsuarios(this.keyword).subscribe(
      (usuarios) => {
        this.usuarios = usuarios;
      },
      (error) => {
        this.toastr.error('Error al buscar usuarios');
        console.error('Error al buscar usuarios:', error);
      }
    );
  }

  seguirUsuario(userID: number) {
    if (this.currentUserID !== undefined) {
      this.followerUserService.seguirUsuario(this.currentUserID, userID).subscribe(
        () => {
          this.toastr.success(`Ahora sigues a ${userID}`);
        },
        (error) => {
          this.toastr.error('Error al seguir usuario');
          console.error('Error al seguir usuario:', error);
        }
      );
    } else {
      this.toastr.error('El ID del usuario actual es undefined');
    }
  }

  dejarDeSeguirUsuario(userID: number) {
    if (this.currentUserID !== undefined) {
      this.followerUserService.dejarDeSeguirUsuario(this.currentUserID, userID).subscribe(
        () => {
          this.toastr.success(`Dejaste de seguir a ${userID}`);
        },
        (error) => {
          this.toastr.error('Error al dejar de seguir usuario');
          console.error('Error al dejar de seguir usuario:', error);
        }
      );
    } else {
      this.toastr.error('El ID del usuario actual es undefined');
    }
  }
}
