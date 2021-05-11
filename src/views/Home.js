import React from 'react';
import {
  SafeAreaView,
  Text,
  View
} from 'react-native';

import { Button } from 'react-native-elements';

import { useSelector, useDispatch } from 'react-redux';

import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  selectCount,
} from '../redux-stuff/counterSlice';

import {
  selectPushLog
} from '../redux-stuff/furnacesSlice';

const Home = ({ navigation }) => {

  const count = useSelector(selectCount);
  const pushLog = useSelector(selectPushLog);

  const dispatch = useDispatch();

  return (
    <SafeAreaView>
      <View>
        <Button
          onPress={() => dispatch(increment())}
          title={"count " + count}
          //color="#841584"
          titleStyle={{
            color:"#841584"
          }}
          buttonStyle={{
            borderColor: "#841584",
            borderTopColor: "green"
          }}
          type="outline"
        />
        <Button
            title="Go to LoginPage"
            onPress={() => navigation.navigate('LoginPage')}
            type="outline"
        />

        <Text>push status below:</Text>
        {pushLog.map((v, i) => 
          <Text key={i}>{v}</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Home;