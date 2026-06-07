// 1. Importamos Firebase y la herramienta de Autenticación
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// 2. Tu configuración exacta
const firebaseConfig = {
  apiKey: "AIzaSyDOMadyrXQYw8bd7z93l159AWHVLKhsESI",
  authDomain: "notitwitt-c3970.firebaseapp.com",
  projectId: "notitwitt-c3970",
  storageBucket: "notitwitt-c3970.firebasestorage.app",
  messagingSenderId: "944260835653",
  appId: "1:944260835653:web:6a778bd832b3c0eb8ff62c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 3. Lógica del botón de entrar
const formLogin = document.getElementById('form-login');

formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email-login').value;
    const password = document.getElementById('password-login').value;
    const boton = document.getElementById('btn-login');
    
    boton.textContent = "Verificando...";

    try {
        // Intentamos iniciar sesión con Firebase
        await signInWithEmailAndPassword(auth, email, password);
        
        // Si la contraseña es correcta, lo enviamos a la página de admin
        window.location.href = "admin.html";

    } catch (error) {
        // Si se equivoca, le avisamos
        console.error("Error: ", error.code);
        alert("Correo o contraseña incorrectos. Intenta de nuevo.");
        boton.textContent = "Entrar";
    }
});