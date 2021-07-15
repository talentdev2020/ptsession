import React, { useEffect, useState } from 'react';

import { Row, Card, CardTitle, Form, Label, Input, Button } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { registerUser } from '../../redux/actions';

import IntlMessages from '../../helpers/IntlMessages';
import Select from 'react-select';
import { Colxx } from '../../components/common/CustomBootstrap';
import CustomSelectInput from '../../components/common/CustomSelectInput';
import { withRouter } from 'react-router';

import { auth, store } from '../../helpers/Firebase';
import { roles } from '../../constants/defaultValues';

const Register = ({ history }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const { error, loading } = useSelector(({ authUser }) => authUser);
  const [invited, setInvited] = useState(false);

  const selectData = [
    { label: 'Trainer', value: 1 },
    { label: 'Client', value: 2 },
  ];

  const [userRole, setUserRole] = useState(selectData[0]);

  let searchQuery = history.location.search;
  if (searchQuery) {
    searchQuery = searchQuery.substring(1);
  }
  let queryResult = searchQuery.split('&').reduce(function (result, item) {
    let parts = item.split('=');
    result[parts[0]] = parts[1];
    return result;
  }, {});

  useEffect(() => {
    if (queryResult.email) {
      setEmail(queryResult.email);
      setInvited(true);
    }
  }, [queryResult, selectData, setUserRole, setInvited, setEmail]);

  const ValidateEmail = (value) => {
    let error;
    if (!value) {
      error = 'Please enter your email address';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = 'Invalid email address';
    }
    return error;
  };
  const handleChange = (e) => {
    switch (e.target.name) {
      case 'email':
        setEmail(e.target.value);
        break;
      case 'password':
        setPassword(e.target.value);
        break;
      case 'firstName':
        setFirstName(e.target.value);
        break;
      case 'lastName':
        setLastName(e.target.value);
        break;
      case 'phone':
        setPhone(e.target.value);
        break;
    }
  };
  const handleChangeRole = (e) => {
    // if (e) {
    //   setRole(e.value);
    // }
    // console.log(e);
    // if (invited) {
    //   setRole(2);
    // }
  };
  useEffect(() => {
    if (error) {
      console.log('error', error);
    }
  }, [error]);

  const onUserRegister = () => {
    console.log('userRole', userRole);
    const role = invited ? roles.client : userRole.value;
    if (firstName && lastName && email && password && role) {
      const error = ValidateEmail(email);
      if (error) {
        console.log('error', error);
      } else {
        if (queryResult.trainerID) {
          dispatch(
            registerUser(
              {
                firstName,
                lastName,
                email,
                password,
                role,
                trainerID: queryResult.trainerID,
                invited: true,
                phone,
              },
              history
            )
          );
        } else {
          dispatch(
            registerUser(
              { firstName, lastName, email, password, role, phone },
              history
            )
          );
        }
      }
      //history.push('/user/login');
    } else alert('You should fill out all fields');
  };

  return (
    <Row className='h-100'>
      <Colxx xxs='12' md='10' className='mx-auto my-auto'>
        <Card className='auth-card'>
          <div className='position-relative image-side '>
            <p className='text-white h2'>MAGIC IS IN THE DETAILS</p>
            <p className='white mb-0'>
              Please use this form to register. <br />
              If you are a member, please{' '}
              <NavLink to={`/user/login`} className='white'>
                <strong style={{ color: '#dd6c46' }}> login</strong>
              </NavLink>
              .
            </p>
          </div>
          <div className='form-side'>
            <NavLink to={`/`} className='white'>
              <img src='/assets/img/logo-black.svg' alt='logo' />
            </NavLink>
            <CardTitle className='mb-4'>
              <IntlMessages id='user.register' />
            </CardTitle>
            <Form>
              <Label className='form-group has-float-label mb-4'>
                <Input
                  type='firstName'
                  defaultValue={firstName}
                  onChange={(e) => handleChange(e)}
                  name='firstName'
                />
                <IntlMessages id='user.firstName' />
              </Label>
              <Label className='form-group has-float-label mb-4'>
                <Input
                  type='lastName'
                  defaultValue={lastName}
                  onChange={(e) => handleChange(e)}
                  name='lastName'
                />
                <IntlMessages id='user.lastName' />
              </Label>
              <Label className='form-group has-float-label mb-4'>
                <Input
                  type='email'
                  name='email'
                  defaultValue={email}
                  onChange={(e) => handleChange(e)}
                  disabled={invited}
                />
                <IntlMessages id='user.email' />
              </Label>
              <Label className='form-group has-float-label mb-4'>
                <Input
                  type='phone'
                  name='phone'
                  defaultValue={phone}
                  onChange={(e) => handleChange(e)}
                />
                <IntlMessages id='user.phone' defaultValue={phone} />
              </Label>
              <Label className='form-group has-float-label mb-4'>
                <Input
                  type='password'
                  onChange={(e) => handleChange(e)}
                  name='password'
                />
                <IntlMessages id='user.password' defaultValue={password} />
              </Label>
              <Row>
                <Colxx xxs='12' md='6' className='mb-4'>
                  <label>
                    <IntlMessages id='user.selectRole' />
                  </label>
                  <Select
                    isDisabled={invited}
                    options={selectData}
                    components={{ Input: CustomSelectInput }}
                    className='react-select'
                    classNamePrefix='react-select'
                    name='role'
                    value={invited ? selectData[1] : userRole}
                    onChange={(e) => {
                      setUserRole(e);
                    }}
                  />
                </Colxx>
              </Row>
              <Row>
                <Colxx xxs='12' className='mb-4'>
                  <span> {error} </span>
                </Colxx>
              </Row>
              <div className='d-flex justify-content-end align-items-center'>
                <Button
                  color='primary'
                  className={`btn-shadow btn-multiple-state ${
                    loading ? 'show-spinner' : ''
                  }`}
                  size='lg'
                  onClick={() => onUserRegister()}
                >
                  <span className='spinner d-inline-block'>
                    <span className='bounce1' />
                    <span className='bounce2' />
                    <span className='bounce3' />
                  </span>
                  <span className='label'>
                    <IntlMessages id='user.register-button' />
                  </span>
                </Button>
              </div>
            </Form>
          </div>
        </Card>
      </Colxx>
    </Row>
  );
};
export default withRouter(Register);
