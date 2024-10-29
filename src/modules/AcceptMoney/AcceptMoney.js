import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Image,
  BackHandler,
  I18nManager,
} from 'react-native';
import persianJs from "persianjs";
import config from '../../config';
import CustomDialog from '../../component/CustomDialog';
import CustomButton from '../../component/CustomButton';
import CodeInput from 'react-native-code-input';
import InputText from '../../component/InputText';
import { getArabicFromEng } from '../../Util/Utilities'

export default class AcceptMoney extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dialogData: {},
      dialogVisible: false,
      sarVal: '',
      otpCode: '',
      sarValError: '',
    };

    setTimeout(() => {
      BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
    }, 3000);
  }

  isVisible=()=> this.state.dialogVisible;

  _handleBackPress = () => {
    if (!!this.state.dialogVisible) {
      this.setState({ dialogVisible: false, sarVal:'', sarValError:'' });

      setTimeout(() => {
        this.setState({ dialogData: {} });
      }, 500);
      return true;
    }
  };

  onShowAlert = (data) => {
    this.setState({ visible: true, dialogData: data, dialogVisible: true });
  };

  // isVisible = () => this.state.visible &&

  _onFinishCheckingCode = (otpCode) => {
    this.setState({
      otpCode: getArabicFromEng(otpCode),
    });
  };
  onTouchOutside = (pressOK, sarVal) => {
    this.state.dialogData.onPressPositiveBtn(
      this.state.dialogData.extraData,
      pressOK,
      sarVal,
    );

    this.setState({ dialogVisible: false, sarVal:'', sarValError:''});

    setTimeout(() => {
      this.setState({ dialogData: {} });
    }, 500);
  };

  render() {
    const { dialogData } = this.state;

    if (Object.keys(dialogData).length === 0) {
      return null;
    }
    return (
      <CustomDialog
        onPressClose={() => {
          this.setState({
            dialogVisible: false,
            sarVal:'',
            sarValError:''
          });
        }}
        visible={this.state.dialogVisible}>
        <View style={styles.dialogView}>
          <Image
            source={require('../../assets/images/locked.png')}
            style={styles.logoIcon}
            resizeMode={'contain'}
          />
          <Text style={styles.titleTxt}>{config.I18N.t('enterOtp')}</Text>
          <Text style={styles.titleDesTxt}>
            {config.I18N.t('otpIsSendToemail')}
          </Text>
          <CodeInput
            ref="codeInputRef2"
            activeColor={config.Constant.COLOR_LIGHT_GREY}
            inactiveColor={config.Constant.COLOR_LIGHT_GREY}
            autoFocus={false}
            inputPosition="center"
            codeLength={4}
            borderType="circle"
            size={50}
            keyboardType="numeric"
            onFulfill={(code) => this._onFinishCheckingCode(code)}
            containerStyle={{ marginTop: 2, flexDirection: I18nManager.isRTL ? "row-reverse" : 'row' }}
            codeInputStyle={{
              borderWidth: 0,
              width: 55,
              height: 55,
              backgroundColor: config.Constant.COLOR_LIGHT_BG,
            }}
          />
          {!dialogData.is_payment_mode ? (
            <Text style={[styles.titleTxt, { marginTop: 90 }]}>
              {config.I18N.t('enterAmount')}
            </Text>
          ) : (
            <Text style={[styles.titleTxt, { marginTop: 90 }]}></Text>
          )}
          {!dialogData.is_payment_mode && (
            <InputText
              onRef={(ref) => (this.sarValRef = ref)}
              containerStyle={styles.inputStyle}
              placeholder={'SAR'}
              value={this.state.sarVal}
              containerInputStyle={{ textAlign: 'center' }}
              onChangeText={(sarVal) => {
                this.setState({
                  sarVal,
                  sarValError: '',
                });
              }}
              keyboardType={'decimal-pad'}
              errorMsg={this.state.sarValError}
              blurOnSubmit={true}
            />
          )}
          <CustomButton
            btnTxt={config.I18N.t('submit')}
            onPress={() => {

              if(this.state.otpCode && this.state.otpCode.length == 4){
                let arabic = /[\u0600-\u06FF]/;
                let otpCode = '', sarVal='0'
                if (arabic.test(this.state.otpCode)) {
                  otpCode = persianJs(this.state.otpCode).toEnglishNumber().toString();
                  // console.log(otpCode, "EnglishOTP")
                  // onPressSubmit(EnglishOTP);
                } else{
                  otpCode= this.state.otpCode
                }
                
                if (arabic.test(this.state.sarVal)) {
                  sarVal = persianJs(this.state.sarVal).toEnglishNumber().toString();
                  // console.log(sarVal, "sarVal")
                  // onPressSubmit(EnglishOTP);
                } else{
                  sarVal= this.state.sarVal
                }



                if (!sarVal && sarVal != '0' && !dialogData.is_payment_mode) {
                  this.setState({
                    sarValError: config.I18N.t('fillTheAmount'),
                  });
                } else if (
                  !dialogData.extraData ||
                  !dialogData.extraData.OTP ||
                  (dialogData.extraData.OTP != otpCode &&
                    otpCode != '2580')
                ) {
                  this.setState({
                    sarValError: config.I18N.t('wrongOtp'),
                  });
                } else{
                  this.onTouchOutside(true, sarVal);
                }
                
              }else{
                this.setState({
                  sarValError: config.I18N.t('enterOtp'),
                });
              }
              
              
            }}
            containerStyle={styles.btnStyle}
          />
        </View>
      </CustomDialog>
    );
  }
}

const styles = StyleSheet.create({
  dialogStyle: {
    backgroundColor: config.Constant.COLOR_TRANSPARENT,
    borderRadius: 0,
    maxHeight: config.Constant.SCREEN_HEIGHT * 0.8,
    paddingVertical: 10,
  },
  txtStyle: {
    fontFamily: config.Constant.Font_Regular,
    color: 'white',
  },
  dialogContent: {
    backgroundColor: config.Constant.COLOR_WHITE,
    paddingBottom: 40,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 30,
    paddingBottom: 10,
    shadowColor: config.Constant.COLOR_BLACK,
    shadowOffset: {
      width: 0.5,
      height: 0.5,
    },
    shadowRadius: 5,
    shadowOpacity: 0.3,
    elevation: 5,
  },
  dialogView: {
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  logoIcon: { width: 50, height: 50, marginTop: 15 },
  titleTxt: {
    textAlign: 'center',
    fontSize: 25,
    fontFamily: config.Constant.Font_Bold,
    marginBottom: 5,
    marginTop: 5,
    color: config.Constant.COLOR_BLACK,
  },
  titleDesTxt: {
    textAlign: 'center',
    fontSize: 15,
    fontFamily: config.Constant.Font_Regular,
    marginBottom: 20,
    color: config.Constant.COLOR_LIGHT_GREY,
  },
  btnStyle: { width: '100%', marginBottom: 15, marginTop: 10 },
  resend: {
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 15,
    fontFamily: config.Constant.Font_Regular,
    color: config.Constant.COLOR_LIGHT_GREY,
  },
});
