import 'react-native-gesture-handler';
import React from 'react';
import {Text, TextInput} from 'react-native';

import RootComponent from './src/component/RootComponent';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/lib/integration/react';
import MainNavigator from './src/navigator/MainNavigator';
import Store from './src/Redux/store';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
export default class App extends React.Component {
  constructor(props) {
    //console.log(props, "app props")
    super(props);
  }
  persistor = persistStore(Store);

  componentDidMount() {
     // Override Text scaling
     if (Text.defaultProps) {
      Text.defaultProps.allowFontScaling = false;
    } else {
      Text.defaultProps = {};
      Text.defaultProps.allowFontScaling = false;
    }

    // Override Text scaling in input fields
    if (TextInput.defaultProps) {
      TextInput.defaultProps.allowFontScaling = false;
    } else {
      TextInput.defaultProps = {};
      TextInput.defaultProps.allowFontScaling = false;
    }
    // PushNotification.configure({
    //   onNotification: (notification) => {
    //     if (!!notification.data && notification.data.order_id) {
    //       // this.props.navigation.navigate('OrderDetails', {
    //       //   order_id: notification.data.order_id,
    //       // });
    //     } else {
    //       // this.props.navigation.navigate('Notification');
    //     }
    //     notification.finish(PushNotificationIOS.FetchResult.NoData);
    //   },
    // });
  }

  render() {
    return (
      <Provider store={Store}>
        <PersistGate persistor={this.persistor}>
          <RootComponent>
            <MainNavigator />
          </RootComponent>
        </PersistGate>
      </Provider>
    );
  }
}
