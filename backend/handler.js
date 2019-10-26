const Product = require('models/Product')

class Handler {
    static add(id, { session }) {
        if (!session) throw new Error('No session found')

        const newProduct = Product.findOne({ id })

        if (newProduct.quantity < 1) {
            throw new Error(`Not enough stock of ${newProduct.name}`)
        }

        const existingProduct = session.item.find(product => {
            product.id === newProduct.id
        })
        if (!existingProduct) {
            // new product
            session.items.push({
                id: product.id,
                quantity: 1
            })
        } else {
            // existing product
            existingProduct.quantity++
            existingProduct.save()
        }

        newProduct.quantity--

        newProduct.save()
        session.save()

        return newProduct
    }
}

module.exports = Handler