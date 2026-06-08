// 1. Importamos Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 2. Tu configuración
const firebaseConfig = {
  apiKey: "AIzaSyDOMadyrXQYw8bd7z93l159AWHVLKhsESI",
  authDomain: "notitwitt-c3970.firebaseapp.com",
  projectId: "notitwitt-c3970",
  storageBucket: "notitwitt-c3970.firebasestorage.app",
  messagingSenderId: "944260835653",
  appId: "1:944260835653:web:6a778bd832b3c0eb8ff62c"
};

// 3. Inicializamos Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==========================================
// LÓGICA DEL BOLETÍN (NEWSLETTER)
// ==========================================
const formBoletin = document.getElementById('form-boletin');
const emailInput = document.getElementById('email-boletin');

formBoletin.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    const correoUsuario = emailInput.value;
    const boton = formBoletin.querySelector('button');
    boton.textContent = "Guardando..."; 

    try {
        await addDoc(collection(db, "suscriptores"), {
            email: correoUsuario,
            fechaSuscripcion: new Date()
        });
        alert("¡Excelente! Te has suscrito a Notitwitt con el correo: " + correoUsuario);
        formBoletin.reset(); 
        boton.textContent = "Suscribirme"; 
    } catch (error) {
        console.error("Error al guardar: ", error);
        alert("Hubo un error. Por favor intenta de nuevo.");
        boton.textContent = "Suscribirme";
    }
}); // <-- ¡Aquí termina la función del boletín correctamente!


// ==========================================
// LÓGICA PARA CARGAR NOTICIAS
// ==========================================
const contenedorNoticias = document.getElementById('contenedor-noticias');

// ==========================================
// LÓGICA PARA CARGAR NOTICIAS Y OPINIONES
// ==========================================
const contenedorNoticias = document.getElementById('contenedor-noticias');
const contenedorOpinion = document.getElementById('contenedor-opinion');

// Revisamos si en la URL hay un filtro (ej. ?categoria=Politica)
const parametrosURL = new URLSearchParams(window.location.search);
const categoriaFiltro = parametrosURL.get('categoria');
const opinionFiltro = parametrosURL.get('opinion');

async function cargarNoticias() {
    try {
        const querySnapshot = await getDocs(collection(db, "noticias"));
        
        contenedorNoticias.innerHTML = ''; 
        if(contenedorOpinion) contenedorOpinion.innerHTML = ''; 

        // Si hay un filtro, cambiamos el título de la página
        if(categoriaFiltro) {
            document.querySelector('.noticias h2').textContent = 'Noticias de ' + categoriaFiltro;
        } else if (opinionFiltro) {
            document.querySelector('.noticias h2').textContent = 'Todas las Columnas de Opinión';
        }

        querySnapshot.forEach((doc) => {
            const noticia = doc.data(); 
            const id = doc.id;
            
            // Lógica para la cuadrícula principal
            let mostrarEnPrincipal = false;
            
            if (opinionFiltro) {
                // Si estamos en la página de "Ver Todos los de opinión"
                if (noticia.es_opinion === true) mostrarEnPrincipal = true;
            } else if (categoriaFiltro) {
                // Si hay filtro de categoría, solo mostramos esas y que NO sean opinión
                if (noticia.categoria === categoriaFiltro && noticia.es_opinion === false) mostrarEnPrincipal = true;
            } else {
                // Página de inicio normal
                if (noticia.es_opinion === false) mostrarEnPrincipal = true;
            }

            // Dibujamos en la izquierda (Noticias principales)
            if (mostrarEnPrincipal) {
                const articuloHTML = `
                    <article class="tarjeta-noticia">
                        <img src="${noticia.imagen}" alt="Imagen de la noticia">
                        <span class="etiqueta">${noticia.categoria}</span>
                        <h3>${noticia.titulo}</h3>
                        <p>${noticia.resumen}</p>
                        <a href="articulo.html?id=${id}">Leer más</a>
                    </article>
                `;
                contenedorNoticias.innerHTML += articuloHTML;
            }

            // Dibujamos en la derecha (Barra de Opinión) - Solo en el inicio
            if (!opinionFiltro && !categoriaFiltro && noticia.es_opinion === true && contenedorOpinion) {
                const opinionHTML = `
                    <article class="tarjeta-opinion" style="position:relative;">
                        <h4>${noticia.titulo}</h4>
                        <p class="autor">Categoría: ${noticia.categoria}</p>
                        <a href="articulo.html?id=${id}" style="text-decoration:none; color:var(--azul-acento);">Leer columna</a>
                    </article>
                `;
                contenedorOpinion.innerHTML += opinionHTML;
            }
        });
    } catch (error) {
        console.error("Error al cargar: ", error);
    }
}
cargarNoticias();


// ==========================================
// INTERACTIVIDAD (CHAT Y SUBIR ARRIBA)
// ==========================================
const btnChat = document.getElementById('btn-chat');
const chatBox = document.getElementById('chat-box');
const cerrarChat = document.getElementById('cerrar-chat');

if(btnChat) {
    btnChat.addEventListener('click', () => chatBox.classList.toggle('oculto'));
    cerrarChat.addEventListener('click', () => chatBox.classList.add('oculto'));
}

const btnSubir = document.getElementById('btn-subir');
if(btnSubir) {
    btnSubir.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}