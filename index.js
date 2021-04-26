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
  .subscribeToTopic('matt-topic')
  .then(() => {
    store.dispatch(addToPushLog('Subscribed to topic!'));
  });

messaging().setBackgroundMessageHandler(async remoteMessage => {
  store.dispatch(addToPushLog('Message handled in the background! ' + JSON.stringify(remoteMessage)));
});

messaging().onMessage(async remoteMessage => {
  store.dispatch(addToPushLog('A new FCM message arrived! ' +  JSON.stringify(remoteMessage)));
});

const Root = () => (
    <Provider store={store}>
        <App />
    </Provider>
  )

AppRegistry.registerComponent(appName, () => Root);
