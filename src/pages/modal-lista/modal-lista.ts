import { Component } from '@angular/core';
import { IonicPage, ViewController, LoadingController, AlertController, ModalController } from 'ionic-angular';

import { EquipoProvider } from "../../providers/index.providers";

import { UsuarioProvider } from "../../providers/usuario/usuario";

import { RutaProvider } from "../../providers/ruta/ruta";

import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-modal-lista',
  templateUrl: 'modal-lista.html',
})
export class ModalListaPage {

  base64Image:string;
  base64ImageMovil:string;
  observacion:string;
  notificar:boolean;

  constructor(
              private viewCtrl: ViewController,
              public usuarioProvider: UsuarioProvider,
              public rutaProvider: RutaProvider,
              public equipoProvider: EquipoProvider,
              private camera: Camera,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController) {

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
                            this.viewCtrl.dismiss();
                         }
      }
    ]
    }).present();
  }

  carga_datos_equipos(){
    for(var idxRuta in this.equipoProvider.rutasCargadas){
      for(var idxEquipo in this.equipoProvider.rutasCargadas[idxRuta].listaEquipo){
        if(this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].idEquipo == this.rutaProvider.listaEquipo.idEquipo){

          this.observacion = this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].observacion;
          if(this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].notifica == "1"){
            this.notificar = true;
          }
          else{
            this.notificar = false;
          }
          this.base64ImageMovil = this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].imagenMovil;

        }
        for(var idxPunto in this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].listaPuntoInspeccion){
          if(this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].listaPuntoInspeccion[idxPunto].color == true){
            //this.rutaProvider.habilitaBoton(true);
          }
        }
      }

    }
  }

  eliminarFoto(){
    this.base64Image = null;
    this.base64ImageMovil = null;
  }

  styles(item:any){

      let styles = {
        'color': item.color ? 'green' : 'blank'
      }

    return styles;

  }

  inspeccionar( idPunto:string ){
    let loading = this.loadingCtrl.create({
      content: "Espere por favor..."
    });
    loading.present();

    console.log("IDPUNTO: "+idPunto);

    this.rutaProvider.cargar_punto_inspeccion( idPunto );
    loading.dismiss();
    //this.navCtrl.push("PuntoInspeccionPage");
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
      quality: 100,
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
     console.log("FOTO: ",this.base64Image);
     console.log("FOTO: "+this.base64Image);
    }, (err) => {
     // Handle error
     console.log("ERROR EN CAMARA", JSON.stringify(err));
    });
  }

  guardar(){

    for(var idxRuta in this.equipoProvider.rutasCargadas){
      for(var idxEquipo in this.equipoProvider.rutasCargadas[idxRuta].listaEquipo){
        if(this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].idEquipo == this.rutaProvider.listaEquipo.idEquipo){

          this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].observacion = this.observacion;
          if(this.notificar == true){
            this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].notifica = "1";
          }else{
            this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].notifica = "0";
          }

          this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].imagen = this.base64Image;
          this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].imagenMovil = this.base64ImageMovil;
          this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].color = true;

          this.rutaProvider.habilitaBoton(false);
          console.log("Guardar EQUIPO"+ JSON.stringify(this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo]));

        }
      }
    }

    this.viewCtrl.dismiss();

  }

}
