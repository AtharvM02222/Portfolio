document.addEventListener('DOMContentLoaded', function() {
  const messages = [
    'Initializing...',
    'Loading assets...',
    'Almost ready...',
    'Welcome!'
  ];
  
  const typewriterEl = document.getElementById('typewriter-text');
  const mainPageURL = 'main.html';
  
  let messageIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  function typeWriter() {
    const currentMessage = messages[messageIndex];
    
    if (isDeleting) {
      typewriterEl.textContent = currentMessage.substring(0, charIndex);
      charIndex--;
      
      if (charIndex < 0) {
        isDeleting = false;
        messageIndex++;
        
        if (messageIndex >= messages.length) {
          // Redirect after showing all messages
          setTimeout(() => {
            // Redirect based on version preference
      const version = localStorage.getItem('website-version') || 'classic';
      window.location.href = version + '/main.html';
          }, 500);
          return;
        }
        
        setTimeout(typeWriter, 300);
        return;
      }
    } else {
      typewriterEl.textContent = currentMessage.substring(0, charIndex + 1);
      charIndex++;
      
      if (charIndex === currentMessage.length) {
        // Pause before deleting
        setTimeout(() => {
          isDeleting = true;
          typeWriter();
        }, 800);
        return;
      }
    }
    
    const speed = isDeleting ? 30 : 80;
    setTimeout(typeWriter, speed);
  }
  
  // Start typing
  typeWriter();
  
  // Handle audio with localStorage
  const audio = document.getElementById('bg-music');
  if (audio) {
    const lastTime = localStorage.getItem('audioTime');
    if (lastTime) {
      audio.currentTime = parseFloat(lastTime);
    }
    
    // Try to play (may be blocked by browser)
    audio.play().catch(() => {
      // Audio autoplay blocked - that's okay
    });
  }
  
  // Save audio time before leaving
  window.addEventListener('beforeunload', function() {
    if (audio) {
      localStorage.setItem('audioTime', audio.currentTime);
    }
  });
  
  // Fallback redirect after 4 seconds
  setTimeout(() => {
    const version = localStorage.getItem('website-version') || 'classic';
    window.location.href = version + '/main.html';
  }, 4000);
});
