function mostrarTab(id, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));

  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
}

const selectObs = document.getElementById("observacion");
observacionesSoporte.forEach(obs => {
  const option = document.createElement("option");
  option.value = obs;
  option.textContent = obs;
  selectObs.appendChild(option);
});

function copiarTodo() {
  const texto = `
Fecha: ${fecha.value}
RUT: ${rut.value}
Nombre: ${nombre.value}
ID Llamada: ${idLlamada.value}
Número: ${numero.value}
ONT: ${ont.value}
OLT: ${olt.value}
Dirección: ${direccion.value}

Observación de Soporte:
${observacion.value}
`.trim();

  navigator.clipboard.writeText(texto)
    .then(() => alert("Información copiada correctamente"));
}

function enviarSondeo() {
  window.open(
    "https://docs.google.com/forms/d/e/1FAIpQLScOnqtEkPZTISXN4o3vrsi_vjMF3GcPuBlb0dIqJOuZVmeklQ/viewform",
    "_blank"
  );
}
