import Component from './Component.js'

/* Product list component with Component base class */
export default class ProductList extends Component {
    constructor() {
        super('.products__grid')
        this.products = []
        this.filteredProducts = []
        this.cart = null
        this.searchInput = document.querySelector('.search__input')
        this.searchTerm = ''
    }

    /* Método para conectar con el carrito */
    setCart(cart) {
        this.cart = cart
    }

    setupListeners() {
        // Evento de click para agregar al carrito
        this.element?.addEventListener('click', (e) => {
            if (e.target.matches('.product-card__add-to-cart')) {
                const productCard = e.target.closest('.product-card')
                const productId = Number(productCard?.dataset.id)
                const product = this.products.find((p) => p.id === productId)
                if (product && this.cart) {
                    this.cart.addToCart(product)
                }
            }
        })

        // Evento de cambio en el input de búsqueda
        this.searchInput?.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase()
            this.filterProducts()
        })
    }

    /* Filtra los productos según la búsqueda */
    filterProducts() {
        if (!this.searchTerm.trim()) {
            this.filteredProducts = [...this.products]
        } else {
            this.filteredProducts = this.products.filter(
                (product) =>
                    product.name.toLowerCase().includes(this.searchTerm) ||
                    product.description.toLowerCase().includes(this.searchTerm)
            )
        }
        this.render()
    }

    /* Renderiza la lista de productos */
    async init() {
        await this.loadProducts()
        this.setupListeners()
    }

    async loadProducts() {
        try {
            const response = await fetch('data/products.json')
            const data = await response.json()
            this.products = data.products
            this.filteredProducts = [...this.products]
            this.render()
        } catch (error) {
            console.error('Error loading products:', error)
            this.products = []
            this.filteredProducts = []
        }
    }

    /* Show the product list */
    render() {
        if (!this.element) return

        if (this.filteredProducts.length === 0) {
            this.element.innerHTML = `
            <div class='products__empty'>
            <p>No se encontraron productos que coincidan con la búsqueda.</p>
            </div>`
            return
        }

        this.element.innerHTML = this.filteredProducts
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
