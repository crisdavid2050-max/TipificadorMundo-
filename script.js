function mostrarTab(id, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
}

function obtenerDatos() {
  return JSON.parse(localStorage.getItem("observacionesPorSesion")) || observacionesPorSesion;
}

/* Sub-sesiones */
function cargarSubSesiones() {
  const s = document.getElementById("subSesion");
  s.innerHTML = "";
  Object.keys(obtenerDatos()).forEach(k => s.innerHTML += `<option value="${k}">${k}</option>`);
  cargarObservaciones();
}

function cargarObservaciones() {
  const o = document.getElementById("observacion");
  o.innerHTML = "";
  (obtenerDatos()[subSesion.value] || []).forEach(v => o.innerHTML += `<option value="${v}">${v}</option>`);
}

/* Configuración */
function cargarConfig() {
  const c = document.getElementById("configSesion");
  c.innerHTML = "";
  Object.keys(obtenerDatos()).forEach(k => c.innerHTML += `<option value="${k}">${k}</option>`);
  cargarEditor();
}

function cargarEditor() {
  editorObservaciones.value = (obtenerDatos()[configSesion.value] || []).join("\n");
}

function guardarObservaciones() {
  const d = obtenerDatos();
  d[configSesion.value] = editorObservaciones.value.split("\n").map(x => x.trim()).filter(x => x);
  localStorage.setItem("observacionesPorSesion", JSON.stringify(d));
  cargarObservaciones();
  alert("Observaciones guardadas");
}

/* COPIAR — ORDEN FIJO */
function copiarTodo() {
  const texto = `
Fecha: ${fecha.value}
Rut: ${rut.value}
Nombre: ${nombre.value}
Id llamada: ${idLlamada.value}
Número: ${numero.value}
ONT: ${ont.value}
OLT: ${olt.value}
DIRECCIÓN: ${direccion.value}
OBSERVACIÓN DE SOPORTE:
${observacion.value}
`.trim();

  navigator.clipboard.writeText(texto).then(() => {
    guardarHistorial(texto);
    alert("Información copiada");
  });
}

/* Historial */
function guardarHistorial(t) {
  const h = JSON.parse(localStorage.getItem("historial")) || [];
  h.unshift(t);
  localStorage.setItem("historial", JSON.stringify(h));
  cargarHistorial();
}

function cargarHistorial() {
  historialLista.innerHTML = "";
  (JSON.parse(localStorage.getItem("historial")) || []).forEach(t => {
    const d = document.createElement("div");
    d.className = "historial-item";
    d.innerHTML = `<span>${t.split("\n")[0]}</span><button onclick="navigator.clipboard.writeText(\`${t}\`)">📋</button>`;
    historialLista.appendChild(d);
  });
}

/* Sondeo */
function enviarSondeo() {
  window.open("https://docs.google.com/forms/d/e/1FAIpQLScOnqtEkPZTISXN4o3vrsi_vjMF3GcPuBlb0dIqJOuZVmeklQ/viewform", "_blank");
}

/* Init */
cargarSubSesiones();
cargarConfig();
cargarHistorial();
  
