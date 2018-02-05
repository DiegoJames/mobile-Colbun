export class UsuarioTO{


  username:string;
  password:string;
  /*codigoUsuario:string;
  credencialesValidas:string;
  idComplejo:string;
  idUsuario:string;
  tieneAcceso:string;*/

  constructor(
                username:string,
                password:string,
                /*codigoUsuario:string,
                credencialesValidas:string,
                idComplejo:string,
                idUsuario:string,
                tieneAcceso:string*/
              ){
                  this.username = username;
                  this.password = password;
                  /*this.codigoUsuario = codigoUsuario;
                  this.credencialesValidas = credencialesValidas;
                  this.idComplejo = idComplejo;
                  this.idUsuario = idUsuario;
                  this.tieneAcceso = tieneAcceso;*/
                }

}
