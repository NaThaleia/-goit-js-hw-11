import './sass/main.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImagesAPIService from './javascript/options';
import LoadMoreBtn from './javascript/button';
import Markup from './javascript/render';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

const imagesAPIService = new ImagesAPIService();
const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more' });
const renderMarkup = new Markup({ selector: refs.gallery });

refs.form.addEventListener('submit', onFormSubmit);
loadMoreBtn.button.addEventListener('click', onloadMoreBtnClick);

async function onFormSubmit(e) {
  e.preventDefault();
  renderMarkup.reset();
  imagesAPIService.query = e.currentTarget.searchQuery.value.trim();

  if (imagesAPIService.query === '') {
    loadMoreBtn.hideBtn();
    Notify.info('Your query is empty. Try again!');
    return;
  }

  imagesAPIService.defaultPage();

  try {
    loadMoreBtn.showBtn();
    await initFetchImages();
  } catch (error) {
    loadMoreBtn.hideBtn();
    Notify.failure(error.message);
  }

  refs.form.reset();
}

async function onloadMoreBtnClick() {
  try {
    await initFetchImages();
  } catch {
    Notify.failure(error.message);
  }
  pageScroll();
  renderMarkup.lightbox.refresh();
}

async function initFetchImages() {
  try {
    loadMoreBtn.disable();
    const images = await imagesAPIService.fetchImages();
    renderMarkup.items = images;
    renderMarkup.render();
  } catch {
    Notify.failure(error.message);
  }

  if (imagesAPIService.endOfHits) {
    loadMoreBtn.hideBtn();
    return;
  }
  loadMoreBtn.enable();
}

function pageScroll() {
  const { height: cardHeight } = refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
