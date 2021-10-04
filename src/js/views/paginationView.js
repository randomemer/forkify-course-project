import View from "./View.js";
import icons from "url:../../img/icons.svg";

class PaginationView extends View {
	_parentElement = document.querySelector(".pagination");

	addHandlerClick(handler) {
		this._parentElement.addEventListener("click", function (event) {
			const btn = event.target.closest(".btn--inline");

			if (!btn) {
				return;
			}

			const goToPage = +btn.dataset.goto;
			// console.log(goToPage);
			handler(goToPage);
		});
	}

	_generateMarkup() {
		// console.log(this._data);
		const numPages = Math.ceil(
			this._data.results.length / this._data.resultsPerPage
		);
		// console.log(numPages);
		// Page 1, and there are other pages
		if (this._data.page === 1 && numPages > 1) {
			// console.log("page 1 and others");
			return `
            <button data-goto="${
				this._data.page + 1
			}" class="btn--inline pagination__btn--next">
                <span>Page ${this._data.page + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
            `;
		}
		// Last page
		if (this._data.page === numPages && numPages > 1) {
			// console.log("last page");
			return `
            <button data-goto="${
				this._data.page - 1
			}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${this._data.page - 1}</span>
            </button>
            `;
		}
		// Other page
		if (this._data.page < numPages) {
			// console.log("middle page");
			return `
            <button data-goto="${
				this._data.page - 1
			}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${this._data.page - 1}</span>
            </button>

            <button data-goto="${
				this._data.page + 1
			}" class="btn--inline pagination__btn--next">
                <span>Page ${this._data.page + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
            `;
		}
		// Page 1, and there are NO other pages
		return "";
	}
}

export default new PaginationView();
