
import messaging from '@react-native-firebase/messaging';
import store from  '../src/redux-stuff/store';
import {
  addToPushLog
} from '../src/redux-stuff/furnacesSlice';

export default class FirebaseStuff {
  static init() {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
        store.dispatch(addToPushLog('Message handled in the background! \n' + remoteMessage.notification.title + '\n' + remoteMessage.notification.body));
    });
    messaging().onMessage(async remoteMessage => {
    store.dispatch(addToPushLog('A new FCM message arrived! \n' + remoteMessage.notification.title + '\n' + remoteMessage.notification.body));
    });
    
    // //later this may be elsewhere
    // this.subscribeToTopic();
  }

  static subscribeToTopic(previousTopic, newTopic) {
    messaging()
    .unsubscribeFromTopic(previousTopic)
    .then(() => {
        store.dispatch(addToPushLog('Subscribed to topic!'));
    });
    messaging()
    .subscribeToTopic(newTopic)
    .then(() => {
        store.dispatch(addToPushLog('Unsubscribed to topic!'));
    });
  }

  static createTopic(mobileUser) {
    return 'ssi-topic-121170fb-95bd-464e-a2ad-9026908799b6--' + mobileUser.id;
  }
}