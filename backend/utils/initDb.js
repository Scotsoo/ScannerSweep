const async = require('async')
const mongoose = require('mongoose')
const Product = require('../models/Product')
const Session = require('../models/Session')

mongoose.connect('mongodb://localhost/scanner', { useNewUrlParser: true })

async.parallel([
    (cb) => { Product.deleteMany({}, cb) },
    (cb) => { new Product({ id : 0, slug : 'banana', price: 0.95, quantity: 10 }).save(cb) },
    (cb) => { new Product({ id : 1, slug : 'phone', price: 965, quantity: 3 }).save(cb) },
    (cb) => { new Product({ id : 2, slug : 'pen', price: 0.35, quantity: 100 }).save(cb) },
    (cb) => { new Product({ id : 3, slug : 'jack', price: 99999.99, quantity: 1 }).save(cb) },
    (cb) => { new Product({ id : 4, slug : 'chair', price: 20.50, quantity: 4 }).save(cb) },
    (cb) => { new Product({ id : 5, slug : 'stressball', price: 2.45, quantity: 3 }).save(cb) },
    (cb) => { new Product({ id : 6, slug : 'pie', price: 3.14, quantity: 99 }).save(cb) },
    (cb) => { Session.deleteMany({}, cb) }
], (err) => {
    if (err) {
        console.log(err)
    }
    mongoose.connection.close()
})