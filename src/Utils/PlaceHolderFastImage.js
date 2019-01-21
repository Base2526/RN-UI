import React, { Component } from 'react'
import { ActivityIndicator, View, StyleSheet } from 'react-native'
// import { Images, Metrics } from '../Themes'
import FastImage from 'react-native-fast-image'

import Constant from '../Utils/Constant'

// https://gist.github.com/codingwaysarg/1115a6365eff654800b9dd3428104512
export default class PlaceHolderFastImage extends Component {
  constructor(props){
    super(props)

    this.state = {
      loaded: false,
      style: StyleSheet.flatten(props.style)
    }
  }

  onError(error){
    console.log('onError', error)
  }
  
  onLoadEnd(){
    console.log('onLoadEnd')
    this.setState({loaded: true})
  }

  render() {
    const top = (this.state.style.height / 2) - 15
    const left = this.state.style.width == 'auto' ? (Metrics.screenWidth / 2 - 30) : (this.state.style.width / 2 - 15)

    console.log(this.props.source)
    return <View style={this.props.style}>
      {
        !this.state.loaded &&
        <View>
          <FastImage 
            source={{uri:Constant.DEFAULT_AVATARSOURCE_URI}}
            style={this.props.style}
          />
          <View style={{
            position:'absolute',
            top: top,
            left: left}}>
            <ActivityIndicator size="large" color="#ccc" />
          </View>
        </View>
      }
      <FastImage 
        source={this.props.source}
        // source={{
        //     uri: 'https://previews.123rf.com/images/irwanjos/irwanjos1405/irwanjos140500015/28297819-funny-cat-cartoon.jpg',
        //   }}
        style={this.props.style}
        onLoadEnd={this.onLoadEnd.bind(this)}
        // onError={this.onError.bind(this)}
        // onLoad={()=>{
        //     console.log('onLoad')
        // }}
        onLoadStart={()=>console.log('onLoadStart')}
      onLoad={()=>console.log('onLoad')}
      // onLoadEnd={()=>console.log('onLoadEnd')}
      onError={()=>console.log('onError')}
      />
    </View>
  }
}