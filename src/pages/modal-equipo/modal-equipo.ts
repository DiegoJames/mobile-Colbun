import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams, ModalController, LoadingController, AlertController } from 'ionic-angular';

import { EquipoProvider } from "../../providers/index.providers";

import { RutaProvider } from "../../providers/ruta/ruta";

import { EquipoTO } from "../../models/EquipoTO.model";

@IonicPage()
@Component({
  selector: 'page-modal-equipo',
  templateUrl: 'modal-equipo.html',
})
export class ModalEquipoPage {

   fecha:string;
   date = new Date();
   flag:boolean = false;
   scanner:string = "";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public rutaProvider: RutaProvider,
              public equipoProvider: EquipoProvider,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private viewCtrl: ViewController) {

              this.date;
  }

  /*ionViewWillEnter(){

}*/

  atras(){
      this.viewCtrl.dismiss();
  }

styles(item:EquipoTO){
  let styles = {
    'color': item.guardado ? 'green' : 'blank'
  }

  return styles;
}

scan(){
console.log("SCAN INICIO: "+this.rutaProvider.scan);
  if(this.rutaProvider.scan){
    this.rutaProvider.borrarScanner(false);
    this.scanner = document.getElementById('broadcastData').innerHTML;
    console.log("SCAN......: "+this.rutaProvider.scan);

    //let cantidadEquipo = 0;
    let tienePuntoGuardado:boolean = false;
    //for(let toEquipo of this.rutaProvider.listaEquipos){

      this.rutaProvider.cargar_lista_puntos_inspeccion(this.scanner);


      if(this.rutaProvider.equipoEnRuta){

        for(var to of this.rutaProvider.equipoTO.listaPuntoInspeccion){
          if(to.guardado){
            tienePuntoGuardado = true;
            break;
          }
        }
        this.rutaProvider.habilitaBoton(tienePuntoGuardado);

        let listaModal = this.modalCtrl.create( "ModalListaPage" );

        listaModal.present();

      }else{
        this.alertCtrl.create({
          title: "Error!",
          subTitle: "Equipo no pertenece a la ruta",
          buttons: ["Ok"]
        }).present();
      }
      //this.scanner = "";
      console.log("scanner fin: "+this.rutaProvider.scan);
    //if(!scanner.startsWith("<!--bindings") ){
  }
}

cerrar_ruta(){
  let loading = this.loadingCtrl.create({
    content: "Espere por favor..."
  });
  loading.present();

  for(var idxRuta in this.equipoProvider.rutasCargadas){
    if(this.equipoProvider.rutasCargadas[idxRuta].idRutaEjecucion != null){
      if(this.equipoProvider.rutasCargadas[idxRuta].idRuta == this.rutaProvider.idRuta){
        for(var idxEquipo in this.equipoProvider.rutasCargadas[idxRuta].listaEquipos){
          if(this.equipoProvider.rutasCargadas[idxRuta].listaEquipos[idxEquipo].guardado){
            this.equipoProvider.rutasCargadas[idxRuta].fechaCierre = this.fecha;
            this.equipoProvider.rutasCargadas[idxRuta].cerrado = true;
            console.log("Fecha: "+this.equipoProvider.rutasCargadas[idxRuta].fechaCierre);
            console.log("idRutaEjecucion: "+this.equipoProvider.rutasCargadas[idxRuta].idRutaEjecucion);

            this.flag = true;
          }
        }
      }
    }

  }

  if(this.flag){
    this.flag = false;
    this.equipoProvider.guardar_storage();
    this.viewCtrl.dismiss();
    //this.navCtrl.pop();
  }else{

    this.alertCtrl.create({
      title: "Confirmación",
      subTitle: "¿Esta seguro de cerrar esta ruta?",
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
                              this.equipoProvider.rutasCargadas[idxRuta].cerrado = true;
                              console.log("Fecha: "+this.equipoProvider.rutasCargadas[idxRuta].fechaCierre);
                              console.log("idRutaEjecucion: "+this.equipoProvider.rutasCargadas[idxRuta].idRutaEjecucion);
                            }
                         }
                         this.equipoProvider.guardar_storage();

                         this.viewCtrl.dismiss();

                       }
      }]
    }).present();
  }

  loading.dismiss();

}

}
