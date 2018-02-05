import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalPuntoPage } from './modal-punto';

@NgModule({
  declarations: [
    ModalPuntoPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalPuntoPage),
  ],
  exports: [
    ModalPuntoPage
  ]
})
export class ModalPuntoPageModule {}
