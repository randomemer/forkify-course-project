import icons from "url:../../img/icons.svg";

export default class View {
	_data;

	/**
	 * Render the received object to the DOM
	 * @param {Object | Object[]} data The data to be rendered
	 * @param {boolean} [render = true] If false, create markup string instead of rendering to the DOM
	 * @returns {undefined | string} A markup string is returned if render is false
	 * @this {Object} View instance
	 */
	render(data, render = true) {
		if (!data || (Array.isArray(data) && data.length === 0)) {
			this.renderError();
			return;
		}

		this._data = data;
		const markup = this._generateMarkup();

		if (!render) {
			return markup;
		}
		this._clear();
		this._parentElement.insertAdjacentHTML("afterbegin", markup);
	}

	update(data) {
		this._data = data;
		const newMarkup = this._generateMarkup();

		const newDOM = document
			.createRange()
			.createContextualFragment(newMarkup);

		const newElements = Array.from(newDOM.querySelectorAll("*"));
		const curElements = Array.from(
			this._parentElement.querySelectorAll("*")
		);

		newElements.forEach((element, i) => {
			//Update changed text
			if (
				!element.isEqualNode(curElements[i]) &&
				element.firstChild?.nodeValue.trim() !== ""
			) {
				curElements[i].textContent = element.textContent;
			}
			//Update changed attributes
			if (!element.isEqualNode(curElements[i])) {
				Array.from(element.attributes).forEach((attr) => {
					curElements[i].setAttribute(attr.name, attr.value);
				});
			}
		});
	}

	_clear() {
		this._parentElement.innerHTML = "";
	}

	renderSpinner() {
		const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
      `;
		this._clear();
		this._parentElement.insertAdjacentHTML("afterbegin", markup);
	}

	renderError(message = this._errorMessage) {
		const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;
		this._clear();
		this._parentElement.insertAdjacentHTML("afterbegin", markup);
	}

	renderMessage(message = this._message) {
		const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;
		this._clear();
		this._parentElement.insertAdjacentHTML("afterbegin", markup);
	}
}
