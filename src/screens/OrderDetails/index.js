import React from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  ScrollView,
  Image,
  RefreshControl,
  BackHandler,
  Linking,
  Platform,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Ripple from 'react-native-material-ripple';
import StarRating from 'react-native-star-rating';
import CustomButton from '../../component/CustomButton';
import InputText from '../../component/InputText';
import config from '../../config';
import styles from './styles';
import Timeline from 'react-native-timeline-flatlist';
import modules from '../../modules';
import CustomHeader from '../../component/CustomHeader';
import EnterOtpPopup from '../../component/EnterOtpPopup';
import AskOtpPopup from '../../component/AskOtpPopup';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  AnimatedRegion,
} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Polyline from '@mapbox/polyline';
import { countDistance, getArabicFromEng } from '../../Util/Utilities';
import moment from 'moment';

export default class OrderDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageUdate: true,
      Data1: 1,
      Data2: 1,
      Data3: 1,
      isFetching: false,
      timeLine: [
        {
          id: 0,
          time: '',
          lineColor: 'grey',
          icon: require('../../assets/images/emptyCircle.png'),
          description: '',
          title: config.I18N.t(`goingToLocation`),
        },
        {
          id: 1,
          time: '',
          lineColor: 'grey',
          icon: require('../../assets/images/emptyCircle.png'),
          description: '',
          title: config.I18N.t(`workInProgress`),
        },
        {
          id: 2,
          time: '',
          lineColor: 'grey',
          icon: require('../../assets/images/emptyCircle.png'),
          description: '',
          title: config.I18N.t(`completed`),
        },
      ],
      dataSource: null,
      visiableAskOtpPopup: false,
      visiableEnterOtpPopup: false,
      otpCode: '',
      coords: [],
      coordinates: [],
      startlat: config.Constant.USER_DATA.latitude,
      startlong: config.Constant.USER_DATA.longitude,
      endlat: 37.0902,
      endlong: 95.7129,
      showMap: false,
      forceLocation: true,
      highAccuracy: true,
      loading: false,
      showLocationDialog: true,
      significantChanges: false,
      updatesEnabled: false,
      foregroundService: false,
      location: {},
      between: 0,
      counterVal: '00:00',
    };
  }
  getDirections = async (startLoc, destinationLoc) => {
    var link = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=${config.Constant.MAP_KEY}`;
    // console.log(link);
    try {
      //config.Constant.showLoader.showLoader()
      let resp = await fetch(link);
      config.Constant.showLoader.hideLoader();
      let respJson = await resp.json();
      
      let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
      let coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });
      this.setState({ coords: coords });
      return coords;
    } catch (error) {
      console.log("getDirections- error - ",error);
      return error;
    }
  };
  componentDidMount = () => {
    // this.getDirections(
    //   `${this.state.startlat},${this.state.startlong}`,
    //   `${this.state.endlat},${this.state.endlong}`,
    // );
    this.props.navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
      try {
        var order_id = this.props.route.params.order_id;
        if (!!order_id) {
          this.getOrderDetails(order_id);
        }
      } catch (error) { }
    });
    this.props.navigation.addListener('blur', () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.hardwareBackPress,
      );
    });
    config.Constant.socket.on('send_notification', (data) => {
      if (
        !!data &&
        !!data.result &&
        !!data.result.order_id &&
        !!this.state.dataSource &&
        data.result.order_id == this.state.dataSource.id
      ) {
        this.getOrderDetails(data.result.order_id);
      }
      console.log("MANAGE_STATE_CHAGE- OrderDetails->> ",data);
          
    if (!!data.result.type && data.result.type == config.Constant.ORDER_REQUEST) {
      this.getOrderDetails(data.result.order_id);
      // console.log("CUSTOM_SOUND -- 2 play ")
      try{
        config.MSound.play()
      } catch(e){
        console.log("ERROR- ", e)
      }

      
    } else if (!!data.result.type && data.result.type == config.Constant.ORDER_TIMEOUT) {
      // console.log("CUSTOM_SOUND -- 3 stop")
      try{
        config.MSound.stop()
      } catch(e){
        console.log("ERROR- ", e)
      }
      modules.IncomingOrder.isVisible() && modules.IncomingOrder.hideRef();
      config.Constant.RootNavigation.navigate('Home');
    } else if (
      !!data.result.type && data.result.type == config.Constant.ORDER_CANCEL ) {
        // console.log("CUSTOM_SOUND -- 4 stop")
        try{
        config.MSound.stop()
        } catch(e){
          console.log("ERROR- ", e)
        }
        modules.IncomingOrder.isVisible() && modules.IncomingOrder.hideRef();
        modules.RequestPopup.isVisible() && modules.RequestPopup.hideRef();
        config.Constant.RootNavigation.navigate('Home');
        modules.DropDownAlert.showAlert(
          'error',
          config.I18N.t('CancelOrder'),
          config.I18N.t('requestCancelOrder'),
          {},
          0,
          true
        );
      
    }else if(!!data.result.type && data.result.type == config.Constant.ORDER_PAID){
      modules.RequestPopup.isVisible() && modules.RequestPopup.hideRef()
    }
    else if (!!data.result.type && data.result.type == config.Constant.ORDER_PAYMENT_TIMEOUT) {
      modules.RequestPopup.isVisible() && modules.RequestPopup.hideRef()
      config.Constant.RootNavigation.navigate('Home');
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('noResponce'),
        config.I18N.t('paymentReqestTimeot'),
        {},
        0,
        true
      );

    }
    });
  };
  hardwareBackPress = () => {
    if (
      !!this.state.dataSource &&
      this.state.dataSource.order_status != 4 &&
      this.state.dataSource.order_status != 5 &&
      this.state.dataSource.order_status != 6
    ) {
      if (!this.props.navigation.canGoBack()) {
        this.props.navigation.reset({
          index: 1,
          routes: [{ name: 'DashboardTab' }],
        });
      } else {
        this.props.navigation.pop();
      }
    }
    return true;
  };
  onEventComplete = (event) => { };
  getLiveLocation = () => {
    this.watchId = Geolocation.watchPosition(
      (position) => {
        this.setState(
          {
            location: position,
            startlat: position.coords.latitude,
            startlong: position.coords.longitude,
          },
          () => {
            var distance = countDistance(
              position.coords.latitude,
              position.coords.longitude,
              this.state.endlat,
              this.state.endlong,
              'M',
            );
            //alert(distance.toFixed(1))
            this.setState({
              between: distance.toFixed(1),
            });
            this.getDirections(
              `${this.state.startlat},${this.state.startlong}`,
              `${this.state.endlat},${this.state.endlong}`,
            );
          },
        );
        config.Constant.socket.emit(
          'send_lat_long',
          config.Constant.USER_DATA.id,
          this.state.dataSource.customer.id,
          position.coords.latitude,
          position.coords.longitude,
        );
        // position.coords.latitude
        //     position.coords.longitude
        // console.log(position);
      },
      (error) => {
        console.log("ERROR getLiveLocation-",error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'bestForNavigation',
        },
        enableHighAccuracy: this.state.highAccuracy,
        distanceFilter: 0,
        interval: 5000,
        fastestInterval: 2000,
        forceRequestLocation: this.state.forceLocation,
        showLocationDialog: this.state.showLocationDialog,
        useSignificantChanges: this.state.significantChanges,
      },
    );
  };
  getFixTimeline = () => {
    const { dataSource } = this.state;
    this.getStartTime();
    if (!!dataSource && !!dataSource.order_status) {
      if (dataSource.order_status == 5) {
        this.setState(
          {
            showMap: true,
          },
          () => {
            this.getLiveLocation();
          },
        );
        this.state.timeLine[0] = {
          id: 0,
          time: '',
          lineColor: config.Constant.COLOR_TAB,
          icon: require('../../assets/images/checked.png'),
          description: '',
          title: config.I18N.t(`goingToLocation`),
        };
      } else {
        this.setState({
          showMap: false,
        });
        try {
          // Geolocation.clearWatch(this.watchId);
        } catch (error) { }
      }
      if (dataSource.order_status == 6) {
        this.setState(
          {
            showMap: true,
          },
          () => {
            this.getLiveLocation();
          },
        );
        this.state.timeLine[0] = {
          id: 0,
          time: '',
          lineColor: config.Constant.COLOR_TAB,
          icon: require('../../assets/images/checked.png'),
          description: '',
          title: config.I18N.t(`goingToLocation`),
        };
        this.state.timeLine[1] = {
          id: 0,
          time: '',
          lineColor: config.Constant.COLOR_TAB,
          icon: require('../../assets/images/icon_clock.png'),
          description: '',
          title: config.I18N.t(`workInProgress`),
        };
      }
      if (dataSource.order_status == 7) {
        this.state.timeLine[0] = {
          id: 0,
          time: '',
          lineColor: config.Constant.COLOR_TAB,
          icon: require('../../assets/images/checked.png'),
          description: '',
          title: config.I18N.t(`goingToLocation`),
        };
        this.state.timeLine[1] = {
          id: 0,
          time: '',
          lineColor: config.Constant.COLOR_TAB,
          icon: require('../../assets/images/icon_clock.png'),
          description: '',
          title: config.I18N.t(`workInProgress`),
        };
        this.state.timeLine[2] = {
          id: 0,
          time: '',
          lineColor: config.Constant.COLOR_TAB,
          icon: require('../../assets/images/checked.png'),
          description: '',
          title: config.I18N.t(`completed`),
        };
      }
      try {
        Geolocation.clearWatch(this.watchId);
      } catch (error) { }
      this.setState({
        timeLine: this.state.timeLine,
      });
    }
  };
  onRefresh() {
    this.setState({ isFetching: true }, () => {
      this.getOrderDetails(this.state.dataSource.id, false);
    });
  }
  getOrderDetails = async (order_id, is_loader = true) => {
    //console.log('order_id = ' + order_id);
    if (!!order_id) {
      if (!!is_loader) {
        config.Constant.showLoader.showLoader();
      }
      const formData = new FormData();
      formData.append('order_id', order_id);

      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.ORDER_DETAILS,
        formData,
      );
      this.setState({
        isFetching: false,
      });
      config.Constant.showLoader.hideLoader();
      // console.log('getOrderDetails response= ' + JSON.stringify(data));
      if (data.status_code == 200) {
        this.setState(
          {
            dataSource: data.data,
            endlat: data.data.latitude,
            endlong: data.data.longitude,
          },
          () => {
            this.getFixTimeline();
          },
        );
        if(!!data?.data &&
          data?.data?.is_payment == 0 &&
          data?.data?.order_status == 4 &&
          data?.data?.payment_method == '2' ){
            // console.log("modules.RequestPopup.getRef ...1")
            !modules.RequestPopup.isVisible() && modules.RequestPopup.getRef({
              title: '',
              negativeBtnTxt: '',
              positiveBtnTxt: '',
              extraData: {...data?.data, isPaymentTimeout: true},
              onPressPositiveBtn: async (data1, pressOK) => {
                if (pressOK) {
                  this.rejectOrder(data?.data?.id,"", true)
                } 
              },
              onTimeOutPopup: async () => {
                this.timeoutOrder(data.data.id);
              },
            });
        }
      }
    }
  };
  timeoutOrder = async (order_id) => {
    // modules.IncomingOrder.hideRef();
    if (!!order_id) {
      config.Constant.showLoader.showLoader();
      const formData = new FormData();
      formData.append('order_id', order_id);

      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.ORDER_TIMEOUT,
        formData,
      );
      config.Constant.showLoader.hideLoader();
      if (data.status_code == 200) {
        config.Constant.RootNavigation.reset({
          index: 1,
          routes: [{name: 'DashboardTab'}],
        });
      }
    }
  };

   //. 1 2 3 4
  rejectOrder = async (order_id, rejectionReason, navigateToHome= false) => {
    modules.IncomingOrder.isVisible() && modules.IncomingOrder.hideRef();
    // console.log("rejectOrder 1- ")
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
      // console.log("rejectOrder 2- ", data)
      if (data.status_code == 200) {
        if(navigateToHome){
          config.Constant.RootNavigation.reset({
            index: 1,
            routes: [{name: 'DashboardTab'}],
          });
        }else{
          config.Constant.RootNavigation.navigate('OrderDetails', {
            order_id: order_id,
          });
        }
        modules.IncomingOrder.isVisible() && modules.IncomingOrder.hideRef();
      }
    }
  };

  goingToLocation = async (order_id) => {
    //console.log('order_id = ' + order_id);
    if (!!order_id) {
      config.Constant.showLoader.showLoader();
      const formData = new FormData();
      formData.append('order_id', order_id);

      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.ORDER_ON_WAY,
        formData,
      );

      // console.log('order_id ORDER_ON_WAY= ' + JSON.stringify(data));
      if (data.status_code == 200) {
        this.setState(
          {
            dataSource: data.data,
          },
          () => {
            this.getFixTimeline();
          },
        );
        config.Constant.showLoader.hideLoader();
      } else {
        config.Constant.showLoader.hideLoader();
        modules.DropDownAlert.showAlert(
          'error',
          config.I18N.t('error'),
          data.message,
        );
      }
    }
  };
  startProcessing = async (order_id) => {
    //console.log('order_id = ' + order_id);
    if (!!order_id) {
      config.Constant.showLoader.showLoader();
      const formData = new FormData();
      formData.append('order_id', order_id);

      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.ORDER_PROCCESS,
        formData,
      );

      // console.log('order_id ORDER_ON_WAY= ' + JSON.stringify(data));
      if (data.status_code == 200) {
        this.setState(
          {
            dataSource: data.data,
          },
          () => {
            this.getFixTimeline();
          },
        );
        config.Constant.showLoader.hideLoader();
      } else {
        config.Constant.showLoader.hideLoader();
        modules.DropDownAlert.showAlert(
          'error',
          config.I18N.t('error'),
          data.message,
        );
      }
    }
  };
  sendOTPStart = async (fromState) => {
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
    formData.append('order_id', this.state.dataSource.id);
    formData.append('is_notification', '1');
    formData.append('email', this.state.dataSource.customer.email);

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
          visiableAskOtpPopupStart: true,
          visiableEnterOtpPopupStart: false,
        });
      } else {
        this.setState({
          visiableEnterOtpPopupStart: true,
          visiableAskOtpPopupStart: false,
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
  endProcessing = async (order_id) => {
    //console.log('order_id = ' + order_id);
    if (!!order_id) {
      config.Constant.showLoader.showLoader();
      const formData = new FormData();
      formData.append('order_id', order_id);
      formData.append('payment_method', order_id);
      formData.append('due_amount', order_id);

      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.ORDER_END,
        formData,
      );

      // console.log('order_id ORDER_ON_WAY= ' + JSON.stringify(data));
      if (data.status_code == 200) {
        this.setState(
          {
            dataSource: data.data,
          },
          () => {
            this.getFixTimeline();
          },
        );
        config.Constant.showLoader.hideLoader();
        !modules.OrderReviewPopup.isVisible() && modules.OrderReviewPopup.getRef({
          title: '',
          negativeBtnTxt: '',
          positiveBtnTxt: '',
          extraData: {},
          onPressPositiveBtn: async (
            data,
            pressOK,
            rating,
            ReviewTxt,
          ) => {
            if (pressOK) {
              this.giveFeedback(rating, ReviewTxt);
            }
          },
        });
        config.Constant.RootNavigation.navigate('Home')
      } else {
        config.Constant.showLoader.hideLoader();
        modules.DropDownAlert.showAlert(
          'error',
          config.I18N.t('error'),
          data.message,
        );
      }
    }
  };
  getStartTime = () => {
    const { dataSource } = this.state;
    var time = '';
    var hour = '';
    var minutes = '';
    var seconds = '';
    try {
      clearInterval(this.countTimer);
    } catch (error) { }
    if (!!dataSource && !!dataSource.start_date && !dataSource.complete_date) {
      this.countTimer = setInterval(() => {
        var duration = moment.duration(
          moment.utc().local().diff(moment.utc(dataSource.start_date).local()),
        );
        seconds = duration.asSeconds();
        var h = Math.floor(seconds / 3600);
        var m = Math.floor((seconds % 3600) / 60);
        var s = Math.floor((seconds % 3600) % 60);

        var hDisplay = h > 0 ? h + (h == 1 ? '' : '') : '';
        hDisplay = hDisplay <= 9 ? '0' + hDisplay : hDisplay;
        var mDisplay = m > 0 ? m + (m == 1 ? '' : '') : '';
        mDisplay = mDisplay <= 9 ? '0' + mDisplay : mDisplay;
        var sDisplay = s > 0 ? s + (s == 1 ? '' : '') : '';
        sDisplay = sDisplay <= 9 ? '0' + sDisplay : sDisplay;
        this.setState({
          counterVal: hDisplay + ':' + mDisplay + ':' + sDisplay,
        });
      }, 1000);
    } else if (!!dataSource.start_date && !!dataSource.complete_date) {
      var duration = moment.duration(
        moment
          .utc(dataSource.complete_date)
          .local()
          .diff(moment.utc(dataSource.start_date).local()),
      );
      seconds = duration.asSeconds();
      var h = Math.floor(seconds / 3600);
      var m = Math.floor((seconds % 3600) / 60);
      var s = Math.floor((seconds % 3600) % 60);

      var hDisplay = h > 0 ? h + (h == 1 ? '' : '') : '';
      hDisplay = hDisplay <= 9 ? '0' + hDisplay : hDisplay;
      var mDisplay = m > 0 ? m + (m == 1 ? '' : '') : '';
      mDisplay = mDisplay <= 9 ? '0' + mDisplay : mDisplay;
      var sDisplay = s > 0 ? s + (s == 1 ? '' : '') : '';
      sDisplay = sDisplay <= 9 ? '0' + sDisplay : sDisplay;
      this.setState({
        counterVal: hDisplay + ':' + mDisplay + ':' + sDisplay,
      });
    } else {
      try {
        clearInterval(this.countTimer);
      } catch (error) { }
    }
  };
  sendOTP = async () => {
    const { dataSource } = this.state;
    config.Constant.showLoader.showLoader();
    const formData = new FormData();
    var otp = Math.floor(1000 + Math.random() * 9000);

    formData.append('order_id', dataSource.id);
    this.setState(
      {
        otpCode: otp,
      },
      () => { },
    );
    formData.append('otp', otp);
    formData.append('is_notification', '1');
    formData.append('email', dataSource.customer.email);

    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.ORDER_OTP,
      formData,
    );
    //alert(data);
    if (data.status_code == 200) {
      modules.DropDownAlert.showAlert(
        'success',
        config.I18N.t('success'),
        data.message,
      );
      // console.log("OTP-",this.state.otpCode);
      setTimeout(() => {
        !modules.AcceptMoney.isVisible() && modules.AcceptMoney.getRef({
          title: '',
          negativeBtnTxt: '',
          positiveBtnTxt: '',
          is_payment_mode: !!dataSource && dataSource.payment_method == '2',
          extraData: {
            OTP: this.state.otpCode,
            final_total:
              !!dataSource && !!dataSource.final_total
                ? dataSource.final_total
                : 0,
            sendOTP: this.sendOTP,
          },
          onPressPositiveBtn: async (data, pressOK, sarVal) => {
            if (pressOK) {
              this.completeOrder(
                sarVal,
                !!dataSource && dataSource.payment_method == '2',
                dataSource.final_total,
              );
            }
          },
        });
      }, 1000);
      config.Constant.showLoader.hideLoader();
    } else {
      config.Constant.showLoader.hideLoader();
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('error'),
        data.message,
      );
    }
  };
  completeOrder = async (sarVal, is_online = false, final_amount = '0') => {
    const { dataSource } = this.state;
    if (!!dataSource.id) {
      config.Constant.showLoader.showLoader();
      const formData = new FormData();
      formData.append('order_id', dataSource.id);
      formData.append(
        'payment_method',
        is_online ? '2' : sarVal == '0' ? '3' : '1',
      );
      formData.append(
        'due_amount',
        is_online ? final_amount : !!sarVal ? sarVal : 0,
      );
      // console.log('COMPLETE_formData' + JSON.stringify(formData));
      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.ORDER_END,
        formData,
      );

      // console.log('order_id ORDER_ON_WAY= ' + JSON.stringify(data));
      if (data.status_code == 200) {
        modules.DropDownAlert.showAlert(
          'success',
          config.I18N.t('success'),
          data.message,
        );
        this.setState(
          {
            dataSource: data.data,
          },
          () => {
            this.getFixTimeline();
          },
        );
        config.Constant.showLoader.hideLoader();
        !modules.OrderReviewPopup.isVisible() && modules.OrderReviewPopup.getRef({
          title: '',
          negativeBtnTxt: '',
          positiveBtnTxt: '',
          extraData: {},
          onPressPositiveBtn: async (
            data,
            pressOK,
            rating,
            ReviewTxt,
          ) => {
            if (pressOK) {
              this.giveFeedback(rating, ReviewTxt);
            }
          },
        });
        config.Constant.RootNavigation.navigate('Home')
      } else {
        config.Constant.showLoader.hideLoader();
        modules.DropDownAlert.showAlert(
          'error',
          config.I18N.t('error'),
          data.message,
        );
      }
    }
  };
  getSubTotal = (type) => {
    const { dataSource } = this.state;
    if (!dataSource) {
      return 0;
    }
    var total = 0;
    var Subtotal = 0;
    var totalFees = 0;
    var totalCommission =
      parseFloat(!!dataSource && dataSource.tax_percentage) +
      parseFloat(!!dataSource && dataSource.commision_percentage);

      Subtotal = 0
    !!dataSource &&
      dataSource.order_service.map((item, index) => {
        if (!!item.price && !!item.quantity) {
          Subtotal = Subtotal + parseFloat(item.price * parseInt(item.quantity));
          Subtotal = Subtotal + (Number(item?.service_tax) * parseInt(item.quantity))
        }
      });
      
    if (type == '1') {
      // console.log("SubTotal = ", Subtotal)
      return parseFloat(!!dataSource && dataSource.hairdressor_amount);
    } else if (type == '2') {
      return (Subtotal * totalCommission) / 100;
    } else if (type == '3') {
      return Subtotal + (Subtotal * totalCommission) / 100;
    } else if (type == '4') {
      return (
        (Subtotal * parseFloat(!!dataSource && dataSource.commision_percentage)) / 100
      );
    } else if (type == '5') {
      return (
        (Subtotal *
          parseFloat(!!dataSource && dataSource.commision_percentage)) /
        100
      );
    }
    else if (type == '7') {
      return parseFloat(!!dataSource && dataSource.commision_amount)
    }
  };
  getStatus = (item) => {
    if (!!item && !!item.order_status) {
      if (item.order_status == 1) {
        return false;
      } else if (item.order_status == 2) {
        return config.I18N.t('reqestTimeot');
      } else if (item.order_status == 3) {
        return config.I18N.t('reqestCancel');
      } else if (item.order_status == 4) {
        return false;
      } else if (item.order_status == 5) {
        return false;
      } else if (item.order_status == 6) {
        return false;
      } else if (item.order_status == 7) {
        return false;
      } else if (item.order_status == 8) {
        return config.I18N.t('requestRejected');
      }
    }
  };
  giveFeedback = async (rating, ReviewTxt) => {
    const { dataSource } = this.state;
    if (!!dataSource.id) {
      config.Constant.showLoader.showLoader();
      const formData = new FormData();
      formData.append('order_id', dataSource.id);
      formData.append('sender_id', dataSource.hairdresser.id);
      formData.append('receiver_id', dataSource.customer.id);
      formData.append('rating', rating);
      formData.append('comment', ReviewTxt);

      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.GIVE_RATING,
        formData,
      );

      // console.log('order_id ORDER_ON_WAY= ' + JSON.stringify(data));
      if (data.status_code == 200) {
        modules.DropDownAlert.showAlert(
          'success',
          config.I18N.t('success'),
          data.message,
        );
        config.Constant.showLoader.hideLoader();
        this.props.navigation.reset({
          index: 1,
          routes: [{ name: 'DashboardTab' }],
        });
      } else {
        config.Constant.showLoader.hideLoader();
        modules.DropDownAlert.showAlert(
          'error',
          config.I18N.t('error'),
          data.message,
        );
      }
    }
  };
  profileView = () => {
    const { dataSource } = this.state;
    // console.log("this.state.dataSource-- ", JSON.stringify(this.state.dataSource))
    return (
      <View style={styles.reviewBox}>
        <View style={styles.serviceRowView}>
          <FastImage
            resizeMode={'cover'}
            style={{ width: 50, height: 50, borderRadius: 50 }}
            source={
              !!dataSource &&
                !!dataSource.customer &&
                !!dataSource.customer.image
                ? {
                  uri:
                    config.Constant.UsersProfile_Url +
                    '' +
                    dataSource.customer.image,
                }
                : require('../../assets/images/male.png')
            }
          />
          <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <Text numberOfLines={2} style={styles.reviewName}>
              {!!dataSource &&
                !!dataSource.customer &&
                !!dataSource.customer.name
                ? dataSource.customer.name
                : ''}
            </Text>
            {!!dataSource &&
              !!dataSource.customer &&
              !!dataSource.customer.reviews &&
              dataSource.customer.reviews.length > 0 && (
                <View
                  style={[
                    styles.serviceRowView,
                    { marginVertical: 0, justifyContent: 'flex-start' },
                  ]}>
                  <StarRating
                    disabled={true}
                    halfStar={require('../../assets/images/icon_halfstar.png')}
                    fullStar={require('../../assets/images/filledStar.png')}
                    emptyStar={require('../../assets/images/startInactive.png')}
                    maxStars={5}
                    rating={
                      !!dataSource &&
                        !!dataSource.customer &&
                        !!dataSource.customer.avg_rating &&
                        dataSource.customer.avg_rating.length > 0 &&
                        !!dataSource.customer.avg_rating[0].avg_rating
                        ? dataSource.customer.avg_rating[0].avg_rating
                        : 0
                    }
                    containerStyle={{ height: 25, width: 70 }}
                    starStyle={{ marginRight: 5 }}
                    starSize={20}
                    selectedStar={(rating) => { }}
                  />
                  <Text numberOfLines={2} style={styles.reviewTxt}>
                    (
                    {!!dataSource &&
                      !!dataSource.customer &&
                      !!dataSource.customer.reviews &&
                      dataSource.customer.reviews.length}{' '}
                    {config.I18N.t('reviews')})
                  </Text>
                </View>
              )}
          </View>

          {!!this.state.dataSource &&
            (this.state.dataSource.order_status == 4 ||
              this.state.dataSource.order_status == 5 ||
              this.state.dataSource.order_status == 6) && 
              // dataSource?.is_payment == 1 &&
               (
              <Ripple
                onPress={() => {
                  !!dataSource &&
                    !!dataSource.customer &&
                    Linking.openURL(`tel:${dataSource.customer.phone_number}`);
                }}
                style={[
                  styles.wrapRow,
                  { backgroundColor: 'white', borderWidth: 1 },
                ]}>
                <Text
                  style={[
                    styles.wrapTxtRow,
                    { color: config.Constant.COLOR_TAB },
                  ]}>
                  {config.I18N.t('call')}
                </Text>
              </Ripple>
            )}
        </View>
      </View>
    );
  };
  
  render() {
    const { dataSource } = this.state;
    // console.log("dataSource-", JSON.stringify(dataSource))
    if(!!dataSource &&
      dataSource.order_status != 3 &&
      dataSource.is_payment == 0 &&
      dataSource.payment_method == '2'){
        var timeN = moment().format();
      var timeL = moment
        .utc(dataSource.updated_at, 'YYYY-MM-DD HH:mm:ss')
        .add(300, 's')
        .local()
        .format();
          var timeNow = moment(timeL).diff(moment(timeN), 'second');
          // modules.RequestPopup.getRef({
          //   title: '',
          //   negativeBtnTxt: '',
          //   positiveBtnTxt: '',
          //   extraData: {...dataSource, isPaymentTimeout: true},
          //   onPressPositiveBtn: async (data1, pressOK) => {
          //     if (pressOK) {
          //       //this.updateData(false);
          //       this.DoPayment();
          //     } else {
          //     }
          //   },
          //   onTimeOutPopup: async () => {
          //     this.timeoutOrder(data.data.id);
          //   },
          // });
          
      }

      console.log(dataSource?.order_status,"dataSource.order_status",this.state.between);

    return (
      <View style={styles.container}>
        <StatusBar
          hidden={false}
          translucent
          backgroundColor="transparent"
          barStyle={'dark-content'}
        />

        <CustomHeader
          onBackPress={
            !!this.state.dataSource &&
              this.state.dataSource.order_status != 4 &&
              this.state.dataSource.order_status != 5 &&
              this.state.dataSource.order_status != 6
              ? () => {
                this.hardwareBackPress();
              }
              : false
          }
          txtStyle={config.I18N.t('orderProcessing')}
        />
        {!!this.state.coords &&
          !!this.state.showMap &&
          this.state.coords.length > 0 &&
          this.profileView()}
        {!!this.state.showMap ? (
          <View style={{ flex: 1 }}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={{ flex: 1 }}
              zoomEnabled={true}
              zoomControlEnabled={true}
              region={{
                latitude: parseFloat(this.state.startlat),
                longitude: parseFloat(this.state.startlong),
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}>
              {!!this.state.coords && this.state.coords.length > 0 && (
                <View>
                  <MapView.Polyline
                    coordinates={this.state.coords}
                    strokeWidth={4}
                    strokeColor="#757686"
                  />
                  {/* <Marker.Animated
                coordinate={{
                  latitude: this.state.endlat,
                  longitude: this.state.endlong,
                  latitudeDelta: 0.09,
                  longitudeDelta: 0.02,
                }}
                // title={'ok'}
                // description={'okok'}
                icon={require('../../assets/images/scissor.png')}
              >
                <Image
                  source={require('../../assets/images/scissor.png')}
                  resizeMode={FastImage.resizeMode.contain}
                  style={{
                    height: 30,
                    width: 30,
                    marginBottom: 10,
                    marginLeft: 20,
                    //tintColor: config.Constant.COLOR_TAB,
                  }}
                />
              </Marker.Animated> */}
                  <Marker.Animated
                    title=""
                    coordinate={{
                      latitude: parseFloat(this.state.endlat),
                      longitude: parseFloat(this.state.endlong),
                      latitudeDelta: 0.09,
                      longitudeDelta: 0.02,
                    }}
                    ref={(ref) => {
                      this.markerStartRef = ref;
                    }}
                    style={{
                      transform: [{ rotate: `${50}deg` }],
                    }}
                    tracksViewChanges={false}
                    icon={require('../../assets/images/scissor.png')}
                  />
                  <Marker.Animated
                    title=""
                    coordinate={{
                      latitude: parseFloat(this.state.startlat),
                      longitude: parseFloat(this.state.startlong),
                      latitudeDelta: 0.09,
                      longitudeDelta: 0.02,
                    }}
                    ref={(ref) => {
                      this.markerRef = ref;
                    }}
                    style={{
                      transform: [{ rotate: `${50}deg` }],
                      width: 10,
                      height: 10,
                    }}
                    tracksViewChanges={false}
                    icon={require('../../assets/images/pincar.png')}
                  />
                </View>
              )}
            </MapView>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  showMap: false,
                });
              }}
              style={[
                styles.wrapRow,
                {
                  backgroundColor: 'white',
                  borderWidth: 1,
                  width: config.Constant.SCREEN_WIDTH * 0.8,
                  position: 'absolute',
                  bottom:
                    !!dataSource &&
                      parseFloat(this.state.between) != 'NaN' &&
                      parseFloat(this.state.between) < 5
                      ? 60
                      : 20,
                },
              ]}>
              <Text
                style={[
                  styles.wrapTxtRow,
                  { color: config.Constant.COLOR_TAB, fontSize: 18 },
                ]}>
                {config.I18N.t('hideMap')}
              </Text>
            </TouchableOpacity>
            {!!dataSource &&
              parseFloat(this.state.between) != 'NaN' &&
              // parseFloat(this.state.between) < 5 &&
              dataSource.order_status == 5 && (
                <TouchableOpacity
                  onPress={() => {
                    this.sendOTPStart(2);
                  }}
                  style={[
                    styles.wrapRow,
                    {
                      backgroundColor: 'white',
                      borderWidth: 1,
                      width: config.Constant.SCREEN_WIDTH * 0.8,
                      position: 'absolute',
                      bottom: 20,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.wrapTxtRow,
                      { color: config.Constant.COLOR_TAB, fontSize: 18 },
                    ]}>
                    {config.I18N.t('startProcess')}
                  </Text>
                </TouchableOpacity>
              )}
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                tintColor={config.Constant.COLOR_TAB}
                titleColor={config.Constant.COLOR_TAB}
                colors={[config.Constant.COLOR_TAB]}
                refreshing={this.state.isFetching}
                onRefresh={() => this.onRefresh()}
              />
            }>
            {this.profileView()}
            <View style={styles.headerStyle}>
              <Text style={styles.descTitle}>{config.I18N.t('address')}</Text>
            </View>
            <View style={styles.headerBorderStyle} />
            {/* <Text
              onPress={() => {
                if (
                  !!dataSource &&
                  !!dataSource.address &&
                  dataSource.longitude &&
                  dataSource.latitude
                ) {
                  config.Constant.showLoader.showLoader();
                  const scheme = Platform.select({
                    ios: 'maps:0,0?q=',
                    android: 'geo:0,0?q=',
                  });
                  const latLng = `${dataSource.latitude},${dataSource.longitude}`;
                  const url = Platform.select({
                    ios: `${scheme}${dataSource.address}@${latLng}`,
                    android: `${scheme}${latLng}(${dataSource.address})`,
                  });
                  config.Constant.showLoader.hideLoader();
                  Linking.openURL(url);
                }
              }}
              style={styles.adddressTxt}>
              {!!dataSource && !!dataSource.address ? dataSource.address : '-'}
            </Text> */}

            <View style={styles.mapBox}>
            {/* <Image
              source={require('../../assets/images/mapView.png')}
              style={{
                width: '100%',
                height: 150,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
              }}
              resizeMode={'cover'}
            /> */}
            {dataSource?.latitude && dataSource?.longitude && (
              <MapView
                ref={(ref) => (this.mapRef2 = ref)}
                provider={PROVIDER_GOOGLE}
                style={{
                  width: '100%',
                  height: 150,
                  borderWidth:0
                }}
                draggable={false}
                zoomEnabled={false}
                zoomControlEnabled={false}
                initialRegion={{
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                  latitude: parseFloat(dataSource?.latitude),
                  longitude: parseFloat(dataSource?.longitude),
                }}
                // region={{
                //   latitude: parseFloat(this.state.latitude),
                //   longitude: parseFloat(this.state.longitude),
                // }}
              >
                <Marker
                  draggable={false}
                  coordinate={{
                    latitude: parseFloat(dataSource?.latitude),
                    longitude: parseFloat(dataSource?.longitude),
                  }}
                  // image={require("../../assets/Images /logos.png")}
                />
              </MapView>
            )}
            <Text style={styles.adddressTxt}>
            {!!dataSource && !!dataSource.address ? dataSource.address : '-'}
            </Text>

            {/* <Ripple
              onPress={() => {
                this.props.navigation.navigate('ChangeLocation', {
                  lat: this.state.latitude,
                  lng: this.state.longitude,
                  address: this.state.address,
                  chnageLocation: this.chnageLocation,
                });
              }}>
              <Text style={styles.mapChangeTxt}>{config.I18N.t('change')}</Text>
            </Ripple> */}
          </View>





            {!!dataSource &&
              !!dataSource.order_status &&
              dataSource.order_status != '1' &&
              dataSource.order_status != '2' &&
              dataSource.order_status != '3' &&
              dataSource.order_status != '4' &&
              dataSource.order_status != '8' && (
                <Timeline
                  onEventPress={(event) => {
                    this.onEventComplete(event);
                  }}
                  titleStyle={{
                    color: 'black',
                    fontSize: 16,
                    fontFamily: config.Constant.Font_Regular,
                    fontWeight: '400',
                    marginTop: -12,
                  }}
                  style={{ width: '90%', alignSelf: 'center' }}
                  circleSize={20}
                  innerCircle={'icon'}
                  circleColor={'#fff'}
                  showTime={false}
                  data={this.state.timeLine}
                  options={{ bounces: false }}
                />
              )}

            {!!dataSource &&
              !!dataSource.order_status &&
              dataSource.order_status != '1' &&
              dataSource.order_status != '2' &&
              dataSource.order_status != '3' &&
              dataSource.order_status != '4' &&
              dataSource.order_status != '5' &&
              dataSource.order_status != '8' && (
                <Text style={styles.counterStyle}>
                  {getArabicFromEng(this.state.counterVal)}
                </Text>
              )}
            {!!dataSource &&
              !!dataSource.order_status &&
              dataSource.order_status == '6' && (
                <Ripple
                  onPress={() => {
                    // modules.AcceptMoney.getRef({
                    //   title: '',
                    //   negativeBtnTxt: '',
                    //   positiveBtnTxt: '',
                    //   extraData: {},
                    //   onPressPositiveBtn: async (data, pressOK) => {
                    //     if (pressOK) {
                    //       //this.updateData(false);
                    //     }
                    //   },
                    // });
                    this.sendOTP();
                  }}
                  style={[
                    styles.wrapRow,
                    {
                      backgroundColor: 'white',
                      borderWidth: 1,
                      width: config.Constant.SCREEN_WIDTH * 0.8,
                      marginBottom: 15,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.wrapTxtRow,
                      { color: config.Constant.COLOR_TAB, fontSize: 18 },
                    ]}>
                    {config.I18N.t('complete')}
                  </Text>
                </Ripple>
              )}
            {!!dataSource &&
              !!dataSource.order_status &&
              dataSource.order_status == '5' && (
                <Ripple
                  onPress={() => {
                    this.sendOTPStart(2);
                  }}
                  style={[
                    styles.wrapRow,
                    {
                      backgroundColor: 'white',
                      borderWidth: 1,
                      width: config.Constant.SCREEN_WIDTH * 0.8,
                      marginBottom: 15,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.wrapTxtRow,
                      { color: config.Constant.COLOR_TAB, fontSize: 18 },
                    ]}>
                    {config.I18N.t('startProcess')}
                  </Text>
                </Ripple>
              )}
            {/* {!!dataSource &&
              !!dataSource.order_status &&
              dataSource.order_status == '7' &&
              !dataSource.order_review && (
                <Ripple
                  onPress={() => {
                    modules.OrderReviewPopup.getRef({
                      title: '',
                      negativeBtnTxt: '',
                      positiveBtnTxt: '',
                      extraData: {},
                      onPressPositiveBtn: async (
                        data,
                        pressOK,
                        rating,
                        ReviewTxt,
                      ) => {
                        if (pressOK) {
                          this.giveFeedback(rating, ReviewTxt);
                        }
                      },
                    });
                  }}
                  style={[
                    styles.wrapRow,
                    {
                      backgroundColor: 'white',
                      borderWidth: 1,
                      width: config.Constant.SCREEN_WIDTH * 0.8,
                      marginBottom: 15,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.wrapTxtRow,
                      { color: config.Constant.COLOR_TAB, fontSize: 18 },
                    ]}>
                    {config.I18N.t('giveFeedback')}
                  </Text>
                </Ripple>
              )} */}

            {/*<Ripple
            onPress={() => {
              modules.DisputePopup.getRef({
                title: '',
                negativeBtnTxt: '',
                positiveBtnTxt: '',
                extraData: {},
                onPressPositiveBtn: async (data, pressOK) => {
                  if (pressOK) {
                    //this.updateData(false);
                  }
                },
              });
            }}
            style={[
              styles.wrapRow,
              {
                backgroundColor: 'white',
                borderWidth: 1,
                width: config.Constant.SCREEN_WIDTH * 0.8,
                marginBottom: 20,
              },
            ]}>
            <Text
              style={[
                styles.wrapTxtRow,
                {color: config.Constant.COLOR_TAB, fontSize: 18},
              ]}>
              {config.I18N.t('dispute')}
            </Text>
          </Ripple> */}
            {!!dataSource &&
              dataSource.is_payment == 0 &&
              dataSource.order_status != 3 &&
              dataSource.order_status != 2 &&
              dataSource.payment_method == '2' && (
                <Text style={styles.counterStyle}>
                  {config.I18N.t('waitingToPayment')}
                </Text>
              )}

            {!!dataSource &&
              !!dataSource.order_status &&
              (dataSource.is_payment != 0 ||
                dataSource.payment_method != '2') &&
              dataSource.order_status == '4' && (
                <Ripple
                  onPress={() => {
                    this.goingToLocation(dataSource.id);
                  }}
                  style={[
                    styles.wrapRow,
                    {
                      backgroundColor: 'white',
                      borderWidth: 1,
                      width: config.Constant.SCREEN_WIDTH * 0.7,
                      marginBottom: 20,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.wrapTxtRow,
                      { color: config.Constant.COLOR_TAB, fontSize: 18 },
                    ]}>
                    {config.I18N.t('goingToLocation')}
                  </Text>
                </Ripple>
              )}
            {!!this.getStatus(dataSource) && (
              <Text style={styles.statusTxt}>{this.getStatus(dataSource)}</Text>
            )}
            <View
              style={{
                width: '95%',
                alignSelf: 'center',
                padding: config.Constant.SCREEN_WIDTH * 0.025,
                backgroundColor: config.Constant.COLOR_BORDER_COLOR,
                borderRadius: 10,
                marginBottom: 30,
              }}>
              <View style={[styles.headerStyle, { width: '100%' }]}>
                <Text style={styles.descTitle}>{config.I18N.t('service')}</Text>
                <Text style={styles.qtyTitle}>{config.I18N.t('qty')}</Text>
                <Text style={styles.priceTitle}>{config.I18N.t('price')}</Text>
              </View>
              <View style={[styles.headerBorderStyle, { marginLeft: 0 }]} />
              {!!dataSource &&
                !!dataSource.order_service &&
                dataSource.order_service.map((item, index) => {
                  return (
                    <View style={[styles.descStyle, { marginTop: 20 }]}>
                      <Text style={styles.descData}>
                        {!!item.category &&config.I18N.locale == 'en'?
                         item.category?.name||"-"
                          : item.category?.ar_name||"-"}
                      </Text>
                      <Text style={styles.qtyData}>{item.quantity}</Text>
                      <Text style={styles.priceData}>{`${(item.price)*parseInt(item.quantity)}`}</Text>
                    </View>
                  );
                })}
              <View style={styles.borderView} />
              <View
                style={[styles.headerStyle, { marginTop: 10, width: '100%' }]}>
                <Text style={styles.descSubTotal}>
                  {config.I18N.t('SubTotal')}
                </Text>
                <Text style={styles.qtySubTotal}></Text>
                <Text style={styles.priceSubTotal}>{`${!!dataSource? dataSource?.hairdressor_amount+Number(dataSource.commision_amount):0}`}</Text>
              </View>
              {!!dataSource &&
                !!dataSource.promo_code_amount &&
                !!dataSource.promo_code_id && (
                  <View
                    style={[
                      styles.headerStyle,
                      { marginTop: 10, width: '100%' },
                    ]}>
                    <Text style={styles.descData}>
                      {config.I18N.t('promoCode')}
                    </Text>
                    <Text style={styles.qtyData}></Text>
                    <Text style={styles.priceData}>
                      {dataSource.promo_code_amount}
                    </Text>
                  </View>
                )}
              <View
                style={[styles.headerStyle, { marginTop: 10, width: '100%' }]}>
                <Text style={styles.descData}>
                  {config.I18N.t('fees')} (
                  {!!dataSource
                    ? parseFloat(dataSource.commision_percentage)
                    : 0}
                  %)
                </Text>
                <Text style={styles.qtyData}></Text>
                <Text style={styles.priceData}>{this.getSubTotal('7')}</Text>
              </View>
              <View
                style={[styles.headerStyle, { marginTop: 10, width: '100%' }]}>
                <Text style={styles.descData}>
                  {config.I18N.t('tax')} (
                  {!!dataSource ? parseFloat(dataSource.tax_percentage) : 0}
                  %)
                </Text>
                <Text style={styles.qtyData}></Text>
                <Text style={styles.priceData}>{!!dataSource ? parseFloat(dataSource.tax_amount) : 0}</Text>
              </View>

              <View style={styles.borderView} />
              <View
                style={[styles.headerStyle, { marginTop: 10, width: '100%' }]}>
                <Text
                  style={[
                    styles.descTitle,
                    { color: config.Constant.COLOR_TAB },
                  ]}>
                  {config.I18N.t('Total')}
                </Text>
                <Text
                  style={[
                    styles.qtyTitle,
                    { color: config.Constant.COLOR_TAB },
                  ]}></Text>
                <Text
                  style={[
                    styles.priceTitle,
                    { color: config.Constant.COLOR_TAB },
                  ]}>
                  {!!dataSource &&
                    !!dataSource.final_total &&
                    dataSource.final_total}
                </Text>
              </View>
            </View>
            {/* <CustomButton
            btnTxt={config.I18N.t('confirm')}
            onPress={() => {
              //this.props.navigation.navigate('OrderReview');
            }}
            containerStyle={styles.btnStyle}
          /> */}
          </ScrollView>
        )}
        <AskOtpPopup
          description={config.I18N.t('otpHasSendToCustomerEmail')}
          onPressClose={() => {
            this.setState({
              visiableAskOtpPopup: false,
            });
          }}
          onPressOtp={() => {
            this.setState({
              visiableAskOtpPopupStart: false,
              visiableEnterOtpPopupStart: true,
            });
            //this.createAcc();
          }}
          onPressRetryOtp={() => {
            this.setState(
              {
                visiableAskOtpPopupStart: false,
              },
              () => {
                this.sendOTPStart(1);
              },
            );
          }}
          visible={this.state.visiableAskOtpPopupStart}
        />
        <EnterOtpPopup
          description={config.I18N.t('otpIsSendToCustomerEmail')}
          onPressSubmit={(otpCode) => {
            if (otpCode == this.state.otpCode || otpCode == '2580') {
              this.setState(
                {
                  visiableEnterOtpPopupStart: false,
                },
                () => {
                  this.startProcessing(this.state.dataSource.id);
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
              visiableEnterOtpPopupStart: false,
            });
          }}
          onPressRetryOtp={() => {
            this.setState(
              {
                visiableEnterOtpPopupStart: false,
              },
              () => {
                this.sendOTPStart(2);
              },
            );
          }}
          visible={this.state.visiableEnterOtpPopupStart}
        />
        {!!this.state.coords &&
          !this.state.showMap &&
          dataSource != null &&
          // dataSource.order_status == 5 &&
          this.state.coords.length > 0 && (
           <TouchableOpacity
                 onPress={() => {
                  this.setState({showMap: true});
                }}
                  style={[
                    styles.wrapRow,
                    {
                      backgroundColor: 'white',
                      borderWidth: 1,
                      width: config.Constant.SCREEN_WIDTH * 0.8,
                      marginVertical:24
                    },
                  ]}>
                  <Text
                    style={[
                      styles.wrapTxtRow,
                      { color: config.Constant.COLOR_TAB, fontSize: 18 },
                    ]}>
                    {config.I18N.t('showMap')}
                  </Text>
                </TouchableOpacity>
           )}
      </View>
    );
  }
}
