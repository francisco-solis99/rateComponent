class RateComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get styles() {
    return `
    :host {
    }

    .rate__modal {
       min-width: 350px;
       max-width: 650px;
       height: 65vh;
       padding: 0;
       box-shadow: 4px 4px 8px rgba(0,0,0,0.45);
       border-radius: 12px;
       border: 0;
       overflow: hidden;
    }

    .rate__modal::backdrop {
      background: rgba(0,0,0,.45);
    }

    .rate__modal-wrapper {
       width: 100%;
       height: 100%;
       display: grid;
       grid-template-rows: 20% 60% 20%;
    }

    .rate__form {
       display: flex;
       flex-direction: column;
       align-items: center;
       justify-content: space-evenly;
       padding: 15px 20px;
       background-color: var(--color-secundary-white);
    }

    .rate__title {
       display: flex;
       align-items: center;
       justify-content: center;
       margin: 0;
       background-color: var(--color-primary);
    }

    .rate__input[type="radio"] {
       display: none
    }

    .rate__wrapper {
      margin-top: 10px;
    }

    .star__wrapper {
       display: inline-block;
       filter: drop-shadow(-1px 3px 3px rgba(0, 0, 0, 0.5));
      // filter: drop-shadow(-1px 3px 3px rgba(255, 206, 133, 0.5));
       cursor: pointer;
       margin: 0 5px;
    }

    .star {
       width: 40px;
       height: 40px;
       background-color: var(--color-secundary-yellow);
       background-color: var(--color-secundary-mold);
       clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
       animation: jump infinite 450ms alternate;
    }

    @keyframes jump {
      0% {
        transform: translateY(0);
      }

      100% {
        transform: translateY(-3px);
      }
    }

    .rate__input-submit {
       width: 100%;
       padding: 10px;
       font-size: 1rem;
       color: var(--color-primary);
       border: 0;
       border-radius: 8px;
       background: linear-gradient(90deg, var(--color-secundary-purple), var(--color-secundary-blue));
       cursor: pointer;
    }

    .rate__btn-close {
       padding: 0;
       font-size: 1rem;
       cursor: pointer;
       border: 0;
       background-color: var(--color-primary);
       color: var(--color-secundary-purple);
    }

    input[type="radio"]:checked ~ div {
      background-color: var(--color-secundary-yellow);
      transition: all ease-in 250ms;
    }

    .isChecked {
      background-color: var(--color-secundary-yellow);
    }

    .rate__text-area {
      width: 90%;
      font-size: 1rem;
      margin: 20px 0;
      border: 0;
      border-radius: 8px;
      padding: 5px;
      display: none;
      transition: all ease 300ms;
    }

    .rate__text-area.isActive {
      display: block;
    }


    .container {
      display: grid;
      place-content:center;
      min-height: 100vh;
    }

    .btn__modal-open {
      font-size: 1.4rem;
      min-width: 180px;
      max-width: 300px;
      min-height: 64px;
      padding: 10px;
      background-color: var(--color-secundary-purple);
      color: var(--color-secundary-white);
      border: 0;
      box-shadow: 4px 4px 0 rgba(0,0,0,0.5);
      cursor: pointer;
      border-radius: 8px;
      transition: transform 200ms, box-shadow 200ms;
    }

    .btn__modal-open:active {
      transform: translate(4px, 4px);
      box-shadow: 0 0 0 rgba(0,0,0,0.5);
    }

   `;
  }

  closeModal() {
    this.dialog.close();
    this.resetModal();
  }

  resetModal() {
    this.rateForm.reset();
    this.stars.forEach(star => {
      star.classList.remove('isChecked');
      star.style.animation = 'jump infinite 450ms alternate';
    });
    this.rateTextArea.classList.remove('isActive');
  }

  handlerSubmit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    console.log(data);
  }

  openModal() {
    this.dialog.showModal();
  }

  rateExperince(e) {
    if (!(e.target.classList.contains('rate__input'))) return;

    if (this.rate === e.target.value && this.rateTextArea.classList.contains('isActive')) {
      this.resetModal();
      return;
    }

    this.rate = e.target.value;
    this.stars.forEach((star, index) => {
      star.style.animation = 'none';
      if (index < this.rate - 1) {
        star.classList.add('isChecked');
        return;
      }
      star.classList.remove('isChecked');
    });
    this.rateTextArea.classList.add('isActive');
  }

  turnOn(e) {
    if (!this.rateTextArea.classList.contains('isActive')) {
      const possibleRate = e.target.previousElementSibling.value;
      [...this.stars].filter((star, index) => index < possibleRate).map(star => star.classList.add('isChecked'));
    }
  }

  turnOff(e) {
    if (!this.rateTextArea.classList.contains('isActive')) {
      this.stars.forEach(star => star.classList.remove('isChecked'));
    }
  }

  connectedCallback() {
    console.log('connected callback');
    this.render();
    // dialog
    this.dialog = this.shadowRoot.querySelector('.rate__modal');
    this.closeBtn = this.shadowRoot.querySelector('.rate__btn-close');
    // form
    this.rateForm = this.shadowRoot.querySelector('.rate__form');
    // text area
    this.rateTextArea = this.shadowRoot.querySelector('.rate__text-area');

    // rate wrapper
    this.rateWrapper = this.shadowRoot.querySelector('.rate__wrapper');

    // stars
    this.stars = this.shadowRoot.querySelectorAll('.star');

    // btn for open the modal
    this.btnOpen = this.shadowRoot.querySelector('.btn__modal-open');

    this.rate = null;

    // add listeners
    this.addListeners();
  }

  addListeners() {
    // click for  close teh modal
    this.closeBtn.addEventListener('click', () => this.closeModal());
    // submit
    this.rateForm.addEventListener('submit', (e) => this.handlerSubmit(e));
    // click for starts
    this.rateWrapper.addEventListener('click', (e) => this.rateExperince(e));

    // mouse enter and mouse leave fro the stars
    this.stars.forEach(star => {
      star.addEventListener('mouseenter', (e) => this.turnOn(e));
      star.addEventListener('mouseleave', (e) => this.turnOff(e));
    });
    // click for open the modal
    this.btnOpen.addEventListener('click', () => this.openModal());
  }

  render() {
    this.shadowRoot.innerHTML = `
    <style>${RateComponent.styles}</style>
   <div class="container">
      <button class="btn__modal-open">Rate App</button>
      <dialog class="rate__modal">

        <div class="rate__modal-wrapper">
          <h2 class="rate__title">Your opinion matters to us</h2>
          <form action="" class="rate__form">
            <span>${this.getAttribute('message')}</span>

            <div class="rate__wrapper">
              <label for="rate-1" class="star__wrapper">
                <input type="radio" id="rate-1" value="1" class="rate__input" name="rating">
                <div class="star"></div>
              </label>

              <label for="rate-2" class="star__wrapper">
                <input type="radio" id="rate-2" value="2" class="rate__input" name="rating">
                <div class="star"></div>
              </label>

              <label for="rate-3" class="star__wrapper">
                <input type="radio" id="rate-3" value="3" class="rate__input" name="rating">
                <div class="star"></div>
              </label>

              <label for="rate-4" class="star__wrapper">
                <input type="radio" id="rate-4" value="4" class="rate__input" name="rating">
                <div class="star"></div>
              </label>

              <label for="rate-5" class="star__wrapper">
                <input type="radio" id="rate-5" value="5" class="rate__input" name="rating">
                <div class="star"></div>
              </label>
              </div>
            <textarea name="comments" id="comments" cols="30" rows="10" class="rate__text-area" placeholder="Leave a message, if you want"></textarea>
            <input type="submit" class="rate__input-submit" value="Rate now"/>
          </form>
          <button class="rate__btn-close">Maybe Later</button>
        </div>

      </dialog>
   </div>`;
  }
}

customElements.define('rate-component', RateComponent);
