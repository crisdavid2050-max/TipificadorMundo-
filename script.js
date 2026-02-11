/* ===== PESTAÑAS ===== */
function mostrarTab(id, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
}

/* ===== DATOS ===== */
function obtenerDatos() {
  return JSON.parse(localStorage.getItem("observacionesPorSesion")) || observacionesPorSesion;
}

function guardarDatos(data) {
  localStorage.setItem("observacionesPorSesion", JSON.stringify(data));
}

/* ===== SUB-SESIÓN ===== */
function cargarSubSesiones() {
  const select = document.getElementById("subSesion");
  select.innerHTML = "";
  Object.keys(obtenerDatos()).forEach(s => {
    select.innerHTML += `<option value="${s}">${s}</option>`;
  });
  cargarObservaciones();
}

/* ===== CARGAR OBSERVACIONES ===== */
function cargarObservaciones() {
  const sesion = subSesion.value;
  const cont = document.getElementById("contenedorObservaciones");
  const preview = document.getElementById("previewObservacion");

  cont.innerHTML = "";
  preview.innerHTML = "";

  if (sesion === "Manual") {
    cont.innerHTML = `<textarea id="observacionManual" rows="4"
      placeholder="Escriba la observación manual aquí"></textarea>`;
    return;
  }

  const select = document.createElement("select");
  select.id = "observacionSelect";

  (obtenerDatos()[sesion] || []).forEach(o => {
    select.innerHTML += `<option value="${o}">${o}</option>`;
  });

  select.onchange = () => {
    preview.innerHTML = select.value;
  };

  cont.appendChild(select);
  preview.innerHTML = select.value;
}

/* ===== COPIAR ===== */
function copiarTodo() {
  const sesion = subSesion.value;
  let observacionFinal = "";

  if (sesion === "Manual") {
    observacionFinal = document.getElementById("observacionManual").value;
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

/* ===== CONFIGURACIÓN TARJETAS ===== */
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

  (obtenerDatos()[sesion] || []).forEach((obs, index) => {
    cont.innerHTML += `
      <div class="tarjeta">
        <textarea onchange="editarObservacion(${index}, this.value)">${obs}</textarea>
        <button onclick="eliminarObservacion(${index})">🗑</button>
      </div>
    `;
  });
}

function agregarObservacion() {
  const sesion = configSesion.value;
  const nueva = nuevaObservacion.value;
  if (!nueva) return;

  const data = obtenerDatos();
  data[sesion].push(nueva);
  guardarDatos(data);

  nuevaObservacion.value = "";
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

/* ===== HISTORIAL ===== */
function guardarHistorial(texto) {
  const h = JSON.parse(localStorage.getItem("historial")) || [];
  h.unshift(texto);
  localStorage.setItem("historial", JSON.stringify(h));
  cargarHistorial();
}

function cargarHistorial() {
  const filtro = filtroRut.value.toLowerCase();
  const lista = historialLista;
  lista.innerHTML = "";

  (JSON.parse(localStorage.getItem("historial")) || []).forEach(t => {
    if (!t.toLowerCase().includes(filtro)) return;

    lista.innerHTML += `
      <div class="historial-item">
        <span>${t.split("\n")[1]}</span>
        <button onclick="navigator.clipboard.writeText(\`${t}\`)">📋</button>
      </div>
    `;
  });
}

/* ===== LINKS ===== */
function cargarLinks() {
  const cont = document.getElementById("linksLista");
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

/* ===== INIT ===== */
cargarSubSesiones();
cargarConfig();
cargarHistorial();
cargarLinks();
