import { Component } from '@angular/core';
import { Platform, App, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UsuarioProvider } from "../providers/usuario/usuario";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  //rootPage:any;
  rootPage:any = "LoginPage";
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
              public usuarioProvider: UsuarioProvider, public app: App, private alertCtrl: AlertController) {
    platform.ready().then(() => {

      /*this.usuarioProvider.cargar_storage()
      .then( ()=>{

      if(this.usuarioProvider.activo()){
        this.rootPage = "IniciaRutaPage";

      }else{
        this.rootPage = "LoginPage";
      }*/

      statusBar.styleDefault();
      splashScreen.hide();

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

  //  });
  }
}
