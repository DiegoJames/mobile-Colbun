import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaRutaPage } from './lista-ruta';

@NgModule({
  declarations: [
    ListaRutaPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaRutaPage),
  ],
  exports: [
    ListaRutaPage,
  ],
})
export class ListaRutaPageModule {}
