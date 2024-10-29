import {Alert} from 'react-native';
import config from '../config';
import modules from './index';

var dropDownAlert = '';

const setDropDownRef = (ref) => {
  dropDownAlert = ref;
};

const showAlert = (type, title, message, data, duration, ok) => {
  if (type === 'custom') {
    dropDownAlert.alertWithType(type, title, message, data, duration);
  } else {
    if (type == 'error') {
      //Alert.alert(config.I18N.t('error'),message)
      !modules.ErrorAlert.isVisible() && modules.ErrorAlert.getRef({
        title: title ? title :config.I18N.t('error'),
        message: message,
        ok: ok,
        negativeBtnTxt: '',
        positiveBtnTxt: '',
        extraData: {},
        onPressPositiveBtn: async (data, pressOK) => {
          if (pressOK) {
            //this.updateData(false);
          }
        },
      });
    } else if (type == 'successKey') {
      //Alert.alert(config.I18N.t('error'),message)
      !modules.ErrorAlert.isVisible() && modules.ErrorAlert.getRef({
        title: title ? title :config.I18N.t('success'),
        message: message,
        ok: ok,
        negativeBtnTxt: '',
        positiveBtnTxt: '',
        extraData: {},
        onPressPositiveBtn: async (data, pressOK) => {
          if (pressOK) {
            //this.updateData(false);
          }
        },
      });
    } else {
      dropDownAlert.alertWithType(type, title, message);
    }
  }
};

export default {
  setDropDownRef,
  showAlert,
};
