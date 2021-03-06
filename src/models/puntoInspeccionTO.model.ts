import { ValorSeleccionTO } from "./valorSeleccionTO.model";

export class PuntoInspeccionTO{

  esSeleccion:string;
  idPuntoInspeccion:string;
  idTipoPunto:string;
  referenciaFisica:string;
  tipoPunto:string;
  unidadMedida:string;
  valorAlerta:string;
  valorMaximo:string;
  valorMinimo:string;
  guardado:boolean;
  observacion:string;
  imagen:string;
  imagenMovil:string;
  valorMedida:string;
  valorUltimaLectura:string;
  listaValoresSeleccion:ValorSeleccionTO[] = [];

  constructor(
                esSeleccion:string,
                idPuntoInspeccion:string,
                idTipoPunto:string,
                referenciaFisica:string,
                tipoPunto:string,
                unidadMedida:string,
                valorAlerta:string,
                valorMaximo:string,
                valorMinimo:string,
                guardado:boolean,
                observacion:string,
                imagen:string,
                imagenMovil:string,
                valorMedida:string,
                valorUltimaLectura:string,
                listaValoresSeleccion:ValorSeleccionTO[]

              ){

                this.esSeleccion = esSeleccion;
                this.idPuntoInspeccion = idPuntoInspeccion;
                this.idTipoPunto = idTipoPunto;
                this.referenciaFisica = referenciaFisica;
                this.tipoPunto = tipoPunto;
                this.unidadMedida = unidadMedida;
                this.valorAlerta = valorAlerta;
                this.valorMaximo = valorMaximo;
                this.valorMinimo = valorMinimo;
                this.guardado = guardado;
                this.observacion = observacion;
                this.imagen = imagen;
                this.imagenMovil = imagenMovil;
                this.valorMedida = valorMedida;
                this.valorUltimaLectura = valorUltimaLectura;
                this.listaValoresSeleccion = listaValoresSeleccion;

              }

}
