// --- CONFIGURACIÓN ---
        const scriptURL = 'https://script.google.com/macros/s/AKfycbywW5vlsO6rF5okrfC9KTHvvvfnh9PqCVwozyf0f6SovR1MHOMue5oeyo28utE29GVd/exec'; 
const logoPath = '/final/assets/img/logo_overlay.png'; // Ruta del logo para overlay
// ---------------------

const inputCamera = document.getElementById('inputCamera');
const inputUpload = document.getElementById('inputUpload');
const btnCamera = document.getElementById('btnCamera');
const btnUpload = document.getElementById('btnUpload');

// Modales
const previewModal = document.getElementById('preview-modal');
const loaderModal = document.getElementById('loader-modal');
const previewImg = document.getElementById('preview-img');
const loaderMsg = document.querySelector('.loader-msg');

let imagenListaParaEnviar = null;

// Vincular botones visibles con inputs ocultos
btnCamera.addEventListener('click', () => inputCamera.click());
btnUpload.addEventListener('click', () => inputUpload.click());

// Event listeners para cambios en inputs
inputCamera.addEventListener('change', procesarArchivo);
inputUpload.addEventListener('change', procesarArchivo);

function procesarArchivo(e) {
    if (e.target.files && e.target.files[0]) {
        const archivo = e.target.files[0];
        
        mostrarLoader("Optimizando imagen...");

        // Usamos la función de compresión
        comprimirImagen(archivo, 1600, 0.7, function(base64Final) {
            imagenListaParaEnviar = base64Final;
            
            // Mostrar Preview
            previewImg.src = "data:image/jpeg;base64," + base64Final;
            ocultarLoader();
            previewModal.style.display = 'flex';
        });
    }
}

// Funciones UI
function mostrarLoader(texto) {
    loaderMsg.innerText = texto;
    loaderModal.style.display = 'flex';
}
function ocultarLoader() {
    loaderModal.style.display = 'none';
}
function cerrarPreview() {
    previewModal.style.display = 'none';
    imagenListaParaEnviar = null;
    inputCamera.value = '';
    inputUpload.value = '';
}

// Subida Definitiva
function subirFotoDefinitiva() {
    if (!imagenListaParaEnviar) return;

    mostrarLoader("Subiendo a la nube... ☁️");

    const formData = new FormData();
    formData.append('imagen', imagenListaParaEnviar);
    formData.append('nombreArchivo', "boda_miliyjuli_" + Date.now() + ".jpg");

    fetch(scriptURL, { method: 'POST', body: formData })
    .then(response => response.json())
    .then(data => {
        if(data.result === 'success') {
            ocultarLoader();
            alert("¡Foto guardada con éxito! 🎉");
            cerrarPreview();
        } else {
            throw new Error(data.error);
        }
    })
    .catch(error => {
        ocultarLoader();
        alert("Uy, hubo un error al subir. Intentá de nuevo.");
        console.error(error);
    });
}

// Función de Compresión + Logo (Manteniendo ratio)
function comprimirImagen(archivo, maxWidth, calidad, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(archivo);
    
    reader.onload = function(event) {
        const imgFoto = new Image();
        imgFoto.src = event.target.result;
        
        imgFoto.onload = function() {
            // 1. Cálculos de tamaño (Esto queda igual)
            let width = imgFoto.width;
            let height = imgFoto.height;
            const ladoMayor = Math.max(width, height);
            let ratio = 1;
            
            if (ladoMayor > maxWidth) {
                ratio = maxWidth / ladoMayor;
            }

            width = width * ratio;
            height = height * ratio;

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            
            // Dibujar Foto
            ctx.drawImage(imgFoto, 0, 0, width, height);

            // 2. Configurar Logo
            const imgLogo = new Image();
            imgLogo.crossOrigin = "Anonymous"; 
            imgLogo.src = logoPath;

            imgLogo.onload = function() {
                // CAMBIO 1: Escala y Margen Dinámicos
                // El logo ocupa el 25% del ancho de la foto
                const escalaLogo = 0.25; 
                // El margen es el 3% del ancho (se adapta si es chica o grande)
                const margenDinamico = width * 0.03; 

                const logoNewWidth = width * escalaLogo;
                const logoNewHeight = logoNewWidth * (imgLogo.height / imgLogo.width);
                
                // CAMBIO 2: Cálculo de posición con seguridad
                // Math.max(0, ...) asegura que nunca de negativo. Si no entra, se pega al borde (0).
                const xPos = Math.max(0, width - logoNewWidth - margenDinamico);
                const yPos = Math.max(0, height - logoNewHeight - margenDinamico);

                // CAMBIO 3: Dibujamos SIEMPRE (sacamos el if restrictivo)
                ctx.drawImage(imgLogo, xPos, yPos, logoNewWidth, logoNewHeight);
                
                terminarProceso(canvas);
            };

            imgLogo.onerror = function() {
                // Si falla la carga del logo, sale foto sola
                terminarProceso(canvas);
            }
        };
    };
    
    function terminarProceso(canvas) {
        const dataUrl = canvas.toDataURL('image/jpeg', calidad);
        const rawBase64 = dataUrl.split(',')[1];
        callback(rawBase64);
    }
}

// Hacer funciones globales para que el HTML las vea
window.cerrarPreview = cerrarPreview;
window.subirFotoDefinitiva = subirFotoDefinitiva;