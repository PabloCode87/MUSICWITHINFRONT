import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-crearusuario',
  templateUrl: './crearusuario.component.html',
  styleUrls: ['./crearusuario.component.css']
})
export class CrearusuarioComponent implements OnInit {
  crearUsuarioForm!: FormGroup;
  roleId: number = 2;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.crearUsuarioForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      foto: ['']
    }, { validator: this.checkEmailsAndPasswords });
  }

  onSubmit(): void {
    if (this.crearUsuarioForm.invalid) {
      this.toastr.error('Por favor, completa todos los campos del formulario correctamente.', 'Error');
      return;
    }
  
    const formData = {
      username: this.crearUsuarioForm.get('username')?.value,
      email: this.crearUsuarioForm.get('email')?.value,
      password_hash: this.crearUsuarioForm.get('password')?.value,
      nombre: this.crearUsuarioForm.get('nombre')?.value,
      apellidos: this.crearUsuarioForm.get('apellidos')?.value,
      roleID: this.roleId,
      fecha_creacion: formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'en-US'),
      foto: ''
    };
  
    const fotoControl = this.crearUsuarioForm.get('foto');
    if (fotoControl && fotoControl.value) {
      const file = (fotoControl.value as FileList)[0];
      this.convertFileToBase64(file).then((base64: string) => {
        formData.foto = base64;
        this.submitForm(formData);
      });
    } else {
      this.submitForm(formData);
    }
  }

  getFormControlError(controlName: string, errorName: string): boolean {
    const control = this.crearUsuarioForm.get(controlName);
    if (!control) {
      return false;
    }
    return control.hasError(errorName) && (control.dirty || control.touched);
  }

  checkEmailsAndPasswords(group: AbstractControl) {
    const emailControl = group.get('email');
    const confirmEmailControl = group.get('confirmEmail');
    const passwordControl = group.get('password');
    const confirmPasswordControl = group.get('confirmPassword');

    if (!emailControl || !confirmEmailControl || !passwordControl || !confirmPasswordControl) {
        return null; // If any control is missing, we don't perform validation.
    }

    const email = emailControl.value;
    const confirmEmail = confirmEmailControl.value;
    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    return email === confirmEmail && password === confirmPassword ? null : {
        emailMismatch: email !== confirmEmail,
        passwordMismatch: password !== confirmPassword
    };
}

submitForm(formData: any): void {
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
    return null;
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  convertFileToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }
}
