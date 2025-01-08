import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaProductoComponent } from './producto/lista-producto.component';
import { DetalleProductoComponent } from './producto/detalle-producto.component';
import { NuevoProductoComponent } from './producto/nuevo-producto.component';
import { EditarProductoComponent } from './producto/editar-producto.component';

const routes: Routes = [
  {path: '', component: ListaProductoComponent},
  {path: 'detail/id', component: DetalleProductoComponent},
  {path: 'nuevo', component: NuevoProductoComponent},
  {path: 'editar/id', component: EditarProductoComponent},
  {path: '**', redirectTo:' ',  pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
