import React, { Component, Fragment, useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { CLIENT_ACCEPT_INVITATION, LOGOUT_USER } from '../../redux/actions';
import { NotificationManager } from 'react-notifications';

const Invite = (props) => {
  const dispatch = useDispatch();

  const { history, authUser, trainerApp } = props;
  const { error, errorMsg } = trainerApp;
  let searchQuery = props.location.search;
  if (searchQuery) {
    searchQuery = searchQuery.substring(1);
  }
  let result = searchQuery.split('&').reduce(function (result, item) {
    let parts = item.split('=');
    result[parts[0]] = parts[1];
    return result;
  }, {});

  let text = '';
  let link = '';

  useEffect(() => {
    if (!result.clientID || !result.trainerID) {
      text = 'Invalid or Expired Invitation Link';
      link = '/client';
    } else if (result.clientID !== localStorage.getItem('auth_id')) {
      console.log('result', result);
      console.log('authUser', authUser.authID);
      dispatch({
        type: LOGOUT_USER,
        payload: { history },
      });
      link = '/client';
    } else {
      console.log('result', result);
      dispatch({
        type: CLIENT_ACCEPT_INVITATION,
        payload: { history, result },
      });
    }
  }, []);

  useEffect(() => {
    console.log('errorMsg', errorMsg);
    console.log('error', error);
    if (errorMsg) {
      if (error) {
        NotificationManager.error(errorMsg, 'Error');
      } else {
        NotificationManager.success(errorMsg, 'Success');
      }
    }
  }, [errorMsg, error]);

  return <Fragment>{error}</Fragment>;
};

const mapStateToProps = ({ authUser, trainerApp }) => {
  return { authUser, trainerApp };
};
const mapActionsToProps = {};

export default connect(mapStateToProps, mapActionsToProps)(Invite);
