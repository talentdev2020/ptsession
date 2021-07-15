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
        <NavLink to='#' location={{}}>
          <p className='font-weight-medium mb-0'>
            {props.data.firstName} {props.data.lastName}
          </p>
        </NavLink>
      </div>
      <div>
        <NavLink
          className='btn btn-outline-primary btn-xs'
          to='#'
          location={{}}
        >
          <IntlMessages id='pages.follow' />
        </NavLink>
      </div>
    </div>
  );
};

const Package = (props) => {
  return (
    <div
      className='d-flex flex-row mb-3 pb-3 border-bottom justify-content-between align-items-center'
      onClick={() => props.managePackage(props.data)}
      style={{ cursor: 'pointer' }}
    >
      {/* <SingleLightbox
        thumb={props.data.thumb}
        large={props.data.large}
        className='img-thumbnail border-0 rounded-circle list-thumbnail align-self-center xsmall'
      /> */}
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

const EditProfile = (props) => {
  return (
    <div>
      <Modal isOpen={props.modalRight} wrapClassName='modal-right'>
        <ModalHeader toggle={props.editProfile}>Edit Profile</ModalHeader>
        <ModalBody>
          <EditProfileForm data={props.data} />
        </ModalBody>
        <ModalFooter>
          <Button color='secondary' onClick={props.editProfile}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

const Sessions = ({ packageItem }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessions, setSessions] = useState(packageItem.sessions || []);
  const [sessionClient, setSessionClient] = useState('');
  const trainer = useSelector((state) => state.authUser);
  const clients = useSelector((state) => state.trainerApp.clientItems);
  const clientNames = clients
    .filter((client) => client.packages.indexOf(packageItem._id) >= 0)
    .map((client) => {
      return {
        label: `${client.firstName} ${client.lastName}`,
        value: client._id,
      };
    });

  const token = localStorage.getItem('access_token');
  const config = {
    headers: { 'x-access-token': token },
  };

  const fetchSessions = useCallback(async () => {}, [packageItem]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const onAddSession = async () => {
    if (!sessionNotes) {
      alert('Note is required.');
    } else if (!sessionClient) {
      alert('Please choose a client.');
    } else {
      try {
        const res = await axios.post(
          `${apiUrl}session/addSession`,
          {
            notes: sessionNotes,
            clientID: sessionClient.value,
            trainer: trainer.authID,
            packageID: packageItem._id,
            type: SESSION_TYPE.PT,
            value: -1,
          },
          config
        );

        // console.log('res', res);
        // if (!res.data.error) {
        //   setSessions([res.data.data, ...sessions]);
        // }
      } catch (err) {
        console.log('err', err);
      }
      setSessionNotes('');
      setModalOpen(!modalOpen);
    }
  };

  return (
    <Row className='flex-column'>
      <Modal
        isOpen={modalOpen}
        toggle={toggleModal}
        wrapClassName='modal-right'
        backdrop='static'
      >
        <ModalHeader toggle={toggleModal}>Add a session</ModalHeader>
        <ModalBody>
          <Label className='mt-4'>Notes</Label>
          <Input
            name='sessionNotes'
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
          />
          <Label className='mt-4'>Select a client</Label>
          <Select
            options={clientNames}
            className='react-select'
            classNamePrefix='react-select'
            name='client'
            value={sessionClient}
            onChange={(e) => {
              setSessionClient(e);
            }}
          />
          <ModalFooter>
            <Button color='secondary' outline onClick={toggleModal}>
              Cancel
            </Button>
            <Button color='primary' onClick={onAddSession}>
              Add Session
            </Button>{' '}
          </ModalFooter>
        </ModalBody>
      </Modal>
      <Colxx lg='12'>
        <h1>{packageItem.name}</h1>
        <div
          className='ml-4'
          style={{ cursor: 'pointer', display: 'inline-block' }}
        >
          <h3 onClick={() => toggleModal()}> + Add a session</h3>
        </div>
      </Colxx>
      <Row>
        {sessions.length
          ? sessions.map((session) => {
              return (
                <Colxx sm='6' lg='4' xl='4' className='mb-3' key={session._id}>
                  <Card>
                    {/* <div className="position-relative">
              <CardImg top alt={product.title} src={product.img} />
            <Badge
              color={product.statusColor}
              pill
              className="position-absolute badge-top-left"
            >
              {product.status}
            </Badge>
          </div> */}
                    <CardBody>
                      <Row>
                        <Colxx xxs='10' className='mb-3'>
                          <CardSubtitle>{session.description}</CardSubtitle>
                          <CardText className='text-muted text-small mb-0 font-weight-light'>
                            {session.cost}
                          </CardText>
                        </Colxx>
                      </Row>
                    </CardBody>
                  </Card>
                </Colxx>
              );
            })
          : null}
      </Row>
    </Row>
  );
};

class TrainerProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalRight: false,
      selectedPackage: null,
      images: {},
      imgCollection: '',
      galleryImages: [],
    };
    this.productData = productData.slice(0, 15);

    this.extractFormData = this.extractFormData.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
    this.onUploadImages = this.onUploadImages.bind(this);

    this.imgPreviewImag = createRef();
  }

  extractFormData = function (form) {
    const formData = new FormData(document.querySelector(form));
    let values = {};

    for (var pair of formData.entries()) {
      if (values[pair[0]]) {
        if (!(values[pair[0]] instanceof Array)) {
          values[pair[0]] = new Array(values[pair[0]]);
        }
        values[pair[0]].push(pair[1]);
      } else {
        values[pair[0]] = pair[1];
      }
    }
    return values;
  };

  generatePreviewData = (file) => {
    const fr = new FileReader();
    return new Promise((resolve, reject) => {
      fr.addEventListener('load', (e) => {
        const div = document.createElement('div');
        const img = document.createElement('img');
        img.src = fr.result;
        img.setAttribute('class', 'border img-preview');
        div.appendChild(img);
        resolve(div);
      });
      fr.addEventListener('error', (e) => {
        reject();
      });
      fr.readAsDataURL(file);
    });
  };

  removeAllChildren = (el) => {
    while (el && el.childElementCount) {
      el.removeChild(el.children[0]);
    }
  };

  renderCollection = (collection, container) => {
    this.removeAllChildren(container);
    Promise.all(collection.map(this.generatePreviewData)).then((imgs) =>
      imgs.map((img, i) => {
        img.setAttribute('index', i);
        container.appendChild(img);
      })
    );
  };

  onChangeFile(e) {
    let fileCollection = [];

    while (fileCollection.length) {
      fileCollection.pop();
    }

    Array.from(e.target.files).map((f) => fileCollection.push(f));
    this.setState({ imgCollection: fileCollection });
    this.renderCollection(fileCollection, this.imgPreviewImag.current);
  }

  onUploadImages() {
    if (!this.state.images) {
      alert('No images are chosen.');
      return;
    }

    var formData = new FormData();
    for (const key of Object.keys(this.state.imgCollection)) {
      formData.append('imgCollection', this.state.imgCollection[key]);
    }

    formData.append('trainerID', this.props.authUser.authID);
    const token = localStorage.getItem('access_token');
    const config = {
      headers: { 'x-access-token': token },
    };
    axios
      .post(`${apiUrl}trainer/upload-images`, formData, config)
      .then((res) => {
        if (!res.data.error) {
          this.renderCollection([], this.imgPreviewImag.current);
          this.setState({ galleryImages: res.data.data, imgCollection: [] });
        }
      });
  }

  componentDidMount() {
    console.log('props', this.props);
    this.props.getItem({ payload: this.props.authUser.authID });
    this.props.getClientList({ payload: this.props.authUser.authID });
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

  editProfile = () => {
    this.setState((prevState) => ({
      modalRight: !prevState.modalRight,
    }));
  };

  managePackage = (packageItem) => {
    this.setState({ selectedPackage: packageItem });
  };

  handleLogout = () => {
    this.props.logoutUser(this.props.history);
  };

  render() {
    const { error, selectedClient, loading } = this.props.trainerApp;
    return loading ? (
      <div className='loading'></div>
    ) : (
      <Fragment>
        <EditProfile
          editProfile={this.editProfile}
          modalRight={this.state.modalRight}
          data={selectedClient}
        />
        <Row className='mt-2'>
          <Button
            color='primary'
            size='lg'
            className='ml-auto'
            onClick={() => {
              this.props.history.push('/trainer');
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
                          <div
                            onClick={this.editProfile}
                            style={{
                              cursor: 'pointer',
                            }}
                          >
                            <i className='simple-icon-note'></i>
                          </div>
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
                                  return (
                                    <li
                                      className='list-inline-item'
                                      key={`contact_${index}`}
                                    >
                                      <a
                                        href={selectedClient.contacts[contact]}
                                        target='__blank'
                                      >
                                        <i
                                          className={`simple-icon-social-${contact}`}
                                        ></i>
                                      </a>
                                    </li>
                                  );
                                }
                              )}
                          </ul>
                          {/* <ul className='list-unstyled list-inline'>
                            
                          </ul> */}
                        </div>
                        <div className='mt-4'>
                          <form action='' className='myForm' id='my-form'>
                            <label htmlFor='pictures'>
                              Upload your Gallery images here
                            </label>
                            <Row
                              style={{ position: 'relative' }}
                              className='m-0 flex-nowrap'
                            >
                              <input
                                name='pictures'
                                type='file'
                                id='pictures'
                                accept='image/*'
                                multiple
                                onChange={this.onChangeFile}
                              />

                              <input
                                style={{
                                  position: 'absolute',
                                  right: 0,
                                  top: 0,
                                }}
                                type='button'
                                value='Upload'
                                onClick={this.onUploadImages}
                              />
                            </Row>
                          </form>
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
                            <div
                              onClick={() =>
                                this.props.history.push('/trainer/packages')
                              }
                              style={{
                                cursor: 'pointer',
                              }}
                            >
                              <i className='simple-icon-note'></i>
                            </div>
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
                    {this.state.selectedPackage ? (
                      <Sessions
                        packageItem={this.state.selectedPackage}
                      ></Sessions>
                    ) : (
                      <div>
                        <Row>
                          <Colxx lg='12'>
                            <div
                              className='gallery-preview mb-2'
                              ref={this.imgPreviewImag}
                            />
                          </Colxx>
                        </Row>
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
                      </div>
                    )}
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
  TrainerProfile
);
