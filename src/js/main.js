import ProductList from '../components/ProductList.js'
import Cart from '../components/Cart.js'

/* Inicialización de la lista de productos y el carrito al cargar el DOM */
document.addEventListener('DOMContentLoaded', () => {
    const productList = new ProductList()
    const cart = new Cart()
    productList.setCart(cart)
})
