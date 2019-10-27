const Product = require('./models/Product')

class Handler {
    static async add(id, session) {
        if (!session) throw new Error('No session found')
        if (!id) throw new Error('No ID provided')

        const newProduct = await Product.findOne({ id }).exec()

        if (!newProduct) throw new Error(`Unable to find product with id "${id}"`)

        const existingProduct = session.items.find(product => {
            return product.id === newProduct.id
        })

        if (!existingProduct) {
            session.items.push({
                id: newProduct.id,
                quantity: 1,
            })
        } else {
            existingProduct.quantity++
            const idx = session.items.findIndex(product => product.id === newProduct.id)
            session.items[idx] = existingProduct
        }

        return newProduct
    }
}

module.exports = Handler