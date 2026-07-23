import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, getDoc, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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

const parametrosURL = new URLSearchParams(window.location.search);
const idNoticia = parametrosURL.get('id');
const contenedor = document.getElementById('contenedor-articulo');

// 1. CARGAR LA NOTICIA
async function cargarArticuloCompleto() {
    if (!idNoticia) {
        contenedor.innerHTML = "<h2>Error: No se encontró la noticia.</h2>";
        return;
    }

    try {
        const documento = await getDoc(doc(db, "noticias", idNoticia));
        if (documento.exists()) {
            const noticia = documento.data();
            const contenidoFormateado = noticia.contenido ? noticia.contenido.replace(/\n/g, '<br><br>') : "Contenido no disponible.";

            contenedor.innerHTML = `
                <span class="etiqueta">${noticia.categoria}</span>
                <h1 style="margin-top: 1rem; font-size: 2.5rem; color: var(--azul-acento);">${noticia.titulo}</h1>
                <img src="${noticia.imagen}" alt="Imagen de la noticia" style="width: 100%; border-radius: 8px; margin: 1.5rem 0;">
                <p style="font-size: 1.2rem; line-height: 1.8; color: var(--texto-titulos);">${contenidoFormateado}</p>
            `;
            
            // Después de cargar la noticia, cargamos sus comentarios
            cargarComentarios();
        } else {
            contenedor.innerHTML = "<h2>Esta noticia ya no existe.</h2>";
        }
    } catch (error) {
        console.error("Error al cargar:", error);
    }
}
cargarArticuloCompleto();

// 2. LÓGICA DE COMENTARIOS
const formComentario = document.getElementById('form-comentario');
const listaComentarios = document.getElementById('lista-comentarios');

// Publicar Comentario
if (formComentario) {
    formComentario.addEventListener('submit', async (e) => {
        e.preventDefault();
        const boton = formComentario.querySelector('button');
        boton.textContent = "Publicando...";
        
        try {
            await addDoc(collection(db, "comentarios"), {
                id_noticia: idNoticia, // Guardamos a qué noticia pertenece
                nombre: document.getElementById('nombre-comentario').value,
                texto: document.getElementById('texto-comentario').value,
                fecha: new Date().getTime() // Para ordenarlos después
            });
            
            formComentario.reset();
            boton.textContent = "Publicar comentario";
            cargarComentarios(); // Recargamos para ver el nuevo
        } catch (error) {
            console.error("Error al publicar comentario:", error);
            boton.textContent = "Publicar comentario";
        }
    });
}

// Cargar Comentarios de esta noticia
async function cargarComentarios() {
    if (!idNoticia) return;
    listaComentarios.innerHTML = "<p>Cargando comentarios...</p>";
    
    try {
        const q = query(collection(db, "comentarios"), where("id_noticia", "==", idNoticia));
        const querySnapshot = await getDocs(q);
        
        let comentariosArray = [];
        querySnapshot.forEach((doc) => {
            comentariosArray.push(doc.data());
        });
        
        // Ordenamos los más nuevos primero
        comentariosArray.sort((a, b) => b.fecha - a.fecha);

        listaComentarios.innerHTML = "";
        
        if (comentariosArray.length === 0) {
            listaComentarios.innerHTML = "<p style='color: #94a3b8;'>Aún no hay comentarios. ¡Sé el primero en opinar!</p>";
        } else {
            comentariosArray.forEach(com => {
                listaComentarios.innerHTML += `
                    <div style="background: var(--fondo-principal); padding: 15px; border-radius: 8px;">
                        <strong style="color: var(--azul-acento); display: block; margin-bottom: 5px;">${com.nombre}</strong>
                        <p style="font-size: 0.95rem;">${com.texto}</p>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error("Error al cargar comentarios:", error);
    }
}