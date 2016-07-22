import React, { PropTypes, Component } from 'react'
import { TouchableHighlight, View, ListView, StyleSheet } from 'react-native'

import Photo from './Photo'

export default class GridView extends Component {
  static propTypes = {
    images: PropTypes.array.isRequired,
    orientation: PropTypes.string,
    onItemTap: PropTypes.func,
    screenWidth: PropTypes.number,
    screenHeight: PropTypes.number
  }

  _onItemTap = (rowId) => {
    // ToastAndroid.show(`Image tapped: ${rowId}`, ToastAndroid.SHORT)
    this.props.onItemTap(rowId)
  }

  _renderRow = (image, sectionId, rowId) => {
    const { orientation, screenWidth } = this.props
    const itemPerRow = orientation === 'PORTRAIT' ? 3 : 5

    const itemMargin = 2
    const photoSize = (screenWidth / itemPerRow) - itemMargin * 2

    return (
      <TouchableHighlight onPress={() => this._onItemTap(parseInt(rowId, 10))}>
        <View style={styles.row}>
          <Photo
            width={photoSize}
            height={photoSize}
            resizeMode={'cover'}
            uri={image.uri}
          />
        </View>
      </TouchableHighlight>
    )
  }

  render () {
    const { images } = this.props

    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })

    return (
      <View style={styles.container}>
        <ListView
          contentContainerStyle={styles.list}
          dataSource={dataSource.cloneWithRows(images)}
          initialListSize={21}
          pageSize={3}
          scrollRenderAheadDistance={1000}
          enableEmptySections={true}
          renderRow={this._renderRow}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  row: {
    justifyContent: 'center',
    margin: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 1
  }
})
