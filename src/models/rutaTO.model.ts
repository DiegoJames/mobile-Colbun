import { EquipoTO } from "./EquipoTO.model";

export class RutaTO{

  idRuta:string;
  idRutaEjecucion:string;
  fechaCierre:string;
  nombre:string;
  idUsuario:string;
  bloqueado:boolean = false;
  color:boolean;
  comentarios:string;
  idCentral:string;
  listaEquipo:EquipoTO[] = [];

  constructor(  idRuta:string,
                idRutaEjecucion:string,
                fechaCierre:string,
                nombre:string,
                idUsuario:string,
                bloqueado:boolean,
                color:boolean,
                comentarios:string,
                idCentral:string,
                listaEquipo:EquipoTO[]

              ){
                  this.idRuta = idRuta;
                  this.idRutaEjecucion = idRutaEjecucion;
                  this.fechaCierre = fechaCierre;
                  this.nombre = nombre;
                  this.idUsuario = idUsuario;
                  this.bloqueado = bloqueado;
                  this.color = color;
                  this.comentarios = comentarios;
                  this.idCentral = idCentral;
                  this.listaEquipo = listaEquipo;
                }

}
