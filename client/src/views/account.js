import React, { useEffect, useState } from 'react';

import { Row, Card, CardTitle, Form, Label, Input, Button } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { editUser, setUserError } from '../redux/actions';
import { Colxx } from '../components/common/CustomBootstrap';
import { withRouter } from 'react-router';
import { auth, storage } from '../helpers/Firebase';
const Register = ({ history }) => {
  const [email, setEmail] = useState('');
  // const [password, setPassword] = useState(" ");
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const { error } = useSelector(({ authUser }) => authUser);
  const [imageAsUrl, setImageAsUrl] = useState('');

  const handleChange = (e) => {
    // if (e.target.name === "email") setEmail(e.target.value);
    // if (e.target.name === "password") setPassword(e.target.value);
    if (e.target.name === 'name') setName(e.target.value);
  };
  // const ValidateEmail = value => {
  //   let error;
  //   if (!value) {
  //     error = "Please enter your email address";
  //   } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
  //     error = "Invalid email address";
  //   }
  //   return error;
  // };
  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(setUserError());
    }
  }, [error, dispatch]);
  useEffect(() => {
    if (!auth.currentUser) return;
    const user = auth.currentUser;
    setEmail(user.email);
    setName(user.displayName);
    setImageAsUrl(user.photoURL ? user.photoURL : '/assets/img/nexusF-19.png');
  }, []);
  const onEditUser = () => {
    if (name !== '') {
      // const error = ValidateEmail(email);
      // if (error) alert(error);
      dispatch(editUser({ name, photoURL: imageAsUrl }, history));
    } else alert('You should fill out all fields');
  };
  const uploadImage = (e) => {
    const image = e.target.files[0];
    //setImageAsFile(imageFile => image);
    handleFireBaseUpload(image);
  };
  const handleFireBaseUpload = (image) => {
    // async magic goes here...
    if (image === '') {
      console.error(`not an image, the image file is a ${typeof image}`);
    }
    const uploadTask = storage.ref(`/images/${image.name}`).put(image);
    //initiates the firebase side uploading
    uploadTask.on(
      'state_changed',
      (snapShot) => {
        //takes a snap shot of the process as it is happening
        console.log(snapShot);
      },
      (err) => {
        //catches the errors
        console.log(err);
      },
      () => {
        // gets the functions from storage refences the image storage in firebase by the children
        // gets the download url then sets the image from firebase as the value for the imgUrl key:
        storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then((fireBaseUrl) => {
            setImageAsUrl(fireBaseUrl);
          });
      }
    );
  };
  return (
    <Row className='h-100'>
      <Colxx xxs='12' md='10' className='mx-auto my-auto'>
        <Card className='auth-card'>
          <div className='form-side'>
            <NavLink to={`/`} className='white'>
              <img src='/assets/img/nexusF-09.png' alt='logo' />
            </NavLink>
            <CardTitle className='mb-4'>Edit account</CardTitle>
            <Form>
              <div className='text-center navbar'>
                <img
                  alt='avatar'
                  src={imageAsUrl}
                  width='70px'
                  height='70px'
                  className='m-auto mb-1 avatar'
                  onClick={(e) => document.getElementById('file').click()}
                ></img>
                <input
                  type='file'
                  id='file'
                  onChange={(e) => uploadImage(e)}
                  style={{ display: 'none' }}
                ></input>
              </div>
              <Label className='form-group has-float-label mb-4'>
                Full name
                <Input
                  type='name'
                  defaultValue={name}
                  onChange={(e) => handleChange(e)}
                  name='name'
                />
              </Label>
              <Label className='form-group has-float-label mb-4'>
                Email
                <Input
                  type='email'
                  name='email'
                  defaultValue={email}
                  disabled={true}
                  onChange={(e) => handleChange(e)}
                />
              </Label>

              <div className='d-flex justify-content-end align-items-center'>
                <Button
                  color='primary'
                  className='btn-shadow'
                  size='lg'
                  onClick={() => onEditUser()}
                >
                  Save
                </Button>
                <Button
                  color='primary'
                  className='btn-shadow'
                  size='lg'
                  onClick={() => history.push('/user/forgot-password')}
                >
                  Rest Password
                </Button>
                <Button
                  color='primary'
                  className='ml-1 btn-shadow'
                  size='lg'
                  onClick={() => history.goBack()}
                >
                  Back
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
