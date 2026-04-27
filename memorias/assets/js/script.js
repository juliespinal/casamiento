// --- CONFIGURACIÓN ---
const scriptURL = 'https://script.google.com/macros/s/AKfycbywW5vlsO6rF5okrfC9KTHvvvfnh9PqCVwozyf0f6SovR1MHOMue5oeyo28utE29GVd/exec'; 
const logoPath = '/memorias/assets/img/logo_overlay.png'; // <-- Verificá que esta ruta sea correcta
const cloudName = "dxxljb2qi"; 
const uploadPreset = "boda_mili_juli"; 
// ---------------------

const inputUpload = document.getElementById('inputUpload');
const btnUpload = document.getElementById('btnUpload');

// Modales
const previewModal = document.getElementById('preview-modal');
const loaderModal = document.getElementById('loader-modal');
const previewImg = document.getElementById('preview-img');
const loaderMsg = document.querySelector('.loader-msg');

let imagenListaParaEnviar = null;
let tipoArchivoActual = null; 
let archivoVideoCrudo = null; 

// Vincular botón visible con input oculto
if(btnUpload) {
    btnUpload.addEventListener('click', () => inputUpload.click());
}

// Event listener para cambio en input
inputUpload.addEventListener('change', procesarArchivo);

// --- FUNCIONES DE INTERFAZ ---
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
    archivoVideoCrudo = null;
    inputUpload.value = '';
    
    const previewVid = document.getElementById('preview-vid');
    if (previewVid) {
        previewVid.pause();
        previewVid.remove(); 
    }
}

// --- LÓGICA DE PROCESAMIENTO Y SUBIDA ---
function procesarArchivo(e) {
    if (e.target.files && e.target.files[0]) {
        const archivo = e.target.files[0];
        tipoArchivoActual = archivo.type.startsWith('video/') ? 'video' : 'foto';

        mostrarLoader("Preparando vista previa...");

        if (tipoArchivoActual === 'video') {
            archivoVideoCrudo = archivo; 
            const urlLocal = URL.createObjectURL(archivo);
            
            previewImg.style.display = 'none';
            let previewVid = document.getElementById('preview-vid');
            if(!previewVid) {
                previewVid = document.createElement('video');
                previewVid.id = 'preview-vid';
                previewVid.style.width = '100%';
                previewVid.style.maxHeight = '50vh';
                previewVid.style.borderRadius = '16px';
                previewVid.controls = true;
                document.querySelector('.img-container').appendChild(previewVid);
            }
            previewVid.style.display = 'block';
            previewVid.src = urlLocal;
            
            ocultarLoader();
            previewModal.style.display = 'flex';
        } else {
            comprimirImagen(archivo, 1600, 0.7, function(base64Final) {
                imagenListaParaEnviar = base64Final;
                const v = document.getElementById('preview-vid');
                if(v) v.remove();
                previewImg.style.display = 'block';
                previewImg.src = "data:image/jpeg;base64," + base64Final;
                ocultarLoader();
                previewModal.style.display = 'flex';
            });
        }
    }
}

function subirFotoDefinitiva() {
    mostrarLoader("Subiendo recuerdo... ☁️");

    if (tipoArchivoActual === 'video' && archivoVideoCrudo) {
        const formDataCloudinary = new FormData();
        formDataCloudinary.append("file", archivoVideoCrudo);
        formDataCloudinary.append("upload_preset", uploadPreset);

        fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
            method: "POST",
            body: formDataCloudinary
        })
        .then(res => res.json())
        .then(data => {
            const formDataDrive = new FormData();
            formDataDrive.append('videoUrl', data.secure_url);
            formDataDrive.append('nombreArchivo', "video_" + Date.now());
            return fetch(scriptURL, { method: 'POST', body: formDataDrive });
        })
        .then(() => {
            ocultarLoader();
            alert("¡Video guardado! 🎉");
            cerrarPreview();
        })
        .catch(err => {
            ocultarLoader();
            alert("Error al subir video.");
        });

    } else if (tipoArchivoActual === 'foto' && imagenListaParaEnviar) {
        const formData = new FormData();
        formData.append('imagen', imagenListaParaEnviar);
        formData.append('nombreArchivo', "foto_" + Date.now() + ".jpg");

        fetch(scriptURL, { method: 'POST', body: formData })
        .then(() => {
            ocultarLoader();
            alert("¡Foto guardada! 🎉");
            cerrarPreview();
        })
        .catch(() => {
            ocultarLoader();
            alert("Error al subir foto.");
        });
    }
}

function comprimirImagen(archivo, maxWidth, calidad, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(archivo);
    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function() {
            let width = img.width; let height = img.height;
            const ratio = Math.min(1, maxWidth / Math.max(width, height));
            const canvas = document.createElement('canvas');
            canvas.width = width * ratio; canvas.height = height * ratio;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            callback(canvas.toDataURL('image/jpeg', calidad).split(',')[1]);
        };
    };
}

window.cerrarPreview = cerrarPreview;
window.subirFotoDefinitiva = subirFotoDefinitiva;