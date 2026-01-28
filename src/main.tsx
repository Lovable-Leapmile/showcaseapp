import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Some production environments enforce Trusted Types (require-trusted-types-for 'script'),
// which can crash the app if any dependency assigns strings to innerHTML.
// Creating a default policy allows those assignments without runtime errors.
// If the environment disallows policy creation, this will no-op safely.
try {
  const tt = (window as any).trustedTypes
  if (tt?.createPolicy) {
    tt.createPolicy('default', {
      createHTML: (s: string) => s,
      createScript: (s: string) => s,
      createScriptURL: (s: string) => s,
    })
  }
} catch {
  // Intentionally ignore – some CSP configurations disallow creating policies.
}

createRoot(document.getElementById("root")!).render(<App />);
