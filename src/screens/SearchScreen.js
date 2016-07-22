import React, { Component, PropTypes } from 'react'
import { View, StatusBar, StyleSheet, DeviceEventEmitter } from 'react-native'
import { MKTextField } from 'react-native-material-kit'

import { observer } from 'mobx-react/native'

import GridView from '../components/GridView'
import Toolbar from '../components/Toolbar'

@observer
export default class SearchScreen extends Component {
  static propTypes = {
    navigator: PropTypes.object,
    searchStore: PropTypes.object,
    orientation: PropTypes.string,
    screenWidth: PropTypes.number,
    screenHeight: PropTypes.number
  }

  constructor (...args) {
    super(...args)
    this.state = {
      searchText: ''
    }
  }

  componentDidMount () {
    DeviceEventEmitter.addListener('orientation', (e) => {
      if (this.textFieldRef) {
        console.log('update textfield')
        //const inputFrame = this.textFieldRef.inputFrame
        this.textFieldRef.componentDidMount()
        // this.textFieldRef._onInputMeasured(inputFrame.left, inputFrame.top, e.screenWidth, inputFrame.height)
      }
    })
  }

  _onItemTap = (index) => {
    const { navigator, searchStore } = this.props
    const images = Array.prototype.slice.call(searchStore.images)

    navigator.push({
      name: 'fullscreen',
      initialIndex: index,
      images: images
    })
  }

  _updateSearchText = (searchText) => {
    this.props.searchStore.setSearchText(searchText)
    this._search()
  }

  _search = () => {
    this.props.searchStore.search(this.props.searchStore.searchText)
  }

  render () {
    const { searchStore, orientation, screenWidth, screenHeight } = this.props
    const images = Array.prototype.slice.call(searchStore.images)

    return (
      <View style={styles.container}>
        <StatusBar hidden={false} backgroundColor='#ef6c00' />
        <View style={styles.toolbar}>
          <Toolbar title={'Search'} color='#EF6C00' navigator={this.props.navigator} />
        </View>
        <View style={styles.content}>
          <View style={styles.searchField}>
            <MKTextField
              ref={(ref) => this.textFieldRef = ref}
              textInputStyle={{ color: '#212121' }}
              autoCorrect={false}
              defaultValue={searchStore.searchText}
              keyboardType="web-search"
              underlineEnabled
              underlineSize={2}
              highlightColor="#ef6c00"
              placeholder="Search text here..."
              placeholderTextColor="#212121"
              onChangeText={this._updateSearchText}
              onSubmitEditing={this._search}
              tintColor="#999"
            />
          </View>
          <GridView
            images={images}
            orientation={orientation}
            onItemTap={this._onItemTap}
            screenWidth={screenWidth}
            screenHeight={screenHeight}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: 'white'
  },
  content: {
    flex: 1,
    marginTop: 60
  },
  searchField: {
    marginLeft: 4,
    marginRight: 4
  },
  toolbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  }
})
