// PWA Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then((reg) => console.log('✅ SW registered:', reg.scope))
      .catch((err) => console.error('❌ SW failed:', err));
  });
}

// Install prompt handle
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Tomar icche moto ekta "Install App" button dekhate paro
  console.log('📲 App installable');
});

// Install button trigger (jodi button thake)
window.installApp = async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log('User choice:', outcome);
  deferredPrompt = null;
};
