import React, { useEffect, useState } from 'react';

import { Row, Card, CardTitle, Button } from 'reactstrap';
import { Colxx } from '../components/common/CustomBootstrap';
import { withRouter } from 'react-router';
// import { store } from "../helpers/Firebase";

const Register = ({ history }) => {
  const [emails, setEmails] = useState([]);

  const clickDelete = async (id) => {
    const conf = window.confirm(
      'Are you sure remove this email from the table?'
    );
    if (conf) {
      try {
        // await store.collection('users').doc(id).delete();
      } catch (error) {}
    }
  };
  const clickEdit = async (id, email) => {
    const conf = window.prompt('Please the input the email', email);
    if (conf) {
      try {
        if (email !== conf) {
          // await store.collection('users').doc(id).update({ email: conf });
        }
      } catch (error) {}
    }
  };
  const ValidateEmail = (value) => {
    let error;
    if (!value) {
      error = 'Please enter your email address';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = 'Invalid email address';
    }
    return error;
  };
  const onAddUser = async () => {
    const email = prompt('Please input the email you want to approve');
    const error = ValidateEmail(email);
    if (error) {
      alert(error);
    } else {
      const temp = emails.map((item) => {
        return item.email;
      });
      if (temp.includes(email)) {
        alert('This email already exist');
      } else {
        // let res = await store.collection('users').add({ email });
        // let arr = emails;
        // arr.push({ id: res.id, email });
        // setEmails(arr);
      }
    }
  };
  useEffect(() => {
    async function fecthData() {
      // let res = await store
      //   .collection('users')
      //   .get()
      //   .then((querySnapshot) => {
      //     let result = querySnapshot.docs.map((doc) => {
      //       return { id: doc.id, ...doc.data() };
      //     });
      //     if (result.length === 0) return [];
      //     else return result;
      //   });
      // setEmails(res);
    }
    fecthData();
  });
  return (
    <Row className='h-100'>
      <Colxx xxs='12' md='10' className='mx-auto my-auto'>
        <Card className='auth-card'>
          <div className='form-side text-center'>
            <CardTitle className='mb-4'>
              <h2>Admin Page</h2>
              <div className='d-flex justify-content-end align-items-center'>
                <Button
                  color='primary'
                  className='btn-shadow'
                  size='lg'
                  onClick={() => onAddUser()}
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
              </div>
            </CardTitle>
            <table>
              <thead>
                <tr>
                  <th width='50px'>No</th>
                  <th className='text-center'>Approved Emails</th>
                  <th width='50px'>Action</th>
                </tr>
              </thead>
              <tbody>
                {emails &&
                  emails.map((item, index) => {
                    return (
                      <tr key={'tr_' + index}>
                        <td>{index + 1}</td>
                        <td className='text-center' style={{ width: '90%' }}>
                          {item.email}
                        </td>
                        <td>
                          <i
                            className='simple-icon-edit heading-icon'
                            style={{ cursor: 'pointer', marginRight: '10px' }}
                            onClick={() => clickEdit(item.id, item.email)}
                          />
                          <i
                            className='simple-icon-trash heading-icon'
                            style={{ cursor: 'pointer' }}
                            onClick={() => clickDelete(item.id)}
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </Card>
      </Colxx>
    </Row>
  );
};
export default withRouter(Register);
