import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { roles } from '../constants/defaultValues';

class Main extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  componentDidUpdate() {}

  render() {
    if (parseInt(this.props.authUser.role) === roles.trainer) {
      return <Redirect to='/trainer' />;
    } else if (parseInt(this.props.authUser.role) === roles.client) {
      return <Redirect to='/client' />;
    } else {
      return <Redirect to='/user/login' />;
    }
  }
}
const mapStateToProps = ({ authUser }) => {
  return { authUser };
};
const mapActionsToProps = {};

export default connect(mapStateToProps, mapActionsToProps)(Main);
