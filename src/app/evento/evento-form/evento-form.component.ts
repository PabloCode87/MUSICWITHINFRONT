import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventoService } from '../../services/evento.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evento-form',
  templateUrl: './evento-form.component.html',
  styleUrls: ['./evento-form.component.css']
})
export class EventoFormComponent implements OnInit {
  eventoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private eventoService: EventoService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.eventoForm = this.fb.group({
      nombre_evento: ['', [Validators.required, Validators.minLength(3)]],
      fecha_creacion: ['', Validators.required],
      lugar_evento: ['', [Validators.required, Validators.minLength(3)]],
      userID: [{ value: '', disabled: true }, Validators.required]
    });
  }

  ngOnInit(): void {
    const username = this.authService.getUsername();
    if (username) {
      this.authService.getUserId(username).subscribe({
        next: (userId) => {
          this.eventoForm.patchValue({ userID: userId ? userId : 0 });
        },
        error: (error) => {
          console.error('Error al obtener el ID del usuario conectado', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.eventoForm.valid) {
      const evento = this.eventoForm.getRawValue(); // obtener valores incluidos los deshabilitados
      this.eventoService.crearEvento(evento).subscribe({
        next: (response) => {
          this.toastr.success('Evento creado con éxito', 'Éxito');
          this.router.navigate(['/eventos']);
        },
        error: (error) => {
          this.toastr.error('Error al crear el evento', 'Error');
          console.error('Error al crear el evento', error);
        }
      });
    }
  }
}
