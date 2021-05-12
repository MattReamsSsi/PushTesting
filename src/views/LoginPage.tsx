import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { authenticateUser } from '../redux-stuff/furnacesSlice';

const LoginPage = ({ navigation }) => {

  const [username, setUsername] = useState('some');
  const [password, setPassword] = useState('thing');

  const dispatch = useDispatch();

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
      } />
    });
  }, [navigation]);

  return (
    <View>
      <Text>Login Page</Text>
      <Text>{"username: "}</Text>
      <TextInput
        style={styles.input}
        onChangeText={v => setUsername(v)}
        value={username}
        placeholder="username"
      />
      <Text>{"password: "}</Text>
      <TextInput
        style={styles.input}
        onChangeText={v => setPassword(v)}
        value={password}
        placeholder="password"
      />
      <Button
        title="Login"
        onPress={() => {
          console.log("something");
          dispatch(authenticateUser());
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 3,
    borderWidth: 1,
  },
});

export default LoginPage;