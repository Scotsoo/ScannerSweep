<template>
  <div class="container home-container">
    <img src ="../assets/dale.png" style="width: 10vh" class="dale">
    <br/>
    <img src="../assets/logo.png" style="width:50vw" class="logo">
    <br/>
    <br/>
    <br/>
    <!-- <h1 class="scanner">Scanner</h1> -->
    <!-- <h1 class="sweep">SWEEP</h1> -->
    <h2>Scan your </h2>
    <img src="../assets/d-card.png" style="width: 30vw" class="d-card"/>
    <h2> To Begin </h2>
  </div>
</template>

<script>
import BarcodeScanner from '../helpers/BarcodeScanner'
const bcs = new BarcodeScanner()
export default {
  name: 'Home',
  created: function () {
    bcs.register()
    bcs.on(BarcodeScanner.keys().scanned, (barcode) => {
      this.$store.commit('storeDCard', barcode)
      this.$webSocket.initSession(barcode)
      this.$router.push('Scan')
    })
  },
  beforeDestroy: function () {
    bcs.destroy()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@keyframes rotation {
  100% {
    transform: rotate(-20deg)
  }
  50% {
    transform: rotate(40deg);
  }
  0% {
    transform: rotate(-20deg);
  }
}

@keyframes smallrotate {
  100% {
    transform: rotate(5deg)
  }
  50% {
    transform: rotate(-5deg) scale(1.2);
  }
  0% {
    transform: rotate(5deg);
  }
}

@keyframes dCardRotate {
  100% {
    transform: rotate(-10deg)
  }
  50% {
    transform: rotate(5deg) scale(0.8);
  }
  0% {
    transform: rotate(-10deg);
  }
}

.dale {
  display: inline-block;
  animation: rotation 3s infinite ease;
}
.logo {
  display: inline-block;
  animation: smallrotate 3s infinite ease;
}
.d-card {
  animation: dCardRotate 3s infinite ease;
}
/*
@keyframes wow {
  100% {
    transform:
  }
} */

.scanner{
  color: #0476D9
}
.sweep{
  color: #D97904
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.home-container {
  margin-top:5vh;
}
</style>
