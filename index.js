//added by Matt for react native navigation
//https://reactnavigation.org/docs/getting-started
import 'react-native-gesture-handler';

import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import { Provider } from 'react-redux';
import store from './src/redux-stuff/store';

import messaging from '@react-native-firebase/messaging';

import {
  addToPushLog
} from './src/redux-stuff/furnacesSlice';

messaging()
  .subscribeToTopic('ssi-topic-121170fb-95bd-464e-a2ad-9026908799b6--057d6f7d-e36d-460a-80e9-c128c55a3a15')
  .then(() => {
    store.dispatch(addToPushLog('Subscribed to topic!'));
  });

messaging().setBackgroundMessageHandler(async remoteMessage => {
  store.dispatch(addToPushLog('Message handled in the background! ' + remoteMessage.notification.title + '\n' + remoteMessage.notification.body));
});

messaging().onMessage(async remoteMessage => {
  store.dispatch(addToPushLog('A new FCM message arrived! \n' + remoteMessage.notification.title + '\n' + remoteMessage.notification.body));
});

const Root = () => (
    <Provider store={store}>
        <App />
    </Provider>
  )

AppRegistry.registerComponent(appName, () => Root);
