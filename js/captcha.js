"use strict";

//captcha
let btn = document.querySelector("#btn-enviar");
btn.addEventListener("click", verificarFormulario);
let captcha = document.getElementById("texto-validar");

//VARIABLE PARA FUNCION RAMDOM
const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const dias = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
const mes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const anio = 2021;
const febrero = 2;
const agosto = 8;
const habitaciones = ["Suite Presidencial", "Habitacion Deluxe", "Habitación Simple"];
const numeroPaginacion = 5;

let cantidadPaginas;
const pagina = 1;

//BOTONES TABLA DINAMICA
let btnCargaAutomatica = document.querySelector("#carga-automatica");
btnCargaAutomatica.addEventListener("click", cargaAutomatica);

let btnLimpiarTabla = document.querySelector("#limpiar-tabla");
btnLimpiarTabla.addEventListener("click", limpiarTablaDinamica);

let btnFiltrar = document.querySelector("#filtrar");
btnFiltrar.addEventListener("click", filtrarDato);

let btnLimpiarFiltro = document.querySelector("#limpiar-filtro");
btnLimpiarFiltro.addEventListener("click", recargaTablaDinamica);


//CONTENEDOR TABLA DINAMICA
let tablaDinamica = document.querySelector("#tabla-dinamica");

//ARREGLO 
let usuarios = [];
let arregloFiltrado = [];

generarCaptcha();
//cargaAutomatica(); dejo de usar para implementar API REST 
const url = "https://60c8329aafc88600179f651e.mockapi.io/api/groups/064/TPE/reservas/nombres";

// variables para verificar que el formulario este completo
let inpNombre = document.getElementById("inp-nombre");
let inpNumero = document.getElementById("inp-numero");
let inpEmail = document.getElementById("inp-email");
let inpFecha = document.getElementById("inp-fecha");
let opcionHabitacion = document.getElementById("select-habitacion");
let inpFiltroHabitacion = document.getElementById("select-habitacion-filtro");
let inpFiltroText = document.getElementById("inp-text-filtro");

cargaServicioApi(1);

// Magali Garrido 8/11/2021 Task24 - Fix en verificarFormulario
function verificarFormulario() {
    
    let textoValidar = document.getElementById("texto-validar").innerHTML;
    let inpValidar = document.getElementById("validar");

    if (isFormuarioCompleto(inpEmail, inpNombre, inpNumero, inpFecha)) {
        ponerEnRojoCasillaIncompletas(inpEmail, inpNombre, inpNumero, inpFecha, inpValidar);
        if (isCaptchaCorrecto(textoValidar, inpValidar)) {
            btn.innerHTML = "FORMULARIO ENVIADO";

            agregarUser(); 

            ponerEnRojoCasillaIncompletas(inpEmail, inpNombre, inpNumero, inpFecha, inpValidar);
            // Al pasar las dos condiciones necesarias para enviar el formulario, cambiamos el contenido del button
        } else {
            generarCaptcha();
        }
    } else {
        ponerEnRojoCasillaIncompletas(inpEmail, inpNombre, inpNumero, inpFecha, inpValidar);
    }
}

function isCaptchaCorrecto(textoValidar, inpValidar) {
    //GarridoMatias 7/11/2021 - Task25 - Fix en isCaptchaCorrecto - Se agrego variable "validar"
    let validar= inpValidar.value;
    //se compara el valor tipeado con el valor establecido de captcha, en caso no coincidir, sobreescribimos el contenido del input y le agregamos la clase para indicar el error
    if (textoValidar == validar) {
        return true;
    } else {
        validar = "";
        inpValidar.classList.add("clase-error");
        generarCaptcha();
    }
    return false;
}

function isFormuarioCompleto(inpEmail, inpNombre, inpNumero, inpFecha) {
    //Si los input no estan vacios retornamos true, indicando que el formulario esta completo, no controlamos que valores contiene
    if ((inpNombre.value != "") && (inpNumero.value != "") && (inpEmail.value != "") && (inpFecha.value != "")) {
        return true;
    }
    return false;
}

function ponerEnRojoCasillaIncompletas(inpEmail, inpNombre, inpNumero, inpFecha, inpValidar) {
    //pregunta si los input obligatorios estan vacios, de ser asi, le agregamos al input la clase "clase-error" la cual cambiar el color del borde del input a rojo
    if (inpEmail.value == "") {
        inpEmail.classList.add("clase-error");
    } else if (inpEmail.classList.contains("clase-error")) {
        inpEmail.classList.remove("clase-error");
    }
    if (inpNombre.value == "") {
        inpNombre.classList.add("clase-error");
    } else if (inpNombre.classList.contains("clase-error")) {
        inpNombre.classList.remove("clase-error");
    }
    if (inpNumero.value == "") {
        inpNumero.classList.add("clase-error");
    } else if (inpNumero.classList.contains("clase-error")) {
        inpNumero.classList.remove("clase-error");
    }
    if (inpFecha.value == "") {
        inpFecha.classList.add("clase-error");
    } else if (inpFecha.classList.contains("clase-error")) {
        inpFecha.classList.remove("clase-error");
    }
    if (inpValidar.value == "") {
        inpValidar.classList.add("clase-error");
    } else if (inpValidar.classList.contains("clase-error")) {
        inpValidar.classList.remove("clase-error");
    }
}

function generarCaptcha() {
    let capcharesultante = "";
	//LucasMedico - 11/07/2021 - Task22 - Fix en generarCaptcha - Corrigo fix agregando la variable countMax
	let countMax = 6;
    for (let i = 0; i < countMax; i++) {
        capcharesultante += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    captcha.innerHTML = capcharesultante;
    document.getElementById("validar").value = capcharesultante;

}

//-----------------------------------------------------------------------------------------


// CREO OBJETO NUEVO CON EL VALOR DE LOS IMPUTS Y LLAMO A CARGARUSERNUEVO CON ESE OBJETO CREADO
function agregarUser() {
    console.log(document.getElementById("select-habitacion").value);
    let fecha = new Date(inpFecha.value + "T00:00:00");
    let usernuevo = {

        "nombre": inpNombre.value,
        "numero": inpNumero.value,
        "email": inpEmail.value,
        "fecha": fecha,
        "habitacion": opcionHabitacion.value
    };
    cargarUserNuevo(usernuevo);

}

//HAGO UN POST AL URL PARA CARGAR EL USUARIO NUEVO, SI ESTA OK LLAMO A CARGARSERVICIOAPI
async function cargarUserNuevo(usernuevo) {
    try {
        let res = await fetch(url, {
            "method": "POST",
            "headers": { "Content-Type": "application/json" },
            "body": JSON.stringify(usernuevo)
        });
        if (res.ok) {
            cargaServicioApi();

        } else {
            console.log(res);
        }
    } catch (errores) {
        console.log(errores);
    }
    // MODIFIQUE EL NOMBRE DE LA VARIABLE DEL CATCH TASK21
}

//Carga x 3 de un registro Ramdom
function cargaAutomatica() {
    for (let i = 0; i < 3; i++) {
        cargaRamdom();
    }
    cargaServicioApi(pagina);
}
async function cargaRamdom() {
    let habitacion = habitaciones[Math.floor((Math.random() * habitaciones.length))];

    let fecha = fechaRamdom();
    let usernuevo = {
        "habitacion": habitacion,
        "fecha": fecha
    };

    try {
        let res = await fetch(url, {
            "method": "POST",
            "headers": { "Content-Type": "application/json" },
            "body": JSON.stringify(usernuevo)
        });
        if (!res.ok) {
            console.log(res);
        }
    } catch (error) {
        console.log(error);
    }


}

function limpiarTablaDinamica() {

    let tablaDinamica = document.getElementById("tabla-dinamica");
    tablaDinamica.innerHTML = "";
    tablaDinamica.innerHTML = `<tr> <td>NOMBRE</td> <td>NUMERO</td> <td>EMAIL </td>  <td>FECHA </td></tr`;
    let i = 0;
    let k = usuarios.length;
    while (i < k) {
        usuarios.pop();
        i++;
    }
}

/*async function limpiarTablaDinamica() {

    let tablaDinamica = document.getElementById("tabla-dinamica");

    try {
        let res = await fetch(url);
        let json = await res.json();
        for (let elem of json) {
            let userID = elem.id;

            try {
                let res2 = await fetch(`${url}/${userID}`, {
                    "method": "DELETE"
                });
                if (res2.ok)
                    recargaTablaDinamica();

            } catch (error) {
                console.log(error);
            }
        }
    } catch (error) {
        console.log(error);
    }
}*/

async function cargaServicioApi(unNumero) {
    await getSizeApi();
    try {
        let res = await fetch(`${url}?p=${unNumero}&l=${numeroPaginacion}`);
        let json = await res.json();
        usuarios = [];

        for (const reserva of json) {

            let fechaFormat = new Date(reserva.fecha);

            let userRegistrado = {
                "nombre": `${reserva.nombre}`,
                "numero": `${reserva.numero}`,
                "email": `${reserva.email}`,
                "fecha": fechaFormat.toLocaleDateString(), //`${reserva.fecha}`
                "habitacion": `${reserva.habitacion}`,
                "ID": `${reserva.id}`
            };
            usuarios.push(userRegistrado);
        }

    } catch (error) {
        console.log(error);
    }
    actualizarTabla(unNumero);
}

function actualizarTabla(unNumero) {
    tablaDinamica.innerHTML = "";

    for (let f of usuarios) {
        tablaDinamica.innerHTML +=
            `<tr class="font-size" id="${f.ID}-user"> 

                <td class="td-nombre">${f.nombre} </td>
                <td>${f.numero} </td>
                <td>${f.email} </td>
                <td> ${f.fecha}</td>
                <td> ${f.habitacion}</td>
                <td class="td-button">
                    <button class="btn-eliminar" id="${f.ID}-eliminar">
                        <img src="img/eliminar.png" alt="icono-eliminar">
                    </button>
                </td>

                <td class="td-button">
                    <button class="btn-editar" id="${f.ID}-editar">
                        <img src="img/editar.png" alt="icono-editar">
                    </button>
                </td>    

            </tr>

            <tr id="${f.ID}-campo-editar">

            </tr>`;
    }
    tablaDinamica.innerHTML +=
        `<tr id="paginacion">
        </tr>`;
    if (cantidadPaginas != 0) {
        let tablaPaginacion = document.getElementById("paginacion");
        tablaPaginacion.innerHTML = "";
        for (let i = 1; i <= cantidadPaginas; i++) {

            tablaPaginacion.innerHTML +=
                `<td class="td-paginacion" id="${i}-pagina">
                    ${i}
                </td>`;
        }
    }

    cambiarColor(unNumero, "pagina");


    let btnPaginacion = document.querySelectorAll(".td-paginacion");
    btnPaginacion.forEach(b => b.addEventListener("click", function(e) {

        let idSeleccionado = b.getAttribute("id");
        let unNumero = idSeleccionado.split("-")[0];
        cargaServicioApi(unNumero);

    }));


    let btnEliminarFila = document.querySelectorAll(".btn-eliminar");
    btnEliminarFila.forEach(b => b.addEventListener("click", function(e) { //ESCUCHO EVENTO EN ICONO ELIMINAR
        eliminarFila(b.getAttribute("id"));
    }));

    let btnEditarFila = document.querySelectorAll(".btn-editar");
    btnEditarFila.forEach(b => b.addEventListener("click", function(e) { //ESCUCHO EVENTO EN ICONO EDITAR

        let idSeleccionado = b.getAttribute("id");
        idSeleccionado = idSeleccionado.split("-")[0];
        idSeleccionado = idSeleccionado + "-user";
        cambiarColor(idSeleccionado);
        let idEditar = b.getAttribute("id");
        idEditar = idEditar.split("-")[0];

        editarFila(idEditar);

    }));
}

function cambiarColor(unNumero, detalle) {
    let trUser;
    if (detalle != null) {
        trUser = document.getElementById(`${unNumero}-${detalle}`);
    } else {
        trUser = document.getElementById(`${unNumero}`);
    }
    trUser.classList.add("clase-fondo");
}

async function eliminarFila(e) {
    e = e.split("-")[0];

    try {
        let res = await fetch(`${url}/${e}`, {
            "method": "DELETE"
        });
        if (res.ok) {
            recargaTablaDinamica();
        }

    } catch (error) {
        console.log(error);
        console.log(e);
    }

}

async function editarFila(e) {
    let idUserAEditar = e;

    try {
        let traerUser = await fetch(`${url}/${e}`);
        let userAEditar = await traerUser.json();
        if (traerUser.ok) {

            let fechaFormat = new Date(userAEditar.fecha);

            let dia = ("0" + fechaFormat.getDate()).slice(-2);
            let mes = ("0" + (fechaFormat.getMonth() + 1)).slice(-2);
            let anio = fechaFormat.getFullYear();

            let idUser = e + "-campo-editar";
            let campoEditar = document.getElementById(`${idUser}`);

            campoEditar.innerHTML =
                `
                    <td><input class="font-size" id="${idUserAEditar}-editar-nombre" type="text" name="nombre" value="${userAEditar.nombre}"></td>
                    <td><input class="font-size" id="${idUserAEditar}-editar-numero" type="text" name="numero" value="${userAEditar.numero}"></td>
                    <td><input class="font-size" id="${idUserAEditar}-editar-email" type="text" name="email" value="${userAEditar.email}"></td>
                    <td><input class="font-size" id="${idUserAEditar}-editar-fecha" type="date" name="fecha" value="${anio}-${mes}-${dia}"></td>  
                    <td>
                        <select class="font-size" id="${idUserAEditar}-editar-habitacion" name="tipo-habitacion">

                        <option disabled selected>${userAEditar.habitacion}</option>
                            <option value="Suite Presidencial">Suite Presidencial</option>
                            <option value="Habitacion Deluxe">Habitacion Deluxe</option>
                            <option value="Habitación Doble">Habitación Doble</option>
                            <option value="Habitación Simple">Habitación Simple</option>
                        
                         </select>
                    </td>
                    <td >
                        <button class="btn" id="${userAEditar.id}-btn-editar" >
                                EDITAR
                        </button>
                    </td>
                   
                `;
            let idBtn = e + "-btn-editar";
            let btnConfirmarEdicion = document.getElementById(`${idBtn}`);
            btnConfirmarEdicion.addEventListener("click", async function(e) { //escucho btn de confirmacion de edicion

                let inpNombreDinamic = document.getElementById(`${idUserAEditar}-editar-nombre`);
                let inpNumeroDinamic = document.getElementById(`${idUserAEditar}-editar-numero`);
                let inpEmailDinamic = document.getElementById(`${idUserAEditar}-editar-email`);
                let inpFechaDinamic = document.getElementById(`${idUserAEditar}-editar-fecha`);
                let opcionHabitacionDinamic = document.getElementById(`${idUserAEditar}-editar-habitacion`);
                let fechaNueva = new Date(inpFechaDinamic.value + "T00:00:00");
                console.log(inpFechaDinamic.value);

                try {
                    let res = await fetch(`${url}/${idUserAEditar}`, {
                        "method": "PUT",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({
                            "nombre": inpNombreDinamic.value,
                            "numero": inpNumeroDinamic.value,
                            "email": inpEmailDinamic.value,
                            "fecha": fechaNueva,
                            "habitacion": opcionHabitacionDinamic.value
                        })
                    });
                    if (res.ok) {
                        recargaTablaDinamica();
                    }
                } catch (error) {
                    console.log(error);
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
}

function edicion(e) {
    e = e.split("-")[0];
    console.log(e);
}

//RETORNA FECHA ramdom
function fechaRamdom() {
    let mesR = Math.floor(Math.random() * mes.length) + 1;
    let diaR;

    if (mesR == febrero) {
        diaR = Math.floor(Math.random() * (dias.length - 3)) + 1;
    } else if (mesR < agosto) {
        if ((mesR % 2) == 0) { // numero de mes par dias menos de 31
            diaR = Math.floor(Math.random() * (dias.length - 1)) + 1;
        } else { //mes inpar 31 dias
            diaR = Math.floor(Math.random() * (dias.length)) + 1;
        }
    } else {
        if ((mesR % 2) == 0) {
            diaR = Math.floor(Math.random() * (dias.length)) + 1;
        } else { //mes inpar 31 dias
            diaR = Math.floor(Math.random() * (dias.length - 1)) + 1;
        }

    }
    if (mesR < 10) {
        let aux = "0" + mesR;
        mesR = aux;
    }
    if (diaR < 10) {
        let aux1 = "0" + diaR;
        diaR = aux1;

    }
    let fechaR = anio + "-" + mesR + "-" + diaR + "T00:00:00";

    return fechaR;
}

/*
1 enero 31
2 febrero 28
3 marzo 31
4 abril 30
5 mayo 31
6 junio 30
7 julio 31

8 agosto 31
9 sept 30
10 oct 31
11 nov 30
12 dic 31 */

function filtrarDato() {
    let arrAux = usuarios;
    let arregloFiltrado = [];

    for (let e of usuarios) {
        if ((inpFiltroHabitacion.value == e.habitacion) || (inpFiltroText.value.toLowerCase() == e.nombre.toLowerCase()) || (inpFiltroText.value == e.numero) || (inpFiltroText.value.toLowerCase() == e.fecha) || (inpFiltroText.value.toLowerCase() == e.email.toLowerCase())) {
            arregloFiltrado.push(e);
        }
    }
    usuarios = arregloFiltrado;
    actualizarTabla();

    usuarios = arrAux;
}

function recargaTablaDinamica() {
    cargaServicioApi(pagina);
    inpFiltroHabitacion.value = "";
    inpFiltroText.value = "";

}

async function getSizeApi() {
    try {

        let res = await fetch(url);
        let json = await res.json();
        let jsonSize = json.length;
        if ((jsonSize % numeroPaginacion) == 0) {
            cantidadPaginas = jsonSize / numeroPaginacion;
        } else {
            cantidadPaginas = Math.trunc(jsonSize / numeroPaginacion) + 1;
        }
    } catch (error) {
        console.log(error);
    }


}