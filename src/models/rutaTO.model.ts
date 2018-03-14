import { EquipoTO } from "./EquipoTO.model";

export class RutaTO{

  idRuta:string;
  idRutaEjecucion:string;
  fechaCierre:string;
  nombre:string;
  idUsuario:string;
  sincronizado:boolean;
  cerrado:boolean;
  descartado:boolean;
  comentarios:string;
  idCentral:string;
  pendiente:boolean;
  iniciado:boolean;
  listaEquipos:EquipoTO[] = [];

  constructor(  idRuta:string,
                idRutaEjecucion:string,
                fechaCierre:string,
                nombre:string,
                idUsuario:string,
                sincronizado:boolean,
                cerrado:boolean,
                descartado:boolean,
                comentarios:string,
                idCentral:string,
                pendiente:boolean,
                iniciado:boolean,
                listaEquipos:EquipoTO[]

              ){
                  this.idRuta = idRuta;
                  this.idRutaEjecucion = idRutaEjecucion;
                  this.fechaCierre = fechaCierre;
                  this.nombre = nombre;
                  this.idUsuario = idUsuario;
                  this.sincronizado = sincronizado;
                  this.cerrado = cerrado;
                  this.descartado = descartado;
                  this.comentarios = comentarios;
                  this.idCentral = idCentral;
                  this.pendiente = pendiente;
                  this.iniciado = iniciado;
                  this.listaEquipos = listaEquipos;
                }

}
