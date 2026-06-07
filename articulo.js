import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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

// 1. Obtenemos el ID de la noticia desde la URL (ej. articulo.html?id=123)
const parametrosURL = new URLSearchParams(window.location.search);
const idNoticia = parametrosURL.get('id');

const contenedor = document.getElementById('contenedor-articulo');

// 2. Buscamos la noticia en Firebase
async function cargarArticuloCompleto() {
    if (!idNoticia) {
        contenedor.innerHTML = "<h2>Error: No se encontró la noticia.</h2>";
        return;
    }

    try {
        const documento = await getDoc(doc(db, "noticias", idNoticia));

        if (documento.exists()) {
            const noticia = documento.data();
            
            // Reemplazamos los saltos de línea con <br> para que los párrafos se vean bien
            const contenidoFormateado = noticia.contenido ? noticia.contenido.replace(/\n/g, '<br><br>') : "Contenido no disponible.";

            // Dibujamos la noticia
            contenedor.innerHTML = `
                <span class="etiqueta">${noticia.categoria}</span>
                <h1 style="margin-top: 1rem; font-size: 2.5rem; color: var(--azul-acento);">${noticia.titulo}</h1>
                <img src="${noticia.imagen}" alt="Imagen de la noticia" style="width: 100%; border-radius: 8px; margin: 1.5rem 0;">
                <p style="font-size: 1.2rem; line-height: 1.8; color: var(--texto-titulos);">${contenidoFormateado}</p>
            `;
        } else {
            contenedor.innerHTML = "<h2>Esta noticia ya no existe.</h2>";
        }
    } catch (error) {
        console.error("Error al cargar:", error);
        contenedor.innerHTML = "<h2>Hubo un error al cargar la noticia.</h2>";
    }
}

cargarArticuloCompleto();