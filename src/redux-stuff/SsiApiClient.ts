import axios from 'axios';
import {MobileUser} from '../DataStructures';

async function doGet(path) {
  const response = await axios.get(path);
  return response.data;
}

const ipAddress = '192.168.1.99';

export default class SsiApiClient {
  
  static async authenticateUser(username: string, password: string): Promise<{authenticated: boolean, user: MobileUser, nodeId: string}> {

    console.log("about to auth");

    try {
      const ret = await doGet(`http://${ipAddress}:56697/api/public/authenticate/${username}/${password}`);
      console.log("was valid: " + ret);
      if(ret === "Valid") {

        console.log("inside value");

        const users = await doGet(`http://${ipAddress}:56697/api/public/users`) as MobileUser[];
        console.log("users are: " + JSON.stringify(users));

        const nodeId = await doGet(`http://${ipAddress}:56697/api/public/nodeId`);

        console.log("nodeId is: " + nodeId);

        console.log("users.length: " + users.length);
        const usersFiltered = users.filter(v => v.userName === username);
        console.log("usersFiltered.length: " + usersFiltered.length);
        const user = usersFiltered[0];
        console.log("userName: " + user.userName);
        if(user !== undefined) {
          return {authenticated: true, user, nodeId};
        }
      }
      return {authenticated: false, user: null, nodeId: null};
    }
    catch(err) {
      return {authenticated: false, user: null, nodeId: null};
    }
  }

}
