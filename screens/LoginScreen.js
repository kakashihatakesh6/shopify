import { StyleSheet, Text, View, Image, KeyboardAvoidingView, Pressable, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Zocial } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginScreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigation = useNavigation();

    useEffect(() => {
      const checkLoginStatus = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            if (token) {
                navigation.replace("Main")
            }
        } catch (error) {
            console.log("Error message", error)
        }
      }
      checkLoginStatus();
      console.log("IP => ", process.env.IP_ADDRESS)
    }, [])
    

    const handleLogin = async () => {
        console.log("Clinet login => ",email, password)
        try {
            const user = {
                email: email,
                password: password
            }
            const res = await axios.post(`${process.env.IP_ADDRESS}/login`, {user});
            // const res = await axios.post(`http://localhost:8000/login`, {user});
            const token = await res.data.token;
            console.log("authToken => ",token);
            AsyncStorage.setItem("authToken", token);
            navigation.replace("Main");

        } catch (error) {
            Alert.alert("Login Error", "Invalid Email");
            console.log("Login Error ", error);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", alignItems: 'center', marginTop: 50 }}>
            <View>
                <Image style={{ width: 150, height: 100, resizeMode: 'contain' }}
                    source={require('../assets/wearme-bar.png')}
                />
            </View>

            <KeyboardAvoidingView>

                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 12, color: "#041E42" }}>Login to your account</Text>
                </View>

                <View style={{ marginTop: 70 }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        backgroundColor: "#D0D0D0",
                        paddingVericle: 5,
                        borderRadius: 5,
                        marginTop: 30
                    }}>
                        <Zocial style={{
                            marginLeft: 8,

                        }} name="email" size={24} color="black" />
                        <TextInput value={email} onChangeText={text => setEmail(text)}
                            style={{
                                color: "gray",
                                marginVertical: 10,
                                width: 300,
                                fontSize: email ? 18 : 16
                            }} placeholder="Enter your email" />
                    </View>
                </View>

                <View style={{ marginTop: 10 }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        backgroundColor: "#D0D0D0",
                        paddingVericle: 5,
                        borderRadius: 5,
                        marginTop: 30
                    }}>
                        <MaterialIcons style={{ marginLeft: 8 }} name="lock-outline" size={24} color="black" />
                        <TextInput value={password} onChangeText={text => setPassword(text)}
                            style={{
                                color: "gray",
                                marginVertical: 10,
                                width: 300,
                                fontSize: password ? 18 : 16
                            }} placeholder="Enter your password" secureTextEntry={true} />
                    </View>
                </View>

                <View style={{
                    marginTop: 12,
                    flexDirection: "row",
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Text>Keep me logged in</Text>
                    <Text style={{ color: '#007FFF' }}>Forgot Password</Text>
                </View>

                <View style={{ marginTop: 50 }}></View>

                <Pressable onPress={handleLogin} style={{
                    width: 200,
                    backgroundColor: "#FEBE10",
                    borderRadius: 6,
                    marginLeft: "auto",
                    marginRight: "auto",
                    padding: 15
                }}>
                    <Text style={{
                        textAlign: "center",
                        color: "white",
                        fontSize: 16,
                        fontWeight: "bold"
                    }}>Login</Text>
                </Pressable>

                <Pressable onPress={() => navigation.navigate("Register")} style={{
                    marginTop: 15
                }}>
                    <Text style={{
                        textAlign: 'center',
                        color: 'gray',
                        fontSize: 16
                    }}>Don't have a account? Sign Up</Text>
                </Pressable>



            </KeyboardAvoidingView>




        </SafeAreaView>

    )
}

export default LoginScreen

const styles = StyleSheet.create({})