import {Platform, StyleSheet} from 'react-native';
import config from '../../config';
import {getStatusBarHeight} from '../../Util/Utilities';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',

    backgroundColor: config.Constant.COLOR_WHITE,
  },
  rowContainer: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: getStatusBarHeight(),
    paddingBottom: 20,
    paddingHorizontal: config.Constant.SCREEN_WIDTH * 0.05,
    backgroundColor: 'white',
    shadowColor: config.Constant.COLOR_GREY,
    shadowOffset: {
      width: 0.5,
      height: 0.5,
    },
    shadowRadius: 0.5,
    shadowOpacity: 0.4,
    elevation: 2,
  },
  smallIcon: {
    width: 20,
    height: 20,
  },
  headerTitle: {
    fontFamily: config.Constant.Font_Bold,
    fontSize: 18,
    color: config.Constant.COLOR_BLACK,
    textAlign: 'center',
    letterSpacing: 1.26,
    alignSelf: 'center',
  },
  notificationView: {
    width: config.Constant.SCREEN_WIDTH * 0.9,
    alignSelf: 'center',
    marginVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  rowViewBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  rowTitle: {
    fontFamily: config.Constant.Font_Bold,
    fontSize: 16,
    color: config.Constant.COLOR_BLACK,
    flex: 1,
    textAlign:'left',
    letterSpacing: 0.98,
  },
  rowStatus: {
    fontFamily: config.Constant.Font_Semi_Bold,
    fontSize: 14,
    color: config.Constant.COLOR_MONEY_GREEN,
    letterSpacing: 0.98,
    textAlign:'left',

  },
  rowDesc: {
    fontFamily: config.Constant.Font_LIGHT,
    textAlign:'left',
    fontSize: 12,
    color: config.Constant.COLOR_BLACK,
    letterSpacing: 0.84,
    flex: 1,
    paddingRight: 10,
  },
  rowTime: {
    fontFamily: config.Constant.Font_Roboto_Italic,
    fontSize: 14.5,
    color: config.Constant.COLOR_YELLOW,
    letterSpacing: 0,
  },
  viewLine: {
    height: '100%',
    width: 2,
  },
  catView: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: '95%',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  wrapTxtRow: {
    fontFamily: config.Constant.Font_Regular,
    fontSize: 15,
    letterSpacing: 0.84,
    color: config.Constant.COLOR_WHITE,
    marginRight: 10,
    paddingTop: 2,
    paddingBottom: 1.5,
    maxWidth: config.Constant.SCREEN_WIDTH * 0.67,
  },
  wrapTxtRemove: {
    fontFamily: config.Constant.Font_Bold,
    fontSize: 15,
    color: config.Constant.COLOR_WHITE,
    marginHorizontal: 5,
  },
  wrapRow: {
    flexDirection: 'row',
    borderColor: config.Constant.COLOR_TAB,
    backgroundColor: config.Constant.COLOR_TAB,
    marginLeft: 15,
    marginVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 50,
    alignItems: 'center',
  },
  deviderLine: {
    height: '100%',
    width: 2,
    marginHorizontal: 5,
    backgroundColor: config.Constant.COLOR_WHITE,
  },
  borderView:{
    width:'85%',
    alignSelf:'center',
    borderBottomWidth:1,
    borderColor:config.Constant.COLOR_BORDER_COLOR
  },
});
