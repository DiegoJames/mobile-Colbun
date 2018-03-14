import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx"
import { AlertController, ModalController } from 'ionic-angular';

import { URL_SERVICIO_RUTAS, URL_SERVICIO_EQUIPOS } from "../../config/url.servicios";

import { EquipoProvider }  from "../index.providers";

import { RutaTO } from "../../models/RutaTO.model";

import { CantidadEquipoTO } from "../../models/cantidadEquipoTO.model";

import { EquipoTO } from "../../models/EquipoTO.model";

import { PuntoInspeccionTO } from "../../models/puntoInspeccionTO.model";

import { ValorSeleccionTO } from "../../models/valorSeleccionTO.model";

@Injectable()
export class RutaProvider {

  idEjecucionRuta:string;
  btnHabilitado:boolean = false;
  dataRuta:any;
  dataEquipo:any;
  notificacion:boolean = false;
  equipoEnRuta:boolean = false;
  idRuta:string;
  nombreRuta:string = "";

  equipoTO:EquipoTO;
  listaEquipos:EquipoTO[];
  puntoInspeccion:PuntoInspeccionTO;
  listaValoresSeleccion:ValorSeleccionTO[];
  cantidadTO:CantidadEquipoTO[];
  scan:boolean = true;

  //nombreSinEquipos:string = "";
  //cantidadDeEquipo:number = 0;

  constructor(public http: Http,
              public equipoProvider: EquipoProvider,
              public alertCtrl: AlertController,
              private modalCtrl: ModalController) {}

  activo():boolean{
    if( this.idRuta ){
      return true;
    }else{
      return false;
    }
  }

  cargar_equipos(id:string){

    return new Promise((resolve, reject) => {

      console.log( "CARGA EQUIPOS-IDRUTA: "+ id);
      let datos = { 'idRuta':id }
      let headers = new Headers({
      'Content-Type': 'application/json'
      });
      let options = new RequestOptions({
        headers: headers
      });

      this.http.post( URL_SERVICIO_EQUIPOS +"/obtieneCatalogoEquipo",JSON.stringify(datos), options)
                .map(res => res.json())
                .catch((err: Response) => {
                      // The err.statusText is empty if server down (err.type === 3)
                     console.log((err.statusText || "Can't join the server."));
                     // Really usefull. The app can't catch this in "(err)" closure
                     reject((err.statusText || "Can't join the server."));
                     // This return is required to compile but unuseable in your app
                     return Observable.throw(err);
                   })
                   // The (err) => {} param on subscribe can't catch server down error so I keep only the catch
                   .subscribe(data => { resolve(data) })
               })
    }

  iniciar_ruta(idRuta:string, idUsuario:string){
    return new Promise((resolve, reject) => {
      console.log("INICIA RUTA-IDRUTA: "+idRuta);
      console.log("INICIA RUTA-IDUSUARIO: "+idUsuario);
      let datos = {
                    'idUsuario': idUsuario,
                    'idRuta': idRuta
                  }
      let headers = new Headers({
      'Content-Type': 'application/json'
      });

      let options = new RequestOptions({
        headers: headers
      });

     this.http.post( URL_SERVICIO_RUTAS +"/iniciarRuta",JSON.stringify(datos), options )
               .map(res => res.json())
               .catch((err: Response) => {
                     // The err.statusText is empty if server down (err.type === 3)
                    console.log((err.statusText || "Can't join the server."));
                    // Really usefull. The app can't catch this in "(err)" closure
                    reject((err.statusText || "Can't join the server."));
                    // This return is required to compile but unuseable in your app
                    return Observable.throw(err);
                  })
                  // The (err) => {} param on subscribe can't catch server down error so I keep only the catch
                  .subscribe(data => { resolve(data) })
              })
  }

  ejecucionRuta(dataRuta:any){
    this.dataRuta = dataRuta;
  }

    borrarScanner(scanner){
      this.scan = scanner;
    }

    notifica(notificar:boolean){
      this.notificacion = notificar;
    }

    habilitaBoton(btnHabilitado:boolean){
      this.btnHabilitado = btnHabilitado;
    }

    catalogoEquipo(dataEquipo:any){
      this.dataEquipo = dataEquipo;
    }

    guardarRuta(idRuta:string){
      this.idRuta = idRuta;
    }

    cargarListaEquipos(idRuta:string){
      for(let toRuta of this.equipoProvider.rutasCargadas){
        if(toRuta.idRutaEjecucion != null){
          if(toRuta.idRuta == idRuta){
            this.listaEquipos = [];
            this.nombreRuta = toRuta.nombre;
            for(let toEquipo of toRuta.listaEquipos){
              this.listaEquipos.push(toEquipo);
            }
          }
        }
      }
    }

    cargar_lista_puntos_inspeccion(scanner:string){
      this.equipoEnRuta = false;
      for(let toEquipo of this.listaEquipos){
          if(toEquipo.idEquipo == scanner){
            this.equipoEnRuta = true;
            this.equipoTO = toEquipo;
            }
        }

    }

    cargar_punto_inspeccion(idPunto:string){

      for(let toPunto of this.equipoTO.listaPuntoInspeccion){
        if(toPunto.idPuntoInspeccion == idPunto){
          console.log("idPunto: "+idPunto);
            this.puntoInspeccion = toPunto;

            this.listaValoresSeleccion = toPunto.listaValoresSeleccion;

        }
      }
    }





}
