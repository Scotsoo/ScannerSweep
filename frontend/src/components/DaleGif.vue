<template>
   <transition name="fade">
     <div class='dale' v-if="this.url">
       <h2>You unlocked a dale GIF!</h2>
      <img :src="url" style='dale-pic'/>
    </div>
   </transition>
</template>
<script>
export default {
  data () {
    return {
      url: ''
    }
  },
  created: function() {
    this.$webSocket.listen(data => {
      data = JSON.parse(data.data)
      if (data.action === 'winton') {
        this.url = data.payload
        setTimeout(() => {
          this.url = ''
        }, 2000)
      }
    })
  }
}
</script>

<style scoped>
  .dale {
    /*border: 1px solid #000;*/
    position: absolute;
    top:10vh;
    padding: 3vw 3vh;
    border-radius: 5px 5px 0px 0px;
    max-width: 100vw;
    width: 100vw;
    margin:auto;
    background-color: #D97904;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .dale-pic {
    width: 80vw;
    max-width: 80vw;
  }
</style>