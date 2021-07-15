import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  CustomInput,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
} from 'reactstrap';
import { auth } from '../../helpers/Firebase';
import { addIdeaItem, editIdeaItem } from '../../redux/actions';

class AddNewIdeaModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      detail: '',
      status: 'PENDING',
      id: '',
      hubname: '',
    };
  }
  componentDidMount() {
    if (!this.props.isAdd) {
      this.setState({ ...this.props.item });
    }
  }
  addNetItem = () => {
    console.log(this.props);
    let username = '';
    username = auth.currentUser && auth.currentUser.displayName;
    const email = auth.currentUser && auth.currentUser.email;
    const newItem = {
      title: this.state.title,
      detail: this.state.detail,
      status: this.state.status,
      authID: this.props.authUser.authID,
      boardId: this.props.ideaApp.currentBoardId,
      hubname: this.props.hubname,
      likeUsers: [],
      dislikeUsers: [],
      email,
      username,
    };
    this.props.addIdeaItem(newItem);
    this.props.toggleModal();
    this.setState({
      title: '',
      detail: '',
      status: 'PENDING',
    });
  };
  editNetItem = () => {
    const email = auth.currentUser && auth.currentUser.email;
    const username = auth.currentUser && auth.currentUser.displayName;
    const newItem = {
      id: this.state.id,
      email,
      username,
      title: this.state.title,
      detail: this.state.detail,
      status: this.state.status,
      hubname: this.state.hubname,
    };
    this.props.editIdeaItem(newItem);
    this.props.toggleModal();
  };
  render() {
    const { modalOpen, toggleModal } = this.props;
    return (
      <Modal
        isOpen={modalOpen}
        toggle={toggleModal}
        wrapClassName='modal-right'
        backdrop='static'
      >
        <ModalHeader toggle={toggleModal}>
          {this.props.isAdd ? 'Add New' : 'Edit Idea'}
        </ModalHeader>
        <ModalBody>
          <Label className='mt-4'>Idea Title</Label>
          <Input
            type='text'
            defaultValue={this.state.title}
            onChange={(event) => {
              this.setState({ title: event.target.value });
            }}
          />
          <Label className='mt-4'>Description</Label>
          <Input
            type='textarea'
            defaultValue={this.state.detail}
            onChange={(event) => {
              this.setState({ detail: event.target.value });
            }}
          />

          <Label className='mt-4'>Status</Label>
          <CustomInput
            type='radio'
            id='exCustomRadio'
            name='customRadio'
            label='DEVELOPMENT'
            checked={this.state.status === 'DEVELOPMENT'}
            onChange={(event) => {
              this.setState({
                status: event.target.value === 'on' ? 'DEVELOPMENT' : '',
              });
            }}
          />
          <CustomInput
            type='radio'
            id='exCustomRadio'
            name='customRadio'
            label='PENDING'
            checked={this.state.status === 'PENDING'}
            onChange={(event) => {
              this.setState({
                status: event.target.value === 'on' ? 'PENDING' : '',
              });
            }}
          />
          <CustomInput
            type='radio'
            id='exCustomRadio'
            name='customRadio'
            label='COMPLETED'
            checked={this.state.status === 'COMPLETED'}
            onChange={(event) => {
              this.setState({
                status: event.target.value === 'on' ? 'COMPLETED' : '',
              });
            }}
          />
          <CustomInput
            type='radio'
            id='exCustomRadio2'
            name='customRadio2'
            label='CANCELLED'
            defaultChecked={this.state.status === 'CANCELLED'}
            onChange={(event) => {
              this.setState({
                status: event.target.value === 'on' ? 'CANCELLED' : '',
              });
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button color='secondary' outline onClick={toggleModal}>
            Cancel
          </Button>
          <Button
            color='primary'
            onClick={() =>
              this.props.isAdd ? this.addNetItem() : this.editNetItem()
            }
          >
            Submit
          </Button>{' '}
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = ({ ideaApp, authUser }) => {
  return {
    ideaApp,
    authUser,
  };
};
export default connect(mapStateToProps, {
  addIdeaItem,
  editIdeaItem,
})(AddNewIdeaModal);
