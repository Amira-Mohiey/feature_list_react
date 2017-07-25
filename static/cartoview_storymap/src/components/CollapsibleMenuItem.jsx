import React, { Component } from 'react';
import { Collapse, Button } from 'reactstrap';

class CollapsibleMenuItem extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: false };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  render() {
    const {label, children} = this.props;
    return (
      <div>
        <Button color="primary" onClick={this.toggle} style={{ marginBottom: '1rem' }}>{label}</Button>
        <Collapse isOpen={this.state.collapse}>
          {children}
        </Collapse>
      </div>
    );
  }
}

export default CollapsibleMenuItem;
