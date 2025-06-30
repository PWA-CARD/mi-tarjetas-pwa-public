const TARJETAS = [
  {
    nombre: "Jonathan Martínez",
    desc: "Tarjeta de contacto personal y profesional.",
    img: "tarjeta1/mifoto.png",
    url: "https://pwa-card.github.io/mi-tarjetas-pwa-public/cliente_00001_jonmarpa/"
  },
  {
    nombre: "Laura López-DEMO",
    desc: "Tarjeta digital para networking.",
    img: "tarjeta2/mifoto.png",
    url: "https://pwa-card.github.io/mi-tarjetas-pwa-public/cliente-DEMO/"
  },
  {
    nombre: "Ejemplo Empresa",
    desc: "Tarjeta corporativa con datos de empresa.",
    img: "tarjeta3/logo2.png",
    url: "https://pwa-card.github.io/mi-tarjetas-pwa-public/cliente-YO-DEMO/"
  }
];

function mostrarTarjetas(filtro="") {
  const cont = document.getElementById('tarjetas-listado');
  if(!cont) return;
  cont.innerHTML = "";
  let count = 0;
  TARJETAS.forEach(t => {
    const nombre = t.nombre.toLowerCase();
    const desc = t.desc ? t.desc.toLowerCase() : "";
    if (!filtro || nombre.includes(filtro) || desc.includes(filtro)) {
      count++;
      const div = document.createElement('div');
      div.className = "tarjeta";
      div.innerHTML = `
        <img src="${t.img}" alt="${t.nombre}">
        <div class="tarjeta-nombre">${t.nombre}</div>
        <div class="tarjeta-desc">${t.desc||""}</div>
        <a href="${t.url}" target="_blank" class="tarjeta-enlace">Ver tarjeta</a>
      `;
      div.addEventListener("click", (e) => {
        if(!e.target.classList.contains('tarjeta-enlace')){
          window.open(t.url, "_blank");
        }
      });
      cont.appendChild(div);
    }
  });
  if (count === 0) {
    cont.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:#b3b3b3; font-size:1.08em; padding:34px 0;">No se han encontrado tarjetas con ese criterio.</div>';
  }
}

const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw07hhd4gqHDtLSOBBaSN69Mb-OoDPiwOqvFP_3UPqjRKTZAoDHuYG9NEv6QZT7NTgV/exec";

document.addEventListener("DOMContentLoaded", () => {
  // CATÁLOGO DE TARJETAS Y BUSCADOR
  mostrarTarjetas();
  const filtro = document.getElementById("filtroTarjetas");
  if (filtro) {
    filtro.addEventListener("input", function() {
      mostrarTarjetas(this.value.trim().toLowerCase());
    });
  }

  // FORMULARIO DE CONTACTO
  const form = document.getElementById('form-contacto');
  if(form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const estado = document.getElementById('mensaje-estado');
      estado.textContent = "Enviando...";
      try {
        const data = new FormData(form);
        const params = new URLSearchParams();
        for (const pair of data.entries()) {
          params.append(pair[0], pair[1]);
        }
        await fetch(GOOGLE_APPS_SCRIPT_URL, {
          method: "POST",
          body: params,
          mode: "no-cors"
        });
        estado.textContent = "¡Mensaje enviado! Gracias por contactar.";
        form.reset();
      } catch (err) {
        estado.textContent = "Error de conexión. Intenta más tarde.";
      }
    });
  }
});
