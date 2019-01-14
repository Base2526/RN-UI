import {View} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';

export const ActionIcon = props => {
    const {color = "#FFFFFF", name, style = {}} = props;
  
    return (
      <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        <Icon style={{color, ...style}} ios={name} android={name} /> 
      </View>
    );
  };