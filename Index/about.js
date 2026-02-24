
// ─────────────── Time-alive counter ───────────────
const birthDate = new Date(2011, 5, 8, 21, 8, 0); // 8 June 2011, 9:08 PM

function updateLifeCounter() {
  const els = {
    years: document.getElementById('lifeYears'),
    days: document.getElementById('lifeDays'),
    hours: document.getElementById('lifeHours'),
    minutes: document.getElementById('lifeMinutes'),
    seconds: document.getElementById('lifeSeconds')
  };

  if (!els.years) {
    console.log('Life counter elements not found');
    return;
  }

  const now = new Date();
  const diff = now - birthDate;
  
  if (diff < 0) {
    // If somehow the date is in the future, show zeros
    Object.values(els).forEach(el => {
      if (el) {
        el.style.setProperty('--value', 0);
        el.textContent = '0';
      }
    });
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  
  const years = Math.floor(totalSeconds / (365.25 * 24 * 60 * 60));
  const remainingAfterYears = totalSeconds - Math.floor(years * 365.25 * 24 * 60 * 60);
  
  const days = Math.floor(remainingAfterYears / (24 * 60 * 60));
  const remainingAfterDays = remainingAfterYears - (days * 24 * 60 * 60);
  
  const hours = Math.floor(remainingAfterDays / (60 * 60));
  const remainingAfterHours = remainingAfterDays - (hours * 60 * 60);
  
  const minutes = Math.floor(remainingAfterHours / 60);
  const seconds = remainingAfterHours % 60;

  // Update DaisyUI countdown - set both CSS variable and text content
  if (els.years) {
    els.years.style.setProperty('--value', years);
    els.years.textContent = years;
  }
  if (els.days) {
    els.days.style.setProperty('--value', days);
    els.days.textContent = days;
  }
  if (els.hours) {
    els.hours.style.setProperty('--value', hours);
    els.hours.textContent = hours;
  }
  if (els.minutes) {
    els.minutes.style.setProperty('--value', minutes);
    els.minutes.textContent = minutes;
  }
  if (els.seconds) {
    els.seconds.style.setProperty('--value', seconds);
    els.seconds.textContent = seconds;
  }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    updateLifeCounter();
    setInterval(updateLifeCounter, 1000);
  });
} else {
  updateLifeCounter();
  setInterval(updateLifeCounter, 1000);
}
