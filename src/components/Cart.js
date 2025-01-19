import Component from './Component.js'

/* Clase para gestionar el carrito de la compra */
export default class Cart extends Component {
    constructor() {
        super('.cart-sidebar')
        this.items = []
        this.cartCount = document.querySelector('.cart__count')
        this.cartButton = document.querySelector('.cart__button')
        this.closeButton = document.querySelector('.cart-sidebar__close')
        this.setupListeners()
    }

    init() {
        this.loadCartFromStorage()
    }

    /* Eventos click en el botón del carrito */
    setupListeners() {
        // Toggle del carrito
        this.cartButton?.addEventListener('click', () => this.toggleCart())
        this.closeButton?.addEventListener('click', () => this.toggleCart())

        // Evento click en el botón de eliminar un producto
        this.element?.addEventListener('click', (e) => {
            if (e.target.matches('.cart-item__remove')) {
                const cartItem = e.target.closest('.cart-item')
                const productId = Number(cartItem?.dataset.id)
                if (productId) this.removeFromCart(productId)
            }
        })
    }

    /* Visibilidad del carrito  */
    toggleCart() {
        this.element?.classList.toggle('cart-sidebar--open')
    }

    /* localStorage para persistencia de datos */
    loadCartFromStorage() {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
            this.items = JSON.parse(savedCart)
            this.updateCartCount()
        }
    }

    saveCartToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items))
    }

    /* Añadir un producto al carrito */
    addToCart(product) {
        const existingItem = this.items.find((item) => item.id === product.id)
        if (existingItem) {
            existingItem.quantity += 1
        } else {
            this.items.push({ ...product, quantity: 1 })
        }
        this.updateCartCount()
        this.render()
        this.saveCartToStorage()
    }

    /* Eliminar un producto del carrito */
    removeFromCart(productId) {
        this.items = this.items.filter((item) => item.id !== productId)
        this.updateCartCount()
        this.render()
        this.saveCartToStorage()
    }

    /* Actualizar el contador del carrito */
    updateCartCount() {
        if (this.cartCount) {
            this.cartCount.textContent = this.items.length.toString()
        }
    }

    /* Renderizar el carrito */
    render() {
        if (!this.element) return

        const cartContent = this.items
            .map(
                (item) => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${
                    item.name
                }" class="cart-item__image">
                <div class="cart-item__details">
                    <h4>${item.name}</h4>
                    <p>${item.price.toFixed(2)} € x ${item.quantity}</p>
                </div>
                <button class="cart-item__remove">×</button>
            </div>
        `
            )
            .join('')

        const cartTotal = this.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        )

        this.element.querySelector('.cart-sidebar__items').innerHTML =
            cartContent
        this.element.querySelector(
            '.cart-sidebar__total'
        ).textContent = `Total: ${cartTotal.toFixed(2)} €`
    }
}
