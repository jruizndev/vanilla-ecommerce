import ProductList from './components/ProductList'

document.addEventListener('DOMContentLoaded', () => {
    const productList = new ProductList()
    productList.loadProducts()
})
