import React , { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class FacebookTabBar extends Component {

  static defaultProps={
    tabNames : [],
    tabIcons : []
  };

  static propTypes={
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
    tabNames: React.PropTypes.array,
    tabIcons: React.PropTypes.array,
  }

  componentDidMount() {
    this._listener = this.props.scrollValue.addListener(({value})=>{
        this.props.tabIcons.forEach((icon,i)=>{
          var progress = Math.min(1, Math.abs(value - i));
          icon.setNativeProps({
            style: {
              color: this.iconColor(progress)
            }
          });
        });
    });
  }

  //color between rgb(59,89,152) and rgb(204,204,204)
  iconColor(progress) {
   // console.log(progress);
    const red = 59 + (204 - 59) * progress;
    const green = 89 + (204 - 89) * progress;
    const blue = 152 + (204 - 152) * progress;
    return `rgb(${red}, ${green}, ${blue})`;
  }

  render() {
    //console.log(this.props.tabs);
    return <View style={[styles.tabs, this.props.style, ]}>
      {this.props.tabs.map((tab, i) => {
        return <TouchableOpacity key={tab} onPress={() => this.props.goToPage(i)} style={styles.tab}>
                <Icon
                  name={tab}
                  size={30}
                  color={this.props.activeTab === i ? 'rgb(59,89,152)' : 'rgb(204,204,204)'}
                  ref={(icon) => { this.props.tabIcons[i] = icon; }}
                />
                <Text>{this.props.tabNames[i]}</Text>
          </TouchableOpacity>;
      })}
    </View>
  }
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 4,
  },
  tabs: {
    height: 58,
    flexDirection: 'row',
    paddingTop: 5,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
});
