// import {useNavigation} from '@react-navigation/native';
// import React, {useState, useCallback, useEffect} from 'react';
// import {
//   View,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   SafeAreaView,
//   Linking,
// } from 'react-native';
// import SplashScreen from 'react-native-splash-screen';
// import {API, post} from '../../../api/config/APIController';
// import Colors from '../../../assets/colors';
// import CustomButton from '../../../components/CustomButton';
// import Label from '../../../components/Label';
// import LoadingIndicator from '../../../components/Loading';
// import TextInput from '../../../components/TextInput';
// import globalImagePath from '../../../constants/Images';
// import {showMessage, hideMessage} from 'react-native-flash-message';
// // import useStore from '../../../zustand/store';

// const LoginScreen = () => {
//   const [mobileNumber, setMobileNumber] = useState('');

//   const [loading, setLoading] = useState(false);
//   const navigation = useNavigation();
//   useEffect(() => {
//     SplashScreen.hide();
//     return () => {};
//   }, []);

//   function sendOTP() {
//     if (mobileNumber.length != 10) {
//       showMessage({
//         message: 'Please enter the mobile number',
//         type: 'danger',
//       });
//       return;
//     }
//     let params = {
//       mobile_number: mobileNumber,
//       country_code: '+91',
//     };
//     setLoading(true);

//     post(API.SENDOTP, params, true)
//       .then(response => {
//         setLoading(false);
//         if (response.status == 200) {
//           showMessage({
//             message: response.data.message,
//             type: 'success',
//           });
//         } else {
//           showMessage({
//             message: response.data.message,
//             type: 'danger',
//           });
//         }
//         navigation.navigate('OTPVerify', {mobileNumber: mobileNumber});
//       })
//       .catch(error => {
//         setLoading(false);
//         showMessage({
//           message: 'Please try again!',
//           type: 'danger',
//         });
//       });
//   }

//   return (
//     <View
//       style={{
//         flex: 1,
//         backgroundColor: Colors.white,
//         paddingHorizontal: 16,
//       }}>
//       <SafeAreaView />

//       <LoadingIndicator loading={loading} />
//       <View
//         style={{
//           justifyContent: 'center',
//           paddingHorizontal: 16,
//           alignItems: 'center',
//           marginTop: '15%',
//         }}>
//         <Image
//           style={{width: '80%', height: 100, resizeMode: 'contain'}}
//           source={globalImagePath.logo}
//         />
//       </View>
//       <View
//         style={{
//           paddingHorizontal: 16,
//           justifyContent: 'center',
//           marginTop: '30%',
//         }}>
//         <View style={{}}>
//           <Label
//             style={{fontSize: 18, fontWeight: '700', marginBottom: 20}}
//             title="Hello there !"
//           />
//           <Label
//             style={{
//               fontSize: 15,
//               color: 'rgba(27, 27, 27, 0.7)',
//             }}
//             title="Welcome"
//           />
//           <Label
//             style={{
//               fontSize: 11,
//               marginTop: 8,
//               color: Colors.lightGray,
//               marginBottom: 24,
//             }}
//             title="Sign in to continue with your mobile number"
//           />
//         </View>
//         <View style={styles.textInputContainer}>
//           <View style={styles.flagContainer}>
//             <Image style={styles.flag} source={globalImagePath.flag} />
//             <Label title={'+91'} />
//           </View>
//           <View style={styles.inputStyle}>
//             <TextInput
//               isPlaceHolder={false}
//               style={{borderColor: Colors.transparent}}
//               placeholder={'Mobile Number'}
//               keyboardType={'numeric'}
//               maxLength={10}
//               value={mobileNumber}
//               onChangeText={value => {
//                 setMobileNumber(value);
//               }}
//             />
//           </View>
//         </View>
//         <View style={{marginTop: 8}}>
//           <Label
//             style={{
//               fontSize: 11,
//               marginTop: 8,
//               color: Colors.lightGray,
//               marginBottom: 24,
//             }}
//             title="A 4 Digit OTP will be sent through SMS to verify your mobile number"
//           />
//         </View>
//         <CustomButton
//           title={'Continue'}
//           onPress={() => {
//             sendOTP();
//           }}
//         />
//       </View>
//       <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
//         <TouchableOpacity
//           onPress={() => {
//             let url = 'https://healthuno.com/';
//             Linking.canOpenURL(url).then(supported => {
//               if (supported) {
//                 Linking.openURL(url);
//               } else {
//                 console.log("Don't know how to open URI: " + url);
//               }
//             });
//           }}>
//           <Label
//             style={{
//               fontSize: 15,
//               marginTop: 8,
//               color: Colors.primaryColor,
//             }}
//             title="Are you a Doctor?"
//           />
//         </TouchableOpacity>
//       </View>
//       <SafeAreaView />
//     </View>
//   );
// };
// export default LoginScreen;

// const styles = StyleSheet.create({
//   textInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderColor: '#cdcdcd',
//     borderWidth: 1,
//     borderRadius: 6,
//   },
//   flagContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 8,
//   },
//   flag: {
//     marginHorizontal: 8,
//   },
//   inputStyle: {
//     flex: 1,
//   },
// });
