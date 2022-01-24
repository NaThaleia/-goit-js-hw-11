import './sass/main.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImagesAPIService from './javascript/options';
import LoadMoreBtn from './javascript/button';
import Markup from './javascript/render';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

const getOptions = new ImagesAPIService();
const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more' });
const renderMarkup = new Markup({ selector: refs.gallery });

refs.form.addEventListener('submit', onFormSubmit);
loadMoreBtn.button.addEventListener('click', onloadMoreBtnClick);

async function onFormSubmit(e) {
  e.preventDefault();
  renderMarkup.reset();
  getOptions.query = e.currentTarget.searchQuery.value.trim();

  if (getOptions.query === '') {
    loadMoreBtn.hideBtn();
    Notify.info('Please fill the form!', 200);
    return;
  }

  getOptions.defaultPage();

  try {
    loadMoreBtn.showBtn();
    await initFetchImages();
  } catch (error) {
    loadMoreBtn.hideBtn();
    Notify.failure('Sorry, there are no images matching your search query. Please try again.', 200);
  }

  refs.form.reset();
}

async function onloadMoreBtnClick() {
  try {
    await initFetchImages();
  } catch {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.', 200);
  }
  pageScroll();
  renderMarkup.lightbox.refresh();
}

async function initFetchImages() {
  try {
    loadMoreBtn.disable();
    const images = await getOptions.fetchImages();
    renderMarkup.items = images;
    renderMarkup.render();
  } catch {
    Notify.failure(error.message);
  }

  if (getOptions.endOfHits) {
    loadMoreBtn.hideBtn();
    return;
  }
  loadMoreBtn.enable();
}
// Плавная прокрутка страницы после запроса и отрисовки каждой следующей группы изображений.

function pageScroll() {
  const { height: cardHeight } = refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
