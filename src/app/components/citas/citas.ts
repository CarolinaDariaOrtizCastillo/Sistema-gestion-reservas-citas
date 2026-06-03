import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';

// Interfaz para definir la estructura de la Cita
interface Cita {
  id: number;
  nombre: string;
  DNI: string;
  celular: string;
  fecha: string;
  hora: string;
  servicio: string;
}

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './citas.html',
  styleUrls: ['./citas.css']
})
export class CitasComponent implements OnInit {
  citaForm!: FormGroup;
  listaCitas: Cita[] = []; // Base de datos en memoria
  isEditing: boolean = false;
  editingId: number | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    // Citas iniciales de prueba (Opcional)
    this.listaCitas = [
      { id: 1, nombre: 'Ana García', DNI: '12345678', celular: '988351223', fecha: '2026-06-15', hora: '10:00', servicio: 'Consultoría Médica' },
      { id: 2, nombre: 'Carlos López', DNI: '87654321', celular: '914061267', fecha: '2026-06-20', hora: '15:30', servicio: 'Corte de Cabello' }
    ];
  }

  // Inicialización del Formulario Reactivo con Validaciones
  initForm(): void {
    this.citaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      DNI: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]], // Exactamente 8 dígitos
      celular: ['', [Validators.required, Validators.pattern('^[0-9]{9}$'), Validators.pattern('^9.*$')]], // Exactamente 9 dígitos
      fecha: ['', [Validators.required, this.fechaFuturaValidator]], // Validación personalizada
      hora: ['', Validators.required],
      servicio: ['', Validators.required]
    });
  }

  // VALIDACIÓN PERSONALIZADA: La fecha no puede ser anterior a la actual
  fechaFuturaValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const fechaSeleccionada = new Date(control.value + 'T00:00:00');
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);
    return fechaSeleccionada < fechaActual ? { fechaPasada: true } : null;
  }

  // Guardar o Actualizar Cita (CREATE / UPDATE)
  onSubmit(): void {
    if (this.citaForm.invalid) {
      this.citaForm.markAllAsTouched();
      return;
    }

    const datosCita = this.citaForm.value;

    if (this.isEditing && this.editingId !== null) {
      const index = this.listaCitas.findIndex(c => c.id === this.editingId);
      if (index !== -1) {
        this.listaCitas[index] = { id: this.editingId, ...datosCita };
      }
      this.isEditing = false;
      this.editingId = null;
    } else {
      const nuevaCita: Cita = {
        id: Date.now(),
        ...datosCita
      };
      this.listaCitas.push(nuevaCita);
    }
    this.citaForm.reset();
  }

  onEdit(cita: Cita): void {
    this.isEditing = true;
    this.editingId = cita.id;
    this.citaForm.patchValue({
      nombre: cita.nombre,
      DNI: cita.DNI,
      celular: cita.celular,
      fecha: cita.fecha,
      hora: cita.hora,
      servicio: cita.servicio
    });
  }

  onDelete(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
      this.listaCitas = this.listaCitas.filter(cita => cita.id !== id);
    }
  }

  cancelarEdicion(): void {
    this.isEditing = false;
    this.editingId = null;
    this.citaForm.reset();
  }
}