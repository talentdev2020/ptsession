import React, { Component, Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from '../../layout/AppLayout';

const Clients = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './clients')
);
const ViewClient = React.lazy(() => import('./view_client'));
const Profile = React.lazy(() => import('./profile'));
const Packages = React.lazy(() => import('./packages'));
const PublicProfile = React.lazy(() => import('./public_profile'));
const Ideas = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './ideas')
);

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
                render={(props) => <Clients {...props} />}
              />
              <Route
                exact
                path={`${match.url}/profile`}
                render={(props) => <Profile {...props} />}
              />
              <Route
                path={`${match.url}/client`}
                render={(props) => <ViewClient {...props} />}
              />
              <Route
                path={`${match.url}/packages`}
                render={(props) => <Packages {...props} />}
              />

              <Route
                path={`${match.url}/public_profile`}
                render={(props) => <PublicProfile {...props} />}
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

export default withRouter(connect(mapStateToProps, {})(App));
