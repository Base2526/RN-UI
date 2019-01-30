import React from 'react'
import {View, 
    Text, 
    SafeAreaView,
    TouchableOpacity} from 'react-native'

import Svg,{
    Circle,
    Ellipse,
    G,
    // Text,
    TSpan,
    TextPath,
    Path,
    Polygon,
    Polyline,
    Line,
    Rect,
    Use,
    Image,
    Symbol,
    Defs,
    LinearGradient,
    RadialGradient,
    Stop,
    ClipPath,
    Pattern,
    Mask,
    } from 'react-native-svg';

export default class TestSVG extends React.Component{
    render(){
        return(<View style={{width:this.props.width, height:this.props.height}}>
                    <Svg viewBox="0 0 100 100" width={this.props.width} height={this.props.height}>
                      <Defs>
                        <Pattern id="img" patternUnits="userSpaceOnUse" width={this.props.width} height={this.props.height}>
                          <Image
                              // x="20"
                              // y="20"
                              // width="100"
                              // height="100"
                              // href={require('./image.jpg')}

                              // 
                              href={{uri:this.props.image_uri}}
                              x="-25" width="150" height="100"
                            />
                        </Pattern>
                      </Defs>
                      <Polygon 
                        points="49 2 94 24 94 74 49 98 4 74 4 24" 
                        fill="url(#img)" 
                        stroke="#ADADAD"
                        strokeWidth={this.props.strokeWidth === undefined ? 5 : this.props.strokeWidth}
                        strokeLinejoin='round'
                        // fill="yellow"
                        />
                    </Svg>
                </View>)
    }
}