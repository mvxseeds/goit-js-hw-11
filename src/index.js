import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import PixabayAPI from './js/pixabayAPI';
import { Notify } from 'notiflix/build/notiflix-notify-aio';


// class instance
const pixabayApi = new PixabayAPI();

const refs = {
    input: document.querySelector('.search-form input'),
    search: document.querySelector('.search-form button'),
    gallery: document.querySelector('.gallery'),
    load: document.querySelector('.load-more'),
}

refs.search.addEventListener('click', onSearchClick);
refs.load.addEventListener('click', onLoadMore);


// Pass query and handle response
async function queryData() {
    try {
        const response = await pixabayApi.getPictures();

        if (response.total === 0) {
            throw Error;
        } else {
            return response;
        }
    } catch (error) {
        Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
}


// Handle search button click
async function onSearchClick(e) {
    // prevent reload on form submit
    e.preventDefault();

    const query = refs.input.value.trim();
    // set query value
    pixabayApi.query = query;
    // reset previous or possible stored values
    pixabayApi.resetPage();
    // reset gallery content
    refs.gallery.innerHTML = "";
    refs.load.classList.toggle("visually-hidden");

    appendGalleryContent();
}

async function onLoadMore() {
    appendGalleryContent();
}


// Gallery init & rendering function
let gallery = new SimpleLightbox('.gallery a', { 
    captionDelay: 250,
    captionsData: "alt",
});

function makeGalleryMarkup(data) {
    const markup = data.map(item => `
        <a class="gallery__item" href="${item.largeImageURL}" >
            <div class="photo-card">
                <img class="gallery__image" src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
                <div class="info">
                    <p class="info-item">
                        <b>Likes</b>
                        <span>${item.likes}</span>
                    </p>
                    <p class="info-item">
                        <b>Views</b>
                        <span>${item.views}</span>
                    </p>
                    <p class="info-item">
                        <b>Comments</b>
                        <span>${item.comments}</span>
                    </p>
                    <p class="info-item">
                        <b>Downloads</b>
                        <span>${item.downloads}</span>
                    </p>
                </div>
            </div>
        </a>
      `).join('');

    return markup;
}


async function appendGalleryContent() {
    const query = pixabayApi.query;
    
    if (query) {
        const galleryData = await queryData();

        if (galleryData) {
            const galleryMarkup = makeGalleryMarkup(galleryData);
            refs.gallery.insertAdjacentHTML('beforeend', galleryMarkup);
            // refresh lightbox after editing DOM:
            // w/o it lightbox not working!
            gallery.refresh();
            
            if (refs.load.classList.contains("visually-hidden")) {
                refs.load.classList.toggle("visually-hidden");
            }
        }
    }
}
