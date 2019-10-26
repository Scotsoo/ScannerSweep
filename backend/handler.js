const Product = require('./models/Product')

class Handler {
    static async add(id, session) {
        if (!session) throw new Error('No session found')
        if (!id) throw new Error('No ID provided')

        const newProduct = await Product.findOne({ id }).exec()

        if (!newProduct) throw new Error(`Unable to find product with id "${id}"`)

        if (newProduct.quantity < 1) {
            throw new Error(`Not enough stock of ${newProduct.name}`)
        }
        const existingProduct = session.items.find(product => {
            return product.id === newProduct.id
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
        newProduct.save()
        session.save()

        return newProduct
    }
}

module.exports = Handler