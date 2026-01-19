// Advanced Code Protection System - Educational purposes
(function() {
    'use strict';
    
    // Disable right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showWarning();
        return false;
    });
    
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.keyCode === 123) {
            e.preventDefault();
            showWarning();
            return false;
        }
        
        // Ctrl+Shift+I (Developer Tools)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            showWarning();
            return false;
        }
        
        // Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            showWarning();
            return false;
        }
        
        // Ctrl+U (View Source)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            showWarning();
            return false;
        }
        
        // Ctrl+S (Save Page)
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            showWarning();
            return false;
        }
        
        // Ctrl+A (Select All)
        if (e.ctrlKey && e.keyCode === 65) {
            e.preventDefault();
            showWarning();
            return false;
        }
        
        // Ctrl+P (Print)
        if (e.ctrlKey && e.keyCode === 80) {
            e.preventDefault();
            showWarning();
            return false;
        }
        
        // Ctrl+C (Copy)
        if (e.ctrlKey && e.keyCode === 67) {
            e.preventDefault();
            showWarning();
            return false;
        }
        
        // Ctrl+V (Paste)
        if (e.ctrlKey && e.keyCode === 86) {
            e.preventDefault();
            showWarning();
            return false;
        }
        
        // Ctrl+X (Cut)
        if (e.ctrlKey && e.keyCode === 88) {
            e.preventDefault();
            showWarning();
            return false;
        }
    });
    
    // Disable text selection
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Disable drag and drop
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Disable image saving
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });
    
    // Detect developer tools
    let devtools = {
        open: false,
        orientation: null
    };
    
    const threshold = 160;
    
    setInterval(function() {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                handleDevToolsOpen();
            }
        } else {
            devtools.open = false;
        }
    }, 500);
    
    // Advanced DevTools detection
    let element = new Image();
    Object.defineProperty(element, 'id', {
        get: function() {
            handleDevToolsOpen();
            return 'devtools-detector';
        }
    });
    
    // Console detection
    let consoleDetected = false;
    Object.defineProperty(window, 'console', {
        get: function() {
            if (!consoleDetected) {
                consoleDetected = true;
                handleDevToolsOpen();
            }
            return console;
        }
    });
    
    // Debugger detection
    setInterval(function() {
        const start = performance.now();
        debugger;
        const end = performance.now();
        if (end - start > 100) {
            handleDevToolsOpen();
        }
    }, 1000);
    
    // Handle DevTools detection
    function handleDevToolsOpen() {
        document.body.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #000;
                color: #ff0000;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-family: Arial, sans-serif;
                font-size: 24px;
                z-index: 999999;
            ">
                <h1>⚠️ ACCESS DENIED ⚠️</h1>
                <p>Developer tools detected!</p>
                <p>This action has been logged.</p>
                <p style="font-size: 16px; margin-top: 20px;">Close developer tools to continue.</p>
            </div>
        `;
        
        // Log the attempt
        if (typeof gtag !== 'undefined') {
            gtag('event', 'security_violation', {
                'event_category': 'Security',
                'event_label': 'DevTools Detected'
            });
        }
        
        // Redirect after delay
        setTimeout(function() {
            window.location.href = 'about:blank';
        }, 3000);
    }
    
    // Show warning message
    function showWarning() {
        const warning = document.createElement('div');
        warning.innerHTML = '⚠️ Action not allowed!';
        warning.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: bold;
            z-index: 999999;
            font-family: Arial, sans-serif;
        `;
        
        document.body.appendChild(warning);
        
        setTimeout(function() {
            if (warning.parentNode) {
                warning.parentNode.removeChild(warning);
            }
        }, 2000);
        
        // Log the attempt
        if (typeof gtag !== 'undefined') {
            gtag('event', 'security_violation', {
                'event_category': 'Security',
                'event_label': 'Blocked Action'
            });
        }
    }
    
    // Disable printing
    window.addEventListener('beforeprint', function(e) {
        e.preventDefault();
        showWarning();
        return false;
    });
    
    // Disable screenshot tools (limited effectiveness)
    document.addEventListener('keyup', function(e) {
        if (e.key === 'PrintScreen') {
            showWarning();
        }
    });
    
    // Blur content when window loses focus (screenshot protection)
    window.addEventListener('blur', function() {
        document.body.style.filter = 'blur(5px)';
    });
    
    window.addEventListener('focus', function() {
        document.body.style.filter = 'none';
    });
    
    // Disable iframe embedding
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }
    
    // Clear console periodically
    setInterval(function() {
        if (typeof console !== 'undefined' && console.clear) {
            console.clear();
        }
    }, 1000);
    
    // Obfuscate source code in memory
    setTimeout(function() {
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            if (scripts[i].src === '') {
                scripts[i].innerHTML = '';
            }
        }
    }, 1000);
    
    // Anti-debugging measures
    setInterval(function() {
        const before = new Date();
        debugger;
        const after = new Date();
        if (after - before > 100) {
            handleDevToolsOpen();
        }
    }, 100);
    
    // Detect automation tools
    if (navigator.webdriver) {
        handleDevToolsOpen();
    }
    
    // Detect headless browsers
    if (navigator.plugins.length === 0 || 
        navigator.languages.length === 0 || 
        !navigator.cookieEnabled) {
        handleDevToolsOpen();
    }
    
    // Console warning
    console.log('%cSTOP!', 'color: red; font-size: 50px; font-weight: bold;');
    console.log('%cThis is a browser feature intended for developers. Code inspection is not allowed on this website.', 'color: red; font-size: 16px;');
    console.log('%cIf someone told you to copy-paste something here, it is a scam and will give them access to your account.', 'color: red; font-size: 16px;');
    
    // Override console methods
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.log = function() {
        showWarning();
        return originalLog.apply(console, arguments);
    };
    
    console.error = function() {
        showWarning();
        return originalError.apply(console, arguments);
    };
    
    console.warn = function() {
        showWarning();
        return originalWarn.apply(console, arguments);
    };
    
    // Protect against common inspection methods
    Object.defineProperty(document, 'innerHTML', {
        get: function() {
            showWarning();
            return '';
        }
    });
    
    // Admin dashboard access via key combination
    let keySequence = [];
    const adminSequence = ['a', 'm'];
    let keyTimeout;
    
    document.addEventListener('keydown', function(e) {
        // Clear timeout if exists
        if (keyTimeout) {
            clearTimeout(keyTimeout);
        }
        
        keySequence.push(e.key.toLowerCase());
        
        // Keep only last 2 keys
        if (keySequence.length > adminSequence.length) {
            keySequence.shift();
        }
        
        // Check if sequence matches
        if (keySequence.join('') === adminSequence.join('')) {
            // Open admin dashboard in new tab
            const adminWindow = window.open('visitor-dashboard.html', '_blank', 'width=1400,height=900');
            keySequence = [];
            
            // Log admin access
            if (typeof gtag !== 'undefined') {
                gtag('event', 'admin_access', {
                    'event_category': 'Security',
                    'event_label': 'Dashboard Opened'
                });
            }
        }
        
        // Reset sequence after 2 seconds of inactivity
        keyTimeout = setTimeout(function() {
            keySequence = [];
        }, 2000);
    });
    
    // Additional protection: Disable view-source protocol
    if (window.location.protocol === 'view-source:') {
        window.location.href = 'about:blank';
    }
    
})();