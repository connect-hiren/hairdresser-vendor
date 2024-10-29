import React from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  ScrollView,
  I18nManager,
  ImageBackground,
  ToastAndroid,
  Platform,
  Alert,
  Linking,
  PermissionsAndroid,
  BackHandler,
} from 'react-native';
import config from '../../config';
import * as Animatable from 'react-native-animatable';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import Ripple from 'react-native-material-ripple';
import styles from './styles';
import Dialog, { SlideAnimation, DialogContent } from 'react-native-popup-dialog';
// import ToggleSwitch from 'toggle-switch-react-native';
import SwitchToggle from 'react-native-rtl-toggle';

//Chnage line number 107   margin: Platform.OS === "web" ? 0 : I18nManager.isRTL ? 36 : 4,
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import StarRating from 'react-native-star-rating';
import modules from '../../modules';
import { connect } from 'react-redux';
import * as UserDataActions from '../../Redux/actions/userData';
import Geolocation from 'react-native-geolocation-service';
import moment from 'moment';
import { getRoundOf, sendNotification } from '../../Util/Utilities';
import messaging from '@react-native-firebase/messaging';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageUdate: true,
      isRTL: config.Constant.isRTL,
      isMenuOpen: false,
      ViewHeight: 0,
      is_arabic: 'english',
      reviewData: [1, 2, 3],
      is_online: true,
      total_earning: '0',
      tax_amount: '0',
    };
    // I18nManager.forceRTL(false);
    // config.I18N.locale = 'ar';
    // I18nManager.forceRTL(true);
    // this.setState({
    //   languageUdate: true,
    // });
  }
  getSettings = async () => {
    config.Constant.showLoader.showLoader();
    const formData = new FormData();
    formData.append('role_id', 2);
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.SETTING,
      formData,
    );
    config.Constant.showLoader.hideLoader();
    if (data.status_code == 200) {
      config.Constant.settingData = data.data;
    } else {
    }
  };
  getNotificationClass = () => {
    this.unsubscribe = messaging().onMessage(async (remoteMessage) => {
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      sendNotification(
        remoteMessage.notification.title,
        remoteMessage.notification.body,
        remoteMessage
      );
    });
    // messaging().onNotificationOpenedApp((remoteMessage) => {
    //   console.log(
    //     'Notification caused app to open from background state:',
    //     remoteMessage,
    //   );
    //   //this.props.navigation.navigate('Notification');
    //   if (!!remoteMessage.data && remoteMessage.data.order_id) {
    //     // this.props.navigation.navigate('OrderDetails', {
    //     //   order_id: remoteMessage.data.order_id,
    //     // });
    //   } else {
    //     // this.props.navigation.navigate('Notification');
    //   }
    //   //navigation.navigate(remoteMessage.data.type);
    // });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          // console.log(
          //   'Notification caused app to open from quit state:',
          //   remoteMessage,
          // );
          this.props.navigation.navigate('Notification');
          if (!!remoteMessage.data && remoteMessage.data.order_id) {
            // this.props.navigation.navigate('OrderDetails', {
            //   order_id: remoteMessage.data.order_id,
            // });
          } else {
            // this.props.navigation.navigate('Notification');
          }
          //setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
      });
  };
  componentWillUnmount = () => {
    try {
      this.unsubscribe();
    } catch (error) { }
  };
  componentDidMount = async () => {
    // PushNotification.configure({
    //   onNotification: (notification) => {
    //     if (!!notification.data && notification.data.order_id) {
    //       // this.props.navigation.navigate('OrderDetails', {
    //       //   order_id: notification.data.order_id,
    //       // });
    //     } else {
    //       // this.props.navigation.navigate('Notification');
    //     }
    //     notification.finish(PushNotificationIOS.FetchResult.NoData);
    //   },
    // });
    // setTimeout(() => {
    //   sendNotification('title', 'body');
    // }, 5000);
    this.getNotificationClass();
    try {
      this.getSettings();
      config.Constant.RootNavigation = this.props.navigation;
      config.Constant.socket.connect();

      if (!!config.Constant.USER_DATA.id) {
        config.Constant.socket.emit('room', config.Constant.USER_DATA.id);
      }
    } catch (error) { }
    var is_arabic = await AsyncStorage.getItem('is_arabic');
    if (!!is_arabic) {
      this.setState({
        is_arabic: is_arabic,
      });
    }
    this.GetUserData();
    this.props.navigation.addListener('focus', async () => {
      BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
      try {
        this.GetUserData();
        var onLineData = await AsyncStorage.getItem('is_online');
        if (!!onLineData) {
          this.setState({
            is_online: onLineData == '1' ? true : false,
          });
          config.Constant.socket.emit(
            'user_id',
            config.Constant.USER_DATA.id,
            onLineData == '1' ? 1 : 2,
          );
        } else {
          this.setState({
            is_online: true,
          });
          await AsyncStorage.setItem('is_online', '1');
          config.Constant.socket.emit(
            'user_id',
            config.Constant.USER_DATA.id,
            1,
          );
        }
      } catch (error) { }
    });
    this.props.navigation.addListener('blur', () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.hardwareBackPress,
      );
    });
    this.getLiveLatLng();
    this.getPendingOrders();
  };
  hardwareBackPress = () => {
    BackHandler.exitApp();
  };
  getPendingOrders = async () => {
    const formData = new FormData();
    formData.append('id', '1');
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.CHECK_ONGOING_ORDER,
      formData,
    );
    config.Constant.showLoader.hideLoader();
    if (data.status_code == 200 && !!data.data) {
      // this.props.navigation.navigate('OrderDetails', {
      //   order_id: data.data.id,
      // });
      this.props.navigation.reset({
        index: 1,
        routes: [{ name: 'OrderDetails', params: { order_id: data.data.id } }],
      });
    } else {
    }
  };
  logout = () => {
    try {
      config.Constant.socket.emit('user_id', config.Constant.USER_DATA.id, 2);
    } catch (error) { }
    config.Constant.USER_DATA = {
      token: '',
    };

    AsyncStorage.getAllKeys().then((keys) => AsyncStorage.multiRemove(keys));

    config.Constant.USER_DATA = {
      token: '',
    };
    this.props.dispatch(UserDataActions.setUserData(null));
    this.props.navigation.reset({
      index: 1,
      routes: [{ name: 'Login' }],
    });
  };
  hasLocationPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('error'),
        config.I18N.t('locationError'),
        null,
        null,
        () => {
          if (Platform.OS == 'ios') {
            RNExitApp.exitApp();
          } else {
            BackHandler.exitApp();
          }
        },
      );
    }

    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
        '',
        [
          { text: 'Go to Settings', onPress: openSetting },
          { text: "Don't Use Location", onPress: () => { } },
        ],
      );
    }

    return false;
  };
  hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await this.hasLocationPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };
  getLiveLatLng = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) {
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('error'),
        config.I18N.t('locationError'),
        null,
        null,
        () => {
          if (Platform.OS == 'ios') {
            RNExitApp.exitApp();
          } else {
            BackHandler.exitApp();
          }
        },
      );
      return;
    }
    Geolocation.getCurrentPosition(
      async (position) => {
        config.Constant.showLoader.hideLoader();
        try {
          this.onMaLocationUpdate(
            position.coords.latitude,
            position.coords.longitude,
          );
        } catch (e) {
          //alert(e);
          config.Constant.showLoader.hideLoader();
        }
      },
      (error) => {
        //alert(error);
        config.Constant.showLoader.hideLoader();
      },
      { enableHighAccuracy: false, maximumAge: 1000, timeout: 50000 },
    );
  };
  onMaLocationUpdate = (lat, lng) => {
    var apiLink =
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
      lat +
      ',' +
      lng +
      '&key=' +
      config.Constant.MAP_KEY;
    fetch(apiLink)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.results.length > 0) {
          this.setState(
            {
              address: responseJson.results[0].formatted_address,
              latitude: lat,
              longitude: lng,
            },
            () => {
              this.updateProfile(
                lat,
                lng,
                responseJson.results[0].formatted_address,
              );
            },
          );
        }
      });
  };
  updateUserStatus = async (is_online) => {
    // console.log(is_online);
    config.Constant.USER_DATA.is_online = is_online ? '1' : '2';
    this.setState({
      is_online: is_online,
    });
    if (is_online) {
      await AsyncStorage.setItem('is_online', '1');
      config.Constant.socket.emit('user_id', config.Constant.USER_DATA.id, 1);
      //console.log(config.Constant.USER_DATA.id + ' === 1' + is_online);
    } else {
      await AsyncStorage.setItem('is_online', '2');
      config.Constant.socket.emit('user_id', config.Constant.USER_DATA.id, 2);
      //console.log(config.Constant.USER_DATA.id + ' === 2' + is_online);
    }
  };
  GetUserData = async () => {
    const formData = new FormData();
    formData.append('id', this.props.userData.id);
    //config.Constant.showLoader.showLoader();
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.GET_PROFILE,
      formData,
    );
    // console.log(data, "profile data")
    // config.Constant.showLoader.hideLoader();
    if (data.status_code == 200) {
      try {
        data.data.total_earning.map((itm, ind) => {
          if (!!itm.total_earning) {
            this.setState({
              total_earning: itm.total_earning,
            });
          } else {
            this.setState({
              total_earning: '0',
            });
          }
        });
        this.setState({
          tax_amount: !!data.data.tax_amount ? data.data.tax_amount : '0',
        });
        var token = config.Constant.USER_DATA.token;
        config.Constant.USER_DATA = data.data;
        config.Constant.USER_DATA.token = token;
        var userData = this.props.userData;
        if (userData?.userData?.id) {
          userData.userData = data.data;
          this.setState({
            is_online: data.data.is_online == '1' ? true : false,
          });
          this.props.dispatch(UserDataActions.setUserData(userData.userData));
        }
        config.Constant.showLoader.hideLoader();

        // try {
        //   var onLineData = await AsyncStorage.getItem('is_online');
        //   if (!!onLineData) {
        //     this.setState({
        //       is_online: onLineData == '1' ? true : false,
        //     });
        //     config.Constant.socket.emit(
        //       'user_id',
        //       config.Constant.USER_DATA.id,
        //       onLineData == '1' ? 1 : 2,
        //     );
        //   } else {
        //     this.setState({
        //       is_online: true,
        //     });
        //     await AsyncStorage.setItem('is_online', '1');
        //     config.Constant.socket.emit(
        //       'user_id',
        //       config.Constant.USER_DATA.id,
        //       1,
        //     );
        //   }
        // } catch (error) {}
      } catch (error) { 
         config.Constant.showLoader.hideLoader();
      }
    }
  };
  updateProfile = async (latitude, longitude, address) => {
    const formData = new FormData();
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('address', address);
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.UPDATE_PROFILE,
      formData,
    );
    if (data.status_code == 200) {
      try {
        config.Constant.USER_DATA.latitude = data.data.latitude;
        config.Constant.USER_DATA.longitude = data.data.longitude;
        config.Constant.USER_DATA.address = data.data.address;

        var userData = this.props.userData;
        if (!!userData && !!userData.userData && !!userData.userData.id) {
          userData.userData.latitude = data.data.latitude;
          userData.userData.longitude = data.data.longitude;
          userData.userData.address = data.data.address;

          this.props.dispatch(UserDataActions.setUserData(userData.userData));
        }
      } catch (error) { }
    }
  };
  updateProfileStatus = async (is_online) => {
    const formData = new FormData();
    config.Constant.showLoader.showLoader();
    formData.append('is_online', is_online ? '1' : '2');
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.UPDATE_PROFILE,
      formData,
    );
    config.Constant.showLoader.hideLoader();
    if (data.status_code == 200) {
      try {
        config.Constant.USER_DATA.is_online = data.data.is_online;
        var userData = this.props.userData;
        if (userData?.userData?.id) {
          userData.userData.is_online = data.data.is_online;
          await AsyncStorage.setItem('is_online', data?.data?.is_online == '1' ? '1':'2');
          this.setState({
            is_online: data.data.is_online == '1' ? true : false,
          });
          this.props.dispatch(UserDataActions.setUserData(userData.userData));
        }
      } catch (error) { }
    } else {
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('error'),
        data.message,
      );
    }
  };
  menuView = () => {
    return (
      <ImageBackground
        resizeMode={'cover'}
        source={require('../../assets/images/sidecircle.png')}
        // useNativeDriver
        // animation={!this.state.isMenuOpen ? 'fadeOutUp' : 'fadeInDownBig'}
        style={styles.menuView}>
        <View
          onLayout={(event) => {
            var { x, y, width, height } = event.nativeEvent.layout;
            this.setState({
              ViewHeight: height,
            });
          }}
          style={{ backgroundColor: 'transparent', borderRadius: 50 }}>
          <Image
            resizeMode={'contain'}
            style={styles.menuIconImg}
            source={require('../../assets/images/logo.png')}
          />
          <View
            onTouchStart={() => {
              this.setState({
                isMenuOpen: false,
              });
              this.props.navigation.navigate('homeOrders');
            }}
            style={[styles.menuOptionView, { marginTop: 30 }]}>
            <Text style={styles.menuTitleTxt}>{config.I18N.t('myorders')}</Text>
          </View>
          <View
            onTouchStart={() => {
              this.setState({
                isMenuOpen: false,
              });
              this.props.navigation.navigate('Wallet');
            }}
            style={styles.menuOptionView}>
            <Text style={styles.menuTitleTxt}>{config.I18N.t('wallet')}</Text>
          </View>
          <View
            onTouchStart={() => {
              this.setState({
                isMenuOpen: false,
              });
              this.props.navigation.navigate('VendorView');
            }}
            style={styles.menuOptionView}>
            <Text style={styles.menuTitleTxt}>
              {config.I18N.t('viewProfile')}
            </Text>
          </View>
          <View
            onTouchStart={() => {
              this.setState({
                isMenuOpen: false,
              });
              this.props.navigation.navigate('ContactUs');
            }}
            style={styles.menuOptionView}>
            <Text style={styles.menuTitleTxt}>{config.I18N.t('support')}</Text>
          </View>
          <View
            onTouchStart={async () => {
              this.setState({
                isMenuOpen: false,
              });
              if (this.state.is_arabic == 'english') {
                await AsyncStorage.setItem('is_arabic', 'arabic');
                config.I18N.locale = 'ar';
                I18nManager.forceRTL(true);
                RNRestart.Restart();
              } else {
                await AsyncStorage.setItem('is_arabic', 'english');
                config.I18N.locale = 'en';
                I18nManager.forceRTL(false);
                RNRestart.Restart();
              }
            }}
            style={styles.menuOptionView}>
            <Text style={styles.menuTitleTxt}>
              {config.Constant.isRTL
                ? config.I18N.t('SwitchToEnglish')
                : config.I18N.t('SwitchToArabic')}
            </Text>
          </View>
          <View
            onTouchStart={() => {
              this.setState({
                isMenuOpen: false,
              });
              this.logout();
            }}
            style={[styles.menuOptionView, { marginTop: 20 }]}>
            <Image
              resizeMode={'contain'}
              style={styles.logoutIconImg}
              source={require('../../assets/images/logout.png')}
            />
            <Text style={styles.menuTitleTxt}>{config.I18N.t('logout')}</Text>
          </View>
        </View>
      </ImageBackground>
    );
  };
  reviewScreen = () => {
    return (
      <View style={styles.tabView}>
        {(!config.Constant.USER_DATA ||
          !config.Constant.USER_DATA.review_list ||
          config.Constant.USER_DATA.review_list.length < 1) && (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                marginTop: config.Constant.SCREEN_HEIGHT * 0.15,
              }}>
              <Text style={styles.emptyString}>{config.I18N.t('noReviews')}</Text>
            </View>
          )}
        {!!config.Constant.USER_DATA &&
          !!config.Constant.USER_DATA.review_list &&
          config.Constant.USER_DATA.review_list.map((item, index) => {
            return (
              <View style={styles.reviewBox}>
                <View style={styles.serviceRowView}>
                  <FastImage
                    resizeMode={'cover'}
                    style={{ width: 70, height: 70, borderRadius: 100 }}
                    source={
                      !!item.sender && !!item.sender.image
                        ? {
                          uri:
                            config.Constant.UsersProfile_Url +
                            '' +
                            item.sender.image,
                        }
                        : require('../../assets/images/male.png')
                    }
                  />
                  <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <View style={[styles.serviceRowView, { marginVertical: 0 }]}>
                      <Text numberOfLines={2} style={styles.reviewName}>
                        {!!item.sender && !!item.sender.name
                          ? item.sender.name
                          : ''}
                      </Text>
                      <Text numberOfLines={2} style={styles.timeTxt}>
                        {moment.utc(item.created_at).local().format('hh:mm a')}
                        {'\n'}
                        {moment
                          .utc(item.created_at)
                          .local()
                          .format('DD MMM, YY')}
                      </Text>
                    </View>
                    <StarRating
                      disabled={true}
                      halfStar={require('../../assets/images/icon_halfstar.png')}
                      fullStar={require('../../assets/images/filledStar.png')}
                      emptyStar={require('../../assets/images/startInactive.png')}
                      maxStars={5}
                      rating={item.rating}
                      containerStyle={{ height: 25, width: 70, marginTop: -10 }}
                      starStyle={{ marginRight: 5 }}
                      starSize={18}
                      selectedStar={(rating) => { }}
                    />
                  </View>
                </View>
                {/* <Text numberOfLines={2} style={styles.reviewTxt}>
                  {item.comment}
                </Text> */}
              </View>
            );
          })}
      </View>
    );
  };
  render() {
    // console.log("HOME render - ", this.state.is_online, this.props.userData?.userData?.is_online)
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={false}
          translucent={true}
          backgroundColor="transparent"
          barStyle={'dark-content'}
        />
        {this.state.isRTL ? (
          <View
            style={styles.menuIconContainer}
            onTouchStart={() => {
              this.setState({
                isMenuOpen: true,
              });
            }}>
            <ImageBackground
              resizeMode={'contain'}
              source={require('../../assets/images/sidebartopleftcircle.png')}
              style={[styles.menuIcon, { transform: [{ rotate: '90deg' }] }]}>
              <Image
                resizeMode={'contain'}
                style={[styles.iconImg, { transform: [{ rotate: '-90deg' }] }]}
                source={require('../../assets/images/logo.png')}
              />
            </ImageBackground>
          </View>
        ) : (
          <View
            style={styles.menuIconContainer}
            onTouchStart={() => {
              this.setState({
                isMenuOpen: true,
              });
            }}>
            <ImageBackground
              resizeMode={'contain'}
              source={require('../../assets/images/sidebartopleftcircle.png')}
              style={styles.menuIcon}>
              <Image
                resizeMode={'contain'}
                style={styles.iconImg}
                source={require('../../assets/images/logo.png')}
              />
            </ImageBackground>
          </View>
        )}
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View
            style={[
              styles.incomeRowView,
              { marginTop: config.Constant.SCREEN_WIDTH * 0.26 + 40 },
            ]}>
            <Text style={styles.incomeTxt}>
              {config.I18N.t('completedOrders')}
            </Text>
            <View
              onTouchStart={() => {
                this.props.navigation.navigate('VendorView');
              }}
              style={styles.profileBorder}>
              <FastImage
                style={styles.profileIcon}
                resizeMode={'cover'}
                source={
                  !!config.Constant.USER_DATA &&
                    !!config.Constant.USER_DATA.image
                    ? {
                      uri:
                        config.Constant.UsersProfile_Url +
                        '' +
                        config.Constant.USER_DATA.image,
                    }
                    : require('../../assets/images/male.png')
                }
              />
            </View>
          </View>
          <View style={[styles.incomeRowView, { alignItems: 'flex-start' }]}>
            <Text style={styles.amoutView}>
              {!!config.Constant.USER_DATA &&
                !!config.Constant.USER_DATA.order_count
                ? config.Constant.USER_DATA.order_count
                : '0'}
            </Text>
            <View style={{ alignItems: 'center', width: 135 }}>
              <Text style={styles.userName}>
                {!!config.Constant.USER_DATA && !!config.Constant.USER_DATA.name
                  ? config.Constant.USER_DATA.name
                  : ''}
              </Text>
              {!!config.Constant.USER_DATA &&
                !!config.Constant.USER_DATA.review_list &&
                config.Constant.USER_DATA.review_list.length > 0 && (
                  <StarRating
                    disabled={true}
                    halfStar={require('../../assets/images/icon_halfstar.png')}
                    fullStar={require('../../assets/images/filledStar.png')}
                    emptyStar={require('../../assets/images/startInactive.png')}
                    maxStars={5}
                    rating={
                      !!config.Constant.USER_DATA &&
                        !!config.Constant.USER_DATA.avg_rating &&
                        config.Constant.USER_DATA.avg_rating.length > 0 &&
                        !!config.Constant.USER_DATA.avg_rating[0].avg_rating
                        ? config.Constant.USER_DATA.avg_rating[0].avg_rating
                        : 0
                    }
                    containerStyle={{
                      height: 20,
                      width: 130,
                      alignSelf: 'center',
                      marginBottom: 0,
                    }}
                    starStyle={{ marginRight: 5 }}
                    starSize={20}
                    selectedStar={(rating) => { }}
                  />
                )}
              {!!config.Constant.USER_DATA &&
                !!config.Constant.USER_DATA.review_list &&
                config.Constant.USER_DATA.review_list.length > 0 && (
                  <Text style={styles.profileReviewTxt}>
                    (
                    {!!config.Constant.USER_DATA &&
                      !!config.Constant.USER_DATA.review_list &&
                      config.Constant.USER_DATA.review_list.length}{' '}
                    {config.I18N.t('reviews')})
                  </Text>
                )}
            </View>
          </View>
          <View style={[styles.incomeRowView, { marginTop: 5 }]}>
            <Text style={styles.incomeTxt}>{config.I18N.t('totalIncome')}</Text>
            <Text style={styles.onlineView}>
              {config.I18N.t('onlineStatus')}
            </Text>
          </View>
          <View style={styles.incomeRowView}>
            <Text style={styles.amoutView}>
              {!!this.state.total_earning ? this.state.total_earning : '0'} SAR
            </Text>
            {/* <ToggleSwitch
              isOn={this.state.is_online}
              onColor={config.Constant.COLOR_TAB}
              offColor={config.Constant.COLOR_GREY}
              size="large"
              onToggle={(is_online) => {
                console.log({toggle: is_online})
                this.updateProfileStatus(is_online);
              }}
            /> */}
            
            <SwitchToggle
          containerStyle={{
            marginTop: 16,
            width: 84,
            height: 42,
            borderRadius: 25,
            backgroundColor: '#ccc',
            padding: 5,
          }}
          backgroundColorOn={config.Constant.COLOR_TAB}
          backgroundColorOff= {config.Constant.COLOR_GREY}
          switchOn={this.state.is_online && this.props.userData?.userData?.is_online == 1}
          onPress={() => {
            let newState = !(this.state.is_online && this.props.userData?.userData?.is_online == 1)
            // console.log("newState", newState)
            this.updateProfileStatus(newState);
          }}
          circleColorOff='white'
          circleColorOn='white'
          duration={300}
        />
          </View>
          <View style={[styles.incomeRowView, { marginTop: 5 }]}>
            <Text style={styles.incomeTxt}>{config.I18N.t('totalTax')}</Text>
          </View>
          <View style={styles.incomeRowView}>
            <Text style={styles.amoutView}>
              {!!this.state.tax_amount ? this.state.tax_amount : '0'} SAR
            </Text>
          </View>
          {/* <View style={styles.headerStyle}>
            <Text style={styles.descTitle}>
              {config.I18N.t('recentReview')}
            </Text>
          </View>
          <View style={styles.headerBorderStyle} />
          {this.reviewScreen()} */}
        </ScrollView>
        <Dialog
          visible={this.state.isMenuOpen}
          onTouchOutside={() => {
            this.setState({
              isMenuOpen: false,
            });
          }}
          width={1}
          overlayOpacity={0.9}
          overlayBackgroundColor={'white'}
          dialogAnimation={
            new SlideAnimation({
              slideFrom: 'top',
            })
          }
          containerStyle={[
            {
              justifyContent: 'flex-start',
            },
          ]}
          dialogStyle={styles.dialogStyle}>
          <DialogContent
            style={[
              styles.dialogContent,
              {
                height: !!this.state.ViewHeight
                  ? this.state.ViewHeight - 10
                  : config.Constant.SCREEN_HEIGHT * 0.75,
              },
            ]}>
            {this.menuView()}
          </DialogContent>
        </Dialog>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userData: state.userData,
});

export default connect(mapStateToProps)(Home);
