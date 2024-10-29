import React from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  BackHandler,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Ripple from 'react-native-material-ripple';
import StarRating from 'react-native-star-rating';
import CustomButton from '../../component/CustomButton';
import CustomHeader from '../../component/CustomHeader';
import InputText from '../../component/InputText';
import config from '../../config';
import styles from './styles';

export default class Checkout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageUdate: true,
      refNum: '',
      Data1: 1,
      Data2: 1,
      Data3: 1,
    };
  }
  componentDidMount = () => {
    this.props.navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
    });
    this.props.navigation.addListener('blur', () => {
      BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
    });
  };
  hardwareBackPress = () => {
    this.props.navigation.pop();
    return true;
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

        <CustomHeader
          onBackPress={() => {
            this.hardwareBackPress();
          }}
          txtStyle={config.I18N.t('checkout')}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          bounces={false}>
          <View style={styles.reviewBox}>
            <View style={styles.serviceRowView}>
              <FastImage
                resizeMode={'cover'}
                style={{width: 50, height: 50}}
                source={require('../../assets/images/userRoundIcon.png')}
              />
              <View style={{flex: 1, paddingHorizontal: 10}}>
                <Text numberOfLines={2} style={styles.reviewName}>
                  Alex Gray
                </Text>
                <View
                  style={[
                    styles.serviceRowView,
                    {marginVertical: 0, justifyContent: 'flex-start'},
                  ]}>
                  <StarRating
                    disabled={true}
                    halfStar={require('../../assets/images/icon_halfstar.png')}
                    fullStar={require('../../assets/images/filledStar.png')}
                  emptyStar={require('../../assets/images/startInactive.png')}
                    maxStars={5}
                    rating={4}
                    containerStyle={{height: 25, width: 70}}
                    starStyle={{marginRight: 5}}
                    starSize={20}
                    selectedStar={(rating) => {}}
                  />
                  <Text numberOfLines={2} style={styles.reviewTxt}>
                    (23 {config.I18N.t('reviews')})
                  </Text>
                </View>
              </View>
              <Ripple
                onPress={() => {
                  //this.props.navigation.pop();
                }}
                style={[
                  styles.wrapRow,
                  {backgroundColor: 'white', borderWidth: 1},
                ]}>
                <Text
                  style={[
                    styles.wrapTxtRow,
                    {color: config.Constant.COLOR_TAB},
                  ]}>
                  {config.I18N.t('call')}
                </Text>
              </Ripple>
            </View>
          </View>
          <View style={styles.headerStyle}>
            <Text style={styles.descTitle}>{config.I18N.t('address')}</Text>
          </View>
          <View style={styles.headerBorderStyle} />

          <View style={styles.mapBox}>
            <Image
              source={require('../../assets/images/mapView.png')}
              style={{
                width: '100%',
                height: 150,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
              }}
              resizeMode={'cover'}
            />
            <Text style={styles.mapDescTxt}>
              7971, Al Bishr, Buraydah 52377 2319, Saudhi Arabia
            </Text>

            <Text style={styles.mapChangeTxt}>{config.I18N.t('change')}</Text>
          </View>

          <View style={styles.headerStyle}>
            <Text style={styles.descTitle}>{config.I18N.t('applyCoupon')}</Text>
          </View>
          <View style={styles.headerBorderStyle} />
          <View
            style={[
              styles.selectedItemsView,
              {marginTop: 0, marginBottom: 20},
            ]}>
            <InputText
              onRef={(ref) => (this.refNumRef = ref)}
              containerStyle={styles.inputStyle}
              value={this.state.refNum}
              onChangeText={(refNum) => {
                this.setState({
                  refNum,
                });
              }}
              placeholder={config.I18N.t('enterCouponCode')}
              returnKeyType={'next'}
              onSubmitEditing={() => {}}
              blurOnSubmit={true}
            />
            <CustomButton
              btnTxt={config.I18N.t('apply')}
              onPress={() => {
                //this.props.navigation.navigate('CreatePass');
              }}
              containerStyle={styles.applyStyle}
            />
          </View>
          <View style={styles.headerStyle}>
            <Text style={styles.descTitle}>
              {config.I18N.t('paymentMethod')}
            </Text>
          </View>
          <View style={styles.headerBorderStyle} />

          <View style={styles.mapBox}>
            <Ripple
              onPress={() => {
                this.setState({
                  isCash: false,
                });
              }}
              style={[styles.selectedItemsView, {marginTop: 20}]}>
              <Text
                style={[
                  styles.searchName,
                  {
                    fontFamily: !this.state.isCash
                      ? config.Constant.Font_Semi_Bold
                      : config.Constant.Font_Regular,
                  },
                ]}>
                {config.I18N.t('creditDebitCard')}
              </Text>
              <View style={styles.emptyIcon}>
                {!this.state.isCash && <View style={styles.filledIcon} />}
              </View>
            </Ripple>
            <Ripple
              onPress={() => {
                this.setState({
                  isCash: true,
                });
              }}
              style={[styles.selectedItemsView, {marginBottom: 20}]}>
              <Text
                style={[
                  styles.searchName,
                  {
                    fontFamily: !!this.state.isCash
                      ? config.Constant.Font_Semi_Bold
                      : config.Constant.Font_Regular,
                  },
                ]}>
                {config.I18N.t('cashOnDelivery')}
              </Text>
              <View style={styles.emptyIcon}>
                {!!this.state.isCash && <View style={styles.filledIcon} />}
              </View>

              {/* </Ripple> */}
            </Ripple>
          </View>

          <View
            style={{
              width: '95%',
              alignSelf: 'center',
              padding: config.Constant.SCREEN_WIDTH * 0.025,
              backgroundColor: config.Constant.COLOR_BORDER_COLOR,
              borderRadius: 10,
            }}>
            <View style={[styles.headerStyle, {width: '100%'}]}>
              <Text style={styles.descTitle}>{config.I18N.t('service')}</Text>
              <Text style={styles.qtyTitle}>{config.I18N.t('qty')}</Text>
              <Text style={styles.priceTitle}>{config.I18N.t('price')}</Text>
            </View>
            <View style={[styles.headerBorderStyle, {marginLeft: 0}]} />
            <View style={styles.descStyle}>
              <Text style={styles.descData}>Noraml Haircut</Text>
              <Text style={styles.qtyData}>{this.state.Data1}</Text>
              <Text style={styles.priceData}>100</Text>
            </View>
            <View style={styles.descStyle}>
              <Text style={styles.descData}>Makeup</Text>
              <Text style={styles.qtyData}>{this.state.Data2}</Text>
              <Text style={styles.priceData}>100</Text>
            </View>
            <View style={styles.descStyle}>
              <Text style={styles.descData}>Nails</Text>
              <Text style={styles.qtyData}>{this.state.Data3}</Text>
              <Text style={styles.priceData}>100</Text>
            </View>
            <View style={styles.borderView} />
            <View style={[styles.headerStyle, {marginTop: 10, width: '100%'}]}>
              <Text style={styles.descSubTotal}>
                {config.I18N.t('SubTotal')}
              </Text>
              <Text style={styles.qtySubTotal}></Text>
              <Text style={styles.priceSubTotal}>250</Text>
            </View>
            <View style={[styles.headerStyle, {marginTop: 10, width: '100%'}]}>
              <Text style={styles.descData}>{config.I18N.t('fees')} (10%)</Text>
              <Text style={styles.qtyData}></Text>
              <Text style={styles.priceData}>25</Text>
            </View>
            <View style={styles.borderView} />
            <View style={[styles.headerStyle, {marginTop: 10, width: '100%'}]}>
              <Text
                style={[styles.descTitle, {color: config.Constant.COLOR_TAB}]}>
                {config.I18N.t('Total')}
              </Text>
              <Text
                style={[
                  styles.qtyTitle,
                  {color: config.Constant.COLOR_TAB},
                ]}></Text>
              <Text
                style={[styles.priceTitle, {color: config.Constant.COLOR_TAB}]}>
                250
              </Text>
            </View>
          </View>
          <CustomButton
            btnTxt={config.I18N.t('confirm')}
            onPress={() => {
              this.props.navigation.navigate('OrderDetails');
            }}
            containerStyle={styles.btnStyle}
          />
        </ScrollView>
      </View>
    );
  }
}
