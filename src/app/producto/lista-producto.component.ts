import { Component, OnInit } from '@angular/core';
import { Producto } from '../models/producto';
import { ProductoService } from '../service/producto.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lista-producto',
  standalone: false,
  templateUrl: './lista-producto.component.html',
  styleUrl: './lista-producto.component.css'
})
export class ListaProductoComponent  implements OnInit{

    productos: Producto[] = [];

  //constructor(private productoService: ProductoService){}

  constructor(
      private productoService: ProductoService,
      private toastr: ToastrService
      //private router: Router
    ) {}
  
  ngOnInit() {
    this.cargarProductos();

      
  }

  cargarProductos(): void{
    this.productoService.lista().subscribe(

      data =>{
        this.productos=data;
      },
      err =>{
        console.log(err);
      }

    );
    
    
  } 
  /*  
  } 
  borrar(id?: number) {
   /* console.log('Eliminar producto con ID:', id);
  alert("borrar el" + id); 
  this.productoService.delete().subscribe(
    err =>{
      this.toastr.success('Producto eliminado', 'Ok', {
        timeOut: 3000,positionClass: 'toast-top-center'
      });
      this.cargarProductos();
    },
     
    err =>{

      this.toastr.error
            (err.error.mensaje, 'Fail', {
              timeOut: 3000, positionClass: 'toast-top-center'
            });   
    }
  );
  } */
  borrar(id?: number) {
    if (id !== undefined) { 
        this.productoService.delete(id).subscribe(
            () => { 
                this.toastr.success('Producto eliminado', 'Ok', {
                    timeOut: 3000, positionClass: 'toast-top-center'
                });
                this.cargarProductos(); 
            },
            err => {
                this.toastr.error(err.error.mensaje, 'Fail', {
                    timeOut: 3000, positionClass: 'toast-top-center'
                });
            }
        );
    } else {
        // Handle the case where 'id' is undefined (optional)
        console.error('No product ID provided for deletion.'); 
        // You can display an error message to the user here
    }
}
}
