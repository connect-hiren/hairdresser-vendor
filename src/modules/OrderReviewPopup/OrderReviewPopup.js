import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Image,
  BackHandler,
} from 'react-native';
import config from '../../config';
import CustomDialog from '../../component/CustomDialog';
import CustomButton from '../../component/CustomButton';
import CodeInput from 'react-native-code-input';
import InputText from '../../component/InputText';
import Ripple from 'react-native-material-ripple';
import StarRating from 'react-native-star-rating';

export default class OrderReviewPopup extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dialogData: {},
      dialogVisible: false,
      ReviewTxt: '',
      rating: 4,
      ReviewTxtError: ''
    };

    BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
  }

  isVisible=()=> this.state.dialogVisible;

  _handleBackPress = () => {
    if (!!this.state.dialogVisible) {

      this.setState({ dialogVisible: false });

      setTimeout(() => {
        this.setState({ dialogData: {} });
      }, 500);
      return true;
    }
  };
  onShowAlert = (data) => {
    this.setState({ visible: true, dialogData: data, dialogVisible: true });
  };
  _onFinishCheckingCode = (code) => {
    console.log("_onFinishCheckingCode",code);
  };
  onTouchOutside = (pressOK) => {
    this.state.dialogData.onPressPositiveBtn(
      this.state.dialogData.extraData,
      pressOK,
      this.state.rating,
      this.state.ReviewTxt,
    );

    this.setState({ dialogVisible: false });

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
          });
        }}
        visible={this.state.dialogVisible}>
        <View style={styles.dialogView}>
          <Text style={styles.titleTxt}>{config.I18N.t('giveFeedback')}</Text>
          <StarRating
            // disabled={true}
            fullStar={require('../../assets/images/filledStar.png')}
            halfStar={require('../../assets/images/icon_halfstar.png')}
            emptyStar={require('../../assets/images/startInactive.png')}
            maxStars={5}
            rating={this.state.rating}
            containerStyle={{
              height: 30,
              // width: 120,
              alignSelf: 'center',
              marginBottom: 30,
            }}
            starStyle={{ marginRight: 5 }}
            starSize={40}
            selectedStar={(rating) => {
              this.setState({
                rating,
              });
            }}
          />
          {/* <InputText
            onRef={(ref) => (this.ReviewTxtRef = ref)}
            containerStyle={styles.inputStyle}
            placeholder={config.I18N.t('postExperience')}
            value={this.state.ReviewTxt}
            containerInputStyle={{ fontSize: 14 }}
            onChangeText={(ReviewTxt) => {
              this.setState({
                ReviewTxt,
                ReviewTxtError: '',
              });
            }}
            multiline={true}
            blurOnSubmit={true}
            minHeight={100}
            maxHeight={100}
            textAlignVertical={'top'}
            errorMsg={this.state.ReviewTxtError}
          /> */}
          <Ripple
            onPress={() => {
              this.onTouchOutside(true);
            }}
            style={[styles.wrapRow]}>
            <Text style={[styles.wrapTxtRow]}>{config.I18N.t('submit')}</Text>
          </Ripple>
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
    fontSize: 24,
    fontFamily: config.Constant.Font_Bold,
    marginBottom: 10,
    marginTop: 15,
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
  wrapTxtRow: {
    fontFamily: config.Constant.Font_Regular,
    letterSpacing: 0.84,
    paddingTop: 2,
    paddingBottom: 1.5,
    color: config.Constant.COLOR_TAB,
    fontSize: 18,
  },
  wrapRow: {
    borderColor: config.Constant.COLOR_TAB,
    paddingHorizontal: 10,
    borderRadius: 50,
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    width: config.Constant.SCREEN_WIDTH * 0.4,
    marginBottom: 15,
  },
  inputStyle: { width: '100%', marginBottom: 20 },
});
