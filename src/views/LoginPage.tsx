import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { authenticateUser, getUserFromStorage, selectCurrentUser, selectCurrentTopic } from '../redux-stuff/furnacesSlice';

const LoginPage = ({ navigation }) => {

  const [username, setUsername] = useState('testuser');
  const [password, setPassword] = useState('ssississi');

  const currentUser = useSelector(selectCurrentUser);
  const currentTopic = useSelector(selectCurrentTopic);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserFromStorage());
  }, [dispatch]);//[dispatch] is so that this isn't called on each re-render.

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
      <Text>current user: {currentUser}</Text>
      <Text>current topic: {currentTopic}</Text>
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
          dispatch(authenticateUser({username, password}));
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