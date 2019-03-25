import React from 'react'
import {View, Text, SafeAreaView} from 'react-native'

import SearchBar from '../../utils/SearchBar'


import {getHeaderHeight} from '../../utils/Helpers'

const items = [
    1337,
    'janeway',
    {
      lots: 'of',
      different: {
        types: 0,
        data: false,
        that: {
          can: {
            be: {
              quite: {
                complex: {
                  hidden: [ 'gold!' ],
                },
              },
            },
          },
        },
      },
    },
    [ 4, 2, 'tree' ],
];

export default class CenterSearch extends React.Component{

    // static navigationOptions = {
    //     header: { visible: false } // !!! Hide Header
    //   }
    static navigationOptions = {header: null };

    constructor(props){
      super(props)

      this.state = {
        items,
        results: []
      };
    }

    _handleResults(results) {
        // this.setState({ results });
        console.log(results)

        this.setState({ results });
    }

    onHide(results){
      console.log("onHide")

      // console.log(this)
      // navigation.goBack()

      this.props.navigation.goBack()
    }

    onChangeText(text){
      console.log(text)
    }

    onSearch(text){
      console.log(text)
    }

    render(){
        // return(<View><Text>searc</Text></View>)

        let {results} = this.state

        return(
          <SafeAreaView style={{flex:1}}>
                <SearchBar
                  ref={(ref) => this.searchBar = ref}
                  // data={items}
                  handleChangeText={this.onChangeText.bind(this)}
                  handleSearch={this.onSearch.bind(this)}
                  // handleResults={this._handleResults.bind(this)}
                  showOnLoad
                  onHide={this.onHide.bind(this)}
                    />
                    <View style={{flex:1}}>
                      <Text>
                        {/* Result search */}
                      </Text>
                    </View>
                    </SafeAreaView>
                )
    }
}