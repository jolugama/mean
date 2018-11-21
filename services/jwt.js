const jwt = require ('jwt-simple');
const moment = require ('moment');
const secret = 'esto_es_una_clave_secreta';

exports.createToken = (user)=> {
    let payload= {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30,'days').unix
    };
    return jwt.encode(payload,secret);
}