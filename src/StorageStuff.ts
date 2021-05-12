import AsyncStorage from '@react-native-async-storage/async-storage';

export default class StorageStuff {
    static async saveUsername(username: string) {
        await AsyncStorage.setItem('@username', username)
    }

    static async getUsername(): Promise<string> {
        return await AsyncStorage.getItem('@username');
    }
}