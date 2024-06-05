import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  username ?: string;
  user: any;
  isAdmin: boolean = false;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.username = this.auth.getUsername();
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (this.username) {
      this.auth.obtenerTipoUsuario(this.username).subscribe(tipo => {
        this.isAdmin = tipo === 'ADMIN';
      });
    }
  }

  logout(): void {
    this.auth.logout();
  }
}
