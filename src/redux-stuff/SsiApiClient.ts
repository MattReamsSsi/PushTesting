import axios from 'axios';

async function doGet(path) {
  const response = await axios.get(path);
  return response.data;
}

const ipAddress = '192.168.1.99';

export default class SsiApiClient {
  
  static async authenticateUser(username: string, password: string): Promise<string> {
    return doGet(`http://${ipAddress}:56697/api/public/authenticate/${username}/${password}`);
  }

}
