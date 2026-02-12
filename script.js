const URL_SONDEO = "https://docs.google.com/forms/d/e/1FAIpQLScOnqtEkPZTISXN4o3vrsi_vjMF3GcPuBlb0dIqJOuZVmeklQ/viewform";
const URL_PERSISTE = "https://docs.google.com/forms/d/e/1FAIpQLScBARUWj5MxH9pp9ax1QWFa-2voO9cx75yEE0q3qq_ZiD593Q/viewform";

/* ================= TABS ================= */
function mostrarTab(id, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
}

/* ================= DATOS ================= */
function obtenerDatos() {
  return JSON.parse(localStorage.getItem("observacionesPorSesion")) || observacionesPorSesion;
}

function guardarDatos(data) {
  localStorage.setItem("observacionesPorSesion", JSON.stringify(data));
}

/* ================= SUBSESIONES ================= */
function cargarSubSesiones() {
  const select = document.getElementById("subSesion");
  select.innerHTML = "";
  Object.keys(obtenerDatos()).forEach(s => {
    select.innerHTML += `<option value="${s}">${s}</option>`;
  });
  cargarObservaciones();
}

/* ================= OBSERVACIONES TIPIFICACIÓN ================= */
function cargarObservaciones() {
  const sesion = subSesion.value;
  const cont = document.getElementById("contenedorObservaciones");
  const preview = document.getElementById("previewObservacion");

  cont.innerHTML = "";
  preview.innerHTML = "";

  if (sesion === "Manual") {
    cont.innerHTML = `<textarea id="observacionManual"></textarea>`;
    return;
  }

  const lista = obtenerDatos()[sesion] || [];

  if (lista.length === 0) {
    cont.innerHTML = "<p>No hay observaciones.</p>";
    return;
  }

  const select = document.createElement("select");
  select.id = "observacionSelect";

  lista.forEach(o => {
    select.innerHTML += `<option value="${o}">${o}</option>`;
  });

  select.onchange = () => preview.innerText = select.value;

  cont.appendChild(select);
  preview.innerText = select.value;
}

/* ================= CONFIGURACIÓN ================= */
function cargarConfig() {
  const select = document.getElementById("configSesion");
  select.innerHTML = "";
  Object.keys(obtenerDatos()).forEach(s => {
    if (s !== "Manual") {
      select.innerHTML += `<option value="${s}">${s}</option>`;
    }
  });
  mostrarTarjetas();
}

function mostrarTarjetas() {
  const sesion = configSesion.value;
  const cont = document.getElementById("tarjetasObservaciones");
  cont.innerHTML = "";
  const lista = obtenerDatos()[sesion] || [];

  lista.forEach((obs, index) => {
    cont.innerHTML += `
    <div class="tarjeta">
      <textarea onchange="editarObservacion(${index},this.value)">${obs}</textarea>
      <button onclick="eliminarObservacion(${index})">🗑</button>
    </div>`;
  });
}

function agregarObservacion() {
  const sesion = configSesion.value;
  const input = document.getElementById("nuevaObservacion");
  if (!input.value) return;

  const data = obtenerDatos();
  data[sesion].push(input.value);
  guardarDatos(data);

  input.value = "";
  mostrarTarjetas();
}

function editarObservacion(index, valor) {
  const sesion = configSesion.value;
  const data = obtenerDatos();
  data[sesion][index] = valor;
  guardarDatos(data);
}

function eliminarObservacion(index) {
  const sesion = configSesion.value;
  const data = obtenerDatos();
  data[sesion].splice(index, 1);
  guardarDatos(data);
  mostrarTarjetas();
}

/* ================= COPIAR ================= */
function copiarTodo() {
  const sesion = subSesion.value;
  let obs = "";

  if (sesion === "Manual") {
    obs = document.getElementById("observacionManual")?.value || "";
  } else {
    obs = document.getElementById("observacionSelect")?.value || "";
  }

  const texto = `
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

/* ================= LIMPIAR ================= */
function limpiarFormulario() {
  document.querySelectorAll("#tipificacion input, #tipificacion textarea").forEach(i => i.value = "");
  cargarObservaciones();
}

/* ================= HISTORIAL ================= */
function guardarHistorial(t) {
  const h = JSON.parse(localStorage.getItem("historial")) || [];
  h.unshift(t);
  localStorage.setItem("historial", JSON.stringify(h));
  cargarHistorial();
}

function cargarHistorial() {
  const lista = document.getElementById("historialLista");
  const filtro = document.getElementById("filtroRut")?.value.toLowerCase() || "";
  lista.innerHTML = "";

  (JSON.parse(localStorage.getItem("historial")) || []).forEach(t => {
    if (!t.toLowerCase().includes(filtro)) return;
    lista.innerHTML += `<div class="historial-item"><pre>${t}</pre></div>`;
  });
}

/* ================= LINKS ================= */
function cargarLinks() {
  const cont = document.getElementById("linksLista");
  cont.innerHTML = "";
  linksImportantes.forEach(l => {
    cont.innerHTML += `<div class="link-item"><a href="${l.url}" target="_blank">${l.nombre}</a></div>`;
  });
}

/* ================= MODALES ================= */
function abrirModalInteligente() {
  if (subSesion.value === "Persiste") {
    modalPersiste.style.display = "flex";
  } else {
    modalSondeo.style.display = "flex";
  }
}

function cerrarModal(id) {
  document.getElementById(id).style.display = "none";
}

/* ================= SONDEO ================= */
function enviarSondeo() {
  const url = new URL(URL_SONDEO);
  url.searchParams.append("entry.955460218", rut.value);
  url.searchParams.append("entry.216870845", numero.value);
  url.searchParams.append("entry.575117188", direccion.value);
  url.searchParams.append("entry.977079435", ont.value);
  url.searchParams.append("entry.789181094", olt.value);
  url.searchParams.append("entry.415672825", tarjeta.value);
  url.searchParams.append("entry.44152504", puerto.value);
  url.searchParams.append("entry.137275158", nodo.value);

  window.open(url.toString(), "_blank");
  cerrarModal("modalSondeo");
}

/* ================= PERSISTE ================= */
function enviarPersiste() {
  const sesion = subSesion.value;

  let obs = "";
  if (sesion === "Manual") {
    obs = document.getElementById("observacionManual")?.value || "";
  } else {
    obs = document.getElementById("observacionSelect")?.value || "";
  }

  const bloqueCompleto = `
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

  const url = new URL(URL_PERSISTE);

  url.searchParams.append("entry.737091952", rut.value);
  url.searchParams.append("entry.1279701728", cedulaEjecutivo.value);
  url.searchParams.append("entry.1796537453", idLlamada.value);
  url.searchParams.append("entry.971510061", ont.value);
  url.searchParams.append("entry.2068363297", olt.value);
  url.searchParams.append("entry.1623308877", bloqueCompleto);

  window.open(url.toString(), "_blank");
  cerrarModal("modalPersiste");
}

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {
  cargarSubSesiones();
  cargarConfig();
  cargarHistorial();
  cargarLinks();
});
