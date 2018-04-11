import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, AlertController } from 'ionic-angular';

import { EquipoProvider } from "../../providers/index.providers";

import { UsuarioProvider } from "../../providers/usuario/usuario";

import { RutaProvider } from "../../providers/ruta/ruta";

import { RutaTO } from "../../models/rutaTO.model";

import { EquipoTO } from "../../models/EquipoTO.model";

import { PuntoInspeccionTO } from "../../models/puntoInspeccionTO.model";

import { ValorSeleccionTO } from "../../models/valorSeleccionTO.model";

import { Network } from '@ionic-native/network';

@IonicPage()
@Component({
  selector: 'page-modal-lista-ruta',
  templateUrl: 'modal-lista-ruta.html',
})
export class ModalListaRutaPage {


  date = new Date();
  idRuta:string;
  dataRuta:any;
  dataEquipo:any;
  flag:boolean = false;
  check:boolean = false;
  avanzar:boolean = false;
  bloqueado:boolean = false;
  colores:boolean = false;
  bloqueados:boolean = false;
  loading:any;
  cerrarApp:boolean = true;

  cantidadEquipo:number = 0;
  rutaSinEquipo:string = "";
  lstEquipo:number = 0;

  equiposAgregados:number = 0;
  iniciaRutaAgregada:number = 0;

  //cantSelec:number = 0;
  cargaCatalogo:number = 0;
  guardarIdRuta:any = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              public usuarioProvider: UsuarioProvider,
              public rutaProvider: RutaProvider,
              public equipoProvider: EquipoProvider,
              private modalCtrl: ModalController,
              private network: Network) {
                this.date;
                this.btnSiguiente();

              }

  avanzarPagina(){

    if(this.avanzar){

      //this.equipoProvider.guardar_storage(this.equipoProvider.usuario[0].idUsuario);
      this.rutaProvider.botones();
      let listaModal = this.modalCtrl.create( "ModalIniciaRutaPage" );

      listaModal.present();
      listaModal.onDidDismiss( idEquipo => {

        if(idEquipo){
          console.log("Data del modal:");
          console.log( idEquipo );
        }
        else{
          console.log("Se cerro el modal sin parametros");
        }
      });
    }
  }

  btnSiguiente(){

    for(var idxRutaCargada in this.equipoProvider.rutasCargadas){
      if(this.equipoProvider.rutasCargadas[idxRutaCargada].idRutaEjecucion != null){
        this.avanzar = true;
      }
    }
  }

  seleccion_radio(ruta:RutaTO, isChecked:boolean, idx:number){
    console.log("ID EJECUCION RUTA: "+JSON.stringify(this.equipoProvider.rutasCargadas));

    this.equipoProvider.cargar_rutas(isChecked, ruta.idRuta);
  }

  cerrarAplicacion(){
    console.log("CERRAR APP"+this.cerrarApp);
    //if(this.cerrarApp){
    this.alertCtrl.create({
      title: "Advertencia!",
      subTitle: "¿Esta seguro de cerrar sesion?",
      buttons: [
      {
        text: 'No',
        handler: data =>{}
      },
      {
        text: 'Si',
        handler: data => {
          //this.usuarioProvider.cerrar_sesion();
        //this.platform.exitApp();
        //this.navCtrl.push("LoginPage");
          this.rutaProvider.botones();
          //console.log("id Usuario: "+this.equipoProvider.idUsuario);
          //this.equipoProvider.borrar_storage();
          //console.log("id Usuario: "+this.equipoProvider.idUsuario);
          this.elimarRutaNoIniciadas();
          this.navCtrl.push("LoginPage");

          //this.equipoProvider.guardar_storage();
        }
        //this.navCtrl.popToRoot();
       }
    ]
    }).present();
  //}else{
    /*this.alertCtrl.create({
    title: "Error!",
    subTitle: "No puede cerrar debido a que ya cargo rutas",
    buttons: ["Ok"]
  }).present();*/

  //}
  }

  elimarRutaNoIniciadas(){
    let idxRuta = [];
    for(var idxRutaNoIniciada in this.equipoProvider.rutasCargadas){
      console.log("idRutaEjecucion?: "+this.equipoProvider.rutasCargadas[idxRutaNoIniciada].idRutaEjecucion);
      if(this.equipoProvider.rutasCargadas[idxRutaNoIniciada].idRutaEjecucion == null){
        console.log("BORRO RUTA NO INICIADA: "+this.equipoProvider.rutasCargadas.length);
        idxRuta.push(idxRutaNoIniciada);
      }
    }
    for(let idxEliminar of idxRuta){
      delete this.equipoProvider.rutasCargadas[idxEliminar];
      console.log("ELIMINADAS NO INICIADAS");
    }

    this.equipoProvider.rutasCargadas = this.equipoProvider.rutasCargadas.filter(Boolean);
    console.log("FILTER "+this.equipoProvider.rutasCargadas.length);
    
    this.equipoProvider.guardar_storage();
  }

  inicia_ruta(){
    if(this.network.type != 'none'){
      //this.cerrarApp = false;
      this.cantidadEquipo = 0;
      this.equiposAgregados = 0;
      this.iniciaRutaAgregada = 0;
      this.lstEquipo = 0;
      this.guardarIdRuta = [];
      this.rutaSinEquipo = "";
      console.log("rutaSinEquipo: "+this.rutaSinEquipo);
      let hayRutaSelec = false;
      for(var idxRuta in this.equipoProvider.rutasCargadas){
        if(this.equipoProvider.rutasCargadas[idxRuta].iniciado && this.equipoProvider.rutasCargadas[idxRuta].idRutaEjecucion == null){
          hayRutaSelec = true;
          //this.cantSelec++;
          //console.log("CANTIDAD SELECC: "+this.cantSelec);
        }
      }
      if(hayRutaSelec){

        this.obtieneCatalogoEquipo();
        console.log( "LISTA DEL WS: "+ JSON.stringify(this.equipoProvider.rutasCargadas));
        console.log("FIN LISTA RUTA");

        }else{
          this.alertCtrl.create({
            title: "Advertencia!",
            subTitle: "Seleccione rutas",
            buttons: ["Ok"]
          }).present();

        }
      }else{
          // dispositivo sin internet
          console.log("stuff if disconnected");
          //this.loading.dismiss();
          this.alertCtrl.create({
            title: "Error!",
            subTitle: "Revise su conexión a internet, y reintente nuevamente.",
            buttons: ["Ok"]
          }).present();
          return;
      }
}



obtieneIniciaRuta(){

  //  console.log("WS-RUTA: "+JSON.stringify(to.idRuta));
    console.log("ID USUARIO: "+this.equipoProvider.usuario[0].idUsuario);
  for(let idRuta of this.guardarIdRuta){
    this.rutaProvider.iniciar_ruta(idRuta, this.equipoProvider.usuario[0].idUsuario)
    .then(
      (res) => {
              this.iniciaRutaAgregada++;
            //this.loading.dismiss();
              console.log('success rutaEjecucion'+ JSON.stringify(res));
              this.dataRuta = res;
              //this.rutaProvider.ejecucionRuta(this.dataRuta);
              console.log('EJECUCION: '+ this.dataRuta.idEjecucionRuta);
              //console.log('ID USUARIO: '+ this.equipoProvider.usuario[0].idUsuario);
              this.equipoProvider.agrega_rutaToLista(idRuta, this.dataRuta.idEjecucionRuta, this.equipoProvider.usuario[0].idUsuario);
              //this.equipoProvider.guardar_storage();
              console.log("iniciaRutaAgregada: "+this.iniciaRutaAgregada);
              console.log("equiposAgregados: "+this.equiposAgregados);

              if(this.iniciaRutaAgregada == this.equiposAgregados){
                console.log("IF: "+this.cantidadEquipo);

                  if(this.cantidadEquipo > 0){
                    console.log("RUTAS SIN EQUIPOS "+this.rutaSinEquipo);
                    this.alertCtrl.create({
                      title: "Advertencia!",
                      subTitle: "Hay "+ this.cantidadEquipo +" ruta(s) no se pueden cargar, debido a que no tienen equipos asignados: <strong>"+this.rutaSinEquipo.substring(0, (this.rutaSinEquipo.length - 2))+"</strong>",
                      buttons: [
                      {
                        text: 'OK',
                        handler: data =>{
                            this.rutaProvider.botones();
                            //this.equipoProvider.idUsuario = this.equipoProvider.usuario[0].idUsuario;
                            this.equipoProvider.guardar_storage();
                            this.loading.dismiss();
                            let listaModal = this.modalCtrl.create( "ModalIniciaRutaPage" );
                            listaModal.present();
                        }
                      }
                    ]
                    }).present();
                  }else{
                    console.log("ELSE: "+this.cantidadEquipo);
                    this.rutaProvider.botones();
                    //this.equipoProvider.idUsuario = this.equipoProvider.usuario[0].idUsuario;
                    this.equipoProvider.guardar_storage();
                    this.loading.dismiss();
                    let listaModal = this.modalCtrl.create( "ModalIniciaRutaPage" );
                    listaModal.present();
                  }
              }

              console.log('***FIN***');
              },
    (err) => {
          this.loading.dismiss();
                console.log('error '+ JSON.stringify(err));
                return;
                }
  )
}
if(this.cantidadEquipo > 0){
  console.log("FUERA FOR");
  this.iniciaRutaAgregada = this.cantidadEquipo;
  console.log("iniciaRutaAgregada:" +this.iniciaRutaAgregada);
  if(this.iniciaRutaAgregada == this.equiposAgregados){
    console.log("FUERA IF");
    this.alertCtrl.create({
      title: "Advertencia!",
      subTitle: "Hay "+ this.cantidadEquipo +" ruta(s) no se pueden cargar, debido a que no tienen equipos asignados: <strong>"+this.rutaSinEquipo.substring(0, (this.rutaSinEquipo.length - 2))+"</strong>",
      buttons: [
      {
        text: 'OK',
        handler: data =>{
            this.loading.dismiss();
        }
      }
    ]
    }).present();
    //this.cerrarApp = true;
    console.log("cantidadEquipo: "+this.cantidadEquipo);
  }

}
  console.log('TERMINO INICIO RUTA');
}

obtieneCatalogoEquipo(){

  /*let cantidadEquipo:number = 0;
  let rutaSinEquipo:string = "";
  let lstEquipo:number = 0;*/
  let errorEquipo:number = 0;
  this.loading = this.loadingCtrl.create({
    content: "Cargando Rutas..."
  });
  this.loading.present();
  for (let to of this.equipoProvider.rutasCargadas){
    if(to.idRutaEjecucion == null && to.iniciado){
      console.log("WS-EQUIPO: "+JSON.stringify(to.idRuta));
      this.cargaCatalogo++;
    this.rutaProvider.cargar_equipos(to.idRuta).then(
      (res) => {

                  console.log('success catalogo equipo'+ JSON.stringify(res));
                  console.log("ID-EQUIPO: "+JSON.stringify(to.idRuta));
                  this.dataEquipo = res;
                  console.log("REST: "+JSON.stringify(res));

                 if(this.dataEquipo.status.codigo != 0){
                 errorEquipo++;
                 console.log("cargaCatalogo: "+JSON.stringify(this.cargaCatalogo));
                 console.log("errorEquipo: "+JSON.stringify(errorEquipo));
                 if(errorEquipo == this.cargaCatalogo){
                   this.cargaCatalogo = 0;
                   errorEquipo = 0;
                   console.log("estatus: "+JSON.stringify(this.dataEquipo.status.codigo));
                   let error = this.dataEquipo.status.mensaje;

                      this.loading.dismiss();
                      this.alertCtrl.create({
                        title: "Error!",
                        subTitle: ""+error,
                        buttons: [
                        {
                          text: 'Ok',
                          handler: data =>{}
                        }
                      ]
                    }).present();
                  }
                    //this.rutaProvider.catalogoEquipo(this.dataEquipo);
                  }else{
                  let listaEquipos:EquipoTO[] = [];
                  for(let to of this.dataEquipo.listaEquipos){

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
                        toPunto.valorUltimaLectura,
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
                  this.equiposAgregados++;
                  if(listaEquipos.length > 0){
                    this.lstEquipo++;
                    //console.log("listaEquipos.length: "+listaEquipos.length);
                    console.log("lstEquipo: "+JSON.stringify(this.lstEquipo));
                    console.log("equiposAgregados: "+JSON.stringify(this.equiposAgregados));
                    console.log("cargaCatalogo: "+JSON.stringify(this.cargaCatalogo));

                    this.equipoProvider.agrega_equipoToLista(to.idRuta, listaEquipos);

                    this.guardarIdRuta.push(to.idRuta);

                    if(this.cargaCatalogo == this.equiposAgregados){
                      console.log("IF EQUIPO");
                      this.cargaCatalogo = 0;
                      this.obtieneIniciaRuta();
                    }
                  }else{
                    for(var idxCargadas in this.equipoProvider.rutasCargadas){
                      if(this.equipoProvider.rutasCargadas[idxCargadas].idRuta == to.idRuta){
                        this.rutaSinEquipo += this.equipoProvider.rutasCargadas[idxCargadas].nombre+" - ";

                        this.cantidadEquipo++;

                        console.log("LENGTH: "+this.equipoProvider.rutasCargadas.length);
                        //this.guardarIdRuta.push(to.idRuta);
                      }
                    }
                    if(this.cargaCatalogo == this.equiposAgregados){
                      console.log("IF ELSE EQUIPO");
                      this.cargaCatalogo = 0;
                      this.obtieneIniciaRuta();
                    }
                  }

                    //console.log( "ENTRO REST EQUIPOS---"+id);
                 }


                },
      (err) => {

                  console.log('error '+ JSON.stringify(err));
                  this.cargaCatalogo = 0;
                  this.loading.dismiss();
                  this.alertCtrl.create({
                    title: "Error!",
                    subTitle: "No se puede conectar con el servidor, intente nuevamente",
                    buttons: [
                    {
                      text: 'Ok',
                      handler: data =>{}
                    }
                  ]
                }).present();
                }

    )
  }

  //else{

    //this.obtieneIniciaRuta(to.idRuta);
  //}

  }

  /*setTimeout(()=>{

  console.log("IF: "+cantidadEquipo);
    this.loading.dismiss();
    if(cantidadEquipo > 0){
      cantidadEquipo = 0;
      console.log("RUTAS SIN EQUIPOS "+rutaSinEquipo);
      this.alertCtrl.create({
        title: "Advertencia!",
        subTitle: "Hay "+ cantidadEquipo +" ruta(s) no se pueden cargar, debido a que no tienen equipos asignados: <strong>"+rutaSinEquipo.substring(0, (rutaSinEquipo.length - 2))+"</strong>",
        buttons: [
        {
          text: 'OK',
          handler: data =>{
            console.log("lstEquipo: "+lstEquipo);
            if(lstEquipo > 0){
              let listaModal = this.modalCtrl.create( "ModalIniciaRutaPage" );
              listaModal.present();
            }else{
              this.cerrarApp = true;
            }
          }
        }
      ]
      }).present();


    }else{
      let listaModal = this.modalCtrl.create( "ModalIniciaRutaPage" );
      listaModal.present();
    }


    //this.navCtrl.push("IniciaRutaPage", {'rutasCargadas':this.equipoProvider.rutasCargadas});

  }, 8000);*/


  console.log('TERMINO CATALOGO EQUIPO');

}






}
