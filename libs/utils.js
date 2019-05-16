const dns = require('dns'); //forma parte del core de nodejs


const utils = {
  /*
  Valida que la url sea del tipo: http/https://subdominio.dominio.com/ruta/subruta.
  Y además trata de resolver el dominio para ver si existe
  */
  urlValid: (url)=>{
    let p = new Promise((resolve,reject)=>{
      let regex = /https?:\/\/([a-zA-Z0-9-.]*[a-z]{2,6})[a-zA-Z0-9_\-.\/?=&%+]*/;
      if(regex.test(url)){
        let url_no_protocol = url.match(regex)[1];
        dns.lookup(url_no_protocol, (err, address) => {
          if(err!=null){
            reject(err);
          }
          else
            resolve(url);
        });
      }
    });
    return p;
  }
  
  
  
  
};

module.exports = utils;