import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crearusuario',
  templateUrl: './crearusuario.component.html',
  styleUrls: ['./crearusuario.component.css']
})
export class CrearusuarioComponent implements OnInit {
  crearUsuarioForm!: FormGroup;
  roleId: number = 2;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.crearUsuarioForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email, this.emailValidator]],
      confirmEmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), this.passwordValidator]],
      confirmPassword: ['', [Validators.required]],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.minLength(3)]],
      foto: [null]
    }, { validator: this.passwordMatchValidator.bind(this) });

    this.crearUsuarioForm.get('confirmEmail')?.setValidators([Validators.required, this.emailMatchValidator.bind(this)]);
  }

  onSubmit(): void {
    if (this.crearUsuarioForm.invalid) {
      this.toastr.error('Por favor, completa todos los campos del formulario correctamente.', 'Error');
      return;
    }

    const formData = new FormData();
    formData.append('username', this.crearUsuarioForm.get('username')?.value);
    formData.append('email', this.crearUsuarioForm.get('email')?.value);
    formData.append('password_hash', this.crearUsuarioForm.get('password')?.value);
    formData.append('nombre', this.crearUsuarioForm.get('nombre')?.value);
    formData.append('apellidos', this.crearUsuarioForm.get('apellidos')?.value);
    formData.append('roleID', this.roleId.toString());
    formData.append('fecha_creacion', new Date().toISOString());

    const fotoControl = this.crearUsuarioForm.get('foto');
    if (fotoControl && fotoControl.value) {
      const file = (fotoControl.value as FileList)[0];
      this.convertFileToBase64(file).then((base64: string) => {
        formData.append('foto', base64);
        this.submitForm(formData);
      });
    } else {
      this.submitForm(formData);
    }
  }

  submitForm(formData: FormData): void {
    this.authService.crearUsuario(formData).subscribe(
      () => {
        this.toastr.success('Usuario creado correctamente.', 'Éxito');
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Error al crear el usuario:', error);
        this.toastr.error('Se produjo un error al crear el usuario. Por favor, inténtalo de nuevo más tarde.', 'Error');
      }
    );
  }

  emailValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|es)$/;
    return emailPattern.test(email) ? null : { invalidEmail: true };
  }

  emailMatchValidator(control: AbstractControl): ValidationErrors | null {
    const email = this.crearUsuarioForm?.get('email')?.value;
    const confirmEmail = control.value;
    return email === confirmEmail ? null : { emailMismatch: true };
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

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = error => reject(error);
    });
  }

  getFormControlError(controlName: string, errorType: string): boolean {
    const control = this.crearUsuarioForm.get(controlName);
    return control ? control.hasError(errorType) && (control.dirty || control.touched) : false;
  }
}
