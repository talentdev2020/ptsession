import React, {
  Component,
  Fragment,
  useState,
  useEffect,
  useCallback,
  createRef,
} from 'react';
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
  Label,
  Input,
  CardImg,
} from 'reactstrap';
import { connect, useDispatch, useSelector } from 'react-redux';
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
import data from '../../data/iconCards';
import IconCard from '../../components/cards/IconCard';
import { getItem, logoutUser, getClientList } from '../../redux/actions';
import { NotificationManager } from 'react-notifications';
import EditProfileForm from './edit_profile';
import axios from 'axios';
import { apiUrl, SESSION_TYPE } from '../../constants/defaultValues';
import productData from '../../data/products';
import Select from 'react-select';

const Package = (props) => {
  return (
    <div className='d-flex flex-row mb-3 pb-3 border-bottom justify-content-between align-items-center'>
      <div className='pl-3 flex-fill'>
        <p className='font-weight-medium mb-0'>{props.data.name}</p>
      </div>
      <div className='pl-3 flex-fill'>
        <p className='font-weight-medium mb-0'>{`${props.data.count} Sessions`}</p>
      </div>
      <div className='pl-3 flex-fill'>
        <p className='font-weight-medium mb-0'>{`$${props.data.cost}`}</p>
      </div>
    </div>
  );
};

class PublicProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: {},
      imgCollection: '',
      galleryImages: [],
    };
  }

  componentDidMount() {
    console.log('props', this.props);
    const { history } = this.props;
    let searchQuery = this.props.location.search;
    if (searchQuery) {
      searchQuery = searchQuery.substring(1);
    }
    let searchQueryResult = searchQuery
      .split('&')
      .reduce(function (result, item) {
        let parts = item.split('=');
        result[parts[0]] = parts[1];
        return result;
      }, {});
    if (!searchQueryResult.p) {
      history.push('/trainer');
    }
    this.props.getItem({ payload: searchQueryResult.p });
    // this.fetchSessionFeed(searchQueryResult.p);
    // this.props.getItem({ payload: this.props.authUser.authID });
    // this.props.getClientList({ payload: this.props.authUser.authID });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.trainerApp.selectedClient.images &&
      this.props.trainerApp.selectedClient.images !== prevState.galleryImages
    ) {
      this.setState({
        galleryImages: this.props.trainerApp.selectedClient.images,
      });
    }
    if (this.props.authUser.authID !== prevProps.authUser.authID) {
      this.props.getItem({ payload: this.props.authUser.authID });
    }
  }

  render() {
    const { error, selectedClient, loading } = this.props.trainerApp;
    return loading ? (
      <div className='loading'></div>
    ) : (
      <Fragment>
        <Row className='mt-2'>
          <Button
            color='primary'
            size='lg'
            className='ml-auto'
            onClick={() => {
              this.props.history.goBack();
            }}
          >
            Back
          </Button>
          <Colxx className='mt-2' xxs='12'>
            <TabContent activeTab={'1'}>
              <TabPane tabId='1'>
                <Row>
                  <Colxx xxs='12' lg='5' xl='4' className='col-left'>
                    <Card className='mb-4'>
                      <CardBody>
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
                          <Colxx>
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
                                  selectedClient.contactEmail
                                    ? selectedClient.contactEmail
                                    : selectedClient.email
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
                                  if (selectedClient.contacts[contact]) {
                                    return (
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
                                    );
                                  }
                                }
                              )}
                          </ul>
                        </div>
                      </CardBody>
                    </Card>

                    <Card className='mb-4'>
                      <CardBody>
                        <CardTitle>Trainer Locations</CardTitle>
                        <div className='remove-last-border remove-last-margin remove-last-padding'>
                          {selectedClient.location}
                        </div>
                      </CardBody>
                    </Card>

                    <Card className='mb-4'>
                      <CardBody>
                        <CardTitle>
                          <Row>
                            <Colxx>My Packages</Colxx>
                          </Row>
                        </CardTitle>
                        <div className='remove-last-border remove-last-margin remove-last-padding'>
                          {selectedClient.packages &&
                            selectedClient.packages.map((itemData, index) => {
                              return (
                                <Package
                                  data={itemData}
                                  managePackage={this.managePackage}
                                  key={index}
                                />
                              );
                            })}
                        </div>
                      </CardBody>
                    </Card>
                  </Colxx>
                  <Colxx xxs='12' lg='7' xl='8'>
                    <Row>
                      {this.state.galleryImages.map((image, index) => {
                        return (
                          <Colxx
                            xxs='12'
                            lg='6'
                            xl='4'
                            className='mb-4'
                            key={index}
                          >
                            <Card>
                              <div className='position-relative'>
                                <a className='w-40 w-sm-100'>
                                  <img
                                    src={image}
                                    className='card-img-top'
                                    style={{
                                      height: '200px',
                                      objectFit: 'cover',
                                    }}
                                  />
                                </a>
                              </div>
                            </Card>
                          </Colxx>
                        );
                      })}
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
export default connect(mapStateToProps, { logoutUser, getItem, getClientList })(
  PublicProfile
);
