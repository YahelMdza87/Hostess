
//DOMContentLoaded es para que se reciban lo que vamos a obtener cuando ya están cargados completamente
document.addEventListener('DOMContentLoaded', function () {
    //Hacemos una petición al servidor para que haga una consulta para ver si hay elementos en el carrito y mostrar la cantidad
    aumentarCarritoContador();
    fetchMenuPlatillos(1);
    //Lo mostramos en el footer
    //Obtenemos un array con todos los td (todas las categorias)
    const tdCategorias = document.querySelectorAll('#categorias_slider td');
    //Hacemos una funcion que obtenga la categoria (el td o la columna que se selecciono)
    tdCategorias.forEach(function(cell) {
        //ClickListener
        cell.addEventListener('click', function() {
            //Por si se cliqueo otro antes, resetea todos y se quedan con su estilo default
            resetEstiloCategorias(); 
            // Añade la clase 'selected' a la categoría cliqueada (En css esta declarada, pero ningún td la tiene)
            cell.classList.add('selected'); 
            //Obtenemos el id (En html puse id del 1 al 9 por la base de datos)
            const idCategoria = this.id; 
            console.log(idCategoria); 
            //Mandamos el id como parametro para fetchMenuPlatillos
            fetchMenuPlatillos(idCategoria); 
        });
    });
});
//Cuando presionemos el footer (el botón de carrito) se dirige aquí
function verCarrito() {
    var urlParams = new URLSearchParams(window.location.search);
    var numero_mesa = urlParams.get('mesa');
    window.location.href="carrito.html?mesa="+numero_mesa;
}
 //Por si se cliqueo otro antes, resetea todos y se quedan con su estilo default
function resetEstiloCategorias() {
    const tdCategorias = document.querySelectorAll('#categorias_slider td');
    tdCategorias.forEach(function(cell) {
        cell.classList.remove('selected');
    });
}
let contador = 0;
//Función para obtener todos los platillos de una categoria mediante una petición
function fetchMenuPlatillos(id_categoria) {
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
                    //Hacemos un JSON desde aquí con el ID del producto y los demas por predeterminado
                    const datosCarrito = {
                        Productos_Id_producto: item.Id_producto,
                        Comentarios: '', 
                        Cantidad: 1
                    };
                    //Agregamos el platillo con el método agregarPlatilloCarrito
                    agregarPlatilloCarrito(datosCarrito);
                    console.log(item.Id_producto);
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

function agregarPlatilloCarrito(datosPlatillo){
    fetch('http://localhost:3000/agregarPlatilloCarrito', {
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
        //Llamamos el método para aumentar el contador del carrito
        aumentarCarritoContador();
    })
    .catch(error => {
        console.error('Error al insertar en el carrito:', error);
    });
}

function aumentarCarritoContador(){
    //Obtenemos todos los datos que hay en la tabla buffCarrito
    fetch('http://192.168.1.75:3000/carrito')
                    .then(response => response.json())
                    .then(data => {
                        //Obtenemos la cantidad máxima que hay
                        contador=data.length;
                        //Lo mostramos
                        document.getElementById('footer_txt').innerHTML="Ver carrito ("+contador+")";
                    });
}



let posicion_Actual = -30;
const Slider = document.getElementById('categorias_slider');
const cantidad_Movimiento = 105; 

document.getElementById('desplazar_Izquierda').addEventListener('click', function() {
    desplazarCategorias('izquierda');
});

document.getElementById('desplazar_Derecha').addEventListener('click', function() {
    desplazarCategorias('derecha');
});

function desplazarCategorias(direccion) {
    if (direccion === 'izquierda') {
        posicion_Actual = Math.max(posicion_Actual - cantidad_Movimiento,-30);
    } else {
        posicion_Actual = Math.min(posicion_Actual + cantidad_Movimiento, 360);
    }

    console.log('Nueva posicion:', posicion_Actual);
    console.log(Slider.scrollWidth);
    console.log(Slider.clientWidth);
    console.log(direccion);
    
    Slider.style.transform = `translateX(${-posicion_Actual}px)`;
}
