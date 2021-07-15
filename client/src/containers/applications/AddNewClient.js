import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
} from 'reactstrap';

import {
  addClientItem,
  editClientItem,
  sendInvitation,
  sendInvitationToEmail,
} from '../../redux/actions';

import { functions } from '../../helpers/Firebase';
import { Colxx, Separator } from '../../components/common/CustomBootstrap';
import { Row, Card, CardBody, CardTitle, Table } from 'reactstrap';
import '../../assets/css/sass/custom.scss';
import { NotificationManager } from 'react-notifications';

const Client = ({ client, index, inviteClient, clientItems }) => {
  return (
    <tr>
      <th scope='row'>{index + 1}</th>
      <td>{client.firstName}</td>
      <td>{client.lastName}</td>
      <td>{client.email}</td>
      <td>
        {clientItems.filter((item) => item._id === client._id).length ? (
          <Button
            onClick={() => {
              inviteClient(client);
            }}
            outline
            color='primary'
            className='mb-2'
            disabled
          >
            Invited
          </Button>
        ) : (
          <Button
            onClick={() => {
              inviteClient(client);
            }}
            outline
            color='primary'
            className='mb-2'
          >
            Invite
          </Button>
        )}
      </td>
    </tr>
  );
};

class AddNewClientModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      clients: [],
      searchIndex: '',
    };
  }
  componentDidMount() {
    if (!this.props.isAdd) {
      this.setState({ ...this.props.item });
    }
  }
  addNetItem = () => {
    const newItem = {
      name: this.state.name,
      email: this.state.email,
    };
    this.props.addClientItem(newItem);
    this.props.toggleModal();
    this.setState({
      name: '',
      email: '',
    });
  };
  editNetItem = () => {
    const newItem = {
      name: this.state.name,
      email: this.state.email,
    };
    this.props.editClientItem(newItem);
    this.props.toggleModal();
  };
  search = (e) => {
    const searchIndex = e.target.value;
    this.setState({ name: searchIndex });
    const clients = this.props.trainerApp.allClientItems.filter((client) => {
      return (
        client.firstName &&
        client.lastName &&
        `${client.firstName.toLowerCase()} ${client.lastName.toLowerCase()}`.includes(
          searchIndex
        )
      );
    });
    this.setState({ clients });
  };

  inviteClient = (client) => {
    console.log('inviteclient', client);
    this.props.sendInvitation(client);
  };
  inviteToEmail = () => {
    this.props.sendInvitationToEmail({ email: this.state.email });
  };

  componentDidUpdate() {
    const { error, errorMsg } = this.props.trainerApp;
    console.log('update');
    // this.setState({ clients: this.props.trainerApp.allClientItems });
    if (errorMsg) {
      if (error) {
        NotificationManager.error(errorMsg, 'Error');
      } else {
        NotificationManager.success(errorMsg, 'Success');
      }
    }
  }

  render() {
    const { modalOpen, toggleModal } = this.props;
    const { clients } = this.state;

    return (
      <Modal
        isOpen={modalOpen}
        toggle={toggleModal}
        wrapClassName='modal-right'
        backdrop='static'
      >
        <ModalHeader toggle={toggleModal}>
          {this.props.isAdd ? 'Add New Client' : 'Edit Hub'}
        </ModalHeader>
        <ModalBody>
          <Label className='mt-4'>Client Name</Label>
          <Input
            type='text'
            defaultValue={this.state.name}
            onChange={(e) => this.search(e)}
          />
          <div>
            <Label className='mt-4'>Email</Label>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Input
                type='text'
                defaultValue={this.state.email}
                onChange={(event) => {
                  this.setState({ email: event.target.value });
                }}
              />
              <Button
                onClick={() => {
                  this.inviteToEmail();
                }}
                outline
                color='primary'
                className='mb-2'
              >
                Invite
              </Button>
            </div>
          </div>
          {clients.length > 0 && (
            <Colxx xxs='12'>
              <Card className='mb-12'>
                <CardBody>
                  <CardTitle>Client List</CardTitle>
                  <Table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Invite</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map((client, index) => {
                        return (
                          <Client
                            index={index}
                            client={client}
                            clientItems={this.props.trainerApp.clientItems}
                            key={client._id}
                            inviteClient={this.inviteClient}
                          />
                        );
                      })}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Colxx>
          )}
          {/* <Label className="mt-4">Status</Label>
          <CustomInput
            type="radio"
            id="exCustomRadio"
            name="customRadio"
            label="COMPLETED"
            checked={this.state.status === "COMPLETED"}
            onChange={event => {
              this.setState({
                status: event.target.value === "on" ? "COMPLETED" : "PENDING"
              });
            }}
          />
          <CustomInput
            type="radio"
            id="exCustomRadio2"
            name="customRadio2"
            label="PENDING"
            defaultChecked={this.state.status === "PENDING"}
            onChange={event => {
              this.setState({
                status: event.target.value !== "on" ? "COMPLETED" : "PENDING"
              });
            }}
          /> */}
        </ModalBody>
        <ModalFooter>
          <Button color='secondary' outline onClick={toggleModal}>
            Close
          </Button>{' '}
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = ({ trainerApp, authUser }) => {
  return {
    trainerApp,
    authUser,
  };
};
export default connect(mapStateToProps, {
  addClientItem,
  editClientItem,
  sendInvitation,
  sendInvitationToEmail,
})(AddNewClientModal);
