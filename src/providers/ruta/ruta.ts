import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx"

import { Platform } from 'ionic-angular';
import { URL_SERVICIO_RUTAS, URL_SERVICIO_EQUIPOS } from "../../config/url.servicios";

import { Storage } from '@ionic/storage';

import { EquipoProvider }  from "../index.providers";

//import { RutaTO } from "../../models/RutaTO.model";

import { EquipoTO } from "../../models/EquipoTO.model";

import { PuntoInspeccionTO } from "../../models/puntoInspeccionTO.model";

import { ValorSeleccionTO } from "../../models/valorSeleccionTO.model";



@Injectable()
export class RutaProvider {

  idEjecucionRuta:string;
  color:boolean = false;
  dataRuta:any;
  dataEquipo:any;

  idRuta:string;
  nombreRuta:string;

  listaRuta:any;
  listaEquipo:any;
  listaPuntoInspeccion:any;
  puntoInspeccion:any;
  listaValoresSeleccion:any;

  constructor(public http: Http,
              private platform: Platform,
              private storage: Storage,
              public equipoProvider: EquipoProvider) {}

  activo():boolean{
    if( this.idRuta ){
      return true;
    }else{
      return false;
    }
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

  carga_equipos(id:string){

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

    habilitaBoton(color:boolean){
      this.color = color;
    }

    catalogoEquipo(dataEquipo:any){
      this.dataEquipo = dataEquipo;
    }

    guardarRuta(idRuta:string){
      this.idRuta = idRuta;
    }

    cargar_equipos(idRuta:string){
      for(let toRuta of this.equipoProvider.rutasCargadas){
        if(toRuta.idRuta == idRuta){
          this.nombreRuta = toRuta.nombre;
          console.log("nombreRuta: "+JSON.stringify(this.nombreRuta));
          for(let toEquipo of toRuta.listaEquipo){
            this.listaRuta = toEquipo;
            //console.log("this.listaRuta: "+JSON.stringify(toEquipo.idEquipo));
          }
        }
      }
    }

    cargar_lista_puntos_inspeccion(scanner:string){

      for(let toRuta of this.equipoProvider.rutasCargadas){
        for(let toEquipo of toRuta.listaEquipo){
          if(toEquipo.idEquipo == scanner){
            this.listaEquipo = toEquipo;
              for(let toPunto of toEquipo.listaPuntoInspeccion){
                this.listaPuntoInspeccion = toPunto;
              }
          }
        }
      }
    }

    cargar_punto_inspeccion(idPunto:string){

          console.log("INICION PUNTO");
          for(let toRuta of this.equipoProvider.rutasCargadas){
            for(let toEquipo of toRuta.listaEquipo){
              for(let toPunto of toEquipo.listaPuntoInspeccion){
                if(toPunto.idPuntoInspeccion == idPunto){
                  console.log("idPunto: "+idPunto);
                    this.puntoInspeccion = toPunto;

                    this.listaValoresSeleccion = toPunto.listaValoresSeleccion;
                    console.log("idPuntoInspeccion: "+JSON.stringify(toPunto.idPuntoInspeccion));

                    console.log("puntoInspeccion: "+JSON.stringify(this.puntoInspeccion));
                    console.log("listaValoresSeleccion: "+JSON.stringify(this.puntoInspeccion.listaValoresSeleccion));
                    console.log("listaValoresSeleccion: "+JSON.stringify(toPunto.listaValoresSeleccion));

              }
            }
          }
        }
    }

  private guardar_storage(){

    if( this.platform.is("cordova") ){
      // dispositivo
      this.storage.set('idEjecucionRuta', this.idEjecucionRuta);
    }else{
      // computadora
      if( this.idEjecucionRuta ){
        localStorage.setItem('idEjecucionRuta', this.idEjecucionRuta);
      }else{
          //localStorage.removeItem("idEjecucionRuta");
      }
    }
  }

  cargar_storage(){

    let promesa = new Promise( ( resolve, reject )=>{

      if( this.platform.is("cordova") ){
        // dispositivo
        this.storage.ready()
                  .then( ()=>{
                  this.storage.get("idEjecucionRuta")
                          .then( idEjecucionRuta =>{
                            if( idEjecucionRuta ){
                              this.idEjecucionRuta = idEjecucionRuta;
                            }
                            resolve();
                        })
              })
      }else{
        // computadora
        if( localStorage.getItem("idEjecucionRuta") ){
          //Existe items en el localstorage
          this.idEjecucionRuta = localStorage.getItem("idEjecucionRuta");
        }
        resolve();
      }
    });
    return promesa;
  }


}
