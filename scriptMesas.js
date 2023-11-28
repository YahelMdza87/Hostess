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
    fetch(`http://192.168.1.75:3000/ver_mesas/${area}`)
    .then(response => response.json())
    .then(mesas => {
        console.log(mesas);
        
        mesas.forEach(mesa => {
        const contenedor = document.createElement('div');
        contenedor.classList.add('mesa_con_numero');

        
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
                        imagenMesa.addEventListener('click', function(){
                            window.location.href = "menuMesa.html?mesa=" + encodeURIComponent(mesa.Id_mesas);
                        });
                        
                        const numero = document.createElement('h3');
                        numero.classList.add('numero_mesa');
                        numero.textContent = "Mesa " + mesa.Numero;

                        const botonQR = document.createElement('h3');
                        botonQR.innerHTML = "Generar QR";
                        botonQR.classList.add('btnQr');
                        botonQR.addEventListener('click', function(){
                            generarQr(mesa.Id_mesas);
                        });

                        contenedor.appendChild(imagenMesa);
                        contenedor.appendChild(numero);
                        contenedor.appendChild(botonQR);
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
    return fetch(`http://192.168.1.75:3000/ver_comanda/${numMesa}`)
        .then(response => response.json())
        .then(orden => {
            var estado = orden.length;
            return estado;
        })
        .catch(error => {
            console.log(error);
        });
}

function generarQr(mesa){
    const requestData = {
        qr_code_text: "https://www.qr-code-generator.com/"
        // Otros datos que puedas necesitar enviar
    };

    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    };
    fetch(`http://192.168.1.75:3000/generar_qr/${mesa}`, fetchOptions)
        .then(response => response.text())
        .then(data => {
            document.getElementById('qr').innerHTML=data;
            console.log(data);
        })
        .catch(error => {
            console.error(error)
        })

    // window.location.href = "mesas.html";
}