<template>
  <div id="app" class="container-fluid m-0 p-0">
    <Header/>
    <Greetings/>
    <Footer />
  </div>
</template>

<script>
import Greetings from './components/Greetings.vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  created(){
    document.title = "VHU 24 Years Anniversary"
  },
  components: {
    Header,
    Greetings,
    Footer
  }
}
</script>
<style>
.container-fluid{
  background-color: #F7F8FC;
}
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #234384;
}
</style>
