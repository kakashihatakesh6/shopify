import { StyleSheet, Text, View, Image, KeyboardAvoidingView, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Zocial } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleRegister = async () => {

        // Send a post request to the backend API
        try {
            const user = {
                name: name,
                email: email,
                password: password
            }
            console.log("Register CLient", user);
            const response = await axios.post(`${process.env.IP_ADDRESS}/register`, user, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data =  response;

            Alert.alert(
                "Registration Successful!",
                "You have registered successfully"
            );
            setName("");
            setEmail("");
            setPassword("");

            console.log("User Registered Successfully");
            console.log(data);

        } catch (error) {
            Alert.alert(
                "Registration Error",
                "an error occurred during registration"
            );
            console.log("Registration failed", error);
        }
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", alignItems: 'center', marginTop: 50}}>
            <View>
                <Image style={{ width: 150, height: 100, resizeMode: 'contain' }}
                    source={require('../assets/wearme-bar.png')}
                />
            </View>

            <KeyboardAvoidingView>

                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 12, color: "#041E42" }}>Register to your account</Text>
                </View>

                <View style={{ marginTop: 50 }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        backgroundColor: "#D0D0D0",
                        paddingVericle: 5,
                        borderRadius: 5,
                        marginTop: 30
                    }}>

                        <Ionicons style={{
                            marginLeft: 8,
                        }} name="person" size={24} color="black" />
                        <TextInput value={name} onChangeText={text => setName(text)}
                            style={{
                                color: "gray",
                                marginVertical: 10,
                                width: 300,
                                fontSize: name ? 18 : 16
                            }} placeholder="Enter your name" />
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

                <Pressable onPress={handleRegister} style={{
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
                    }}>Register</Text>
                </Pressable>

                <Pressable onPress={() => navigation.navigate("Login")} style={{
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

export default RegisterScreen

const styles = StyleSheet.create({})