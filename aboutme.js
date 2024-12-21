// Get the theme switcher button and the body element
const themeSwitcher = document.getElementById('theme-switcher');
const body = document.body;

// Function to toggle between dark and light theme
themeSwitcher.addEventListener('click', () => {
  // Toggle the class on the body to switch themes
  if (body.classList.contains('dark-theme')) {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
    themeSwitcher.textContent = 'Switch to Dark Theme'; // Change button text to reflect the light theme
  } else {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
    themeSwitcher.textContent = 'Switch to Light Theme'; // Change button text to reflect the dark theme
  }
});
