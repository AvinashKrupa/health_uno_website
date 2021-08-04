import {useNavigation} from '@react-navigation/native';
import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../../../assets/colors';
import CheckBox from '../../../components/CheckBox';
import CustomButton from '../../../components/CustomButton';
import DatePickerView from '../../../components/DatePicker';
import Dropdown from '../../../components/Dropdown';
import Label from '../../../components/Label';
import LeftNavButton from '../../../components/LeftNavigationBack';
import LoadingIndicator from '../../../components/Loading';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../../components/ResponsiveScreen';
import TextInput from '../../../components/TextInput';
import globalImagePath from '../../../constants/PatientImages';
import useStore from '../../../zustand/store';
import ImagePicker from 'react-native-image-crop-picker';
import TextView from '../../../components/TextView';
import Validators from '../../../utils/validators';
import Toast from '../../../utils/Toast';
import {API, get, post} from '../../../api/config/APIController';

const SignUpScreen = () => {
  let ActionSheetRef: any = React.createRef();
  const setUserInfo = useStore((state: any) => state.setUserInfo);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('');
  const [termsCondition, setTermsCondition] = useState(false);
  const [city, setCity] = useState('');
  const [isDiabetic, setIsDiabetic] = useState(null);
  const [diabeticFrom, setDiabeticFrom] = useState('');
  const [hypertensive, setHypertensive] = useState(null);
  const [hypertensiveFrom, setHypertensiveFrom] = useState('');
  const [surgeries, setSurgeries] = useState(null);
  const [surgeriesBrief, setSurgeriesBrief] = useState('');
  const [covid, setCovid] = useState(null);
  const [fromCovid, setFromCovid] = useState('');
  const [otherMedical, setOtherMedical] = useState('');
  const [referal, setReferal] = useState('');
  const [avatarSource, setAvatarSource] = useState({uri: ''});
  const [isUpdated, setImageUpdate] = useState(null);
  const [loading, setLoading] = useState(null);
  const [dataCountry, setDataCountry] = useState([{value: 'India'}]);
  const [dataCity, setDataCity] = useState([]);
  const [dataState, setDataState] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    getState();
    return () => {};
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => LeftNavButton({navigation: navigation}),
    });
  }, [navigation]);

  /*****************API CALLING*****************/

  function getCountry() {
    get(API.GETCOUNTRY)
      .then(response => {
        setLoading(false);
        if (response.status == 200) {
          let data = response.data.data.map((info: any) => {
            return {value: info.name, id: info.id};
          });
          setDataCountry(data);
          getState();
        } else {
          Toast.showError(response.data.message);
        }
      })
      .catch(error => {
        setLoading(false);
        Toast.showError(error.response.data.message);
      });
  }

  function getState() {
    post(API.GETSTATE, {countryId: 101})
      .then(response => {
        setLoading(false);
        if (response.status == 200) {
          let data = response.data.data.map((info: any) => {
            return {value: info.name, id: info.id};
          });
          setDataState(data);
        } else {
          Toast.showError(response.data.message);
        }
      })
      .catch(error => {
        setLoading(false);
        Toast.showError(error.response.data.message);
      });
  }

  function getCity(id) {
    post(API.GETCITY, {countryId: 101, stateId: id})
      .then(response => {
        setLoading(false);
        if (response.status == 200) {
          let data = response.data.data.map((info: any) => {
            return {value: info.name, id: info.id};
          });
          setDataCity(data);
        } else {
          Toast.showError(response.data.message);
        }
      })
      .catch(error => {
        setLoading(false);
        Toast.showError(error.response.data.message);
      });
  }

  /*****************IMAGE CROPPER*****************/

  function openCamera() {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.8,
    }).then((response: any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.path};
        setAvatarSource(source);
        setImageUpdate(true);
      }
    });
  }

  function openPicker() {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      cropperCircleOverlay: true,
    }).then((response: any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.path};
        setAvatarSource(source);
        setImageUpdate(true);
      }
    });
  }

  /*****************SHOW ACTION SHEET*****************/
  function showImagePickerView() {
    return (
      <ActionSheet
        ref={o => (ActionSheetRef = o)}
        title={''}
        options={['Camera', 'Gallery', 'Cancel']}
        cancelButtonIndex={2}
        //  destructiveButtonIndex={2}
        onPress={index => {
          if (index == 0) {
            openCamera();
          } else if (index == 1) {
            openPicker();
          }
          /* do something */
        }}
      />
    );
  }
  /*****************SHOW ACTION SHEET*****************/
  function registerUserAPICalling() {
    let params = {
      first_name: firstName,
      last_name: lastName,
      mobile_number: mobileNumber,
      country_code: '+91',
      device_type: Platform.OS,
      type: '1',
      dob: dob,
      gender: gender,
      height: height,
      weight: weight,
      med_cond: [
        {
          name: 'diabetic',
          selected: isDiabetic,
          diag_at: diabeticFrom,
          desc: '',
        },
        {
          name: 'hypertensive',
          selected: hypertensive,
          diag_at: hypertensiveFrom,
          desc: '',
        },
        {
          name: 'diagnosed_with_covid',
          selected: covid,
          diag_at: fromCovid,
          desc: '',
        },
        {
          name: 'past_surgeries',
          selected: surgeries,
          diag_at: '',
          desc: surgeriesBrief,
        },
      ],
      other_med_cond: otherMedical,
      refer_code: referal,
      address: {
        line1: addressLine1,
        line2: addressLine2,
        state: state,
        city: city,
        country: country,
      },
    };

    post(API.REGISTERPATIENT, params, true)
      .then(response => {
        setLoading(false);
        if (response.status == 200) {
          Toast.showSuccess(response.data.message);
          setUserInfo(response.data.data);
        } else {
          Toast.showError(response.data.message);
        }
      })
      .catch(error => {
        setLoading(false);
        Toast.showError(error.response.data.message);
      });
  }

  /*****************SHOW ACTION SHEET*****************/
  function validation() {
    if (Validators.isEmpty(firstName)) {
      Toast.showError('Please enter first name');
      return false;
    } else if (Validators.isEmpty(lastName)) {
      Toast.showError('Please enter last name');
      return false;
    } else if (Validators.isEmpty(mobileNumber)) {
      Toast.showError('Please enter mobile number');
      return false;
    } else if (!Validators.isNumberOnly(mobileNumber)) {
      Toast.showError('Please enter valid mobile number');
      return false;
    } else if (Validators.isEmpty(email)) {
      Toast.showError('Please enter email id');
      return false;
    } else if (!Validators.isEmailValid(email)) {
      Toast.showError('Please enter valid email id');
      return false;
    } else if (Validators.isEmpty(dob)) {
      Toast.showError('Please select your date of birth');
      return false;
    } else if (Validators.isEmpty(gender)) {
      Toast.showError('Please select gender');
      return false;
    } else if (Validators.isEmpty(addressLine1)) {
      Toast.showError('Please enter address line 1');
      return false;
    }

    // else if (Validators.isEmpty(addressLine2)) {
    //   Toast.showError('Please enter address line 2');
    //   return false;
    // }
    else if (Validators.isEmpty(height)) {
      Toast.showError('Please enter your height');
      return false;
    } else if (Validators.isEmpty(weight)) {
      Toast.showError('Please enter your weight');
      return false;
    } else if (!Validators.isNumberOnly(weight)) {
      Toast.showError('Please enter valid weight');
      return false;
    } else if (Validators.isEmpty(country)) {
      Toast.showError('Please select country');
      return false;
    } else if (Validators.isEmpty(state)) {
      Toast.showError('Please select state');
      return false;
    } else if (Validators.isEmpty(city)) {
      Toast.showError('Please select city');
      return false;
    } else if (Validators.isEmpty(isDiabetic)) {
      Toast.showError('Please select diabetic');
      return false;
    } else if (isDiabetic == true && Validators.isEmpty(diabeticFrom)) {
      Toast.showError('Please select diabetic from');
      return false;
    } else if (hypertensive == true && Validators.isEmpty(hypertensiveFrom)) {
      Toast.showError('Please select hypertensive from');
      return false;
    } else if (Validators.isEmpty(covid)) {
      Toast.showError('Please select covid');
      return false;
    } else if (covid == true && Validators.isEmpty(fromCovid)) {
      Toast.showError('Please select covid from');
      return false;
    } else if (Validators.isEmpty(surgeries)) {
      Toast.showError('Please select surgeries');
      return false;
    } else if (surgeries == true && Validators.isEmpty(surgeriesBrief)) {
      Toast.showError('Please mention about your surgeries');
      return false;
    } else if (termsCondition == false) {
      Toast.showError('Please accept terms and condition');
      return false;
    } else {
      return true;
    }
  }

  function renderDiases(
    title: string,
    isSelected: any,
    date: any,
    setDate: any,
    setSelected: any,
    topPlaceHolderText: any = '',
    placeHolderText: any = '',
    isTextView: boolean = false,
  ) {
    return (
      <View style={{marginTop: 16}}>
        <Label title={title} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 8,
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              flex: 0.3,
              height: 64,
              alignItems: 'center',
            }}>
            <CheckBox
              isChecked={isSelected}
              checkBoxType={'circle'}
              isEditable
              onPress={() => {
                if (!isSelected) setSelected(!isSelected);
              }}
            />
            <Label style={{marginLeft: 8}} title={'YES'} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              flex: 0.3,
              height: 64,
              alignItems: 'center',
            }}>
            <CheckBox
              {...(isSelected != null ? {isChecked: !isSelected} : null)}
              checkBoxType={'circle'}
              isEditable
              onPress={() => {
                if (isSelected || isSelected == null) {
                  setSelected(false);
                  setDate('');
                }
              }}
              style={{}}
            />
            <Label style={{marginLeft: 8}} title={'No'} />
          </View>
          {isSelected && !isTextView ? (
            <View style={{flex: 0.5}}>
              <DatePickerView
                placeholder={'From'}
                date={date}
                onDateChange={date => {
                  setDate(date);
                }}
              />
            </View>
          ) : null}
        </View>
        {isSelected && isTextView ? (
          <View>
            <TextView
              topPlaceholder={topPlaceHolderText}
              placeholder={placeHolderText}
              onChangeText={text => {
                setDate(text);
              }}
            />
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
      }}>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: Colors.white,
          paddingHorizontal: 16,
        }}>
        <SafeAreaView />
        {showImagePickerView()}
        <Label title={''} />
        <LoadingIndicator loading={loading} />
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableOpacity
            style={{
              paddingHorizontal: 16,
              alignItems: 'center',
            }}
            onPress={() => {
              ActionSheetRef.show();
            }}>
            <Image
              style={{
                height: wp(45),
                width: wp(45),
                borderColor: Colors.primaryColor,
                resizeMode: 'contain',
                borderWidth: 3,
                borderRadius: wp(40),
              }}
              source={avatarSource.uri ? avatarSource : globalImagePath.avatar}
            />

            <View
              style={{
                backgroundColor: Colors.primaryColor,
                width: wp(12),
                height: wp(12),
                borderRadius: wp(12),
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                bottom: 10,
                right: 10,
              }}>
              <Icon
                style={{fontSize: 17, color: Colors.white}}
                name={'camera'}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingHorizontal: 16,
            justifyContent: 'center',
          }}>
          <View style={styles.inputStyle}>
            <TextInput
              topPlaceholder={'First Name'}
              placeholder={'eg John'}
              value={firstName}
              onChangeText={value => {
                setFirstName(value);
              }}
            />
          </View>
          <View style={styles.inputStyle}>
            <TextInput
              topPlaceholder={'Last Name'}
              placeholder={'eg Doe'}
              value={lastName}
              onChangeText={value => {
                setLastName(value);
              }}
            />
          </View>

          <View style={styles.inputStyle}>
            <TextInput
              topPlaceholder={'Mobile Number'}
              placeholder={'**********'}
              keyboardType={'numeric'}
              maxLength={10}
              value={mobileNumber}
              onChangeText={value => {
                setMobileNumber(value);
              }}
            />
          </View>

          <View style={styles.inputStyle}>
            <TextInput
              topPlaceholder={'Email'}
              placeholder={'john@gmail.com'}
              keyboardType={'email-address'}
              value={email}
              onChangeText={value => {
                setEmail(value);
              }}
            />
          </View>

          <View style={styles.inputStyle}>
            <DatePickerView
              topPlaceholder={'Date of Birth'}
              placeholder={'Select Date'}
              date={dob}
              onDateChange={date => {
                setDob(date);
              }}
            />
          </View>

          <View style={styles.inputStyle}>
            <Dropdown
              onChangeText={text => {
                setGender(text);
              }}
              value={gender}
              label="Gender"
              placeHolder={'Choose Gender'}
              data={[{value: 'Male'}, {value: 'Female'}, {value: 'Other'}]}
            />
          </View>

          <View style={styles.inputStyle}>
            <TextInput
              topPlaceholder={'Address Line 1'}
              placeholder={'Enter Address'}
              value={addressLine1}
              onChangeText={value => {
                setAddressLine1(value);
              }}
            />
          </View>

          <View style={styles.inputStyle}>
            <TextInput
              topPlaceholder={'Address Line 2'}
              placeholder={'Enter Address (Optional)'}
              value={addressLine2}
              onChangeText={value => {
                setAddressLine2(value);
              }}
            />
          </View>

          <View
            style={[
              styles.inputStyle,
              {flexDirection: 'row', justifyContent: 'space-between'},
            ]}>
            <View style={{flex: 0.48}}>
              <Dropdown
                onChangeText={(text: string, index: number, data: any) => {
                  getCity(data[index].id);
                  setState(text);
                }}
                value={state}
                label="State"
                data={dataState}
              />
            </View>
            <View style={{flex: 0.48}}>
              <Dropdown
                onChangeText={text => {
                  setCity(text);
                }}
                value={city}
                label="City"
                data={dataCity}
              />
            </View>
          </View>

          <View style={styles.inputStyle}>
            <Dropdown
              label="Country"
              onChangeText={text => {
                setCountry(text);
              }}
              value={country}
              data={dataCountry}
            />
          </View>

          <View
            style={[
              styles.inputStyle,
              {flexDirection: 'row', justifyContent: 'space-between'},
            ]}>
            <View style={{...styles.inputStyle, flex: 0.48}}>
              <TextInput
                topPlaceholder={'Height'}
                placeholder={'5 Ft'}
                keyboardType={'numeric'}
                value={height}
                onChangeText={value => {
                  setHeight(value);
                }}
              />
            </View>
            <View style={{...styles.inputStyle, flex: 0.48}}>
              <TextInput
                topPlaceholder={'Weight'}
                placeholder={'50 kg'}
                keyboardType={'numeric'}
                value={weight}
                onChangeText={value => {
                  setWeight(value);
                }}
              />
            </View>
          </View>

          {renderDiases(
            'Are you Diabetic?',
            isDiabetic,
            diabeticFrom,
            setDiabeticFrom,
            setIsDiabetic,
          )}

          {renderDiases(
            'Are you Hypertensive?',
            hypertensive,
            hypertensiveFrom,
            setHypertensiveFrom,
            setHypertensive,
          )}

          {renderDiases(
            'Have you been diagnosed with covid?',
            covid,
            fromCovid,
            setFromCovid,
            setCovid,
            'Please mention in brief',
            'Enter text here',
          )}
          {renderDiases(
            'Any past Surgeries?',
            surgeries,
            surgeriesBrief,
            setSurgeriesBrief,
            setSurgeries,
            'Please mention in brief',
            'Enter text here',
            true,
          )}

          <View style={{marginTop: 16}} />
          <TextView
            value={otherMedical}
            topPlaceholder={'Other Medical Conditions'}
            placeholder={'Explain Medical Condition here'}
            onChangeText={text => {
              setOtherMedical(text);
            }}
          />

          <View style={styles.inputStyle}>
            <TextInput
              topPlaceholder={'Referal Code'}
              placeholder={'Enter Code Here'}
              value={referal}
              onChangeText={value => {
                setReferal(value);
              }}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              flex: 0.3,
              height: 64,
              alignItems: 'center',
            }}>
            <CheckBox
              isEditable={true}
              isChecked={termsCondition}
              checkBoxType="square"
              onPress={() => {
                setTermsCondition(!termsCondition);
              }}
            />
            <View style={{flexDirection: 'row'}}>
              <Label style={{marginLeft: 8}} title={'I Accept'} />
              <Label
                style={{color: Colors.primaryColor, fontWeight: '600'}}
                title={' Terms and Conditions '}
              />
            </View>
          </View>

          <View style={{}}>
            <CustomButton
              title={'Continue'}
              onPress={() => {
                if (validation()) {
                  registerUserAPICalling();
                }
              }}
            />
          </View>
        </View>
      </ScrollView>
      <SafeAreaView style={{backgroundColor: Colors.white}} />
    </View>
  );
};
export default SignUpScreen;

const styles = StyleSheet.create({
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#cdcdcd',
    borderWidth: 1,
    borderRadius: 6,
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  flag: {
    marginHorizontal: 8,
  },
  inputStyle: {marginTop: 12},
});
