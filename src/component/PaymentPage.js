// import React from 'react';
// import {View, StyleSheet, ActivityIndicator} from 'react-native';

// import axios from 'axios';
// import CryptoJS from 'crypto-js';
// import queryString from 'query-string';
// import publicIP from 'react-native-public-ip';

// import {WebView} from 'react-native-webview';
// import modules from '../modules';

// import Constant from '../config/Constant';
// import CustomHeader from './CustomHeader';

// class PaymentPage extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       baseURL: '',
//       visible: true,
//     };
//   }

//   componentDidMount() {
//     const requestData = !!this.props.route.params.request
//       ? this.props.route.params.request
//       : {};
//     const sourcePage = !!this.props.route.params.source
//       ? this.props.route.params.source
//       : {};

//     this.setState({source: sourcePage}, () => {
//       this.processPayment(requestData)
//         .then((response) => {
//           if (response.status == 'redirect') {
//             this.setState({baseURL: response.redirectUrl});
//           } else if (response.status == 'success') {
//             //go back with success before processing payment
//             this.returnResponse({status: 'success', data: {}});
//           }
//         })
//         .catch((err) => {
//           //go back with error
//           this.returnResponse({status: 'error', error: err});
//         });
//     });
//   }

//   onPaymentComplete = (processUrl) => {
//     this.processResponse(processUrl)
//       .then((response) => {
//         //go back with success after processing payment
//         // modules.RequestPopup2.isVisible() && modules.RequestPopup2.hideRef()
//         this.returnResponse({status: 'success', data: response});
//       })
//       .catch((err) => {
//         //go back with error
//         this.returnResponse({status: 'error', error: err});
//       });
//   };

//   returnResponse = (data) => {
//     setTimeout(() => {
//       if (
//         this.props.route &&
//         this.props.route.params &&
//         this.props.route.params.callBack
//       ) {
//         this.props.route.params.callBack(data);
//       }
//     }, 100);
//     this.props.navigation.pop();
//   };

//   processPayment = (requestData) => {
//     return new Promise((resolve, reject) => {
//       const txn_details =
//         '' +
//         requestData['trackid'] +
//         '|' +
//         Constant.terminalId +
//         '|' +
//         Constant.password +
//         '|' +
//         Constant.key +
//         '|' +
//         requestData['amount'] +
//         '|' +
//         Constant.currency +
//         '';
//       const hash = CryptoJS.SHA256(txn_details).toString();
//       // console.log("processPayment  ", requestData)
//       publicIP()
//         .then((ip) => {
//           let fields = {};
//           if (
//             requestData['action'] == '1' ||
//             requestData['action'] == '4' ||
//             requestData['action'] == '13'
//           ) {
//             if (
//               requestData['trackid'] == '' ||
//               requestData['customerEmail'] == '' ||
//               requestData['first_name'] == '' ||
//               requestData['last_name'] == '' ||
//               requestData['country'] == '' ||
//               requestData['amount'] == ''
//             ) {
//               reject('Required data for payment missing1.');
//             } else {
//               if (
//                 requestData['cardToken'] != '' ||
//                 requestData['cardToken'] != null
//               ) {
//                 fields = {
//                   trackid: requestData['trackid'],
//                   transid: requestData['trackid'],
//                   terminalId: Constant.terminalId,
//                   customerEmail: requestData['customerEmail'],
//                   customerName:
//                     requestData['first_name'] + ' ' + requestData['last_name'],
//                   action: requestData['action'],
//                   instrumentType: 'DEFAULT',
//                   merchantIp: ip,
//                   password: Constant.password,
//                   currency: Constant.currency,
//                   country: requestData['country'],
//                   amount: requestData['amount'],
//                   udf2: requestData['udf2'],
//                   udf3: requestData['udf3'],

//                   udf1: '1234',
//                   udf5: '1234',
//                   udf4: '1234',
//                   tokenizationType: requestData['tokenizationType'],
//                   cardToken: requestData['cardToken'],
//                   requestHash: hash,
//                 };
//               } else {
//                 fields = {
//                   trackid: requestData['trackid'],
//                   transid: requestData['trackid'],
//                   terminalId: Constant.terminalId,
//                   customerEmail: requestData['customerEmail'],
//                   customerName:
//                     requestData['first_name'] + ' ' + requestData['last_name'],
//                   action: requestData['action'],
//                   instrumentType: 'DEFAULT',
//                   merchantIp: ip,
//                   password: Constant.password,
//                   currency: Constant.currency,
//                   country: requestData['country'],
//                   amount: requestData['amount'],
//                   udf2: requestData['udf2'],
//                   udf3: requestData['udf3'],

//                   udf1: '1234',
//                   udf5: '1234',
//                   udf4: '1234',
//                   requestHash: hash,
//                 };
//               }
//             }
//           } else if (requestData['action'] == '12') {
//             if (
//               requestData['trackid'] == '' ||
//               requestData['customerEmail'] == '' ||
//               requestData['first_name'] == '' ||
//               requestData['last_name'] == '' ||
//               requestData['country'] == '' ||
//               requestData['amount'] == ''
//             ) {
//               reject('Required data for payment missing2.');
//             } else {
//               if (requestData['tokenOperation'] == 'A') {
//                 fields = {
//                   trackid: requestData['trackid'],
//                   transid: requestData['trackid'],
//                   terminalId: Constant.terminalId,
//                   instrumentType: 'DEFAULT',
//                   customerEmail: requestData['customerEmail'],
//                   customerName:
//                     requestData['first_name'] + ' ' + requestData['last_name'],
//                   action: requestData['action'],
//                   merchantIp: ip,
//                   password: Constant.password,
//                   currency: Constant.currency,
//                   country: requestData['country'],
//                   amount: requestData['amount'],
//                   udf2: requestData['udf2'],
//                   udf3: requestData['udf3'],

//                   udf1: '1234',
//                   udf5: '1234',
//                   udf4: '1234',
//                   tokenizationType: requestData['tokenizationType'],
//                   tokenOperation: requestData['tokenOperation'],
//                   requestHash: hash,
//                 };
//               } else {
//                 if (requestData['cardToken'] == '') {
//                   reject('Required data for tokenization missing.');
//                 } else {
//                   fields = {
//                     trackid: requestData['trackid'],
//                     transid: requestData['trackid'],
//                     terminalId: Constant.terminalId,
//                     customerEmail: requestData['customerEmail'],
//                     customerName:
//                       requestData['first_name'] +
//                       ' ' +
//                       requestData['last_name'],
//                     action: requestData['action'],
//                     instrumentType: 'DEFAULT',
//                     merchantIp: ip,
//                     password: Constant.password,
//                     currency: Constant.currency,
//                     country: requestData['country'],
//                     amount: requestData['amount'],
//                     udf2: requestData['udf2'],
//                     udf3: requestData['udf3'],

//                     udf1: '1234',
//                     udf5: '1234',
//                     udf4: '1234',
//                     cardToken: requestData['cardToken'],
//                     tokenizationType: requestData['tokenizationType'],
//                     tokenOperation: requestData['tokenOperation'],
//                     requestHash: hash,
//                   };
//                 }
//               }
//             }
//           } else {
//             if (
//               requestData['trackid'] == '' ||
//               requestData['customerEmail'] == '' ||
//               requestData['first_name'] == '' ||
//               requestData['last_name'] == '' ||
//               requestData['country'] == '' ||
//               requestData['amount'] == ''
//             ) {
//               reject('Required data for payment missing3.');
//             } else {
//               if (
//                 requestData['cardToken'] != '' ||
//                 requestData['cardToken'] != null
//               ) {
//                 fields = {
//                   trackid: requestData['trackid'],
//                   transid: requestData['tranid'],
//                   terminalId: Constant.terminalId,
//                   instrumentType: 'DEFAULT',
//                   customerEmail: requestData['customerEmail'],
//                   customerName:
//                     requestData['first_name'] + ' ' + requestData['last_name'],
//                   action: requestData['action'],
//                   merchantIp: ip,
//                   password: Constant.password,
//                   currency: Constant.currency,
//                   country: requestData['country'],
//                   amount: requestData['amount'],
//                   udf2: requestData['udf2'],
//                   udf3: requestData['udf3'],

//                   udf1: '1234',
//                   udf5: '1234',
//                   udf4: '1234',
//                   tokenizationType: requestData['tokenizationType'],
//                   cardToken: requestData['cardToken'],
//                   requestHash: hash,
//                 };
//               } else {
//                 fields = {
//                   trackid: requestData['trackid'],
//                   transid: requestData['tranid'],
//                   terminalId: Constant.terminalId,
//                   instrumentType: 'DEFAULT',
//                   customerEmail: requestData['customerEmail'],
//                   customerName:
//                     requestData['first_name'] + ' ' + requestData['last_name'],
//                   action: requestData['action'],
//                   merchantIp: ip,
//                   password: Constant.password,
//                   currency: Constant.currency,
//                   country: requestData['country'],
//                   amount: requestData['amount'],
//                   udf2: requestData['udf2'],
//                   udf3: requestData['udf3'],

//                   udf1: '1234',
//                   udf5: '1234',
//                   udf4: '1234',
//                   requestHash: hash,
//                 };
//               }
//             }
//           }

//           const data = JSON.stringify(fields);

//           axios
//             .request({
//               method: 'post',
//               url: Constant.requestUrl,
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               data: data,
//             })
//             .then((response) => {
//               const urldecode = response.data;
//               if (urldecode['payid'] != undefined) {
//                 let url = '';
//                 if (urldecode['targetUrl'].includes('?')) {
//                   url =
//                     urldecode['targetUrl'] + 'paymentid=' + urldecode['payid'];
//                 } else {
//                   url =
//                     urldecode['targetUrl'] + '?paymentid=' + urldecode['payid'];
//                 }

//                 resolve({status: 'redirect', redirectUrl: url});
//               } else {
//                 if (urldecode['result'] != undefined) {
//                   if (urldecode['result'] == 'Successful') {
//                     resolve({status: 'success'});
//                   } else {
//                     let responsecode = '';
//                     if (urldecode['responsecode'] != undefined) {
//                       responsecode = urldecode['responsecode'];
//                     } else {
//                       responsecode = urldecode['responseCode'];
//                     }

//                     const json = {
//                       result: '1',
//                       responsecode: responsecode,
//                       description: responsecode,
//                     };

//                     const json_data = JSON.stringify(json);
//                     // console.log(json_data);

//                     reject(
//                       'Something went wrong! Response Code - ' + responsecode, urldecode['result']
//                     );
//                   }
//                 }
//               }
//             })
//             .catch(function (error) {
//               console.log(error);
//               reject('Something went wrong!');
//             });
//         })
//         .catch((error) => {
//           console.log(error);
//           reject('Something went wrong detecting ip!');
//         });
//     });
//   };

//   processResponse = (responseUrl) => {
//     return new Promise((resolve, reject) => {
//       const responseObject = queryString.parse(responseUrl);

//       const requestHash =
//         '' +
//         responseObject['TranId'] +
//         '|' +
//         Constant.key +
//         '|' +
//         responseObject['ResponseCode'] +
//         '|' +
//         responseObject['amount'] +
//         '';
//       const txn_details1 =
//         '' +
//         responseObject['TrackId'] +
//         '|' +
//         Constant.terminalId +
//         '|' +
//         Constant.password +
//         '|' +
//         Constant.key +
//         '|' +
//         responseObject['amount'] +
//         '|' +
//         Constant.currency +
//         '';

//       const hash = CryptoJS.SHA256(requestHash).toString();
//       const hash1 = CryptoJS.SHA256(txn_details1).toString();

//       if (hash == responseObject['responseHash']) {
//         const apifields = {
//           trackid: responseObject['TrackId'],
//           terminalId: Constant.terminalId,
//           action: '10',
//           merchantIp: '',
//           password: Constant.password,
//           currency: Constant.currency,
//           transid: responseObject['TranId'],
//           amount: responseObject['amount'],
//           udf5: 'Test5',
//           udf3: 'Test3',
//           udf4: 'Test4',
//           udf1: 'Test1',
//           udf2: 'Test2',
//           requestHash: hash1,
//         };

//         const apifields_string = JSON.stringify(apifields);

//         axios
//           .request({
//             method: 'post',
//             url: Constant.requestUrl,
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             data: apifields_string,
//           })
//           .then((response) => {
//             const urldecodeapi = response.data;
//             let inquiryResponsecode = '';

//             if (urldecodeapi['responseCode'] != undefined) {
//               inquiryResponsecode = urldecodeapi['responseCode'];
//             } else {
//               inquiryResponsecode = urldecodeapi['responsecode'];
//             }

//             const inquirystatus = urldecodeapi['result'];

//             if (
//               inquirystatus === 'Approved' ||
//               responseObject['ResponseCode'] === inquiryResponsecode
//             ) {
//               if (
//                 responseObject['cardToken'] != undefined &&
//                 responseObject['maskedPAN'] != undefined &&
//                 responseObject['maskedPAN'] != '' &&
//                 responseObject['cardToken'] != '' &&
//                 responseObject['cardToken'] != null &&
//                 responseObject['cardToken'] != 'null'
//               ) {
//                 resolve({
//                   type: 'receiptToken',
//                   amount: responseObject['amount'],
//                   tranid: responseObject['TranId'],
//                   status: 'Successful',
//                   cardtoken: responseObject['cardToken'],
//                   maskedno: responseObject['maskedPAN'],
//                 });
//               } else {
//                 resolve({
//                   type: 'receipt',
//                   amount: responseObject['amount'],
//                   tranid: responseObject['TranId'],
//                   status: responseObject['Result'],
//                 });
//               }
//             } else {
//               reject('Something went wrong!!! Data Tamper!!!!!!!');
//             }
//           })
//           .catch((error) => {
//             console.log(error);
//             reject('Something went wrong processing response!');
//           });
//       } else {
//         reject('Hash Mismatch!');
//       }
//     });
//   };

//   render() {
//     const {baseURL, visible} = this.state;

//     return (
//       <>
//         <CustomHeader
//           onBackPress={() => {
//             this.props.navigation.pop();
//           }}
//           txtStyle={''}
//         />
//         {baseURL.length > 0 && (
//           <WebView
//             source={{uri: baseURL}}
//             scalesPageToFit={true}
//             sharedCookiesEnabled={true}
//             automaticallyAdjustContentInsets={true}
//             startInLoadingState={true}
//             renderError={() => null}
//             renderLoading={() => null}
//             onLoadStart={() => this.setState({visible: true})}
//             onLoadEnd={() => this.setState({visible: false})}
//             onShouldStartLoadWithRequest={(event) => {
//               if (event.url.startsWith(Constant.responseUrl)) {
//                 this.onPaymentComplete(event.url);
//                 return false;
//               } else {
//                 return true;
//               }
//             }}
//           />
//         )}
//         {visible && (
//           <View
//             style={{
//               width: '100%',
//               height: '100%',
//               position: 'absolute',
//               backgroundColor: 'transparent',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}>
//             <ActivityIndicator size={'large'} />
//           </View>
//         )}
//       </>
//     );
//   }
// }

// export default PaymentPage;

//5400000000000008
//05/21
//123
//Any one



//Global imports
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ScrollView,
  ImageBackground,
  TextInput,
  Pressable,
  I18nManager,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import CustomButton from './CustomButton';

import {
  MFPaymentRequest,
  MFCustomerAddress,
  MFExecutePaymentRequest,
  Response,
  MFLanguage,
  MFSettings,
  MFTheme,
  MFProduct,
  MFMobileCountryCodeISO,
  MFCurrencyISO,
  MFPaymentMethodCode,
  MFPaymentype,
  MFKeyType,
  MFInitiatePayment,
  MFEnvironment,
  MFCountry,
  MFInAppApplePayView,
  MFInitiateSessionRequest,
} from 'myfatoorah-reactnative';


//Component imports
import config from '../config';
import CustomHeader from './CustomHeader';
import modules from '../modules';

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.Constant.COLOR_WHITE
},
couponSection: {
  padding: 20,
  borderWidth: 1,
  borderColor: config.Constant.COLOR_BORDER_COLOR,
  width: '90%',
  alignSelf: 'center',
  borderRadius: 10,
  marginBottom: 10
},
rowContainer: {
  flexDirection: 'row',
  alignItems: 'center'
},
subTotalText: {
  fontFamily: config.Constant.Font_Regular,
  fontSize: 14,
  color: config.Constant.COLOR_GREY,
  textAlign: 'left'
},
totalPrice: {
  fontFamily: config.Constant.Font_Bold,
  fontSize: 16,
  color: config.Constant.COLOR_LIGHT_GREY,
  textAlign: 'left'
},
circleSection: {
  height: 24,
  width: 24,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: config.Constant.COLOR_PRIMARY,
  borderRadius: 12
},
innerSection: {
  height: 14,
  width: 14,
  backgroundColor: config.Constant.COLOR_PRIMARY,
  borderRadius: 8
},
paymentText: {
  fontFamily: config.Constant.Font_Medium,
  fontSize: 14,
  color: config.Constant.COLOR_PRIMARY,
  textAlign: 'left',
  marginLeft: 10
},
applyStyle: {
  // width:Dimensions.get("window").width-48,
  width:Dimensions.get("window").width-48,
  justifyContent:"center",
  alignItems:"center",
  alignSelf:"center",
  marginHorizontal:24,
  marginTop:16
},
})

const {
  container,
  couponSection,
  rowContainer,
  subTotalText,
  totalPrice,
  circleSection,
  innerSection,
  applyStyle,
  paymentText,
} = Styles;

const PaymentPage = (props) => {
  const {
    navigation: {toggleDrawer, navigate, goBack},
    route: {params},
  } = props;

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [goToPayment, setGoToPayment] = useState(true);

  const [paymentMethodList, setPaymentMethodList] = useState(
    params?.data?.paymentMethodList || [],
  );

  useEffect(() => {
    if (isFocused && goToPayment) {
      let theme = new MFTheme('blue', 'gray', 'Payment', 'Cancel');
      MFSettings.sharedInstance.setTheme(theme);
      console.log(
        MFSettings.sharedInstance.getInvironment(MFEnvironment.LIVE),
        'PPP',
      );
      MFSettings.sharedInstance.configure(
        'jSD2cFUwBFAyzlp5xWSaxUEUqc3IAUTSTOp_6fzVcopkf4s1mrzM6FjyQ5BtnOP2RhdZqwJUiBg-DZAAjb_RlcJWvC9i0nLBlGOxeR4x7e8wAV1Fd7sfO0Ho9cUn5p__vUoZm4YgLXPeCTwY_CZpapeMqxbjymSN0NTBYG1O9inRd8D47CBoaHLi_jdF5fiOISB5tbw1-QhhxF15B1EdZ8NOd80pxYJzKjeO5_SyBr09c6gNwif6pohRfPOzMTW422Sfz147WMPmDv3e51Bi4WyTTjl4srY7yLiOByA-JDB9GGpSwGUM_PS0G7Of2zZdCuYkk5_NsFZTJwEvJqlFsSZuT1wTYwHYTv1Zst47w8zIRGy6ezVAKYSX7-_6FZG3EL6hZVOWdkWjruBoTEZ-1_5tBKeT_4ADUBDi2YSxt9XJu4x0_rFQ9GgU958m8RkMpIKCcZY42ofBUnwPoeJ07iGbtZQxmtczNxUciDbW0wfU3rvSHrQ9XnZ4VUtN5BnSSCEAcIyXaGyL0FTlesZn98f51l0AeIVay6quDGg9D9NOxsWR6gJY3OfJzxgkt1LVfXAaUEYgZauZrFZDHVAqyzMVNlmFhp798F4p3FvFw7Wdyd2s56oKHZTPwOGl9ALQxbV-3LyKgdnhCmhXbyC_Q2-rGjOqRRYOlnYb5oGntwnJJp3ljCAB0Pzw19rbfa8unmx7LQ',
        // 'rLtt6JWvbUHDDhsZnfpAhpYk4dxYDQkbcPTyGaKp2TYqQgG7FGZ5Th_WD53Oq8Ebz6A53njUoo1w3pjU1D4vs_ZMqFiz_j0urb_BH9Oq9VZoKFoJEDAbRZepGcQanImyYrry7Kt6MnMdgfG5jn4HngWoRdKduNNyP4kzcp3mRv7x00ahkm9LAK7ZRieg7k1PDAnBIOG3EyVSJ5kK4WLMvYr7sCwHbHcu4A5WwelxYK0GMJy37bNAarSJDFQsJ2ZvJjvMDmfWwDVFEVe_5tOomfVNt6bOg9mexbGjMrnHBnKnZR1vQbBtQieDlQepzTZMuQrSuKn-t5XZM7V6fCW7oP-uXGX-sMOajeX65JOf6XVpk29DP6ro8WTAflCDANC193yof8-f5_EYY-3hXhJj7RBXmizDpneEQDSaSz5sFk0sV5qPcARJ9zGG73vuGFyenjPPmtDtXtpx35A-BVcOSBYVIWe9kndG3nclfefjKEuZ3m4jL9Gg1h2JBvmXSMYiZtp9MR5I6pvbvylU_PP5xJFSjVTIz7IQSjcVGO41npnwIxRXNRxFOdIUHn0tjQ-7LwvEcTXyPsHXcMD8WtgBh-wxR8aKX7WPSsT1O8d8reb2aR7K3rkV3K82K_0OgawImEpwSvp9MNKynEAJQS6ZHe_J_l77652xwPNxMRTMASk1ZsJL',
        MFCountry.SAUDIARABIA,
        MFEnvironment.LIVE,
      );
      setSelectedShippingID('3');
    }
    initiatePayments(300);
  }, [isFocused]);

  const [appleSessionID, setAppleSessionID] = useState('');

  function initiatePayments(amount) {
    let initiateRequest = new MFInitiatePayment(
      parseFloat(amount),
      MFCurrencyISO.KUWAIT_KWD,
    );
    MFPaymentRequest.sharedInstance.initiatePayment(
      initiateRequest,
      MFLanguage.ENGLISH,
      (response) => {
        if (response.getError()) {
          alert('error: ' + response.getError().error);
        } else {
          const newArray = response.getPaymentMethods().map((item, i) => {
            return {...item, isActive: false};
          });
          console.log(newArray, 'method');

          setPaymentMethodList(newArray);
        }
      },
    );
  }

  const [selectedShippingID, setSelectedShippingID] = useState(
    params?.data?.selectedShippingID || '3',
  );

  const [activePayment, setActivePayment] = useState('1');


  const executeResquestJson = (paymentMethodID) => {
    // const app = MFInitiatePayment(150, MFCurrencyISO.SAUDIARABIA_SAR)
    // console.log(app, "app")
    let total = data?.amount

    let request = new MFExecutePaymentRequest(
      parseFloat(total),
      // parseFloat(cartData.total),
      paymentMethodID,
    );

    request.invoiceValue = parseFloat(total); // must be email
    request.customerEmail = data?.email;
    // user_info.email ? user_info.email : data.email; // must be email
    request.customerMobile = parseInt(
      data.mobile1,
      // user_info.mobile ? user_info.mobile : data.mobile1,
    );
    request.customerCivilId = '';

    let address = new MFCustomerAddress(
      data?.name,
      data?.address,
      data?.region,
      data?.city,
      data?.country,
    );
    // !user_info.id?new MFCustomerAddress(data?.name,data?.address, data?.region, data?.city, data?.country):
    // new MFCustomerAddress(address1, city_name, region, country_name, country_name);
    request.customerAddress = address;
    request.customerName = data?.name;
    // user_info.name ? user_info.name : data.name;
    request.customerReference = data?.name;
    // user_info.name ? user_info.name : data.name;
    request.language = I18nManager.isRTL ? 'ar' : 'en';
    (request.sessionId = appleSessionID),
      (request.mobileCountryCode = MFMobileCountryCodeISO.SAUDIARABIA);
    request.displayCurrencyIso = MFCurrencyISO.SAUDIARABIA_SAR;
    return request;
  };

  const executePayment = (selectedPaymentMethodId) => {
    let request = executeResquestJson(selectedPaymentMethodId);

    MFPaymentRequest.sharedInstance.executePayment(
      props.navigation,
      request,
      I18nManager.isRTL ? MFLanguage.ARABIC : MFLanguage.ENGLISH,
      (response) => {
        if (response.getError()) {
          console.log(response, 'Cart.paymentFailed');
        } else {
          var bodyString = response.getBodyString();

          let newObj = JSON.parse(bodyString);
          let data = JSON.parse(bodyString).Data;
          let modifiedObje = {status: 'success', data: data};

          modules.DropDownAlert.showAlert(
            'success',
            config.I18N.t('success'),
            config.I18N.t('paymentSuccess'),
          );
          goBack()
          // modules.RequestPopup2.isVisible() && modules.RequestPopup2.hideRef();
          props.route.params.callBack(modifiedObje);
        }
      },
    );
  };
  
  const [data, setData] = useState({
    name:
    config.Constant?.USER_DATA?.name.substring(
        0,
        config.Constant?.USER_DATA?.name.indexOf(' '),
      ) || 'chandan',
    email: config.Constant?.USER_DATA?.email || 'cs@yopmail.com',
    region: 'Saudi',
    address: config.Constant?.USER_DATA?.address?.substring(0, 49) || 'SAUdi',
    zipCode: '700001',
    country: 'Saudi',
    mainAddress: config.Constant?.USER_DATA?.address?.substring(0, 49) || 'Saudi',
    city: 'Riyadh',
    mobile1: config.Constant?.USER_DATA?.phone_number,
    callingCode1: '966',
    amount: params?.request?.amount || '0',
  });

  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState('');

  const selectPayment = (paymentMethodId) => {
    const newArray = paymentMethodList.map((item, i) => {
      if (item.PaymentMethodId == paymentMethodId) {
        if (Platform.OS === 'android') {
          item.isActive = true;
          setSelectedPaymentMethodId(item.PaymentMethodId);
        } else if (Platform.OS === 'ios') {
          if (item.PaymentMethodCode === 'ap') {
            if (parseInt(Platform.Version, 10) >= 16) {
              item.isActive = true;
              setSelectedPaymentMethodId(item.PaymentMethodId);
            } else {
              modules.DropDownAlert.showAlert(
                'error',
                config.I18N.t('OsValid'),
                data.message,
              );
              // showMessage({
              //   message: Translator('Cart.OsValid'),
              //   type: 'danger',
              // });
            }
          } else {
            item.isActive = true;
            setSelectedPaymentMethodId(item.PaymentMethodId);
          }
        }

        return item;
      } else {
        item.isActive = false;
        return item;
      }
    });
    setPaymentMethodList(newArray);
  };

  const validate = () => {
    let valid = true;
    if (activePayment == 1 && selectedPaymentMethodId === '') {
      valid = false;
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('selectPaymentMethod'),
        config.I18N.t('selectPaymentMethod'),
      );
      // alert(config.I18N.t('selectPaymentMethod'));
    }

    return valid;
  };

  const hardwareBackPress = () => {
    props.navigation.pop();
    return true;
  };

  return (
    <SafeAreaView style={[container]}>
      <CustomHeader
        onBackPress={() => {
          hardwareBackPress();
        }}
        txtStyle={config.I18N.t('PaymentAlertHeader')}
      />
      <ScrollView style={{flex: 1}}>
        {activePayment != 0 && paymentMethodList.length > 0 ? (
          <View>
            <View style={[couponSection]}>
              <Text
                style={[
                  totalPrice,
                  {
                    fontSize: 18,
                  },
                ]}>
                {config.I18N.t('PaymentMethods')}
              </Text>
              <Text style={[subTotalText, {fontSize: 13, marginTop: 5}]}>
                {config.I18N.t('ClickMethod')}
              </Text>
            </View>

            <View style={[couponSection]}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={paymentMethodList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => {
                  return item.PaymentMethodCode === 'ap' &&
                    Platform.OS === 'android' ? null : (
                    <Pressable
                      key={`item=${item.PaymentMethodId}`}
                      onPress={() => selectPayment(item.PaymentMethodId)}
                      style={[rowContainer, {marginBottom: 15}]}>
                      <View
                        style={[
                          circleSection,
                          {
                            borderColor: item.isActive
                              ? config.Constant.COLOR_PRIMARY
                              : config.Constant.COLOR_BLACK,
                          },
                        ]}>
                        {item.isActive ? <View style={innerSection} /> : null}
                      </View>
                      <View style={[rowContainer, {marginLeft: 20}]}>
                        <ImageBackground
                          source={{uri: item.ImageUrl}}
                          resizeMode="contain"
                          style={{height: 30, width: 30}}
                        />
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={[
                            paymentText,
                            {
                              color: item.isActive
                                ? config.Constant.COLOR_PRIMARY
                                : config.Constant.COLOR_BLACK,
                              paddingRight: 20,
                            },
                          ]}>
                          {item.PaymentMethodEn}
                        </Text>
                      </View>
                    </Pressable>
                  );
                }}
              />
            </View>
          </View>
        ) : null}

        <CustomButton
          btnTxt={config.I18N.t('MAKEPAYMENT')}
          onPress={() => {
            if (validate()) {
              if (activePayment === '1') {
                setGoToPayment(false);
                executePayment(selectedPaymentMethodId);
              }
            }
          }}
          containerStyle={applyStyle}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentPage;
