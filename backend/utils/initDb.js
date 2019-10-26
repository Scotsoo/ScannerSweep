const async = require('async')
const mongoose = require('mongoose')
const Product = require('../models/Product')
const ProductInBasket = require('../models/ProductInBasket')
const Session = require('../models/Session')

mongoose.connect('mongodb://localhost/scanner', { useNewUrlParser: true })

async.parallel([
    (cb) => { Product.deleteMany({}, cb) },
    (cb) => { new Product({ id : 0, slug : 'banana', name: "The Big Banana", price: 0.95, quantity: 10 }).save(cb) },
    (cb) => { new Product({ id : 1, slug : 'phone', name: "The New zPhone X-Treme", price: 965, quantity: 3 }).save(cb) },
    (cb) => { new Product({ id : 2, slug : 'pen', name: "High Quality Pen Island Pen", price: 0.35, quantity: 100 }).save(cb) },
    (cb) => { new Product({ id : 3, slug : 'jack', name: "Jack Scotson, Principal Developer", price: 99999.99, quantity: 1 }).save(cb) },
    (cb) => { new Product({ id : 4, slug : 'chair', name: "Bean Bag Chair", price: 20.50, quantity: 4 }).save(cb) },
    (cb) => { new Product({ id : 5, slug : 'stressball', name: "MongoDB Branded Stress Ball", price: 2.45, quantity: 3 }).save(cb) },
    (cb) => { new Product({ id : 6, slug : 'pie', name: "Ratio of Circumference and Diameter of a Circle", price: 3.14, quantity: 99 }).save(cb) },
    (cb) => { Session.deleteMany({}, cb) },
    (cb) => { ProductInBasket.deleteMany({}, cb) }
], (err) => {
    if (err) {
        console.log(err)
    }
    mongoose.connection.close()
})