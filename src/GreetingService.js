import axios from 'axios';

const url = 'http://localhost:5000/api/loi-chuc/';
class GreetingService {
  // Get Greetings
  static async getGreetings() {
    try{
      const res = await axios.get(url);
      const data = res.data;
      data.map(greeting => ({
        ...greeting,
        createdAt: new Date(greeting.createdAt)
      }))
      return data;
    } catch (err){
      return err;
    }
  }
  // New Greetings
  static async insertGreeting(name, faculty, greeting) {
    const result = axios.post(url, {
      name,
      faculty,
      greeting
    })
    .then(res => {
      return res;
    })
    .catch(err=> {
      if(err.response){
        return err.response.data;
      }
    });
    return result;
  }
}

export default GreetingService;