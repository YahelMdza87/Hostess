//Que se cargue el carrito en cuanto se entre a carrito.html
document.addEventListener('DOMContentLoaded', function () {
    cargarCarrito();
});

function cargarCarrito(){
    //Peticion a server.js para mostrar buffCarrito
    fetch(`http://localhost:3000/carrito`)
    .then(response => response.json())
    .then(data => {
        //Obtenemos el JSON y lo mandamos a verCarrito (donde crearemos los divs, h3, etc. necesarios)
        verCarrito(data);
    })
    .catch(error => {
        console.error('Error al obtener los platillos', error);
    })
 }
//Para regresar al index al momento de picar a la X
function regresarIndex(){
    window.location.href="index.html";
}
//Método para ver los platillos mediante un JSON obtenido de una consulta
function verCarrito(platillos){
    //Accedemos a la section de html
    const section_platillos = document.getElementById('total_platillos');
    //Variable para checar el monto total del carrito
    let total = 0;
    //Eliminamos para que no se sobrescriba algo al hacer recargas
    section_platillos.innerHTML='';
    //Recorremos el JSON mediante "platillo"
    platillos.forEach(platillo => {
        console.log(platillo);
        const pedido = document.createElement('div');
        pedido.classList.add('platillo_pedido');
        
        const imagen = document.createElement('img');
        var img = platillo.imagen;
        imagen.src = "/imagenes/"+img;
        imagen.classList.add('imagen');
        const platillo_pedido = document.createElement('h3');
        platillo_pedido.textContent = platillo.Nombre;
        platillo_pedido.classList.add('nombre');

        const cantidad = document.createElement('h3');
        cantidad.textContent = platillo.Cantidad;
        let cantPlatillo = parseFloat(platillo.Cantidad);
        let precioPlatillo = parseFloat(platillo.Precio_producto);
        let totalPrecio=precioPlatillo*cantPlatillo;
        total += totalPrecio;
        cantidad.classList.add('cantidad');

        const precio = document.createElement('p');
        precio.textContent = "$"+(precioPlatillo*cantPlatillo);
        precio.classList.add('precio');
        
        console.log(total);
        const comentariosPlatillo = document.createElement('textarea');
        comentariosPlatillo.placeholder="Agregar comentarios..."
        comentariosPlatillo.textContent = platillo.Comentarios;
        comentariosPlatillo.classList.add('comentarios');

        const div_agregar_eliminar = document.createElement('div');
        div_agregar_eliminar.classList.add('botones_agregar_eliminar');
        const boton_Eliminar = document.createElement('img');
        if (platillo.Cantidad>1){
            boton_Eliminar.src="/imagenes/eliminarUno.png"
        }
        else {
            boton_Eliminar.src="/imagenes/eliminar.png"
        }
        boton_Eliminar.classList.add('btn_Eliminar');

        boton_Eliminar.addEventListener('click', function(){
            if (cantPlatillo>1){
                actualizarPlatillo(platillo.Id_carrito, platillo.Productos_Id_producto ,platillo.Cantidad-1, comentariosPlatillo.textContent);
            }
            else {
                eliminarPlatillo(platillo.Id_carrito);
            }
        })

        const boton_Agregar = document.createElement('img');
        boton_Agregar.src="/imagenes/agregar_cantidad.png"
        boton_Agregar.classList.add('btn_agregar_cantidad');

        boton_Agregar.addEventListener('click', function(){
            actualizarPlatillo(platillo.Id_carrito, platillo.Productos_Id_producto ,platillo.Cantidad+1, comentariosPlatillo.textContent);
        })

        div_agregar_eliminar.appendChild(boton_Eliminar);
        div_agregar_eliminar.appendChild(boton_Agregar);
        div_agregar_eliminar.appendChild(cantidad);
        pedido.appendChild(imagen);
        pedido.appendChild(platillo_pedido);
        pedido.appendChild(precio);
        pedido.appendChild(comentariosPlatillo);
        pedido.appendChild(div_agregar_eliminar);
        section_platillos.appendChild(pedido);

    });
    const venta_total = document.getElementById('cantidad_total');
    venta_total.innerHTML="";
    venta_total.innerHTML="$ "+total;
}

function actualizarPlatillo(id,idprod,cantidad_Nueva,comentarios){
    const datosCarrito = {
        Id_carrito: id,
        Productos_Id_producto: idprod,
        Cantidad: cantidad_Nueva,
        Comentarios: comentarios
    };
    console.log("_______",datosCarrito);
    fetch('http://localhost:3000/actualizarPlatillo' , {
        method: 'PUT',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(datosCarrito)
    })
    .then(response => response.json())
    .then(data => {
        // Después de eliminar, vuelve a cargar los platillos del carrito
        cargarCarrito();
    })
    .catch(error => {
        console.error('Error',error);
    })
}

function eliminarPlatillo(id){
    fetch(`http://localhost:3000/eliminarPlatillo/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        // Después de eliminar, vuelve a cargar los platillos del carrito
        cargarCarrito();
    })
    .catch(error => {
        console.error('Error al eliminar del carrito:', error);
    });
}
