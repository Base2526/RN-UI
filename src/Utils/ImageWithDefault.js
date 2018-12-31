import React from 'react'

import * as Progress from 'react-native-progress';
import FastImage from 'react-native-fast-image'
import { createImageProgress } from 'react-native-image-progress';

import Constant from '../Utils/Constant'

let Image = createImageProgress(FastImage);

export default class ImageWithDefault extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        failed: false,
        default: {uri:Constant.DEFAULT_AVATARSOURCE_URI}
      };
    }
    _onError = (e) => {
        console.log(e)
        this.setState({ failed: true });
    }
    render() {
    
      // imageStyle
      const defaultImage = <Image source={this.state.default} imageStyle={this.props.style}/>;

      if (this.state.failed) return defaultImage;
  
      return (
        // <ProgressImage
        //   {...this.props}
        //   onError={this._onError}
        //   renderIndicator={_ => defaultImage}
        // />
        <Image
            source={this.props.source}
            // style={{justifyContent: 'center', alignItems: 'center',}}
            imageStyle={this.props.style}
            indicator={Progress.Pie}
            indicatorProps={{
                size: 20,
                borderWidth: 0,
                color: 'rgba(150, 150, 150, 1)',
                unfilledColor: 'rgba(200, 200, 200, 0.2)',
            
            }}
            onError={(e) => { 
                this._onError(e)
            }}
        />
      );
    }
}

/*
 Ex. https://github.com/oblador/react-native-image-progress/issues/22#issuecomment-296310806

 <ImageWithDefault 
    default={{uri:'https://cdn-images-1.medium.com/max/1600/1*-CY5bU4OqiJRox7G00sftw.gif'}}
    source={{uri:'https://cdn-images-1.medium.com/max/1600/1*-CY5bU4OqiJRox7G00sftwU.gif'}}
    style={{width: 60, height: 60, borderRadius: 10}}
    />
*/