import React, { Component } from 'react'
import { ActivityIndicator, View, StyleSheet, Image} from 'react-native'
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
    // console.log('onError', error)
  }
  
  onLoadEnd(){
    // console.log('onLoadEnd')
    this.setState({loaded: true})
  }

  render() {
    // const top = (this.state.style.height / 2) - 15
    // const left = this.state.style.width == 'auto' ? (Metrics.screenWidth / 2 - 30) : (this.state.style.width / 2 - 15)

    // console.log(this.props.resizeMode)
    return <View style={{}}>
            <View 
              style={this.state.loaded ? {width: 0, height: 0} : {} } >
              <Image 
                source={Constant.DEFAULT_AVATARSOURCE_URI}
                style={this.props.style}
              />
              <View style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center'}}>
                {!this.state.loaded && <ActivityIndicator size="small" color="#ccc" />}
              </View>
            </View>
            <FastImage 
              source={this.props.source}
              // source={{
              //     uri: 'https://previews.123rf.com/images/irwanjos/irwanjos1405/irwanjos140500015/28297819-funny-cat-cartoon.jpg',
              //   }}
              style={[this.props.style, this.state.loaded ? {} : {width: 0, height: 0}]} 
              onLoadEnd={this.onLoadEnd.bind(this)}
              // onError={this.onError.bind(this)}
              // onLoad={()=>{
              //     console.log('onLoad')
              // }}
              resizeMode={this.props.resizeMode=== undefined? FastImage.resizeMode.contain : this.props.resizeMode}
              onLoadStart={()=>{
                // console.log('onLoadStart')
              }}
              onLoad={()=>{
                // console.log('onLoad')
              }}
              // onLoadEnd={()=>console.log('onLoadEnd')}
              onError={()=>{
                console.log('onError')
              }}
            />
          </View>
  }
}