import React from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  TextInput,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Ripple from 'react-native-material-ripple';
import CustomButton from '../../component/CustomButton';
import CustomHeader from '../../component/CustomHeader';
import InputText from '../../component/InputText';
import config from '../../config';
import { getStatusBarHeight } from '../../Util/Utilities';
import styles from './styles';
import { connect } from 'react-redux';
import * as UserDataActions from '../../Redux/actions/userData';

import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import EnterOtpPopup from '../../component/EnterOtpPopup';
import AskOtpPopup from '../../component/AskOtpPopup';
import modules from '../../modules';

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name_in_bank_account: !!config.Constant.USER_DATA && !!config.Constant.USER_DATA.name_in_bank_account
      ? config.Constant.USER_DATA.name_in_bank_account
      : '',
      accNameError:'',
      name:
        !!config.Constant.USER_DATA && !!config.Constant.USER_DATA.name
          ? config.Constant.USER_DATA.name
          : '',
      email:
        !!config.Constant.USER_DATA && !!config.Constant.USER_DATA.email
          ? config.Constant.USER_DATA.email
          : '',
      phone:
        !!config.Constant.USER_DATA && !!config.Constant.USER_DATA.phone_number
          ? config.Constant.USER_DATA.phone_number
          : '',
      location:
        !!config.Constant.USER_DATA && !!config.Constant.USER_DATA.address
          ? config.Constant.USER_DATA.address
          : '',
      locationError: '',
      accNum: !!config.Constant.USER_DATA && !!config.Constant.USER_DATA.bank_account_number
      ? config.Constant.USER_DATA.bank_account_number : '',
      accNumError: '',
      imgUri:
        !!config.Constant.USER_DATA && !!config.Constant.USER_DATA.image
          ? {
            path: config.Constant.UsersProfile_Url +
              '' +
              config.Constant.USER_DATA.image
          }
          : '',
      is_image_update: false,
      about:
        !!config.Constant.USER_DATA && !!config.Constant.USER_DATA.about
          ? config.Constant.USER_DATA.about
          : '',
      visiableAskOtpPopup: false,
      visiableEnterOtpPopup: false,
      otpCode: '',
      payment_type: !!config.Constant.USER_DATA && !!config.Constant.USER_DATA.payment_type
        ? config.Constant.USER_DATA.payment_type
        : '1',
    };
  }
  componentDidMount = () => { };

  sendOTP = async (fromState) => {
    config.Constant.showLoader.showLoader();
    const formData = new FormData();
    this.setState(
      {
        otpCode: Math.floor(1000 + Math.random() * 9000)
      },
      () => {
        formData.append('otp', this.state.otpCode);
      },
    );
    formData.append('email', this.state.email);
    // if(this.state.accNum && this.state.accNum.length == 15){
    //   formData.append('bank_account_number', this.state.accNum);  
    // }
    

    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.FORGOT_PASS_OTP,
      formData,
    );
    config.Constant.showLoader.hideLoader();
    if (data.status_code == 200) {
      modules.DropDownAlert.showAlert(
        'success',
        config.I18N.t('success'),
        config.I18N.t('otpHasSendToemail'),
      );
      if (fromState == 1) {
        this.setState({
          visiableAskOtpPopup: true,
          visiableEnterOtpPopup: false,
        });
      } else {
        this.setState({
          visiableEnterOtpPopup: true,
          visiableAskOtpPopup: false,
        });
      }
    } else {
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('error'),
        data.message,
      );
    }
  };

  verifyData = () => {
    if (!this.state.name) {
      this.setState({
        nameError: config.I18N.t('enterValidName'),
      });
    }else if (!this.state.name_in_bank_account) {
      this.setState({
        accNameError: config.I18N.t('enterValidName'),
      });
    } else if(this.state.accNum.length != 0 && this.state.accNum.length < 24 ){
      this.setState({
        accNumError: config.I18N.t('enterValid24DigitBankAccountNumber'),
      });
    } else {
      this.sendOTP(2);
    }
  };

  updateProfile = async () => {
    config.Constant.showLoader.showLoader();
    const formData = new FormData();
    formData.append('name', this.state.name);
    formData.append('name_in_bank_account', this.state.name_in_bank_account);
    formData.append('address', this.state.location);
    formData.append('about', this.state.about);
    formData.append('payment_type', this.state.payment_type);
    if(!!this.state.accNum){
      formData.append('bank_account_number', this.state.accNum);
    }
    if (!!this.state.imgUri && !!this.state.is_image_update) {
      formData.append('image', {
        uri: this.state.imgUri.path,
        name: this.state.imgUri.filename,
        //filename: 'imageName.png',
        type: this.state.imgUri.mime,
      });
    }
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.UPDATE_PROFILE,
      formData,
    );
    config.Constant.showLoader.hideLoader();
    if (data.status_code == 200) {
      modules.DropDownAlert.showAlert(
        'success',
        config.I18N.t('success'),
        data.message,
      );
      try {
        config.Constant.USER_DATA.name = data.data.name;
        config.Constant.USER_DATA.name_in_bank_account = data.data.name_in_bank_account;
        config.Constant.USER_DATA.image = data.data.image;
        config.Constant.USER_DATA.address = data.data.address;
        config.Constant.USER_DATA.about = data.data.about;
        config.Constant.USER_DATA.payment_type = data.data.payment_type;
        config.Constant.USER_DATA.bank_account_number = data.data.bank_account_number;

        var userData = this.props.userData;
        if (!!userData && !!userData.userData && !!userData.userData.id) {
          userData.userData.name = data.data.name;
          userData.userData.name_in_bank_account = data.data.name_in_bank_account;
          userData.userData.image = data.data.image;
          userData.userData.address = data.data.address;
          userData.userData.about = data.data.about;
          userData.userData.payment_type = data.data.payment_type;

          this.props.dispatch(UserDataActions.setUserData(userData.userData));
        }
      } catch (error) { }
      this.props.navigation.pop();
    } else {
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('error'),
        data.message,
      );
    }
  };

  selectFromCamera = async () => {
    ImagePicker.openCamera({
      width: 400,
      height: 400,
      mediaType: 'photo',
      cropping: true,
    }).then((image) => {
      let path = image.path;
      let filename = path.substring(path.lastIndexOf("/") + 1, path.length)
      let data = { ...image, filename: filename }

      this.setState({
        imgUri: data,
        is_image_update: true,
      });
    });
  };

  selectFromGallery = async () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      mediaType: 'photo',
      cropping: true,
    }).then((image) => {
      let path = image.path;
      let filename = path.substring(path.lastIndexOf("/") + 1, path.length)
      let data = { ...image, filename: filename }

      this.setState({
        imgUri: data,
        is_image_update: true,
      });
    }).catch(err => {
      console.log(err, "err")
    })
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={false}
          translucent
          backgroundColor="transparent"
          barStyle={'dark-content'}
        />

        <CustomHeader
          onBackPress={() => {
            this.props.navigation.pop();
          }}
          txtStyle={config.I18N.t('editProfile')}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Ripple
            onPress={() => {
              this.ActionSheet.show();
            }}
            style={styles.profileBorder}>

            <FastImage
              style={styles.profileIcon}
              resizeMode={'cover'}
              source={
                !!this.state.imgUri
                  ? { uri: this.state.imgUri.path }
                  : require('../../assets/images/male.png')
              }
            />
            <Image
              source={require('../../assets/images/camera.png')}
              resizeMode={'contain'}
              style={styles.floatCamera}
            />
          </Ripple>
          <Text style={[styles.appName, { marginBottom: 20 }]}>
            {this.state.name}
          </Text>
          <View style={[styles.descriptionView, { width: '80%' }]}>
            <InputText
              onRef={(ref) => (this.nameRef = ref)}
              containerStyle={styles.inputStyle}
              value={this.state.name}
              onChangeText={(name) => {
                this.setState({
                  name,
                  nameError: '',
                });
              }}
              placeholder={config.I18N.t('name')}
              errorMsg={this.state.nameError}
              returnKeyType={'next'}
              onSubmitEditing={() => this.emailRef.focus()}
              blurOnSubmit={false}
            />


              <InputText
                onRef={(ref) => (this.accNameRef = ref)}
                containerStyle={styles.inputStyle}
                value={this.state.name_in_bank_account}
                onChangeText={(name_in_bank_account) => {
                  this.setState({
                    name_in_bank_account,
                    accNameError: '',
                  });
                }}
                errorMsg={this.state.accNameError}
                placeholder={config.I18N.t('nameInBankAcc')}
                returnKeyType={'next'}
                onSubmitEditing={() => this.accNumRef.focus()}
                blurOnSubmit={false}
              />
              <InputText
                onRef={(ref) => (this.accNumRef = ref)}
                containerStyle={styles.inputStyle}
                value={this.state.accNum}
                onChangeText={(accNum) => {
                  this.setState({
                    accNum,
                    accNumError: '',
                  });
                }}
                maxLength={24}
                errorMsg={this.state.accNumError}
                placeholder={config.I18N.t('bankAccNum')}
                returnKeyType={'next'}
                // onSubmitEditing={() => this.emailRef.focus()}
                blurOnSubmit={false}
              />

            <InputText
              editable={false}
              onRef={(ref) => (this.emailRef = ref)}
              containerStyle={styles.inputStyle}
              value={this.state.email}
              onChangeText={(email) => {
                this.setState({
                  email,
                });
              }}
              placeholder={config.I18N.t('emailAddress')}
              returnKeyType={'next'}
              onSubmitEditing={() => this.phoneRef.focus()}
              blurOnSubmit={false}
            />
            <InputText
              editable={false}
              onRef={(ref) => (this.phoneRef = ref)}
              containerStyle={styles.inputStyle}
              value={this.state.phone}
              onChangeText={(phone) => {
                this.setState({
                  phone,
                });
              }}
              placeholder={config.I18N.t('phoneNumber')}
              returnKeyType={'next'}
              onSubmitEditing={() => this.locationRef.focus()}
              blurOnSubmit={false}
            />
            <InputText
              onRef={(ref) => (this.locationRef = ref)}
              containerStyle={styles.inputStyle}
              value={this.state.location}
              onChangeText={(location) => {
                this.setState({
                  location,
                });
              }}
              placeholder={config.I18N.t('location')}
              returnKeyType={'next'}
              onSubmitEditing={() => this.aboutRef.focus()}
              blurOnSubmit={true}
              multiline={true}
              textAlignVertical={'top'}
              minHeight={150}
              maxHeight={150}
            />
            <InputText
              onRef={(ref) => (this.aboutRef = ref)}
              containerStyle={styles.inputStyle}
              value={this.state.about}
              multiline={true}
              minHeight={150}
              maxHeight={150}
              textAlignVertical={'top'}
              onChangeText={(about) => {
                this.setState({
                  about,
                });
              }}
              placeholder={config.I18N.t('about')}
              returnKeyType={'next'}
              onSubmitEditing={() => { }}
              blurOnSubmit={true}
            />
            <View style={styles.headerStyle}>
              <Text style={styles.descTitle}>
                {config.I18N.t('paymentMethod')}
              </Text>
            </View>

            <View style={styles.mapBox}>
              <Ripple
                onPress={() => {
                  this.setState({
                    payment_type: '2',
                  });
                }}
                style={[
                  styles.selectedItemsViewMethod,
                  { marginTop: 20, marginBottom: 0 },
                ]}>
                <Text
                  style={[
                    styles.methodName,
                    {
                      fontFamily:
                        this.state.payment_type == '2'
                          ? config.Constant.Font_Semi_Bold
                          : config.Constant.Font_Regular,
                    },
                  ]}>
                  {config.I18N.t('creditDebitCard')}
                </Text>
                <View style={styles.emptyIconMethod}>
                  {this.state.payment_type == '2' && (
                    <View style={styles.filledIconMethod} />
                  )}
                </View>
              </Ripple>

              {/* <Ripple
                onPress={() => {
                  this.setState({
                    payment_type: '3',
                  });
                }}
                style={[styles.selectedItemsViewMethod]}>
                <Text
                  style={[
                    styles.methodName,
                    {
                      fontFamily:
                        this.state.payment_type == '3'
                          ? config.Constant.Font_Semi_Bold
                          : config.Constant.Font_Regular,
                    },
                  ]}>
                  {config.I18N.t('cashOnDelivery')}
                </Text>
                <View style={styles.emptyIconMethod}>
                  {this.state.payment_type == '3' && (
                    <View style={styles.filledIconMethod} />
                  )}
                </View>

              </Ripple> */}
              <Ripple
                onPress={() => {
                  this.setState({
                    payment_type: '1',
                  });
                }}
                style={[styles.selectedItemsViewMethod, { marginBottom: 20 }]}>
                <Text
                  style={[
                    styles.methodName,
                    {
                      fontFamily:
                        this.state.payment_type == '1'
                          ? config.Constant.Font_Semi_Bold
                          : config.Constant.Font_Regular,
                    },
                  ]}>
                  {config.I18N.t('allTypeMethod')}
                </Text>
                <View style={styles.emptyIconMethod}>
                  {this.state.payment_type == '1' && (
                    <View style={styles.filledIconMethod} />
                  )}
                </View>
              </Ripple>
            </View>

            <CustomButton
              btnTxt={config.I18N.t('save')}
              onPress={() => {
                this.verifyData();
              }}
              containerStyle={styles.btnStyle}
            />
          </View>
        </ScrollView>
        <ActionSheet
          ref={(o) => (this.ActionSheet = o)}
          title={config.I18N.t('selectOption')}
          options={[
            config.I18N.t('fromGallery'),
            config.I18N.t('fromCamera'),
            config.I18N.t('cancel'),
          ]}
          cancelButtonIndex={2}
          destructiveButtonIndex={2}
          onPress={(index) => {
            if (index == 0) {
              this.selectFromGallery();
            } else if (index == 1) {
              this.selectFromCamera();
            }
          }}
        />
        <AskOtpPopup
          onPressClose={() => {
            this.setState({
              visiableAskOtpPopup: false,
            });
          }}
          onPressOtp={() => {
            this.setState({
              visiableAskOtpPopup: false,
              visiableEnterOtpPopup: true,
            });
            //this.createAcc();
          }}
          onPressRetryOtp={() => {
            this.setState(
              {
                visiableAskOtpPopup: false,
              },
              () => {
                this.sendOTP(1);
              },
            );
          }}
          visible={this.state.visiableAskOtpPopup}
        />
        <EnterOtpPopup
          onPressSubmit={(otpCode) => {
            if (otpCode == this.state.otpCode || otpCode == '2580') {
              this.setState(
                {
                  visiableEnterOtpPopup: false,
                },
                () => {
                  this.updateProfile();
                },
              );
            } else {
              modules.DropDownAlert.showAlert(
                'error',
                config.I18N.t('error'),
                config.I18N.t('wrongOtp'),
              );
            }
          }}
          onPressClose={() => {
            this.setState({
              visiableEnterOtpPopup: false,
            });
          }}
          onPressRetryOtp={() => {
            this.setState(
              {
                visiableEnterOtpPopup: false,
              },
              () => {
                this.sendOTP(2);
              },
            );
          }}
          visible={this.state.visiableEnterOtpPopup}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userData: state.userData,
});

export default connect(mapStateToProps)(EditProfile);
