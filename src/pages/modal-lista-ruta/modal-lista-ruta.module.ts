import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalListaRutaPage } from './modal-lista-ruta';

@NgModule({
  declarations: [
    ModalListaRutaPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalListaRutaPage),
  ],
})
export class ModalListaRutaPageModule {}
