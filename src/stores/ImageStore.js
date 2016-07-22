import { AsyncStorage } from 'react-native'
import { observable } from 'mobx'

export default class ImageStore {
  @observable images = []

  async init () {
    let savedImagesStr = await AsyncStorage.getItem('images')

    this.updateImages(JSON.parse(savedImagesStr))
      /*this.updateImages([{
      uri: require('../../screenshots/IMG_1177.png'),
      tags: [{
        name: '智絵里'
      }]
    }, {
      uri: require('../../screenshots/IMG_1122.png'),
      tags: []
    }, {
      uri: require('../../screenshots/IMG_1178.png'),
      tags: []
    }, {
      uri: require('../../screenshots/IMG_1125.png'),
      tags: []
    }, {
      uri: require('../../screenshots/IMG_1179.png'),
      tags: [{
        name: '緒方智絵里'
      }]
      }])*/
  }

  updateImages = (newImages) => {
    // newImages: [{path, [tags]}]
    const images = this.images.concat(newImages)
    AsyncStorage.setItem('images', JSON.stringify(images))

    // AsyncStorage.setItem('images', '[]')
    this.images = images
  }
}
