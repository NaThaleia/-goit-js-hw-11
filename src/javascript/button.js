export default class LoadBtn {
  constructor({ selector }) {
    this.button = document.querySelector(selector);
    this.label = this.button.textContent;
  }

  showBtn() {
    this.button.classList.remove('is-hidden');
  }

  hideBtn() {
    this.button.classList.add('is-hidden');
  }

  enable() {
    this.button.disabled = false;
    this.button.textContent = 'Load more';
  }

  disable() {
    this.button.disabled = true;
    this.button.textContent = 'Loading...';
  }
}
