import { Component } from '@angular/core';
import { IonicPage, ViewController, AlertController } from 'ionic-angular';

import { EquipoProvider } from "../../providers/index.providers";

import { UsuarioProvider } from "../../providers/usuario/usuario";

import { RutaProvider } from "../../providers/ruta/ruta";

import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-modal-punto',
  templateUrl: 'modal-punto.html',
})
export class ModalPuntoPage {

  valorMedida:string;
  observacion:string;
  base64Image:string;
  base64ImageMovil:string;

  constructor(
              private alertCtrl: AlertController,
              public usuarioProvider: UsuarioProvider,
              public rutaProvider: RutaProvider,
              public equipoProvider: EquipoProvider,
              public camera: Camera,
              private viewCtrl: ViewController) {

                console.log("ModalPuntoPage: "+this.rutaProvider.puntoInspeccion.idPuntoInspeccion);
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
    for(var idxRuta in this.equipoProvider.rutasCargadas){
      for(var idxEquipo in this.equipoProvider.rutasCargadas[idxRuta].listaEquipo){
        for(var idxPunto in this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].listaPuntoInspeccion){

          if(this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].listaPuntoInspeccion[idxPunto].idPuntoInspeccion == this.rutaProvider.puntoInspeccion.idPuntoInspeccion){
            console.log("idPuntoInspeccion equipo: "+this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].listaPuntoInspeccion[idxPunto].idPuntoInspeccion);
            console.log("idPuntoInspeccion ruta: "+ this.rutaProvider.puntoInspeccion.idPuntoInspeccion);

              this.observacion = this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].listaPuntoInspeccion[idxPunto].observacion;
              this.base64ImageMovil = this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].listaPuntoInspeccion[idxPunto].imagenMovil;
              this.valorMedida = this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].listaPuntoInspeccion[idxPunto].valorMedida;

              console.log("FIN");
            }
          }
        }
      }
  }

  eliminarFoto(){
    this.base64Image = null;
    this.base64ImageMovil = null;
  }

  guardar(){

      if(this.rutaProvider.puntoInspeccion.esSeleccion == 0){
        if(this.valorMedida != ""){
          console.log("VALOR distinto vacio");
          let valorFloat:number = parseFloat(this.valorMedida.replace(',','.'));
          console.log("VALOR: "+valorFloat);
          let valorMinimoFloat:number = parseFloat(this.rutaProvider.puntoInspeccion.valorMinimo.replace(',','.'));
          console.log("VALOR MINIMO: "+valorMinimoFloat);
          let valorMaximoFloat:number = parseFloat(this.rutaProvider.puntoInspeccion.valorMaximo.replace(',','.'));
          console.log("VALOR MAXIMO: "+valorMaximoFloat);
          if(valorMinimoFloat <= valorFloat && valorFloat <= valorMaximoFloat){
            console.log("IF");
            this.guardar_punto();
          }else{
            console.log("ELSE");
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
                  handler: data => { this.guardar_punto(); }
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
    for(var idxEquipo in this.equipoProvider.rutasCargadas[idxRuta].listaEquipo){
      for(var idxPunto in this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].listaPuntoInspeccion){
        if(this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].listaPuntoInspeccion[idxPunto].idPuntoInspeccion == this.rutaProvider.puntoInspeccion.idPuntoInspeccion){

          this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].listaPuntoInspeccion[idxPunto].observacion = this.observacion;
          this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].listaPuntoInspeccion[idxPunto].imagen = this.base64Image;
          this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].listaPuntoInspeccion[idxPunto].imagenMovil = this.base64ImageMovil;
          this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].listaPuntoInspeccion[idxPunto].valorMedida = this.valorMedida;
          this.equipoProvider.rutasCargadas[idxRuta].listaEquipo[idxEquipo].listaPuntoInspeccion[idxPunto].color = true;

          this.rutaProvider.habilitaBoton(true);
          console.log("idPuntoInspeccion guardar: "+this.rutaProvider.puntoInspeccion.idPuntoInspeccion);
          console.log("idPuntoInspeccion guardar: "+this.valorMedida);
        }
      }
    }
  }
  this.viewCtrl.dismiss();
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
    }, (err) => {
     // Handle error
     console.log("ERROR EN CAMARA", JSON.stringify(err));
    });
  }


}
