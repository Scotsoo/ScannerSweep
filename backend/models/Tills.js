const tills = {}

class Tills {
  register(id, ws) {
    tills[id] = ws
    console.log(`Added till ${id}`)
    console.log(Object.keys(tills))
  }
  checkoutSession(session, id) {
    console.log(id);
    const ws = tills[id]
    ws.send(JSON.stringify({
            action: 'checkout',
            payload: session
        }))
  }
}

module.exports = Tills
