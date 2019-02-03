import React from 'react'
import {Modal} from 'react-native'
// import PropTypes from 'prop-types'
import ModalBox from 'react-native-modalbox'
import blacklist from 'blacklist'

export default class MyModal extends React.Component {
//   static propTypes = {
//     onRequestClose: PropTypes.func,
//     ...ModalBox.PropTypes,
//   }
//   static defaultProps = {
//     animationDuration: 280,
//     backButtonClose: true,
//   }
  render = ()=>(
    <Modal 
        visible={this.props.isOpen} 
        transparent={true} 
        position={this.props.position}>
      <ModalBox {...blacklist(this.props, 'onRequestClose')} onClosed={this.props.onRequestClose}/>
    </Modal>
  )
}