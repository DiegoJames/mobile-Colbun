import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController } from 'ionic-angular';

import { DominioProvider, EquipoProvider } from "../../providers/index.providers";

import { UsuarioProvider } from "../../providers/usuario/usuario";

import { CargaRutaTO } from "../../models/CargaRutaTO.model";

import { UsuarioTO } from "../../models/UsuarioTO.model";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  dominio:string = "Colbun";//   "1";
  username:string = "dorellana";//"sguerra";//
  password:string = "1234";//"7410spgs..";  8520spgs..//
  usuario:any;
  dataRuta:any;
  pendientes:any;

  constructor(public navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              public usuarioProvider: UsuarioProvider,
              public dominioProvider: DominioProvider,
              public equipoProvider: EquipoProvider) {

        dominioProvider.carga_dominio()
        .then(data => {
   		     //console.log(data);
    	    })
 	        .catch(error => {
            console.log("ERPR:" +JSON.stringify(error));
            /*this.alertCtrl.create({
              title: "Error, sin conexion",
              subTitle: "No se pudieron cargar los dominios",
              buttons: ["Ok"]
            }).present();*/
            this.dominio = "Colbun";
          });
  }

  ingresar(){
    console.log("ID DOMINIO: "+this.dominio);
    let loading = this.loadingCtrl.create({
      content: "Espere por favor..."
    });
    loading.present();
    // Verificar si la clave es valida
    this.usuarioProvider.ingresar( this.username.toLowerCase(), this.password, this.dominio ).then(
      (res) => {
                  loading.dismiss();
                  console.log('success '+ JSON.stringify(res));
                  this.usuario = res;
                  console.log('DATA '+ this.usuario.credencialesValidas);
                  if( this.usuario.credencialesValidas === 1 ){
                    if(this.usuario.tieneAcceso === 1){
                      this.usuarioProvider.cargar_usuario(this.usuario);

                      let usuarioTO = new UsuarioTO(
                        this.username.toLowerCase(),
                        this.password
                      )
                      this.equipoProvider.usuario.push(usuarioTO);

                  console.log('USUARIO TO: '+ JSON.stringify(this.equipoProvider.usuario));


                      this.carga_lista_ruta();

                    }else{
                      this.alertCtrl.create({
                        title: "Error al ingresar",
                        subTitle: "Credenciales correctas pero no tiene acceso a operar",
                        buttons: ["Ok"]
                      }).present();
                    }
                  }else{
                    this.alertCtrl.create({
                      title: "Error al ingresar",
                      subTitle: "Credenciales incorrectas",
                      buttons: ["Ok"]
                    }).present();
                  }
                },
      (err) => {
                loading.dismiss();
                console.log('error '+ JSON.stringify(err));
                this.alertCtrl.create({
                  title: "Error al ingresar!",
                  subTitle: "No se puede conectar con el servidor",
                  buttons: [
                  {
                    text: 'Salir',
                    handler: data =>{}
                  },
                  {
                    text: 'Reintentar',
                    handler: data => { this.ingresar(); }
                  }
                ]
                }).present();
                }
    )
  }

  carga_lista_ruta(){
    let loading = this.loadingCtrl.create({
      content: "Espere por favor..."
    });
    loading.present();
    this.usuarioProvider.cargar_rutas().then(
      (res) => {
                loading.dismiss();
                console.log('success '+ JSON.stringify(res));
                this.dataRuta = res;
                this.usuarioProvider.cargar_dataRuta(this.dataRuta);

                for(var idxListaRuta in this.usuarioProvider.dataRuta){

                    let rutaTO = new CargaRutaTO(
                      this.usuarioProvider.dataRuta[idxListaRuta].idRuta,
                      this.usuarioProvider.dataRuta[idxListaRuta].nombre,
                      false,
                    )
                    this.equipoProvider.listaRuta.push(rutaTO);
                }
                console.log('LISTA TO: '+ JSON.stringify(this.equipoProvider.listaRuta));

                this.navCtrl.push("ListaRutaPage");


                },
      (err) => {
                loading.dismiss();
                console.log('error '+ JSON.stringify(err));
                this.alertCtrl.create({
                  title: "Error al obtener lista de rutas!",
                  subTitle: "No se puede conectar con el servidor",
                  buttons: [
                  {
                    text: 'Salir',
                    handler: data =>{}
                  },
                  {
                    text: 'Reintentar',
                    handler: data => { this.carga_lista_ruta(); }
                  }
                ]
                }).present();

                }
    )
  }

  }
