import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
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

let idNoticiaEditando = null; // Variable para saber si estamos editando

// 1. SEGURIDAD
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.replace("login.html"); 
    } else {
        document.body.style.display = "block";
        cargarListaNoticias();
    }
});

// 2. CERRAR SESIÓN
document.getElementById('btn-logout').addEventListener('click', () => {
    signOut(auth).then(() => window.location.href = "index.html");
});

// 3. PUBLICAR O ACTUALIZAR NOTICIA
const formNoticia = document.getElementById('form-noticia');
formNoticia.addEventListener('submit', async (e) => {
    e.preventDefault();
    const boton = document.getElementById('btn-publicar');
    boton.textContent = "Guardando...";

    const datosNoticia = {
        titulo: document.getElementById('titulo').value,
        resumen: document.getElementById('resumen').value,
        contenido: document.getElementById('contenido').value,
        categoria: document.getElementById('categoria').value,
        imagen: document.getElementById('imagen').value,
        es_opinion: document.getElementById('es_opinion').checked
    };

    try {
        if (idNoticiaEditando) {
            // ACTUALIZAR (EDITAR)
            await updateDoc(doc(db, "noticias", idNoticiaEditando), datosNoticia);
            alert("¡Noticia actualizada correctamente!");
            idNoticiaEditando = null; // Reseteamos la variable
            boton.textContent = "Publicar Noticia";
            document.querySelector('.formulario-admin h2').textContent = "Escribir Nueva Noticia";
        } else {
            // CREAR NUEVA
            datosNoticia.fecha = new Date();
            await addDoc(collection(db, "noticias"), datosNoticia);
            alert("¡Noticia publicada!");
            boton.textContent = "Publicar Noticia";
        }
        
        formNoticia.reset();
        cargarListaNoticias();
    } catch (error) {
        alert("Error al guardar.");
        boton.textContent = idNoticiaEditando ? "Actualizar Noticia" : "Publicar Noticia";
    }
});

// 4. CARGAR LISTA PARA BORRAR Y EDITAR
const contenedorBorrar = document.getElementById('lista-borrar-noticias');

async function cargarListaNoticias() {
    contenedorBorrar.innerHTML = 'Cargando noticias...';
    const querySnapshot = await getDocs(collection(db, "noticias"));
    contenedorBorrar.innerHTML = '';

    querySnapshot.forEach((documento) => {
        const noticia = documento.data();
        const id = documento.id;
        
        contenedorBorrar.innerHTML += `
            <div style="background: var(--fondo-principal); padding: 10px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; border-radius: 4px; gap: 10px;">
                <span style="color: var(--texto-titulos); font-weight: bold; flex: 1;">${noticia.titulo}</span>
                <button class="btn-editar" data-id="${id}" style="background: #3b82f6; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Editar</button>
                <button class="btn-borrar" data-id="${id}" style="background: #ef4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Borrar</button>
            </div>
        `;
    });
}

// 5. EVENTOS DE LOS BOTONES BORRAR Y EDITAR
contenedorBorrar.addEventListener('click', async (e) => {
    const idNoticia = e.target.getAttribute('data-id');

    // BOTÓN BORRAR
    if (e.target.classList.contains('btn-borrar')) {
        if (confirm("¿Estás seguro de que quieres borrar esta noticia para siempre?")) {
            await deleteDoc(doc(db, "noticias", idNoticia));
            cargarListaNoticias();
        }
    }

    // BOTÓN EDITAR
    if (e.target.classList.contains('btn-editar')) {
        const docSnap = await getDoc(doc(db, "noticias", idNoticia));
        if (docSnap.exists()) {
            const noticia = docSnap.data();
            
            // Llenamos el formulario con los datos de la noticia
            document.getElementById('titulo').value = noticia.titulo;
            document.getElementById('resumen').value = noticia.resumen;
            document.getElementById('contenido').value = noticia.contenido;
            document.getElementById('categoria').value = noticia.categoria;
            document.getElementById('imagen').value = noticia.imagen || "";
            document.getElementById('es_opinion').checked = noticia.es_opinion || false;
            
            idNoticiaEditando = idNoticia; // Guardamos el ID que estamos editando
            
            document.querySelector('.formulario-admin h2').textContent = "Editando Noticia...";
            document.getElementById('btn-publicar').textContent = "Actualizar Noticia";
            
            // Subimos la pantalla hacia el formulario
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
});