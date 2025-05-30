import { Component, inject, Input, OnInit } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmpleadoService } from '@app/Services/empleado.service';
import { Empleado } from '@app/Models/Empleado';

@Component({
  selector: 'app-empleado',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './empleado.component.html',
  styleUrl: './empleado.component.css'
})
export class EmpleadoComponent implements OnInit {

  @Input('id') idEmpleado!: number;
  private empleadoServicio = inject(EmpleadoService)
  public formBuild = inject(FormBuilder);

  public formEmpleado: FormGroup = this.formBuild.group({
    nombreCompleto: [""],
    correo: [""],
    sueldo: [0],
    fechaContrato: [""]
  });


  constructor(private router: Router) {

  }

  ngOnInit(): void {
    if (this.idEmpleado != 0) {
      this.empleadoServicio.obtener(this.idEmpleado).subscribe({
        next: (data) => {
          this.formEmpleado.patchValue({
            nombreCompleto: data.nombreCompleto,
            correo: data.correo,
            sueldo: data.sueldo,
            fechaContrato: data.fechaContrato
          })
        },
        error: (e) => { console.log(e.message) }
      })
    }
  }

  guardar() {
    const objeto: Empleado = {
      idEmpleado: this.idEmpleado,
      nombreCompleto: this.formEmpleado.value.nombreCompleto,
      correo: this.formEmpleado.value.correo,
      sueldo: this.formEmpleado.value.sueldo,
      fechaContrato: this.formEmpleado.value.fechaContrato,
    }

    if (this.idEmpleado == 0) {
      this.empleadoServicio.crear(objeto).subscribe({
        next: (data) => {
          if (data.isSuccess) {
            this.router.navigate(["/"]);
          } else {
            alert("Error al crear")
          }
        },
        error: (e) => { console.log(e.message) }
      })
    } else {
      this.empleadoServicio.editar(objeto).subscribe({
        next: (data) => {
          if (data.isSuccess) {
            this.router.navigate(["/"]);
          } else {
            alert("Error al editar")
          }
        },
        error: (e) => { console.log(e.message) }
      })
    }
  }

  volver() {
    this.router.navigate(["/"]);
  }

}
