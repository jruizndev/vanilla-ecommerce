import Component from './Component.js'

/* Product list component with Component base class */
export default class ProductList extends Component {
    constructor() {
        super('.products__grid')
        // Estados de la lista de productoså
        this.products = []
        this.filteredProducts = []

        // Referencias a elementos del DOM
        this.cart = null
        this.searchInput = document.querySelector('.search__input')
        this.priceRange = document.querySelector('.filters__price')
        this.categoryFilters = document.querySelector('.filters__categories')

        // Estados de filtros
        this.searchTerm = ''
        this.selectedCategories = new Set()
        this.maxPrice = 0
        this.selectedPrice = Infinity
    }

    /* Método para cargar las categorías */
    loadCategories() {
        const categories = new Set(
            this.products.map((product) => product.category)
        )

        this.categoryFilters.innerHTML = Array.from(categories)
            .map(
                (category) => `
            <div class="filters__category">
                <label class="filters__label">
                    <input type="checkbox"
                           class="filters__checkbox"
                           value="${category}"
                    >
                    ${category}
                </label>
            </div>
        `
            )
            .join('')
    }

    /* Método para filtrar por precio */
    setupPriceFilter() {
        this.maxPrice = Math.max(
            ...this.products.map((product) => product.price)
        )

        this.priceRange.innerHTML = `
        <div class="filters__price-control">
            <input type="range"
                   min="0"
                   max="${this.maxPrice}"
                   step="1"
                   value="${this.maxPrice}"
                   class="filters__price-slider"
            >
            <span class="filters__price-value">
                Hasta ${this.maxPrice.toFixed(2)}€
            </span>
        </div>
    `
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

        // Listener para cambios en categorías
        this.categoryFilters?.addEventListener('change', (e) => {
            if (e.target.matches('.filters__checkbox')) {
                if (e.target.checked) {
                    this.selectedCategories.add(e.target.value)
                } else {
                    this.selectedCategories.delete(e.target.value)
                }
                this.applyFilters()
            }
        })

        // Listener para cambios en el precio
        this.priceRange?.addEventListener('input', (e) => {
            if (e.target.matches('.filters__price-slider')) {
                this.selectedPrice = Number(e.target.value)
                e.target.nextElementSibling.textContent = `Hasta ${this.selectedPrice.toFixed(
                    2
                )}€`
                this.applyFilters()
            }
        })
    }

    /* Método para aplicar filtros */
    applyFilters() {
        this.filteredProducts = this.products.filter((product) => {
            // Filtro por búsqueda
            const matchesSearch =
                !this.searchTerm ||
                product.name.toLowerCase().includes(this.searchTerm) ||
                product.description?.toLowerCase().includes(this.searchTerm)

            // Filtro por categoría
            const matchesCategory =
                this.selectedCategories.size === 0 ||
                this.selectedCategories.has(product.category)

            // Filtro por precio
            const matchesPrice = product.price <= this.selectedPrice

            return matchesSearch && matchesCategory && matchesPrice
        })

        this.render()
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
            this.loadCategories()
            this.setupPriceFilter()
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
