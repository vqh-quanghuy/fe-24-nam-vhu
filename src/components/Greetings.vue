<template>
  <div class="container-fluid" 
    data-aos="fade-up"
    data-aos-offset="100"
    data-aos-delay="100"
    data-aos-duration="1000"
    data-aos-easing="ease-in-out"
    data-aos-once="false"
    data-aos-anchor-placement="top-center">
    <b-row class="mt-5 mb-3">
      <h2>CHÀO MỪNG KỶ NIỆM 24 NĂM THÀNH LẬP TRƯỜNG ĐẠI HỌC VĂN HIẾN</h2>
      <h3>(11/7/1997 - 11/7/2021)</h3>
      <span>VHUers Check-in mừng sinh nhật trường</span>
    </b-row>
    <b-row id="formHeading" class="mt-5 justify-content-center">
      <b-col lg="6" sm="12">
        <h6>Gửi lời chúc ý nghĩa nhất của bạn</h6>
        <h3>Thông tin và lời chúc!</h3>
      </b-col>
    </b-row>
    <b-row class="mt-3 mb-5 justify-content-center">
      <b-col lg="6" sm="12" id="formInputs">
        <b-alert tabindex="-1" id="errors-holder" v-if="errors.length" variant="danger"
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
        <b-form-group class="my-2" id="role" label="Bạn là:" v-slot="{ ariaDescribedby }">
          <b-form-radio-group
            v-model="selected"
            :options="options"
            :aria-describedby="ariaDescribedby"
            name="role"
            size="lg"
            plain
          ></b-form-radio-group>
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
        <b-form-group class="my-2" id="avtImage" label="Chọn file ảnh đại diện hoặc kéo thả vào đây (Ảnh không quá 10MB)..." label-for="avtImage">
          <b-form-file
            v-model="avtImage"
            plain
            :state="Boolean(avtImage) && imageValid && imageValid!==null"
            id="avtInput"
            ref="avtImage"
            accept=".jpg, .png, .jpeg"
            @change="checkImage()"
          ></b-form-file>
          <b-form-invalid-feedback v-if="!imageValid && imageValid!==null">
            {{checkImage()}}
          </b-form-invalid-feedback>
        </b-form-group>
        <b-button v-b-modal.modal-1 @click="submitGreeting" variant="primary" class="w-100 my-2 submit-button">Gửi lời chúc!</b-button>
      </b-col>
    </b-row>
    <b-row class="my-3 greetings-section" data-aos="fade-up"
    data-aos-duration="1500">
      <b-row class="mt-5 justify-content-center">
        <h3 class="greeting-heading">Đã có {{total}} lời chúc được gửi đến</h3>
      </b-row>
      <b-row class="mt-3 mb-5 mx-auto">
        <b-col lg="6" md="12" sm="12" class="scroll-container" data-aos="fade-up"
          data-aos-offset="200"
          data-aos-delay="100"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
          data-aos-once="false">
          <b-card-group class="my-2" v-for="greeting in greetings" :key="greeting._id">
            <b-card :title="`${greeting.role!==undefined?greeting.role:''} ${greeting.name}`" :sub-title="`${greeting.faculty}`">
              <b-card-text>
                {{greeting.greeting}}
              </b-card-text>
            </b-card>
          </b-card-group>
        </b-col>
        <b-col lg="6" md="12" sm="12" id="campus-image">
          <b-img src="https://i.vgy.me/mRkuyF.jpg" id="vhu-campus" fluid alt="vhu-campus"></b-img>
        </b-col>
      </b-row>
    </b-row>
    <div>
      <b-modal v-if="flag" no-close-on-backdrop ref="modal-1" id="modal-1" title="Tải về Frame hình" hide-footer>
        <b-progress :max="max" v-show="modalProgress" show-progress :animated="true">
          <b-progress-bar :value="value" :label-html="`Rendering... ${value}%`" variant="success"></b-progress-bar>
        </b-progress>
        <b-row id="frame" class="d-block mx-auto text-center">
          <canvas v-show="canvasProgress" class="d-block mx-auto" ref="canvas" id="main-frame" width=8510 height=3150></canvas>
          <span class="text-secondary mb-4">*Lưu ý: trên một số thiết bị điện thoại, ảnh preview trên có thể bị vỡ và chỉ xem được đúng kích thước khi tải về</span>
        </b-row>
        <b-row class="mt-3 w-75 mx-auto" v-if="!sendSuccess">
          <b-button @click="createGreeting()" :disabled="clicked" block variant="primary" size="lg">Gửi lời chúc!</b-button>
        </b-row>
        <b-row class="my-4 w-25 mx-auto" v-if="!sendSuccess">
          <b-button @click="$bvModal.hide('modal-1'); closeModal();" size="md" variant="outline-dark">Hủy, viết lại</b-button>
        </b-row>
        <b-row class="my-4 w-100 mx-auto" v-if="sendSuccess">
          <p class="my-4">Lời chúc được gửi thành công, bạn có thể tải ảnh bằng nút sau!<br></p>
          <b-button @click="downloadImage()" variant="primary" size="lg">Tải xuống ảnh!</b-button>
        </b-row>
      </b-modal>
    </div>
  </div>
</template>

<script>
import GreetingService from '../GreetingService';
import FacultyService from '../FacultyService';
import frameImage from "../assets/banner.png";

export default {
  name: 'Greetings',
  data() {
    return {
      greetings: [],
      total: 0,
      faculties: [],
      errors: [],
      name: '',
      faculty: null,
      greeting: '',
      nameValid: null,
      facultyValid: null,
      greetingValid: null,
      imageValid: null,
      avtImage: null,
      dismissSecs: 15,
      dismissCountDown: 0,
      flag: false,
      facultyName: null,
      modalProgress: true,
      max: 100,
      value: 0,
      timer: 0,
      canvasProgress: false,
      currentY: 500,
      sendSuccess: false,
      clicked: false,
      selected: 'Sinh viên',
        options: [
          { text: 'Sinh viên', value: 'Sinh viên' },
          { text: 'Cựu sinh viên', value: 'Cựu sinh viên' },
        ]
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
      let greetings = getGreetings.greetings
      greetings.forEach(greeting => {
        for(let i = 0; i<getFaculties.length; i++){
          if(greeting.faculty == getFaculties[i]._id){
            greeting.faculty = getFaculties[i].name;
          }
        }
      })
      this.greetings = greetings;
      this.total = getGreetings.total;
    } catch(err) {
      this.errors.push("Can't connect to database, try again later!");
    }
  },
  methods: {
    startTimer() {
      let timer = setInterval(() => {
        this.value += 10;
        if(this.value > 100) {
          clearInterval(timer);
          this.value = 0;
        }
      }, 250);
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    closeModal(){
      this.flag = false;
      this.currentY = 500;
      this.modalProgress = true;
      this.canvasProgress = false;
      this.clicked = false;
    },
    submitGreeting(){
      this.errors = [];
      this.name = this.name.replace(/\s\s+/g, ' ').trim();
      let flag = true;
      let facultyName = '';
      const facultiesIDs = this.faculties.map(item=>{
        return item.value;
      });
      facultiesIDs.shift();
      let checkForName = this.checkName();
      let checkForGreeting = this.checkGreeting();
      if(!this.selected === "Sinh viên" || !this.selected === "Cựu sinh viên") {
        this.errors.push("Role này không có trong hệ thống!");
        flag = false;
      }
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
      let file = this.$refs.avtImage.files[0];
      if(this.avtImage==null) {
        this.errors.push("Ảnh không được để trống!");
        flag = false;
      } else if(file.size > 10485760) {
        this.errors.push("Ảnh không được lớn hơn 10MB!");
        flag = false;
      }
      if(this.errors.length > 0) {
        document.getElementById("formInputs").scrollIntoView({behavior: 'smooth', block: "start"});
        return false;
      }
      if(flag) {
        this.flag = flag;
        this.facultyName = facultyName;
        this.renderImage();
      }
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
    crop(url, aspectRatio) {
      return new Promise((resolve) => {
        const inputImage = new Image();
        inputImage.onload = () => {
          const inputWidth = inputImage.naturalWidth;
          const inputHeight = inputImage.naturalHeight;
          const inputImageAspectRatio = inputWidth / inputHeight;
          let outputWidth = inputWidth;
          let outputHeight = inputHeight;
          if (inputImageAspectRatio > aspectRatio) {
            outputWidth = inputHeight * aspectRatio;
          } else if (inputImageAspectRatio < aspectRatio) {
            outputHeight = inputWidth / aspectRatio;
          }
          const outputX = (outputWidth - inputWidth) * 0.5;
          const outputY = (outputHeight - inputHeight) * 0.5;
          const frame = document.getElementById("frame");
          const canvas = document.createElement("canvas");
          const outputImage = frame.appendChild(canvas);
          outputImage.width = outputWidth;
          outputImage.height = outputHeight;
          const ctx = outputImage.getContext("2d");
          ctx.drawImage(inputImage, outputX, outputY);
          ctx.globalCompositeOperation='destination-in';
          ctx.beginPath();
          ctx.arc(outputImage.width/2,outputImage.height/2,outputImage.height/2,0,Math.PI*2);
          ctx.closePath();
          ctx.fill();
          canvas.setAttribute("style", "display : none");
          resolve(outputImage);
        };
        inputImage.src = url;
      });
    },
    wrapText(ctx, greeting, x, y, maxWidth, lineHeight){
      let words = greeting.split(" ");
        let line = '';
        for(let n = 0; n<words.length; n++){
          let testLine = line + words[n] + " ";
          let metrics = ctx.measureText(testLine);
          let testWidth = metrics.width;
          if(testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          } else {
            line = testLine;
          }
          ctx.fillText(line, x, y);
          this.currentY = y;
        }
    },
    renderImage(){
      this.startTimer();
      setTimeout(async ()=>{
        this.modalProgress = false;
        this.canvasProgress = true;
        this.greeting = this.greeting.trim();
        let c = this.$refs.canvas;
        let ctx = c.getContext('2d');
        let name = this.name;
        let facultyName = this.facultyName;
        let greeting = this.greeting;
        let avtCrop = await this.crop(URL.createObjectURL(this.avtImage), 1);
        let sources = {
          image1: frameImage,
          image2: avtCrop.toDataURL("image/png")
        };
        this.loadImages(sources, images => {
          const frame = images.image1;
          const avt = images.image2;
          ctx.drawImage(frame, 0, 0, frame.width, frame.height, 0, 0, c.width, c.height);
          ctx.drawImage(avt, 0, 0, avt.width, avt.height, 6100, 685, 1800, 1800);
          ctx.fillStyle = "white";
          ctx.textAlign = "start";
          greeting.length <= 400?ctx.font="bold 150px roboto":ctx.font="bold 120px roboto";
          if(greeting.match(/\r?\n|\r/g)){
            const breakline = greeting.split("\n");
            breakline.forEach(line => {
              this.wrapText(ctx, line, 500, this.currentY+150, 5000, 150);
            })
          } else {
            this.wrapText(ctx, greeting, 500, 1100, 5000, 150);
          }
          ctx.textAlign = "left";
          ctx.font = "bold 150px Roboto";
          const role = this.selected;
          ctx.fillText(role, 500, this.currentY + 200)
          const roleWidth = ctx.measureText(" "+role);
          ctx.fillText(" "+name.toUpperCase(), roleWidth.width+500, this.currentY+200);
          const nameWidth = ctx.measureText(name.toUpperCase()+" ");
          ctx.fillText(" - "+facultyName.toUpperCase(), nameWidth.width+500+roleWidth.width, this.currentY+200);
        });
      }, 2500);
    },
    downloadImage(){
      let canvas = this.$refs.canvas;
      if(window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(canvas.msToBlob(), "frame-24-nam.png");
      } else {
        const frame = document.getElementById("frame");
        const a = document.createElement("a");
        frame.appendChild(a);
        a.href = canvas.toDataURL("image/png");
        a.download = "frame-24-nam.png";
        a.click();
        frame.removeChild(a);
      }
    },
    checkName(){
      let namecheck = this.name;
      const namePattern = /^([\p{L}\s]+)$/gu;
      this.name = this.name.replace(/\s\s+/g, ' ');
      if(!namecheck.replace(/\s/g, '').length){
        this.nameValid = false;
        return "Vui lòng nhập tên!"
      }else if(namecheck.length <= 2){
        this.nameValid = false;
        return "Tên quá ngắn"
      }else if(namecheck.length >30){
        this.nameValid = false;
        return "Tên không được vượt 30 chữ cái"
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
      const greetingPattern = /[`@#$%^*_+\=\[\]{}\\|<>~]/g;
      const breaklinePattern = /\n\s*\n/g;
      if(greetingcheck == ""){
        this.greetingValid = false;
        return "Vui lòng nhập lời chúc!"
      }else if(greetingcheck.length <= 20){
        this.greetingValid = false;
        return "Lời chúc phải dài hơn 20 kí tự"
      }else if(greetingcheck.length >=900){
        this.greetingValid = false;
        return "Lời chúc không quá hơn 900 kí tự"
      }else if(greetingPattern.test(greetingcheck)){
        this.greetingValid = false;
        return "Lời chúc không được chứa ký tự đặc biệt như: `@#$%^*_+-=|<>~"
      }else if(breaklinePattern.test(greetingcheck)){
        this.greetingValid = false;
        return "Không được có nhiều xuống dòng!"
      }else{
        this.greetingValid = true;
        return true;
      }
    },
    checkImage(){
      let file = this.$refs.avtImage.files[0];
      if(file==null) {
        this.imageValid = false;
        return "Ảnh không được để trống!"
      } else if(file.size > 10485760) {
        document.getElementById('avtInput').classList.add("red-shadow");
        this.imageValid = false;
        return "Ảnh không được lớn hơn 10MB!"
      }else{
        document.getElementById('avtInput').classList.remove("red-shadow");
        this.imageValid = true;
        return true;
      }
    },
    async createGreeting() {
      this.errors = [];
      this.clicked = true;
      const res = await GreetingService.insertGreeting(this.name, this.selected, this.faculty, this.greeting);
      this.renderImage();
      if(res.status==201){
        this.sendSuccess = true;
        this.currentY = 500;
      } else {
        Object.keys(res).forEach(key => {
          this.errors.push(res[key]);
        });
        this.$refs['modal-1'].hide();
        document.getElementById("errors-holder").scrollIntoView({behavior: 'smooth', block: "center"});
        this.flag = false;
        this.currentY = 500;
        this.modalProgress = true;
        this.canvasProgress = false;
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

#avtInput {
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
#role {
  text-align: left;
  color: #696F79;
}
#role > legend {
  font-weight: bold;
}
.red-shadow{
  color:#dc3545;
  border: 1px solid #dc3545;
  box-shadow: 0 0px 3px 0 #dc3545, 
              0 0px 5px 0 #dc3545;
}
.greetings-section {
  background: linear-gradient(180deg, #0192DE 0%, #BBC7DF 105.73%);
}
.greeting-heading{
  -webkit-text-stroke: 0.5px #fff;
  font-weight: 900;
  font-size: 2rem;
  text-shadow: 0px 0px 5px #fff;
  text-transform: uppercase;
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
  display: none;
}
.modal-dialog{
  max-width: 900px;
}
#main-frame {
  width: 851px;
  height: 315px;
}
@media only screen and (max-width: 1280px) {
  #campus-image{
    display: none;
  }
}
@media only screen and (max-width: 600px) {
  #campus-image{
    display: none;
  }
}
</style>
