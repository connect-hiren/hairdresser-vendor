import { Dimensions, Platform, StatusBar, Linking, Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import config from '../config';
import modules from '../modules';
import AsyncStorage from '@react-native-async-storage/async-storage';
var PushNotification = require('react-native-push-notification');

const isIphoneX = () => {
  const dimen = Dimensions.get('window');

  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 896 ||
      dimen.width === 896)
  );
};
const sendNotification = (title, message,remoteMessage) => {
  let sound = "default"
    if(Platform.OS=="ios"){
      if(remoteMessage?.notification?.sound){
      sound = remoteMessage?.notification?.sound
      }
    }else{
      if(remoteMessage?.notification?.android?.sound){
      sound = remoteMessage.notification.android.sound
      }
    }

  PushNotification.localNotification({
    /* Android Only Properties */
    channelId: 'sound_channel',
    autoCancel: true, // (optional) default: true
    smallIcon: 'notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
    largeIcon: '',
    vibrate: true, // (optional) default: true
    vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
    tag: 'some_tag', // (optional) add tag to message
    group: 'group', // (optional) add group to message
    ongoing: false, // (optional) set whether this is an "ongoing" notification
    priority: 'high', // (optional) set notification priority, default: high
    visibility: 'private', // (optional) set notification visibility, default: private
    importance: 'high', // (optional) set notification importance, default: high
    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
    ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)
    /* iOS and Android properties */
    title: title, // (optional)
    message: message, // (required)
    playSound: true, // (optional) default: true
    soundName: sound,
    // (Platform.OS=="ios")?"notif_sound.mp3":"notif_sound", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
    //number: 0, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
    //repeatType: 'day', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
  });
};
const checkInternetConnection = () => {
  return new Promise(async (resolve, reject) => {
    const connectionInfo = await NetInfo.fetch();
    resolve(
      !(connectionInfo.type === 'none' || connectionInfo.type === 'unknown'),
    );
  });
};
const ifIphoneX = (iphoneXStyle, regularStyle) => {
  if (isIphoneX()) {
    return iphoneXStyle;
  }
  return regularStyle;
};
const getStatusBarHeight = (safe) => {
  return Platform.select({
    ios: ifIphoneX(safe ? 53 : 40, 30),
    android: StatusBar.currentHeight + 5,
  });
};
const emailValidation = (email) => {
  var emailString = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,5})+$/;
  return email.trim().match(emailString);
};
const manageApiResponseCode = (data) => {
  console.log("manageApiResponseCode - ", data);
  config.Constant.showLoader.hideLoader();
  modules.DropDownAlert.showAlert('error', '', data.message);
  if (data.status_code === 402 || data.status_code === 403 || data.status_code === 401) {
    try {
      config.Constant.socket.emit('user_id', config.Constant.USER_DATA.id, 2);
    } catch (error) { }
    config.Constant.USER_DATA = {
      token: '',
    };

    AsyncStorage.getAllKeys().then((keys) => AsyncStorage.multiRemove(keys));
    config.Constant.RootNavigation.reset({
      index: 1,
      routes: [{ name: 'Login' }],
    });
  }
};

const countDistance = (lat1, lon1, lat2, lon2, unit) => {
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == 'K') {
      dist = dist * 1.609344;
    }
    if (unit == 'N') {
      dist = dist * 0.8684;
    }
    return dist;
  }
};

const getArabicFromEng = (num) => {
  //if (config.I18N.locale == 'en') {
  return num;
  //}
  // var newStr = '';
  // var arr = ['۰', '۱', '۲', '۳', '٤', '۵', '٦', '۷', '۸', '۹'];
  // if (num.length > 0) {
  //   for (var i = 0; i < num.length; i++) {
  //     var charConvert = num.charAt(i);
  //     if (parseInt(charConvert) == 'NaN' || ":" == charConvert) {
  //       newStr = `${newStr}` + `${charConvert}`;
  //     } else {
  //       newStr = `${newStr}` + arr[charConvert];
  //     }
  //   }
  // }
  // return newStr.split("").reverse().join("")
};

const Utilities = {
  isIphoneX,
  getStatusBarHeight,
  emailValidation,
  checkInternetConnection,
  manageApiResponseCode,
  sendNotification,
  countDistance,
  getArabicFromEng,
};

module.exports = Utilities;
