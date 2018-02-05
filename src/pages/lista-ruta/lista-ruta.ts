import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { EquipoProvider } from "../../providers/index.providers";

import { UsuarioProvider } from "../../providers/usuario/usuario";

import { RutaProvider } from "../../providers/ruta/ruta";

import { EquipoTO } from "../../models/EquipoTO.model";

import { PuntoInspeccionTO } from "../../models/puntoInspeccionTO.model";

import { ValorSeleccionTO } from "../../models/valorSeleccionTO.model";

import { CargaRutaTO } from "../../models/CargaRutaTO.model";

@IonicPage()
@Component({
  selector: 'page-lista-ruta',
  templateUrl: 'lista-ruta.html',
})
export class ListaRutaPage {

  idRuta:string;
  dataRuta:any;
  dataEquipo:any;
  flag:boolean = false;
  listaRuta:CargaRutaTO[] = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              public usuarioProvider: UsuarioProvider,
              public rutaProvider: RutaProvider,
              public equipoProvider: EquipoProvider) {

              }

  seleccion_radio(ruta:any, isChecked: boolean, idx:number){
    console.log("ID EJECUCION RUTA: "+JSON.stringify(this.equipoProvider.listaRuta));
    this.equipoProvider.cargar_rutas(ruta.idRuta, ruta.nombre, isChecked, idx, false);

  }

  inicia_ruta(){


  this.equipoProvider.rutasCargadas = this.equipoProvider.rutasSeleccionadas.filter(Boolean);

  console.log( "THIS_RUTAS[0]: "+JSON.stringify(this.equipoProvider.rutasSeleccionadas[0]) );
  console.log( "THIS_RUTAS[1]: "+JSON.stringify(this.equipoProvider.rutasSeleccionadas[1]) );

  console.log( "THIS_RUTAS[2]: "+JSON.stringify(this.equipoProvider.rutasCargadas.length) );
  if(this.equipoProvider.rutasCargadas.length > 0){

    //console.log("RUTA EJECUTADA: "+this.equipoProvider.rutasCargadas.);
    this.obtieneCatalogoEquipo();
    //this.obtieneIniciaRuta();



        console.log( "LISTA DEL WS: "+ JSON.stringify(this.equipoProvider.rutasCargadas));

        //this.validacioRuta();


        console.log("FIN LISTA RUTA");

  }else{
    this.alertCtrl.create({
      title: "Advertencia!",
      subTitle: "Seleccione rutas",
      buttons: ["Ok"]
    }).present();

  }

  //this.equipoProvider.guardar_storage();
}

validacioRuta(){
  for(var idxListaRuta in this.equipoProvider.listaRuta){


    for(var idxRutaCargada in this.equipoProvider.rutasCargadas){

      if(this.equipoProvider.listaRuta[idxListaRuta].idRuta == this.equipoProvider.rutasCargadas[idxRutaCargada].idRuta){

        console.log("RUTAS CARGADAS: "+JSON.stringify(this.equipoProvider.rutasCargadas[idxRutaCargada]));
          this.equipoProvider.listaRuta[idxListaRuta].bloqueado = true;

        console.log("OK BLOQUEADO: "+this.equipoProvider.listaRuta[idxListaRuta].bloqueado);
        //console.log("OK OCULTO: "+this.equipoProvider.rutasCargadas[idxRutaCargada].oculto);
        for (var idxRutaCentral in this.equipoProvider.listaRuta) {
          if(this.equipoProvider.listaRuta[idxRutaCentral].idRuta == this.equipoProvider.rutasCargadas[idxRutaCargada].idRuta){
            //this.equipoProvider.rutasCargadas[idxRutaCargada].idCentral = this.equipoProvider.listaRuta[idxRutaCentral].idCentral;
            //console.log("CENTRAL: "+this.equipoProvider.rutasCargadas[idxRutaCargada].idCentral);
          }
        }

      }

    }
  }
}


obtieneIniciaRuta(idRuta:string){
  /*let loading = this.loadingCtrl.create({
    content: "Espere por favor..."
  });
  loading.present();*/
  let iniciaRuta:boolean = false;
   for(let to of this.equipoProvider.rutasCargadas){
     if(to.idRuta == idRuta){
       if(to.idRutaEjecucion == null){
         iniciaRuta = true;
       }
     }

   }

//  for(let to of this.equipoProvider.rutasCargadas){
  //  console.log("IDEJECUCION-RUTA: "+JSON.stringify(to.idRutaEjecucion));
   if(iniciaRuta){
  //  console.log("WS-RUTA: "+JSON.stringify(to.idRuta));
    console.log("ID USUARIO: "+this.usuarioProvider.usuario.idUsuario);

    this.rutaProvider.iniciar_ruta(idRuta, this.usuarioProvider.usuario.idUsuario)
    .then(
      (res) => {

                console.log('success rutaEjecucion'+ JSON.stringify(res));
                this.dataRuta = res;
                this.rutaProvider.ejecucionRuta(this.dataRuta);
                console.log('EJECUCION '+ this.dataRuta.idEjecucionRuta);
                console.log('ID USUARIO: '+ this.usuarioProvider.usuario.idUsuario);
                this.equipoProvider.agrega_rutaToLista(idRuta, this.dataRuta.idEjecucionRuta, this.usuarioProvider.usuario.idUsuario, false);
                },
      (err) => {

                  console.log('error '+ JSON.stringify(err));
                  /*let continuar = this.alertCtrl.create({
                    title: "Error al iniciar una ruta!",
                    subTitle: "No se puede conectar con el servidor",
                    buttons: [
                    {
                      text: 'Salir',
                      handler: data =>{}
                    },
                    {
                      text: 'Reintentar',
                      handler: data => { this.obtieneIniciaRuta(idRuta); }
                    }
                  ]
                  })
                  continuar.present();
                */}
    )

}


  console.log('TERMINO INICIO RUTA');
}

obtieneCatalogoEquipo(){

  let cantidadEquipo = 0;
  let rutaSinEquipo:string = "";
  let loading = this.loadingCtrl.create({
    content: "Cargando Equipos..."
  });
  loading.present();
  for (let to of this.equipoProvider.rutasCargadas){
    console.log("WS-EQUIPO: "+JSON.stringify(to.idRuta));
    this.rutaProvider.carga_equipos(to.idRuta).then(
      (res) => {

                  console.log('success catalogo equipo'+ JSON.stringify(res));
                  console.log("ID-EQUIPO: "+JSON.stringify(to.idRuta));
                  this.dataEquipo = res;
                  console.log("REST: "+JSON.stringify(res));
                  this.rutaProvider.catalogoEquipo(this.dataEquipo);

                  //console.log( "ENTRO REST EQUIPOS---"+id);

                  let listaEquipos:EquipoTO[] = [];
                  for(let to of this.rutaProvider.dataEquipo.listaEquipos){


                    let listaPunto:PuntoInspeccionTO[] = [];
                    for(let toPunto of to.listaPuntosInspeccion){

                      let listaValor:ValorSeleccionTO[] = [];
                      if(toPunto.listaValoresSeleccion != null){
                        for(let toValor of toPunto.listaValoresSeleccion){
                            let valorTO = new ValorSeleccionTO(
                              toValor.idValorSeleccion,
                              toValor.valor
                            )
                            listaValor.push(valorTO);
                          }
                      }else{
                        let valorTO = null;
                        listaValor.push(valorTO);
                      }

                        let puntoTO = new PuntoInspeccionTO(
                          toPunto.esSeleccion,
                          toPunto.idPuntoInspeccion,
                          toPunto.idTipoPunto,
                          toPunto.referenciaFisica,
                          toPunto.tipoPunto,
                          toPunto.unidadMedida,
                          toPunto.valorAlerta,
                          toPunto.valorMaximo,
                          toPunto.valorMinimo,
                          false,
                          '',
                          '',
                          '',
                          '',
                          listaValor
                        )

                      listaPunto.push(puntoTO);

                    }

                    let equipoTO = new EquipoTO(
                      to.codigoSAP,
                      to.idEquipo,
                      to.nombre,
                      to.notifica,
                      to.referenciaFabricante,
                      to.referenciaFisica,
                      false,
                      '',
                      '',
                      '',
                      listaPunto
                    )

                    listaEquipos.push(equipoTO);
                    }
                    //this.equipoProvider.agrega_equipoToLista(to.idRuta, listaEquipos);

                    if(listaEquipos.length > 0){
                      console.log("listaEquipos.length: "+listaEquipos.length);
                      console.log("listaEquipos: "+JSON.stringify(listaEquipos));

                      this.equipoProvider.agrega_equipoToLista(to.idRuta, listaEquipos);

                      this.obtieneIniciaRuta(to.idRuta);
                    }else{

                      console.log("INICIO FOR: "+this.equipoProvider.rutasCargadas.length);
                      for(var idxCargadas in this.equipoProvider.rutasCargadas){
                        console.log("FOR: "+JSON.stringify(this.equipoProvider.rutasCargadas[idxCargadas]));
                        if(this.equipoProvider.rutasCargadas[idxCargadas].idRuta == to.idRuta && listaEquipos.length == 0){
                          console.log("INICIO IF: "+JSON.stringify(this.equipoProvider.rutasCargadas[idxCargadas].idRuta));
                          rutaSinEquipo += this.equipoProvider.rutasCargadas[idxCargadas].nombre+" - ";

                          cantidadEquipo++;
                          console.log("catidadEquipo: "+cantidadEquipo);

                          console.log("DELETE: "+JSON.stringify(this.equipoProvider.rutasCargadas[idxCargadas]));
                          //console.log("DELETE: "+JSON.stringify(this.equipoProvider.rutasCargadas[idxCargadas]));
                          delete this.equipoProvider.rutasCargadas[idxCargadas];

                          this.equipoProvider.rutasCargadas = this.equipoProvider.rutasCargadas.filter(Boolean);
                          console.log("LENGTH: "+this.equipoProvider.rutasCargadas.length);

                        }
                      }

                    }


                },
      (err) => {

                  console.log('error '+ JSON.stringify(err));
                  /*let continuar = this.alertCtrl.create({
                    title: "Error al obtener un catalogo de equipos!",
                    subTitle: "No se puede conectar con el servidor",
                    buttons: [
                    {
                      text: 'Salir',
                      handler: data =>{}
                    },
                    {
                      text: 'Reintentar',
                      handler: data => { this.obtieneCatalogoEquipo(); }
                    }
                  ]
                  })
                  continuar.present();
                */}
    )


  }


  setTimeout(()=>{
    console.log("IF: "+cantidadEquipo);
    if(cantidadEquipo > 0){
      cantidadEquipo = 0;
      console.log("RUTAS SIN EQUIPOS "+rutaSinEquipo);
      let alert = this.alertCtrl.create({
        title: "Advertencia!",
        subTitle: "La(s) siguiente(s) ruta(s) no se pueden cargar porque no tienen equipos asignados: "+rutaSinEquipo,
        buttons: ["Ok"]
      })
      alert.present();

    }
    loading.dismiss();
    console.log('OK OK OK');
    this.validacioRuta();

    this.navCtrl.push("IniciaRutaPage", {'rutasCargadas':this.equipoProvider.rutasCargadas});
  }, 8000);


  console.log('TERMINO CATALOGO EQUIPO');
}






}
