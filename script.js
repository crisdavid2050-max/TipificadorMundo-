const URL_SONDEO="https://docs.google.com/forms/d/e/1FAIpQLScOnqtEkPZTISXN4o3vrsi_vjMF3GcPuBlb0dIqJOuZVmeklQ/viewform";
const URL_PERSISTE="https://docs.google.com/forms/d/e/1FAIpQLScBARUWj5MxH9pp9ax1QWFa-2voO9cx75yEE0q3qq_ZiD593Q/viewform";

/* DARK MODE */
function toggleDarkMode(){
document.body.classList.toggle("dark");
}

/* TABS */
function mostrarTab(id,btn){
document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
document.getElementById(id).classList.add('active');
btn.classList.add('active');
}

/* DATOS */
function obtenerDatos(){
return JSON.parse(localStorage.getItem("observacionesPorSesion"))||observacionesPorSesion;
}
function guardarDatos(data){
localStorage.setItem("observacionesPorSesion",JSON.stringify(data));
}

/* SUBSESIONES */
function cargarSubSesiones(){
const select=subSesion;
select.innerHTML="";
Object.keys(obtenerDatos()).forEach(s=>{
select.innerHTML+=`<option value="${s}">${s}</option>`;
});
cargarObservaciones();
}

/* OBSERVACIONES */
function cargarObservaciones(){
const sesion=subSesion.value;
const cont=contenedorObservaciones;
const preview=previewObservacion;
cont.innerHTML="";
preview.innerHTML="";

if(sesion==="Manual"){
cont.innerHTML=`<textarea id="observacionManual"></textarea>`;
return;
}

const lista=obtenerDatos()[sesion]||[];
if(lista.length===0){cont.innerHTML="<p>No hay observaciones.</p>";return;}

const select=document.createElement("select");
select.id="observacionSelect";
lista.forEach(o=>select.innerHTML+=`<option value="${o}">${o}</option>`);
select.onchange=()=>preview.innerText=select.value;
cont.appendChild(select);
preview.innerText=select.value;
}

/* CONFIGURACIÓN */
function cargarConfig(){
configSesion.innerHTML="";
Object.keys(obtenerDatos()).forEach(s=>{
if(s!=="Manual")configSesion.innerHTML+=`<option value="${s}">${s}</option>`;
});
mostrarTarjetas();
}

function mostrarTarjetas(){
const sesion=configSesion.value;
const cont=tarjetasObservaciones;
cont.innerHTML="";
(obtenerDatos()[sesion]||[]).forEach((obs,index)=>{
cont.innerHTML+=`
<div class="tarjeta">
<textarea onchange="editarObservacion(${index},this.value)">${obs}</textarea>
<button onclick="eliminarObservacion(${index})">🗑</button>
</div>`;
});
}

function agregarObservacion(){
if(!nuevaObservacion.value)return;
const data=obtenerDatos();
data[configSesion.value].push(nuevaObservacion.value);
guardarDatos(data);
nuevaObservacion.value="";
mostrarTarjetas();
}

function editarObservacion(i,val){
const data=obtenerDatos();
data[configSesion.value][i]=val;
guardarDatos(data);
}

function eliminarObservacion(i){
const data=obtenerDatos();
data[configSesion.value].splice(i,1);
guardarDatos(data);
mostrarTarjetas();
}

/* COPIAR */
function copiarTodo(){
let obs=subSesion.value==="Manual"?
document.getElementById("observacionManual")?.value||"":
document.getElementById("observacionSelect")?.value||"";

const bloque=`
Rut: ${rut.value}
Nombre: ${nombre.value}
Id llamada: ${idLlamada.value}
Número: ${numero.value}
ONT: ${ont.value}
OLT: ${olt.value}
Tarjeta: ${tarjeta.value}
Puerto: ${puerto.value}
Nodo: ${nodo.value}
Dirección: ${direccion.value}
Observación: ${obs}
`.trim();

navigator.clipboard.writeText(bloque);
guardarHistorial(bloque);
}

/* VALIDACIÓN */
function abrirModalInteligente(){
if(!rut.value||!ont.value||!olt.value){
alert("Rut, ONT y OLT son obligatorios.");
return;
}
subSesion.value==="Persiste"?
modalPersiste.style.display="flex":
modalSondeo.style.display="flex";
}

function cerrarModal(id){
document.getElementById(id).style.display="none";
}

/* SONDEO BLOQUE COMPLETO */
function enviarSondeo(){
let obs=subSesion.value==="Manual"?
document.getElementById("observacionManual")?.value||"":
document.getElementById("observacionSelect")?.value||"";

const bloque=`
Rut: ${rut.value}
Nombre: ${nombre.value}
Id llamada: ${idLlamada.value}
Número: ${numero.value}
ONT: ${ont.value}
OLT: ${olt.value}
Tarjeta: ${tarjeta.value}
Puerto: ${puerto.value}
Nodo: ${nodo.value}
Dirección: ${direccion.value}
Observación: ${obs}
`.trim();

const url=new URL(URL_SONDEO);
url.searchParams.append("entry.1163287562",bloque);
window.open(url.toString(),"_blank");
cerrarModal("modalSondeo");
}

/* PERSISTE BLOQUE COMPLETO */
function enviarPersiste(){
let obs=subSesion.value==="Manual"?
document.getElementById("observacionManual")?.value||"":
document.getElementById("observacionSelect")?.value||"";

const bloque=`
Rut: ${rut.value}
Nombre: ${nombre.value}
Id llamada: ${idLlamada.value}
Número: ${numero.value}
ONT: ${ont.value}
OLT: ${olt.value}
Tarjeta: ${tarjeta.value}
Puerto: ${puerto.value}
Nodo: ${nodo.value}
Dirección: ${direccion.value}
Observación: ${obs}
`.trim();

const url=new URL(URL_PERSISTE);
url.searchParams.append("entry.1623308877",bloque);
window.open(url.toString(),"_blank");
cerrarModal("modalPersiste");
}

/* HISTORIAL */
function guardarHistorial(t){
const h=JSON.parse(localStorage.getItem("historial"))||[];
h.unshift(t);
localStorage.setItem("historial",JSON.stringify(h));
cargarHistorial();
}
function cargarHistorial(){
historialLista.innerHTML="";
const filtro=filtroRut.value?.toLowerCase()||"";
(JSON.parse(localStorage.getItem("historial"))||[])
.forEach(t=>{
if(!t.toLowerCase().includes(filtro))return;
historialLista.innerHTML+=`<div class="historial-item"><pre>${t}</pre></div>`;
});
}

/* LINKS */
function cargarLinks(){
linksLista.innerHTML="";
linksImportantes.forEach(l=>{
linksLista.innerHTML+=`<div class="link-item"><a href="${l.url}" target="_blank">${l.nombre}</a></div>`;
});
}

/* INIT */
document.addEventListener("DOMContentLoaded",()=>{
cargarSubSesiones();
cargarConfig();
cargarHistorial();
cargarLinks();
});
