import {StyleSheet} from 'react-native';
import config from '../../config';
import {getStatusBarHeight} from '../../Util/Utilities';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleTxt: {
    textAlign: 'center',
    fontSize: 27,
    fontFamily: config.Constant.Font_Bold,
    marginTop: 20,
    marginBottom: 65.52,
    color: config.Constant.COLOR_BLACK,
  },
  menuIcon: {
    top: 0,
    left: 0,
    width: config.Constant.SCREEN_WIDTH * 0.26,
    height: config.Constant.SCREEN_WIDTH * 0.26,
    //borderBottomStartRadius: 50,
    //borderBottomEndRadius: 30,
    //borderTopLeftRadius: 30,
    //backgroundColor: config.Constant.COLOR_TRANSPARENT,
    justifyContent: 'center',
    alignContent: 'center',
  },
  menuView: {
    //width: config.Constant.SCREEN_WIDTH,
    //backgroundColor: config.Constant.COLOR_TAB,
    opacity: 0.95,
    //position: 'absolute',
    justifyContent: 'center',
    alignContent: 'center',
    paddingBottom: 20,
    marginTop: -10,
    marginHorizontal: -20,
    //borderBottomRightRadius: 180,
    //borderBottomLeftRadius: 180,
  },
  iconImg: {
    width: 60,
    height: 60,
    marginLeft: 20,
    marginTop: 10,
    tintColor: config.Constant.COLOR_WHITE,
  },
  menuIconImg: {
    width: 60,
    height: 60,
    alignSelf: 'center',
    marginTop: 50,
    zIndex: 3,
    tintColor: config.Constant.COLOR_WHITE,
  },
  logoutIconImg: {
    width: 40,
    height: 40,
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 10,
    zIndex: 3,
    tintColor: config.Constant.COLOR_WHITE,
    transform: [{rotate: '180deg'}],
  },
  menuOptionView: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  menuTitleTxt: {
    fontFamily: config.Constant.Font_Semi_Bold,
    fontSize: 22,
    color: config.Constant.COLOR_WHITE,
  },
  dialogStyle: {
    backgroundColor: config.Constant.COLOR_TRANSPARENT,
    borderRadius: 0,
    maxHeight: config.Constant.SCREEN_HEIGHT * 0.95,
    paddingTop: 10,
  },
  dialogContent: {
    backgroundColor: config.Constant.COLOR_TRANSPARENT,
    width: config.Constant.SCREEN_WIDTH,
    alignSelf: 'center',
    paddingBottom: 0,
    shadowColor: config.Constant.COLOR_GREY,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    height: config.Constant.SCREEN_HEIGHT * 0.75,
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: 12,
  },
  headerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop:20
  },
  headerBorderStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 60,
    alignSelf: 'flex-start',
    marginBottom: 20,
    marginTop: 5,
    marginLeft: config.Constant.SCREEN_WIDTH * 0.05,
    borderBottomWidth: 1.5,
    borderBottomColor: config.Constant.COLOR_TAB,
  },
  descTitle: {
    fontSize: 16,
    fontFamily: config.Constant.Font_Regular,
    color: config.Constant.COLOR_BLACK,
    textAlign: 'left',
    flex: 1,
    letterSpacing: 1.12,
  },
  tabView: {
    backgroundColor: 'white',
    paddingVertical: 0,
    width: '95%',
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
    letterSpacing: 0.98,
    marginTop:10,
    textAlign: 'center',
  },
  menuIconContainer: {
    zIndex: 10,
    width: config.Constant.SCREEN_WIDTH * 0.26,
    height: config.Constant.SCREEN_WIDTH * 0.26,
    position: 'absolute',
    top: 0,
    left: 0,
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
  borderView: {
    width: '100%',
    alignSelf: 'center',
    borderBottomWidth: 1,
    marginVertical: 5,
    borderColor: config.Constant.COLOR_BORDER_COLOR,
  },
  serviceRowView: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 10,
    alignItems: 'center',
  },
  incomeRowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  incomeTxt: {
    fontSize: 16,
    color: 'black',
    textAlign: 'left',
    fontFamily: config.Constant.Font_Regular,
    letterSpacing: 1.12,
  },
  userName: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    fontFamily: config.Constant.Font_Semi_Bold,
    letterSpacing: 1.12,
  },
  profileReviewTxt: {
    fontSize: 12,
    color: config.Constant.COLOR_GREY,
    textAlign: 'center',
    fontFamily: config.Constant.Font_Roboto_Light_Italic,
    letterSpacing: 0.9,
    marginTop:5,
  },
  onlineView: {
    fontSize: 16,
    color: 'black',
    textAlign: 'right',
    fontFamily: config.Constant.Font_Regular,
    letterSpacing: 1.12,
  },
  amoutView: {
    fontSize: 27,
    color: config.Constant.COLOR_TAB,
    textAlign: 'left',
    fontFamily: config.Constant.Font_Semi_Bold,
    letterSpacing: 1.89,
  },
  profileIcon: {
    width: 115,
    height: 115,
    borderRadius: 100,
  },
  profileBorder: {
    width: 130,
    height: 130,
    borderColor: config.Constant.COLOR_PINK_ROUND,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    alignSelf: 'center',
    marginTop:-100

  },
  emptyString: {
    fontFamily: config.Constant.Font_Roboto_Italic,
    fontSize: 18,
    width: config.Constant.SCREEN_WIDTH * 0.8,
    textAlign:'center',
    alignSelf:'center',
    color: config.Constant.COLOR_DARK_GREY,
  },
});
