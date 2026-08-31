customElements.whenDefined('ninja-keys').then(() => {
  document.querySelector('ninja-keys').data = [
    { id: 'home', title: 'Home', handler: () => location.href = '/' },
    { id: 'github', title: 'GitHub', handler: () => window.open('https://github.com/AtharvM02222') },
  ]
})
