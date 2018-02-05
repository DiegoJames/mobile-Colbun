import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, AlertController } from 'ionic-angular';

import { EquipoProvider } from "../../providers/index.providers";

import { UsuarioProvider } from "../../providers/usuario/usuario";

import { RutaProvider } from "../../providers/ruta/ruta";

import { DatePipe } from '@angular/common'

import { RutaTO } from "../../models/rutaTO.model";

import { EquipoTO } from "../../models/EquipoTO.model";

@IonicPage()
@Component({
  selector: 'page-lista-equipo',
  templateUrl: 'lista-equipo.html',
})
export class ListaEquipoPage {

  scanner:string = "";
  fecha:string;
  date = new Date();

  flag:boolean = false;
  equipos:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public usuarioProvider: UsuarioProvider,
              public rutaProvider: RutaProvider,
              public equipoProvider: EquipoProvider,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private datePipe: DatePipe,
              private modalCtrl: ModalController) {

              this.date;
              //console.log("listaRuta: "+rutaProvider.listaRuta.nombre);

              console.log( "NAVPARAMS: "+JSON.stringify(navParams) );

              this.equipos = this.navParams.get("listaEquipo");
              console.log("rutas XXX: "+JSON.stringify(this.equipos.listaEquipo));
  }

  /*ionViewWillEnter(){

}*/

  styles(item:EquipoTO){
    let styles = {
      'color': item.color ? 'green' : 'blank'
    }

    return styles;
  }

  scan(){
    console.log("SCAN......: "+this.scanner);
    this.scanner = "";
    this.scanner = document.getElementById('broadcastData').innerHTML;
    console.log("SCAN......: "+this.scanner);

    let cantidadEquipo = 0;

    for(let toEquipo of this.equipos.listaEquipo){

      //if(!this.scanner.startsWith("<!--bindings") ){
        if(toEquipo.idEquipo == this.scanner){
          cantidadEquipo++
        //this.equipos.idEquipo == this.scanner;
        this.rutaProvider.cargar_lista_puntos_inspeccion(this.scanner);

        let listaModal = this.modalCtrl.create( "ModalListaPage" );

        listaModal.present();
        listaModal.onDidDismiss( idEquipo => {

          if(idEquipo){
            console.log("Data del modal:");
            console.log( idEquipo );
          }
          else{
            console.log("Se cerro el modal sin parametros");
          }
        });
      }
    //}
  }
  if(cantidadEquipo == 0){
      this.alertCtrl.create({
        title: "Error!",
        subTitle: "Equipo no pertenece a la ruta",
        buttons: ["Ok"]
      }).present();
  }
}

  cerrar_ruta(){
    let loading = this.loadingCtrl.create({
      content: "Espere por favor..."
    });
    loading.present();


    for(var idxRuta in this.equipoProvider.rutasCargadas){
      if(this.equipoProvider.rutasCargadas[idxRuta].idRuta == this.rutaProvider.idRuta){

        for(var idxEquipo in this.equipoProvider.rutasCargadas[idxRuta].listaEquipo){
          if(this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].color == true){
            this.equipoProvider.rutasCargadas[idxRuta].fechaCierre = this.fecha;
            this.equipoProvider.rutasCargadas[idxRuta].color = true;
            console.log("Fecha: "+this.equipoProvider.rutasCargadas[idxRuta].fechaCierre);
            console.log("idRutaEjecucion: "+this.equipoProvider.rutasCargadas[idxRuta].idRutaEjecucion);

            this.flag = true;
          }
        }
      }
    }

    if(this.flag){
      this.flag = false;
      //this.equipoProvider.guardar_storage();
      this.navCtrl.pop();
    }else{

      this.alertCtrl.create({
        title: "Confirmación",
        subTitle: "Desea cerra esta ruta sin haber inspeccionado.",
        buttons: [{
          text: 'No',
          handler: data =>{}
        },
        {
          text: 'Si',
          handler: data => {
                            for(var idxRuta in this.equipoProvider.rutasCargadas){
                              if(this.equipoProvider.rutasCargadas[idxRuta].idRuta == this.rutaProvider.idRuta){
                                this.equipoProvider.rutasCargadas[idxRuta].fechaCierre = this.fecha;
                                this.equipoProvider.rutasCargadas[idxRuta].color = true;
                                console.log("Fecha: "+this.equipoProvider.rutasCargadas[idxRuta].fechaCierre);
                                console.log("idRutaEjecucion: "+this.equipoProvider.rutasCargadas[idxRuta].idRutaEjecucion);
                              }
                           }
                           this.navCtrl.pop();
                         }
        }]
      }).present();
    }
    loading.dismiss();

  }

}
