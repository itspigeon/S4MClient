import React, { Component, PropTypes } from 'react'
import { Animated, View, Text, StyleSheet } from 'react-native'

export default class TagsAnnotator extends Component {
  static propTypes = {
    screenWidth: PropTypes.number,
    screenHeight: PropTypes.number,
    orientation: PropTypes.string,

    imageWidth: PropTypes.number,
    imageHeight: PropTypes.number,

    tags: PropTypes.object,
    rowId: PropTypes.number,

    displayed: PropTypes.bool
  }

  static defaultProps = {
    displayed: false
  }

  constructor (...args) {
    super(...args)

    this.state = {
      animation: new Animated.Value(1)
    }
  }

  componentWillReceiveProps (nextProps) {
    Animated.timing(this.state.animation, {
      toValue: nextProps.displayed ? 1 : 0,
      duration: 300
    }).start()
  }

  render () {
    const { screenWidth, screenHeight, tags, imageWidth, imageHeight, rowId } = this.props

    const scaleW = screenWidth / imageWidth
    const scaleH = screenHeight / imageHeight

    const scale = Math.min(scaleW, scaleH)

    const centerPoint = {
      x: (screenWidth / 2),
      y: (screenHeight - 56) / 2
    }

    const _generateTagSquare = (tag, idx) => {
      const { region } = tag
      const regionFromCenter = {
        x: region[0] - imageWidth / 2,
        y: region[1] - imageHeight / 2,
        w: region[2],
        h: region[3]
      }

      const displayRegion = {
        x: centerPoint.x + regionFromCenter.x * scale,
        y: centerPoint.y + regionFromCenter.y * scale,
        w: regionFromCenter.w * scale,
        h: regionFromCenter.h * scale
      }

      return (
        <View
          key={`row_${rowId}_${idx}`}
          style={{position: 'absolute', left: displayRegion.x, top: displayRegion.y, width: displayRegion.w, height: displayRegion.h, borderWidth: 3, borderColor: '#ef6c00'}}
        >
          <Text
            style={{position: 'absolute', padding: 2, backgroundColor: '#ef6c00', color: 'white', fontSize: 12}}>
            {tag.name}
          </Text>
        </View>

      )
    }

    return (
      <Animated.View
        style={[
          styles.container,
          { opacity: this.state.animation, width: screenWidth, height: screenHeight }
        ]}
      >
        {
          tags.map(_generateTagSquare)
        }
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0
  }
})
