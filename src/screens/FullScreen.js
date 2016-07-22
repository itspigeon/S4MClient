import React, { Component, PropTypes } from 'react'
import { observer } from 'mobx-react/native'
import { TouchableWithoutFeedback, View, Platform, StatusBar, ViewPagerAndroid, DeviceEventEmitter, StyleSheet } from 'react-native'

import Toolbar from '../components/Toolbar'
import Photo from '../components/Photo'
import TagsAnnotator from '../components/TagsAnnotator'

@observer
export default class FullScreen extends Component {
  static propTypes = {
    images: PropTypes.array,
    navigator: PropTypes.object,
    initialIndex: PropTypes.number,
    orientation: PropTypes.string,
    screenWidth: PropTypes.number,
    screenHeight: PropTypes.number
  }

  static defaultProps = {
    initialIndex: 0
  }

  constructor (props, ...args) {
    super(props, ...args)

    this.photoRefs = []
    this.state = {
      currentIndex: props.initialIndex,
      tagsAnnotatorDisplayed: false
    }
  }

  componentDidMount () {
    DeviceEventEmitter.addListener('orientation', () => {
      this.photoRefs.map(p => {
        p && p.forceUpdate()
      })
      this.openPage(this.state.currentIndex, false)
    })

    this.openPage(this.state.currentIndex, false)
  }

  openPage = (index, animated) => {
    if (!this.scrollView) {
      return
    }

    this.scrollView.setPageWithoutAnimation(index)

    this._updatePageIndex(index)
  }

  _updatePageIndex = (index) => {
    this.setState({
      currentIndex: index
    }, () => {
      this._triggerPhotoLoad(index)
    })
  }

  _triggerPhotoLoad = (index) => {
    const photo = this.photoRefs[index]
    if (photo) {
      photo.load()
    } else {
      setTimeout(this._triggerPhotoLoad.bind(this, index), 200)
    }
  }

  _onScroll = (e) => {
    const event = e.nativeEvent
    const layoutWidth = event.layoutMeasurement.width
    const newIndex = Math.floor((event.contentOffset.x + 0.5 * layoutWidth) / layoutWidth)

    this._onPageSelected(newIndex)
  }

  _onPageSelected = (page) => {
    const { currentIndex } = this.state
    let newIndex = page

    if (typeof newIndex === 'object') {
      newIndex = newIndex.nativeEvent.position
    }

    if (currentIndex !== newIndex) {
      this._updatePageIndex(newIndex)
    }
  }

  _toggleTagsAnnotator = () => {
    const tagsAnnotatorDisplayed = !this.state.tagsAnnotatorDisplayed
    console.log(tagsAnnotatorDisplayed)
    this.setState({
      tagsAnnotatorDisplayed
    })
  }

  _renderRow = (photo, sectionId, rowId) => {
    const { screenWidth, screenHeight, orientation } = this.props
    const { tags } = photo

    return (
      <View key={`row_${rowId}`} style={styles.flex}>
        <TouchableWithoutFeedback onPress={this._toggleTagsAnnotator}>
          <View>
            <Photo
              ref={ref => this.photoRefs[rowId] = ref}
              lazyLoad
              uri={photo.uri}
              width={screenWidth}
              height={screenHeight - 56}
            />
            <TagsAnnotator
              screenWidth={screenWidth}
              screenHeight={screenHeight}
              orientation={orientation}
              imageWidth={photo.width}
              imageHeight={photo.height}
              tags={tags}
              rowId={rowId}
              displayed={this.state.tagsAnnotatorDisplayed}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  _renderScrollableContent = () => {
    // const images = Array.prototype.slice.call(this.props.imageStore.images)
    const { images } = this.props

    if (Platform.OS === 'android') {
      return (
        <ViewPagerAndroid
          style={[styles.flex, {marginTop: 56}]}
          ref={scrollView => this.scrollView = scrollView}
          onPageSelected={this._onPageSelected}
        >
          {images.map((child, idx) => this._renderRow(child, 0, idx))}
        </ViewPagerAndroid>
      )
    }

    return null
  }

  render () {
    const { currentIndex } = this.state
    const { images } = this.props
    const title = `${currentIndex + 1} of ${images.length}`

    return (
       <View style={styles.container}>
        <StatusBar hidden={false} backgroundColor='#ef6c00' />
        <View style={styles.toolbar}>
          <Toolbar title={title} color='#EF6C00' navigator={this.props.navigator} />
        </View>
        { this._renderScrollableContent() }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: 'black'
  },
  toolbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  },
  flex: {
    flex: 1
  }
})
