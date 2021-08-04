import {useNavigation} from '@react-navigation/native';
import React, {useState, useRef, useCallback, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import SplashScreen from 'react-native-splash-screen';
import Colors from '../../../assets/colors';
import CustomButton from '../../../components/CustomButton';
import Label from '../../../components/Label';
import OTPTextView from '../../../components/OTPView';
import TextInput from '../../../components/TextInput';
import globalImagePath from '../../../constants/PatientImages';
import MaterialIcons from 'react-native-vector-icons/Feather';
import axios from 'axios';
import LoadingIndicator from '../../../components/Loading';
import {heightPercentageToDP} from '../../../components/ResponsiveScreen';
import {API, post} from '../../../api/config/APIController';
import {Platform} from 'react-native';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {Alert} from 'react-native';
import LeftNavButton from '../../../components/LeftNavigationBack';
import {storeData} from '../../../storage/LocalStorage/LocalAsyncStorage';
import useStore from '../../../zustand/store';
const timeOut = 90;
const OTPVerifyScreen = props => {
  const navigation = useNavigation();
  const [mobileNumber, setMobileNumber] = useState([]);
  const [otp, setOTP] = useState([]);
  const [timer, setTimer] = useState(timeOut);
  const [showResend, setShowResend] = useState(false);
  const [restart, setReStart] = useState(false);
  const setUserInfo = useStore((state: any) => state.setUserInfo);
  const [loading, setLoading] = useState(false);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => LeftNavButton({navigation: navigation}),
    });
  }, [navigation]);

  function useInterval(callback, delay) {
    const savedCallback: any = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      let timers = timeOut;
      const id = setInterval(() => {
        timers = timers - 1;
        if (timers <= 0) {
          clearInterval(id);
        }
        savedCallback.current();
      }, delay);
      return () => clearInterval(id);
    }, [delay, restart]);
  }

  useInterval(() => {
    setTimer(timer - 1);
  }, 1000);

    function verifyOTP() {
      if (otp.length != 4) {
        showMessage({
          message: 'Please enter the OTP',
          type: 'danger',
        });
        return;
      }
      setLoading(true);
      let params = {
        mobile_number: mobileNumber,
        country_code: '+91',
        otp: otp,
        device_type: Platform.OS,
        device_toten: '',
        type: 1,
      };
      post(API.VERIFYOTP, params)
        .then(response => {
          setLoading(false);
          if (response.status == 200) {
            showMessage({
              message: response.data.message,
              type: 'success',
            });
            let temp = response.data.data['tempAccessToken'];
            if (response.data.data['tempAccessToken'] != null) {
              storeData('TEMP_TOKEN', temp);
              navigation.navigate('SignUp', {
                mobileNumber: mobileNumber,
                temp: temp,
              });
            } else {
              setUserInfo(response.data.data);
            }
          } else {
            showMessage({
              message: response.data.message,
              type: 'danger',
            });
          }
        })
        .catch(error => {
          setLoading(false);
          showMessage({
            message: error.response.data.message,
            type: 'danger',
          });
        });
    }

  useEffect(() => {
    const {mobileNumber} = props.route.params;
    setMobileNumber(mobileNumber);
    SplashScreen.hide();
    return () => {};
  }, []);

  let otpInput = useRef(null);

  function resendOTP() {
    const {mobileNumber} = props.route.params;
    let params = {
      mobile_number: mobileNumber,
      country_code: '+91',
    };

    setLoading(true);

    post(API.SENDOTP, params, true)
      .then(response => {
        setLoading(false);

        if (response.status == 200) {
          showMessage({
            message: response.data.message,
            type: 'success',
          });

          setTimer(timeOut);
          setReStart(!restart);
        } else {
          showMessage({
            message: response.data.message,
            type: 'danger',
          });
        }
      })
      .catch(error => {
        setLoading(false);
        showMessage({
          message: error.response.data.message,
          type: 'danger',
        });
      });
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.white,
        paddingHorizontal: 16,
      }}>
      <SafeAreaView />
      <LoadingIndicator loading={loading} />
      <View
        style={{
          justifyContent: 'center',
          backgroundColor: Colors.white,
          paddingHorizontal: 16,
          alignItems: 'center',
          marginTop: '8%',
        }}>
        <Image
          style={{height: heightPercentageToDP(15), resizeMode: 'contain'}}
          source={globalImagePath.verify}
        />
      </View>
      <View
        style={{
          paddingHorizontal: 16,
          justifyContent: 'center',
          marginTop: '30%',
        }}>
        <View style={{}}>
          <Label
            style={{fontSize: 18, fontWeight: '700', marginBottom: 12}}
            title="OTP Verification"
          />
          <Label
            style={{
              fontSize: 13,
              color: 'rgba(27, 27, 27, 0.7)',
              marginBottom: 24,
            }}
            title={`We have sent OTP on your number +91 ${mobileNumber}`}
          />
        </View>
        <View style={styles.textInputContainer}>
          <View style={styles.inputStyle}>
            <OTPTextView
              tintColor={Colors.primaryColor}
              ref={e => (otpInput = e)}
              handleTextChange={text => {
                setOTP(text);
              }}
            />
          </View>
        </View>
        <View style={{marginTop: 16}}></View>
        <CustomButton
          title={'Verify'}
          onPress={() => {
            verifyOTP();
          }}
        />

        {timer == 0 ? (
          <View style={styles.resentOTPContainer}>
            <CustomButton
              onPress={() => {
                resendOTP();
              }}
              border
              title={'Resend OTP'}
            />
          </View>
        ) : (
          <Label
            style={{
              fontSize: 14,
              color: 'rgba(27, 27, 27, 0.7)',
              marginTop: 24,
            }}
            title={`Didn't get OTP? Resend in ${timer} seconds`}
          />
        )}
      </View>
    </View>
  );
};
export default OTPVerifyScreen;

const styles = StyleSheet.create({
  resentOTPContainer: {
    width: '40%',
    alignSelf: 'center',
    marginTop: '4%',
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderColor: '#cdcdcd',
    // borderWidth: 1,
    // borderRadius: 6,
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  flag: {
    marginHorizontal: 8,
  },
  inputStyle: {
    flex: 1,
  },
});
