/* Version Switcher - Reimagine Button */
(function() {
  'use strict';
  
  // Detect current version based on URL
  const isModern = window.location.pathname.includes('/modern/');
  const currentVersion = isModern ? 'modern' : 'classic';
  
  // Save current version
  localStorage.setItem('websiteVersion', currentVersion);
  
  // Create the switcher button
  const switcher = document.createElement('div');
  switcher.className = 'version-switcher';
  switcher.innerHTML = `
    <button class="reimagine-btn" title="${isModern ? 'Switch to Classic' : 'Reimagine ✨'}">
      ${isModern ? '⏪ Classic' : '✨ Reimagine'}
    </button>
  `;
  document.body.appendChild(switcher);
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .version-switcher {
      position: fixed;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      z-index: 10000;
    }
    
    .reimagine-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px 20px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      border-radius: 0 25px 25px 0;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      transition: all 0.3s ease;
      font-family: 'Poppins', sans-serif;
      writing-mode: horizontal-tb;
    }
    
    .reimagine-btn:hover {
      padding-left: 25px;
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
      transform: scale(1.05);
    }
    
    @media (max-width: 768px) {
      .version-switcher {
        top: auto;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
      }
      
      .reimagine-btn {
        border-radius: 25px;
        padding: 10px 20px;
        font-size: 12px;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Handle click
  const btn = switcher.querySelector('.reimagine-btn');
  btn.addEventListener('click', () => {
    // Get current page name
    const currentPage = window.location.pathname.split('/').pop() || 'main.html';
    
    let newUrl;
    if (isModern) {
      // Switch to classic - go to Index root
      newUrl = '../' + currentPage;
      localStorage.setItem('websiteVersion', 'classic');
    } else {
      // Switch to modern - go into modern folder
      newUrl = 'modern/' + currentPage;
      localStorage.setItem('websiteVersion', 'modern');
    }
    
    // Add transition effect
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: #000;
      z-index: 100000;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(overlay);
    
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      setTimeout(() => {
        window.location.href = newUrl;
      }, 300);
    });
  });
})();
