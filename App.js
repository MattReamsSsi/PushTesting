import React from 'react';
import {
  Text,
  View,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/FontAwesome';

import Home from './src/views/Home';
import Another from './src/views/Another';
import PyroDetails from './src/views/PyroDetails';
import InstrumentCalDetails from './src/views/InstrumentCalDetails';
import ThermocoupleCalDetails from './src/views/ThermocoupleCalDetails';
import InstrumentCalEditor from './src/views/InstrumentCalEditor';

const Tab = createBottomTabNavigator();

//https://reactnativeelements.com/docs/
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'react-native-elements';

const HomeStack = createStackNavigator();
function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="PyroDetails" component={PyroDetails} />
      <HomeStack.Screen name="InstrumentCalDetails" component={InstrumentCalDetails} />
      <HomeStack.Screen name="ThermocoupleCalDetails" component={ThermocoupleCalDetails} />
      <HomeStack.Screen name="InstrumentCalEditor" component={InstrumentCalEditor} />
    </HomeStack.Navigator>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
    
                if (route.name === 'Home') {
                  iconName = focused
                    ? 'home'
                    : 'bed';
                } else if (route.name === 'Another') {
                  iconName = focused ? 'bath' : 'cab';
                }
    
                // You can return any component that you like here!
                return <Icon name={iconName} size={size} color={color} />;
              },
            })}
            tabBarOptions={{
              activeTintColor: 'tomato',
              inactiveTintColor: 'gray',
            }}
          >
            <Tab.Screen name="Home" component={HomeStackScreen} />
            <Tab.Screen name="Another" component={Another} />
          </Tab.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
