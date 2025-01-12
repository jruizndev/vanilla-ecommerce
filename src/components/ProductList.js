export default class ProductList {
    constructor() {
        this.products = []
        this.productContainer = document.querySelector('.products__grid')
    }

    async loadProducts() {
        try {
            const response = await fetch('data/products.json')
            const data = await response.json()
            this.products = data.products
            this.renderProducts()
        } catch (error) {
            console.error('Error loading products:', error)
        }
    }

    renderProducts() {
        this.productContainer.innerHTML = this.products
            .map(
                (product) => `
            <div class="product-card" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" class="product-card__image">
                <div class="product-card__info">
                    <h3 class="product-card__name">${product.name}</h3>
                    <p class="product-card__price">${product.price} €</p>
                    <button class="product-card__add-to-cart">Add to Cart</button>
                </div>
            </div>
        `
            )
            .join('')
    }
}
