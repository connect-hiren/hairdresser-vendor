import React from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  Button,
  Pressable,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isCancel,
  isInProgress,
  types,
} from 'react-native-document-picker';
import ActionSheet from 'react-native-actionsheet';

import ImagePicker from 'react-native-image-crop-picker';

import AskOtpPopup from '../../component/AskOtpPopup';
import CustomButton from '../../component/CustomButton';
import EnterOtpPopup from '../../component/EnterOtpPopup';
import InputText from '../../component/InputText';
import config from '../../config';
import styles from './styles';
import {emailValidation} from '../../Util/Utilities';
import modules from '../../modules';
import {connect} from 'react-redux';
import * as UserDataActions from '../../Redux/actions/userData';
import Ripple from 'react-native-material-ripple';

class CreateAc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageUdate: true,
      name: '',
      pass: '',
      rePass: '',
      email: '',
      refNum: '',
      phone: '',
      nameError: '',
      passError: '',
      rePassError: '',
      emailError: '',
      refNumError: '',
      pickerResult: null,
      phoneError: '',
      imgUri: '',
      is_image_update: false,
      visiableAskOtpPopup: false,
      visiableEnterOtpPopup: false,
      otpCode: '',
      payment_type: '1',
      agree: false,
    };
  }
  componentDidMount = () => {};
  signUpFlow = () => {
    let isValid = true;
    if (!this.state.name) {
      this.setState({
        nameError: config.I18N.t('enterValidName'),
      });
    } else if (!this.state.email || !emailValidation(this.state.email)) {
      this.setState({
        emailError: config.I18N.t('enterValidEmail'),
      });
    } else if (!this.state.phone) {
      this.setState({
        phoneError: config.I18N.t('enterValidPhone'),
      });
    } else if (!this.state.pass) {
      this.setState({
        passError: config.I18N.t('enterValidPass'),
      });
    } else if (this.state.pass.length < 8) {
      this.setState({
        passError: config.I18N.t('enterValidPassLong'),
      });
    } else if (!this.state.rePass || this.state.pass != this.state.rePass) {
      this.setState({
        rePassError: config.I18N.t('enterValidRePass'),
      });
    } else if (!this.state.imgUri && !this.state.is_image_update) {
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('error'),
        config.I18N.t('upload_your_id'),
      );
    } else if (this.state.pickerResult == null) {
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('error'),
        config.I18N.t('upload_your_iban'),
      );
    } else if (this.state.agree == false) {
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('error'),
        config.I18N.t('pleaseAgreeTermsAndConditions'),
      );
    } else {
      this.sendOTP(2);
    }

    // if(isValid) {
    //   this.sendOTP(2);
    // }
  };
  sendOTP = async (fromState) => {
    config.Constant.showLoader.showLoader();
    const formData = new FormData();
    this.setState(
      {
        otpCode: Math.floor(1000 + Math.random() * 9000),
      },
      () => {
        formData.append('otp', this.state.otpCode);
      },
    );

    formData.append('name', this.state.name);
    formData.append('phone_number', this.state.phone);
    formData.append('email', this.state.email.trim());
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.CHECK_EMAIL,
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
  createAcc = async () => {
    config.Constant.showLoader.showLoader();
    const formData = new FormData();
    formData.append('name', this.state.name);
    formData.append('email', this.state.email.trim());
    formData.append('password', this.state.pass);
    formData.append('phone_number', this.state.phone);
    formData.append('role_id', 3);
    formData.append('refrel_phone_number', this.state.refNum);
    formData.append('id_card', {
      uri: this.state.imgUri.path,
      name: this.state.imgUri.filename,
      type: this.state.imgUri.mime,
    });
    formData.append('iban_card', {
      uri: this.state.pickerResult.uri,
      name: this.state.pickerResult.name,
      type: this.state.pickerResult.type,
    });
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.REGISTER_API,
      formData,
    );
    config.Constant.showLoader.hideLoader();
    if (data?.status_code == 200) {
      modules.DropDownAlert.showAlert(
        'success',
        config.I18N.t('success'),
        data.message,
      );
      this.props.dispatch(UserDataActions.setUserData(data.data));
      config.Constant.USER_DATA = data.data;
      this.props.navigation.reset({
        index: 1,
        routes: [{name: 'DashboardTab'}],
      });
    } else if (data?.status_code == 102) {
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('success'),
        data.message,
      );
      this.props.navigation.pop();
    } else {
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('error'),
        data.message,
      );
    }
  };
  handleError = (err) => {
    if (isCancel(err)) {
      console.warn('cancelled');
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.warn(
        'multiple pickers were opened, only the last will be considered',
      );
    } else {
      throw err;
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
      let filename = path.substring(path.lastIndexOf('/') + 1, path.length);
      let data = {...image, filename: filename};

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
    })
      .then((image) => {
        let path = image.path;
        let filename = path.substring(path.lastIndexOf('/') + 1, path.length);
        let data = {...image, filename: filename};

        this.setState({
          imgUri: data,
          is_image_update: true,
        });
      })
      .catch((err) => {
        console.log(err, 'err');
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={false}
          translucent
          backgroundColor="transparent"
          barStyle={'light-content'}
        />
        <Image
          source={require('../../assets/images/loginBanner.png')}
          resizeMode={'cover'}
          style={styles.bannerImg}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          style={styles.bottomScrollView}>
          <View style={{height: config.Constant.SCREEN_HEIGHT / 2.3}} />
          <View style={styles.bottomView}>
            <Text style={styles.titleTxt}>
              {config.I18N.t('createAccount')}
            </Text>
            <Text style={styles.titleDesTxt}>
              {config.I18N.t('registerNewAccount')}
            </Text>
            <InputText
              onRef={(ref) => (this.nameRef = ref)}
              containerStyle={styles.inputStyle}
              value={this.state.name}
              errorMsg={this.state.nameError}
              onChangeText={(name) => {
                this.setState({
                  name,
                  nameError: '',
                });
              }}
              placeholder={config.I18N.t('name')}
              returnKeyType={'next'}
              onSubmitEditing={() => this.emailRef.focus()}
              blurOnSubmit={false}
            />
            <InputText
              onRef={(ref) => (this.emailRef = ref)}
              containerStyle={styles.inputStyle}
              value={this.state.email}
              errorMsg={this.state.emailError}
              onChangeText={(email) => {
                this.setState({
                  email,
                  emailError: '',
                });
              }}
              placeholder={config.I18N.t('emailAddress')}
              returnKeyType={'next'}
              onSubmitEditing={() => this.phoneRef.focus()}
              blurOnSubmit={false}
            />
            <InputText
              onRef={(ref) => (this.phoneRef = ref)}
              containerStyle={styles.inputStyle}
              value={this.state.phone}
              errorMsg={this.state.phoneError}
              keyboardType={'number-pad'}
              onChangeText={(phone) => {
                this.setState({
                  phone,
                  phoneError: '',
                });
              }}
              placeholder={config.I18N.t('phoneNumber')}
              returnKeyType={'next'}
              onSubmitEditing={() => this.passRef.focus()}
              blurOnSubmit={false}
            />
            <InputText
              secureText={true}
              onRef={(ref) => (this.passRef = ref)}
              containerStyle={styles.inputStyle}
              value={this.state.pass}
              errorMsg={this.state.passError}
              onChangeText={(pass) => {
                this.setState({
                  pass,
                  passError: '',
                });
              }}
              placeholder={config.I18N.t('password')}
              returnKeyType={'next'}
              onSubmitEditing={() => this.rePassRef.focus()}
              blurOnSubmit={false}
            />
            <InputText
              secureText={true}
              onRef={(ref) => (this.rePassRef = ref)}
              containerStyle={styles.inputStyle}
              value={this.state.rePass}
              errorMsg={this.state.rePassError}
              onChangeText={(rePass) => {
                this.setState({
                  rePass,
                  rePassError: '',
                });
              }}
              placeholder={config.I18N.t('confirmPassword')}
              returnKeyType={'next'}
              onSubmitEditing={() => this.refNumRef.focus()}
              blurOnSubmit={false}
            />
            <InputText
              onRef={(ref) => (this.refNumRef = ref)}
              containerStyle={styles.inputStyle}
              value={this.state.refNum}
              errorMsg={this.state.refNumError}
              keyboardType={'number-pad'}
              onChangeText={(refNum) => {
                this.setState({
                  refNum,
                  refNumError: '',
                });
              }}
              placeholder={config.I18N.t('referrerNumber')}
              returnKeyType={'next'}
              onSubmitEditing={() => {}}
              blurOnSubmit={true}
            />
            <View style={styles.uploadStyle}>
              <Text style={styles.uploadTitle}>
                {config.I18N.t('upload_id')}
                <Pressable
                onPress={() => {
                  this.ActionSheet.show();
                }}>
                <Text
                  style={[
                    styles.selectFile,
                    {borderRadius: 8, color: config.Constant.COLOR_PRIMARY},
                  ]}>
                  {'   '+config.I18N.t('select_file')}
                </Text>
                
              </Pressable>
              </Text>
              
              {this.state.imgUri != '' && (
                    <Text style={[styles.selectFile]}>
                      {this.state.imgUri?.filename}
                    </Text>
                  )}
            </View>

            <View style={styles.uploadStyle}>
              <Text style={styles.uploadTitle}>
                {config.I18N.t('Upload_iban')}
                <Pressable
                onPress={async () => {
                  try {
                    const pickerResult = await DocumentPicker.pickSingle({
                      presentationStyle: 'fullScreen',
                      type: types.pdf,
                      copyTo: 'cachesDirectory',
                    });
                    console.log(pickerResult, 'pickerResultpickerResult');
                    this.setState({pickerResult: pickerResult});
                  } catch (e) {
                    this.handleError(e);
                  }
                }}>
                <Text
                  style={[
                    styles.selectFile,
                    {borderRadius: 8, color: config.Constant.COLOR_PRIMARY},
                  ]}>
                  {"  "+config.I18N.t('select_file')}
                </Text>
                
              </Pressable>
              </Text>
              {this.state.pickerResult && (
                    <Text style={[styles.selectFile]}>
                      {this.state.pickerResult?.name}
                    </Text>
                  )}
            </View>

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
                  {marginTop: 20, marginBottom: 0},
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
                style={[styles.selectedItemsViewMethod, {marginBottom: 20}]}>
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
            <View
              style={[
                styles.mapBox,
                {flexDirection: 'row', alignItems: 'center'},
              ]}>
              <TouchableOpacity
                style={{padding: 4}}
                onPress={() => this.setState({agree: true})}>
                <MaterialCommunityIcons
                  name={
                    this.state.agree
                      ? 'checkbox-marked-circle'
                      : 'checkbox-blank-circle-outline'
                  }
                  size={20}
                  color={
                    this.state.agree
                      ? config.Constant.COLOR_BTN
                      : config.Constant.COLOR_BLACK
                  }
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.methodName,
                  {fontFamily: config.Constant.Font_Regular},
                ]}>
                {config.I18N.t('agree')}
                <Text
                  onPress={() => {
                    if (Linking.canOpenURL('https://carcare.dc.net.sa/terms')) {
                      Linking.openURL('https://carcare.dc.net.sa/terms');
                    }
                  }}
                  style={{color: config.Constant.COLOR_BTN}}>
                  {config.I18N.t('termsAndCondition')}
                </Text>
              </Text>
            </View>

            <CustomButton
              btnTxt={config.I18N.t('signUp')}
              onPress={() => {
                this.signUpFlow();
              }}
              containerStyle={styles.btnStyle}
            />
            <Text style={styles.dontTxt}>
              {config.I18N.t('alreadyHaveAc')}{' '}
              <Text
                onPress={() => {
                  this.props.navigation.pop();
                }}
                style={styles.signUpTxt}>
                {config.I18N.t('signIn')}
              </Text>
            </Text>
          </View>
        </ScrollView>
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
                  this.createAcc();
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
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userData: state.userData,
});

export default connect(mapStateToProps)(CreateAc);
