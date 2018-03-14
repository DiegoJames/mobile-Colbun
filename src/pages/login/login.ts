import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController, ModalController } from 'ionic-angular';

import { DominioProvider } from "../../providers/index.providers";

import { UsuarioProvider } from "../../providers/usuario/usuario";

import { EquipoProvider } from "../../providers/equipo/equipo";

import { RutaTO } from "../../models/rutaTO.model";

import { UsuarioTO } from "../../models/UsuarioTO.model";

import { Network } from '@ionic-native/network';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  date = new Date();
  dominio:string = "Colbun";//   "1";
  username:string = "";//"sguerra";//e_pmunoz
  password:string = "";//"7410spgs..";  8520spgs..//colbun2019
  usuario:any;
  dataRuta:any;
  pendientes:any;
  loading:any;

  constructor(public navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              public usuarioProvider: UsuarioProvider,
              public dominioProvider: DominioProvider,
              public equipoProvider: EquipoProvider,
              private modalCtrl: ModalController,
              private network: Network) {

        console.log("INICIO STORAGE length: "+equipoProvider.rutasCargadas.length);
        if(equipoProvider.rutasCargadas.length > 0){
          console.log("ENTRO IF");
          this.elimarEquipoSincronizado();
        }
        console.log("SALIO IF");

        //console.log("INICIO STORAGE length: "+equipoProvider.rutasCargadas.length);
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
            //this.dominio = "Colbun";
          });
          console.log("FIN DOMINIO");
  }



  elimarEquipoSincronizado(){
    console.log("INICION ELIMINA DOMINIO");
    let idxRutaEliminar = [];
    let eliminarStorage:boolean = true;
    for(var idxRutaSincronizada in this.equipoProvider.rutasCargadas){
      console.log("SINCRONIZADO?: "+this.equipoProvider.rutasCargadas[idxRutaSincronizada].sincronizado);
      if(this.equipoProvider.rutasCargadas[idxRutaSincronizada].sincronizado){
        console.log("BORRO RUTA SINCRONIZADA: "+this.equipoProvider.rutasCargadas.length);
        idxRutaEliminar.push(idxRutaSincronizada);

      }
    }
    for(let idxEliminar of idxRutaEliminar){
      delete this.equipoProvider.rutasCargadas[idxEliminar];
      console.log("TERMINO FOR");
    }


    console.log("SALIO FOR");
    this.equipoProvider.rutasCargadas = this.equipoProvider.rutasCargadas.filter(Boolean);
    console.log("SALIO FILTER");

    for(var idxRutaCargadas in this.equipoProvider.rutasCargadas){
      if(this.equipoProvider.rutasCargadas[idxRutaCargadas].idRutaEjecucion != null){
        eliminarStorage = false;
      }
    }
    if(eliminarStorage){
      this.equipoProvider.rutasCargadas = [];
    }

    this.equipoProvider.guardar_storage();
    console.log("FIN FOR");
  }

  ingresar(){
    this.loading = this.loadingCtrl.create({
      content: "Cargando Rutas..."
    });
    this.loading.present();

    //this.equipoProvider.borrar_storage("usuario");
    let username = this.username.toLowerCase();
    let password = this.password;

    console.log("ID DOMINIO: "+this.dominio);

if(this.network.type != 'none'){
    this.usuarioProvider.ingresar( username, password, this.dominio ).then(
      (res) => {
                  //loading.dismiss();
                  console.log('success '+ JSON.stringify(res));
                  this.usuario = res;
                  //this.usuarioProvider.cargar_usuario(this.usuario);
                  //console.log('DATA: '+ this.usuario.credencialesValidas);

                  let usuarioTO = new UsuarioTO(
                    username,
                    password,
                    this.usuario.codigoUsuario,
                    this.usuario.credencialesValidas,
                    this.usuario.idComplejo,
                    this.usuario.idUsuario,
                    this.usuario.tieneAcceso
                  )
                  this.equipoProvider.usuario[0] = usuarioTO;

              console.log('USUARIO TO: '+ JSON.stringify(this.equipoProvider.usuario));

                  if( this.equipoProvider.usuario[0].credencialesValidas == "1" ){
                    if(this.equipoProvider.usuario[0].tieneAcceso == "1"){

                      if(this.equipoProvider.rutasCargadas.length > 0){
                        this.cargar_pendientes();
                      }else{
                        this.carga_lista_ruta();
                      }

                    }else{
                      this.alertCtrl.create({
                        title: "Error!",
                        subTitle: "Este usuario no tiene acceso a operar",
                        buttons: ["Ok"]
                      }).present();
                      this.loading.dismiss();
                    }
                  }else{
                    this.alertCtrl.create({
                      title: "Error!",
                      subTitle: "Usuario o contraseña incorrecta",
                      buttons: ["Ok"]
                    }).present();
                    this.loading.dismiss();
                  }

                },
      (err) => {
                this.loading.dismiss();
                //loading.dismiss();
                console.log('error '+ JSON.stringify(err));
                let alert = this.alertCtrl.create({
                  title: "Error!",
                  subTitle: "No se puede conectar con el servidor",
                  buttons: [
                  {
                    text: 'Volver',
                    handler: data =>{}
                  },
                  {
                    text: 'Reintentar',
                    handler: data => { this.ingresar(); }
                  }
                ]
                })
                alert.present();
                }
    )
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

  cargar_pendientes(){
    //let errorListaRuta:boolean = false;
    /*let loading = this.loadingCtrl.create({
      content: "Cargando Rutas..."
    });
    loading.present();*/

              console.log('LENGTH Cargadas: '+ JSON.stringify(this.equipoProvider.rutasCargadas.length));

              if(this.equipoProvider.rutasCargadas.length > 0){
                //  for(var idxPendiente in this.pendientesProvider.pendientes.listaRutasEjecutadas){
                    for(var idxRuta in this.equipoProvider.rutasCargadas){
                      console.log("idxCargadas: "+JSON.stringify(this.equipoProvider.rutasCargadas[idxRuta]));

                      this.equipoProvider.rutasCargadas[idxRuta].pendiente = true;

                    }

                    this.loading.dismiss();

                    this.alertCtrl.create({
                      title: "Aviso!",
                      subTitle: "Usted tiene rutas pendiente.",
                      buttons: [
                        {
                          text: 'OK',
                          handler: data =>{
                            let listaModal = this.modalCtrl.create( "ModalIniciaRutaPage" );
                            listaModal.present();
                          }
                        }
                      ]

                    }).present();

                  }else{
                      //loading.dismiss();
                      this.carga_lista_ruta();
                  }

            /*setTimeout(()=>{
               this.navCtrl.push("ListaRutaPage");

             }, 8000);*/

  }

  carga_lista_ruta(){

    /*let loading = this.loadingCtrl.create({
      content: "Espere por favor..."
    });
    loading.present();*/
    this.usuarioProvider.cargar_rutas(this.equipoProvider.usuario[0].idComplejo).then(
      (res) => {

                console.log('success '+ JSON.stringify(res));
                this.dataRuta = res;
                //this.usuarioProvider.cargar_dataRuta(this.dataRuta);
                console.log('LISTA DATA RUTA: '+ JSON.stringify(this.dataRuta));
                console.log('LISTA TO: '+ JSON.stringify(this.dataRuta.listaRuta.length));

                  for(var idxRuta in this.dataRuta.listaRuta){

                    let rutaTO = new RutaTO(
                      this.dataRuta.listaRuta[idxRuta].idRuta,
                      null,
                      null,
                      this.dataRuta.listaRuta[idxRuta].nombre,
                      this.equipoProvider.usuario[0].idUsuario,
                      false,
                      false,
                      false,
                      null,
                      this.dataRuta.listaRuta[idxRuta].idCentral,
                      false,
                      false,
                      []
                    );
                    this.equipoProvider.rutasCargadas.push(rutaTO);
                }
                //console.log('LISTA TO: '+ JSON.stringify(this.equipoProvider.listaRuta));
                this.loading.dismiss();
                let listaModal = this.modalCtrl.create( "ModalListaRutaPage" );

                listaModal.present();
              },
      (err) => {
                this.loading.dismiss();
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
