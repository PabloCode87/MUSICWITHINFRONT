import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  submitted: boolean = false;
  userForm!: FormGroup;
  backgroundImage: string = '../../../assets/images/login/background-login1.jpg';

  constructor(
    private formBuilder: FormBuilder,
    private loginService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.minLength(4)]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }
  
    this.loginService.login(this.userForm.value.username, this.userForm.value.password).subscribe(
      (response) => {
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('username', this.userForm.value.username);
        sessionStorage.setItem('password', this.userForm.value.password);
        
        // Get user details after successful login
        this.loginService.getUserByUsername(this.userForm.value.username).subscribe(
          (user) => {
            sessionStorage.setItem('user', JSON.stringify(user));
            this.toastr.success(`¡Bienvenido ${this.userForm.value.username}!`, 'Login exitoso');
            this.router.navigate(['/lista-albumnes']).then(() => {
              window.location.reload();
            });
          },
          (error) => {
            this.toastr.error('Error al obtener los datos del usuario', 'Error');
          }
        );
      },
      (error) => {
        this.toastr.error('Login incorrecto, intentelo de nuevo', 'Usuario Incorrecto');
      }
    );
  }
  
  onRecoverPassword() {
    Swal.fire({
      title: 'Recuperar Contraseña',
      html: `
        <input type="text" id="username" class="swal2-input" placeholder="Usuario">
        <input type="email" id="email" class="swal2-input" placeholder="Email">
      `,
      confirmButtonText: 'Recuperar',
      focusConfirm: false,
      preConfirm: () => {
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        if (!username || !email) {
          Swal.showValidationMessage('Por favor, ingrese usuario y email');
        }
        return { username: username, email: email };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.loginService.recoverPassword(result.value.username, result.value.email).subscribe(
          (response) => {
            Swal.fire('Recuperación Exitosa', `Password enviado al email: ${result.value.email}`, 'success');
          },
          (error) => {
            Swal.fire('Error', 'No se pudo recuperar la contraseña. Verifique los datos ingresados', 'error');
          }
        );
      }
    });
  }
  

  navigateToCreateUser() {
    this.router.navigate(['/crear-usuario']);
  }

}
