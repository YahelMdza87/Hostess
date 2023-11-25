window.onload = function(){
    mostrarMesas(1);
    const sidebar = document.querySelector(".sidebar");
    const closeBtn = document.querySelector("#btn");
    

    closeBtn.addEventListener("click", function(){
        sidebar.classList.toggle("open")
        menuBtnChange()
    })

    function menuBtnChange(){
        if (sidebar.classList.contains("open")){
            closeBtn.classList.replace("bx-menu","bx-menu-alt-right")
        }else{
            closeBtn.classList.replace("bx-menu-alt-right", "bx-menu")

        }
    }
}
function mostrarMesas(area){
    const contenedorMesas = document.getElementById('contenedor_mesas');
    contenedorMesas.innerHTML='';
    fetch(`http://localhost:3000/ver_mesas/${area}`)
    .then(response => response.json())
    .then(mesas => {
        console.log(mesas);
        
        mesas.forEach(mesa => {
        const contenedor = document.createElement('div');
        contenedor.classList.add('mesa_con_numero');

        contenedor.addEventListener('click', function(){
            window.location.href = "menuMesa.html?mesa=" + encodeURIComponent(mesa.Id_mesas);
        });
        const imagenMesa = document.createElement('img');
        
        // Maneja la Promesa aquí
        checarEstado(mesa.Id_mesas)
                    .then(estado => {
                        console.log(estado)
                        if (estado == 0) {
                            imagenMesa.src = "/imagenes/Mesa_D.png"
                        } else {
                            imagenMesa.src = "/imagenes/Mesa_O.png"
                        }

                        imagenMesa.classList.add('mesa_menu_mesero');

                        const numero = document.createElement('h3');
                        numero.classList.add('numero_mesa');
                        numero.textContent = "Mesa " + mesa.Numero;

                        contenedor.appendChild(imagenMesa);
                        contenedor.appendChild(numero);
                        contenedorMesas.appendChild(contenedor);
                    })
                    .catch(error => {
                        console.error('Error en checarEstado:', error);
                        // Puedes manejar el error aquí si es necesario
                    });
            });
        })
        .catch(error => {
            console.log('Error en :', error);
        });
}

function checarEstado(numMesa) {
    return fetch(`http://localhost:3000/ver_comanda/${numMesa}`)
        .then(response => response.json())
        .then(orden => {
            var estado = orden.length;
            return estado;
        })
        .catch(error => {
            console.log(error);
        });
}