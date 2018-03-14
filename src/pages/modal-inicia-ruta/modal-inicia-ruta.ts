import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, AlertController } from 'ionic-angular';

import { SincronizarProvider } from "../../providers/sincronizar/sincronizar";

import { EquipoProvider } from "../../providers/equipo/equipo";

import { RutaProvider } from "../../providers/ruta/ruta";

import { RutaTO } from "../../models/rutaTO.model";

import { Network } from '@ionic-native/network';

//import {Observable} from 'rxjs/Observable';
//import 'rxjs/add/observable/fromEvent';

@IonicPage()
@Component({
  selector: 'page-modal-inicia-ruta',
  templateUrl: 'modal-inicia-ruta.html',
})
export class ModalIniciaRutaPage {

  fecha:string;
  date = new Date();
  idRuta:string;
  rutas:RutaTO[] = [];
  flag:boolean = false;
  linkAtras:boolean = false;
  loading:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              public rutaProvider: RutaProvider,
              public equipoProvider: EquipoProvider,
              public sincronizarProvider: SincronizarProvider,
              private modalCtrl: ModalController,
              private network: Network) {

                this.date;
                console.log("ENTRO A ModalIniciaRutaPage");
                this.btnAtras();
              }



  btnAtras(){
    let tieneEjecucionPendiente:boolean = false;
    let existenRutasNoIniciadas:boolean = false;

    for(var idxRutaCargada in this.equipoProvider.rutasCargadas){

      if(this.equipoProvider.rutasCargadas[idxRutaCargada].idRutaEjecucion == null){

        existenRutasNoIniciadas = true;
      }
      if(this.equipoProvider.rutasCargadas[idxRutaCargada].pendiente){
        tieneEjecucionPendiente = true;
        break;
      }
    }
    if(!tieneEjecucionPendiente && existenRutasNoIniciadas){
       this.linkAtras = true;
    }
    console.log("linkAtras "+this.linkAtras);
  }

  atras(){

      let listaModal = this.modalCtrl.create( "ModalListaRutaPage" );

      listaModal.present();
  }

  cerrarAplicacion(){

    let cerrar = this.alertCtrl.create({
      title: "Advertencia!",
      subTitle: "¿Está seguro de cerrar sesion?",
      buttons: [
      {
        text: 'No',
        handler: data =>{ }
      },
      {
        text: 'Si',
        handler: data => {
          //this.usuarioProvider.cerrar_sesion();
        //this.platform.exitApp();

        //this.viewCtrl.dismiss();
        this.navCtrl.push("LoginPage");
       }
      }
    ]
    })
    cerrar.present();
  }

styles(item:RutaTO){

let styles;
   if(item.cerrado){
     styles = {
      'color': 'green',
      'text-decoration': 'line-through'
     }
   }else{
     if(item.descartado){
       styles = {
         'color': 'red',
        'text-decoration': 'line-through'
       }
     }else{
       styles = {
         'color': 'blank',
        'text-decoration': 'none'
       }
     }
   }

    return styles;
  }

  carga_equipos(){
    this.loading = this.loadingCtrl.create({
      content: "Buscando Equipos..."
    });
    this.loading.present();

    //GUARDA EL ID RUTA SELECCIONADA EN RUTA PROVIDER
    this.rutaProvider.guardarRuta(this.idRuta);


    if( this.idRuta > "0" ){
    for(let to of this.equipoProvider.rutasCargadas){
      if(to.idRutaEjecucion != null){

        if(to.idRuta == this.idRuta){
          console.log("ID RUTA: "+JSON.stringify(this.idRuta));
          if(!to.descartado){
            if(!to.cerrado){ //  cerrado falso pasa por aca cuando ruta no ha sido finalizada
              if(!to.sincronizado){
                console.log("LISTA EQUIPOS: "+JSON.stringify(to.listaEquipos));

                this.rutaProvider.cargarListaEquipos(to.idRuta);

                this.loading.dismiss();

                let listaModal = this.modalCtrl.create( "ModalEquipoPage" );
                listaModal.present();

              }else{
              this.loading.dismiss();
                this.alertCtrl.create({
                  title: "Error!",
                  subTitle: "Esta ruta no se puede volver a iniciar, debido a que ya a ha sincronizada.",
                  buttons: ["Ok"]
                }).present();
              }
            }else{
              this.loading.dismiss();
              this.alertCtrl.create({
                title: "Error!",
                subTitle: "Esta ruta no se puede volver a iniciar, debido a que ya ha sido cerrada.",
                buttons: ["Ok"]
              }).present();
            }
          }else{
            this.loading.dismiss();
            this.alertCtrl.create({
              title: "Error!",
              subTitle: "Esta ruta no se puede iniciar, debido a que ya ha sido descartada.",
              buttons: ["Ok"]
            }).present();
          }
        }

      console.log("INICIA RUTA FIN: "+JSON.stringify(to));

    }
}
}else{
  this.loading.dismiss();
  this.alertCtrl.create({
    title: "Advertencia!",
    subTitle: "Seleccione una ruta.",
    buttons: ["Ok"]
  }).present();
}
}

  sincronizarTodos(){
    this.loading = this.loadingCtrl.create({
      content: "Cargando Rutas..."
    });
    console.log("INICIO SINCRONIZACION");
    // Call it when the device is ready, calling before drops null
    //this.platform.ready().then(() => {
      // if no internet, notice is a string
      //if (this.network.type == 'none' ) {
        // stuff if disconnected
        //console.log("stuff if disconnected");
        //onDisconnect = true;
      //} else {
        //stuff if connected
        //console.log("stuff if connected");
        //onConnect = true;
      //}

  if(this.network.type != 'none'){
    console.log("stuff if connected");
    let errorSincronizar:number = 0;
    let cantRutasSincronizadas:number = 0;
    let rutasIniciadas:number = 0;
    let rutasASincronizar:RutaTO[] = [];
    let descartado:boolean = true;

    for(var idxRuta in this.equipoProvider.rutasCargadas){
      if(this.equipoProvider.rutasCargadas[idxRuta].idRutaEjecucion != null){
        rutasIniciadas++; // RUTAS ES 0, NO EXISTEN RUTAS INICIADAS PARA SINCRONIZAR
        if(this.equipoProvider.rutasCargadas[idxRuta].cerrado){
            //rutasFinalizadas++; // RUTASFINALIZADAS ES 0, NO EXISTEN RUTAS CERRADAS PARA SINCRONIZAR
          if(!this.equipoProvider.rutasCargadas[idxRuta].sincronizado){
            //this.equipoProvider.rutasCargadas[idxRuta].sincronizado = true; // RUTA TACHADA SE SINCRONIZARA
            rutasASincronizar.push(this.equipoProvider.rutasCargadas[idxRuta]); // CANTIDAD PARA SINCRONIZAR
          }
        }
      }
    }
    console.log("rutasASincronizar: "+rutasASincronizar.length);
    if(rutasASincronizar.length > 0){
      for(var idxSincronizada in rutasASincronizar){
        this.sincronizarProvider.sincroniza_rutas(rutasASincronizar[idxSincronizada])
        .then(data => {
           console.log("sucess "+ JSON.stringify(data));
           cantRutasSincronizadas++;
           console.log("cantRutasSincronizadas: "+cantRutasSincronizadas);
           console.log("rutasASincronizar.length: "+rutasASincronizar.length);
           if(cantRutasSincronizadas == rutasASincronizar.length){
             for(var idxRuta in this.equipoProvider.rutasCargadas){
               if(this.equipoProvider.rutasCargadas[idxRuta].idRutaEjecucion != null){
                 if(this.equipoProvider.rutasCargadas[idxRuta].cerrado){
                   if(!this.equipoProvider.rutasCargadas[idxRuta].sincronizado){
                     this.equipoProvider.rutasCargadas[idxRuta].sincronizado = true; // RUTA TACHADA ES SINCRONIZARA
                   }
                 }
               }
              }
            this.loading.dismiss();
            console.log("cantRutasSincronizadas"+cantRutasSincronizadas);
             if(cantRutasSincronizadas == 1){
               this.alertCtrl.create({
                 title: "Correcto!",
                 subTitle: "Se ha sincronizado correctamente "+rutasASincronizar.length+ " ruta.",
                 buttons: ["Ok"]
               }).present();
             }else{
               this.alertCtrl.create({
                 title: "Correcto!",
                 subTitle: "Se han sincronizado correctamente "+rutasASincronizar.length+ " rutas.",
                 buttons: ["Ok"]
               }).present();
             }

           }
          })
          .catch(error => {
            console.log("error " +JSON.stringify(error));
            errorSincronizar++;
            console.log("errorSincronizar: "+errorSincronizar);
            console.log("rutasASincronizar.length: "+rutasASincronizar.length);
            if(errorSincronizar == rutasASincronizar.length){
              this.loading.dismiss();
              this.alertCtrl.create({
                title: "Error!",
                subTitle: "Error al sincronizar rutas, Favor intente más tarde.",
                buttons: ["Ok"]
              }).present();
            }
          });
      }
    }else{
        this.loading.dismiss();

          if(rutasIniciadas == 1){
            this.alertCtrl.create({
              title: "Error!",
              subTitle: "La ruta no esta cerrada para sincronizarla.",
              buttons: ["Ok"]
            }).present();
          }else{
            this.alertCtrl.create({
              title: "Error!",
              subTitle: "No existen rutas cerradas para sincronizarlas.",
              buttons: ["Ok"]
            }).present();
          }

    }
    }else{
      // dispositivo sin internet
      console.log("stuff if disconnected");
      this.loading.dismiss();
      this.alertCtrl.create({
        title: "Error!",
        subTitle: "Revise su conexión a internet, y reintente nuevamente.",
        buttons: ["Ok"]
      }).present();
    }
}

  cerrarRuta(){

    if( this.idRuta > "0" ){

      for(var idxRutaRescartada in this.equipoProvider.rutasCargadas){
        if(this.equipoProvider.rutasCargadas[idxRutaRescartada].idRutaEjecucion != null){
          if(this.equipoProvider.rutasCargadas[idxRutaRescartada].idRuta == this.idRuta){
            if(!this.equipoProvider.rutasCargadas[idxRutaRescartada].descartado){
              this.equipoProvider.rutasCargadas[idxRutaRescartada].descartado = true;
              this.equipoProvider.rutasCargadas[idxRutaRescartada].fechaCierre = this.fecha;

              this.sincronizarProvider.sincroniza_rutas(this.equipoProvider.rutasCargadas[idxRutaRescartada])
              .then(data => {
                 console.log("sucess "+ JSON.stringify(data));

                 this.equipoProvider.rutasCargadas[idxRutaRescartada].sincronizado = true; // RUTA TACHADA ES DESCARTADA

                })
                .catch(error => {
                  console.log("error " +JSON.stringify(error));
                    this.alertCtrl.create({
                      title: "Error!",
                      subTitle: "Error al sincronizar descartar ruta, Favor intente más tarde.",
                      buttons: ["Ok"]
                    }).present();
                });
            }else{
              this.alertCtrl.create({
                title: "Error!",
                subTitle: "Esta ruta no se puede descartar, debido a que esta cerrada.",
                buttons: ["Ok"]
              }).present();
            }
          }
        }
      }
    }else{
    this.alertCtrl.create({
      title: "Advertencia!",
      subTitle: "Seleccione una ruta.",
      buttons: ["Ok"]
    }).present();

    }
  }

}
