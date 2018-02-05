import { PuntoInspeccionTO } from "./puntoInspeccionTO.model";

export class EquipoTO{

  codigoSAP:string;
  idEquipo:string;
  nombre:string;
  notifica:string;
  referenciaFabricante:string;
  referenciaFisica:string;
  color:boolean;
  observacion:string;
  imagen:string;
  imagenMovil:string;
  listaPuntoInspeccion:PuntoInspeccionTO[] = [];

  constructor(
                codigoSAP:string,
                idEquipo:string,
                nombre:string,
                notifica:string,
                referenciaFabricante:string,
                referenciaFisica:string,
                color:boolean,
                observacion:string,
                imagen:string,
                imagenMovil:string,
                listaPuntoInspeccion:PuntoInspeccionTO[]

              ){
                this.codigoSAP = codigoSAP;
                this.idEquipo = idEquipo;
                this.nombre = nombre;
                this.notifica = notifica;
                this.referenciaFabricante = referenciaFabricante;
                this.referenciaFisica = referenciaFisica;
                this.color = color;
                this.observacion = observacion;
                this.imagen = imagen;
                this.imagenMovil = imagenMovil;
                this.listaPuntoInspeccion = listaPuntoInspeccion;

              }

}
