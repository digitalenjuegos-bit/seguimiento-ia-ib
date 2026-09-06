// ============================================
// CONFIG - Configuración de Firebase Realtime Database
// Seguimiento IA - Economía IB NM 2026 - Logos Academy
// ============================================
//
// La config web es PÚBLICA por diseño (no es un secreto).
// Mientras Firebase no esté disponible, la app funciona en MODO LOCAL
// (guarda en localStorage del navegador) para que puedas probarla.

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyD-iRwZ9AUya0F7tkU4uQUWE7eJbgeFZwM",
  authDomain: "coevaluacionhistoria.firebaseapp.com",
  databaseURL: "https://coevaluacionhistoria-default-rtdb.firebaseio.com",
  projectId: "coevaluacionhistoria",
  storageBucket: "coevaluacionhistoria.firebasestorage.app",
  messagingSenderId: "878859292504",
  appId: "1:878859292504:web:94a313961d347d1d5cdf2d"
};

// Ruta raíz en la Realtime Database donde se guarda el seguimiento IA
const FB_PATH = 'seguimiento_ia_ib';

// ¿Firebase está configurado? (true cuando el usuario puso sus credenciales)
const FIREBASE_CONFIGURED = FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.apiKey !== 'TU_API_KEY';

// Exportar para uso en el navegador
if (typeof window !== 'undefined') {
  window.FIREBASE_CONFIG = FIREBASE_CONFIG;
  window.FB_PATH = FB_PATH;
  window.FIREBASE_CONFIGURED = FIREBASE_CONFIGURED;
}
