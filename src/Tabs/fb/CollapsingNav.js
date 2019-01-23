import React, {Component} from "react";
import {Animated, 
        Dimensions, 
        Platform, 
        Text, 
        View,
        SafeAreaView} from 'react-native';
import {Body, Header, List, ListItem as Item, ScrollableTab, Tab, Tabs, Title} from "native-base";

import ScrollableTabView, {ScrollableTabBar, DefaultTabBar} from 'react-native-scrollable-tab-view';

import FriendsPage from '../CONTACTS/FindFriendPage'
import GroupsPage from '../CONTACTS/GroupsPage'
import ClasssPage from '../CONTACTS/ClasssPage'

const NAVBAR_HEIGHT = 56;
const {width: SCREEN_WIDTH} = Dimensions.get("window");
const COLOR = "rgb(45,181,102)";
const TAB_PROPS = {
  tabStyle: {width: SCREEN_WIDTH / 2, backgroundColor: COLOR},
  activeTabStyle: {width: SCREEN_WIDTH / 2, backgroundColor: COLOR},
  textStyle: {color: "white"},
  activeTextStyle: {color: "white"}
};



export default class CollapsingNav extends Component {
  scroll = new Animated.Value(0);
  headerY;

  constructor(props) {
    super(props);
    this.headerY = Animated.multiply(Animated.diffClamp(this.scroll, 0, NAVBAR_HEIGHT), -1);
  }

  render() {
    const tabContent = (
      <List>{new Array(200).fill(null).map((_, i) => <Item
        key={i}><Text>Item {i}</Text></Item>)}</List>);
    const tabY = Animated.add(this.scroll, this.headerY);
    return (
      <View>
        {Platform.OS === "ios" &&
        <View style={{backgroundColor: COLOR, height: 20, width: "100%", position: "absolute", zIndex: 2}}/>}
        <Animated.View style={{
          width: "100%",
          position: "absolute",
          transform: [{
            translateY: this.headerY
          }],
          elevation: 0,
          flex: 1,
          zIndex: 1,
          backgroundColor: COLOR
        }}>
          <Header style={{backgroundColor: "transparent"}} hasTabs>
            <Body>
            <Title>
              <Text style={{color: "white"}}>
                Collapsing Navbar
              </Text>
            </Title>
            </Body>
          </Header>
        </Animated.View>
        <Animated.ScrollView
            pagingEnabled={false}
            scrollEventThrottle={1}
            bounces={false}
            showsVerticalScrollIndicator={false}
            style={{zIndex: 0, height: "100%", elevation: -1}}
            contentContainerStyle={{paddingTop: NAVBAR_HEIGHT}}
            onScroll={Animated.event(
                [{nativeEvent: {contentOffset: {y: this.scroll}}}],
                {useNativeDriver: true},
            )}
            nestedScrollEnabled={true}
            overScrollMode="never"
        //   locked={true}
          >
          <Tabs renderTabBar={(props) => <Animated.View
            style={[{
              transform: [{translateY: tabY}],
              zIndex: 1,
              width: "100%",
              backgroundColor: COLOR
            }, Platform.OS === "ios" ? {paddingTop: 20} : null]}>
            <ScrollableTab {...props} underlineStyle={{backgroundColor: "white"}}/>
          </Animated.View>
          }>
            <Tab heading="Tab 1" {...TAB_PROPS}>
                {tabContent}
            </Tab>
            <Tab heading="Tab 2" {...TAB_PROPS}>
                {tabContent}
            </Tab>
            <Tab heading="Tab 3" {...TAB_PROPS}>
                {tabContent}
            </Tab>
            <Tab heading="Tab 4" {...TAB_PROPS}>
                {tabContent}
            </Tab>
          </Tabs>

{/* <ScrollableTabView
                    // style={{paddingTop:50}}
                    // collapsableBar={collapsableComponent}

                    initialPage={0}
                    renderTabBar={() => <DefaultTabBar />}
                    locked={true}
                    tabBarPosition='top'
                    //  contentProps={...props}
                    // onChangeTab={this.handleChangeTab.bind(this)}
                    >
                    <FriendsPage tabLabel='Friends' index={0} amount={4} params={this.props} handleScroll={this.handleScroll}/>
                    <GroupsPage tabLabel='Groups' index={1} amount={5} params={this.props} handleScroll={this.handleScroll}/>
                    <ClasssPage tabLabel='Classs' index={2} amount={6} params={this.props} handleScroll={this.handleScroll}/>
                </ScrollableTabView> */}
        </Animated.ScrollView>
      </View>
    );
  }
}