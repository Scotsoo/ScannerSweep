const async = require('async')
const mongoose = require('mongoose')
const Product = require('../models/Product')
const Session = require('../models/Session')

mongoose.connect('mongodb://localhost/scanner', { useNewUrlParser: true })

async.parallel([
    (cb) => { Product.deleteMany({}, cb) },
    (cb) => { new Product({ id : '000000000048', slug : 'banana', name: "The Big Banana", price: 0.95 }).save(cb) },
    (cb) => { new Product({ id : '000000000055', slug : 'phone', name: "The New zPhone X-Treme", price: 965 }).save(cb) },
    (cb) => { new Product({ id : '000000000062', slug : 'pen', name: "High Quality Pen Island Pen", price: 0.35 }).save(cb) },
    (cb) => { new Product({ id : '000000000079', slug : 'jack', name: "Jack Scotson, Principal Developer", price: 99999.99 }).save(cb) },
    (cb) => { new Product({ id : '000000000086', slug : 'chair', name: "Bean Bag Chair", price: 20.50 }).save(cb) },
    (cb) => { new Product({ id : '000000000093', slug : 'stressball', name: "MongoDB Branded Stress Ball", price: 2.45 }).save(cb) },
    (cb) => { new Product({ id : '000000000109', slug : 'pie', name: "Ratio of Circumference and Diameter of a Circle", price: 3.14 }).save(cb) },
    (cb) => { new Product({ id : '8714789810348', slug : 'colgate', name: "Colgate", price: 0.88 }).save(cb) },
    (cb) => { new Product({ id : '8714789810348', slug : 'cadburybrunchbar', name: "Cadbury\'s brunch bar", price: 0.88 }).save(cb) },
    (cb) => { new Product({ id : '00300858', slug : 'pasty', name: "2x Cheesy Bean Puff Pastry Slices", price: 1.20 }).save(cb) },
    (cb) => { Session.deleteMany({}, cb) }
], (err) => {
    if (err) {
        console.log(err)
    }
    mongoose.connection.close()
})
