import Component from './Component.js'

/* Product list component with Component base class */
export default class ProductList extends Component {
    constructor() {
        super('.products__grid')
        this.products = []
    }

    /* Render the product list */
    async init() {
        await this.loadProducts()
        this.render()
    }

    async loadProducts() {
        try {
            const response = await fetch('data/products.json')
            const data = await response.json()
            this.products = data.products
        } catch (error) {
            console.error('Error loading products:', error)
            this.products = []
        }
    }

    /* Show the product list */
    render() {
        if (!this.element) return

        this.element.innerHTML = this.products
            .map(
                (product) => `
                <div class="product-card" data-id="${product.id}">
                    <img src="${product.image}" alt="${
                    product.name
                }" class="product-card__image">
                    <div class="product-card__info">
                        <h3 class="product-card__name">${product.name}</h3>
                        <p class="product-card__price">${product.price.toFixed(
                            2
                        )} €</p>
                        <button class="product-card__add-to-cart">Add to Cart</button>
                    </div>
                </div>
            `
            )
            .join('')
    }
}
