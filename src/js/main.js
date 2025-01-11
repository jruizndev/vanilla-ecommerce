import ProductList from '../components/ProductList.js'

document.addEventListener('DOMContentLoaded', () => {
    const productList = new ProductList()
    productList.loadProducts()
})
