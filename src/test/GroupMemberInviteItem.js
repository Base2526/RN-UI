import React from 'react'
import {View, 
        Alert, 
        Text, 
        FlatList, 
        ActivityIndicator, 
        TouchableOpacity, 
        TouchableHighlight} from 'react-native'

import SubmitButton from 'react-native-submit-button';

import ImageWithDefault from '../utils/ImageWithDefault'

export default class GroupMemberInviteItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            buttonState: 'normal',
            buttonText:'Add friend'
        }
    }

    componentDidMount() {
        // Animated.timing(this.state.scaleValue, {
        //     toValue: 1,
        //     duration : 600,
        //     delay: this.props.index * 350
        // }).start();

        // console.log(this.props)
    }

    onSubmit = () => {
        console.log('api call')
        setTimeout(() => {
          this.setState({ buttonState: 'success' });
          console.log('api call > onSubmit')

          this.props.handleCallback({id:'566'})
        }, 2000); // if success, else this.setState({ buttonState: 'error' })
    };

    render() {
        // return (
        //     <Animated.View style={{ opacity: this.state.scaleValue }}>
        //         { this.props.children }
        //     </Animated.View>
        // );

        let {profile} = this.props.item

        // console.log(this.props.item)

        return(<View style={{flex:1, 
            height:100, 
            padding:10, 
            marginRight:10,
            backgroundColor:'white', 
            flexDirection:'row',
            alignItems:'center',}}>
            <TouchableHighlight 
                style={{height:60,
                        width: 60,
                        borderRadius: 10}}>
                <ImageWithDefault 
                source={{uri: profile.image_url}}
                style={{width: 60, height: 60, borderRadius: 10, borderColor:'gray', borderWidth:1}}
                />
            </TouchableHighlight>
            <View style={{flex:1, justifyContent:'center', marginLeft:5}}>
                <Text style={{fontSize:18}}>{profile.name}</Text>
            </View>
            <View style={{ position:'absolute', right:0}}>
            <SubmitButton 
                width={100}
                height={40}
                buttonState={this.state.buttonState}
                buttonText={this.state.buttonText}
                onSubmit={this.onSubmit}
                // buttonTextWhenReady={this.state.buttonText}
                onSuccess={()=>{
                    console.log('#1')
                    // this.setState({
                    //     buttonText:'Pending'
                    // })
                }}
                onError={()=>{
                    console.log('#2')
                }}/>
            </View>
            </View>)
    }
}