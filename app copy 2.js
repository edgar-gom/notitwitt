// 1. IMPORTAMOS FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDOMadyrXQYw8bd7z93l159AWHVLKhsESI",
  authDomain: "notitwitt-c3970.firebaseapp.com",
  projectId: "notitwitt-c3970",
  storageBucket: "notitwitt-c3970.firebasestorage.app",
  messagingSenderId: "944260835653",
  appId: "1:944260835653:web:6a778bd832b3c0eb8ff62c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==========================================
// 2. LÓGICA DEL BOLETÍN (Segura)
// ==========================================
const formBoletin = document.getElementById('form-boletin');
if (formBoletin) {
    formBoletin.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        const emailInput = document.getElementById('email-boletin');
        const boton = formBoletin.querySelector('button');
        boton.textContent = "Guardando..."; 
        try {
            await addDoc(collection(db, "suscriptores"), { email: emailInput.value, fecha: new Date() });
            alert("¡Excelente! Te has suscrito a Notitwitt.");
            formBoletin.reset(); 
            boton.textContent = "Unirse"; 
        } catch (error) {
            alert("Hubo un error. Intenta de nuevo.");
            boton.textContent = "Unirse";
        }
    });
}

// ==========================================
// 3. CARGAR NOTICIAS (Segura)
// ==========================================
const contenedorNoticias = document.getElementById('contenedor-noticias');
const contenedorOpinion = document.getElementById('contenedor-opinion');
const parametrosURL = new URLSearchParams(window.location.search);
const categoriaFiltro = parametrosURL.get('categoria');
const opinionFiltro = parametrosURL.get('opinion');

async function cargarNoticias() {
    if(!contenedorNoticias) return; // Si no hay contenedor (ej. en login), no hace nada

    try {
        const querySnapshot = await getDocs(collection(db, "noticias"));
        contenedorNoticias.innerHTML = ''; 
        if(contenedorOpinion) contenedorOpinion.innerHTML = ''; 

        if(categoriaFiltro) {
            document.querySelector('.noticias h2').textContent = 'Noticias de ' + categoriaFiltro;
        } else if (opinionFiltro) {
            document.querySelector('.noticias h2').textContent = 'Columnas de Opinión';
        }

        querySnapshot.forEach((doc) => {
            const noticia = doc.data(); 
            const id = doc.id;
            let mostrarEnPrincipal = false;
            
            if (opinionFiltro) {
                if (noticia.es_opinion === true) mostrarEnPrincipal = true;
            } else if (categoriaFiltro) {
                if (noticia.categoria === categoriaFiltro && noticia.es_opinion === false) mostrarEnPrincipal = true;
            } else {
                if (noticia.es_opinion === false) mostrarEnPrincipal = true;
            }

            if (mostrarEnPrincipal) {
                contenedorNoticias.innerHTML += `
                    <article class="tarjeta-noticia">
                        <img src="${noticia.imagen}" alt="Imagen">
                        <span class="etiqueta">${noticia.categoria}</span>
                        <h3>${noticia.titulo}</h3>
                        <p>${noticia.resumen}</p>
                        <a href="articulo.html?id=${id}">Leer más</a>
                    </article>
                `;
            }

            if (!opinionFiltro && !categoriaFiltro && noticia.es_opinion === true && contenedorOpinion) {
                contenedorOpinion.innerHTML += `
                    <article class="tarjeta-opinion" style="position:relative;">
                        <h4>${noticia.titulo}</h4>
                        <p class="autor">${noticia.categoria}</p>
                        <a href="articulo.html?id=${id}" style="text-decoration:none; color:var(--azul-acento);">Leer columna</a>
                    </article>
                `;
            }
        });
    } catch (error) {
        console.error("Error al cargar Firebase:", error);
    }
}
cargarNoticias();

// ==========================================
// 4. INTERACTIVIDAD (CHAT Y SCROLL SEGURA)
// ==========================================
const btnChat = document.getElementById('btn-chat');
const chatBox = document.getElementById('chat-box');
const cerrarChat = document.getElementById('cerrar-chat');
const btnSubir = document.getElementById('btn-subir');

// Funciones para abrir y cerrar
if (btnChat && chatBox && cerrarChat) {
    btnChat.addEventListener('click', () => chatBox.classList.toggle('oculto'));
    cerrarChat.addEventListener('click', () => chatBox.classList.add('oculto'));
}

// Función para subir arriba
if (btnSubir) {
    btnSubir.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Funciones para ENVIAR el mensaje a Firebase
const btnEnviarChat = document.getElementById('enviar-chat');
const inputChat = document.getElementById('mensaje-chat');
const cuerpoChat = document.querySelector('.chat-body');

if(btnEnviarChat) {
    btnEnviarChat.addEventListener('click', async () => {
        const textoMensaje = inputChat.value.trim();
        
        if(textoMensaje !== "") {
            // 1. Dibuja el mensaje del usuario
            cuerpoChat.innerHTML += `<div style="background: white; color: black; margin: 10px; padding: 8px; border-radius: 8px; text-align: right; font-size: 0.9rem;">${textoMensaje}</div>`;
            inputChat.value = ""; // Limpia la caja
            
            try {
                // 2. Guarda en la base de datos "mensajes_chat"
                await addDoc(collection(db, "mensajes_chat"), {
                    mensaje: textoMensaje,
                    fecha: new Date(),
                    estado: "No leído"
                });

                // 3. Respuesta del bot de Notitwit
                setTimeout(() => {
                    cuerpoChat.innerHTML += `<div style="background: #e2e8f0; color: black; margin: 10px; padding: 8px; border-radius: 8px; text-align: left; font-size: 0.9rem;">Mensaje recibido. El equipo de Notitwit lo leerá pronto. ¡Gracias!</div>`;
                    // Baja el scroll automáticamente
                    cuerpoChat.scrollTop = cuerpoChat.scrollHeight; 
                }, 1000);

            } catch (error) {
                console.error("Error al guardar en Firebase:", error);
            }
        }
    });
}
// ==========================================
// MENÚ HAMBURGUESA PARA CELULARES
// ==========================================
const btnHamburguesa = document.getElementById('btn-hamburguesa');
const btnCerrarMenu = document.getElementById('btn-cerrar-menu');
const menuPrincipal = document.getElementById('menu-principal');

if(btnHamburguesa && btnCerrarMenu && menuPrincipal) {
    // Al hacer clic en ☰ le agregamos la clase "abierto"
    btnHamburguesa.addEventListener('click', () => {
        menuPrincipal.classList.add('abierto');
    });

    // Al hacer clic en ✕ le quitamos la clase "abierto"
    btnCerrarMenu.addEventListener('click', () => {
        menuPrincipal.classList.remove('abierto');
    });
}

// ==========================================
// CHAT REAL CON FIREBASE
// ==========================================
const btnChat = document.getElementById('btn-chat');
const chatBox = document.getElementById('chat-box');
const cerrarChat = document.getElementById('cerrar-chat');
const btnSubir = document.getElementById('btn-subir');

if (btnChat && chatBox && cerrarChat) {
    btnChat.addEventListener('click', () => chatBox.classList.toggle('oculto'));
    cerrarChat.addEventListener('click', () => chatBox.classList.add('oculto'));
}

if (btnSubir) {
    btnSubir.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Lógica de guardado en base de datos
const btnEnviarChat = document.getElementById('enviar-chat');
const inputChat = document.getElementById('mensaje-chat');
const cuerpoChat = document.querySelector('.chat-body');

if(btnEnviarChat) {
    btnEnviarChat.addEventListener('click', async () => {
        const textoMensaje = inputChat.value.trim();
        
        if(textoMensaje !== "") {
            // 1. Muestra el mensaje del usuario en la pantallita
            cuerpoChat.innerHTML += `<div style="background: white; color: black; margin: 10px; padding: 8px; border-radius: 8px; text-align: right; font-size: 0.9rem;">${textoMensaje}</div>`;
            inputChat.value = ""; // Limpia la caja

            try {
                // 2. LO GUARDA EN FIREBASE DE VERDAD
                await addDoc(collection(db, "mensajes_chat"), {
                    mensaje: textoMensaje,
                    fecha: new Date(),
                    estado: "No leído"
                });

                // 3. Respuesta automática
                setTimeout(() => {
                    cuerpoChat.innerHTML += `<div style="background: #e2e8f0; color: black; margin: 10px; padding: 8px; border-radius: 8px; text-align: left; font-size: 0.9rem;">Mensaje recibido. El equipo de Notitwit lo leerá pronto. ¡Gracias!</div>`;
                    // Hace que el chat baje automáticamente si hay muchos mensajes
                    cuerpoChat.scrollTop = cuerpoChat.scrollHeight; 
                }, 1000);

            } catch (error) {
                console.error("Error al enviar mensaje a Firebase:", error);
            }
        }
    });
}