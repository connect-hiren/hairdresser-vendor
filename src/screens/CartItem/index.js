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
import Ripple from 'react-native-material-ripple';
import CustomButton from '../../component/CustomButton';
import config from '../../config';
import styles from './styles';
import SearchableDropdown from 'react-native-searchable-dropdown';
import CustomDropdownSearch from '../../component/CustomDropdownSearch';
import Dialog, {SlideAnimation, DialogContent} from 'react-native-popup-dialog';

export default class CartItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageUdate: true,
      catArr: [
        {id: 1, isSelected: false, type: 'Hair', name: `NormalHaircut`},
        {id: 2, isSelected: true, type: 'Hair', name: `Spa`},
        {id: 3, isSelected: false, type: 'Hair', name: `Shavings`},
        {id: 4, isSelected: true, type: 'Hair', name: `Styling`},
        {id: 5, isSelected: false, type: 'Hair', name: `Hair wash`},
      ],
      selectedItems: 'test',
      optionBox: false,
    };
  }
  componentDidMount = () => {};
  serviceRenderRow = () => {
    return (
      <Ripple
        onPress={() => {
          this.setState({
            optionBox: true,
          });
        }}
        style={styles.serviceView}>
        <View style={styles.serviceImgView}>
          <Image
            resizeMode={'contain'}
            source={require('../../assets/images/chair.png')}
            style={{width: '80%', height: '80%'}}
          />
        </View>
        <Text style={styles.serviceName}>Haircut</Text>
      </Ripple>
    );
  };
  searchRender = ({item}) => {
    return (
      <Ripple style={styles.selectedItemsView}>
        <Text style={styles.searchName}>{item.name}</Text>
        <Text style={styles.searchType}>{item.type}</Text>
      </Ripple>
    );
  };
  popupListRenderRow = ({item}) => {
    return (
      <Ripple style={styles.selectedItemsView}>
        <View style={styles.emptyIcon}>
          {!!item.isSelected && <View style={styles.filledIcon} />}
        </View>
        <Text style={styles.searchName}>{item.name}</Text>
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
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <Text style={styles.userName}>
            {config.I18N.t('hello')}, John Doe
          </Text>
          <Text style={styles.locationTxt}>
            {config.I18N.t('yourLocation')}
          </Text>
          <View style={styles.rowContainer}>
            <Image
              style={styles.smallIcon}
              resizeMode={'contain'}
              source={require('../../assets/images/placeholder.png')}
            />
            <Text style={styles.locationPlaceTxt}>Riyadh</Text>
            <Image
              style={styles.smallIcon}
              resizeMode={'contain'}
              source={require('../../assets/images/cursor.png')}
            />
            <Text style={styles.changeTxt}>{config.I18N.t('CHANGE')}</Text>
          </View>
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
          </View>

          <View onPress={() => {}} style={styles.searchBar}>
            <Image
              resizeMode={'contain'}
              source={require('../../assets/images/Search.png')}
              style={styles.searchIcon}
            />
            <TextInput
              placeholder={config.I18N.t('seachService')}
              placeholderTextColor={config.Constant.COLOR_GREY}
              style={styles.inputStyle}
            />
          </View>
          {/* <CustomDropdownSearch
            onItemSelect={(item) => {
              this.setState({selectedItems: item.name});
            }}
            containerStyle={{padding: 5}}
            itemStyle={{
              padding: 10,
              marginTop: 2,
              backgroundColor: '#ddd',
              borderColor: '#bbb',
              borderWidth: 1,
              borderRadius: 5,
            }}
            itemTextStyle={{color: '#222'}}
            itemsContainerStyle={{maxHeight: 140}}
            items={this.state.catArr}
            defaultIndex={2}
            resetValue={this.state.selectedItems}
            textInputProps={{
              placeholder: config.I18N.t('seachService'),
              placeholderTextColor: config.Constant.COLOR_GREY,
              style: styles.inputStyle,
              onTextChange: (text) => {},
            }}
            listProps={{
              nestedScrollEnabled: true,
              renderItem: this.searchRender,
            }}
          /> */}
          <View style={styles.rowViewStyle}>
            <Text style={styles.rowTitle}>{config.I18N.t('services')}</Text>
          </View>

          <ScrollView
            bounces={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: config.Constant.SCREEN_WIDTH * 0.05,
            }}
            horizontal>
            <FlatList
              bounces={false}
              style={{height: 200, alignSelf: 'center'}}
              data={[1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6]}
              numColumns={9}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              renderItem={this.serviceRenderRow}
            />
          </ScrollView>
          <CustomButton
            btnTxt={config.I18N.t('searchHairDresser')}
            onPress={() => {
              this.props.navigation.navigate('NearByDresser');
            }}
            containerStyle={styles.btnStyle}
          />
        </ScrollView>
        <Dialog
          visible={this.state.optionBox}
          onTouchOutside={() => {
            this.setState({
              optionBox: false,
            });
          }}
          width={1}
          overlayOpacity={0.1}
          overlayBackgroundColor={'white'}
          dialogAnimation={
            new SlideAnimation({
              slideFrom: 'bottom',
            })
          }
          containerStyle={[
            {
              justifyContent: 'flex-end',
            },
          ]}
          dialogStyle={styles.dialogStyle}>
          <DialogContent style={[styles.dialogContent]}>
            <Ripple
              onPress={() => {
                this.setState({
                  optionBox: false,
                });
              }}
              style={{alignItems: 'center', padding: 10, width: '100%'}}>
              <Image
                resizeMode={'contain'}
                source={require('../../assets/images/arrow.png')}
                style={{
                  width: 30,
                  height: 30,
                  tintColor: config.Constant.COLOR_TAB,
                  transform: [{rotate: '90deg'}],
                }}
              />
            </Ripple>
            <FlatList
              bounces={false}
              style={{alignSelf: 'center'}}
              data={this.state.catArr}
              extraData={this.state}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              renderItem={this.popupListRenderRow}
            />
          </DialogContent>
        </Dialog>
      </View>
    );
  }
}
