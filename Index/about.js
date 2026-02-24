
// ─────────────── Time-alive counter ───────────────
const birthDate = new Date(2011, 5, 8, 21, 8, 0); // 8 June 2011, 9:08 PM

function updateLifeCounter() {
  const now = new Date();
  const diff = now - birthDate;
  
  if (diff < 0) {
    // If somehow the date is in the future, show zeros
    document.getElementById('lifeYears').textContent = '00';
    document.getElementById('lifeDays').textContent = '00';
    document.getElementById('lifeHours').textContent = '00';
    document.getElementById('lifeMinutes').textContent = '00';
    document.getElementById('lifeSeconds').textContent = '00';
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

  document.getElementById('lifeYears').textContent = years.toString().padStart(2, '0');
  document.getElementById('lifeDays').textContent = days.toString().padStart(2, '0');
  document.getElementById('lifeHours').textContent = hours.toString().padStart(2, '0');
  document.getElementById('lifeMinutes').textContent = minutes.toString().padStart(2, '0');
  document.getElementById('lifeSeconds').textContent = seconds.toString().padStart(2, '0');
}

updateLifeCounter();
setInterval(updateLifeCounter, 1000);
