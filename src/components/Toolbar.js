import React, { Component, PropTypes } from 'react'
import { Platform, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

export default class Toolbar extends Component {
  static propTypes = {
    color: PropTypes.string,
    navigator: PropTypes.object,
    title: PropTypes.string,
    homeScreen: PropTypes.bool,
    addButtonPressed: PropTypes.func
  }

  static defaultProps = {
    homeScreen: false,
    addButtonPressed: () => {}
  }

  _actionSelected = (actionIndex) => {
    switch (actionIndex) {
      case 0:
        this.props.navigator.push({
          name: 'search'
        })
        break
      default:
        break
    }
  }

  _backButtonPressed = () => {
    this.props.navigator.pop()
  }

  render () {
    const { color, title, homeScreen, addButtonPressed } = this.props
    const actions = [{
      title: 'Search'
    }]

    if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
          navIconName={homeScreen ? 'md-add' : 'md-arrow-back'}
          onIconClicked={homeScreen ? addButtonPressed : this._backButtonPressed}
          style={[styles.toolbar, { backgroundColor: color }]}
          titleColor={'white'}
          title={title}
          actions={homeScreen ? actions : null}
          onActionSelected={this._actionSelected}
        />
      )
    }

    return null
  }

}

const styles = StyleSheet.create({
  toolbar: {
    height: 56,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'flex-start'
  }
})
