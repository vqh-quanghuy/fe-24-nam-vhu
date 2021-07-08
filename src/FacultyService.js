import axios from 'axios';

const url = '/api/ds-khoa/';
class FacultyService {
  // Get Falcuties
  static async getFaculties() {
    try {
      const res = await axios.get(url);
      const data = res.data;
      data.map(faculty => ({
        ...faculty,
        createdAt: new Date(faculty.createdAt)
      }))
      return data;
    } catch(err) {
      return err;
    }
  }
}
export default FacultyService;