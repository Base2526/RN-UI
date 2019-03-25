import * as React from "react"
import {Text, 
        View, 
        FlatList, 
        SectionList, 
        TouchableOpacity,
        Dimensions } from "react-native"
import FastImage from 'react-native-fast-image'

const sections = [
  {
    title: "Brand and Business",
    key: "vegetables",
    data: [
     {
       key: "vegetables",
       list: [
          {
            name: "Carrot",
            color: "Orange",
          },
          {
            name: "Cabbage",
            color: "Purple",
          },{
            name: "Carrot",
            color: "Orange",
          },
          {
            name: "Cabbage",
            color: "Purple",
          },{
            name: "Carrot",
            color: "Orange",
          },
          {
            name: "Cabbage",
            color: "Purple",
          }
        ],
      },
    ],
  },
  {
    title: "Enterainment",
    key: "fruits",
    data: [
      {
        key: 'fruits',
        list: [
          {
            name: "Strawberry",
            color: "Red",
          },
          {
            name: "Blueberry",
            color: "Blue",
          },{
            name: "Apple",
            color: "Green",
          },
          {
            name: "Blueberry",
            color: "Blue",
          },
          {
            name: "Banana",
            color: "Yellow",
          },
          {
            name: "Blueberry",
            color: "Blue",
          },
          {
            name: "Blueberry",
            color: "Blue",
          },
        ],
      },
    ],
  },
  {
    title: "Finance",
    key: "fruits2",
    data: [
      {
        key: 'fruits2',
        list: [
          {
            name: "Banana",
            color: "Yellow",
          },
          {
            name: "Strawberry",
            color: "Red",
          },
          {
            name: "Blueberry",
            color: "Blue",
          },
          {
            name: "Blueberry",
            color: "Blue",
          },
          {
            name: "Blueberry",
            color: "Blue",
          },{
            name: "Apple",
            color: "Green",
          },{
            name: "Apple",
            color: "Green",
          }

        ],
      },
    ],
  },
]

const formatData = (data, numColumns) => {
  // เป้นการ ลบ item ที่มี ​field ออกทั้งหมด เพราะว่าเรารองรับการ orientation srceen ด้วย
  data = data.filter(function(item){
    return !('empty' in item);
  }).map((item)=>{
    return item;
  });

  const numberOfFullRows = Math.floor(data.length / numColumns);

  let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
  while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
    data.push({ name: `blank-${numberOfElementsLastRow}`, empty: true });
    numberOfElementsLastRow++;
  }

  return data;
};

export default class ListCenterPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      renderContent: false,
      orientation:'PORTRAIT',
      numColumns:3
    }
  }

  componentDidMount() {
    setTimeout(() => {this.setState({renderContent: true})}, 0);
  }

  onLayout(e) {
    const {width, height} = Dimensions.get('window')
    // console.log(width, height)

    if(width<height){
      this.setState({orientation:'PORTRAIT', numColumns:3})
    }else{
      this.setState({orientation:'LANDSCAPE', numColumns:5})
    }
  }

  renderSection = ({ item }) => {
    return (
      <FlatList
        key = {this.state.orientation}
        /*  เราต้องมีการคำนวณ item ให้เต็มแต่ละแถว  */
        data = {formatData(item.list, this.state.numColumns)}
        numColumns={this.state.numColumns}
        renderItem={this.renderListItem}
        keyExtractor={this.keyExtractor}
        extraData={this.state}
        contentContainerStyle={{flexGrow: 2, justifyContent: 'center'}}
      />
    )
  }

  renderSectionHeader = ({ section }) => {
    return (<View>
              <Text style={{padding:5}}>{section.title}</Text>
              <View
                style={{
                  height: .5,
                  width: "100%",
                  backgroundColor: "#CED0CE",
                }}
              />
            </View>)
  }

  renderListItem = ({ item }) => {
    if ('empty' in item) {
      return <View style={{height: 120, 
        width: 100, 
        flex:1,
        // borderColor: "green", 
        // borderWidth: 1, 
        justifyContent:'center', 
        alignItems:'center',
        backgroundColor: 'transparent',}} />;
    }

    // console.log(item)
    return (
      <View style={{flex:1,
                    justifyContent:'center', 
                    alignItems:'center',
                    // backgroundColor:'red',
                    padding:10
                    }}>
        <TouchableOpacity 
            onPress={()=>{
              this.props.params.navigation.navigate("ApplicationDetailPage")
            }}>
            <FastImage
                style={{width: 50, 
                        height: 50, 
                        borderRadius: 25,
                        }}
                source={{
                uri: 'https://unsplash.it/400/400?image=1',
                headers:{ Authorization: 'someAuthToken' },
                priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
            />
        </TouchableOpacity>
        <View style={{justifyContent:'center', paddingTop:5}}>
          <Text >{item.name}</Text>
        </View>
      </View>
    )
  }

  keyExtractor = (item) => {
    return item.name
  }

  render () {
    let {
      renderContent
    } = this.state;

    return (
      <View style={{flex:1}} onLayout={this.onLayout.bind(this)} >
      {
        renderContent &&
        <SectionList
          sections={sections}
          renderSectionHeader={this.renderSectionHeader}
          renderItem={this.renderSection}
          // style={{justifyContent:'space-between'}}
          extraData={this.state}
        />
      }
      </View>
    )

  }
}