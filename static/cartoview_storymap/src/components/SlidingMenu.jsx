import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class SlidingMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
  }
  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }
  render() {
    const {title,children, toggleBtnCls} = this.props;
    return (
      <div>
        <a onClick={this.toggle} href="#" className={toggleBtnCls}>
          <i className="fa fa-bars"></i>
        </a>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className='nav-side-menu'>
          <ModalHeader toggle={this.toggle}>{title}</ModalHeader>
          <ModalBody>
            {children}
          </ModalBody>

        </Modal>
      </div>
    );
  }
}

export default SlidingMenu;
