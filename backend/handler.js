const Product = require('./models/Product')

class Handler {
    static async add(id, session, challengeProductId, discount) {
        if (!session) throw new Error('No session found')
        if (!id) throw new Error('No ID provided')

        const newProduct = await Product.findOne({ id }).exec()

        if (!newProduct) throw new Error(`Unable to find product with id "${id}"`)

        if (challengeProductId && challengeProductId === newProduct.id) {
            newProduct.price*= discount
            newProduct.price = +newProduct.price.toFixed(2)
        }

        const existingProduct = session.items.find(product => {
            return product.id === newProduct.id && product.price === newProduct.price
        })

        if (!existingProduct) {
            // new product
            session.items.push({
                id: newProduct.id,
                quantity: 1,
            })
        } else {
            // existing product
            existingProduct.quantity++
            // existingProduct.save()
            const idx = session.items.findIndex(product => product.id === newProduct.id)
            session.items[idx] = existingProduct
        }
        session.save()

        return newProduct
    }
}

module.exports = Handler