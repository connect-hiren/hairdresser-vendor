import React from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  TextInput,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Ripple from 'react-native-material-ripple';
import CustomButton from '../../component/CustomButton';
import CustomHeader from '../../component/CustomHeader';
import config from '../../config';
import {getStatusBarHeight} from '../../Util/Utilities';
import styles from './styles';

export default class WishList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageUdate: true,
    };
  }
  componentDidMount = () => {};
  renderItem = ({item, index}) => {
    return (
      <Ripple
        onPress={() => {
          this.props.navigation.navigate('VendorView');
        }}
        style={styles.wishListView}>
        <View style={{marginBottom: 10}}>
          <FastImage
            resizeMode={'cover'}
            style={styles.bannerImg}
            source={
              index % 3 == 0
                ? require('../../assets/images/Card.png')
                : require('../../assets/images/loginBanner.png')
            }
          />
          <Image
            source={require('../../assets/images/likeFilled.png')}
            resizeMode={'contain'}
            style={styles.heartIcon}
          />
        </View>
        <Text style={styles.userName}>Beverly Clark</Text>
        <View style={styles.rowViewBottom}>
          <Image
            style={{width: 10, height: 10}}
            resizeMode={'contain'}
            source={require('../../assets/images/OnlineStatus.png')}
          />
          <Text style={styles.rowKm}>1 KM {config.I18N.t('away')}</Text>
          <Image
            styles={{width: 10, height: 10, marginTop: 2}}
            resizeMode={'contain'}
            source={require('../../assets/images/star.png')}
          />
          <Text style={styles.rowRating}>5.0</Text>
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
          
          txtStyle={config.I18N.t('wishlist')}
        />
        <FlatList
          numColumns={2}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]}
          extraData={this.state}
          style={{width: '90%', alignSelf: 'center'}}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}
