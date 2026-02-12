const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScOnqtEkPZTISXN4o3vrsi_vjMF3GcPuBlb0dIqJOuZVmeklQ/viewform";

function mostrarTab(id, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
}

function abrirModalSondeo() {
  document.getElementById("modalSondeo").style.display = "flex";
}

function cerrarModal() {
  document.getElementById("modalSondeo").style.display = "none";
}

function enviarSondeo() {

  const url = new URL(FORM_URL);

  url.searchParams.append("entry.5694922", cedulaEjecutivo.value);
  url.searchParams.append("entry.955460218", rut.value);
  url.searchParams.append("entry.216870845", numero.value);
  url.searchParams.append("entry.575117188", direccion.value);
  url.searchParams.append("entry.977079435", ont.value);
  url.searchParams.append("entry.789181094", olt.value);
  url.searchParams.append("entry.415672825", tarjeta.value);
  url.searchParams.append("entry.44152504", puerto.value);
  url.searchParams.append("entry.137275158", nodo.value);
  url.searchParams.append("entry.1163287562", observacionFinal.value);

  url.searchParams.append("entry.213109764", servicioFalla.value);
  url.searchParams.append("entry.2011962965", fallaElectrica.value);
  url.searchParams.append("entry.704266693", generador.value);
  url.searchParams.append("entry.1566836783", estadoLuces.value);

  window.open(url.toString(), "_blank");
  cerrarModal();
}
