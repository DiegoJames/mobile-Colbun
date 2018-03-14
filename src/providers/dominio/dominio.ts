import { Http, Headers, RequestOptions } from '@angular/http';

import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/timeout';

import { URL_SERVICIO_LISTAS } from "../../config/url.servicios";

@Injectable()
export class DominioProvider {

  dominio:any[] = [];

  constructor(  public http: Http) {}

  carga_dominio(){


      let headers = new Headers({
      'Content-Type': 'application/json'
      });
      let options = new RequestOptions({
        headers: headers
      });

    //return this.http.post( URL_SERVICIO_LISTAS+"/obtieneListaCbxDominio", options ).timeout(30000)
    return this.http.post( URL_SERVICIO_LISTAS+"/obtieneListaCbxDominio", options )
    .map( resp => {

        let data_resp = resp.json();

        console.log( "DATA_RESP: "+ JSON.stringify(data_resp.listaDominios));

        this.dominio = data_resp.listaDominios;

    }).toPromise();

  }



}
