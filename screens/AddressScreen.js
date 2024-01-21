import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { TextInput } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { UserType } from '../UserContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const AddressScreen = () => {

    const [name, setName] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [houseNo, setHouseNo] = useState("");
    const [street, setStreet] = useState("");
    const [landmarks, setLandmarks] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const { userId, setUserId } = useContext(UserType)
    const navigation = useNavigation();

    useEffect(() => {

        const fetchUser = async () => {
            const token = await AsyncStorage.getItem("authToken");
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;
            setUserId(userId)
        }

        fetchUser()

    }, [])

    console.log("User ID => ", userId)
    const handleAddAddress = async () => {
        const Address = {
            name,
            mobileNo,
            houseNo,
            street,
            landmarks,
            postalCode,
        }
        

        const res = await axios.post(`${process.env.IP_ADDRESS}/addresses`, { userId, Address });
        try {
            Alert.alert("Success", "Addresses added successfully");
            setName("");
            setMobileNo("");
            setHouseNo("");
            setStreet("");
            setLandmarks("");
            setPostalCode("");

            setTimeout(() => {
                navigation.goBack();
            }, 500)

            console.log("Success res is => ", res.data.Address);
        } catch (error) {
            Alert.alert("Error", "Failed to add address")
            console.log("Error", error)
        }

    }


    return (
        <ScrollView style={{ marginTop: 50 }}>
            <View style={{ height: 50, backgroundColor: "#00CED1" }} />

            <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 17, fontWeight: "bold" }}>Add a new Address</Text>
                <TextInput placeholderTextColor={"black"} placeholder='india'
                    style={{
                        padding: 10,
                        borderColor: "#D0D0D0",
                        borderWidth: 1,
                        marginTop: 10,
                        borderRadius: 5
                    }} />


                <View style={{ marginVertical: 10 }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>Full Name (First and Last Name)</Text>
                    <TextInput
                        value={name}
                        onChangeText={(text) => setName(text)}
                        placeholderTextColor={"black"}
                        style={{
                            padding: 10,
                            borderColor: "#D0D0D0",
                            borderWidth: 1,
                            marginTop: 10,
                            borderRadius: 5
                        }}
                         placeholder="Enter your Name" />
                </View>

                <View>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>Mobile Number</Text>
                    <TextInput
                        value={mobileNo}
                        onChangeText={(text) => setMobileNo(text)}
                        placeholderTextColor={"black"}
                        style={{
                            padding: 10,
                            borderColor: "#D0D0D0",
                            borderWidth: 1,
                            marginTop: 10,
                            borderRadius: 5
                        }} placeholder="Mobile No" />
                </View>

                <View>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>Flat,House No,Building,Company</Text>
                    <TextInput
                        value={houseNo}
                        onChangeText={(text) => setHouseNo(text)}
                        placeholderTextColor={"black"}
                        style={{
                            padding: 10,
                            borderColor: "#D0D0D0",
                            borderWidth: 1,
                            marginTop: 10,
                            borderRadius: 5
                        }} />
                </View>

                <View>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>Area, Street, Sector, Village</Text>
                    <TextInput
                        value={street}
                        onChangeText={(text) => setStreet(text)}
                        placeholderTextColor={"black"}
                        style={{
                            padding: 10,
                            borderColor: "#D0D0D0",
                            borderWidth: 1,
                            marginTop: 10,
                            borderRadius: 5
                        }} />
                </View>

                <View>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>Landmark</Text>
                    <TextInput
                        value={landmarks}
                        onChangeText={(text) => setLandmarks(text)}
                        placeholderTextColor={"black"}
                        style={{
                            padding: 10,
                            borderColor: "#D0D0D0",
                            borderWidth: 1,
                            marginTop: 10,
                            borderRadius: 5
                        }} placeholder='Eg near appollo hospital' />
                </View>

                <View>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>Pincode</Text>
                    <TextInput
                        value={postalCode}
                        onChangeText={(text) => setPostalCode(text)}
                        placeholderTextColor={"black"}
                        style={{
                            padding: 10,
                            borderColor: "#D0D0D0",
                            borderWidth: 1,
                            marginTop: 10,
                            borderRadius: 5
                        }} placeholder='Enter Pincode' />
                </View>

            </View>

            <Pressable onPress={handleAddAddress}
                style={{ backgroundColor: "#FFC72C", padding: 19, borderRadius: 6, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontWeight: "bold" }}>Add Address</Text>
            </Pressable>


        </ScrollView>
    )
}

export default AddressScreen

const styles = StyleSheet.create({})