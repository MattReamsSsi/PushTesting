import axios from 'axios';
import {MobileUser} from '../DataStructures';

async function doGet(path) {
  const response = await axios.get(path);
  return response.data;
}

const ipAddress = '192.168.1.99';

export default class SsiApiClient {
  
  static async authenticateUser(username: string, password: string): Promise<{authenticated: boolean, user: MobileUser}> {
    try {
      const ret = await doGet(`http://${ipAddress}:56697/api/public/authenticate/${username}/${password}`);
      if(ret === "Valid") {
        const users = await doGet(`http://${ipAddress}:56697/api/public/users`) as MobileUser[];
        console.log("users.length: " + users.length);
        const usersFiltered = users.filter(v => v.userName === username);
        console.log("usersFiltered.length: " + usersFiltered.length);
        const user = usersFiltered[0];
        console.log("userName: " + user.userName);
        if(user !== undefined) {
          return {authenticated: true, user};
        }
      }
      return {authenticated: false, user: null};
    }
    catch(err) {
      return {authenticated: false, user: null};
    }
  }

}
