import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

const Another = ({ navigation }) =>  {

    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <Text>header right</Text>
          ),
          headerTitle: () => <Text>header title</Text>,
          headerLeft: () => <Button title="back" type="outline" onPress={() => navigation.goBack()} icon={
            <Icon
              name="arrow-right"
              size={15}
              color="blue"
            />
          }/>
        });
      }, [navigation]);

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Another Screen</Text>
      </View>
    );
  }

export default Another;