const scriptURL = 'https://script.google.com/macros/s/AKfycbywW5vlsO6rF5okrfC9KTHvvvfnh9PqCVwozyf0f6SovR1MHOMue5oeyo28utE29GVd/exec';
const contenedor = document.getElementById('galeria');
const loader = document.getElementById('loader-inicial');

let fotosCargadas = new Set();
let esPrimeraCarga = true;

function cargarFotos() {
    fetch(scriptURL)
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                if (esPrimeraCarga) loader.style.display = 'none';
                data.fotos.reverse().forEach(item => {
                    if (!fotosCargadas.has(item.id)) {
                        fotosCargadas.add(item.id);

                        let el;
                        if (item.tipo === 'video') {
                            const wrapper = document.createElement('div');
                            wrapper.className = "video-wrapper animate__animated animate__fadeIn";
                            wrapper.onclick = () => abrirVisualizador(item.url, 'video');

                            const img = document.createElement('img');
                            img.src = item.url.replace(/\.(mp4|mov|webm)$/i, '.jpg');
                            img.className = "foto-item";

                            const icon = document.createElement('div');
                            icon.className = "play-icon";
                            icon.innerHTML = "▶";

                            wrapper.appendChild(img);
                            wrapper.appendChild(icon);
                            el = wrapper;
                        } else {
                            const img = document.createElement('img');
                            img.src = item.url;
                            img.className = "foto-item animate__animated animate__fadeIn";
                            img.onclick = () => abrirVisualizador(item.url, 'foto');
                            el = img;
                        }
                        contenedor.prepend(el);
                    }
                });
                esPrimeraCarga = false;
            }
        })
        .catch(err => console.error("Error:", err));
}

function abrirVisualizador(url, tipo) {
    const modal = document.getElementById('viewerModal');
    const container = document.getElementById('viewerContainer');
    container.innerHTML = '';

    if (tipo === 'video') {
        const video = document.createElement('video');
        video.src = url;
        video.className = "viewer-content";
        video.controls = true;
        video.autoplay = true;
        container.appendChild(video);
    } else {
        const img = document.createElement('img');
        img.src = url;
        img.className = "viewer-content";
        container.appendChild(img);
    }

    modal.style.display = 'flex';
}

function cerrarVisualizador() {
    document.getElementById('viewerModal').style.display = 'none';
    document.getElementById('viewerContainer').innerHTML = '';
}

cargarFotos();
setInterval(cargarFotos, 20000);