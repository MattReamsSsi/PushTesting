//added by Matt for react native navigation
//https://reactnavigation.org/docs/getting-started
import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import { Provider } from 'react-redux';
import store from './src/redux-stuff/store';

import messaging from '@react-native-firebase/messaging';

messaging()
  .subscribeToTopic('matt-topic')
  .then(() => console.log('Subscribed to topic!'));

const Root = () => (
    <Provider store={store}>
        <App />
    </Provider>
  )

AppRegistry.registerComponent(appName, () => Root);
