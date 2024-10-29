import React from 'react';
import { StyleSheet, View, Image, Text, BackHandler } from 'react-native';
import config from '../config';
import Dialog, { SlideAnimation, DialogContent } from 'react-native-popup-dialog';
import CustomButton from './CustomButton';
import Ripple from 'react-native-material-ripple';
import CustomDropDown from './CustomDropDown';
import InputText from './InputText';

export default class AddService extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currInd: 0,
    };
    setTimeout(() => {
      BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
    }, 3000);
  }
  _handleBackPress = () => {
    if (!!this.props.visible) {
      this.props.onPressClose();
      return true;
    }
  };

  render() {
    const {
      visible,
      onPressClose,
      onPressAdd,
      containerStyle,
      container1,
      dataSource,
      mainDataChange,
      mainDataId,
      dataCatSource,
      catDataId,
      catDataChange,
      sar,
      onSarChange,
      sarError,
      mainCatError,
      catError,
      commission
    } = this.props;
    let commissionAmt = `${sar* commission/100}`
    let receiveAmt = `${sar - commissionAmt}`
    receiveAmt = receiveAmt == "0" ? "" : receiveAmt
    commissionAmt = commissionAmt == "0" ? "" : commissionAmt
    return (
      <Dialog
        visible={visible}
        onTouchOutside={onPressClose}
        width={1}
        overlayOpacity={0.9}
        overlayBackgroundColor={'white'}
        dialogAnimation={
          new SlideAnimation({
            slideFrom: 'bottom',
          })
        }
        containerStyle={[
          {
            justifyContent: 'center',
          },
          { ...containerStyle },
        ]}
        dialogStyle={styles.dialogStyle}>
        <DialogContent style={[styles.dialogContent, { ...container1 }]}>
          <View style={styles.dialogView}>
            <Text style={styles.titleTxt}>{config.I18N.t('addService')}</Text>
            <View style={styles.dropdownView}>
              <Text style={styles.inputTitle}>
                {config.I18N.t('selectCategory')}
              </Text>
              <CustomDropDown
                containerStyle={styles.drop}
                data={dataSource}
                placeholder={config.I18N.t('selectCategory')}
                //Value={mainDataId}
                onChange={(date) => {
                  mainDataChange(date);
                }}
              />
              {!!mainCatError && (
                <Text style={styles.errorMsgStyle}>{mainCatError}</Text>
              )}
            </View>
            <View style={styles.dropdownView}>
              <Text style={styles.inputTitle}>
                {config.I18N.t('subCategory')}
              </Text>
              <CustomDropDown
                containerStyle={styles.drop}
                data={dataCatSource}
                placeholder={config.I18N.t('subCategory')}
                //Value={catDataId}
                onChange={(date) => {
                  catDataChange(date);
                }}
              />
              {!!catError && (
                <Text style={styles.errorMsgStyle}>{catError}</Text>
              )}
            </View>
           
            <View style={styles.dropdownView}>
              <Text style={styles.inputTitle}>{config.I18N.t('serviceChargeSAR')}</Text>
              <InputText
                containerInputStyle={{ paddingVertical: 5 }}
                onRef={(ref) => (this.sarRef = ref)}
                containerStyle={styles.inputStyle}
                value={sar}
                onChangeText={(sar) => {
                  onSarChange(sar);
                  
                }}
                keyboardType={'decimal-pad'}
                errorMsg={sarError}
                placeholder={'SAR'}
                returnKeyType={'next'}
                onSubmitEditing={() => { }}
                blurOnSubmit={true}
              />

              <Text style={styles.inputTitle}>{config.I18N.t('appFeesSAR')}</Text>
              <InputText
                containerInputStyle={{ paddingVertical: 5, backgroundColor:'lightgray' }}
                onRef={(ref) => (this.sarRef = ref)}
                containerStyle={styles.inputStyle}
                value={commissionAmt}
                editable={false}
                keyboardType={'decimal-pad'}
                errorMsg={sarError}
                placeholder={'SAR'}
                returnKeyType={'next'}
                onSubmitEditing={() => { }}
                blurOnSubmit={true}
              />

              <Text style={styles.inputTitle}>{config.I18N.t('youWillReceiveSAR')}</Text>
              <InputText
                containerInputStyle={{ paddingVertical: 5}}
                onRef={(ref) => (this.sarRef = ref)}
                containerStyle={styles.inputStyle}
                value={receiveAmt}
                onChangeText={(sar) => {
                  onSarChange(`${Number(sar)*1.25}`);
                }}
                keyboardType={'decimal-pad'}
                errorMsg={sarError}
                placeholder={'SAR'}
                returnKeyType={'next'}
                onSubmitEditing={() => { }}
                blurOnSubmit={true}
              />

              <CustomButton
                btnTxt={config.I18N.t('add')}
                onPress={onPressAdd}
                containerStyle={styles.btnStyle}
              />
            </View>
          </View>
        </DialogContent>
      </Dialog>
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
  dropdownView: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 20,
  },
  drop: { marginHorizontal: 0, marginBottom: 0 },
  logoIcon: { width: 70, height: 70, marginTop: 15 },
  titleTxt: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: config.Constant.Font_Bold,
    marginBottom: 5,
    marginTop: 5,
    color: config.Constant.COLOR_BLACK,
  },
  inputTitle: {
    textAlign: 'left',
    fontSize: 14,
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
  btnStyle: { width: '100%', marginBottom: 15 },
  resend: {
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 15,
    fontFamily: config.Constant.Font_Regular,
    color: config.Constant.COLOR_LIGHT_GREY,
  },
  inputStyle: { width: '100%', marginBottom: 16 },
  errorMsgStyle: {
    width: '100%',
    marginTop: 5,
    textAlign: 'left',
    paddingLeft: 10,
    fontSize: 15,
    fontFamily: config.Constant.Font_Roboto_Italic,
    color: '#FF0000',
  },
});
