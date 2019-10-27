'use strict';
const hunt = [
  {text: 'Co-operation is key', test: function(payload){return payload == "000000000604"}},
  {text: 'Invest time for investigation and this is your reward', test: function(payload){return payload == "000000000598"}},
  {text: 'Bubble, Quick, Binary and Merge - all your collections are this', test: function(payload){return payload == "000000000581"}},
  {text: 'All our mobile networks should run like this...', test: function(payload){return payload == "000000000574"}}
]

class TreasureHunt {
  constructor() {
    this.active_hunts = {}
  }
  setChallenge(ws) {
    const sessionid = ws.session.id
    if (this.active_hunts.hasOwnProperty(sessionid)) {
      return
    }

    const index = 0
    const inflight_hunt = {
      index: index
    }
    this.active_hunts[sessionid] = inflight_hunt
   const step = hunt[index]
    this.sendNextStep(ws, step)
  }

  sendNextStep(ws, step) {
    ws.send(JSON.stringify({
        action: 'challenge',
        payload: {
          text: step.text
        }
    }))
  }

  sendComplete(ws) {
    ws.send(JSON.stringify({action: 'challenge_complete', payload:{description: "treasureHunt", amount: 10.00}}))
    ws.send(JSON.stringify({action: 'challenge_end'}))
    delete this.active_hunts[ws.session.id]
  }

  getChallenge(ws) {
    return
  }

  testChallenge(ws, payload) {
     const sessionid = ws.session.id
     console.log(`Testing TreasureHunt for ${sessionid}: ${payload}`)
     if (!this.active_hunts.hasOwnProperty(sessionid)) {
       return
     }
     var inflight_hunt = this.active_hunts[sessionid]
     var index = inflight_hunt['index']
     console.log(`Fetching step ${index}`)

     var step = hunt[index]
     console.log(step+": "+step.test(payload));

     if (step.test(payload)) {
       index += 1
       if (index < hunt.length ) {
         this.active_hunts[sessionid] = {index: index}
         step = hunt[index]
         console.log(this.active_hunts);
         this.sendNextStep(ws, step)
       } else {
         this.sendComplete(ws)
       }
     }
  }
}

module.exports = TreasureHunt
