const Header = props => (
    <View style={{justifyContent: 'flex-end'}}>
      <Text style={{fontFamily: 'dosis-bold', color: 'white', fontSize: 25}}>COMPANY LOGO</Text>
    </View>
  );
  
export const ImageHeader = props => {
    console.log('ImageHeader props', props);
    return(
      <View style={{height: 10*vh, justifyContent: 'flex-end', padding: 5, backgroundColor: 'transparent'}}>
        <Image
          style={{width, height: 10*vh, position: 'absolute', top: 0, left: 0}}
          source={require('./assets/images/bg-header.png')}
          resizeMode="cover"
        />
        <Header {...props} style={{ backgroundColor: 'transparent' }}/>
      </View>
    );
  }
  