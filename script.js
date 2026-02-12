/* ================= PESTAÑAS ================= */
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

/* ================= SUB-SESIONES ================= */
function cargarSubSesiones() {
  const select = document.getElementById("subSesion");
  if (!select) return;

  select.innerHTML = "";
  Object.keys(obtenerDatos()).forEach(s => {
    const opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s;
    select.appendChild(opt);
  });

  cargarObservaciones();
}

/* ================= OBSERVACIONES ================= */
function cargarObservaciones() {
  const sesion = document.getElementById("subSesion").value;
  const cont = document.getElementById("contenedorObservaciones");
  const preview = document.getElementById("previewObservacion");

  cont.innerHTML = "";
  preview.innerHTML = "";

  if (sesion === "Manual") {
    cont.innerHTML = `<textarea id="observacionManual" rows="4"
      placeholder="Escriba la observación manual aquí"></textarea>`;
    return;
  }

  const lista = obtenerDatos()[sesion] || [];

  if (lista.length === 0) {
    cont.innerHTML = "<p>No hay observaciones registradas.</p>";
    return;
  }

  const select = document.createElement("select");
  select.id = "observacionSelect";

  lista.forEach(o => {
    const opt = document.createElement("option");
    opt.value = o;
    opt.textContent = o;
    select.appendChild(opt);
  });

  select.onchange = function () {
    preview.innerText = this.value;
  };

  cont.appendChild(select);
  preview.innerText = select.value;
}

/* ================= COPIAR ================= */
function copiarTodo() {
  const sesion = document.getElementById("subSesion").value;
  let observacionFinal = "";

  if (sesion === "Manual") {
    observacionFinal = document.getElementById("observacionManual")?.value || "";
  } else {
    observacionFinal = document.getElementById("observacionSelect")?.value || "";
  }

  const texto = `
Fecha: ${fecha.value}
Rut: ${rut.value}
Nombre: ${nombre.value}
Id llamada: ${idLlamada.value}
Número: ${numero.value}
ONT: ${ont.value}
OLT: ${olt.value}
Tarjeta: ${tarjeta.value}
Puerto: ${puerto.value}
DIRECCIÓN: ${direccion.value}
OBSERVACIÓN DE SOPORTE:
${observacionFinal}
`.trim();

  navigator.clipboard.writeText(texto);
  guardarHistorial(texto);
}

/* ================= LIMPIAR ================= */
function limpiarFormulario() {
  document.querySelectorAll("#tipificacion input, #tipificacion textarea").forEach(i => i.value = "");
  document.getElementById("subSesion").selectedIndex = 0;
  cargarObservaciones();
  document.getElementById("previewObservacion").innerHTML = "";
}

/* ================= HISTORIAL COMPLETO ================= */
function guardarHistorial(texto) {
  const h = JSON.parse(localStorage.getItem("historial")) || [];
  h.unshift(texto);
  localStorage.setItem("historial", JSON.stringify(h));
  cargarHistorial();
}

function cargarHistorial() {
  const lista = document.getElementById("historialLista");
  const filtro = document.getElementById("filtroRut")?.value.toLowerCase() || "";
  lista.innerHTML = "";

  (JSON.parse(localStorage.getItem("historial")) || []).forEach(t => {

    if (!t.toLowerCase().includes(filtro)) return;

    const div = document.createElement("div");
    div.className = "historial-item";

    div.innerHTML = `
      <pre>${t}</pre>
      <button onclick="navigator.clipboard.writeText(\`${t}\`)">📋 Copiar</button>
    `;

    lista.appendChild(div);
  });
}

/* ================= LINKS ================= */
function cargarLinks() {
  const cont = document.getElementById("linksLista");
  cont.innerHTML = "";

  linksImportantes.forEach(l => {
    cont.innerHTML += `
      <div class="link-item">
        <a href="${l.url}" target="_blank">${l.nombre}</a>
      </div>
    `;
  });
}

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", function () {
  cargarSubSesiones();
  cargarHistorial();
  cargarLinks();
});
