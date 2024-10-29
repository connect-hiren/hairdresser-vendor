import React from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  Image,
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';
import config from '../../config';
import * as Animatable from 'react-native-animatable';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import Ripple from 'react-native-material-ripple';
import styles from './styles';
import CustomButton from '../../component/CustomButton';
import { TabView, SceneMap } from 'react-native-tab-view';
import CustTabView from '../../component/CustomTabView';
import StarRating from 'react-native-star-rating';
import AddService from '../../component/AddService';
import modules from '../../modules';
import moment from 'moment';
import { connect } from 'react-redux';
import * as UserDataActions from '../../Redux/actions/userData';
import UpdateService from '../../component/UpdateService';

class VendorView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageUdate: true,
      isRTL: config.Constant.isRTL,
      isMenuOpen: false,
      serviceData: [
        { title: 'Normal Haircut' },
        { title: 'Styling' },
        { title: 'Spa' },
      ],
      reviewData: [1, 2, 3],
      currTab: 0,
      onServicePopup: false,
      mainCategory: [],
      subCategory: [],
      mainDataId: 0,
      catDataId: 0,
      sar: '',
      sarError: '',
      mainCatError: '',
      catError: '',
      parantArr: [],
      commission:0
    };
  }
  componentDidMount = () => {

    this.getcategoriesData();
    this.getArrange();
    try {
      if (!!this.props.route.params.is_service) {
        this.setState({
          onServicePopup: true,
          currTab: 1,
        });
      }
    } catch (error) { }
    config.Constant.settingData && config.Constant.settingData.map((item)=>{
      if(item.key_name == "commission"){
        this.setState({
          commission: Number(item.key_value)
        })
      }
    })

  };
  // getSettings = async () => {
  //   config.Constant.showLoader.showLoader();
  //   const formData = new FormData();
  //   formData.append('role_id', 2);
  //   var data = await modules.APIServices.PostApiCall(
  //     config.ApiEndpoint.SETTING,
  //     formData,
  //   );
  //   config.Constant.showLoader.hideLoader();
  //   if (data.status_code == 200) {
  //     config.Constant.settingData = data.data;
  //   } else {
  //   }
  // };
  getcategoriesData = async () => {
    //config.Constant.showLoader.showLoader();
    const formData = new FormData();
    formData.append('role_id', 3);
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.CATEGORY_LIST,
      formData,
    );
    // config.Constant.showLoader.hideLoader();
    if (data.status_code == 200) {
      //alert(JSON.stringify(data.data));
      var arr = [];
      var subCategory = [];
      data.data.map((itm, ind) => {
        itm.label = config.I18N.locale == 'en' ? itm.name : itm.ar_name;
        itm.value = itm.id;
        if (ind == 0) {
          // this.setState({
          //   mainDataId: itm.id,
          // });
        }
        if (ind == 0 && itm.category.length > 0) {
          subCategory = itm.category;
        }
        itm.category.map((cItm, cInd) => {
          itm.category[cInd].label =
            config.I18N.locale == 'en' ? cItm.name : cItm.ar_name;
          itm.category[cInd].value = cItm.id;
          if (cInd == 0) {
            // this.setState({
            //   catDataId: cItm.id,
            // });
          }
        });

        arr.push(itm);
      });
      this.setState({
        mainCategory: arr,
        subCategory: subCategory,
      });
    } else {
    }
  };
  getArrange = () => {
    var parantArr = [];
    config.Constant.USER_DATA.service.map((serCatItm, indd) => {
      var is_add = true;
      parantArr.map((Pid, Pind) => {
        if (
          !serCatItm.category_detail ||
          Pid.id == serCatItm.category_detail.parent_category.id
        ) {
          is_add = false;
        }
      });
      if (!!is_add) {
        parantArr.push({
          id: serCatItm.category_detail.parent_category.id,
          name:
            config.I18N.locale == 'en'
              ? serCatItm.category_detail.parent_category.name
              : serCatItm.category_detail.parent_category.ar_name,
        });
      }
    });
    parantArr.map((item, index) => {
      var subCatArr = config.Constant.USER_DATA.service.filter(
        (sItem, sIndex) => {
          return (
            !!sItem.category_detail &&
            sItem.category_detail.parent_category.id == item.id
          );
        },
      );
      parantArr[index].subCatArr = subCatArr;
    });

    this.setState({
      parantArr: parantArr,
    });
  };
  deleteService = async (catId) => {
    config.Constant.showLoader.showLoader();
    const formData = new FormData();
    formData.append('service_id', catId);
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.DELETE_SERVICE,
      formData,
    );

    if (data.status_code == 200) {
      modules.DropDownAlert.showAlert('success', '', data.message);
      this.GetUserData();
    } else {
      config.Constant.showLoader.hideLoader();
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('error'),
        data.message,
      );
    }
  };
  saveService = async (catId, price) => {
    config.Constant.showLoader.showLoader();
    const formData = new FormData();
    formData.append('category_id', catId);
    formData.append('price', price);
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.ADD_EDIT_SERVICE,
      formData,
    );

    if (data.status_code == 200) {
      this.setState(
        {
          onServicePopup: false,
        },
        () => {
          modules.DropDownAlert.showAlert(
            'success',
            config.I18N.t('success'),
            data.message,
          );
          setTimeout(()=>{
            this.GetUserData();
          }, 200)
          
        },
      );
    } else {
      config.Constant.showLoader.hideLoader();
      modules.DropDownAlert.showAlert(
        'error',
        config.I18N.t('error'),
        data.message,
      );
    }
  };
  aboutScreen = () => {
    return (
      <View style={[styles.tabView, { flex: 1 }]}>
        {!config.Constant.USER_DATA ||
          (!config.Constant.USER_DATA.about && (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                marginTop: config.Constant.SCREEN_HEIGHT * 0.13,
              }}>
              <Text style={styles.emptyString}>
                {config.I18N.t('add_someting_about_you')}
              </Text>
            </View>
          ))}
        <Text style={styles.descTxt}>
          {!!config.Constant.USER_DATA ? config.Constant.USER_DATA.about : ''}
        </Text>
      </View>
    );
  };
  getBtnName = () => {
    if (this.state.currTab == 1) {
      return config.I18N.t('editProfile');
    } else {
      return config.I18N.t('addService');
    }
  };
  serviceScreen = () => {
    return (
      <View style={styles.tabView}>
        {this.state.parantArr.length < 1 && (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              marginTop: config.Constant.SCREEN_HEIGHT * 0.13,
            }}>
            <Text style={styles.emptyString}>
              {config.I18N.t('add_Services')}
            </Text>
          </View>
        )}
        {this.state.parantArr.map((itm, ind) => {
          // console.log("serviceScreen  ", itm.name, itm.subCatArr)
          return (
            <View>
              <Text style={styles.serviceHeader}>{itm.name}</Text>
              {itm.subCatArr.map((item, index) => {
                // console.log("subCatArr  ", item.category_detail.name, item.name)
                return (
                  <View style={styles.serviceRowView}>
                    <Text
                      onPress={() => {
                        this.setState({
                          catDataId: item.category_detail.id,
                          sar: `${item.price}`,
                          onUpdateServicePopup: true,
                        });
                      }}
                      style={styles.serviceTitle}>
                      {!!item.category_detail
                        ? config.I18N.locale == 'en'
                          ? item.category_detail.name
                          : item.category_detail.ar_name
                        : ''}
                    </Text>
                    <Text
                      onPress={() => {
                        this.setState({
                          catDataId: item.category_detail.id,
                          sar: `${item.price}`,
                          onUpdateServicePopup: true,
                        });
                      }}
                      style={styles.serviceDetails}>
                      ({item.price} SAR)
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        this.deleteService(item.id);
                      }}
                      style={{ marginVertical: 5, marginHorizontal: 10 }}>
                      <Image
                        style={{
                          width: 18,
                          height: 18,
                          tintColor: config.Constant.COLOR_TAB,
                        }}
                        resizeMode={'contain'}
                        source={require('../../assets/images/delete.png')}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
              <View style={styles.borderView} />
            </View>
          );
        })}
      </View>
    );
  };
  reviewScreen = () => {
    return (
      <View style={styles.tabView}>
        {config.Constant.USER_DATA.review_list.length < 1 && (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              marginTop: config.Constant.SCREEN_HEIGHT * 0.13,
            }}>
            <Text style={styles.emptyString}>{config.I18N.t('noReviews')}</Text>
          </View>
        )}
        {config.Constant.USER_DATA.review_list.map((item, index) => {
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
                      {moment.utc(item.created_at).local().format('DD MMM, YY')}
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
                    starSize={20}
                    selectedStar={(rating) => { }}
                  />
                </View>
              </View>
              <Text numberOfLines={2} style={styles.reviewTxt}>
                {item.comment}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };
  GetUserData = async () => {
    const formData = new FormData();
    formData.append('id', '1');
    config.Constant.showLoader.showLoader();
    var data = await modules.APIServices.PostApiCall(
      config.ApiEndpoint.GET_PROFILE,
      formData,
    );
    config.Constant.showLoader.hideLoader();
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
        var token = config.Constant.USER_DATA.token;
        config.Constant.USER_DATA = data.data;
        config.Constant.USER_DATA.token = token;
        var userData = this.props.userData;
        if (!!userData && !!userData.userData && !!userData.userData.id) {
          userData.userData = data.data;
          this.props.dispatch(UserDataActions.setUserData(userData.userData));
        }
        this.getArrange();
        this.setState({
          is_online: data.data.is_online == '1' ? true : false,
        });
      } catch (error) { }
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={false}
          translucent
          backgroundColor="transparent"
          barStyle={'light-content'}
        />
        <FastImage
          source={
            !!config.Constant.USER_DATA && !!config.Constant.USER_DATA.image
              ? {
                uri:
                  config.Constant.UsersProfile_Url +
                  '' +
                  config.Constant.USER_DATA.image,
              }
              : require('../../assets/images/no_image.png')
          }
          resizeMode={'cover'}
          style={styles.bannerImg}
        />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <Ripple
            onPress={() => {
              this.props.navigation.pop();
            }}
            style={styles.backBtnView}>
            <Image
              style={{
                width: 20,
                height: 20,
                tintColor: 'white',
                transform: [
                  { rotate: config.Constant.isRTL ? '180deg' : '0deg' },
                ],
              }}
              resizeMode={'contain'}
              source={require('../../assets/images/backICon.png')}
            />
          </Ripple>
          <View style={styles.detailView}>
            <Text style={styles.titleTxt}>
              {!!config.Constant.USER_DATA && !!config.Constant.USER_DATA.name
                ? config.Constant.USER_DATA.name
                : ''}
            </Text>
            <View style={styles.rowView}>
              <Text style={styles.locationTxt}>
                {!!config.Constant.USER_DATA &&
                  !!config.Constant.USER_DATA.address
                  ? config.Constant.USER_DATA.address
                  : ''}
              </Text>
              <Ripple style={{ paddingRight: 13 }}>
                <Image
                  resizeMode={'contain'}
                  style={{ width: 20, height: 20 }}
                //source={require('../../assets/images/heart.png')}
                />
              </Ripple>
            </View>
            <View style={styles.rowView}>
              {!!config.Constant.USER_DATA &&
                !!config.Constant.USER_DATA.review_list &&
                config.Constant.USER_DATA.review_list.length > 0 && (
                  <StarRating
                    disabled={true}
                    fullStar={require('../../assets/images/filledStar.png')}
                    halfStar={require('../../assets/images/icon_halfstar.png')}
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
                    containerStyle={{ height: 25, width: 70 }}
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
          <View
            showsVerticalScrollIndicator={false}
            bounces={false}
            style={styles.bottomScrollView}>
            {!!config.Constant.USER_DATA &&
              (config.Constant.USER_DATA.is_online == '1' ? (
                <View style={styles.onlineView}>
                  <Text style={styles.onlineTxt}>
                    {config.I18N.t('online')}
                  </Text>
                </View>
              ) : (
                <View style={styles.offlineView}>
                  <Text style={styles.offlineTxt}>
                    {config.I18N.t('offline')}
                  </Text>
                </View>
              ))}
            <View style={styles.bottomView}>
              {this.state.currTab != 2 ? (
                <CustomButton
                  btnTxt={this.getBtnName()}
                  onPress={() => {
                    if (this.state.currTab == 1) {
                      this.props.navigation.navigate('EditProfileHome');
                    } else {
                      //return config.I18N.t('addService');
                      this.setState({
                        onServicePopup: true,
                      });
                    }
                  }}
                  containerStyle={styles.btnStyle}
                />
              ) : (
                <View
                  style={[
                    styles.btnStyle,
                    { marginBottom: 15, backgroundColor: 'white' },
                  ]}
                />
              )}
            </View>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ flexGrow: 1, backgroundColor: 'white' }}>
              <CustTabView
                firstscreen={this.serviceScreen()}
                seconscreen={this.aboutScreen()}
                thirdscreen={this.reviewScreen()}
                changeIndex={(currTab) => {
                  this.setState({
                    currTab,
                  });
                }}
              />
            </ScrollView>
          </View>
        </ScrollView>
        <AddService
          visible={this.state.onServicePopup}
          dataSource={this.state.mainCategory}
          mainDataId={this.state.mainDataId}
          mainDataChange={(val) => {
            this.setState({
              subCategory: [],
              mainCatError: '',
            });
            if (!!val) {
              this.state.mainCategory.map((item, index) => {
                if (item.id == val) {
                  this.setState({
                    mainDataId: val,
                    subCategory: item.category,
                    catDataId: 0,
                  });
                }
              });
            }
            this.setState({
              mainDataId: val,
            });
          }}
          dataCatSource={this.state.subCategory}
          catDataId={this.state.catDataId}
          catDataChange={(val) => {
            this.setState({
              catDataId: val,
              catError: '',
            });
          }}
          onPressAdd={() => {
            if (!this.state.mainDataId) {
              this.setState({
                mainCatError: config.I18N.t('selectCat'),
              });
            } else if (!this.state.catDataId) {
              this.setState({
                catError: config.I18N.t('selectSubCat'),
              });
            } else if (!this.state.sar || !parseFloat(this.state.sar)) {
              this.setState({
                sarError: config.I18N.t('fillSar'),
              });
            } else {
              this.saveService(this.state.catDataId, this.state.sar);
              this.setState({
                onServicePopup: false,
                sar: '',
                catDataId: 0,
                mainDataId: 0,
              });
            }
          }}
          onPressClose={() => {
            this.setState({
              onServicePopup: false,
            });
          }}
          sar={this.state.sar}
          onSarChange={(sar) => {
            this.setState({
              sar,
              sarError: '',
            });
          }}
          commission={this.state.commission}
          sarError={this.state.sarError}
          mainCatError={this.state.mainCatError}
          catError={this.state.catError}
        />
        <UpdateService
          visible={this.state.onUpdateServicePopup}
          onPressAdd={() => {
            if (!this.state.sar || !parseFloat(this.state.sar)) {
              this.setState({
                sarError: config.I18N.t('fillSar'),
              });
            } else {
              this.saveService(this.state.catDataId, this.state.sar);
              this.setState({
                onUpdateServicePopup: false,
                sar: '',
                catDataId: 0,
                mainDataId: 0,
              });
            }
          }}
          onPressClose={() => {
            this.setState({
              onUpdateServicePopup: false,
            });
          }}
          sar={this.state.sar}
          onSarChange={(sar) => {
            this.setState({
              sar,
              sarError: '',
            });
          }}
          sarError={this.state.sarError}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userData: state.userData,
});

export default connect(mapStateToProps)(VendorView);
