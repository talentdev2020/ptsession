import React, { Component, Fragment } from 'react';
import {
  Row,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Collapse,
} from 'reactstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { Colxx, Separator } from '../../components/common/CustomBootstrap';

import {
  getClientList,
  getClientListWithOrder,
  getClientListSearch,
  selectedClientItemsChange,
  logoutUser,
} from '../../redux/actions';
import ClientListItem from '../../components/applications/ClientListItem';
import AddNewClient from '../../containers/applications/AddNewClient';

class ClientApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownSplitOpen: false,
      modalOpen: false,
      lastChecked: null,
      searchKeyword: '',
      displayOptionsIsOpen: false,
    };
  }

  componentDidMount() {
    this.props.getClientList();
    document.body.classList.add('right-menu');
  }

  componentWillUnmount() {
    document.body.classList.remove('right-menu');
  }

  toggleDisplayOptions = () => {
    this.setState({ displayOptionsIsOpen: !this.state.displayOptionsIsOpen });
  };

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen,
    });
  };

  toggleSplit = () => {
    this.setState((prevState) => ({
      dropdownSplitOpen: !prevState.dropdownSplitOpen,
    }));
  };

  changeOrderBy = (column) => {
    this.props.getClientListWithOrder(column);
  };

  handleKeyPress = (e) => {
    this.setState({ searchKeyword: e.target.value });
  };

  handleCheckChange = (event, id) => {
    if (this.state.lastChecked == null) {
      this.setState({
        lastChecked: id,
      });
    }

    let selectedItems = Object.assign([], this.props.trainerApp.selectedItems);
    if (selectedItems.includes(id)) {
      selectedItems = selectedItems.filter((x) => x !== id);
    } else {
      selectedItems.push(id);
    }
    this.props.selectedClientItemsChange(selectedItems);

    if (event.shiftKey) {
      var items = this.props.trainerApp.clientItems;
      var start = this.getIndex(id, items, 'id');
      var end = this.getIndex(this.state.lastChecked, items, 'id');
      items = items.slice(Math.min(start, end), Math.max(start, end) + 1);
      selectedItems.push(
        ...items.map((item) => {
          return item.id;
        })
      );
      selectedItems = Array.from(new Set(selectedItems));
      this.props.selectedClientItemsChange(selectedItems);
    }
    return;
  };

  handleChangeSelectAll = () => {
    if (this.props.trainerApp.loading) {
      if (
        this.props.trainerApp.selectedItems.length >=
        this.props.trainerApp.clientItems.length
      ) {
        this.props.selectedClientItemsChange([]);
      } else {
        this.props.selectedClientItemsChange(
          this.props.trainerApp.clientItems.map((x) => x.id)
        );
      }
    }
  };

  handleLogout = () => {
    this.props.logoutUser(this.props.history);
  };

  getIndex(value, arr, prop) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][prop] === value) {
        return i;
      }
    }
    return -1;
  }

  render() {
    const { clientItems, loading } = this.props.trainerApp;
    const { authUser } = this.props;
    const { messages } = this.props.intl;
    const { modalOpen, searchKeyword } = this.state;
    const filteredItems =
      clientItems &&
      clientItems.filter(
        (item) =>
          item.firstName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          item.lastName.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    return (
      <Fragment>
        <Row className='app-row survey-app'>
          <Colxx xxs='12'>
            <div className='mb-2'>
              {loading && (
                <div className='text-zero top-right-button-container'>
                  <div className='user d-inline-block'>
                    <UncontrolledDropdown className='dropdown-menu-right'>
                      <DropdownToggle className='p-0' color='empty'>
                        <span className='name mr-1'>
                          {authUser.displayName}
                        </span>
                        <span>
                          <img
                            style={{ width: '50px', height: '50px' }}
                            alt='Profile'
                            src={
                              authUser.avatar
                                ? authUser.avatar
                                : '/assets/img/default_avatar.png'
                            }
                          />
                        </span>
                      </DropdownToggle>
                      <DropdownMenu className='mt-3' right>
                        <DropdownItem
                          onClick={() =>
                            this.props.history.push('/trainer/profile')
                          }
                        >
                          My Profile
                        </DropdownItem>
                        <DropdownItem
                          onClick={() =>
                            this.props.history.push('/trainer/packages')
                          }
                        >
                          Packages
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={this.handleLogout}>
                          Sign out
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                </div>
              )}
            </div>

            <div className='mb-2'>
              <Button
                color='empty'
                className='pt-0 pl-0 d-inline-block d-md-none'
                onClick={this.toggleDisplayOptions}
              >
                Display
                <i className='simple-icon-arrow-down align-middle' />
              </Button>
              <Collapse
                id='displayOptions'
                className='d-flex align-items-center'
                isOpen={this.state.displayOptionsIsOpen}
              >
                <Button
                  color='primary'
                  size='lg'
                  className='top-right-button'
                  onClick={this.toggleModal}
                  style={{ borderColor: '#922c88', color: '#fff' }}
                >
                  Add New
                </Button>{' '}
                <div className='d-block ml-2 d-md-inline-block'>
                  <div className='search-sm d-inline-block float-md-left mr-1 mb-1 align-top'>
                    <input
                      type='text'
                      name='keyword'
                      id='search'
                      placeholder={messages['menu.search']}
                      defaultValue={searchKeyword}
                      onChange={(e) => this.handleKeyPress(e)}
                    />
                  </div>
                </div>
              </Collapse>
            </div>
            <Separator className='mb-5' />
            <Row>
              {loading ? (
                filteredItems &&
                filteredItems.map((client, index) => (
                  <ClientListItem
                    key={`Client_item_${index}`}
                    client={client}
                    handleCheckChange={this.handleCheckChange}
                  />
                ))
              ) : (
                <div className='loading' />
              )}
            </Row>
          </Colxx>
        </Row>

        <AddNewClient
          toggleModal={this.toggleModal}
          modalOpen={modalOpen}
          isAdd={true}
        />
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
export default injectIntl(
  connect(mapStateToProps, {
    getClientList,
    getClientListWithOrder,
    getClientListSearch,
    selectedClientItemsChange,
    logoutUser,
  })(ClientApp)
);
