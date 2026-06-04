// 1. Importamos Firebase directamente desde internet (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 2. Tu configuración exacta (las llaves de tu imagen)
const firebaseConfig = {
  apiKey: "AIzaSyDOMadyrXQYw8bd7z93l159AWHVLKhsESI",
  authDomain: "notitwitt-c3970.firebaseapp.com",
  projectId: "notitwitt-c3970",
  storageBucket: "notitwitt-c3970.firebasestorage.app",
  messagingSenderId: "944260835653",
  appId: "1:944260835653:web:6a778bd832b3c0eb8ff62c"
};

// 3. Inicializamos Firebase y la Base de Datos
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==========================================
// LÓGICA DEL BOLETÍN (NEWSLETTER)
// ==========================================

// Atrapamos el formulario y el cuadro de texto del HTML
const formBoletin = document.getElementById('form-boletin');
const emailInput = document.getElementById('email-boletin');

// Le decimos qué hacer cuando alguien hace clic en "Suscribirme"
formBoletin.addEventListener('submit', async (e) => {
    e.preventDefault(); // Esto evita que la página parpadee o se recargue

    const correoUsuario = emailInput.value;
    const boton = formBoletin.querySelector('button');
    boton.textContent = "Guardando..."; // Cambiamos el texto del botón temporalmente

    try {
        // Guardamos el correo en una colección llamada "suscriptores" en Firebase
        await addDoc(collection(db, "suscriptores"), {
            email: correoUsuario,
            fechaSuscripcion: new Date()
        });

        // Le avisamos al usuario que funcionó
        alert("¡Excelente! Te has suscrito a Notitwitt con el correo: " + correoUsuario);
        formBoletin.reset(); // Limpiamos el cuadro de texto
        boton.textContent = "Suscribirme"; // Regresamos el botón a la normalidad

    } catch (error) {
        console.error("Error al guardar: ", error);
        alert("Hubo un pequeño error. Por favor intenta de nuevo.");
        boton.textContent = "Suscribirme";
    }
});