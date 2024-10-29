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
import CustomButton from '../../component/CustomButton';
import CustomHeader from '../../component/CustomHeader';
import config from '../../config';
import {getStatusBarHeight} from '../../Util/Utilities';
import styles from './styles';

export default class NearByDresser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      catArr: [
        {id: 1, isSelected: false, type: 'Hair', name: `NormalHaircut`},
        {id: 2, isSelected: true, type: 'Hair', name: `Spa`},
        {id: 3, isSelected: false, type: 'Hair', name: `Shavings`},
        {id: 4, isSelected: true, type: 'Hair', name: `Styling`},
        {id: 5, isSelected: false, type: 'Hair', name: `Hair wash`},
      ],
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
  renderItem = ({item, index}) => {
    return (
      <Ripple
        onPress={() => {
          this.props.navigation.navigate('VendorView');
        }}
        style={styles.notificationView}>
        <FastImage
          resizeMode={'cover'}
          style={{width: 50, height: 50}}
          source={require('../../assets/images/userRoundIcon.png')}
        />
        <View style={{flex: 1, marginHorizontal: 10}}>
          <View style={styles.rowView}>
            <Text style={styles.rowTitle}>Carolyn Gilbert</Text>
            <View style={{flexDirection: 'row'}}>
              <Image
                styles={{width: 10, height: 10, marginTop: -5}}
                resizeMode={'contain'}
                source={require('../../assets/images/star.png')}
              />
              <Text style={[styles.rowTime, {marginLeft: 10}]}>
                4.6{' '}
                <Text
                  style={[styles.rowTime, {color: config.Constant.COLOR_GREY}]}>
                  (5)
                </Text>
              </Text>
            </View>
          </View>
          <View style={styles.rowViewBottom}>
            <Text style={styles.rowDesc}>1 km {config.I18N.t('away')}</Text>
            <Text style={styles.rowStatus}>250 SAR</Text>
          </View>
        </View>
      </Ripple>
    );
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
          txtStyle={config.I18N.t('nearByHairDresser')}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View style={styles.catView}>
            {this.state.catArr.map((item, index) => {
              return (
                <View style={styles.wrapRow}>
                  <Text style={styles.wrapTxtRow}>{item.name}</Text>
                  <View style={styles.deviderLine} />
                  <Ripple>
                    <Image
                      style={{width: 15, height: 15, tintColor: 'white'}}
                      resizeMode={'contain'}
                      source={require('../../assets/images/dashIcon.png')}
                    />
                  </Ripple>
                </View>
              );
            })}
            <Ripple
              onPress={() => {
                this.props.navigation.pop();
              }}
              style={[
                styles.wrapRow,
                {backgroundColor: 'white', borderWidth: 1},
              ]}>
              <Text
                style={[styles.wrapTxtRow, {color: config.Constant.COLOR_TAB}]}>
                {config.I18N.t('change')}
              </Text>
            </Ripple>
          </View>
          <View style={styles.borderView} />
          <FlatList
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]}
            extraData={this.state}
            renderItem={this.renderItem}
          />
        </ScrollView>
      </View>
    );
  }
}
