import { Injectable } from '@angular/core';

import { RutaTO } from "../../models/rutaTO.model";

import { EquipoTO } from "../../models/EquipoTO.model";

import { CantidadEquipoTO } from "../../models/cantidadEquipoTO.model";

import { UsuarioTO } from "../../models/UsuarioTO.model";

import { Storage } from '@ionic/storage';

import { Platform } from 'ionic-angular';


@Injectable()
export class EquipoProvider {

  //public rutasSeleccionadas:RutaTO[] = [];
  public rutasCargadas:RutaTO[] = [];
  //public listaRuta:CargaRutaTO[] = [];
  public usuario:UsuarioTO[] = [];
  public cantidadEquipo:CantidadEquipoTO;

  constructor(public storage: Storage,
              private platform: Platform) {


          console.log("INICIO CARGA STORAGE: "+JSON.stringify(this.rutasCargadas));
          if(this.usuario.length>0){
              this.cargar_storage();
          }


  }

    cargar_rutas(isChecked:boolean, idRuta:string){

      for(var idxRuta in this.rutasCargadas){
        if(this.rutasCargadas[idxRuta].idRuta == idRuta){
            this.rutasCargadas[idxRuta].iniciado=isChecked;
        }
      }
    }

    agrega_rutaToLista( idRuta:string, idRutaEjecucion:string, idUsuario:string){

      for(var idx in this.rutasCargadas){
        if(this.rutasCargadas[idx].idRuta == idRuta)
        {
          this.rutasCargadas[idx].idRutaEjecucion = idRutaEjecucion;
          if(!this.rutasCargadas[idx].pendiente){
            this.rutasCargadas[idx].idUsuario = idUsuario;
          }
        }
      }
      console.log( JSON.stringify(this.rutasCargadas) );
    }

    agrega_equipoToLista( idRuta:string, listaEquipos:EquipoTO[]){

      for(var idx in this.rutasCargadas){
        if(this.rutasCargadas[idx].idRuta == idRuta)
        {
          this.rutasCargadas[idx].listaEquipos = listaEquipos;
        }
      }
      console.log( JSON.stringify(this.rutasCargadas) );

    }

    borrar_storage(key:string){
     this.storage.set(key, []);
     //this.cargar_storage();

    }

    guardar_storage(){

      let promesa = new Promise( ( resolve, reject )=>{

      if( this.platform.is("cordova") ){
        // dispositivo
        this.storage.set("rutasCargadas", this.rutasCargadas);
        console.log("STORAGE EQUIPO: "+JSON.stringify(this.rutasCargadas.length));
      }
      });

      return promesa;
    }

    cargar_storage(){

      let promesa = new Promise( ( resolve, reject )=>{

        if( this.platform.is("cordova") ){
          // dispositivo
          console.log("Inicializando storage");
          this.storage.ready()
              .then( ()=>{
                console.log("Storage listo");
              this.storage.get("rutasCargadas")
                      .then( rutasCargadas =>{
                        if( rutasCargadas ){
                          this.rutasCargadas = rutasCargadas;
                        }
                        resolve();
                    });
              });
        }
      });
      return promesa;
    }




}
