import { observable } from 'mobx'

export default class SearchStore {
  imageStore
  @observable searchText = ''
  @observable images = []

  constructor (imageStore) {
    this.imageStore = imageStore
  }

  setSearchText = (newSearchText) => {
    this.searchText = newSearchText
  }

  setSearchResult = (images) => {
    this.images = images
  }

  search = (searchText) => {
    if (searchText === '') {
      this.images = []
      return
    }

    let images = this.imageStore.images
    images = images.filter((value, idx) => {
      if (!value.tags) return false

      return value.tags.some((value, idx) => {
        return value.name.includes(searchText)
      })
    })

    this.images = images
  }
}
