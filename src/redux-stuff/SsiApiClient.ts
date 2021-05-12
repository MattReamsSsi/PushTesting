import axios from 'axios';

async function doGet(path) {
  try {
    console.log("before response");
    const response = await axios.get(path);
    console.log("after response");
    return response.data;
  }
  catch(err) {
    console.log("was error")
  }
}

const ipAddress = '192.168.1.99';

export default class SsiApiClient {
  
  static async authenticateUser() {
    console.log("api.auth");
    return doGet(`http://${ipAddress}:56697/api/public/authenticate/username/password`);
  }

}
