import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export default class PixabayAPI {
	constructor() {
		this.userQuery = '';
		this.page = 1;
		this.perPage = 40;
	}
	
	async getPictures() {
        const BASE_URL = "https://pixabay.com";

		try {
			const response = await axios.get(`${BASE_URL}/api/`, {
				params: { 
					key: "33013185-bcf0c4849b088c5c00f112ab1",
					q: `${this.userQuery}`,
					image_type: "photo",
					orientation: "horizontal",
					safesearch: "true",
					page: `${this.page}`,
					per_page: `${this.perPage}`,
				}
			  });
	
			if (response.data.total === 0) {
				throw "ErrorNoResult";
			} else if (response.data.totalHits < this.page * this.perPage) {
				throw "ErrorOutOfRange";
			} else {
				this.incrementPage();
				return response.data.hits;
			}
		} catch (error) {
			if ("ErrorNoResult") {
				Notify.failure("Sorry, there are no images matching your search query. Please try again.");
			} else if ("ErrorOutOfRange") {
				Notify.failure("We're sorry, but you've reached the end of search results.");
			}
		}
	}
	
	get query() {
		return this.userQuery;
	}
	
	set query(newQuery) {
		this.userQuery = newQuery;
	}

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }
}