import React, { Component } from 'react'
import { Dimensions, Navigator, NativeModules, DeviceEventEmitter } from 'react-native'
import { setTheme, MKColor } from 'react-native-material-kit'

import HomeScreen from './screens/HomeScreen'
import FullScreen from './screens/FullScreen'
import SearchScreen from './screens/SearchScreen'

import ImageStore from './stores/ImageStore'
import SearchStore from './stores/SearchStore'

const { DeviceInfo } = NativeModules
const imageStore = new ImageStore()
const searchStore = new SearchStore(imageStore)

setTheme({
  primaryColor: MKColor.Orange,
  primaryColoRGB: MKColor.RGBOrange,
  accentColor: MKColor.Amber
})

export default class App extends Component {
  constructor (...args) {
    super(...args)

    DeviceInfo.getDeviceOrientation()
      .then((o) => {
        this.setState({
          orientation: parseInt(o, 10) === 1 ? 'PORTRAIT' : 'LANDSCAPE'
        })
      })

    const screen = Dimensions.get('window')

    this.state = {
      loaded: false,
      screenWidth: screen.width,
      screenHeight: screen.height
    }
  }

  componentDidMount () {
    DeviceEventEmitter.addListener('orientation', (data) => {
      console.log(data)
      this.setState({
        orientation: data.orientation,
        screenWidth: data.width,
        screenHeight: data.height
      })
    })

    imageStore.init().then(() => {
      this.setState({ loaded: true })
    })
  }

  render () {
    if (!this.state.loaded) return null

    const { screenWidth, screenHeight } = this.state

    return (
      <Navigator
        initialRoute={{ name: 'list' }}
        renderScene={(route, navigator) => {
          switch (route.name) {
            case 'search':
              return (<SearchScreen searchStore={searchStore} navigator={navigator} orientation={this.state.orientation} screenWidth={screenWidth} screenHeight={screenHeight} />)
            case 'fullscreen':
              return (<FullScreen images={route.images} navigator={navigator} initialIndex={route.initialIndex} orientation={this.state.orientation} screenWidth={screenWidth} screenHeight={screenHeight} />)
            case 'list':
            default:
              return (<HomeScreen imageStore={imageStore} navigator={navigator} orientation={this.state.orientation} screenWidth={screenWidth} screenHeight={screenHeight} />)
          }
        }}
      />
    )
  }
}

