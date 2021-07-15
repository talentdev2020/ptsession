import React, { useEffect, useState, useCallback } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Row,
  Card,
  CardTitle,
  Button,
  Table,
  FormGroup,
  Label,
  Col,
  CardBody,
} from 'reactstrap';
import * as Yup from 'yup';
import { Colxx } from '../../components/common/CustomBootstrap';
import { connect, useDispatch } from 'react-redux';
import axios from 'axios';
import { getItem } from '../../redux/actions';
import { apiUrl } from '../../constants/defaultValues';
import { withRouter } from 'react-router';
import ReactTable from 'react-table';
import data from '../../data/products';
import DataTablePagination from '../../components/DatatablePagination';

const PackageSchema = Yup.object().shape({
  name: Yup.string().required('Package Name is required!'),
  count: Yup.number().min(1).required('Session Count is required!'),
  cost: Yup.number().min(1).required('Package Cost is required!'),
});

const Packages = ({ history, authUser, trainerApp, ...props }) => {
  const [packages, setPackages] = useState([]);
  const [editItem, setEditItem] = useState({});

  const fetchPackages = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    const config = {
      headers: { 'x-access-token': token },
    };
    try {
      const res = await axios.get(
        `${apiUrl}trainer/packages/${authUser.authID}`,
        config
      );
      setPackages(res.data.data);
      return res.data.data;
    } catch (err) {
      console.log('err', err);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const addPackage = async (values, { setSubmitting }) => {
    console.log('values', values);
    const token = localStorage.getItem('access_token');
    const config = {
      headers: { 'x-access-token': token },
    };
    console.log('config', config);
    const res = await axios.post(
      `${apiUrl}trainer/addPackage `,
      { packageData: values, trainerID: authUser.authID },
      config
    );
    setPackages([res.data.data, ...packages]);
  };

  const removePackage = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      const token = localStorage.getItem('access_token');
      const config = {
        headers: { 'x-access-token': token },
      };
      const res = await axios.delete(
        `${apiUrl}trainer/removePackage/${id}`,
        config
      );

      if (!res.data.error) {
        const newPackages = packages.filter(
          (packageItem) => packageItem._id !== id
        );
        setPackages(newPackages);
      }
    }
  };

  const editPackage = async (packageItem) => {
    setEditItem(packageItem);
  };

  const editPackageName = (e) => {
    setEditItem({ ...editItem, name: e.target.value });
  };

  const editSessionCount = (e) => {
    setEditItem({ ...editItem, count: e.target.value });
  };

  const editPackageCost = (e) => {
    setEditItem({ ...editItem, cost: e.target.value });
  };

  const saveEdit = async () => {
    if (!editItem.name) {
      alert('Package Name is required.');
    } else if (!editItem.cost) {
      alert('Package Cost is required.');
    } else if (!editItem.count) {
      alert('Session Count is required.');
    } else {
      const token = localStorage.getItem('access_token');
      const config = {
        headers: { 'x-access-token': token },
      };
      await axios.post(`${apiUrl}trainer/updatePackage`, { editItem }, config);
      const updatedPackages = packages.map((packageItem) => {
        if (packageItem._id === editItem._id) {
          packageItem.name = editItem.name;
          packageItem.cost = editItem.cost;
          packageItem.count = editItem.count;
        }
        return packageItem;
      });
      setPackages(updatedPackages);
      setEditItem({});
    }
  };

  const cancelEdit = () => {
    setEditItem({});
  };

  return (
    <Row className='h-100'>
      <Colxx xxs='12' md='10' className='mx-auto my-auto'>
        <Card className='auth-card'>
          <div className='text-center'>
            <Row>
              <Colxx xxs='12'>
                <Formik
                  initialValues={{
                    name: '',
                    cost: 0,
                    count: 0,
                  }}
                  validationSchema={PackageSchema}
                  onSubmit={addPackage}
                >
                  {({
                    addPackage,
                    setFieldValue,
                    setFieldTouched,
                    handleChange,
                    handleBlur,
                    values,
                    errors,
                    touched,
                    isSubmitting,
                  }) => (
                    <Form className='av-tooltip tooltip-label-bottom mb-4'>
                      <CardTitle className='mb-4'>
                        <h2>Packages</h2>
                      </CardTitle>
                      <Row>
                        <FormGroup className='col col-4 form-group has-float-label'>
                          <Label className='ml-3'>Package Name</Label>
                          <Field className='form-control' name='name' />
                          {errors.name && touched.name ? (
                            <div className='invalid-feedback d-block'>
                              {errors.name}
                            </div>
                          ) : null}
                        </FormGroup>
                        <FormGroup className='col col-4 form-group has-float-label'>
                          <Label className='ml-3'>Session Count</Label>
                          <Field className='form-control' name='count' />
                          {errors.count && touched.count ? (
                            <div className='invalid-feedback d-block'>
                              {errors.count}
                            </div>
                          ) : null}
                        </FormGroup>
                        <FormGroup className='col col-4 form-group has-float-label'>
                          <Label className='ml-3'>Cost</Label>
                          <Field className='form-control' name='cost' />
                          {errors.cost && touched.cost ? (
                            <div className='invalid-feedback d-block'>
                              {errors.cost}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Row>

                      <Button
                        color='primary'
                        className='ml-1 btn-shadow'
                        size='lg'
                        type='submit'
                      >
                        Add
                      </Button>
                      <Button
                        color='primary'
                        className='ml-1 btn-shadow'
                        size='lg'
                        onClick={() => history.goBack()}
                      >
                        Back
                      </Button>
                    </Form>
                  )}
                </Formik>
              </Colxx>
            </Row>
            <Table>
              <thead>
                <tr>
                  <th>Package Name</th>
                  <th>Session Count</th>
                  <th>Package Cost</th>
                  <th>Edit / Delete</th>
                </tr>
              </thead>
              <tbody>
                {packages &&
                  packages.map((packageItem, index) => {
                    return editItem && editItem._id !== packageItem._id ? (
                      <tr key={index}>
                        <td>{packageItem.name}</td>
                        <td>{packageItem.count}</td>
                        <td>{packageItem.cost}</td>
                        <td>
                          <i
                            className='simple-icon-edit heading-icon'
                            style={{ cursor: 'pointer', marginRight: '10px' }}
                            onClick={() => editPackage(packageItem)}
                          />
                          <i
                            className='simple-icon-trash heading-icon'
                            style={{ cursor: 'pointer' }}
                            onClick={() => removePackage(packageItem._id)}
                          />
                        </td>
                      </tr>
                    ) : (
                      <tr key={index}>
                        <td>
                          <input
                            type='text'
                            value={editItem.name}
                            name='editPackageName'
                            onChange={(e) => editPackageName(e)}
                          ></input>
                        </td>
                        <td>
                          <input
                            type='text'
                            value={editItem.count}
                            name='editSessionCount'
                            onChange={(e) => editSessionCount(e)}
                          ></input>
                        </td>
                        <td>
                          <input
                            type='text'
                            name='editPackageCost'
                            value={editItem.cost}
                            onChange={(e) => editPackageCost(e)}
                          ></input>
                        </td>
                        <td>
                          <i
                            className='simple-icon-check heading-icon'
                            style={{ cursor: 'pointer', marginRight: '10px' }}
                            onClick={() => saveEdit()}
                          />
                          <i
                            className='simple-icon-close heading-icon'
                            style={{ cursor: 'pointer' }}
                            onClick={() => cancelEdit()}
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </div>
        </Card>
      </Colxx>
    </Row>
  );
};
const mapStateToProps = ({ authUser, trainerApp }) => {
  return { authUser, trainerApp };
};
export default connect(mapStateToProps, {
  getItem,
})(Packages);
