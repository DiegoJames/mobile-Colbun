import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalListaPage } from './modal-lista';

@NgModule({
  declarations: [
    ModalListaPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalListaPage),
  ],
  exports: [
    ModalListaPage
  ]
})
export class ModalListaPageModule {}
