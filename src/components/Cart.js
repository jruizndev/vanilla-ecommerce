/* Clase para gestionar el carrito de la compra */
export default class Cart {
    constructor() {
        this.items = []
        this.cartCount = document.querySelector('.cart__count')
        this.cartButton = document.querySelector('.cart__button')
        this.cartSidebar = document.querySelector('.cart-sidebar')
        this.closeButton = document.querySelector('.cart-sidebar__close')
        this.setupListeners()
    }

    /* Evento click en el botón del carrito */
    setupListeners() {
        this.cartButton.addEventListener('click', () => {
            this.toggleCart()
        })

        this.closeButton?.addEventListener('click', () => {
            this.toggleCart()
        })
    }

    /* Visibilidad del carrito  */
    toggleCart() {
        this.cartSidebar.classList.toggle('cart-sidebar--open')
    }
}
