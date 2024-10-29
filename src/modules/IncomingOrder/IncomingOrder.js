import React from 'react';
import {
  StyleSheet,
  AppState,
  Text,
  View,
  Image,
  BackHandler,
  I18nManager,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import config from '../../config';
import CustomDialog from '../../component/CustomDialog';
import CustomButton from '../../component/CustomButton';
import {ScrollView} from 'react-native-gesture-handler';
import Ripple from 'react-native-material-ripple';
import FastImage from 'react-native-fast-image';
import StarRating from 'react-native-star-rating';
import moment from 'moment';
import InputText from '../../component/InputText';
import CountDown from '../../component/CountDown';
import Modal from 'react-native-modal';
import modules from '..';

export default class IncomingOrder extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dialogData: {},
      dialogVisible: false,
      timeNow: '',
      rejectionReason: '',
      appState: AppState.currentState,
    };

    setTimeout(() => {
      BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
    }, 3000);
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  isVisible = () => this.state.dialogVisible;

  _handleAppStateChange = (nextAppState) => {};

  _handleBackPress = () => {
    return this.state.dialogVisible;
  };

  onShowAlert = (data) => {
    // this.setState({
    //   visible: true,
    //   dialogData: data,
    //   dialogVisible: true,
    // });

    try {
      var timeN = moment().format();
      var timeL = moment
        .utc(data.extraData.request_date, 'YYYY-MM-DD HH:mm:ss')
        .add(300, 's')
        .local()
        .format();
      var timeNow = moment(timeL).diff(moment(timeN), 'second');
      // console.log(timeNow,"timeL",timeL,"timeL",timeN);
      setTimeout(()=>{
        if (!!timeNow && timeNow < 301 && timeNow > 0) {
          this.setState(
            {
              visible: true,
              dialogData: data,
              dialogVisible: true,
              rejectionReason: '',
              timeNow,
            },
            () => {
              // console.log(this.state.dialogData, "state dialogue")
            },
          );
        }
      },500)
     
    } catch (error) {}
  };

  onTouchOutside = (pressOK) => {
    // this.state.dialogData.onPressPositiveBtn(
    //   this.state.dialogData.extraData,
    //   pressOK,
    // );

    this.setState({dialogVisible: false});

    setTimeout(() => {
      this.setState({dialogData: {}});
    }, 500);
  };
  onTimeOutPopup = () => {
    this.state.dialogData.onTimeOutPopup();
  };
  getSubTotal = (type) => {
    const {dialogData} = this.state;
    if (
      !dialogData ||
      !dialogData.extraData ||
      !dialogData.extraData.order_service
    ) {
      return 0;
    }
    var total = 0;
    var Subtotal = 0;
    var totalFees = 0;
    var totalCommission =
      parseFloat(dialogData.extraData.tax_percentage) +
      parseFloat(dialogData.extraData.commision_percentage);
    dialogData.extraData.order_service.map((item, index) => {
      if (!!item.price && !!item.quantity) {
        Subtotal = Subtotal + parseFloat(item.price * parseInt(item.quantity));
      }
    });
    if (type == '1') {
      return Subtotal;
    } else if (type == '2') {
      return (Subtotal * totalCommission) / 100;
    } else if (type == '3') {
      return Subtotal + (Subtotal * totalCommission) / 100;
    } else if (type == '4') {
      return parseFloat(
        !!dialogData.extraData && dialogData.extraData.tax_amount,
      );
    } else if (type == '5') {
      return parseFloat(
        !!dialogData.extraData && dialogData.extraData.commision_amount,
      );
    }
  };

  acceptOrder = async (order_id) => {
    // console.log(config.Constant.RootNavigation, order_id, "RootNavigation")
    try {
      modules.IncomingOrder.isVisible() && modules.IncomingOrder.hideRef();
      if (!!order_id) {
        config.Constant.showLoader.showLoader();
        const formData = new FormData();
        formData.append('order_id', order_id);

        var data = await modules.APIServices.PostApiCall(
          config.ApiEndpoint.ORDER_ACCEPT,
          formData,
        );
        config.Constant.showLoader.hideLoader();
        if (data.status_code == 200) {
          this.props.onAccept();
          modules.IncomingOrder.isVisible() && modules.IncomingOrder.hideRef();
          config?.Constant?.RootNavigation &&
            config?.Constant?.RootNavigation.push('OrderDetails', {
              order_id: order_id,
            });
        }
      }
    } catch (error) {
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('error'),
        error.toString(),
      );
    }
  };

  rejectOrder = async (order_id, rejectionReason) => {
    // console.log("rejectOrder ...11")
    modules.IncomingOrder.isVisible() && modules.IncomingOrder.hideRef();
    if (!!order_id) {
      config.Constant.showLoader.showLoader();
      const formData = new FormData();
      formData.append('order_id', order_id);
      formData.append('reject_reason', rejectionReason);
      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.ORDER_REJECT,
        formData,
      );
      config.Constant.showLoader.hideLoader();
      // console.log("rejectOrder ...12", data)
      if (data?.status_code == 200) {
        try {
          config.MSound.stop();
        } catch (e) {
          console.log('ERROR- ', e);
        }
        config.Constant.RootNavigation.reset({
          index: 1,
          routes: [{name: 'DashboardTab'}],
        });
        // config.Constant.RootNavigation.navigate('OrderDetails', {
        //   order_id: order_id,
        // });
        // TODO PUT HERE
        if (data?.data?.offline_user == 1) {
          await AsyncStorage.setItem('is_online', '2');
          this.props.onReject();
        }
        modules.IncomingOrder.isVisible() && modules.IncomingOrder.hideRef();
      }
    }
  };

  render() {
    // console.log("incoming order....render I18nManager.isRTL-- >> ", I18nManager.isRTL)
    const {timeNow, dialogData} = this.state;
    if (Object.keys(dialogData).length === 0) {
      return null;
    }
    let renderSubTotal = 0;
    return (
      <CustomDialog
        onPressClose={() => {
          // this.setState({
          //   dialogVisible: false,
          // });
        }}
        container1={{
          height:
            config.Constant.SCREEN_HEIGHT > 850
              ? config.Constant.SCREEN_HEIGHT * 0.62
              : config.Constant.SCREEN_HEIGHT * 0.75,
        }}
        visible={this.state.dialogVisible}>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <View style={styles.dialogView}>
            <Text style={styles.titleTxt}>
              {config.I18N.t('orderIncoming')}
            </Text>
            <Text style={styles.titleDesTxt}>
              {config.I18N.t('orderWillCacnel')}
            </Text>
            <View style={styles.serviceRowView}>
              <FastImage
                resizeMode={'cover'}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 50,
                  marginLeft: -50,
                }}
                source={
                  !!dialogData.extraData &&
                  !!dialogData.extraData.customer &&
                  !!dialogData.extraData.customer.image
                    ? {
                        uri:
                          config.Constant.UsersProfile_Url +
                          '' +
                          dialogData.extraData.customer.image,
                      }
                    : require('../../assets/images/male.png')
                }
              />
              <View style={{paddingHorizontal: 10}}>
                <Text numberOfLines={2} style={styles.reviewName}>
                  {!!dialogData.extraData &&
                  !!dialogData.extraData.customer &&
                  !!dialogData.extraData.customer.name
                    ? dialogData.extraData.customer.name
                    : ''}
                </Text>
                <StarRating
                  disabled={true}
                  //fullStarColor={config.Constant.COLOR_YELLOW}
                  maxStars={5}
                  rating={
                    !!dialogData.extraData &&
                    !!dialogData.extraData.customer &&
                    !!dialogData.extraData.customer.avg_rating &&
                    dialogData.extraData.customer.avg_rating.length > 0 &&
                    !!dialogData.extraData.customer.avg_rating[0].avg_rating
                      ? dialogData.extraData.customer.avg_rating[0].avg_rating
                      : 0
                  }
                  containerStyle={{height: 20, width: 70}}
                  starStyle={{marginRight: 5}}
                  starSize={25}
                  fullStar={require('../../assets/images/filledStar.png')}
                  halfStar={require('../../assets/images/icon_halfstar.png')}
                  emptyStar={require('../../assets/images/startInactive.png')}
                  selectedStar={(rating) => {}}
                />
              </View>
            </View>
            {!!timeNow && (
              <CountDown
                size={20}
                until={parseInt(timeNow)}
                onFinish={() => {
                  this.onTimeOutPopup();
                }}
                digitStyle={{
                  backgroundColor: 'transparent',
                  borderWidth: 0,
                  marginBottom: 20,
                }}
                digitTxtStyle={{
                  color: config.Constant.COLOR_TAB,
                  fontFamily: config.Constant.Font_Bold,
                }}
                timeLabelStyle={{
                  fontSize: 24,
                  fontFamily: config.Constant.Font_Bold,
                  color: config.Constant.COLOR_TAB,
                }}
                separatorStyle={{
                  color: config.Constant.COLOR_TAB,
                  marginBottom: 25,
                }}
                timeToShow={I18nManager.isRTL ? ['M', 'S'] : ['M', 'S']}
                timeLabels={{m: null, s: null}}
                showSeparator
              />
            )}
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
                padding: 0,
                backgroundColor: 'white',
                borderRadius: 10,
              }}>
              <View style={[styles.headerStyle, {width: '100%'}]}>
                <Text style={styles.descTitle}>{config.I18N.t('service')}</Text>
                <Text style={styles.qtyTitle}>{config.I18N.t('qty')}</Text>
                <Text style={styles.priceTitle}>{config.I18N.t('price')}</Text>
              </View>
              {/* <View style={[styles.headerBorderStyle, {marginLeft: 0}]} /> */}
              {!!dialogData.extraData &&
                !!dialogData.extraData.order_service &&
                dialogData.extraData.order_service.map((item, index) => {
                  renderSubTotal =
                    renderSubTotal + Number(item.price) * item.quantity; // config.Constant.dresserAmountWithFee(item.total, Number(item.service_tax))
                  return (
                    <View style={[styles.descStyle, {marginTop: 20}]}>
                      <Text style={styles.descData}>
                        {!!item.category && config.I18N.locale == 'en'
                          ? item.category?.name || '-'
                          : item.category?.ar_name || '-'}
                      </Text>
                      <Text style={styles.qtyData}>{item.quantity}</Text>
                      <Text style={styles.priceData}>{`${
                        Number(item.price) * item.quantity
                      }`}</Text>
                    </View>
                  );
                })}

              <View style={styles.borderView} />
              <View style={[styles.headerStyle, {marginTop: 5, width: '100%'}]}>
                <Text style={styles.descSubTotal}>
                  {config.I18N.t('SubTotal')}
                </Text>
                <Text style={styles.qtySubTotal}></Text>
                <Text style={styles.priceSubTotal}>{`${renderSubTotal}`}</Text>
              </View>
              {!!dialogData.extraData &&
                !!dialogData.extraData.promo_code_amount && (
                  <View
                    style={[
                      styles.headerStyle,
                      {marginTop: 10, width: '100%'},
                    ]}>
                    <Text style={styles.descData}>
                      {config.I18N.t('promoCode')}
                    </Text>
                    <Text style={styles.qtyData}></Text>
                    <Text style={styles.priceData}>
                      {dialogData.extraData.promo_code_amount}
                    </Text>
                  </View>
                )}
              <View
                style={[styles.headerStyle, {marginTop: 10, width: '100%'}]}>
                <Text style={styles.descData}>
                  {config.I18N.t('fees')} (
                  {!!dialogData.extraData &&
                    !!dialogData.extraData.commision_percentage &&
                    dialogData.extraData.commision_percentage}
                  %)
                </Text>
                <Text style={styles.qtyData}></Text>
                <Text style={styles.priceData}>{this.getSubTotal(5)}</Text>
              </View>
              <View
                style={[styles.headerStyle, {marginTop: 10, width: '100%'}]}>
                <Text style={styles.descData}>
                  {config.I18N.t('tax')} (
                  {!!dialogData.extraData &&
                    !!dialogData.extraData.tax_percentage &&
                    dialogData.extraData.tax_percentage}
                  %)
                </Text>
                <Text style={styles.qtyData}></Text>
                <Text style={styles.priceData}>{this.getSubTotal(4)}</Text>
              </View>
              <View style={styles.borderView} />
              <View style={[styles.headerStyle, {marginTop: 5, width: '100%'}]}>
                <Text
                  style={[
                    styles.descTitle,
                    {color: config.Constant.COLOR_TAB, fontSize: 20},
                  ]}>
                  {config.I18N.t('Total')}
                </Text>
                <Text
                  style={[
                    styles.qtyTitle,
                    {color: config.Constant.COLOR_TAB, fontSize: 20},
                  ]}></Text>
                <Text
                  style={[
                    styles.priceTitle,
                    {color: config.Constant.COLOR_TAB},
                  ]}>
                  {!!dialogData.extraData &&
                    !!dialogData.extraData.final_total &&
                    dialogData.extraData.final_total}
                </Text>
              </View>
            </View>
            <InputText
              onRef={(ref) => (this.rejectionReasonRef = ref)}
              containerStyle={styles.inputStyle}
              value={this.state.rejectionReason}
              multiline={true}
              minHeight={100}
              maxHeight={100}
              textAlignVertical={'top'}
              onChangeText={(rejectionReason) => {
                this.setState({
                  rejectionReason,
                });
              }}
              placeholder={config.I18N.t('rejectionReason')}
            />
          </View>
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <Ripple
            onPress={() => {
              // console.log(this.state.dialogData, "id")
              try {
                this.acceptOrder(this.state.dialogData.extraData.id);
              } catch (error) {
                console.log(error, 'error');
              }
            }}
            style={[styles.wrapRow]}>
            <Text style={[styles.wrapTxtRow]}>{config.I18N.t('accept')}</Text>
          </Ripple>
          <Ripple
            onPress={() => {
              // console.log(this.state.dialogData, "id")
              //modules.IncomingOrder.hideRef();
              this.rejectOrder(
                this.state.dialogData.extraData.id,
                this.state.rejectionReason,
              );

              // await this.state.dialogData.onPressRejectBtn(
              //   this.state.rejectionReason,
              // );
              //this.setState({ dialogVisible: false });
            }}
            style={[styles.wrapRow, {backgroundColor: 'white'}]}>
            <Text
              style={[styles.wrapTxtRow, {color: config.Constant.COLOR_TAB}]}>
              {config.I18N.t('reject')}
            </Text>
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
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  logoIcon: {width: 50, height: 50, marginTop: 15},
  titleTxt: {
    textAlign: 'center',
    fontSize: 24,
    fontFamily: config.Constant.Font_Bold,
    marginBottom: 5,
    marginTop: 5,
    color: config.Constant.COLOR_BLACK,
  },
  titleDesTxt: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: config.Constant.Font_Regular,
    marginBottom: 5,
    color: config.Constant.COLOR_LIGHT_GREY,
  },
  timerDisplay: {
    textAlign: 'center',
    fontSize: 24,
    fontFamily: config.Constant.Font_Bold,
    marginBottom: 20,
    color: config.Constant.COLOR_TAB,
  },
  btnStyle: {width: '100%', marginBottom: 15},
  resend: {
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 15,
    fontFamily: config.Constant.Font_Regular,
    color: config.Constant.COLOR_LIGHT_GREY,
  },
  headerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  headerBorderStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 60,
    alignSelf: 'flex-start',
    marginBottom: 20,
    marginTop: 5,
    marginLeft: config.Constant.SCREEN_WIDTH * 0.05,
    borderBottomWidth: 1.5,
    borderBottomColor: config.Constant.COLOR_TAB,
  },
  descStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 15,
    //backgroundColor: config.Constant.COLOR_LIGHT_BG,
    borderRadius: 100,
  },
  descTitle: {
    fontSize: 16,
    fontFamily: config.Constant.Font_Semi_Bold,
    color: config.Constant.COLOR_BLACK,
    textAlign: 'left',
    flex: 1,
  },
  qtyTitle: {
    fontSize: 16,
    fontFamily: config.Constant.Font_Semi_Bold,
    color: config.Constant.COLOR_BLACK,
    textAlign: 'center',
    width: 80,
  },
  priceTitle: {
    fontSize: 16,
    fontFamily: config.Constant.Font_Semi_Bold,
    color: config.Constant.COLOR_BLACK,
    textAlign: 'right',
    width: 70,
  },
  descData: {
    fontSize: 14,
    fontFamily: config.Constant.Font_Regular,
    color: config.Constant.COLOR_BLACK,
    textAlign: 'left',
    flex: 1,
  },
  qtyData: {
    fontSize: 14,
    fontFamily: config.Constant.Font_Regular,
    color: config.Constant.COLOR_BLACK,
    textAlign: 'center',
    width: 80,
  },
  priceData: {
    fontSize: 14,
    fontFamily: config.Constant.Font_Regular,
    color: config.Constant.COLOR_BLACK,
    textAlign: 'right',
    width: 70,
  },
  descSubTotal: {
    fontSize: 16,
    fontFamily: config.Constant.Font_Semi_Bold,
    color: config.Constant.COLOR_BLACK,
    textAlign: 'left',
    flex: 1,
  },
  qtySubTotal: {
    fontSize: 16,
    fontFamily: config.Constant.Font_Semi_Bold,
    color: config.Constant.COLOR_BLACK,
    textAlign: 'center',
    width: 80,
  },
  priceSubTotal: {
    fontSize: 15,
    fontFamily: config.Constant.Font_Semi_Bold,
    color: config.Constant.COLOR_BLACK,
    textAlign: 'right',
    width: 70,
  },
  borderView: {
    width: '100%',
    alignSelf: 'center',
    borderBottomWidth: 1,
    marginTop: 5,
    borderColor: config.Constant.COLOR_BORDER_COLOR,
  },
  wrapTxtRow: {
    fontFamily: config.Constant.Font_Regular,
    fontSize: 15,
    letterSpacing: 0.84,
    color: config.Constant.COLOR_WHITE,
    paddingTop: 2,
    paddingBottom: 1.5,
  },
  wrapRow: {
    flexDirection: 'row',
    borderColor: config.Constant.COLOR_TAB,
    backgroundColor: config.Constant.COLOR_TAB,
    paddingHorizontal: 15,
    paddingVertical: 2,

    borderRadius: 50,
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    marginHorizontal: 10,
  },
  reviewName: {
    fontSize: 15,
    fontFamily: config.Constant.Font_Semi_Bold,
    color: config.Constant.COLOR_BLACK,
    letterSpacing: 0.98,
    textAlign: 'left',
    marginBottom: 5,
  },
  serviceRowView: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 10,
    alignItems: 'center',
    //width:'50%',
    marginVertical: 10,
  },
  inputStyle: {width: '100%', marginVertical: 7},
});
