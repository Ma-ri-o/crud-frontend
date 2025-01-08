import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../service/producto.service';
import { Producto } from '../models/producto';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-producto',
  standalone: false,
  templateUrl: './nuevo-producto.component.html',
  styleUrl: './nuevo-producto.component.css'
})
export class NuevoProductoComponent implements OnInit {

  nombre: string = '';
  precio: number | null = null;


  constructor(
    private productoService: ProductoService,
    private toastr: ToastrService,
    private router: Router
   ) {}

  ngOnInit(): void {}

  onCreate(): void {
    const producto = new Producto(this.nombre, this.precio ?? 0);
  
    this.productoService.save(producto).subscribe(
      data => {
        this.toastr.success('Producto creado', 'Ok', {
          timeOut: 3000,
        });
        this.router.navigate(['']);
      },
      err => {
//const errorMessage = err.error.mensaje || 'Error desconocido'; // Asegúrate de que el error tenga esa estructura
        this.toastr.error(err.error.mensaje, 'Fail', {
          timeOut: 3000,
        });
        this.router.navigate(['']);
      }
    );
  }
  
}
