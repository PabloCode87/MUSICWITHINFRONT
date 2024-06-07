import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { FollowerUserService } from '../../services/follwer-user.service';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {
  userForm!: FormGroup;
  user: any;
  followedUsers: any[] = [];
  currentUserID?: number;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private followerUserService: FollowerUserService,
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.userForm = this.formBuilder.group({
      username: [this.user.username || '', [Validators.required, Validators.minLength(3)]],
      nombre: [this.user.nombre || '', [Validators.required, Validators.minLength(3)]],
      apellidos: [this.user.apellidos || '', [Validators.required, Validators.minLength(3)]],
      email: [this.user.email || '', [Validators.required, Validators.email, this.emailValidator]],
      password: ['', [Validators.required, Validators.minLength(6), this.passwordValidator]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator.bind(this) });

    this.authService.getFollowedUsersByUserID(this.user.userID).subscribe(
      users => {
        this.followedUsers = users;
      },
      error => {
        console.error('Error al obtener los usuarios seguidos:', error);
      }
    );
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

  emailValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|es)$/;
    return emailPattern.test(email) ? null : { invalidEmail: true };
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const passwordPattern = /^(?=.*[0-9]).{6,}$/;
    return passwordPattern.test(password) ? null : { invalidPassword: true };
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('confirmPassword');
    if (passwordControl && confirmPasswordControl) {
      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    }
  }

  getFormControlError(controlName: string, errorType: string): boolean {
    const control = this.userForm.get(controlName);
    return control ? control.hasError(errorType) && (control.dirty || control.touched) : false;
  }

  onDelete(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      input: 'text',
      inputLabel: 'Escribe "BORRAR" en mayúsculas',
      inputPlaceholder: 'Escribe "BORRAR"',
      inputAttributes: {
        'aria-label': 'Escribe "BORRAR"',
        required: 'true'
      },
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      preConfirm: (inputText) => {
        if (!inputText || inputText !== 'BORRAR') {
          Swal.showValidationMessage('Debes escribir "BORRAR" en mayúsculas');
        }
        return inputText;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const usuarioID = this.user.userID;
        this.authService.eliminarUsuario(usuarioID).subscribe(
          response => {
            this.authService.logout();
          },
          error => {
            this.toastr.error('Error al eliminar el usuario', 'Error');
          }
        );
      }
    });
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.toastr.error('Por favor, corrija los errores en el formulario', 'Error');
      return;
    }

    const usuarioID = this.user.userID;
    const usuarioActualizado = { ...this.user, ...this.userForm.value };

    usuarioActualizado.password_hash = usuarioActualizado.password;
    delete usuarioActualizado.password;
    delete usuarioActualizado.confirmPassword;

    this.authService.actualizarUsuario(usuarioID, usuarioActualizado).subscribe(
      (response) => {
        this.toastr.success('Usuario actualizado con éxito', 'Éxito');
      },
      (error) => {
        console.error('Error al actualizar el usuario:', error);
        this.toastr.error('Error al actualizar el usuario', 'Error');
      }
    );
  }

  onChangePhotoClick(): void {
    const fileInput = document.getElementById('foto') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Validar el tipo de archivo
      if (file.type !== 'image/png') {
        this.toastr.error('Por favor, selecciona un archivo PNG', 'Error');
        return;
      }
  
      const formData = new FormData();
      formData.append('foto', file);
      const usuarioID = this.user.userID;
      this.authService.uploadPhoto(usuarioID, formData).subscribe(
        (response) => {
          this.toastr.success('Foto actualizada con éxito', 'Éxito');
          // Suponiendo que la respuesta contiene la imagen en base64
          this.user.foto = response.fotoBase64;
          sessionStorage.setItem('user', JSON.stringify(this.user));  // Actualizar el sessionStorage
        },
        (error) => {
          console.error('Error al actualizar la foto:', error);
          this.toastr.error('Error al actualizar la foto', 'Error');
        }
      );
    }
  }
  
  
}
