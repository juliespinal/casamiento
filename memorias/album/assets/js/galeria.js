        const scriptURL = 'https://script.google.com/macros/s/AKfycbywW5vlsO6rF5okrfC9KTHvvvfnh9PqCVwozyf0f6SovR1MHOMue5oeyo28utE29GVd/exec';
        const contenedor = document.getElementById('galeria');
        
        // Usamos un "Set" para guardar los IDs de las fotos que ya están en pantalla.
        // Esto hace que buscar repetidos sea instantáneo.
        let fotosCargadas = new Set();
        let esPrimeraCarga = true;

        // Función principal
        function cargarFotos() {
            fetch(scriptURL)
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    // Invertimos el orden para procesar las nuevas primero (si el script las manda en orden)
                    // Opcional: data.fotos.reverse(); 

                    data.fotos.forEach(foto => {
                        // LA MAGIA: Solo agregamos si NO la tenemos cargada
                        if (!fotosCargadas.has(foto.id)) {
                            
                            // 1. Agregamos el ID a la lista de "ya vistas"
                            fotosCargadas.add(foto.id);

                            // 2. Creamos el elemento HTML
                            const img = document.createElement('img');
                            img.src = foto.url;
                            img.className = "foto-item animate__animated animate__fadeIn"; 
                            
                            // 3. Insertar en el DOM
                            if (esPrimeraCarga) {
                                // Al principio cargamos todo normal (al final de la lista)
                                contenedor.appendChild(img);
                            } else {
                                // Si es una actualización, la ponemos PRIMERA (arriba de todo)
                                // para que la gente vea lo nuevo al toque.
                                contenedor.prepend(img);
                            }
                        }
                    });

                    esPrimeraCarga = false; // Ya terminamos la carga inicial
                }
            })
            .catch(error => console.error("Error buscando fotos:", error));
        }

        // 1. Cargar apenas abre la web
        cargarFotos();

        // 2. Programar que se actualice solo cada 20 segundos (20000 ms)
        // No lo pongas muy bajo (ej: 1 seg) porque Google te puede bloquear por exceso de tráfico.
        setInterval(cargarFotos, 20000);