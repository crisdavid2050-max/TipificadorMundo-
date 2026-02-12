const URL_SONDEO="https://docs.google.com/forms/d/e/1FAIpQLScOnqtEkPZTISXN4o3vrsi_vjMF3GcPuBlb0dIqJOuZVmeklQ/viewform";
const URL_PERSISTE="https://docs.google.com/forms/d/e/1FAIpQLScBARUWj5MxH9pp9ax1QWFa-2voO9cx75yEE0q3qq_ZiD593Q/viewform";

/* TABS */
function mostrarTab(id,btn){
document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
document.getElementById(id).classList.add('active');
btn.classList.add('active');
}

/* SUBSESIONES */
function cargarSubSesiones(){
const select=document.getElementById("subSesion");
select.innerHTML="";
Object.keys(observacionesPorSesion).forEach(s=>{
select.innerHTML+=`<option>${s}</option>`;
});
cargarObservaciones();
}

function cargarObservaciones(){
const sesion=subSesion.value;
const cont=document.getElementById("contenedorObservaciones");
const preview=document.getElementById("previewObservacion");
cont.innerHTML="";
preview.innerHTML="";

if(sesion==="Manual"){
cont.innerHTML=`<textarea id="observacionManual"></textarea>`;
return;
}

const lista=JSON.parse(localStorage.getItem("obs"))||observacionesPorSesion;

(lista[sesion]||[]).forEach(o=>{
const opt=document.createElement("option");
opt.value=o;
opt.textContent=o;
cont.appendChild(opt);
});

preview.innerText=cont.value;
}

/* COPIAR */
function copiarTodo(){
const obs=subSesion.value==="Manual"?
document.getElementById("observacionManual")?.value:
contenedorObservaciones.value;

const texto=`
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

navigator.clipboard.writeText(texto);
guardarHistorial(texto);
}

/* LIMPIAR */
function limpiarFormulario(){
document.querySelectorAll("#tipificacion input, #tipificacion textarea").forEach(i=>i.value="");
}

/* HISTORIAL */
function guardarHistorial(t){
const h=JSON.parse(localStorage.getItem("historial"))||[];
h.unshift(t);
localStorage.setItem("historial",JSON.stringify(h));
cargarHistorial();
}

function cargarHistorial(){
const lista=document.getElementById("historialLista");
const filtro=filtroRut.value?.toLowerCase()||"";
lista.innerHTML="";
(JSON.parse(localStorage.getItem("historial"))||[]).forEach(t=>{
if(!t.toLowerCase().includes(filtro))return;
lista.innerHTML+=`<div class="historial-item"><pre>${t}</pre></div>`;
});
}

/* LINKS */
function cargarLinks(){
const cont=document.getElementById("linksLista");
cont.innerHTML="";
linksImportantes.forEach(l=>{
cont.innerHTML+=`<div class="link-item"><a href="${l.url}" target="_blank">${l.nombre}</a></div>`;
});
}

/* MODAL */
function abrirModal(){modal.style.display="flex";}
function cerrarModal(){modal.style.display="none";}

function enviarFormulario(){
const sesion=subSesion.value;
const base=sesion==="Persiste"?URL_PERSISTE:URL_SONDEO;
const url=new URL(base);

url.searchParams.append("entry.955460218",rut.value);
url.searchParams.append("entry.216870845",numero.value);
url.searchParams.append("entry.575117188",direccion.value);
url.searchParams.append("entry.977079435",ont.value);
url.searchParams.append("entry.789181094",olt.value);
url.searchParams.append("entry.415672825",tarjeta.value);
url.searchParams.append("entry.44152504",puerto.value);
url.searchParams.append("entry.137275158",nodo.value);

window.open(url.toString(),"_blank");
cerrarModal();
}

document.addEventListener("DOMContentLoaded",()=>{
cargarSubSesiones();
cargarHistorial();
cargarLinks();
});
