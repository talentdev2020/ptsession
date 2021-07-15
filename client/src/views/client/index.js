import React, { Component, Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from '../../layout/AppLayout';
import { getUserInfo } from '../../redux/actions';

const Profile = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './profile')
);
const Ideas = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './ideas')
);
const Invite = React.lazy(() => import('./invite'));

class App extends Component {
  render() {
    const { match } = this.props;
    return (
      <AppLayout>
        <div className='dashboard-wrapper'>
          <Suspense fallback={<div className='loading' />}>
            <Switch>
              <Route
                exact
                path={`${match.url}/`}
                render={(props) => <Profile {...props} />}
              />
              <Route
                path={`${match.url}/invite`}
                render={(props) => <Invite {...props} />}
              />

              <Redirect to='/error' />
            </Switch>
          </Suspense>
        </div>
      </AppLayout>
    );
  }
}
const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};

export default withRouter(connect(mapStateToProps, { getUserInfo })(App));
