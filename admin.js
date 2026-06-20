import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

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
const auth = getAuth(app);

// 1. SEGURIDAD (EL CANDADO MEJORADO)
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Si no hay sesión, lo patea al login sin dejar rastro en el historial
        window.location.replace("login.html"); 
    } else {
        // Si SÍ hay sesión, hacemos visible la página
        document.body.style.display = "block";
        // Y SOLO AHORA cargamos la lista de noticias para borrar
        cargarListaNoticias();
    }
});

// 2. CERRAR SESIÓN
document.getElementById('btn-logout').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = "index.html";
    });
});

// 3. PUBLICAR NOTICIA
const formNoticia = document.getElementById('form-noticia');
formNoticia.addEventListener('submit', async (e) => {
    e.preventDefault();
    const boton = document.getElementById('btn-publicar');
    boton.textContent = "Publicando...";

    try {
        await addDoc(collection(db, "noticias"), {
            titulo: document.getElementById('titulo').value,
            resumen: document.getElementById('resumen').value,
            contenido: document.getElementById('contenido').value, // El nuevo campo
            categoria: document.getElementById('categoria').value,
            imagen: document.getElementById('imagen').value,
            es_opinion: document.getElementById('es_opinion').checked,
            fecha: new Date()
        });
        alert("¡Noticia publicada!");
        formNoticia.reset();
        boton.textContent = "Publicar Noticia";
        cargarListaNoticias(); // Recarga la lista de abajo
    } catch (error) {
        alert("Error al publicar.");
    }
});

// 4. MOSTRAR LISTA PARA BORRAR
const contenedorBorrar = document.getElementById('lista-borrar-noticias');

async function cargarListaNoticias() {
    contenedorBorrar.innerHTML = 'Cargando noticias...';
    const querySnapshot = await getDocs(collection(db, "noticias"));
    contenedorBorrar.innerHTML = '';

    querySnapshot.forEach((documento) => {
        const noticia = documento.data();
        const id = documento.id; // El ID secreto de Firebase
        
        contenedorBorrar.innerHTML += `
            <div style="background: var(--fondo-principal); padding: 10px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; border-radius: 4px;">
                <span style="color: var(--texto-titulos); font-weight: bold;">${noticia.titulo}</span>
                <button class="btn-borrar" data-id="${id}" style="background: #ef4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Borrar</button>
            </div>
        `;
    });
}

// 5. FUNCIÓN PARA BORRAR
contenedorBorrar.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-borrar')) {
        const idNoticia = e.target.getAttribute('data-id');
        if (confirm("¿Estás seguro de que quieres borrar esta noticia para siempre?")) {
            await deleteDoc(doc(db, "noticias", idNoticia));
            cargarListaNoticias(); // Recarga la lista
        }
    }
});

// Cargar la lista al abrir la página
