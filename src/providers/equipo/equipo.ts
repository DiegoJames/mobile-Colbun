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

  //public idUsuario:string = null;

  constructor(public storage: Storage,
              private platform: Platform) {


          console.log("INICIO CARGA STORAGE: "+JSON.stringify(this.rutasCargadas.length));
          //if(this.usuario.length>0){
              this.cargar_storage();
          //}

          //console.log("INICIO ID USUARIO: "+this.idUsuario);

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

    borrar_storage(){
     //this.storage.set(key, []);
     //this.idUsuario = null;
     this.guardar_storage();
     //this.cargar_storage();

    }

    guardar_storage(){

      let promesa = new Promise( ( resolve, reject )=>{

      if( this.platform.is("cordova") ){
        // dispositivo
        this.storage.set("rutasCargadas", this.rutasCargadas);
        //this.storage.set("idUsuario", this.idUsuario);
        console.log("STORAGE EQUIPO: "+JSON.stringify(this.rutasCargadas.length));
        //console.log("STORAGE ID USUARIO: "+this.idUsuario);
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
                        console.log("*CARGAR RUTAS CARGADAS");
                        resolve();
                    });
              /*this.storage.get("idUsuario")
                      .then( idUsuario =>{
                        if( idUsuario ){
                          this.idUsuario = idUsuario;
                        }
                        console.log("*CARGAR ID USUARIO: "+this.idUsuario);

                    });
                    resolve();*/
              });
        }
      });
      return promesa;
    }




}
