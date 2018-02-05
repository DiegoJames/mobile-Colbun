import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx"

import { RutaTO } from "../../models/rutaTO.model";

import { UsuarioTO } from "../../models/UsuarioTO.model";

import { SincronizaEquipoTO } from "../../models/sincronizaEquipoTO.model";

import { PuntoInspeccionTO } from "../../models/puntoInspeccionTO.model";

import { URL_SERVICIO_RUTAS } from "../../config/url.servicios";

import { EquipoProvider }  from "../../providers/index.providers";

import { RutaProvider } from "../../providers/ruta/ruta";


@Injectable()
export class SincronizarProvider {

  dataSincronizaRuta:any;
  dataSincronizaEquipoRuta:any;
  errorSincRuta:number;
  errorSincEquipo:number;
  constructor(public http: Http,
              public equipoProvider: EquipoProvider,
              public rutaProvider: RutaProvider) {

  }

  sincroniza_rutas(rutas:RutaTO){
    return new Promise((resolve, reject) => {

    console.log("SINCRONIZACION: "+JSON.stringify(rutas));
    console.log("SINCRONIZACION: "+JSON.stringify(rutas.idRutaEjecucion));
    console.log("SINCRONIZACION: "+JSON.stringify(rutas.fechaCierre));
    let datos = {
                  'idEjecucionRuta': rutas.idRutaEjecucion,
                  'comentarios': '',
                  'fechaCierre': rutas.fechaCierre
                }
    let headers = new Headers({
    'Content-Type': 'application/json'
    });
    let options = new RequestOptions({
      headers: headers
    });

  this.http.post( URL_SERVICIO_RUTAS+ "/sincronizarRuta",JSON.stringify(datos),options )
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

  sincroniza_equipos(rutas:RutaTO, usuario:UsuarioTO, equipoTO:SincronizaEquipoTO){
    return new Promise((resolve, reject) => {
    console.log("SINCRONIZACION: "+JSON.stringify(rutas.idCentral));
    console.log("SINCRONIZACION usuarioTO: "+JSON.stringify(usuario));
    console.log("SINCRONIZACION equiposTO: "+JSON.stringify(equipoTO.nombreEquipo));
    console.log("SINCRONIZACION equiposTO: "+JSON.stringify(equipoTO.notifica));
  console.log("CANTIDAD PUNTO: "+equipoTO.listaPuntos.length)

    let datos = {
                  'idEjecucionRuta': rutas.idRutaEjecucion,
                  'idCentral': rutas.idCentral,
                  'username': usuario.username,
                  'password': usuario.password,
                  'equipoTO': {
                                "idEquipo": equipoTO.idEquipo,
                                "nombreEquipo": equipoTO.nombreEquipo,
                                "observaciones": equipoTO.observaciones,
                                "nombreImagen": equipoTO.nombreImagen,
                                "imagen": equipoTO.imagen,
                                "notifica": equipoTO.notifica,
                                "listaPuntos": equipoTO.listaPuntos
                              }
                }
    let headers = new Headers({
    'Content-Type': 'application/json'
    });
    let options = new RequestOptions({
      headers: headers
    });

  this.http.post( URL_SERVICIO_RUTAS+ "/sincronizarEquipoRuta",JSON.stringify(datos),options )
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





}
