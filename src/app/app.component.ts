import { Component } from '@angular/core';
import { Platform, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { EquipoProvider } from "../providers/equipo/equipo";
import { UsuarioProvider } from "../providers/usuario/usuario";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  //rootPage:any;
  rootPage:any = "LoginPage";
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
              public equipoProvider: EquipoProvider, public usuarioProvider: UsuarioProvider, public app: App) {
    platform.ready().then(() => {
      //this.equipoProvider.cargar_storage();
      /*this.equipoProvider.cargar_storage()
      .then( ()=>{
        console.log("ACTIVO: "+this.equipoProvider.idUsuario);
      if(this.equipoProvider.idUsuario != null){
        this.rootPage = "ModalIniciaRutaPage";
      }else{
        this.rootPage = "LoginPage";
      }

    console.log("ACTIVO fuera: "+this.equipoProvider.idUsuario);*/
      statusBar.styleDefault();
      splashScreen.hide();
//});
      platform.registerBackButtonAction(() => {
        let navv = app.getActiveNav();
        if (navv.canGoBack()){ //Can we go back?
          /*//navv.pop();
          let confirms = alertCtrl.create({
          title: 'Advertencia!',
          message: '¿Deseas salir de la aplicación?',
          buttons: [{
                    text: 'No',
                    handler: () => { }
                    },
                    {
                    text: 'Si',
                    handler: () => { platform.exitApp(); }
                    }]
          });
          confirms.present();*/
        }
      });


  });
  }
}
