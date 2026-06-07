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

async function cargarNoticias() {
    try {
        const querySnapshot = await getDocs(collection(db, "noticias"));
        
        if (!querySnapshot.empty) {
            contenedorNoticias.innerHTML = ''; // Borra las noticias falsas
        }

        querySnapshot.forEach((doc) => {
            const noticia = doc.data(); 
            
            if (noticia.es_opinion === false) {
                const articuloHTML = `
                    <article class="tarjeta-noticia">
                        <img src="${noticia.imagen}" alt="Imagen de la noticia">
                        <span class="etiqueta">${noticia.categoria}</span>
                        <h3>${noticia.titulo}</h3>
                        <p>${noticia.resumen}</p>
                        <a href="articulo.html?id=${doc.id}">Leer más</a>
                    </article>
                `;
                contenedorNoticias.innerHTML += articuloHTML;
            }
        });
    } catch (error) {
        console.error("Error al cargar las noticias: ", error);
    }
}

// Ejecutamos la función de noticias apenas se abre la página
cargarNoticias();