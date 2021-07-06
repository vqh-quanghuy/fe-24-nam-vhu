<template>
  <div class="container-fluid" 
    data-aos="fade-up"
    data-aos-offset="200"
    data-aos-delay="100"
    data-aos-duration="1000"
    data-aos-easing="ease-in-out"
    data-aos-once="false"
    data-aos-anchor-placement="top-center">
    <b-row class="my-3">
      <h1>Tiêu đề chương trình ở đây</h1>
      <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel orci vitae odio efficitur ullamcorper. In hac habitasse platea dictumst. Aenean id fringilla odio. In gravida, velit vel dapibus mattis, eros erat pretium lorem, quis eleifend dui turpis et nunc. Phasellus pulvinar cursus ligula, in porta ante fringilla vitae. Sed sed ultricies velit, nec rutrum est. Vestibulum accumsan vel lectus eget maximus. Maecenas viverra nisi ultricies pharetra dignissim. Aliquam a dapibus sem. Curabitur quis convallis lacus. </span>
    </b-row>
    <b-row id="formHeading" class="mt-5 justify-content-center">
      <b-col lg="6" sm="12">
        <h6>Gửi lời chúc ý nghĩa nhất của bạn đến...</h6>
        <h3>Thông tin và lời chúc!</h3>
      </b-col>
    </b-row>
    <b-row class="mt-3 mb-5 justify-content-center">
      <b-col lg="6" sm="12" id="formInputs">
        <b-alert v-if="errors.length" variant="danger"
        dismissible
        :show="dismissCountDown = dismissSecs"
        @dismissed="dismissCountDown=0"
        @dismiss-count-down="countDownChanged">
          <hr class="my-1">
          <div class="my-0" v-for="(index, err) in errors" :key="index">{{errors[err]}}</div>
        </b-alert>
        <b-form-group class="my-2" id="name" label="Họ tên:" label-for="name">
          <b-form-input
            id="name"
            v-model="name"
            placeholder="Nhập vào họ tên của bạn"
            required
            class="mt-2 py-2"
            :state="nameValid && nameValid!==null"
            @keyup="checkName"
          ></b-form-input>
          <b-form-invalid-feedback v-if="!nameValid && nameValid!==null">
            {{checkName()}}
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group class="my-3" id="faculty" label="Khoa:" label-for="faculty">
          <b-form-select
            v-model="faculty"
            :options="faculties"
            class="my-2 py-2"
          />
        </b-form-group>
        <b-form-group class="my-2" id="greeting" label="Lời chúc:" label-for="greeting">
          <b-form-textarea
            id="greeting"
            v-model="greeting"
            placeholder="Viết vào đây lời chúc của bạn..."
            class="my-3 py-2"
            rows="5"
            max-rows="20"
            :state="greetingValid && greetingValid!==null"
            @keyup="checkGreeting"
          ></b-form-textarea>
          <b-form-invalid-feedback v-if="!greetingValid && greetingValid!==null">
            {{checkGreeting()}}
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group class="my-2" id="avtImage" label="Ảnh đại diện:" label-for="avtImage">
          <b-form-file
          v-model="avtImage"
          :state="Boolean(avtImage)"
          placeholder="Chọn file ảnh hoặc kéo thả vào đây..."
          drop-placeholder="Kéo thả vào đây..."
          accept=".jpg, .png, .jpeg"
          ></b-form-file>
        </b-form-group>
        <b-button v-b-modal.modal-1 @click="submitGreeting" variant="primary" class="w-100 my-2 submit-button">Gửi lời chúc!</b-button>
      </b-col>
    </b-row>
    <b-row class="my-3 greetings-section" data-aos="fade-up"
    data-aos-duration="1500">
      <b-row class="mt-5 justify-content-center">
        <h4>Đã có ... lời chúc gửi đến</h4>
      </b-row>
      <b-row class="mt-3 mb-5 mx-auto">
        <b-col md="6" class="scroll-container" data-aos="fade-up"
          data-aos-offset="200"
          data-aos-delay="100"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
          data-aos-once="false">
          <b-card-group class="my-2" v-for="greeting in greetings" :key="greeting._id">
            <b-card :title="`${greeting.name}`" :sub-title="`${greeting.faculty}`">
              <b-card-text>
                {{greeting.greeting}}
              </b-card-text>
            </b-card>
          </b-card-group>
        </b-col>
        <b-col md="6">
          <img src="https://i.vgy.me/mRkuyF.jpg" id="vhu-campus" alt="vhu-campus">
        </b-col>
      </b-row>
    </b-row>
    <div>
      <b-modal v-if="flag" id="modal-1" title="Tải về Frame hình" hide-footer>
        <b-progress :max="max" v-show="modalProgress" show-progress :animated="true">
          <b-progress-bar :value="value" :label-html="`Rendering... ${value}%`" variant="success"></b-progress-bar>
        </b-progress>
        <canvas v-show="canvasProgress" class="d-block mx-auto" ref="canvas" id="main-frame" width=8510 height=3150></canvas>
        <b-row class="mt-3 w-75 mx-auto">
          <b-button block variant="primary" size="lg">Gửi lời chúc!</b-button>
        </b-row>
        <b-row class="my-4 w-25 mx-auto">
          <b-button @click="$bvModal.hide('modal-1')" size="sm" variant="outline-dark">Hủy, viết lại</b-button>
        </b-row>
        <p class="my-4">Hello from modal!</p>
      </b-modal>
    </div>
  </div>
</template>

<script>
import GreetingService from '../GreetingService';
import FacultyService from '../FacultyService';
import frameImage from "../assets/testimage.jpg";

export default {
  name: 'Greetings',
  data() {
    return {
      greetings: [],
      faculties: [],
      errors: [],
      name: '',
      faculty: null,
      greeting: '',
      nameValid: null,
      facultyValid: null,
      greetingValid: null,
      avtImage: null,
      dismissSecs: 15,
      dismissCountDown: 0,
      flag: true,
      facultyName: null,
      modalProgress: true,
      max: 100,
      value: 0,
      timer: 0,
      canvasProgress: false,
    }
  },
  async created() {
    try {
      let getGreetings = await GreetingService.getGreetings();
      let getFaculties = await FacultyService.getFaculties();
      let facultiesSelectList = [];
      facultiesSelectList.push({ value: null, text: 'Hãy chọn một Khoa', disabled: true })
      getFaculties.forEach(faculty => {
          let selectListOption = {
            value: faculty._id,
            text:  faculty.name
          }
          facultiesSelectList.push(selectListOption)
      })
      this.faculties = facultiesSelectList;
      getGreetings.forEach(greeting => {
        for(let i = 0; i<getFaculties.length; i++){
          if(greeting.faculty == getFaculties[i]._id){
            greeting.faculty = getFaculties[i].name;
          }
        }
      })
      this.greetings = getGreetings;
    } catch(err) {
      this.errors.push("Can't connect to database, try again later!");
    }
  },
  methods: {
    startTimer() {
      let timer = setInterval(() => {
        this.value += 10;
        if(this.value >= 200) {
          clearInterval(timer);
          this.value = 0;
        }
      }, 50);
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    submitGreeting(){
      this.errors = [];
      let flag = true;
      let facultyName = '';
      const facultiesIDs = this.faculties.map(item=>{
        return item.value;
      });
      facultiesIDs.shift();
      let checkForName = this.checkName();
      let checkForGreeting = this.checkGreeting();
      if(this.faculty==null) {
        this.errors.push("Vui lòng chọn Khoa!");
        flag = false;
      } else if (!facultiesIDs.includes(this.faculty)){
        this.errors.push("Khoa này không có trong hệ thống!")
        flag = false;
      } else {
        for(let i = 0; i<this.faculties.length; i++){
          if(this.faculty == this.faculties[i].value){
            facultyName = this.faculties[i].text;
          }
        }
      }
      if(!checkForName) {
        this.errors.push(checkForName);
        flag = false;
      }
      if(!checkForGreeting) {
        this.errors.push(checkForGreeting);
        flag = false;
      }
      if(this.avtImage==null) {
        this.errors.push("Ảnh không được để trống!");
        flag = false;
      }
      if(flag) {
        this.flag = flag;
        // this.renderImage(this.name, facultyName, this.greeting, this.avtImage)
      }
      this.facultyName = facultyName;
      this.renderImage();
    },
    loadImages(sources, callback) {
      let images = {};
      let loadedImages = 0;
      let numImages = 0;
      for(let src in sources){
        numImages++;
        images[src] = new Image();
        images[src].onload = () => {
          if(++loadedImages >= numImages) {
            callback(images);
          }
        };
        images[src].src = sources[src];
      }
    },
    renderImage(){
      this.startTimer();
      setTimeout(()=>{
        this.modalProgress = false;
        this.canvasProgress = true;
        let c = this.$refs.canvas;
        let ctx = c.getContext('2d');
        let name = "Họ và tên: "+ this.name;
        let facultyName = "Khoa: "+ this.facultyName;
        let greeting = this.greeting;
        let sources = {
          image1: frameImage,
          image2: URL.createObjectURL(this.avtImage),
        };
        this.loadImages(sources, images => {
          const frame = images.image1;
          const avt = images.image2;
          ctx.drawImage(frame, 0, 0, frame.width, frame.height, 0, 0, c.width, c.height);
          ctx.drawImage(avt, 0, 0, avt.width, avt.height, 6000, 800, 1400, 1400);
          ctx.font = "bold 150px Roboto";
          ctx.fillStyle = "white";
          ctx.textAlign = "left";
          ctx.fillText(name.toUpperCase(), 500, 1000);
          ctx.fillText(facultyName.toUpperCase(), 500, 1300);
          ctx.fillText("LỜI CHÚC: ", 500, 1600);
          ctx.fillText(greeting.toUpperCase(), 500, 1900);
        });
      }, 1000);
    },
    checkName(){
      let namecheck = this.name;
      const namePattern = /^([\p{L}\s]+)$/gu;
      this.name = this.name.replace(/\s\s+/g, ' ');
      if(namecheck == ""){
        this.nameValid = false;
        return "Vui lòng nhập tên!"
      }else if(namecheck.length <= 2){
        this.nameValid = false;
        return "Tên quá ngắn"
      }else if(namecheck.length >=40){
        this.nameValid = false;
        return "Tên không được vượt 40 kí tự"
      }else if(!namecheck.match(namePattern)){
        this.nameValid = false;
        return "Tên không được chứa ký tự đặc biệt hoặc số"
      }else{
        this.nameValid = true;
        let seperateName = namecheck.toLowerCase().split(' ');
        for (let i = 0; i < seperateName.length; i++) {
            seperateName[i] = seperateName[i].charAt(0).toUpperCase() + seperateName[i].substring(1);     
        }
        this.name = seperateName.join(' ');
        return true;
      }
    },
    checkGreeting(){
      let greetingcheck = this.greeting;
      //eslint-disable-next-line
      const greetingPattern = /[`@#$%^*_+\-=\[\]{}'\\|<>~]/g;
      if(greetingcheck == ""){
        this.greetingValid = false;
        return "Vui lòng nhập lời chúc!"
      }else if(greetingcheck.length <= 20){
        this.greetingValid = false;
        return "Lời chúc phải dài hơn 20 kí tự"
      }else if(greetingcheck.length >=1200){
        this.greetingValid = false;
        return "Lời chúc không quá hơn 1200 kí tự"
      }else if(greetingPattern.test(greetingcheck)){
        this.greetingValid = false;
        return "Lời chúc không được chứa ký tự đặc biệt như: `@#$%^*_+-=|<>~"
      }else{
        this.greetingValid = true;
        this.greeing = greetingcheck;
        return true;
      }
    },
    async createGreeting() {
      const res = await GreetingService.insertGreeting(this.name, this.faculty, this.greeting);
      if(res.status==201){
        console.log("Success");
      } else {
        this.errors = [];
        Object.keys(res).forEach(key => {
          this.errors.push(res[key]);
        });
      }
    }
  }
}
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
#formHeading > div > h6 {
  text-align: left;
  color: #8692A6;
}
#formHeading > div > h3 {
  text-align: left;
  font-weight: bold;
  color: #234384;
}
#formInputs > div {
  text-align: left;
  font-weight: bold;
  color: #696F79;
}
#formInputs > .submit-button {
  font-weight: bold;
  font-size: 22pt;
  height: 60px;
}
#formInputs > div > div> input{
  text-align: left;
  color: #8692A6;
}

.custom-file-input {
  display: none;
}

.custom-file > label{
  cursor: pointer;
  text-align: left;
  width: 100%;
  display: block;
  padding: 0.375rem 0.4rem;
      padding-top: 0.375rem;
      padding-bottom: 0.375rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

#formInputs > div > div> select{
  cursor: pointer;
  text-align: left;
  width: 100%;
  display: block;
  padding: 0.375rem 0.4rem;
      padding-top: 0.375rem;
      padding-bottom: 0.375rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
#formInputs > div > div> select{
  color: #8692A6;
}
#formInputs > div > .close{
  font-size: 1.5rem;
  color:#696F79;
  border: solid 0.5px #696F79;
  background-color: transparent;
  border-radius: 0.3rem;
  display: block;
}
.greetings-section {
  background: linear-gradient(180deg, #0192DE 0%, #BBC7DF 105.73%);
}
.card-group{
  display: block;
}
.scroll-container{
  max-height: 400px;
  overflow-y: auto;
}
.scroll-container::-webkit-scrollbar {
    display: none;
}
.scroll-container {
  -ms-overflow-style: none;  
  scrollbar-width: none; 
}
.card-body{
  text-align: left;
}
.card-body > h4{
  font-size: 1rem;
  font-weight: bold;
}
.card{
  border-radius: 0.7rem;
}
#vhu-campus {
  max-height: 400px;
  border-radius: 0.4rem;
}
.modal-header .close {
  display:none;
}
.modal-dialog{
  max-width: 900px;
}
#main-frame {
  width: 851px;
  height: 315px;
}
</style>
