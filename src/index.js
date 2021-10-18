
import Notiflix from "notiflix";
import axios from "axios";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form= document.querySelector('.search-form');
const searchInput = document.querySelector('input[name="searchQuery"]');
const btnLoadmore = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery')
let searchInputValue = searchInput.value;
console.log(searchInputValue);
const lightbox = () => new SimpleLightbox('.gallery a', {});

const API_KEY = '23900932-f3bc4ef69f70c3dfef8404d8c';
let perPage = 40;
let page = 0;
btnLoadmore.style.display = "none"

const fetchImages = async (searching, page) => {
    try {
      const response = await axios.get(
        `https://pixabay.com/api/?key=${API_KEY}&q=${searching}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`,
      );

      console.log(response);

      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const searchImages = async evt =>{
      evt.preventDefault();
      gallery.innerHTML = '';
      page = 1;
      searchInputValue =searchInput.value;

      fetchImages(searchInputValue, page)
    .then(searchInputValue => {
      let searchedImages = searchInputValue.hits.length;
      console.log(searchedImages);

      let totalPages = Math.ceil(searchInputValue.totalHits / perPage);
      console.log(totalPages);

      if (searchedImages > 0) {
        Notiflix.Notify.success(`Hooray! We found ${searchInputValue.totalHits} images.`);
        renderGallery(searchInputValue);
        lightbox();
        btnLoadmore.style.display = 'block';
        if (page < totalPages) {
          btnLoadmore.style.display = 'block';
        } else {
          btnLoadmore.style.display = 'none';
          Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        }
      } else {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
        gallery.innerHTML = '';
        btnLoadmore.style.display = 'none';
      }
    })
  
  .catch(error => console.log(error));
};
form.addEventListener('submit', searchImages);

const renderGallery = searchInputValue => {
    const markup = searchInputValue.hits
      .map(hit => {
        return `<div class="photo-card">
        <a class="gallery__item" href="${hit.largeImageURL}"> <img class="gallery__image" src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" /></a>
        <div class="info">
          <p class="info-item">
            <p class="info-item__description"><b >Likes</b> ${hit.likes}</p>
          </p>
          <p class="info-item">
            <p class="info-item__description"><b>Views</b> ${hit.views}</p>
          </p>
          <p class="info-item">
            <p class="info-item__description"><b>Comments</b> ${hit.comments}</p>
          </p>
          <p class="info-item">
            <p class="info-item__description"><b>Downloads</b> ${hit.downloads}</p>
          </p>
        </div>
      </div>`;
      })
      .join('');
    gallery.insertAdjacentHTML('beforeend', markup);
  };
  
  const loadMore = () => {
    searchInputValue = searchInput.value;
    page += 1;
    fetchImages(searchInputValue, page).then(searchInputValue => {
      let totalPages = Math.ceil(searchInputValue.totalHits / perPage);
      renderGallery(searchInputValue);
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();
  
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
      lightbox().refresh();
  
      if (page >= totalPages) {
        loadMoreBtn.style.display = 'none';
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      }
    });
  };
  
  btnLoadmore.addEventListener('click', loadMore);