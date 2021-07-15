import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import { connect, useDispatch } from 'react-redux';
import Avatar from 'react-avatar-edit';
import * as Yup from 'yup';
import {
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Label,
  Button,
  CardTitle,
} from 'reactstrap';
import { Colxx } from '../../components/common/CustomBootstrap';
import { updateProfile } from '../../redux/actions';
import { authUser } from '../../redux/reducers';

const SignupSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required!'),
  lastName: Yup.string().required('Last Name is required!'),
  contactEmail: Yup.string()
    .email('Invalid email address')
    .required('Email is required!'),
  phone: Yup.string().required('Phone Number is required!'),
  address: Yup.string(),
});

class EditProfileForm extends Component {
  constructor(props) {
    super(props);
    const avatarSrc = props.data.avatar || '/assets/img/default_avatar.png';
    // Object.keys(this.props.data.contacts).map(key => {

    // })
    this.state = {
      avatarPreview: '',
      avatarSrc,
      bio: this.props.data.bio || '',
      address: this.props.data.address || '',
    };
    this.onAvatarCrop = this.onAvatarCrop.bind(this);
    this.onAvatarClose = this.onAvatarClose.bind(this);
    this.onBeforeFileLoad = this.onBeforeFileLoad.bind(this);
  }

  handleSubmit = (values, { setSubmitting }) => {
    console.log('values', values);
    const { facebook, twitter, instagram, tiktok, website, address } = values;
    const contacts = { facebook, twitter, instagram, tiktok, website };
    const data = {
      ...values,
      avatar: this.state.avatarPreview,
      bio: this.state.bio,
      contacts: contacts,
      address,
    };
    this.props.updateProfile({ id: this.props.authUser.authID, data });
  };

  onAvatarClose() {
    this.setState({ avatarPreview: null });
  }

  onAvatarCrop(avatarPreview) {
    this.setState({ avatarPreview });
  }

  onBeforeFileLoad(elem) {
    if (elem.target.files[0].size > 71680) {
      alert('File is too big!');
      elem.target.value = '';
    }
  }

  handleChangeInput = (e, type) => {
    this.setState({ [type]: e.target.value });
  };

  render() {
    return (
      <div>
        <Row className='mb-4'>
          <Colxx xxs='12'>
            <Card>
              <CardBody>
                <Formik
                  initialValues={{
                    firstName: this.props.data.firstName || '',
                    lastName: this.props.data.lastName || '',
                    contactEmail:
                      this.props.data.contactEmail || this.props.data.email,
                    phone: this.props.data.phone || '',
                    address: this.props.data.address || '',
                    facebook: this.props.data.contacts.facebook || '',
                    instagram: this.props.data.contacts.instagram || '',
                    twitter: this.props.data.contacts.twitter || '',
                    tiktok: this.props.data.contacts.tiktok || '',
                    website: this.props.data.contacts.website || '',
                  }}
                  validationSchema={SignupSchema}
                  onSubmit={this.handleSubmit}
                >
                  {({
                    handleSubmit,
                    setFieldValue,
                    setFieldTouched,
                    handleChange,
                    handleBlur,
                    values,
                    errors,
                    touched,
                    isSubmitting,
                  }) => (
                    <Form className='av-tooltip tooltip-label-bottom'>
                      <Row className='align-items-center mb-5'>
                        <Col>
                          <Avatar
                            label={'Choose Your Avatar'}
                            width={200}
                            height={200}
                            onCrop={this.onAvatarCrop}
                            onClose={this.onAvatarClose}
                            onBeforeFileLoad={this.onBeforeFileLoad}
                            src={this.state.avatarSrc}
                          />
                        </Col>
                        {this.state.avatarPreview && (
                          <Col>
                            <img
                              style={{ width: '100', height: '100' }}
                              src={this.state.avatarPreview}
                              alt='Preview'
                            />
                          </Col>
                        )}
                      </Row>
                      <Row>
                        <FormGroup className='col col-6 form-group has-float-label'>
                          <Label className='ml-3'>First Name</Label>
                          <Field className='form-control' name='firstName' />
                          {errors.firstName && touched.firstName ? (
                            <div className='invalid-feedback d-block'>
                              {errors.firstName}
                            </div>
                          ) : null}
                        </FormGroup>
                        <FormGroup className='col col-6 form-group has-float-label'>
                          <Label className='ml-3'>Last Name</Label>
                          <Field className='form-control' name='lastName' />
                          {errors.lastName && touched.lastName ? (
                            <div className='invalid-feedback d-block'>
                              {errors.lastName}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Row>
                      <Row>
                        <FormGroup className='col col-6 form-group has-float-label'>
                          <Label className='ml-3'>Contact Email</Label>
                          <Field className='form-control' name='contactEmail' />
                          {errors.contactEmail && touched.contactEmail ? (
                            <div className='invalid-feedback d-block'>
                              {errors.contactEmail}
                            </div>
                          ) : null}
                        </FormGroup>
                        <FormGroup className='col col-6 form-group has-float-label'>
                          <Label className='ml-3'>Phone Number</Label>
                          <Field className='form-control' name='phone' />
                          {errors.phone && touched.phone ? (
                            <div className='invalid-feedback d-block'>
                              {errors.phone}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Row>
                      <Row>
                        <FormGroup className='col form-group has-float-label'>
                          <Label className='ml-3'>Address</Label>
                          <Field className='form-control' name='address' />
                        </FormGroup>
                      </Row>
                      <Row>
                        <FormGroup className='col form-group has-float-label'>
                          <Label className='ml-3'>Facebook</Label>
                          <Field className='form-control' name='facebook' />
                        </FormGroup>
                      </Row>
                      <Row>
                        <FormGroup className='col form-group has-float-label'>
                          <Label className='ml-3'>Twitter</Label>
                          <Field className='form-control' name='twitter' />
                        </FormGroup>
                      </Row>
                      <Row>
                        <FormGroup className='col form-group has-float-label'>
                          <Label className='ml-3'>Instagram</Label>
                          <Field className='form-control' name='instagram' />
                        </FormGroup>
                      </Row>
                      <Row>
                        <FormGroup className='col form-group has-float-label'>
                          <Label className='ml-3'>TikTok</Label>
                          <Field className='form-control' name='tiktok' />
                        </FormGroup>
                      </Row>
                      <Row>
                        <FormGroup className='col form-group has-float-label'>
                          <Label className='ml-3'>Personal Website</Label>
                          <Field className='form-control' name='website' />
                        </FormGroup>
                      </Row>
                      <Row>
                        <FormGroup className='col form-group has-float-label'>
                          <Label className='ml-3'>Your Goals</Label>
                          <textarea
                            className='form-control'
                            name='bio'
                            value={this.state.bio}
                            onChange={(e) => this.handleChangeInput(e, 'bio')}
                          />
                        </FormGroup>
                      </Row>

                      <Button
                        color='primary'
                        type='submit'
                        style={{ marginRight: '15px' }}
                      >
                        Save
                      </Button>
                      <Button
                        color='secondary'
                        onClick={this.props.editProfile}
                      >
                        Close
                      </Button>
                    </Form>
                  )}
                </Formik>
              </CardBody>
            </Card>
          </Colxx>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  return { authUser };
};
export default connect(mapStateToProps, { updateProfile })(EditProfileForm);
