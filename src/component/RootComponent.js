import React,{useRef} from 'react';
import { StyleSheet, View, AppState, StatusBar } from 'react-native';
import config from '../config';
import DropdownAlert from 'react-native-dropdownalert';
import modules from '../modules';
import RequestPopup from '../modules/RequestPopup/RequestPopup';
import RequestRejectedPopup from '../modules/RequestRejectedPopup/RequestRejectedPopup';
import RequestTimeoutPopup from '../modules/RequestTimeoutPopup/RequestTimeoutPopup';
import IncomingOrder from '../modules/IncomingOrder/IncomingOrder';
import AcceptMoney from '../modules/AcceptMoney/AcceptMoney';
import AddMoney from '../modules/AddMoney/AddMoney';
import DisputePopup from '../modules/DisputePopup/DisputePopup';
import CustomLoader from './CustomLoader';
import ErrorAlert from '../modules/ErrorAlert/ErrorAlert';
import SocketIOClient from 'socket.io-client';

// import SocketIOClient from 'socket.io-client/dist/socket.io';
import NetInfo from '@react-native-community/netinfo';
import OrderReviewPopup from '../modules/OrderReviewPopup/OrderReviewPopup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundTimer from 'react-native-background-timer';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
var PushNotification = require('react-native-push-notification');

// import Sound from 'react-native-sound';
// var customSound


import { connect } from 'react-redux';
  var interval
class RootComponent extends React.Component {
  
  constructor(props) {
    console.log(props, "RootComponent-props", AppState.currentState)
    
    super(props);

    this.state = {
      showLoader: false,
      appState: AppState.currentState,
    };
  }



  componentDidMount = () => {
    config.Constant.showLoader = this.showLoader;
    
    this.socketConnect();
    AppState.addEventListener('change', this._handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
    try{
      PushNotification.configure({
        onNotification: (notification) => {
          console.log("NOTIFICATION -- ",notification)
          // this.manageStateChange({result: notification.data})
          if (!!notification.data && notification.data.order_id && notification.data.type == 1) {
            // this.props.navigation.navigate('OrderDetails', {
            //   order_id: notification.data.order_id,
            // });
            this.getOrderDetails(notification.data.order_id)
          } else {
            // this.props.navigation.navigate('Notification');
          }
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        },
        onAction: function (notification) {
          console.log("ACTION:", notification);
        }
      });
      PushNotification.createChannel(
        {
          channelId: 'channel-id', // (required)
          channelName: 'My channel', // (required)
          channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
          playSound: false, // (optional) default: true
          soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
          importance: 4, // (optional) default: 4. Int value of the Android notification importance
          vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        },
        (created) => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
      );
    }catch(Err){
      console.log("ROOT_COMPONENT_ERR- ", Err)
    }
    // if (!!data.result.type && data.result.type == 1) {
    //   this.getOrderDetails(data.result.order_id);
    // }
  };
  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.getCheckOnGoingOrder();
      config.Constant.socket.connect();
    } else {
      //Keyboard.dismiss();
      console.log('app goes to background')
        //tell the server that your app is still online when your app detect that it goes to background
        interval = BackgroundTimer.setInterval(()=>{
          // console.log('connection status ', config.Constant.socket.connected)
          config.Constant.socket.emit('online')
        },5000)
      this.setState({appState: nextAppState})
      console.log("AppState", this.state.appState);
    }
    //PushNotification.removeAllDeliveredNotifications();
    this.setState({ appState: nextAppState });
  };
  componentWillUnmount = () => {
    AppState.addEventListener('change', this._handleAppStateChange);
  };

  manageStateChange=(data)=>{
    console.log("MANAGE_STATE_CHAGE- ",data);
          
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
  }

  socketConnect = () => {
    config.Constant.socket = SocketIOClient(config.Constant.API_SOCKET_URL,{
      // jsonp: false,
      // reconnection: true,
      // reconnectionDelay: 50,
      // reconnectionAttempts: 1000,
      transports: ['websocket']
    });
    // config.Constant.socket.connect();
    this.getCheckOnGoingOrder();
    // console.log('SOCKET DATA', config.Constant.socket);
    NetInfo.addEventListener("change",async (state) => {
      if (state.isConnected) {
        try {
          config.Constant.socket.connect();
          if (!!config.Constant.USER_DATA.id) {
            config.Constant.socket.emit('room', config.Constant.USER_DATA.id);
            try {
              var onLineData = await AsyncStorage.getItem('is_online');
              if (!!onLineData) {
                config.Constant.socket.emit(
                  'user_id',
                  config.Constant.USER_DATA.id,
                  onLineData == '1' ? 1 : 2,
                );
              }
            } catch (error) { }
          }
        } catch (error) { }
      }
    });
    config.Constant.socket.on('connect', async () => {
      console.log('SOCKET DATA Connect');
      if (!!config.Constant.USER_DATA.id) {
        config.Constant.socket.emit('room', config.Constant.USER_DATA.id);

        try {
          var onLineData = await AsyncStorage.getItem('is_online');
          if (!!onLineData) {
            config.Constant.socket.emit(
              'user_id',
              config.Constant.USER_DATA.id,
              onLineData == '1' ? 1 : 2,
            );
          }
        } catch (error) { }
      }
    });
    config.Constant.socket.on('disconnect', () => {
      console.log('SOCKET DATA Disconnect');
      config.Constant.socket.connect();
    });

    config.Constant.socket.on('send_notification', (data) => {
      console.log("send_notificationsend_notificationsend_notification");
      this.manageStateChange(data)
    });




    config.Constant.socket.on('error', (err) => {
      console.log('error Error', err);
      // try {
      //   config.Constant.socket.connect();
      //   if (!!config.Constant.USER_DATA.id) {
      //     config.Constant.socket.emit('room', config.Constant.USER_DATA.id);
      //   }
      // } catch (error) { }
    });

    config.Constant.socket.on('reconnect_failed', () => {
      console.log('Reconnect failed');
      // try {
      //   config.Constant.socket.connect();
      //   if (!!config.Constant.USER_DATA.id) {
      //     config.Constant.socket.emit('room', config.Constant.USER_DATA.id);
      //   }
      // } catch (error) { }
    });

    config.Constant.socket.on('connect_error', () => {
      console.log('connect_error');
      // try {
      //   config.Constant.socket.connect();
      //   if (!!config.Constant.USER_DATA.id) {
      //     config.Constant.socket.emit('room', config.Constant.USER_DATA.id);
      //   }
      // } catch (error) { }
    });
  };
 
  rejectOrder = async (order_id, rejectionReason) => {
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
        config.Constant.RootNavigation.navigate('OrderDetails', {
          order_id: order_id,
        });
        modules.IncomingOrder.isVisible() && modules.IncomingOrder.hideRef();
      }
    }
  };
  onTimeOutPopup = async (order_id) => {
    modules.IncomingOrder.isVisible() && modules.IncomingOrder.hideRef();
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
        modules.IncomingOrder.isVisible() && modules.IncomingOrder.hideRef();
      }
    }
  };
  acceptOrder = async (order_id) => {
    // console.log(config.Constant.RootNavigation, order_id, "RootNavigation")
    // console.log("acceptOrder 1- ")
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
        // console.log("rejectOrder 2- ", data)
        if (data.status_code == 200) {
          modules.IncomingOrder.isVisible() && modules.IncomingOrder.hideRef();
          config.Constant.RootNavigation.navigate('OrderDetails', {
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
  getCheckOnGoingOrder = async () => {
    try {
      // console.log('getCheckOnGoingOrder');
      if (!!config.Constant.USER_DATA.id) {
        //config.Constant.showLoader.showLoader();
        const formData = new FormData();
        formData.append('order_id', '1');

        var data = await modules.APIServices.PostApiCall(
          config.ApiEndpoint.REQUEST_ORDER_LIST,
          formData,
        );
        //config.Constant.showLoader.hideLoader();
        // console.log('order_id connect= ' + JSON.stringify(data));
        if (data.status_code == 200) {
          if (data.data.length == 0) {
            modules.IncomingOrder.isVisible() && modules.IncomingOrder.hideRef();
          }
          data.data.map((itm, ind) => {
            if (ind == 0) {
              //modules.IncomingOrder.hideRef();
              this.getOrderDetails(itm.id);
            }
          });
        }
      }
    } catch (error) { }
  };
  getOrderDetails = async (order_id) => {
    // console.log('order_id = ' + order_id);
    if (!!order_id) {
      config.Constant.showLoader.showLoader();
      const formData = new FormData();
      formData.append('order_id', order_id);

      var data = await modules.APIServices.PostApiCall(
        config.ApiEndpoint.ORDER_DETAILS,
        formData,
      );
      config.Constant.showLoader.hideLoader();
      console.log('ROOT_COMPONENT getOrderDetails= ' + JSON.stringify(data));
      if (data.status_code == 200) {
        
        !modules.IncomingOrder.isVisible() && modules.IncomingOrder.getRef({
          title: '',
          negativeBtnTxt: '',
          positiveBtnTxt: '',
          extraData: data.data,
          onPressPositiveBtn: async (data, pressOK) => {
            if (pressOK) {
              //this.updateData(false);
            }
          },
          onTimeOutPopup: () => {
            try{
              config.MSound.stop()
            } catch(e){
              console.log("ERROR- ", e)
            }
            modules.IncomingOrder.isVisible() && modules.IncomingOrder.hideRef();
            this.onTimeOutPopup(data.data.id);
          },
        });
        // customSound.start()
        try{
           config.MSound.play()
        } catch(e){
          console.log("ERROR- ", e)
        }
      }
    }
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
        {this.props.children}
        <CustomLoader ref={(showLoader) => (this.showLoader = showLoader)} />

        <RequestRejectedPopup
          ref={(RequestRejectedPopupRef) =>
            modules.RequestRejectedPopup.setRef(RequestRejectedPopupRef)
          }
        />
        <RequestTimeoutPopup
          ref={(RequestTimeoutPopupRef) =>
            modules.RequestTimeoutPopup.setRef(RequestTimeoutPopupRef)
          }
        />
        <IncomingOrder
          ref={(IncomingOrderRef) =>
            modules.IncomingOrder.setRef(IncomingOrderRef)
          }
          onAccept={()=>{
            // console.log("CUSTOM_SOUND -- 6 stop ")
            // customSound.stop()
            try{
               config.MSound.stop()
            } catch(e){
              console.log("ERROR- ", e)
            }
          }}
          onReject={()=>{
            // console.log("CUSTOM_SOUND -- 7 stop")
            //  customSound.stop()
            try{
              config.MSound.stop()
            } catch(e){
              console.log("ERROR- ", e)
            }
            const {userData } = this.props
            userData.userData.is_online = 2
            config.Constant.USER_DATA.is_online = 2
          }}
        />
        <AcceptMoney
          ref={(AcceptMoneyRef) => modules.AcceptMoney.setRef(AcceptMoneyRef)}
        />

        <AddMoney 
          ref={(AddMoneyRef) => modules.AddMoney.setRef(AddMoneyRef)}
        />
        <DisputePopup
          ref={(DisputePopupRef) =>
            modules.DisputePopup.setRef(DisputePopupRef)
          }
        />
        <RequestPopup
          ref={(RequestPopupRef) =>
            modules.RequestPopup.setRef(RequestPopupRef)
          }
        />
        <ErrorAlert
          ref={(ErrorAlertRef) => modules.ErrorAlert.setRef(ErrorAlertRef)}
        />
        <OrderReviewPopup
          ref={(OrderReviewPopupRef) =>
            modules.OrderReviewPopup.setRef(OrderReviewPopupRef)
          }
        />
        <DropdownAlert
          ref={(dropDownRef) =>
            modules.DropDownAlert.setDropDownRef(dropDownRef)
          }
          translucent={true}
          closeInterval={2000}
          updateStatusBar={false}
          onTap={(data) => { }}
          messageNumOfLines={5}
          containerStyle={{
            backgroundColor: config.Constant.COLOR_PRIMARY,
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
const mapStateToProps = (state) => ({
  userData: state.userData,
});

export default connect(mapStateToProps)(RootComponent);