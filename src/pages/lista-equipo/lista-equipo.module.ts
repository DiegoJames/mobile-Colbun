import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaEquipoPage } from './lista-equipo';

@NgModule({
  declarations: [
    ListaEquipoPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaEquipoPage),
  ],
})
export class ListaEquipoPageModule {}
