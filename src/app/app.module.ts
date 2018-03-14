import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

import { EquipoProvider, DominioProvider, SincronizarProvider } from "../providers/index.providers";

import { UsuarioProvider } from "../providers/usuario/usuario";

import { RutaProvider } from '../providers/ruta/ruta';

import { Camera } from '@ionic-native/camera';

//import { DatePipe } from '@angular/common'

import { Network } from '@ionic-native/network';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UsuarioProvider,
    RutaProvider,
    EquipoProvider,
    Camera,
    //DatePipe,
    DominioProvider,
    SincronizarProvider,
    Network
  ]
})
export class AppModule {}
