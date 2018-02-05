import { Http, Headers, RequestOptions } from '@angular/http';

import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx"


//import { Platform } from 'ionic-angular';
import { URL_SERVICIO_LOGIN, URL_SERVICIO_RUTAS } from "../../config/url.servicios";

import { Storage } from '@ionic/storage';

import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/timeout';

@Injectable()
export class UsuarioProvider {

  usuario:any;
  data_resp:any;
  codigoUsuario:string;
  token:string;
  complejo:string;
  idUsuario:string;

  dataRuta:any;

  constructor(public http: Http,
              //public equipoProvider: EquipoProvider
              //private platform: Platform,
              //private storage: Storage
            ) {

          //this.cargar_storage();
  }

  activo():boolean{
    if( this.token ){
      return true;
    }else{
      return false;
    }
  }

  ingresar( username:string, password:string, dominio:string ){
    return new Promise((resolve, reject) => {
      let datos = {
                  'username': username,
                  'password': password,
                  'dominio':  dominio
                  }
      let headers = new Headers({
      'Content-Type': 'application/json'
      });
      let options = new RequestOptions({
        headers: headers
      });

       this.http.post( URL_SERVICIO_LOGIN+"/login",JSON.stringify(datos), options )
                   .map( res => res.json())
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

  cargar_rutas(){
    return new Promise((resolve, reject) => {
      let datos = {
                    'idRuta':'0',
                    'estado':'1',
                    'idComplejo': this.usuario.idComplejo//this.complejo
                  }
      let headers = new Headers({
      'Content-Type': 'application/json'
      });
      let options = new RequestOptions({
        headers: headers
      });
    this.http.post( URL_SERVICIO_RUTAS+ "/obtieneListaRuta",JSON.stringify(datos),options )
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

  cargar_dataRuta(dataRuta:any){
      this.dataRuta = dataRuta.listaRuta;
  }

  cargar_usuario(usuario:any){
    console.log("USUARIO!!!"+JSON.stringify(usuario));
    console.log("USUARIO!!!"+usuario.idUsuario);
    console.log("USUARIO!!!"+usuario.codigoUsuario);
    this.usuario = usuario;
  }




}
