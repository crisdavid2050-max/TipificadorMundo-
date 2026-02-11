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

  const data = obtenerDatos();

  Object.keys(data).forEach(s => {
    const option = document.createElement("option");
    option.value = s;
    option.textContent = s;
    select.appendChild(option);
  });

  cargarObservaciones();
}

/* ================= CARGAR OBSERVACIONES ================= */
function cargarObservaciones() {
  const sesion = document.getElementById("subSesion").value;
  const cont = document.getElementById("contenedorObservaciones");
  const preview = document.getElementById("previewObservacion");

  cont.innerHTML = "";
  preview.innerHTML = "";

  if (sesion === "Manual") {
    cont.innerHTML = `
      <textarea id="observacionManual" rows="4"
        placeholder="Escriba la observación manual aquí"></textarea>
    `;
    return;
  }

  const data = obtenerDatos();
  const lista = data[sesion] || [];

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
    preview.innerHTML = this.value;
  };

  cont.appendChild(select);
  preview.innerHTML = select.value;
}

/* ================= COPIAR ================= */
function copiarTodo() {
  const sesion = document.getElementById("subSesion").value;
  let observacionFinal = "";

  if (sesion === "Manual") {
    const manual = document.getElementById("observacionManual");
    observacionFinal = manual ? manual.value : "";
  } else {
    const select = document.getElementById("observacionSelect");
    observacionFinal = select ? select.value : "";
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

/* ================= CONFIGURACIÓN ================= */
function cargarConfig() {
  const select = document.getElementById("configSesion");
  if (!select) return;

  select.innerHTML = "";

  const data = obtenerDatos();

  Object.keys(data).forEach(s => {
    if (s !== "Manual") {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      select.appendChild(opt);
    }
  });

  mostrarTarjetas();
}

function mostrarTarjetas() {
  const sesion = document.getElementById("configSesion").value;
  const cont = document.getElementById("tarjetasObservaciones");
  cont.innerHTML = "";

  const data = obtenerDatos();
  const lista = data[sesion] || [];

  lista.forEach((obs, index) => {
    const div = document.createElement("div");
    div.className = "tarjeta";

    div.innerHTML = `
      <textarea onchange="editarObservacion(${index}, this.value)">${obs}</textarea>
      <button onclick="eliminarObservacion(${index})">🗑</button>
    `;

    cont.appendChild(div);
  });
}

function agregarObservacion() {
  const sesion = document.getElementById("configSesion").value;
  const input = document.getElementById("nuevaObservacion");

  if (!input.value) return;

  const data = obtenerDatos();
  data[sesion].push(input.value);

  guardarDatos(data);

  input.value = "";
  mostrarTarjetas();
}

function editarObservacion(index, valor) {
  const sesion = document.getElementById("configSesion").value;
  const data = obtenerDatos();

  data[sesion][index] = valor;
  guardarDatos(data);
}

function eliminarObservacion(index) {
  const sesion = document.getElementById("configSesion").value;
  const data = obtenerDatos();

  data[sesion].splice(index, 1);
  guardarDatos(data);

  mostrarTarjetas();
}

/* ================= HISTORIAL ================= */
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
      <span>${t.split("\n")[1]}</span>
      <button onclick="navigator.clipboard.writeText(\`${t}\`)">📋</button>
    `;

    lista.appendChild(div);
  });
}

/* ================= LINKS ================= */
function cargarLinks() {
  const cont = document.getElementById("linksLista");
  if (!cont) return;

  cont.innerHTML = "";

  linksImportantes.forEach(l => {
    cont.innerHTML += `
      <div class="link-item">
        <a href="${l.url}" target="_blank">${l.nombre}</a>
        <div class="url-text">${l.url}</div>
      </div>
    `;
  });
}

/* ================= INIT CORRECTO ================= */
document.addEventListener("DOMContentLoaded", function () {
  cargarSubSesiones();
  cargarConfig();
  cargarHistorial();
  cargarLinks();
});
