import React, { useState } from 'react';
import { Card, CardBody, Badge } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { ContextMenuTrigger } from 'react-contextmenu';
import { Colxx } from '../common/CustomBootstrap';
import AddNewClient from '../../containers/applications/AddNewClient';
import { setCurrentClientId } from '../../redux/actions';
import moment from 'moment';
const ClientListItem = ({ client }) => {
  const { authID } = useSelector(({ authUser }) => authUser);
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const { lastLogin } = client;
  const lastLoginString = moment(lastLogin).format('L');
  return (
    <>
      <Colxx xxs='12' key={client.id} className='mb-3'>
        <ContextMenuTrigger id='menu_id' data={client.id}>
          <Card className='d-flex flex-row'>
            <NavLink to={`?p=${client._id}`} className='d-flex'>
              <img
                src={
                  client.avatar
                    ? client.avatar
                    : '/assets/img/default_avatar.png'
                }
                className='list-thumbnail responsive border-0 card-img-left'
              />
            </NavLink>
            <div className='pl-2 d-flex flex-grow-1 min-width-zero'>
              <div className='card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-clients-lg-center'>
                <NavLink
                  to={`/trainer/client?p=${client._id}`}
                  className='w-20 w-sm-100'
                >
                  <p className='list-client-heading mb-1 truncate'>
                    {client.firstName} {client.lastName}
                  </p>
                </NavLink>
                <p className='mb-1 text-muted text-small w-20 w-sm-100'>
                  Remainging Sessions: {client.remainingSession}
                </p>
                <p className='mb-1 text-muted text-small w-15 w-sm-100'>
                  Last Login: {lastLoginString}
                </p>
                <p className='mb-1 text-muted text-small w-15 w-sm-100'>
                  {client.email}
                </p>
                <p className='mb-1 text-muted text-small w-15 w-sm-100'>
                  {client.phone}
                </p>
              </div>
            </div>
          </Card>
        </ContextMenuTrigger>
      </Colxx>
    </>
  );
};

export default React.memo(ClientListItem);
