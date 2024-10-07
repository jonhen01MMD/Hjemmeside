// js/contactForm.js



// Ikke sat op så kun et Test/Simulation
export function initContactForm() {
  class ContactForm {
    constructor() {
      this.form = document.getElementById('contactForm');
      this.form.addEventListener('submit', event => this.handleSubmit(event));
    }

    async handleSubmit(event) {
      event.preventDefault();

      try {
        // Simulerer en anmodning
        await this.sendForm();
        alert('Besked sendt succesfuldt!');
        this.form.reset();
      } catch (error) {
        alert('Der opstod en fejl. Prøv igen senere.');
      }
    }

    sendForm() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
    }
  }

  new ContactForm();
}
