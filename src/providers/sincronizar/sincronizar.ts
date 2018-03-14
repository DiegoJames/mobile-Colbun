import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
//import { Q } from 'q';
import { Observable } from "rxjs/Rx"

import { RutaTO } from "../../models/rutaTO.model";

import { UsuarioTO } from "../../models/UsuarioTO.model";

import { SincronizaEquipoTO } from "../../models/sincronizaEquipoTO.model";

//import { PuntoInspeccionTO } from "../../models/puntoInspeccionTO.model";

import { URL_SERVICIO_RUTAS } from "../../config/url.servicios";

import { EquipoProvider }  from "../../providers/index.providers";

import { RutaProvider } from "../../providers/ruta/ruta";

import { SincronizaPuntoTO } from "../../models/sincronizaPuntoTO.model";


@Injectable()
export class SincronizarProvider {

  dataSincronizaRuta:any;
  dataSincronizaEquipoRuta:any;
  errorSincRuta:number;
  errorSincEquipo:number;
  listaPunto:SincronizaPuntoTO[] = [];


  constructor(public http: Http,
              public equipoProvider: EquipoProvider,
              public rutaProvider: RutaProvider) {

  }

  sincroniza_rutas(ruta:RutaTO){

    console.log("SINCRONIZACION: "+JSON.stringify(ruta));
    console.log("SINCRONIZACION: "+JSON.stringify(ruta.idRutaEjecucion));
    console.log("SINCRONIZACION: "+JSON.stringify(ruta.fechaCierre));
    let datos = {
                  'idEjecucionRuta': ruta.idRutaEjecucion,
                  'comentarios': '',
                  'fechaCierre': ruta.fechaCierre
                }
    let headers = new Headers({
    'Content-Type': 'application/json'
    });
    let options = new RequestOptions({
      headers: headers
    });

  return this.http.post( URL_SERVICIO_RUTAS+ "/sincronizarRuta",JSON.stringify(datos),options )
  .map( res => {

      let data_res = res.json();

            console.log("DATA RES: "+JSON.stringify(data_res));
             console.log("ID RUTA: "+ruta.idRuta);
             console.log("CANTIDAD EQUIPOS: "+ruta.listaEquipos.length);
             for(var idxEquipo in ruta.listaEquipos){
               console.log("CANTIDAD EQUIPOS: "+ruta.listaEquipos.length);
               console.log("GUARDADO: "+ruta.listaEquipos[idxEquipo].guardado);
               if(ruta.listaEquipos[idxEquipo].guardado){
                 console.log("ID EQUIPO "+idxEquipo);
                 this.listaPunto = [];
                 for(var idxPunto in ruta.listaEquipos[idxEquipo].listaPuntoInspeccion){
                   if(ruta.listaEquipos[idxEquipo].listaPuntoInspeccion[idxPunto].guardado){
                     //ruta.cerrado = true;
                     let puntoTO = new SincronizaPuntoTO(
                       ruta.listaEquipos[idxEquipo].listaPuntoInspeccion[idxPunto].idPuntoInspeccion,
                       ruta.listaEquipos[idxEquipo].listaPuntoInspeccion[idxPunto].referenciaFisica,
                       ruta.listaEquipos[idxEquipo].listaPuntoInspeccion[idxPunto].valorMedida,
                       ruta.listaEquipos[idxEquipo].listaPuntoInspeccion[idxPunto].observacion,
                       ruta.listaEquipos[idxEquipo].listaPuntoInspeccion[idxPunto].idPuntoInspeccion +".jpeg",
                       ruta.listaEquipos[idxEquipo].listaPuntoInspeccion[idxPunto].imagen
                     )
                     this.listaPunto.push(puntoTO);
                     console.log("EQUIPO "+JSON.stringify(this.listaPunto));
                   }
                 }

                 let equipoTO = new SincronizaEquipoTO(
                   ruta.listaEquipos[idxEquipo].idEquipo,
                   ruta.listaEquipos[idxEquipo].nombre,
                   ruta.listaEquipos[idxEquipo].observacion,
                   ruta.listaEquipos[idxEquipo].idEquipo +".jpeg",
                   ruta.listaEquipos[idxEquipo].imagen,
                   ruta.listaEquipos[idxEquipo].notifica,
                   this.listaPunto
                 )
                 this.sincroniza_equipos(ruta, this.equipoProvider.usuario[0], equipoTO).then(
                   (res) => {
                     console.log("SUCCESS: "+res);
                   },
                   (err) => {
                      console.log("ERROR :"+err);
                   }
                 );

         }

      }

    }).toPromise();
  }

  sincroniza_equipos(rutas:RutaTO, usuario:UsuarioTO, equipoTO:SincronizaEquipoTO){
    return new Promise((resolve, reject) => {
    console.log("SINCRONIZACION idRutaEjecucion: "+JSON.stringify(rutas.idRutaEjecucion));
    console.log("SINCRONIZACION idCentral: "+JSON.stringify(rutas.idCentral));
    console.log("SINCRONIZACION username: "+JSON.stringify(usuario.username));
    console.log("SINCRONIZACION username: "+JSON.stringify(usuario.password));
    console.log("SINCRONIZACION idUsuario: "+usuario.idUsuario);
    console.log("SINCRONIZACION idEquipo: "+JSON.stringify(equipoTO.idEquipo));
    console.log("SINCRONIZACION nombreEquipo: "+JSON.stringify(equipoTO.nombreEquipo));
    console.log("SINCRONIZACION observaciones: "+JSON.stringify(equipoTO.observaciones));
    console.log("SINCRONIZACION nombreImagen: "+JSON.stringify(equipoTO.nombreImagen));
    console.log("SINCRONIZACION IMAGEN: "+JSON.stringify(equipoTO.imagen));
    console.log("SINCRONIZACION equiposTO: "+JSON.stringify(equipoTO.notifica));
    console.log("CANTIDAD PUNTO: "+equipoTO.listaPuntos.length);


    let datos = {
                  'idEjecucionRuta': rutas.idRutaEjecucion,
                  'idCentral': rutas.idCentral,
                  'username': usuario.username,
                  'password': usuario.password,
                  'idUsuario': usuario.idUsuario,
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
