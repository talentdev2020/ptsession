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
  getIdeaList,
  getIdeaListWithOrder,
  getIdeaListSearch,
  selectedIdeaItemsChange,
  getIdeaListWithFilter,
} from '../../redux/actions';
import IdeaListItem from '../../components/applications/IdeaListItem';
import AddNewIdea from '../../containers/applications/AddNewIdea';
import { store } from '../../helpers/Firebase';

class IdeaApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownSplitOpen: false,
      modalOpen: false,
      lastChecked: null,
      displayOptionsIsOpen: false,
      boardname: '',
    };
  }

  componentDidMount() {
    let object = this;
    if (!this.props.ideaApp.currentBoardId) return;
    let board_collection = store
      .collection('boards')
      .doc(this.props.ideaApp.currentBoardId);
    board_collection.get().then(function (thisdoc) {
      if (thisdoc.exists) {
        let temp = thisdoc.data();
        object.setState({ boardname: temp.title });
      }
    });
    this.props.getIdeaList(this.props.ideaApp.currentBoardId);
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
    this.props.getIdeaListWithOrder(column);
  };

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.props.getIdeaListSearch(e.target.value);
    }
  };
  filterStatus = (status) => {
    this.props.getIdeaListWithFilter('status', status);
  };
  handleCheckChange = (event, id) => {
    if (this.state.lastChecked == null) {
      this.setState({
        lastChecked: id,
      });
    }

    let selectedItems = Object.assign([], this.props.ideaApp.selectedItems);
    if (selectedItems.includes(id)) {
      selectedItems = selectedItems.filter((x) => x !== id);
    } else {
      selectedItems.push(id);
    }
    this.props.selectedIdeaItemsChange(selectedItems);

    if (event.shiftKey) {
      var items = this.props.ideaApp.ideaItems;
      var start = this.getIndex(id, items, 'id');
      var end = this.getIndex(this.state.lastChecked, items, 'id');
      items = items.slice(Math.min(start, end), Math.max(start, end) + 1);
      selectedItems.push(
        ...items.map((item) => {
          return item.id;
        })
      );
      selectedItems = Array.from(new Set(selectedItems));
      this.props.selectedIdeaItemsChange(selectedItems);
    }
    return;
  };

  handleChangeSelectAll = () => {
    if (this.props.ideaApp.loading) {
      if (
        this.props.ideaApp.selectedItems.length >=
        this.props.ideaApp.ideaItems.length
      ) {
        this.props.selectedIdeaItemsChange([]);
      } else {
        this.props.selectedIdeaItemsChange(
          this.props.ideaApp.ideaItems.map((x) => x.id)
        );
      }
    }
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
    const {
      ideaItems,
      searchKeyword,
      loading,
      orderColumn,
      filter,
      orderColumns,
      selectedItems,
    } = this.props.ideaApp;

    const { messages } = this.props.intl;

    const { modalOpen } = this.state;
    return (
      <Fragment>
        <Row className='app-row survey-app'>
          <Colxx xxs='12'>
            <div className='mb-2'>
              <h1>
                Hub{' '}
                <span style={{ color: '#dd6446' }}>
                  {this.state.boardname}{' '}
                </span>
                <span>Ideas</span>
              </h1>
              {loading && (
                <div className='text-zero top-right-button-container'>
                  <Button
                    color='primary'
                    size='lg'
                    onClick={() => this.props.history.push('/hubs')}
                    className='top-right-button'
                  >
                    Hubs
                  </Button>{' '}
                  <Button
                    color='primary'
                    size='lg'
                    className='top-right-button'
                    onClick={this.toggleModal}
                  >
                    Add New
                  </Button>{' '}
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
                className='d-md-block'
                isOpen={this.state.displayOptionsIsOpen}
              >
                <div className='d-block mb-5 '>
                  <Row>
                    <Colxx lg='12' xl='6'>
                      <UncontrolledDropdown className='mr-1 float-md-left btn-group mb-1'>
                        <DropdownToggle caret color='outline-dark' size='xs'>
                          Order By
                          {orderColumn ? orderColumn.label : ''}
                        </DropdownToggle>
                        <DropdownMenu>
                          {orderColumns.map((o, index) => {
                            return (
                              <DropdownItem
                                key={index}
                                onClick={() => this.changeOrderBy(o.column)}
                              >
                                {o.label}
                              </DropdownItem>
                            );
                          })}
                        </DropdownMenu>
                      </UncontrolledDropdown>

                      <div className='search-sm d-inline-block float-md-left mr-1 mb-1 align-top'>
                        <input
                          type='text'
                          name='keyword'
                          id='search'
                          placeholder={messages['menu.search']}
                          defaultValue={searchKeyword}
                          onKeyPress={(e) => this.handleKeyPress(e)}
                        />
                      </div>
                    </Colxx>
                    <Colxx lg='12' xl='6'>
                      <div className='d-inline-block d-flex right-corner status-explain'>
                        <div
                          onClick={() => this.filterStatus('')}
                          className={!filter && 'selected'}
                        >
                          Show all :{' '}
                          <i className='simple-icon-magic-wand heading-icon pr-2' />
                        </div>
                        <div
                          onClick={() => this.filterStatus('DEVELOPMENT')}
                          className={
                            filter &&
                            filter.value === 'DEVELOPMENT' &&
                            'selected'
                          }
                        >
                          In Development :{' '}
                          <i className='simple-icon-drawer heading-icon pr-2' />
                        </div>
                        <div
                          onClick={() => this.filterStatus('PENDING')}
                          className={
                            filter && filter.value === 'PENDING' && 'selected'
                          }
                        >
                          Under Consideration :{' '}
                          <i className='simple-icon-light heading-icon pr-2' />
                        </div>
                        <div
                          onClick={() => this.filterStatus('COMPLETED')}
                          className={
                            filter && filter.value === 'COMPLETED' && 'selected'
                          }
                        >
                          COMPLETED :{' '}
                          <i className='simple-icon-check heading-icon pr-2' />
                        </div>
                        <div
                          onClick={() => this.filterStatus('CANCELLED')}
                          className={
                            filter && filter.value === 'CANCELLED' && 'selected'
                          }
                        >
                          Cancelled :{' '}
                          <i className='simple-icon-close heading-icon pr-2' />
                        </div>
                      </div>
                    </Colxx>
                  </Row>
                </div>
              </Collapse>
            </div>
            <Separator className='mb-5' />
            <Row>
              {loading ? (
                ideaItems &&
                ideaItems.map((item, index) => (
                  <IdeaListItem
                    key={`Idea_item_${index}`}
                    item={{ ...item, hubname: this.state.boardname }}
                    isSelected={
                      loading ? selectedItems.includes(item.id) : false
                    }
                  />
                ))
              ) : (
                <div className='loading' />
              )}
            </Row>
          </Colxx>
        </Row>
        {/* {loading && <IdeaApplicationMenu />} */}
        <AddNewIdea
          toggleModal={this.toggleModal}
          modalOpen={modalOpen}
          hubname={this.state.boardname}
          isAdd={true}
        />
      </Fragment>
    );
  }
}
const mapStateToProps = ({ ideaApp }) => {
  return {
    ideaApp,
  };
};
export default injectIntl(
  connect(mapStateToProps, {
    getIdeaList,
    getIdeaListWithOrder,
    getIdeaListSearch,
    selectedIdeaItemsChange,
    getIdeaListWithFilter,
  })(IdeaApp)
);
