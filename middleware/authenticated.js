const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'esto_es_una_clave_secreta';

exports.ensureAuth = (req, res, next) => {
    if(!req.headers.authorization){
        return res.status(403).send({message: 'La peticion no tiene la cabecera de autenticación'});
    }
    let token = req.headers.authorization.replace(/['"]+/g,'');
    try {
        let payload = jwt.decode(token, secret);
        if(payload.exp <= moment().unix()){
            return res.status(401).send({message: 'Token ha expirado'});
        }
        req.user = payload;
    } catch (error) {
        console.log(error);
        return res.status(404).send({message: 'Token no válido'});
    }
    
    next();
}