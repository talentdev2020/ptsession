import React, { Component, Fragment, useState, useEffect } from 'react';
import {
  Row,
  Card,
  CardBody,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  TabContent,
  TabPane,
  Badge,
  CardTitle,
  CardSubtitle,
  CardText,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
  CustomInput,
  FormGroup,
  Label,
} from 'reactstrap';
import * as Yup from 'yup';
import Select from 'react-select';
import { Formik, Form, Field } from 'formik';
import { connect, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import Breadcrumb from '../../containers/navs/Breadcrumb';
import { Colxx } from '../../components/common/CustomBootstrap';
import IntlMessages from '../../helpers/IntlMessages';
import SingleLightbox from '../../components/pages/SingleLightbox';
import { injectIntl } from 'react-intl';
import UserCardBasic from '../../components/cards/UserCardBasic';
import RecentPost from '../../components/common/RecentPost';
import Post from '../../components/cards/Post';
import IconCard from '../../components/cards/IconCard';
import { getItem, logoutUser } from '../../redux/actions';
import { trainerApp, authUser } from '../../redux/reducers';
import { NotificationManager } from 'react-notifications';
import EditProfileForm from './edit_profile';
import axios from 'axios';
import { apiUrl, SESSION_TYPE } from '../../constants/defaultValues';

const data = [
  { title: 'Total Workouts Completed', icon: 'iconsminds-clock', value: 14 },
  {
    title: 'PT Sessions Remaining',
    icon: 'iconsminds-basket-coins',
    value: 32,
  },
  {
    title: 'Non PT Sessions',
    icon: 'iconsminds-arrow-refresh',
    value: 74,
  },
  { title: 'Weigh-ins', icon: 'iconsminds-mail-read', value: 25 },
];

const MyTrainer = (props) => {
  return (
    <div className='d-flex flex-row mb-3 pb-3 border-bottom justify-content-between align-items-center'>
      <SingleLightbox
        thumb={
          props.data.avatar
            ? props.data.avatar
            : '/assets/img/default_avatar.png'
        }
        className='img-thumbnail border-0 rounded-circle list-thumbnail align-self-center xsmall'
      />
      <div className='pl-3 flex-fill'>
        <NavLink
          to={`/trainer/public_profile?p=${props.data._id}`}
          location={{}}
        >
          <p className='font-weight-medium mb-0'>
            {props.data.firstName} {props.data.lastName}
          </p>
        </NavLink>
      </div>
      <div>
        <li className='list-inline-item'>
          <a
            href={`mailto:${props.data.contactEmail ?? props.data.email}`}
            target='__blank'
          >
            <i className={`simple-icon-envelope-open`}></i>
          </a>
        </li>
        <li className='list-inline-item'>
          <a href={`tel:${props.data.phone}`} target='__blank'>
            <i className={`simple-icon-phone`}></i>
          </a>
        </li>
        {props.data.contacts &&
          Object.keys(props.data.contacts).map((contact, index) => {
            return (
              props.data.contacts[contact] && (
                <li className='list-inline-item' key={`contact_${index}`}>
                  <a href={props.data.contacts[contact]} target='__blank'>
                    <i className={`simple-icon-social-${contact}`}></i>
                  </a>
                </li>
              )
            );
          })}
      </div>
    </div>
  );
};

const Package = (props) => {
  const { client } = props;
  return (
    <div className='d-flex flex-row mb-3 pb-3 border-bottom justify-content-between align-items-center'>
      <div className='pl-3 flex-fill'>
        <NavLink to='#' location={{}}>
          <p className='font-weight-medium mb-0'>{props.data.name}</p>
        </NavLink>
      </div>
      <div className='pl-3 flex-fill'>
        <NavLink to='#' location={{}}>
          <p className='font-weight-medium mb-0'>{`$${props.data.cost}`}</p>
        </NavLink>
      </div>
      <div>
        <NavLink
          onClick={() => {
            props.purchasePackage(
              props.data._id,
              props.trainerID,
              props.data.count
            );
          }}
          className='btn btn-outline-primary btn-xs'
          to='#'
          location={{}}
        >
          Purchase
        </NavLink>
      </div>
    </div>
  );
};

const EditProfile = (props) => {
  return (
    <div>
      <Modal isOpen={props.modalRight} wrapClassName='modal-right'>
        <ModalHeader toggle={props.editProfile}>Edit Profile</ModalHeader>
        <ModalBody>
          <EditProfileForm data={props.data} editProfile={props.editProfile} />
        </ModalBody>
        <ModalFooter></ModalFooter>
      </Modal>
    </div>
  );
};

const ActionModal = (props) => {
  const typeOptions = [
    { label: 'Non PT Session', value: SESSION_TYPE.NON_PT },
    { label: 'Body Fat(%)', value: SESSION_TYPE.BODY_FAT },
    { label: 'Weight(lbs)', value: SESSION_TYPE.WEIGH_IN },
  ];

  const [actionType, setActionType] = useState(typeOptions[0]);
  const [value, setValue] = useState('');

  const addSession = async () => {
    if (!value) {
      alert('Please input session value.');
    } else {
      const token = localStorage.getItem('access_token');
      const config = {
        headers: { 'x-access-token': token },
      };
      const data = {
        clientID: props.authUser.authID,
        type: actionType.value,
      };
      data.notes = actionType.value === SESSION_TYPE.NON_PT ? value : '';
      data.value = actionType.value !== SESSION_TYPE.NON_PT ? value : '-1';
      data.completed = actionType.value === SESSION_TYPE.NON_PT ? true : false;
      const res = await axios.post(`${apiUrl}session/addSession`, data, config);
      if (!res.data.error) {
        setValue('');
        props.fetchSessionFeed(props.authUser);
        NotificationManager.success('Added a update successfully.', 'Success');
      } else {
        NotificationManager.error('Something went wrong. Try again.', 'Error');
      }
    }
  };

  return (
    <div>
      <Modal isOpen={props.actionModalRight} wrapClassName='modal-right'>
        <ModalHeader toggle={props.actionModal}>Actions</ModalHeader>
        <ModalBody>
          <div>
            <Row className='mb-4'>
              <Colxx xxs='12'>
                <Card>
                  <CardBody>
                    <Row>
                      <Colxx>
                        <Select
                          options={typeOptions}
                          className='react-select'
                          classNamePrefix='react-select'
                          name='actionType'
                          value={actionType}
                          onChange={(e) => {
                            setActionType(e);
                          }}
                        />
                      </Colxx>
                    </Row>
                    <Row className='mt-5 mb-5'>
                      <Colxx>
                        <Label>
                          {actionType.value === SESSION_TYPE.NON_PT
                            ? 'Session Notes'
                            : actionType.label}
                        </Label>
                        <input
                          className='form-control'
                          type='text'
                          name='value'
                          defaultValue={value}
                          onChange={(e) => setValue(e.target.value)}
                        />
                      </Colxx>
                    </Row>

                    <Button
                      color='primary'
                      style={{ marginRight: '15px' }}
                      onClick={() => addSession()}
                    >
                      Add
                    </Button>
                    <Button color='secondary' onClick={props.actionModal}>
                      Close
                    </Button>
                  </CardBody>
                </Card>
              </Colxx>
            </Row>
          </div>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </Modal>
    </div>
  );
};

const SessionCard = ({
  session,
  authUser,
  completeSession,
  fetchSessionFeed,
}) => {
  const editSessionFeed = async () => {
    let sessionData = { _id: session._id };
    if (session.type === SESSION_TYPE.NON_PT) {
      session.notes = editValue;
      sessionData.notes = editValue;
      sessionData.value = session.value;
    } else {
      session.value = editValue;
      sessionData.value = editValue;
      sessionData.notes = session.value;
    }

    const token = localStorage.getItem('access_token');
    const config = {
      headers: { 'x-access-token': token },
    };
    try {
      const response = await axios.post(
        `${apiUrl}user/updateSessionFeed`,
        { sessionData },
        config
      );
      if (!response.data.error) {
        NotificationManager.success('Updated Successfully.', 'Congratulations');
        fetchSessionFeed(authUser);
      } else {
        NotificationManager.error('Something went wrong.', 'Whoops');
        fetchSessionFeed(authUser);
      }
      setEditSession(false);
    } catch (err) {
      NotificationManager.error('Something went wrong.', 'Whoops');
      fetchSessionFeed(authUser);
      console.log('err', err);
      return false;
    }
  };

  const removeSessionFeed = async () => {
    if (!window.confirm('Are you sure you want to remove this session feed?')) {
      return false;
    }
    const token = localStorage.getItem('access_token');
    const config = {
      headers: { 'x-access-token': token },
    };
    const response = await axios.get(
      `${apiUrl}user/removeSessionFeed/${session._id}`,
      config
    );
    if (!response.data.error) {
      NotificationManager.success(
        'Session Removed Successfully.',
        'Congratulations'
      );
      fetchSessionFeed(authUser);
    } else {
      NotificationManager.error('Something went wrong.', 'Whoops');
      fetchSessionFeed(authUser);
    }
  };

  const [editSession, setEditSession] = useState(false);
  const [editValue, setEditValue] = useState(
    session.type === SESSION_TYPE.NON_PT ? session.notes : session.value
  );

  let style = '',
    sessionTitle = '',
    sessionIcon = '',
    sessionContent = '',
    sessionValue = session.value;
  if (session.type === SESSION_TYPE.PT) {
    style = 'pt';
    sessionContent = `Notes: ${session.notes}`;
    if (!session.completed) {
      sessionIcon = 'session_pt.png';
      sessionTitle = `${session.trainer.firstName} ${session.trainer.lastName} planned a personal training session with ${authUser.displayName}`;
    } else {
      sessionIcon = 'session_pt_completed.png';
      sessionTitle = `${authUser.displayName} completed a personal training session with ${session.trainer.firstName} ${session.trainer.lastName}`;
      style = 'pt completed';
    }
  } else if (session.type === SESSION_TYPE.NON_PT) {
    sessionTitle = `${authUser.displayName} completed a non personal training session`;
    sessionContent = `Notes: ${session.notes}`;
    style = 'nonpt';
    sessionIcon = 'session_nonpt_completed.png';
  } else if (
    session.type === SESSION_TYPE.WEIGH_IN ||
    session.type === SESSION_TYPE.BODY_FAT
  ) {
    sessionTitle = `${authUser.displayName} added a progress update`;
    sessionContent =
      session.type === SESSION_TYPE.WEIGH_IN
        ? `Weight: ${session.value} lbs`
        : `Body Fat %: ${session.value} %`;
    if (session.type === SESSION_TYPE.WEIGH_IN) {
      sessionValue = `${session.value} lbs`;
    } else {
      sessionValue = `${session.value} %`;
    }

    style = 'update';
    sessionIcon = 'session_progress.png';
  } else {
    style = 'purchase';
    sessionIcon = 'session_purchased.png';
    sessionTitle = `${authUser.displayName} purchased ${session.value} new sessions from ${session.trainer.firstName} ${session.trainer.lastName}`;
  }

  return (
    <div
      className={`p-3 mb-2 session-card ${style}`}
      style={{ position: 'relative' }}
    >
      <div className='session-card-left'>
        <img src={`/assets/img/${sessionIcon}`} alt='Personal Training' />
        <div className='ml-2'>
          <p className='mb-0'>{sessionTitle}</p>
          {editSession ? (
            session.type === SESSION_TYPE.NON_PT ? (
              <div>
                <p className='mb-0 mt-2'>Notes</p>
                <input
                  onChange={(e) => setEditValue(e.target.value)}
                  value={editValue}
                />
                <button
                  onClick={() => {
                    if (!editValue) {
                      alert('Note is required.');
                    } else {
                      editSessionFeed();
                    }
                  }}
                >
                  {' '}
                  Save{' '}
                </button>
                <button
                  onClick={() => {
                    setEditValue('');
                    setEditSession(false);
                  }}
                >
                  {' '}
                  Cancel{' '}
                </button>
              </div>
            ) : session.type === SESSION_TYPE.BODY_FAT ? (
              <div>
                <p className='mb-0 mt-2'>Body Fat</p>
                <input
                  onChange={(e) => setEditValue(e.target.value)}
                  value={editValue}
                />
                <button
                  onClick={() => {
                    if (!editValue) {
                      alert('Body Fat is required.');
                    } else {
                      editSessionFeed();
                    }
                  }}
                >
                  {' '}
                  Save{' '}
                </button>
                <button
                  onClick={() => {
                    setEditValue('');
                    setEditSession(false);
                  }}
                >
                  {' '}
                  Cancel{' '}
                </button>
              </div>
            ) : (
              <div>
                <p className='mb-0 mt-2'>Weigh In</p>
                <input
                  onChange={(e) => setEditValue(e.target.value)}
                  value={editValue}
                />
                <button
                  onClick={() => {
                    if (!editValue) {
                      alert('Weigh In is required.');
                    } else {
                      editSessionFeed();
                    }
                  }}
                >
                  {' '}
                  Save{' '}
                </button>
                <button
                  onClick={() => {
                    setEditValue('');
                    setEditSession(false);
                  }}
                >
                  {' '}
                  Cancel{' '}
                </button>
              </div>
            )
          ) : (
            <p className='mb-0 mt-2'>{sessionContent}</p>
          )}
        </div>
      </div>
      <div
        className='session-card-right'
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <h1 className='pb-0 mb-0'>{sessionValue}</h1>
        {session.type === SESSION_TYPE.PT && (
          <input
            type='checkbox'
            style={{ width: '30px', height: '30px', marginLeft: '10px' }}
            defaultChecked={session.completed}
            disabled={session.completed}
            onChange={() => completeSession(session._id)}
          />
        )}
      </div>
      {(session.type === SESSION_TYPE.NON_PT ||
        session.type === SESSION_TYPE.BODY_FAT ||
        session.type === SESSION_TYPE.WEIGH_IN) && (
        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
          <i
            className='simple-icon-edit'
            style={{ cursor: 'pointer', marginRight: '10px' }}
            onClick={() => setEditSession(true)}
          />
          <i
            className='simple-icon-trash'
            style={{ cursor: 'pointer' }}
            onClick={() => removeSessionFeed()}
          />
        </div>
      )}
    </div>
  );
};

class ClientProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalRight: false,
      actionModalRight: false,
      sessionFeed: [],
      error: '',
      sessionInfo: {},
    };
    this.completeSession = this.completeSession.bind(this);
  }

  componentDidMount() {
    this.props.getItem({ payload: this.props.authUser.authID });
    this.fetchSessionFeed(this.props.authUser);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.trainerApp.selectedClient._id !==
      prevProps.trainerApp.selectedClient._id
    )
      this.props.getItem({ payload: this.props.authUser.authID });
  }

  editProfile = () => {
    this.setState((prevState) => ({
      modalRight: !prevState.modalRight,
    }));
  };

  actionModal = () => {
    this.setState((prevState) => ({
      actionModalRight: !prevState.actionModalRight,
    }));
  };

  handleLogout = () => {
    this.props.logoutUser(this.props.history);
  };

  purchasePackage = async (packageID, trainerID, count) => {
    if (window.confirm('Are you sure you want to purchase this package?')) {
      const token = localStorage.getItem('access_token');
      const config = {
        headers: { 'x-access-token': token },
      };
      const data = { packageID, clientID: this.props.authUser.authID };
      try {
        await axios.post(`${apiUrl}/trainer/purchasePackage`, data, config);
        const res = await axios.post(
          `${apiUrl}session/addSession`,
          {
            notes: '',
            clientID: this.props.authUser.authID,
            trainer: trainerID,
            packageID: packageID,
            type: SESSION_TYPE.PURCHASE,
            value: count,
          },
          config
        );

        if (res.data.error) {
          NotificationManager.error(res.data.error, 'Error');
          return false;
        } else {
          const totalCount = this.state.sessionInfo.totalCount + count;
          const remaining = this.state.sessionInfo.remaining + count;
          this.setState({
            sessionFeed: [res.data.data, ...this.state.sessionFeed],
            sessionInfo: { ...this.state.sessionInfo, totalCount, remaining },
          });
          NotificationManager.success(
            'You successfully purchased a package.',
            'Success'
          );
          return true;
        }
      } catch (err) {
        console.log('err', err);
        return false;
      }
    }
  };

  fetchSessionFeed = async (authUser) => {
    const token = localStorage.getItem('access_token');
    const config = {
      headers: { 'x-access-token': token },
    };
    try {
      const res = await axios.get(
        `${apiUrl}user/getSessionFeed/${authUser.authID}`,
        config
      );
      if (!res.data.error) {
        this.setState({ sessionFeed: res.data.data.sessionFeed });
        this.setSessionInfo(res.data.data.sessionFeed, res.data.data.packages);
      } else {
        this.setState({ sessionFeed: [], error: res.data.msg });
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  completeSession = async (sessionId) => {
    const token = localStorage.getItem('access_token');
    const config = {
      headers: { 'x-access-token': token },
    };
    try {
      const res = await axios.get(
        `${apiUrl}user/completeSession/${sessionId}`,
        config
      );
      if (res.data.error) {
        NotificationManager.error('Something went wrong. Try again.', 'Error');
      } else {
        NotificationManager.success(
          'You successfully completed a session.',
          'Congratulations!'
        );
        this.fetchSessionFeed(this.props.authUser);
      }
    } catch (err) {
      NotificationManager.error('Something went wrong. Try again.', 'Error');
    }
  };

  setSessionInfo = (sessionFeed, packages) => {
    console.log('sessionInfo', sessionFeed);
    let totalCount = 0,
      remaining = 0,
      planned = 0,
      completed = 0,
      completedNon = 0,
      progress = 0;
    sessionFeed.map((session) => {
      if (session.type === SESSION_TYPE.PURCHASE) {
        totalCount += parseInt(session.value);
      }
    });
    sessionFeed.map((session) => {
      if (session.completed) {
        if (session.type === SESSION_TYPE.NON_PT) {
          completedNon += 1;
        } else {
          completed += 1;
        }
      } else if (session.type === SESSION_TYPE.PT) {
        planned += 1;
      } else if (
        session.type === SESSION_TYPE.BODY_FAT ||
        session.type === SESSION_TYPE.WEIGH_IN
      ) {
        progress += 1;
      }
      return session;
    });
    remaining = totalCount - completed - planned;
    this.setState({
      sessionInfo: {
        remaining,
        planned,
        completed,
        completedNon,
        progress,
        totalCount,
      },
    });
  };

  render() {
    const { error, selectedClient, loading } = this.props.trainerApp;
    const { authUser } = this.props;
    const { sessionFeed } = this.state;

    return loading ? (
      <div className='loading'></div>
    ) : (
      <Fragment>
        <EditProfile
          editProfile={this.editProfile}
          modalRight={this.state.modalRight}
          data={selectedClient}
        />
        <ActionModal
          fetchSessionFeed={this.fetchSessionFeed}
          authUser={authUser}
          actionModal={this.actionModal}
          actionModalRight={this.state.actionModalRight}
        />
        <Row className='mt-2'>
          <Colxx xxs='12'>
            <TabContent activeTab={'1'}>
              <TabPane tabId='1'>
                <Row>
                  <Colxx xxs='12' lg='5' xl='4' className='col-left'>
                    <Card className='mb-4'>
                      <CardBody>
                        <div
                          onClick={this.editProfile}
                          style={{
                            position: 'absolute',
                            top: '5px',
                            right: '20px',
                            cursor: 'pointer',
                          }}
                        >
                          <i className='simple-icon-note'></i>
                        </div>
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '10px',
                            right: '20px',
                            cursor: 'pointer',
                          }}
                        >
                          <i className='simple-icon-logout'></i>
                          <a
                            onClick={() => this.handleLogout()}
                            style={{ marginRight: '10px', marginLeft: '5px' }}
                          >
                            Log out
                          </a>
                        </div>
                        <Row>
                          <Colxx lg='4'>
                            <img
                              src={
                                selectedClient.avatar
                                  ? selectedClient.avatar
                                  : '/assets/img/default_avatar.png'
                              }
                              className='img-thumbnail card-img social-profile-img'
                            />
                            <p className='list-item-heading pt-2'>
                              {selectedClient.firstName}{' '}
                              {selectedClient.lastName}
                            </p>
                          </Colxx>
                          <Colxx lg='7'>
                            <p className='mb-3'>{selectedClient.bio}</p>
                          </Colxx>
                        </Row>
                        <p className='text-muted text-small mb-2'>Address</p>
                        <p>{selectedClient.address}</p>
                        <p className='text-muted text-small mb-2'>
                          <IntlMessages id='menu.contact' />
                        </p>
                        <div className='social-icons'>
                          <ul className='list-unstyled list-inline'>
                            <li className='list-inline-item'>
                              <a
                                href={`mailto:${
                                  selectedClient.contactEmail ??
                                  selectedClient.email
                                }`}
                                target='__blank'
                              >
                                <i className={`simple-icon-envelope-open`}></i>
                              </a>
                            </li>
                            <li className='list-inline-item'>
                              <a
                                href={`tel:${selectedClient.phone}`}
                                target='__blank'
                              >
                                <i className={`simple-icon-phone`}></i>
                              </a>
                            </li>
                            {selectedClient.contacts &&
                              Object.keys(selectedClient.contacts).map(
                                (contact, index) => {
                                  return (
                                    selectedClient.contacts[contact] && (
                                      <li
                                        className='list-inline-item'
                                        key={`contact_${index}`}
                                      >
                                        <a
                                          href={
                                            selectedClient.contacts[contact]
                                          }
                                          target='__blank'
                                        >
                                          <i
                                            className={`simple-icon-social-${contact}`}
                                          ></i>
                                        </a>
                                      </li>
                                    )
                                  );
                                }
                              )}
                          </ul>
                        </div>
                      </CardBody>
                    </Card>

                    <Card className='mb-4'>
                      <CardBody>
                        <CardTitle>
                          <IntlMessages id='client.myTrainers' />
                        </CardTitle>
                        <div className='remove-last-border remove-last-margin remove-last-padding'>
                          {selectedClient.trainers &&
                            selectedClient.trainers.map((itemData, index) => {
                              return (
                                <MyTrainer
                                  data={itemData}
                                  key={`trainer_${index}_${itemData._id}`}
                                />
                              );
                            })}
                        </div>
                      </CardBody>
                    </Card>

                    <Card className='mb-4'>
                      <CardBody>
                        <CardTitle>
                          <IntlMessages id='client.packages' />
                        </CardTitle>
                        <div className='remove-last-border remove-last-margin remove-last-padding'>
                          {selectedClient.trainers ? (
                            selectedClient.trainers.map((trainer) => {
                              return trainer.packages.map(
                                (packageItem, index) => {
                                  return (
                                    <Package
                                      purchasePackage={this.purchasePackage}
                                      trainerID={trainer._id}
                                      client={
                                        this.props.trainerApp.selectedClient
                                      }
                                      data={packageItem}
                                      key={index}
                                    />
                                  );
                                }
                              );
                            })
                          ) : (
                            <></>
                          )}
                          {/* {sessionFeed.map((itemData) => {
                            return (
                              <Package data={itemData} key={itemData.key} />
                            );
                          })} */}
                        </div>
                      </CardBody>
                    </Card>
                  </Colxx>
                  <Colxx xxs='12' lg='7' xl='8' className='col-right'>
                    <Row className='icon-cards-row mt-1 mb-2'>
                      <Colxx>
                        <div className={`icon-row-item`}>
                          <Card>
                            <CardBody className='text-center'>
                              <img
                                src='/assets/img/session_remaining.png'
                                alt='Session Remaining'
                              />
                              <p
                                style={{ height: '60px' }}
                                className='card-text font-weight-semibold mb-0'
                              >
                                Remaining Sessions
                              </p>
                              <p className='lead text-center'>
                                {this.state.sessionInfo.remaining}
                              </p>
                            </CardBody>
                          </Card>
                        </div>
                      </Colxx>
                      <Colxx>
                        <div className={`icon-row-item`}>
                          <Card>
                            <CardBody className='text-center'>
                              <img
                                src='/assets/img/session_pt_purple.png'
                                alt='Session Planned'
                              />
                              <p
                                style={{ height: '60px' }}
                                className='card-text font-weight-semibold mb-0'
                              >
                                Planned
                              </p>
                              <p className='lead text-center'>
                                {this.state.sessionInfo.planned}
                              </p>
                            </CardBody>
                          </Card>
                        </div>
                      </Colxx>
                      <Colxx>
                        <div className={`icon-row-item`}>
                          <Card>
                            <CardBody className='text-center'>
                              <img
                                src='/assets/img/session_pt_completed_purple.png'
                                alt='Session Completed'
                              />
                              <p
                                style={{ height: '60px' }}
                                className='card-text font-weight-semibold mb-0'
                              >
                                Completed PT Sessions
                              </p>
                              <p className='lead text-center'>
                                {this.state.sessionInfo.completed}
                              </p>
                            </CardBody>
                          </Card>
                        </div>
                      </Colxx>
                      <Colxx>
                        <div className={`icon-row-item`}>
                          <Card>
                            <CardBody className='text-center'>
                              <img
                                src='/assets/img/session_nonpt_completed_purple.png'
                                alt='Session Completed'
                              />
                              <p
                                style={{ height: '60px' }}
                                className='card-text font-weight-semibold mb-0'
                              >
                                Completed Non PT Sessions
                              </p>
                              <p className='lead text-center'>
                                {this.state.sessionInfo.completedNon}
                              </p>
                            </CardBody>
                          </Card>
                        </div>
                      </Colxx>
                      <Colxx>
                        <div className={`icon-row-item`}>
                          <Card>
                            <CardBody className='text-center'>
                              <img
                                src='/assets/img/session_progress_purple.png'
                                alt='Session Progress'
                              />
                              <p
                                style={{ height: '60px' }}
                                className='card-text font-weight-semibold mb-0'
                              >
                                Progress Updates
                              </p>
                              <p className='lead text-center'>
                                {this.state.sessionInfo.progress}
                              </p>
                            </CardBody>
                          </Card>
                        </div>
                      </Colxx>
                    </Row>
                    <Row>
                      <Colxx lg='12'>
                        <Button
                          color='secondary'
                          className='btn-block'
                          onClick={this.actionModal}
                        >
                          Actions
                        </Button>
                      </Colxx>
                      <Colxx className='mt-3'>
                        {this.state.error ? (
                          <Alert color='danger' className='rounded'>
                            {this.state.error}
                          </Alert>
                        ) : sessionFeed.length ? (
                          sessionFeed.map((session, index) => {
                            if (!session.removed)
                              return (
                                <SessionCard
                                  fetchSessionFeed={this.fetchSessionFeed}
                                  className='mb-2'
                                  authUser={authUser}
                                  key={index}
                                  session={session}
                                  completeSession={this.completeSession}
                                ></SessionCard>
                              );
                          })
                        ) : null}
                      </Colxx>
                    </Row>
                  </Colxx>
                </Row>
              </TabPane>
            </TabContent>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ trainerApp, authUser }) => {
  return {
    trainerApp,
    authUser,
  };
};
export default connect(mapStateToProps, { logoutUser, getItem })(ClientProfile);
