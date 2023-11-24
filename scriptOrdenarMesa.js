document.addEventListener('DOMContentLoaded', function () {
    // Obtén la URL actual
    var urlParams = new URLSearchParams(window.location.search);
    var numero_mesa;
    // Verifica si el parámetro 'valor' está presente en la URL
    if (urlParams.has('mesa')) {
        // Obtiene el valor del parámetro 'valor'
            numero_mesa = urlParams.get('mesa');

        // Haz lo que necesites con el valor
        console.log("Valor recibido:", numero_mesa);
        mostrarPlatillos(1);
        mostrarOrden(numero_mesa);
    }
});

function mostrarOrden(mesa){
    const section_comanda = document.getElementById('comanda_mesa');
    section_comanda.innerHTML='';
    fetch(`http://localhost:3000/ver_comanda/${mesa}`)
    .then(response => response.json())
    .then(orden => {
        orden.forEach(platillo => {
            console.log(platillo);
            const pedido = document.createElement('div');
            pedido.classList.add('platillo_pedido');
            
          
            const platillo_pedido = document.createElement('h3');
            platillo_pedido.textContent = platillo.Nombre;
            platillo_pedido.classList.add('nombre');
    

            const precio = document.createElement('p');
            precio.textContent = "$"+(platillo.Precio_producto);
            precio.classList.add('precio');
    
            pedido.appendChild(platillo_pedido);
            pedido.appendChild(precio);
            section_comanda.appendChild(pedido);
    
        });

    })
    .catch(error =>{
        console.log(error);
    })
}

//Función para obtener todos los platillos de una categoria mediante una petición
function mostrarPlatillos(id_categoria) {
    fetch(`http://localhost:3000/platillos/${id_categoria}`) //Se hace la peticion a server.js
        .then(response => response.json()) //Una vez hecha la peticon, declaramos que recibiremos los datos en formato json
        .then(data => { //Nuestro JSON será data que contiene todos los platillos que hay en la categoría dicha
            console.log(id_categoria);
            console.log('Platillos:', data);
           
            // Limpia el contenido actual del contenedor de menú (lo obtenemos desde index.html)
            const section_menu = document.getElementById('menu');
            section_menu.innerHTML = '';

             // Recorre los elementos de data para obtener el nombre, descripcion, etc.
             data.forEach(item => {
                const platillo = document.createElement('div');
                platillo.classList.add('platillo_menu');

                // Crea elementos HTML para mostrar los detalles del producto (Nombre, Descripción, Precio, etc.)
                const nombre_Platillo = document.createElement('h3');
                nombre_Platillo.textContent = item.Nombre;

                const descripcion_Platillo = document.createElement('p');
                descripcion_Platillo.textContent = item.Descripcion;
                descripcion_Platillo.classList.add('descripcion');

                const precio_Platillo = document.createElement('p');
                precio_Platillo.textContent = `$${item.Precio_producto}`;
                precio_Platillo.classList.add('precio');

                const imagen_Platillo = document.createElement('img');
                var img = item.imagen;
                imagen_Platillo.src = "/imagenes/"+img;
                imagen_Platillo.classList.add('imagen')

                const botonImg_Agregar = document.createElement('img');
                botonImg_Agregar.src = '/imagenes/agregar_cantidad.png';
                botonImg_Agregar.classList.add('btnAgregarCarrito');
                botonImg_Agregar.addEventListener('click', function() {
                    var urlParams = new URLSearchParams(window.location.search);
                    var numero_mesa;
                    numero_mesa = urlParams.get('mesa');
                    //Hacemos un JSON desde aquí con el ID del producto y los demas por predeterminado
                    const datosCarrito = {
                        Productos_Id_producto: item.Id_producto,
                        Mesas_Id_mesas: numero_mesa
                    };
                    //Agregamos el platillo con el método agregarPlatilloMesa
                    agregarPlatilloMesa(datosCarrito);
                    console.log(item.Id_producto);
                    console.log(numero_mesa);
                });

                // Agrega los elementos al contenedor del menú
                platillo.appendChild(nombre_Platillo);
                platillo.appendChild(descripcion_Platillo);
                platillo.appendChild(precio_Platillo);
                platillo.appendChild(imagen_Platillo);
                platillo.appendChild(botonImg_Agregar);
                section_menu.appendChild(platillo);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function agregarPlatilloMesa(datosPlatillo){
    fetch('http://localhost:3000/agregarPlatilloMesa', {
        //Realizamos una petición al servidor POST, recibirá un valor y en este caso JSON
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        //Transformamos de valor JavaScript a JSON (JavaScript Object Notation)
        body: JSON.stringify(datosPlatillo)
    })
    .then(response => response.json())
    .then(data => {//En caso de hacerse todo correctamente, entra por aqu
        console.log('Insertado en el carrito:', data);
    })
    .catch(error => {
        console.error('Error al insertar en el carrito:', error);
    });
}