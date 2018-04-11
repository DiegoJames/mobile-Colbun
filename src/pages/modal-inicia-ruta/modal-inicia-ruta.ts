import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, AlertController } from 'ionic-angular';

import { SincronizarProvider } from "../../providers/sincronizar/sincronizar";

import { EquipoProvider } from "../../providers/equipo/equipo";

import { RutaProvider } from "../../providers/ruta/ruta";

import { UsuarioProvider } from "../../providers/usuario/usuario";

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
              public usuarioProvider: UsuarioProvider,
              public rutaProvider: RutaProvider,
              public equipoProvider: EquipoProvider,
              public sincronizarProvider: SincronizarProvider,
              private modalCtrl: ModalController,
              private network: Network) {

                this.date;
                console.log("ENTRO A ModalIniciaRutaPage");
                this.btnAtras();
              //  console.log("id Usuario: "+this.equipoProvider.idUsuario);
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
      this.elimarEquipoSincronizado();
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
        this.rutaProvider.botones();
        this.elimarRutaNoIniciadas();
        this.elimarEquipoSincronizado();

        //console.log("id Usuario: "+this.equipoProvider.idUsuario);
        //this.equipoProvider.borrar_storage();
        //console.log("id Usuario: "+this.equipoProvider.idUsuario);
        this.navCtrl.push("LoginPage");
       }
      }
    ]
    })
    cerrar.present();
  }


styles(item:RutaTO){
  //console.log("styles");

let styles;
   if(item.cerrado && !item.sincronizado){
     styles = {
      'color': 'green'
     }
   }else{
     if(item.descartado){
       styles = {
         'color': 'red',
        'text-decoration': 'line-through'
       }
     }else{
       if(item.sincronizado){
         styles = {
           'color': 'green',
           'text-decoration': 'line-through'
         }
       }else{
         styles = {
           'color': 'blank',
          'text-decoration': 'none'
         }
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
            if(!to.cerrado && !to.descartado){ //  cerrado falso pasa por aca cuando ruta no ha sido finalizada
              if(!to.sincronizado){
                console.log("LISTA EQUIPOS: "+JSON.stringify(to.listaEquipos));

                this.rutaProvider.cargarListaEquipos(to.idRuta);
                this.rutaProvider.botones();
                this.elimarEquipoSincronizado();
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

elimarRutaNoIniciadas(){
  let idxRuta = [];
  for(var idxRutaNoIniciada in this.equipoProvider.rutasCargadas){
    console.log("NO INICIADA?: "+this.equipoProvider.rutasCargadas[idxRutaNoIniciada].iniciado);
    if(!this.equipoProvider.rutasCargadas[idxRutaNoIniciada].iniciado){
      console.log("BORRO RUTA NO INICIADA: "+this.equipoProvider.rutasCargadas.length);
      idxRuta.push(idxRutaNoIniciada);
    }
  }
  for(let idxEliminar of idxRuta){
    delete this.equipoProvider.rutasCargadas[idxEliminar];
    console.log("ELIMINADAS NO INICIADAS");
  }
  this.equipoProvider.rutasCargadas = this.equipoProvider.rutasCargadas.filter(Boolean);
  console.log("FILTER "+this.equipoProvider.rutasCargadas.length);
  this.equipoProvider.guardar_storage();
}

elimarEquipoSincronizado(){
  let idxRutaEliminar = [];
  for(var idxRutaSincronizada in this.equipoProvider.rutasCargadas){
    console.log("SINCRONIZADO?: "+this.equipoProvider.rutasCargadas[idxRutaSincronizada].sincronizado);
    if(this.equipoProvider.rutasCargadas[idxRutaSincronizada].sincronizado || this.equipoProvider.rutasCargadas[idxRutaSincronizada].descartado){
      console.log("BORRO RUTA SINCRONIZADA: "+this.equipoProvider.rutasCargadas.length);
      idxRutaEliminar.push(idxRutaSincronizada);
    }
  }
  for(let idxEliminar of idxRutaEliminar){
    delete this.equipoProvider.rutasCargadas[idxEliminar];
    console.log("TERMINO FOR");
  }

  this.equipoProvider.rutasCargadas = this.equipoProvider.rutasCargadas.filter(Boolean);
  console.log("FILTER "+this.equipoProvider.rutasCargadas.length);

  this.equipoProvider.guardar_storage();
  console.log("FILTER "+this.equipoProvider.rutasCargadas.length);
  console.log("FIN FOR");
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
    let rutasNoSincronizar:number = 0;

    for(var idxRuta in this.equipoProvider.rutasCargadas){
      if(this.equipoProvider.rutasCargadas[idxRuta].idRutaEjecucion != null){
        rutasIniciadas++; // RUTAS ES 0, NO EXISTEN RUTAS INICIADAS PARA SINCRONIZAR
        if(this.equipoProvider.rutasCargadas[idxRuta].cerrado){
            //rutasFinalizadas++; // RUTASFINALIZADAS ES 0, NO EXISTEN RUTAS CERRADAS PARA SINCRONIZAR
          if(!this.equipoProvider.rutasCargadas[idxRuta].sincronizado){
            //this.equipoProvider.rutasCargadas[idxRuta].sincronizado = true; // RUTA TACHADA SE SINCRONIZARA
            this.equipoProvider.rutasCargadas[idxRuta].tipoSincronizacion = "S";
            rutasASincronizar.push(this.equipoProvider.rutasCargadas[idxRuta]); // CANTIDAD PARA SINCRONIZAR
          }else{
          rutasNoSincronizar++;
        }
      }else{
        rutasNoSincronizar++;
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
              this.rutaProvider.botones();

              console.log("rutasIniciadas: "+rutasIniciadas);
              console.log("rutasASincronizar.length: "+rutasASincronizar.length);
              console.log("rutasNoSincronizar: "+rutasNoSincronizar);
              if(rutasIniciadas == (rutasASincronizar.length + rutasNoSincronizar)){
                if(!this.rutaProvider.btnInicia && !this.rutaProvider.btnSincroniza && !this.rutaProvider.btnPendiente){
                  this.loading.dismiss();
                  let cerrar = this.alertCtrl.create({
                    title: "Correcto!",
                    subTitle: "Se han sincronizado todas las rutas, si tiene más rutas a cargar, puede volver atras o puede cerrar sesión para salir",
                    buttons: [
                    {
                      text: 'Ok',
                      handler: data => {
                        this.equipoProvider.guardar_storage();
                      }
                    }
                  ]
                  })
                  cerrar.present();
                //this.equipoProvider.rutasCargadas[idxRutaRescartada].sincronizado = true; // RUTA TACHADA ES DESCARTADA
              }else{

                   console.log("cantRutasSincronizadas"+cantRutasSincronizadas);
                    if(cantRutasSincronizadas == 1){
                      this.loading.dismiss();
                      let cerrarRutaASincronizar = this.alertCtrl.create({
                        title: "Correcto!",
                        subTitle: "Se ha sincronizado correctamente "+rutasASincronizar.length+ " ruta.",
                        buttons: [
                        {
                          text: 'Ok',
                          handler: data => {
                            this.equipoProvider.guardar_storage();
                          }
                        }
                      ]
                      })
                      cerrarRutaASincronizar.present();

                    }else{
                      this.loading.dismiss();
                      let cerrarRutasASincronizar = this.alertCtrl.create({
                        title: "Correcto!",
                        subTitle: "Se han sincronizado correctamente "+rutasASincronizar.length+ " rutas.",
                        buttons: [
                        {
                          text: 'Ok',
                          handler: data => {
                            this.equipoProvider.guardar_storage();
                          }
                        }
                      ]
                      })
                      cerrarRutasASincronizar.present();
                    }
              }
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
    this.loading = this.loadingCtrl.create({
      content: "Cargando Rutas..."
    });
    if(this.network.type != 'none'){
      console.log("stuff if connected");
    let rutasIniciadas:number = 0;
    if( this.idRuta > "0" ){

      for(var idxRutaRescartada in this.equipoProvider.rutasCargadas){
        if(this.equipoProvider.rutasCargadas[idxRutaRescartada].idRutaEjecucion != null){
          rutasIniciadas++;
          if(this.equipoProvider.rutasCargadas[idxRutaRescartada].idRuta == this.idRuta){
            if(!this.equipoProvider.rutasCargadas[idxRutaRescartada].descartado && !this.equipoProvider.rutasCargadas[idxRutaRescartada].cerrado){
              this.equipoProvider.rutasCargadas[idxRutaRescartada].descartado = true;
              this.equipoProvider.rutasCargadas[idxRutaRescartada].fechaCierre = this.fecha;
              this.equipoProvider.rutasCargadas[idxRutaRescartada].tipoSincronizacion = "D";
              this.sincronizarProvider.sincroniza_rutas(this.equipoProvider.rutasCargadas[idxRutaRescartada])
              .then(data => {

                  this.rutaProvider.botones();
                 console.log("sucess "+ JSON.stringify(data));

                 if(!this.rutaProvider.btnInicia && !this.rutaProvider.btnSincroniza && !this.rutaProvider.btnPendiente){
                   this.loading.dismiss();
                   let cerrar = this.alertCtrl.create({
                     title: "Advertencia!",
                     subTitle: "No existen más rutas pendientes, Se cerrará la sesión!.",
                     buttons: [
                     {
                       text: 'Ok',
                       handler: data => {
                         //this.equipoProvider.borrar_storage();
                         //console.log("id Usuario: "+this.equipoProvider.idUsuario);
                         //this.elimarRutaNoIniciadas();
                         this.elimarEquipoSincronizado();
                         this.equipoProvider.rutasCargadas = [];
                         this.equipoProvider.guardar_storage();
                         this.navCtrl.push("LoginPage");
                      }
                     }
                   ]
                   })
                   cerrar.present();
                 }else{
                   this.loading.dismiss();
                   let cerrarDescartado = this.alertCtrl.create({
                     title: "Correcto!",
                     subTitle: "Se ha descartado la ruta correctamente.",
                     buttons: [
                     {
                       text: 'Ok',
                       handler: data => {
                         this.equipoProvider.guardar_storage();
                       }
                     }
                   ]
                   })
                   cerrarDescartado.present();
                 }
                })
                .catch(error => {
                  this.loading.dismiss();
                  console.log("error " +JSON.stringify(error));
                    this.alertCtrl.create({
                      title: "Error!",
                      subTitle: "Error al descartar ruta, Favor intente más tarde.",
                      buttons: ["Ok"]
                    }).present();
                });
            }else{
              this.loading.dismiss();
              this.alertCtrl.create({
                title: "Error!",
                subTitle: "Esta ruta no se puede descartar, debido a que está cerrada.",
                buttons: ["Ok"]
              }).present();
            }
          }
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

}
