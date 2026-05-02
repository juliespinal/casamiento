// REEMPLAZÁ ESTA URL CON LA QUE COPIASTE DE TU APPS SCRIPT
const scriptURL = 'https://script.google.com/macros/s/AKfycbwDyapSK3bWnzqnRZF0MHk_7fh-6SLk2rLNJB3U5rFdCTV35n4PvfrsL-zrDFapUNK5/exec';

const contenedorChismes = document.getElementById('gossip-feed');

// Función para traer los chismes aprobados
function cargarChismes() {
    fetch(scriptURL)
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                contenedorChismes.innerHTML = ''; // Limpiamos antes de cargar
                
                if (data.chismes.length === 0) {
                    contenedorChismes.innerHTML = '<p style="text-align:center; font-style:italic;">Aún no hay rumores que reportar. Sé el primero.</p>';
                    return;
                }

                data.chismes.forEach(item => {
                    const card = document.createElement('div');
                    card.className = "gossip-card animate__animated animate__fadeIn";
                    
                    const texto = document.createElement('p');
                    texto.className = "gossip-text";
                    texto.innerHTML = `« ${item.texto} »`;
                    
                    const fecha = document.createElement('span');
                    fecha.className = "gossip-date";
                    fecha.innerText = item.fecha;

                    card.appendChild(texto);
                    card.appendChild(fecha);
                    contenedorChismes.appendChild(card);
                });
            }
        })
        .catch(err => console.error("Error cargando chismes:", err));
}

// Función para enviar un chisme nuevo
function enviarChisme() {
    const input = document.getElementById('inputChisme');
    const texto = input.value.trim();
    const loader = document.getElementById('loader-whis');
    const boton = document.querySelector('.btn-whis');

    if (!texto) {
        alert("Querido y gentil lector, debe escribir un rumor antes de publicarlo.");
        return;
    }

    // Mostramos que está cargando
    loader.style.display = 'block';
    boton.style.display = 'none';

    // Preparamos los datos
    const formData = new FormData();
    formData.append('chisme', texto);

    // Enviamos a Google
    fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => response.json())
        .then(data => {
            loader.style.display = 'none';
            boton.style.display = 'block';
            
            if (data.result === 'success') {
                input.value = '';
                alert("¡Tu secreto está a salvo conmigo! Aparecerá en el diario en cuanto lo apruebe. 🪶");
            } else {
                alert("Hubo un error con la imprenta. Intenta de nuevo.");
            }
        })
        .catch(err => {
            loader.style.display = 'none';
            boton.style.display = 'block';
            alert("Error de conexión al enviar el rumor.");
        });
}

// Cargar los chismes ni bien abre la página
cargarChismes();

// (Opcional) Refrescar la lista cada 30 segundos
setInterval(cargarChismes, 30000);