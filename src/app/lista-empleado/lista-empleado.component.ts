import { Component, OnInit } from '@angular/core';
import { Empleado } from '../empleado';

@Component({
  selector: 'app-lista-empleado',
 
  templateUrl: './lista-empleado.component.html',
  styleUrl: './lista-empleado.component.css'
})
export class ListaEmpleadoComponent  implements OnInit{
 empleados:Empleado[];
  constructor(){}
  ngOnInit(): void {
    this.empleados=[{
        "id":1,
        "nombre": "mario",
        "apellido":"toriz",
        "email":"mario1@gmail.com"


    },{

      "id":2,
        "nombre": "liri",
        "apellido":"liro",
        "email":"liorq@gmail.com"




    }  ];
  }

}
