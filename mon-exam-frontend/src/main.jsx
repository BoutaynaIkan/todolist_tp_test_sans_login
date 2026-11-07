import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.jsx'
import * as Sentry from '@sentry/react'


// On configure Sentry UNIQUEMENT en production
// On utilise la variable `import.meta.env.PROD`, fournie automatiquement par Vite
if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN, // On la charge depuis les variables d'env

    integrations: [
    // Cette intégration active le monitoring de performance.
    // Elle permet de voir, par exemple, combien de temps prennent les appels API.
    Sentry.browserTracingIntegration(), 

    // Cette intégration enregistre les sessions utilisateur où une erreur se produit.
    // C'est comme avoir une "vidéo" de ce que l'utilisateur a fait avant le bug.
    Sentry.replayIntegration()
    ],

    // On configure le taux d'échantillonnage pour la performance.
    // 1.0 signifie qu'on capture 100% des transactions pour analyse.
    tracesSampleRate: 1.0,

    // On configure le taux d'échantillonnage pour les "replays" de session.
    replaySessionSampleRate: 0.1,  // On enregistre 10% des sessions.
    replaysOnErrorSampleRate: 1.0,  // Mais on enregistre 100% des sessions où une erreur survient.
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
