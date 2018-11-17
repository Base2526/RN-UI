import * as React from "react"
import { Text, View, FlatList, SectionList, TouchableOpacity } from "react-native"

import FastImage from 'react-native-fast-image'

const sections = [
  {
    title: "Vegetables",
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
          },{
            name: "Carrot",
            color: "Orange",
          },
          {
            name: "Cabbage",
            color: "Purple",
          },
        ],
      },
    ],
  },
  {
    title: "Fruits",
    key: "fruits",
    data: [
      {
        key: 'fruits',
        list: [
          {
            name: "Apple",
            color: "Green",
          },
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
          },{
            name: "Apple",
            color: "Green",
          },
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
          },{
            name: "Apple",
            color: "Green",
          },
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
          },{
            name: "Apple",
            color: "Green",
          },
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
        ],
      },
    ],
  },
  {
    title: "Fruits 2",
    key: "fruits2",
    data: [
      {
        key: 'fruits2',
        list: [
          {
            name: "Apple",
            color: "Green",
          },
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
          },{
            name: "Apple",
            color: "Green",
          },
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
          },{
            name: "Apple",
            color: "Green",
          },
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
          },{
            name: "Apple",
            color: "Green",
          },
          {
            name: "Banana",
            color: "Yellow",
          },
          {
            name: "Strawberry",
            color: "Red",
          },
        ],
      },
    ],
  },
]

export default class CenterPage extends React.Component<{}, {}> {
  renderSection = ({ item }) => {
    return (
      <FlatList
        data={item.list}
        numColumns={3}
        renderItem={this.renderListItem}
        keyExtractor={this.keyExtractor}
      />
    )
  }

  renderSectionHeader = ({ section }) => {
    return <Text>{section.title}</Text>
  }

  // import FastImage from 'react-native-fast-image'
  renderListItem = ({ item }) => {
      return (
        <View style={{height: 100, width: 100, borderColor: "green", borderWidth: 1, justifyContent:'center', alignItems:'center' }}>
          {/* <Text>{item.name}</Text>
          <Text>{item.color}</Text> */}
           <TouchableOpacity 
                              style={{height:80,
                                      width: 80,
                                      borderRadius: 10,
                                      }}
                                onPress={()=>{
                                  this.props.params.navigation.navigate("ApplicationDetailPage")
                                }}>
                              <FastImage
                                  style={{width: 80, height: 80, borderRadius: 10}}
                                  source={{
                                  uri: 'https://unsplash.it/400/400?image=1',
                                  headers:{ Authorization: 'someAuthToken' },
                                  priority: FastImage.priority.normal,
                                  }}
                                  resizeMode={FastImage.resizeMode.contain}
                              />
                    </TouchableOpacity>
        </View>
      )
    }

  keyExtractor = (item) => {
    return item.name
  }

  render () {
    return (
      <SectionList
        sections={sections}
        renderSectionHeader={this.renderSectionHeader}
        renderItem={this.renderSection}
        // style={{justifyContent:'space-between'}}
      />
    )

  }
}