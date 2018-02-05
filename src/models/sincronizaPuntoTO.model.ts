export class SincronizaPuntoTO{

  idPuntoInspeccion:string;
  nombrePunto:string;
  valorIngresado:string;
  observaciones:string;
  nombreImagen:string;
  imagen:string;

  constructor(
              idPuntoInspeccion:string,
              nombrePunto:string,
              valorIngresado:string,
              observaciones:string,
              nombreImagen:string,
              imagen:string

              ){
                this.idPuntoInspeccion = idPuntoInspeccion;
                this.nombrePunto = nombrePunto;
                this.valorIngresado = valorIngresado;
                this.observaciones = observaciones;
                this.nombreImagen = nombreImagen;
                this.imagen = imagen;
              }

}
