# Crear un proyecto MEAN

**MongoDB, ExpressJs, Angular y Node**

A través de un ejemplo sencillo crea un API RESTful con NodeJs

<!-- TOC -->

- [Crear un proyecto MEAN](#crear-un-proyecto-mean)
    - [1. Prerequisitos](#1-prerequisitos)
    - [2. Configurando MongoDB](#2-configurando-mongodb)
    - [3. Creando la base de datos](#3-creando-la-base-de-datos)
    - [4. Conexión con la base de datos](#4-conexión-con-la-base-de-datos)
    - [5. Creando servidor web (Express)](#5-creando-servidor-web-express)
    - [6. Creando modelo de datos](#6-creando-modelo-de-datos)
    - [7. Controllers](#7-controllers)
    - [8. Routes](#8-routes)
    - [9. Autenticación por token](#9-autenticación-por-token)
        - [9.1. Servicio JWT (creación token)](#91-servicio-jwt-creación-token)
        - [9.2. Middleware](#92-middleware)
        - [9.3 Modificado de controlador y enrutador](#93-modificado-de-controlador-y-enrutador)
        - [9.4 Prueba en Postman](#94-prueba-en-postman)
    - [10. Subir archivos por POST](#10-subir-archivos-por-post)
        - [10.1. Middleware connect-multiparty. Crea archivos temporales](#101-middleware-connect-multiparty-crea-archivos-temporales)
        - [10.2 Función carga imagen](#102-función-carga-imagen)
    - [11. Cargar archivo guardado en el servidor](#11-cargar-archivo-guardado-en-el-servidor)
    - [12. Paginar resultados en búsquedas](#12-paginar-resultados-en-búsquedas)
    - [13. Frontend SPA Angular](#13-frontend-spa-angular)

<!-- /TOC -->

## 1. Prerequisitos

Lo primero de todo es tener instalado node y mongoDB. Estos detalles no se verán en este tutorial.

Crea el proyecto

```bash
$ mkdir mean
$ cd mean
$ npm init
```

Con el último comando se crea el package.json.


**Paquetes necesarios:**

```bash
npm install express bcrypt-nodejs body-parser connect-multiparty  mongoose-unique-validator jwt-simple moment mongoose mongoose-pagination --save
```

```bash
npm install nodemon --save-dev
```

Para más detalle, una breve explicación de cada uno:
- express: framework para hacer api rest.
- bcrypt-nodejs: librería para encriptar contraseñas
- body-parser: parsea las peticiones que nos lleguen (post) y convertirlos a json.
- connect-multiparty: libería que nos permite subir ficheros con node a través de http, y se guarde en el servidor.
- jwt-simple: para la identificación con tokens.
- moment: libería para controlar las fechas
- mongoose: Imprescindible para trabajar con un proyecto MongoDB dentro de un proyecto de node.
- mongoose-pagination: para hacer paginación
- mongoose-unique-validator: Util en los modelos, para tener propiedades únicas.


- nodemon: herramienta para el desarrollo, cada vez que haces un cambio en nuestro API rest, nos recargará el servidor.

## 2. Configurando MongoDB

```bash
$ sudo nano /etc/mongod.conf
```

En el archivo de configuración, se indica donde se aloja la BBDD, el puerto, almacenamiento de logs, etc.


## 3. Creando la base de datos

Primero de todo ejecuta el domonio (si no está ejecutado):

```bash
$ mongodb
```

Una vez ejecutado, en la consola de mongo:

```bash
$ mongo
```

A partir de ahora, estás dentro de mongo y puedes usar todos sus comandos.

```bash
> use mean
> db.artists.save({name:'nombre', description: 'una descripcion', image: 'null'});
> db.artists.find()
> show dbs()
```

Creay usa la base de datos mean, guarda un objeto en artists, busca y muestra todas las bases de datos que hay.



## 4. Conexión con la base de datos

Crea el archivo index.js

**index.js**

```javascript
'use strict'

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
  };

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mean', options,
    (err, res) => {
        if (err) {
            throw err;
        } else {
            console.log('Conectada con la bbdd...');

        }
    });
```

`En package.js` añade el script start

```javascript
"scripts": {
    "start": "nodemon index.js",
    ...
  },
```

Ejecuta el script

```bash
npm start
```

Verás como salida:

```bash
[nodemon] 1.18.6
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node index.js`
(node:2840) DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } toMongoClient.connect.
La conexión con la bbdd es ok...
```


## 5. Creando servidor web (Express)

Crea el archivo para declarar express y ejecutarlo. 

**app.js**

```javascript
'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// cargar rutas

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


// configurar cabeceras http

// rutas base

module.exports = app;
```


Añade en index.ts

```javascript
const mongoose = require('mongoose');
...
const app = require('./app');
const port = process.env.PORT || 5555; 

...

        console.log('Conectada con la bbdd...');
        ...
        app.listen(port, ()=>{
            console.log(`Servidor del api rest música escuchando en http://localhost:${port}`);
        })

```

Si se accede desde un navegador: `http://localhost:5555/` se podrá ver `Cannot GET /`. Eso quiere decir que el servidor está funcionando pero no tiene esa ruta indicada.

Añade la primera ruta en app.js

```javascript
// rutas base
...
app.get('/test', (req, res)=>{
    res.status(200).send ({message: 'Bienvenido al rest test'})
});
``` 

De nuevo prueba en el navegador: `http://localhost:5555/test`. Ahora aparece un json con un mensaje de bienvenida.




## 6. Creando modelo de datos

Se crea una nueva carpeta llamada `models`, y en él incorpora un modelo por archivo.

Se crea los modelos necesarios. En nuestro caso son 4, album.js, artist.js, song.js, user.js

Un modelo ejemplo es:

**models/album.js**

```javascript
'use strict'
 
const mongoose = require ('mongoose');
const schema = mongoose.Schema;

const albumSchema = schema({
    title: String,
    description: String,
    year: Number,
    image: String,
    artist: { type: schema.ObjectId, ref: 'Artist'}
})

module.exports = mongoose.model('Album',albumSchema)
```
 

## 7. Controllers

 Según el MVC, con el fin de separar el código, se crea carpeta `controllers`.

 **controllers/user.js**

 ```javascript
'use strict'
 
const bcrypt = require('bcrypt-nodejs');
var User=require('../models/user');
var jwt = require ('../services/jwt');

function pruebas(req, res){
    res.status(200).send({
        message: "Probando una accion del controlador de usuarios del api rest con node y mongo"
    })
}

function saveUser(req,res) {
    let user = new User();
    let params= req.body;
    console.log(params);
    
    user.name=params.name;
    user.surname=params.surname;
    user.email=params.email;
    user.role='ROLE_USER';
    user.image='null';

    if(params.password){
        // encriptar contraseña y guardar datos
        bcrypt.hash(params.password,null,null,(err,hash)=>{
            user.password = hash;
            if(user.name !==null && user.surname !==null && user.email!==null
                && user.name.length>3 && user.surname.length>3 && user.email.length>5 ){
                // guardar el usuario
                user.save((err,userStored)=>{
                    if(err){
                        res.status(500).send({message:'Error al guardar el usuario'});
                    }else {
                        if(!userStored){
                            res.status(404).send({message:'No se ha registrado el usuario'});
                        }else{
                            res.status(200).send({user:userStored});
                        }
                    }
                })
            }else{
                res.status(200).send({message: 'Rellena todos los datos'});
            }
        });
    }else {
        res.status(500).send({message: 'Introduce la contraseña'});
    }
}

function loginUser(req, res) {
    const params = req.body;
    const email = params.email;
    const password = params.password;
    User.findOne({
            email: email.toLowerCase()
        },
        (err, user) => {
            if(err){
                res.status(500).send({ message: 'Error en la petición'});
            } else {
                if(!user){
                    res.status(404).send({message:'El usuario no existe'});
                }else {
                    // comprobar la contraseña
                    bcrypt.compare(password, user.password, (err, check)=>{
                        if(check){
                            // devolver los datos del usuario logueado
                            if(params.gethash){
                                // devolver un token de jwt
                                res.status(200).send({
                                    token: jwt.createToken(user)
                                });
                            }else{
                                res.status(200).send({user})
                            }
                        }else {
                            res.status(404).send({message:'El usuario no ha podido loguearse', err});
                        }
                    })
                }
            }

        });
}

module.exports = {
    pruebas,
    saveUser,
    loginUser
}
 ```

## 8. Routes

En dicha carpeta aloja todas las rutas que puedes ver luego desde `Postman`.

En él se usa el enturador de express:
`express.Router();`

**routes/user.js**

```javascript
'use strict'

const express = require('express');
const userController = require('../controllers/user');
const api = express.Router();
const middlewareAuth = require('../middleware/authenticated');

api.get('/probando-controlador', userController.pruebas);
api.get('/probando-middleware', middlewareAuth.ensureAuth, userController.pruebas);
api.post('/register', userController.saveUser);
api.post('/login', userController.loginUser);

module.exports = api;
```

## 9. Autenticación por token

Para ello usa la librería JWT.

### 9.1. Servicio JWT (creación token)

Mediante este servicio, crea un token con toda la información del usuario en forma de objeto

Codifica con una contraseña con la constante `secret`.

Este servicio se usa en el controlador user cuando se loguea con la ruta `login`;

**services/jwt.js**

```javascript
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
```


### 9.2. Middleware

Con ello decodifica el token, verifica su caducidad, y comprueba si el token es válido o inválido.

 **middleware/authenticated.js**

 ```javascript
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
 ```

### 9.3 Modificado de controlador y enrutador

En el controlador user, en la función que usa el enrutador `/login`  se añade estas lineas para crear el token con el usuario dado.

```javascript
...
 res.status(200).send({
    token: jwt.createToken(user)
});
...
```

En las rutas añade nueva ruta con el middleware en el segundo parámetro.

```javascript
const middlewareAuth = require('../middleware/authenticated');
...

api.get('/probando-middleware', middlewareAuth.ensureAuth, userController.pruebas);
...
```

### 9.4 Prueba en Postman

Añade un servicio de tipo `POST` con url `http://localhost:5555/api/login`, en body, en x-www-form-urlencoded, añade las key name, surname, email, password, gethash (indicar true) y rellénalo.

Prueba un servicio de tipo `GET`, con la url `http://localhost:5555/api/probando-middleware`. 
En headers, añade en la key 'Authorization' con value el token que recibes de login.


## 10. Subir archivos por POST 

En dos sencillos pasos. 

### 10.1. Middleware connect-multiparty. Crea archivos temporales

Este middleware crea archivos temporales en su servidor, aunque en nuestro caso son persistentes.

Tan sencillo como cargar `connect-multiparty` y añadirlo como un middleware a la ruta.
Si hay más de un middleware este debe ir entre `[ ]`

El primer middleware es el control de token.

**routes/user.js**

```javascript
...
const multipart = require('connect-multiparty');
const middlewareUpload = multipart({uploadDir: './uploads/users'});
...
api.post('/upload-image-user/:id', [middlewareAuth.ensureAuth, middlewareUpload], userController.uploadImage);
```

### 10.2 Función carga imagen 

Añade al controlador, y éste en la ruta.

```javascript
function uploadImage(req, res) {
    const userId = req.params.id;
    let fileName = 'No subido...';

    if (req.files) {
        const filePath = req.files.image.path;
        const fileSPlit = filePath.split('.');
        console.log(fileSPlit);
        
        const fileExt = fileSPlit[1]; 
        fileName=fileSPlit.join('.');

        if (fileExt === 'png' || fileExt === 'jpg' || fileExt === 'gif'){
            User.findByIdAndUpdate(userId, {image:fileName}, (err, userUpdated)=>{
                if(!userUpdated){
                    res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                }else {
                    res.status(200).send({user: userUpdated});
                }
            })
        }else{
            res.status(200).send({message:'Extensión del archivo no válida'});
        }

            console.log(fileName);
    } else {
        res.status(200).send({
            message: 'No has subido ninguna imagen...'
        });
    }
}
```


## 11. Cargar archivo guardado en el servidor

En este caso es una imagen que se haya guardado previamente en el servicio anterior.

En el controlador añade estas constantes al inicio:

```javascript
const fs = require('fs');
const path = require('path');
```

y esta función corta que se añade en la ruta.

```javascript
...
function getImageFile(req, res) {
    let imageFile = req.params.imageFile;
    const pathFile = `./uploads/users/${imageFile}`;
    fs.exists(pathFile, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(pathFile));
        } else {
            res.status(200).send({message: 'No existe la imagen...'});
        }
    })
}
...
```


y finalmente se lo inclúyelo en la ruta.

```javascript
...
api.get('/get-image-user/:imageFile', userController.getImageFile);
...
```

## 12. Paginar resultados en búsquedas

Esta vez se deja User, y se continua con Artists, el cual lleva un model, un controlador y un enrutador.

**models/artist.js**

```typescript
...
function getArtists(req, res) {
    let page;
    const perPage=5;
    if (req.params.page) {
        page = req.params.page;
    } else {
        page = 0;
    }


    Artist.find({}, 'name description image')
        .skip(Number(page) * perPage)
        .limit(perPage)
        .exec(
            (err, artists) => {
                if (err) {
                    res.status(500).send({
                        message: 'Error de Artistas' + err
                    })
                }

                Artist.count({}, (err, cont) => {
                    res.status(200).send({
                        currentPage: page,
                        artists,
                        total: cont
                    })
                })
            }
        )
}
...
```



```typescript
'use strict'

const express = require('express');
const artistController = require('../controllers/artist');
const api = express.Router();
const middlewareAuth = require('../middleware/authenticated');

api.get('/artist/:id', middlewareAuth.ensureAuth, artistController.getArtist);
api.post('/artist', middlewareAuth.ensureAuth, artistController.saveArtist);
api.get('/artists/:page?', middlewareAuth.ensureAuth , artistController.getArtists2);

module.exports = api;
```

De esta forma, si no añadimos página, ésta nos devolverá la primera (0).


## 13. Frontend SPA Angular

Dentro de un proyecto de Angular, en la carpeta services nos creamos un archivo para poder usar todos los servicios de mongo con un prefijo.

**src/app/services/global.ts**

```typescript
export var GLOBAL = {
    base: 'htpp://localhost:5555/api',
    ip: '127.0.0.1'
}
```

Desde los servicios se carga el fichero.

Lo demás es igual en cualquier proyecto Angular. ;)