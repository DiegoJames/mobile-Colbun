import { Component } from '@angular/core';
import { IonicPage, ViewController, AlertController } from 'ionic-angular';

import { EquipoProvider } from "../../providers/index.providers";

import { RutaProvider } from "../../providers/ruta/ruta";

import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-modal-punto',
  templateUrl: 'modal-punto.html',
})
export class ModalPuntoPage {

  date = new Date();
  valorMedida:string;
  observacion:string;
  base64Image:string;
  base64ImageMovil:string;

  constructor(
              private alertCtrl: AlertController,
              public equipoProvider: EquipoProvider,
              public rutaProvider: RutaProvider,
              public camera: Camera,
              private viewCtrl: ViewController) {

                this.date;
                this.mostrar_datos_punto_guardado();
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

  mostrar_datos_punto_guardado(){

      this.observacion = this.rutaProvider.puntoInspeccion.observacion;
      this.base64ImageMovil = this.rutaProvider.puntoInspeccion.imagenMovil;
      this.valorMedida = this.rutaProvider.puntoInspeccion.valorMedida;


  console.log("FIN");
}

  eliminarFoto(){
    this.base64Image = null;
    this.base64ImageMovil = null;
  }

  guardar(){

      if(this.rutaProvider.puntoInspeccion.esSeleccion == '0'){
        if(this.valorMedida != ""){
          let valorFloat:number = parseFloat(this.valorMedida.replace(',','.'));
          let valorMinimoFloat:number = parseFloat(this.rutaProvider.puntoInspeccion.valorMinimo.replace(',','.'));
          let valorMaximoFloat:number = parseFloat(this.rutaProvider.puntoInspeccion.valorMaximo.replace(',','.'));
          console.log("valorFloat: "+valorFloat);
          console.log("valorMinimoFloat: "+valorMinimoFloat);
          console.log("valorMaximoFloat: "+valorMaximoFloat);
          console.log("CONDICION: "+valorMinimoFloat +"<=+" +valorFloat +"&&"+ valorFloat+"<="+ valorMaximoFloat);
          if(valorMinimoFloat <= valorFloat && valorFloat <= valorMaximoFloat){
            this.guardar_punto();
          }else{
              this.alertCtrl.create({
                title: "Advertencia!",
                subTitle: "El valor ingresado esta fuera de rango",
                buttons: [
                {
                  text: 'Cancelar',
                  handler: data =>{}
                },
                {
                  text: 'Guardar',
                  handler: data => {

                                      this.rutaProvider.notifica(true);
                                      this.guardar_punto();
                                    }
                }
              ]
              }).present();
          }
        }else{
          this.guardar_punto();
        }
      }else{
        this.guardar_punto();
      }
}

guardar_punto(){

  for(var idxRuta in this.equipoProvider.rutasCargadas){
    if(this.equipoProvider.rutasCargadas[idxRuta].idRuta == this.rutaProvider.idRuta){
      for(var idxEquipo in this.equipoProvider.rutasCargadas[idxRuta].listaEquipos){
        if(this.equipoProvider.rutasCargadas[idxRuta].listaEquipos[idxEquipo].idEquipo == this.rutaProvider.equipoTO.idEquipo){

          for(var idxPunto in this.equipoProvider.rutasCargadas[idxRuta].listaEquipos[idxEquipo].listaPuntoInspeccion){
            if(this.equipoProvider.rutasCargadas[idxRuta].listaEquipos[idxEquipo].listaPuntoInspeccion[idxPunto].idPuntoInspeccion == this.rutaProvider.puntoInspeccion.idPuntoInspeccion){
              this.equipoProvider.rutasCargadas[idxRuta].listaEquipos[idxEquipo].guardado = true;
              this.rutaProvider.puntoInspeccion.guardado = true;
              this.rutaProvider.puntoInspeccion.observacion = this.observacion;
              this.rutaProvider.puntoInspeccion.imagen = this.base64Image;
              this.rutaProvider.puntoInspeccion.imagenMovil = this.base64ImageMovil;
              this.rutaProvider.puntoInspeccion.valorMedida = this.valorMedida;

              this.rutaProvider.habilitaBoton(true);
              this.equipoProvider.rutasCargadas[idxRuta].listaEquipos[idxEquipo].listaPuntoInspeccion[idxPunto] = this.rutaProvider.puntoInspeccion;
            }
          }
        }
      }
    }
  }

  this.equipoProvider.guardar_storage();

  this.viewCtrl.dismiss();
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
    }, (err) => {
     // Handle error
     console.log("ERROR EN CAMARA", JSON.stringify(err));
    });
  }


}
