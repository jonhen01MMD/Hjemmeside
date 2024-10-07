// js/navbar.js



export function initNavBar() {
  class NavBar {
    constructor() {
      this.hamburger = document.querySelector('.hamburger');
      this.navMenu = document.querySelector('.nav-menu');

      this.addEventListeners();
    }

    addEventListeners() {
      this.hamburger.addEventListener('click', () => this.toggleMenu());
      this.navMenu.addEventListener('click', () => this.closeMenu());
    }

    toggleMenu() {
      this.navMenu.classList.toggle('active');
    }

    closeMenu() {
      this.navMenu.classList.remove('active');
    }
  }

  new NavBar();
}
