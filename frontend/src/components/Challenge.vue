<template>
  <div>
    <transition name="fade">
      <div v-if="this.challenge" class="challenge fixed-bottom">
        <p class="text-right">{{ formattedTime }} </p>
        <p class="text-center">{{ this.challenge.text }}</p>
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
        return formatted
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
  .challenge {
    /*border: 1px solid #000;*/
    border-radius: 5px 5px 0px 0px;
    max-width: 300px;
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


