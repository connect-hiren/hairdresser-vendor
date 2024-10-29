import {Platform, StyleSheet} from 'react-native';
import config from '../../config';
import {getStatusBarHeight} from '../../Util/Utilities';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  bannerImg: {
    width: config.Constant.SCREEN_WIDTH,
    height: config.Constant.SCREEN_HEIGHT / 2,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: -1,
  },
  backBtnView: {
    paddingHorizontal: config.Constant.SCREEN_WIDTH * 0.05,
    paddingVertical: 30,
    position: 'absolute',
    top:Platform.OS=='android'? 20:10,
    left: 0,
    zIndex:10
  },
  bottomView: {
    width: config.Constant.SCREEN_WIDTH,
    backgroundColor: 'white',
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    paddingTop: 0,
    alignItems: 'center',
  },
  bottomScrollView: {
    width: config.Constant.SCREEN_WIDTH,
    backgroundColor: config.Constant.COLOR_TRANSPARENT,
    marginTop: 10,
  },
  onlineView: {
    backgroundColor: config.Constant.COLOR_LIGHT_GREEN,
    position: 'absolute',
    right: 20,
    top: -11,
    borderRadius: 30,
    paddingVertical: 3,
    paddingHorizontal: 10,
    zIndex: 10,
  },
  onlineTxt: {
    color: config.Constant.COLOR_WHITE,
    fontSize: 13,
    fontFamily: config.Constant.Font_Regular,
  },
  detailView: {
    width: '90%',
    padding: 10,
    backgroundColor: config.Constant.COLOR_TRANSPARENT,
    marginTop: config.Constant.SCREEN_HEIGHT * 0.22,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  titleTxt: {
    fontFamily: config.Constant.Font_Semi_Bold,
    fontSize: 20,
    color: config.Constant.COLOR_WHITE,
    textAlign:'left'

  },
  locationTxt: {
    fontFamily: config.Constant.Font_Regular,
    fontSize: 14,
    color: config.Constant.COLOR_WHITE,
    marginVertical: 5,
    flex:1,
    textAlign:'left'
  },
  profileReviewTxt: {
    fontFamily: config.Constant.Font_Italic_LIGHT,
    fontSize: 14,
    color: config.Constant.COLOR_WHITE,
    marginLeft: 60,
    marginTop: 0,
    flex: 1,
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputStyle: {
    padding: 0,
    flex: 1,
    textAlign: config.Constant.isRTL ? 'right' : 'left',
  },
  btnStyle: {width: '85%', marginTop: 30, marginBottom: 15},
  descTxt: {
    fontSize: 16,
    fontFamily: config.Constant.Font_Regular,
    color: config.Constant.COLOR_BLACK,
    letterSpacing: 0.98,
    textAlign:'left',
    width:'100%'
  },
  serviceRowView: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 10,
    alignItems: 'center',
  },
  serviceHeader: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: config.Constant.Font_Semi_Bold,
    color: config.Constant.COLOR_TAB,
    letterSpacing: 1.12,
  },
  serviceTitle: {
    flex: 1,
    paddingRight: 10,
    fontSize: 16,
    fontFamily: config.Constant.Font_Regular,
    color: config.Constant.COLOR_BLACK,
    letterSpacing: 1.12,
    textAlign:'left'

  },
  serviceDetails: {
    fontSize: 14,
    fontFamily: config.Constant.Font_Regular,
    color: config.Constant.COLOR_GREEN,
    letterSpacing: 0.98,
  },
  tabView: {
    backgroundColor: 'white',
    paddingVertical: 20,
    width: '90%',
    alignSelf: 'center',
  },
  reviewTxt: {
    fontSize: 13,
    fontFamily: config.Constant.Font_LIGHT,
    color: config.Constant.COLOR_BLACK,
    letterSpacing: 0.98,
    textAlign: 'left',
  },
  timeTxt: {
    fontSize: 12,
    fontFamily: config.Constant.Font_LIGHT,
    color: config.Constant.COLOR_GREY,
    letterSpacing: 0.98,marginTop:10,
    textAlign: 'center',
  },
  reviewName: {
    fontSize: 15,
    flex: 1,
    fontFamily: config.Constant.Font_Semi_Bold,
    color: config.Constant.COLOR_BLACK,
    letterSpacing: 0.98,
    textAlign: 'left',
    marginBottom: 5,
  },
  reviewBox: {
    backgroundColor: config.Constant.COLOR_ULTRA_LIGHT_GREY,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  borderView:{
    width:'100%',
    alignSelf:'center',
    borderBottomWidth:1,
    marginVertical:5,
    borderColor:config.Constant.COLOR_BORDER_COLOR
  },
  emptyString: {
    fontFamily: config.Constant.Font_Roboto_Italic,
    fontSize: 18,
    width: config.Constant.SCREEN_WIDTH * 0.8,
    textAlign:'center',
    alignSelf:'center',
    color: config.Constant.COLOR_DARK_GREY,
  },
  offlineView: {
    backgroundColor: 'red',
    position: 'absolute',
    right: 20,
    top: -11,
    borderRadius: 30,
    paddingVertical: 3,
    paddingHorizontal: 10,
    zIndex: 10,
  },
  offlineTxt: {
    color: config.Constant.COLOR_WHITE,
    fontSize: 13,
    fontFamily: config.Constant.Font_Regular,
  },
});
