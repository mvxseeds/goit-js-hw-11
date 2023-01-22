import axios from 'axios';

export default class PixabayAPI {
	constructor() {
		this.userQuery = '';
		this.page = 1;
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
					per_page: 40,
				}
			  });
	
			if (response.data.total === 0) {
				throw Error;
			} else {
				this.incrementPage();
				return response.data.hits;
			}
		} catch (error) {
			Notify.failure("Sorry, there are no images matching your search query. Please try again.");
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