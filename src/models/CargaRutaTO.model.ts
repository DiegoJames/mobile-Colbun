export class CargaRutaTO{

  idRuta:string;
  nombre:string;
  bloqueado:boolean;
  //idRutaEjecucion:string;
  //idCentral:string;

  constructor( idRuta:string,
                nombre:string,
                bloqueado:boolean,
                //idRutaEjecucion:string,
                //idCentral:string
              ){

                this.idRuta = idRuta;
                this.nombre = nombre;
                this.bloqueado = bloqueado;
                //this.idRutaEjecucion = idRutaEjecucion;
                //this.idCentral = idCentral;
                }

}
