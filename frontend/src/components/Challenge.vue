<template>
  <div>
    <transition name="fade">
      <div v-if="this.challenge" class="challenge fixed-bottom inline-block">
        <div class="inline-block left">
          <h4 class="text-left">Dale Says:</h4>
          <p class="text-center">{{ this.challenge.text }}</p>
          <p class="text-center">{{ formattedTime }}</p>
        </div>
        <div clas="inline-block right pull-right">
          <br/>
          <img class="head" src="../assets/head.png">
          <br/>
          <img class="chin" src="../assets/chin.png">
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  // import Vue from 'vue'
  import Toast from './Toast.vue'
  export default {
    name: 'Challenge',
    components: [Toast],
    data() {
      return {
        challenge: null
      }
    },
    created : function() {
      console.log(this.$webSocket);
      this.setupEventListeners()

    },
    computed: {
      // a computed getter
      formattedTime: function () {
        // `this` points to the vm instance
        let time = this.challenge.timeRemaining
        let formatted = ''
        let units = 'second'

        if (time >= 60) {
          time = Math.floor(time / 60)
          units = 'minute'

        }
        if (time > 1) {
          units = units+'s'
        }
        formatted = `${time} ${units}`
        if (time <= 0) {
          formatted = "Finished!"
        }
        let rem = 'remain'
        if (time === 1) {
          rem += 's'
        }
        return formatted + ' ' + rem
      }
    },
    methods: {
        fakeChallengeCreate() {
          // challenge
          const data = {
            action: 'challenge',
            message: 'Kill all humans',
            timeRemaining: 30
          }
          this.registerChallenge(data)
          const interval = setInterval(()=>{
            data.timeRemaining--
            this.updateChallenge(data);
            if (data.timeRemaining == 0) {
              clearInterval(interval)
            }
          }, 1000)

          setTimeout(()=>{
            this.fakeChallengeSuccess()
          }, 10000)

        },
        fakeChallengeSuccess() {
          // challenge_complete
          this.challenge.message = "Congratulations!"
          this.challengeEnd()
        },
        fakeChallengeFailed() {
          // challenge_failed
        },

        setupEventListeners() {
          console.log(this.$webSocket.listen((data) => {
            console.log(data.data);
            data = JSON.parse(data.data);
            if (data.action == "challenge") {
              if (!this.challenge) {
                this.registerChallenge(data.payload)
              } else {
                this.updateChallenge(data.payload)
              }
            }
            if (data.action == "challenge_complete") {
              this.challengeComplete(data.payload)
            }
            if (data.action == "challenge_end") {
              this.challengeEnd(data.payload)
            }
          }))
        },
        registerChallenge(eventDetails){
          console.log(eventDetails)
          this.challenge = eventDetails
          // this.popToast()
        },
        updateChallenge(eventDetails) {
          console.log("update called")
          if (!this.challenge) {
            return //this.registerChallenge(eventDetails)
          }

          this.challenge = eventDetails
          if (this.challenge.timeReamining == 0) {
            this.challengeEnd(eventDetails)
          }
        },
        challengeComplete(eventDetails) {
          this.$store.commit('storeDiscount', eventDetails)
          // console.log('eventDetails', eventDetails)
          this.challenge.text = "Congratulations!"
          this.challenge.success = true
        },
        challengeEnd(eventDetails) {
          eventDetails
          console.log("ended")
          if (!this.challenge.success) {
            this.challenge.text = "Challenge finished :("
          }
          setTimeout(()=>{
            this.challenge = null;
          }, 5000)
        }
      }
    }
</script>
<style scoped>
.left {
  width: 180px;
  float:left;
}
.right {
  width: 100px;
}
.inline-block {
  display: inline-block
}
@keyframes head {
  100% {
    transform: rotate(15deg)
  }
  70% {
    transform: rotate(10deg)
  }
  70% {
    transform: rotate(0deg)
  }
  50% {
    transform: rotate(11deg)
  }
  35% {
    transform: rotate(11deg)
  }
  25% {
    transform: rotate(19deg)
  }
  15% {
    transform: rotate(12deg)
  }
  0% {
    transform: rotate(15deg)
  }
}
@keyframes chin {
  100% {
    transform: translate(0) rotate(-15deg)
  }
  70% {
    transform: translate(0)  rotate(-10deg)
  }
  70% {
    transform: translate(0)  rotate(-0deg)
  }
  50% {
    transform: translate(0)  rotate(-11deg)
  }
  35% {
    transform: translate(0)  rotate(-11deg)
  }
  25% {
    transform: translate(0)  rotate(-19deg)
  }
  15% {
    transform: translate(0)  rotate(-12deg)
  }
  0% {
    transform: translate(0) rotate(-15deg)
  }
}
.head {
  width: 20%;
  animation: head 2s infinite linear;

}
.chin {
  width: 20%;
  animation: chin 3s infinite linear;
}
  .challenge {
    /*border: 1px solid #000;*/
    border-radius: 5px 5px 0px 0px;
    max-width: 300px;
    width: 300px;
    margin:auto;
    background-color: #D97904;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>


