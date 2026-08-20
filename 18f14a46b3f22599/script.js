//Registro del Service Worker
      if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js')
        .then(() => console.log('Service Worker registrado correctamente'))
        .catch(err => console.log('Error al registrar Service Worker:', err));
    }
  let deferredPrompt;

// Mostrar solo si no está oculto en localStorage
document.addEventListener('DOMContentLoaded', function() {
  // Comprueba si el usuario ya lo ha cerrado
  if (localStorage.getItem('avisoPWAoculto') === '1') {
    var aviso = document.getElementById('aviso-pwa');
    if(aviso) aviso.style.display = 'none';
  }

  // Botón cerrar aviso
  var botonCerrar = document.getElementById('cerrar-aviso-pwa');
  if(botonCerrar){
    botonCerrar.addEventListener('click', function() {
      var aviso = document.getElementById('aviso-pwa');
      if(aviso) aviso.style.display = 'none';
      // Guarda el cierre en localStorage
      localStorage.setItem('avisoPWAoculto', '1');
    });
  }

  // Botón instalar PWA
  var installBtn = document.getElementById('pwa-install-btn');
  if(installBtn){
    installBtn.addEventListener('click', async function() {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        // Puedes ocultar el botón tras la elección
        if (outcome === 'accepted' || outcome === 'dismissed') {
          installBtn.style.display = 'none';
        }
        deferredPrompt = null;
      }
    });
  }
});

// Evento PWA
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Muestra el botón solo si es posible instalar
  const btn = document.getElementById('pwa-install-btn');
  if(btn) btn.style.display = 'inline-block';
  // Opcional: puedes ocultar las instrucciones manuales si quieres
  // document.getElementById('pwa-manual').style.display = 'none';
});