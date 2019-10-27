const async = require('async')
const mongoose = require('mongoose')
const Product = require('../models/Product')
const Session = require('../models/Session')
const Challenge = require('../models/Challenge')
const CrypticProduct = require('../models/CrypticProduct')

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
    (cb) => { new Product({ id : '00300858', slug : 'pasty', name: "2x Cheesy Bean Puff Pastry Slices", price: 1.20 }).save(cb) },
    (cb) => { Session.deleteMany({}, cb) },
    (cb) => { Challenge.deleteMany({}, cb) }
    (cb) => { CrypticProduct.deleteMany({}, cb) },
    (cb) => { new CrypticProduct({ productId : '000000000048', message : `My colour is yellow and I grow on trees. I'm a popular food with apes and monkeys` }).save(cb) },
    (cb) => { new CrypticProduct({ productId : '000000000055', message: `I make a ring so you will know, to pick me up and say hello.` }).save(cb) },
    (cb) => { new CrypticProduct({ productId : '000000000062', message: `My contents are wet, this sound like they come from a squid. When putting one in your pocket, amke sure you attach my lid.` }).save(cb) },
    (cb) => { new CrypticProduct({ productId : '000000000079', message: `You may have heard about me climbing a hill. I wouldn't have made it without good old Jill` }).save(cb) },
    (cb) => { new CrypticProduct({ productId : '000000000086', message: `I might have a back and legs, but never an armpit. I can come after arm for something on which you'd sit` }).save(cb) },
    (cb) => { new CrypticProduct({ productId : '000000000093', message: `When your blood is boiling and things are rough. Give me a squeeze and maybe that'll be enough` }).save(cb) },
    (cb) => { new CrypticProduct({ productId : '000000000109', message: `Savoury or sweet, baked in a golden pastry. Or maybe you know me from mathematics, it makes no difference to me.` }).save(cb) },
    (cb) => { new CrypticProduct({ productId : '8714789810348', message: `I help to clean parts of you, but I'm not a bar of soap. I help you keep you minty fresh, and I'm used twice a day; I hope!` }).save(cb) },
    (cb) => { new CrypticProduct({ productId : '00300858', message: `Found in refridgerar aisles or near baked goods. You can enjoy me hot or cold; even as a pud!` }).save(cb) },
], (err) => {
    if (err) {
        console.log(err)
    }
    mongoose.connection.close()
})
