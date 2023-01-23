import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import PixabayAPI from './js/pixabayAPI';


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
async function getPictures() {
	return response = await pixabayApi.getPictures();
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
	// remove load-more btn if searched for empty string
	hideLoadMore();
	
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
        const galleryData = await getPictures();

        if (galleryData) {
            const galleryMarkup = makeGalleryMarkup(galleryData);
            refs.gallery.insertAdjacentHTML('beforeend', galleryMarkup);
            // refresh lightbox after editing DOM:
            // w/o it lightbox not working!
            gallery.refresh();

            showLoadMore();
		// hide load more btn if no further results
        } else {
			hideLoadMore();
		}
    }
}


function showLoadMore() {
	if (refs.load.classList.contains("visually-hidden")) {
        refs.load.classList.toggle("visually-hidden");
	}
}


function hideLoadMore() {
	if (!refs.load.classList.contains("visually-hidden")) {
        refs.load.classList.toggle("visually-hidden");
	}
}
