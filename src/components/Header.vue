<template>
  <b-navbar toggleable="sm" class="justify-content-between px-3">
    <b-navbar-brand href="https://vhu.edu.vn" data-aos="zoom-out">
      <img src="https://i.vgy.me/B4wnUy.png" id="vhu-logo" alt="vhu-logo">
    </b-navbar-brand>
    <b-navbar-brand class="ml-auto" data-aos="zoom-out">
      <img src="https://i.vgy.me/qMN2F8.png" id="dtn-logo" alt="dtn-logo">
      <img src="https://i.vgy.me/NZsqw9.png" id="hsv-logo" alt="hsv-logo">
    </b-navbar-brand>
  </b-navbar>
</template>
<style scoped>
nav{
  background-color: #fff;
}
#vhu-logo{
  width: 140px;
}
#dtn-logo, #hsv-logo{
  width: 70px;
}
@media only screen and (max-width: 600px) {
  #vhu-logo{
  width: 80px;
  }
  #dtn-logo, #hsv-logo{
    width: 40px;
  }
}
</style>