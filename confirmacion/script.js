document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos
    const openBtn = document.getElementById('open-btn');
    const bgMusic = document.getElementById('bg-music');
    const body = document.body;

    // Función para abrir
    openBtn.addEventListener('click', () => {
        console.log("Click recibido - Abriendo sobre..."); // Para ver en consola si funciona

        // 1. Intentar reproducir audio
        if(bgMusic) {
            bgMusic.volume = 0.5;
            bgMusic.play().catch(error => console.log("Audio bloqueado o no encontrado:", error));
        }

        // 2. Activar animación CSS
        body.classList.add('opened');
        body.classList.remove('no-scroll');

        // 3. Opcional: Remover el overlay del HTML después de que termine la animación (2 seg)
        setTimeout(() => {
            const overlay = document.getElementById('envelope-overlay');
            if(overlay) overlay.style.display = 'none';
        }, 2000);
    });
});