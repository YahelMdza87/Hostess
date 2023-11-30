//Declaramos que necesitamos estas librerias
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const axios = require('axios');
const path = require('path');
const cors = require("cors");

const app = express();
const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };
  
app.use(cors(corsOptions));  
app.options('*', cors(corsOptions));  // Configura CORS para las solicitudes OPTIONS
app.options('*', cors()); 


//Hacemos la conexión a la bd y guardamos en conecction
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydb'
});
//Nos conectamos
connection.connect();




//Le dejamos en claro a Node.Js que pueda leer archivos estaticos html desde la ruta '', la deje vacía ya que como ya esta abierta la carpeta Hostess desde
//VSC, y ahí tengo todos mis archivos, ya que los lea de ahí
app.use(express.static(path.join('')));



// Le mandamos el archivo index.html, ya que es nuestro mainpage y de ahí partimos
app.get('/', (req, res) => {
    console.log('____');
    res.sendFile(path.join(__dirname, 'index.html'));
});



// Ruta para obtener productos por categoría que recibimos de scriptInedx.js 
app.get('/platillos/:id', (req, res) => {
    //Obtenemos el id recibido desde scriptInedx.js
    const id_categoria = req.params.id;
    //Hacemos el query para seleccionar los registros de la base de datos con el id
    const mostrarPlatillos = `SELECT * FROM productos WHERE Categorias_Id_categoria = ?`;
    //Ejecutamos la petición
    connection.query(mostrarPlatillos, [id_categoria], (error, results, fields) => {
        if (error) throw error;
        //Guardamos los resultados en formato JSON y se lo mandamos scriptInedx.js
        res.json(results);
    });
});

app.get('/carrito', (req, res) => {
    //Hacemos el query para seleccionar los registros de buffCarrito
    const mostrarPlatillos = `SELECT bcarr.Id_carrito, bcarr.Productos_Id_producto, prod.Nombre, prod.Precio_producto, prod.imagen, bcarr.Cantidad, bcarr.Comentarios from productos prod
    INNER JOIN buffcarrito bcarr ON bcarr.Productos_Id_producto = prod.Id_producto`;
    //Ejecutamos la petición
    connection.query(mostrarPlatillos, (error, results, fields) => {
        if (error) throw error;
        //Guardamos los resultados en formato JSON y se lo mandamos scriptInedx.js
        res.json(results);
    });
});

app.get('/carritoOriginal', (req, res) => {
    //Hacemos el query para seleccionar los registros de buffCarrito
    const mostrarPlatillos = `SELECT * from buffCarrito`;
    //Ejecutamos la petición
    connection.query(mostrarPlatillos, (error, results, fields) => {
        if (error) throw error;
        //Guardamos los resultados en formato JSON y se lo mandamos scriptInedx.js
        res.json(results);
    });
});


//Eliminar un platillo del carrito
app.delete('/eliminarPlatillo/:idPlatillo', (req, res) => {
    const id_platillo = req.params.idPlatillo;

    // Se elimina el platillo que queremos eliminar 
    connection.query('DELETE FROM buffCarrito WHERE Id_carrito = ?', [id_platillo], (error, results, fields) => {
        if (error) {
            console.error('Error al eliminar del carrito:', error);
            res.status(500).send('Error interno del servidor');
            return;
        }

        // Enviar una respuesta con los resultados (puedes personalizar según tus necesidades)
        res.json({ mensaje: 'Eliminado del carrito exitosamente', resultados: results });
    });
});

app.delete('/eliminarPlatillos', (req, res) => {

    // Se elimina el platillo que queremos eliminar 
    connection.query('DELETE FROM buffCarrito', (error, results, fields) => {
        if (error) {
            console.error('Error al eliminar del carrito:', error);
            res.status(500).send('Error interno del servidor');
            return;
        }

        // Enviar una respuesta con los resultados (puedes personalizar según tus necesidades)
        res.json({ mensaje: 'Eliminado del carrito exitosamente', resultados: results });
    });
});

//Eliminar un platillo de la mesa
app.delete('/eliminarPlatilloMesa/:idPlatillo', (req, res) => {
    const id_platillo = req.params.idPlatillo;

    // Se elimina el platillo que queremos eliminar 
    connection.query('DELETE FROM buffmesa WHERE id_bitacoraMesa = ?', [id_platillo], (error, results, fields) => {
        if (error) {
            console.error('Error al eliminar del carrito:', error);
            res.status(500).send('Error interno del servidor');
            return;
        }

        // Enviar una respuesta con los resultados (puedes personalizar según tus necesidades)
        res.json({ mensaje: 'Eliminado del carrito exitosamente', resultados: results });
    });
});


//Recibimos los valores y los convertimos
app.use(bodyParser.json());
//Ruta para agregar platillos al carrito
app.post('/agregarPlatilloCarrito', (req, res) => {
    //Recibimos el JSON
    const datosCarrito = req.body;
    const agregarCarrito = `INSERT INTO buffCarrito SET ?`;
    connection.query(agregarCarrito, datosCarrito, (error, results, fields) => {
        if (error) {
            console.error('Error al insertar en el carrito:', error);
            res.status(500).send('Error interno del servidor');
            return;
        }

        // Enviar una respuesta con los resultados
        res.json({ mensaje: 'Insertado en el carrito exitosamente', datosCarrito });
    });
});

app.post('/agregarPlatilloMesa', (req, res) => {
    //Recibimos el JSON
    const datosCarrito = req.body;
    const agregarCarrito = `INSERT INTO buffmesa SET ?`;
    connection.query(agregarCarrito, datosCarrito, (error, results, fields) => {
        if (error) {
            console.error('Error al insertar en el carrito:', error);
            res.status(500).send('Error interno del servidor');
            return;
        }

        // Enviar una respuesta con los resultados
        res.json({ mensaje: 'Insertado en el carrito exitosamente', datosCarrito });
    });
});

//Actualizar Carrito (eliminar o agregar comentarios)
app.put('/actualizarPlatillo', (req, res) => {
    const datosCarrito = req.body;

    // Realizar la actualización en la base de datos
    connection.query('UPDATE buffCarrito SET Cantidad = ? WHERE Id_carrito = ?', [datosCarrito.Cantidad, datosCarrito.Id_carrito], (error, results, fields) => {
        if (error) {
            console.error('Error al actualizar la cantidad en el carrito:', error);
            res.status(500).send('Error interno del servidor');
            return;
        }
        res.json({ mensaje: 'Cantidad actualizada en el carrito exitosamente', resultados: results });
    });
});

//Esta api la agarre de una pagina y lo que hace es regresar un grafico SVG para crear un QR

// Ruta para manejar la solicitud de generación de QR
app.post('/generar_qr/:numeroMesa', async (req, res) => {
    const mesa = req.params.numeroMesa;
    try {
        // Datos del cuerpo de la solicitud
        const requestData = {
            frame_name: "no-frame",
            qr_code_text: "http://192.168.1.75:3000/index.html?mesa="+mesa,
            image_format: "SVG",
            qr_code_logo: "scan-me-square"
        };

        // URL de la API de generación de códigos QR
        const apiUrl = 'https://api.qr-code-generator.com/v1/create?access-token=UymVEAMSmGvLKPyfoNqE0saIYrpRWFftMmhe0j4CRiMlG7u1mVemoVH3n9yrtXkT';

        // Realizar la solicitud a la API
        const response = await axios.post(apiUrl, requestData);

        // Enviar la respuesta de la API al cliente
        res.send(response.data);
    } catch (error) {
        console.error('Error al generar el código QR:', error.message);
        res.status(500).send('Error interno del servidor');
    }
});


app.get('/ver_mesas/:area', (req, res) => {
    const area = req.params.area;

    const mostrarMesas = `SELECT * FROM mydb.mesas WHERE Areas_Id_area = ?`;

    connection.query(mostrarMesas,[area], (error,results,fields) => {
        if (error) throw error;
        res.json(results);
    });

});

app.get('/ver_comanda/:mesa', (req, res) => {
    const mesa = req.params.mesa;
    //Hacemos el query para seleccionar los registros de buffCarrito
    const mostrarPlatillos = `SELECT bcarr.id_bitacoraMesa, bcarr.Productos_Id_producto, prod.Nombre, prod.Precio_producto, bcarr.Mesas_Id_mesas from productos prod 
    INNER JOIN buffmesa bcarr ON bcarr.Productos_Id_producto = prod.Id_producto WHERE bcarr.Mesas_Id_Mesas = ?`;
    //Ejecutamos la petición
    connection.query(mostrarPlatillos, [mesa],(error, results, fields) => {
        if (error) throw error;
        //Guardamos los resultados en formato JSON y se lo mandamos scriptInedx.js
        res.json(results);
    });
});


const PORT = 3000;
app.listen(PORT, '0.0.0.0',() => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});