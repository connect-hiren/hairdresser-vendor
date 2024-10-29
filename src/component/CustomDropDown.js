import React from 'react';
import {StyleSheet, TouchableOpacity, Image, Text, View} from 'react-native';

// import Dropdown  from 'react-native-material-dropdown';
import RNPickerSelect, {defaultStyles} from 'react-native-picker-select';

import {Chevron} from 'react-native-shapes';
import config from '../config';
export default class CustomDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {currInd: 0};
    this.setState({
      update: [],
    });
  }
  componentDidMount() {}

  render() {
    const {
      containerStyle,
      data,
      placeholder,
      onPress,
      Value,
      onDonePress,
    } = this.props;

    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.container, {...containerStyle}]}>
        <RNPickerSelect
          placeholder={{
            label: placeholder,
            value: 0,
            color: 'grey',
          }}
          items={data}
          onValueChange={(value) => {
            this.props.onChange(value);
          }}
          style={{
            // inputAndroid: {
            //   backgroundColor: config.Constant.COLOR_WHITE,
            // },
            ...pickerSelectStyles,
            iconContainer: {
              top: 20,
              right: 10,
            },
            placeholder: {
              color: config.Constant.COLOR_GREY,
              fontSize: 18,
              fontFamily:config.Constant.Font_Regular,
              //fontWeight: 'bold',
            },
          }}
          onDonePress={!!onDonePress ? onDonePress : () => {}}
          value={Value}
          useNativeAndroidPickerStyle={false}
          //   textInputProps={{underlineColorAndroid: 'cyan'}}
          Icon={() => {
            return (
              <Chevron
                style={{marginTop: -5}}
                size={1.5}
                color={config.Constant.COLOR_TAB}
              />
            );
          }}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: config.Constant.COLOR_INPUT,
    borderBottomWidth: 0,
    marginBottom: 20,
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 100,
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    fontFamily: config.Constant.Font_Regular,
    borderRadius: 4,
    color: 'black',
    height: 40,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    fontFamily: config.Constant.Font_Regular,
    borderRadius: 4,
    color: 'black',
    height: 40,
    paddingVertical: 0,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
