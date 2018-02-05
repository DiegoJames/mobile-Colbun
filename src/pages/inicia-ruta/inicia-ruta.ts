import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, AlertController, Platform } from 'ionic-angular';

import { EquipoProvider, SincronizarProvider } from "../../providers/index.providers";

import { UsuarioProvider } from "../../providers/usuario/usuario";

import { RutaProvider } from "../../providers/ruta/ruta";

import {RutaTO} from "../../models/rutaTO.model";

import {LstRutaTO} from "../../models/lstRutaTO.model";

import { SincronizaEquipoTO } from "../../models/sincronizaEquipoTO.model";

import { SincronizaPuntoTO } from "../../models/sincronizaPuntoTO.model";

@IonicPage()
@Component({
  selector: 'page-inicia-ruta',
  templateUrl: 'inicia-ruta.html',
})
export class IniciaRutaPage {

  idRuta:string;
  rutas:RutaTO[] = [];
  flag:boolean = false;

  listaEquipos:any;

  listaPunto:SincronizaPuntoTO[] = [];

  backPressed:boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              public usuarioProvider: UsuarioProvider,
              public rutaProvider: RutaProvider,
              public equipoProvider: EquipoProvider,
              public sincronizarProvider: SincronizarProvider,
              private platform: Platform,
              private modalCtrl: ModalController) {

                //this.equipoProvider.cargar_storage();

                console.log( navParams );

                this.rutas = this.navParams.get("rutasCargadas");
                console.log("THIS.RUTAS: ***"+JSON.stringify(this.rutas));
                //this.platform = platform;
  }

  cerrarAplicacion(){

    this.alertCtrl.create({
      title: "Advertencia!",
      subTitle: "¿Esta seguro de cerrar sesion?",
      buttons: [
      {
        text: 'No',
        handler: data =>{}
      },
      {
        text: 'Si',
        handler: data => {
          //this.usuarioProvider.cerrar_sesion();
        this.platform.exitApp();
        //this.navCtrl.push("LoginPage");
        //this.navCtrl.popToRoot();
       }
      }
    ]
    }).present();

  }

  styles(item:RutaTO){
    let styles = {

      'color': item.color ? 'green' : 'blank',
      //'font-weight': item.color ? '600' : 'none',
      //'disabled': item.color ? true : false
      'text-decoration': item.bloqueado ? 'line-through' : 'none'
    }

    return styles;
  }

  carga_equipos(){

    let loading = this.loadingCtrl.create({
      content: "Espere por favor..."
    });
    loading.present();

    //GUARDA EL ID RUTA SELECCIONADA EN RUTA PROVIDER
    this.rutaProvider.guardarRuta(this.idRuta);


    console.log("LISTA RUTA: "+JSON.stringify(this.equipoProvider.rutasCargadas));
    for (let to of this.equipoProvider.rutasCargadas){
      console.log("ID RUTA: "+JSON.stringify(this.idRuta));
      if( this.idRuta > "0" ){
        if(to.idRuta == this.idRuta){
            if(!to.color){
              if(!to.bloqueado){
                console.log("LISTA EQUIPOS: "+JSON.stringify(to.listaEquipo));
                this.listaEquipos = to;
                //this.modalCtrl.create( "ModalListaPage", { 'listaEquipo':this.listaEquipos } );
                //this.navCtrl.push( "ListaEquipoPage", { 'listaEquipo':this.listaEquipos } );
                this.rutaProvider.cargar_equipos(to.idRuta);
                this.navCtrl.push( "ListaEquipoPage", { 'listaEquipo':this.listaEquipos } );
              }else{
                this.alertCtrl.create({
                  title: "Advertencia!",
                  subTitle: "No se puede volver a iniciar esta ruta, porque ya fue sincronizada.",
                  buttons: ["Ok"]
                }).present();
              }
            }else{
              this.alertCtrl.create({
                title: "Advertencia!",
                subTitle: "No se puede volver a iniciar esta ruta, porque ya fue cerrada.",
                buttons: ["Ok"]
              }).present();
            }
        }
      }else{
        this.alertCtrl.create({
          title: "Advertencia!",
          subTitle: "Seleccione una ruta.",
          buttons: ["Ok"]
        }).present();
        break;
      }

      console.log("RUTA VACIA: "+JSON.stringify(to));

    }

    loading.dismiss();

}

  sincronizarTodos(){
    console.log("INICIO SINCRONIZACION");

    let cantRutasSincronizadas = 0;
    for(var idxRuta in this.equipoProvider.rutasCargadas){
      if(this.equipoProvider.rutasCargadas[idxRuta].color == true){
        console.log("BLOQUEADA? "+this.equipoProvider.rutasCargadas[idxRuta].bloqueado);
        console.log("BLOQUEADA? "+this.equipoProvider.rutasCargadas[idxRuta].bloqueado);
        if(this.equipoProvider.rutasCargadas[idxRuta].bloqueado == false){
          console.log("BLOQUEADA? "+this.equipoProvider.rutasCargadas[idxRuta].bloqueado);
          cantRutasSincronizadas++;
          this.sincronizarProvider.sincroniza_rutas(this.equipoProvider.rutasCargadas[idxRuta]).then(
            (res) => {
                      console.log('success '+ JSON.stringify(res));
                      },
            (err) => {
                        console.log('error '+ JSON.stringify(err));
                        /*this.alertCtrl.create({
                          title: "Error al sincroniazr ruta!",
                          subTitle: "No se puede conectar con el servidor",
                          buttons: [
                          {
                            text: 'Ok',
                            handler: data =>{ }
                          },
                        ]
                        }).present();
                        cantRutasSincronizadas = 0;
                        return;
                     */}
          )
          this.equipoProvider.rutasCargadas[idxRuta].bloqueado = true;


        for(var idxEquipo in this.equipoProvider.rutasCargadas[idxRuta].listaEquipo){
          if(this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].color == true){
            console.log("EQUIPO "+idxEquipo);
            this.listaPunto = [];
            for(var idxPunto in this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].listaPuntoInspeccion){

              if(this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].listaPuntoInspeccion[idxPunto].color == true){

                let puntoTO = new SincronizaPuntoTO(
                  this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].listaPuntoInspeccion[idxPunto].idPuntoInspeccion,
                  this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].listaPuntoInspeccion[idxPunto].referenciaFisica,
                  this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].listaPuntoInspeccion[idxPunto].valorMedida,
                  this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].listaPuntoInspeccion[idxPunto].observacion,
                  this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].listaPuntoInspeccion[idxPunto].idPuntoInspeccion +".jpeg",
                  this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].listaPuntoInspeccion[idxPunto].imagen
                )
                this.listaPunto.push(puntoTO);
                console.log("EQUIPO "+JSON.stringify(this.listaPunto));
              }
            }

            let equipoTO = new SincronizaEquipoTO(
              this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].idEquipo,
              this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].nombre,
              this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].observacion,
              this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].idEquipo +".jpeg",
              this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].imagen,
              this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].notifica,
              this.listaPunto
            )
            this.sincronizarProvider.sincroniza_equipos(this.equipoProvider.rutasCargadas[idxRuta], this.equipoProvider.usuario[0], equipoTO).then(
              (res) => {
                          console.log('success '+ JSON.stringify(res));
                        },
              (err) => {
                          console.log('error '+ JSON.stringify(err));

                        }
            )

            console.log("LISTA EQUIPOS SINCRONIZACION: "+JSON.stringify(equipoTO));
            //Las rutas han sido sincronizados correctamente
          }

        }
        //this.equipoProvider.guardar_storage();
      }
      }

    }

    console.log(" AFUERA cantRutasSincronizadas: "+JSON.stringify(cantRutasSincronizadas));
    if(cantRutasSincronizadas > 0){
      console.log("IF entro: "+JSON.stringify(cantRutasSincronizadas));
      //let actualizaRutas =
      this.alertCtrl.create({
        title: "Correcto!",
        subTitle: "Se han sincronizado correctamente "+cantRutasSincronizadas+ " ruta(s)",
        buttons: ["Ok"]
      }).present();
      this.idRuta = "0";
    }else{
      this.alertCtrl.create({
        title: "Advertencia!",
        subTitle: "No hay rutas cerradas para sincronizar",
        buttons: ["Ok"]
      }).present();
    }

    cantRutasSincronizadas = 0;

}


}
