import React, { Component, PropTypes } from 'react'
import { Dimensions, Image, StyleSheet, View, ActivityIndicator, Platform } from 'react-native'

export default class Photo extends Component {
  static propTypes = {
    uri: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,

    resizeMode: PropTypes.string,

    width: PropTypes.number,
    height: PropTypes.number,

    thumbnail: PropTypes.bool,
    lazyLoad: PropTypes.bool
  }

  static defaultProps = {
    resizeMode: 'contain',
    lazyLoad: false
  }

  constructor (props) {
    super(props)

    const { lazyLoad, uri } = props

    this.state = {
      uri: lazyLoad ? null : uri,
      progress: 0,
      error: false
    }
  }

  load = () => {
    if (!this.state.uri) {
      this.setState({
        uri: this.props.uri
      })
    }
  }

  _onProgress = (evt) => {
    const progress = evt.nativeEvent.loaded / evt.nativeEvent.total
    if (!this.props.thumbnail && progress !== this.state.progress) {
      this.setState({
        progress
      })
    }
  }

  _onError = () => {
    this.setState({
      error: true,
      progress: 1
    })
  }

  _onLoad = () => {
    this.setState({
      progress: 1
    })
  }

  _renderProgressIndicator = () => {
    const { progress } = this.state

    if (progress < 1) {
      if (Platform.OS === 'android') {
        // return <ProgressBarAndroid progress={progress} />
        return <ActivityIndicator size='large' />
      }
    }

    return null
  }

  render () {
    const { resizeMode, width, height } = this.props
    const { uri, error } = this.state

    const screen = Dimensions.get('window')

    const sizeStyle = {
      width: width || screen.width,
      height: height || screen.height
    }

    let source
    if (uri) {
      source = typeof uri === 'string' ? { uri } : uri
    }

    return (
      <View style={[styles.container, sizeStyle]}>
        {error ? null : this._renderProgressIndicator()}
        <Image
          {...this.props}
          style={[styles.image, sizeStyle]}
          source={source}
          onProgress={this._onProgress}
          onError={this._onError}
          onLoad={this._onLoad}
          resizeMode={resizeMode}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
})
