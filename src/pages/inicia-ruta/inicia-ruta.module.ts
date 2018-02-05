import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IniciaRutaPage } from './inicia-ruta';
//import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    IniciaRutaPage,
  ],
  imports: [
    IonicPageModule.forChild(IniciaRutaPage),
    //PipesModule
  ],
  exports: [
    IniciaRutaPage
  ]
})
export class IniciaRutaPageModule {}
