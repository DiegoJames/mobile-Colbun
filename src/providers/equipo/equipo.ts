import { Injectable } from '@angular/core';

import { RutaTO } from "../../models/rutaTO.model";

import { EquipoTO } from "../../models/EquipoTO.model";

import { CargaRutaTO } from "../../models/CargaRutaTO.model";

import { UsuarioTO } from "../../models/UsuarioTO.model";

import { Storage } from '@ionic/storage';

import { Platform } from 'ionic-angular';


@Injectable()
export class EquipoProvider {

  public rutasSeleccionadas:RutaTO[] = [];
  public rutasCargadas:RutaTO[] = [];
  public listaRuta:CargaRutaTO[] = [];
  public usuario:UsuarioTO[] = [];

  constructor(public storage: Storage,
              private platform: Platform) {
    //this.cargar_storage();
  }

    cargar_rutas(idRuta:string, nombre:string, isChecked: boolean, idx:number, color:boolean){
      let data = new RutaTO( idRuta, null, null, nombre, null, false, color, null, null, null );

      if(isChecked){
        this.rutasSeleccionadas[idx] = data;
        console.log("AGREGA: " +JSON.stringify(this.rutasSeleccionadas[idx]) );
      }else{
        delete this.rutasSeleccionadas[idx];
        console.log("ELIMINA: " +JSON.stringify(this.rutasSeleccionadas[idx]) );
      }
    }

    agrega_rutaToLista( idRuta:string, idRutaEjecucion:string, idUsuario:string, bloqueado:boolean){

      for(var idx in this.rutasCargadas){
        if(this.rutasCargadas[idx].idRuta == idRuta)
        {
          this.rutasCargadas[idx].idRutaEjecucion = idRutaEjecucion;
          this.rutasCargadas[idx].idUsuario = idUsuario;
          this.rutasCargadas[idx].bloqueado = bloqueado;
        }
      }
      console.log( JSON.stringify(this.rutasCargadas) );
    }

    agrega_equipoToLista( idRuta:string, listaEquipos:EquipoTO[]){

      for(var idx in this.rutasCargadas){
        if(this.rutasCargadas[idx].idRuta == idRuta)
        {
          this.rutasCargadas[idx].listaEquipo = listaEquipos;
        }
      }
      console.log( JSON.stringify(this.rutasCargadas) );

    }

    borrar_storage(){

      this.rutasCargadas = null;
      //Guardar storage
      this.guardar_storage();
    }

    guardar_storage(){

      let promesa = new Promise( ( resolve, reject )=>{

      if( this.platform.is("cordova") ){
        // dispositivo
        this.storage.set("rutasCargadas", this.rutasCargadas);
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
