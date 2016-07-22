import React, { Component, PropTypes } from 'react'
import {
  BackAndroid,
  StatusBar,
  StyleSheet,
  View
} from 'react-native'
import RNFetchBlob from 'react-native-fetch-blob'

import { observer } from 'mobx-react/native'

import Toolbar from '../components/Toolbar'
import GridView from '../components/GridView'
import ImagePicker from 'react-native-image-picker'

@observer
export default class HomeScreen extends Component {
  static propTypes = {
    navigator: PropTypes.object,
    imageStore: PropTypes.object,
    orientation: PropTypes.string,
    screenWidth: PropTypes.number,
    screenHeight: PropTypes.number
  }

  componentDidMount () {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (this.props.navigator && this.props.navigator.getCurrentRoutes().length > 1) {
        this.props.navigator.pop()
        return true
      }
      return false
    })
  }

  _addButtonPressed = () => {
    const { imageStore } = this.props

    ImagePicker.launchImageLibrary({
      storageOptions: {
        skipBackup: true,
        path: 's4m'
      }
    }, (response) => {
      if (response.didCancel) {
        return
      }

      RNFetchBlob.fetch('POST', 'http://localhost:8346/infer', {
        'Content-Type': 'application/octet-stream'
      }, response.data).then((res) => {
        console.log(res)
        const tagData = res.json()
        imageStore.updateImages([{
          uri: 'file://' + response.path,
          width: response.width,
          height: response.height,
          tags: tagData
        }])
      })
    })
  }

  _onItemTap = (index) => {
    const { navigator } = this.props
    const images = Array.prototype.slice.call(this.props.imageStore.images)

    navigator.push({
      name: 'fullscreen',
      initialIndex: index,
      images: images
    })
  }

  render () {
    const images = Array.prototype.slice.call(this.props.imageStore.images)
    const { orientation, screenWidth, screenHeight } = this.props

    return (
      <View style={styles.container}>
        <StatusBar hidden={false} backgroundColor='#ef6c00' />
        <View style={styles.toolbar}>
          <Toolbar title={'ScreenShots'} color='#EF6C00' homeScreen addButtonPressed={this._addButtonPressed} navigator={this.props.navigator} />
        </View>
        <View style={{marginTop: 56}}>
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
    alignSelf: 'stretch'
  },
  toolbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  }
})
