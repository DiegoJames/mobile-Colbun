import { SincronizaPuntoTO } from "./sincronizaPuntoTO.model";

export class SincronizaEquipoTO{

  idEquipo:string;
  nombreEquipo:string;
  observaciones:string;
  nombreImagen:string;
  imagen:string;
  notifica:string;
  listaPuntos:SincronizaPuntoTO[] = [];

  constructor(
              idEquipo:string,
              nombreEquipo:string,
              observaciones:string,
              nombreImagen:string,
              imagen:string,
              notifica:string,
              listaPuntos:SincronizaPuntoTO[]

              ){
                this.idEquipo = idEquipo;
                this.nombreEquipo = nombreEquipo;
                this.observaciones = observaciones;
                this.nombreImagen = nombreImagen;
                this.imagen = imagen;
                this.notifica = notifica;
                this.listaPuntos = listaPuntos;

              }

}
