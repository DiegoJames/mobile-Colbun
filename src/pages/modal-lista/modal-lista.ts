import { Component } from '@angular/core';
import { IonicPage, ViewController, ModalController, AlertController } from 'ionic-angular';

import { EquipoProvider } from "../../providers/index.providers";

import { RutaProvider } from "../../providers/ruta/ruta";

import { Camera, CameraOptions } from '@ionic-native/camera';

import { PuntoInspeccionTO } from "../../models/puntoInspeccionTO.model";

@IonicPage()
@Component({
  selector: 'page-modal-lista',
  templateUrl: 'modal-lista.html',
})
export class ModalListaPage {

  date = new Date();
  base64Image:string;
  base64ImageMovil:string;
  observacion:string;
  notificar:boolean;


  constructor(
              private viewCtrl: ViewController,
              public rutaProvider: RutaProvider,
              public equipoProvider: EquipoProvider,
              private camera: Camera,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController) {
        this.date;
        this.carga_datos_equipos();

  }

  atras(){
    this.alertCtrl.create({
      title: "¿Seguro que desea cerrar?",
      subTitle: "Si cierra no se guardarán los datos",
      buttons: [
      {
        text: 'No',
        handler: data =>{}
      },
      {
        text: 'Si',
        handler: data => {
                            this.rutaProvider.borrarScanner(true);
                            this.viewCtrl.dismiss();
                         }
      }
    ]
    }).present();
  }

  carga_datos_equipos(){

    this.observacion = this.rutaProvider.equipoTO.observacion;
    if(this.rutaProvider.equipoTO.notifica == "1"){
      this.notificar = true;
    }
    else{
      this.notificar = false;
    }
    this.base64ImageMovil = this.rutaProvider.equipoTO.imagenMovil;

  }

  eliminarFoto(){
    this.base64Image = null;
    this.base64ImageMovil = null;
  }

  styles(item:PuntoInspeccionTO){

      let styles = {
        'color': item.guardado ? 'green' : 'blank'
      }

    return styles;

  }

  inspeccionar( idPunto:string ){
    console.log("IDPUNTO: "+idPunto);

    this.rutaProvider.cargar_punto_inspeccion( idPunto );


    let listaModal = this.modalCtrl.create( "ModalPuntoPage" );

    listaModal.present();

    listaModal.onDidDismiss( idEquipo => {

      if(idEquipo){
        console.log("Data del modal:");
        console.log( idEquipo );
      }else
      {
        console.log("Se cerro el modal sin parametros");
      }

    });

  }

  mostrar_camara(){
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 350,
      correctOrientation: false
    }

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     this.base64Image = imageData;
     this.base64ImageMovil = 'data:image/jpeg;base64,' + imageData;
     console.log("FOTO MOVIL: "+this.base64ImageMovil);
     console.log("FOTO WS: "+this.base64Image);
    }, (err) => {
     // Handle error
     console.log("ERROR EN CAMARA", JSON.stringify(err));
    });
  }

  guardar(){
          this.rutaProvider.equipoTO.observacion = this.observacion;

          if(this.rutaProvider.notificacion && this.notificar){
            this.rutaProvider.equipoTO.notifica = "1";
          }else{
            this.rutaProvider.equipoTO.notifica = "0";
          }

          this.rutaProvider.equipoTO.imagen = this.base64Image;
          this.rutaProvider.equipoTO.imagenMovil = this.base64ImageMovil;
          this.rutaProvider.equipoTO.guardado = true;
          console.log("COLOR: "+this.rutaProvider.equipoTO.guardado);
          console.log("IMAGEN: "+this.rutaProvider.equipoTO.imagen);
          console.log("IMAGEN: "+this.rutaProvider.equipoTO.imagenMovil);

          this.rutaProvider.habilitaBoton(false);
          this.rutaProvider.notifica(false);

          for(var idxRuta in this.equipoProvider.rutasCargadas){
            if(this.equipoProvider.rutasCargadas[idxRuta].idRuta == this.rutaProvider.idRuta){
              for(var idxEquipo in this.equipoProvider.rutasCargadas[idxRuta].listaEquipos){
                if(this.equipoProvider.rutasCargadas[idxRuta].listaEquipos[idxEquipo].idEquipo == this.rutaProvider.equipoTO.idEquipo){
                  this.equipoProvider.rutasCargadas[idxRuta].listaEquipos[idxEquipo] = this.rutaProvider.equipoTO;
                }
              }
            }

    }

    this.equipoProvider.guardar_storage();
    this.rutaProvider.borrarScanner(true);

    this.viewCtrl.dismiss();

  }

}
