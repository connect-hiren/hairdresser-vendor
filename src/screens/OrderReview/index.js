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
import config from '../../config';
import {getStatusBarHeight} from '../../Util/Utilities';
import styles from './styles';

export default class OrderReview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageUdate: true,
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
          txtStyle={config.I18N.t('reviewOrders')}
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
            </View>
          </View>
          <View style={styles.headerStyle}>
            <Text style={styles.descTitle}>{config.I18N.t('service')}</Text>
            <Text style={styles.qtyTitle}>{config.I18N.t('qty')}</Text>
            <Text style={styles.priceTitle}>{config.I18N.t('price')}</Text>
          </View>
          <View style={styles.headerBorderStyle} />
          <View style={styles.descStyle}>
            <Text style={styles.descData}>Noraml Haircut</Text>
            <Text style={styles.qtyData}>
              <Text
                onPress={() => {
                  this.setState({
                    Data1: this.state.Data1 > 1 ? this.state.Data1 - 1 : 1,
                  });
                }}>
                -
              </Text>
              {'   ' + this.state.Data1 + '  '}
              <Text
                onPress={() => {
                  this.setState({
                    Data1: this.state.Data1 + 1,
                  });
                }}>
                +
              </Text>
            </Text>
            <Text style={styles.priceData}>100</Text>
          </View>
          <View style={styles.descStyle}>
            <Text style={styles.descData}>Makeup</Text>
            <Text style={styles.qtyData}>
              <Text
                onPress={() => {
                  this.setState({
                    Data2: this.state.Data2 > 1 ? this.state.Data2 - 1 : 1,
                  });
                }}>
                -
              </Text>
              {'   ' + this.state.Data2 + '  '}
              <Text
                onPress={() => {
                  this.setState({
                    Data2: this.state.Data2 + 1,
                  });
                }}>
                +
              </Text>
            </Text>
            <Text style={styles.priceData}>100</Text>
          </View>
          <View style={styles.descStyle}>
            <Text style={styles.descData}>Nails</Text>
            <Text style={styles.qtyData}>
              <Text
                onPress={() => {
                  this.setState({
                    Data3: this.state.Data3 > 1 ? this.state.Data3 - 1 : 1,
                  });
                }}>
                -
              </Text>
              {'   ' + this.state.Data3 + '  '}
              <Text
                onPress={() => {
                  this.setState({
                    Data3: this.state.Data3 + 1,
                  });
                }}>
                +
              </Text>
            </Text>
            <Text style={styles.priceData}>100</Text>
          </View>
          <View style={[styles.headerStyle, {marginTop: 20}]}>
            <Text style={styles.descSubTotal}>{config.I18N.t('SubTotal')}</Text>
            <Text style={styles.qtySubTotal}></Text>
            <Text style={styles.priceSubTotal}>250</Text>
          </View>
          <View style={[styles.headerStyle, {marginTop: 10}]}>
            <Text style={styles.descData}>{config.I18N.t('fees')} (10%)</Text>
            <Text style={styles.qtyData}></Text>
            <Text style={styles.priceData}>25</Text>
          </View>
          <View style={styles.borderView} />
          <View style={[styles.headerStyle, {marginTop: 10}]}>
            <Text
              style={[styles.descTitle, {color: config.Constant.COLOR_TAB}]}>
              {config.I18N.t('SubTotal')}
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
          <CustomButton
            btnTxt={config.I18N.t('confirm')}
            onPress={() => {
              this.props.navigation.navigate('Checkout');
            }}
            containerStyle={styles.btnStyle}
          />
        </ScrollView>
      </View>
    );
  }
}
