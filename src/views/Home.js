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
  fetchFurnacesAndStuff,
  selectFurnaces,
  selectStatus
} from '../redux-stuff/furnacesSlice';

const Home = ({ navigation }) => {

  const count = useSelector(selectCount);
  const status = useSelector(selectStatus);
  const furnaces = useSelector(selectFurnaces);

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
            title="Go to Another"
            onPress={() => navigation.navigate('Another')}
            type="outline"
        />
        <Button
          onPress={() => dispatch(fetchFurnacesAndStuff())}
          title={"fetch furnaces"}
          type="outline"
        />
        <Text>{status}</Text>
        {/* <Text>{JSON.stringify(furnaces)}</Text> */}
        <Text>furnaces below:</Text>
        {Object.values(furnaces).map((furnace) => 
          <Button
            key={furnace.id}
            title={furnace.name}
            type="outline"
            onPress={() => navigation.navigate('PyroDetails', {furnace})}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Home;