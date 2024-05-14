class BooksList {
    constructor() {
        this.getElements();
        this.initData();
        this.initActions();
    }

    initData() {
        this.data = dataSource.books;
        this.favoriteBooks = [];
        this.filters = [];
        this.render();
    }

    getElements() {
        this.booksList = document.querySelector('.books-list');
        this.filterForm = document.querySelector('.filters');
        this.templateSource = document.getElementById('template-book').innerHTML;
        this.template = Handlebars.compile(this.templateSource);
    }

    initActions() {
        this.booksList.addEventListener('dblclick', event => {
            event.preventDefault();
            let target = event.target;

            while (target !== null && !target.classList.contains('book__image')) {
                target = target.parentElement;
            }

            if (target !== null && target.offsetParent !== null) {
                const bookId = target.getAttribute('data-id');

                if (!this.favoriteBooks.includes(bookId)) {
                    this.favoriteBooks.push(bookId);
                    target.classList.add('favorite');
                } else {
                    this.favoriteBooks = this.favoriteBooks.filter(id => id !== bookId);
                    target.classList.remove('favorite');
                }
            }
        });

        this.filterForm.addEventListener('click', event => {
            if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox' && event.target.name === 'filter') {
                const value = event.target.value;
                const isChecked = event.target.checked;

                if (isChecked) {
                    this.filters.push(value);
                } else {
                    const index = this.filters.indexOf(value);
                    if (index !== -1) {
                        this.filters.splice(index, 1);
                    }
                }
                this.filterBooks();
            }
        });
    }

    filterBooks() {
        this.data.forEach(book => {
            const bookElement = document.querySelector(`.book__image[data-id="${book.id}"]`);
            const shouldBeHidden = this.filters.some(filter => book.details[filter]);
            if (shouldBeHidden) {
                bookElement.classList.add('hidden');
            } else {
                bookElement.classList.remove('hidden');
            }
        });
    }

    determineRatingBgc(rating) {
        if (rating < 6) {
            return 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)';
        } else if (rating <= 8) {
            return 'linear-gradient(to bottom, #b4df5b 0%, #b4df5b 100%)';
        } else if (rating <= 9) {
            return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
        } else {
            return 'linear-gradient(to bottom, #ff0084 0%, #ff0084 100%)';
        }
    }

    render() {
        this.data.forEach(book => this.renderBook(book));
    }

    renderBook(book) {
        const ratingBgc = this.determineRatingBgc(book.rating);
        const ratingWidth = book.rating * 10;
        const html = this.template({ ...book, ratingWidth, ratingBgc });
        const bookElement = utils.createDOMFromHTML(html);
        this.booksList.appendChild(bookElement);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const app = new BooksList();
});