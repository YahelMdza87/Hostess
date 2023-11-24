window.onload = function(){
    mostrarMesas(21);
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
        let contador = 0;
        mesas.forEach(mesa => {
        contador++;
        const contenedor = document.createElement('div');
        contenedor.classList.add('mesa_con_numero');

        contenedor.addEventListener('click', function(){
            window.location.href = "menuMesa.html?mesa=" + encodeURIComponent(mesa.Id_mesas);
        });

        const imagenMesa = document.createElement('img');
        imagenMesa.src = "/imagenes/Mesa_D.png"
        imagenMesa.classList.add('mesa_menu_mesero');

        const numero = document.createElement('h3');
        numero.classList.add('numero_mesa');
        numero.textContent = "Mesa "+ mesa.Numero;

        contenedor.appendChild(imagenMesa);
        contenedor.appendChild(numero);
        contenedorMesas.appendChild(contenedor);
        contenedorMesas.c

    });
    })
    .catch(error =>{
        console.log('Error en :', error);
    });
}