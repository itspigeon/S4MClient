import Realm from 'realm'

const ImageSchema = {
  name: 'Image',
  properties: {
    path: 'string',
    tags: {type: 'list', objectType: 'Tag'}
  }
}

const TagSchema = {
  name: 'Tag',
  properties: {
    name: 'string',
    region: 'string'
  }
}

const realm = new Realm({schema: [ImageSchema, TagSchema]})

export default realm
