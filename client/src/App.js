import React, { Component, Suspense } from 'react';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';
import { IntlProvider } from 'react-intl';
import './helpers/Firebase';
import AppLocale from './lang';
import { isDemo } from './constants/defaultValues';
import { getDirection } from './helpers/Utils';
import '../src/assets/css/sass/custom.scss';
import { getUserInfo } from './redux/actions';

const ViewMain = React.lazy(() =>
  import(/* webpackChunkName: "views" */ './views')
);
const ViewTrainer = React.lazy(() =>
  import(/* webpackChunkName: "views-trainer" */ './views/trainer')
);
const ViewClient = React.lazy(() =>
  import(/* webpackChunkName: "views-client" */ './views/client')
);
const ViewUser = React.lazy(() =>
  import(/* webpackChunkName: "views-user" */ './views/user')
);
const ViewError = React.lazy(() =>
  import(/* webpackChunkName: "views-error" */ './views/error')
);
const Account = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './views/account')
);
const Admin = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './views/admin')
);
const AuthRoute = ({ component: Component, authUser, role, ...rest }) => {
  const token = localStorage.getItem('access_token');
  const location = rest.location.pathname;
  console.log('location', location);
  return (
    <Route
      {...rest}
      render={(props) =>
        token || location.includes('/trainer/public_profile') ? (
          <Component role={role} {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/user/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    const direction = getDirection();
    if (direction.isRtl) {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }
    document.body.classList.add('rounded');
  }

  componentDidMount() {
    this.props.getUserInfo(this.props.history);
  }

  componentDidUpdate() {}

  render() {
    const { locale, authUser, role } = this.props;
    const currentAppLocale = AppLocale[locale];
    return (
      <div className='h-100'>
        <IntlProvider
          locale={currentAppLocale.locale}
          messages={currentAppLocale.messages}
        >
          <React.Fragment>
            <Suspense fallback={<div className='loading' />}>
              <Router>
                <Switch>
                  <AuthRoute
                    path='/trainer'
                    authUser={authUser}
                    role={role}
                    component={ViewTrainer}
                  />
                  <AuthRoute
                    path='/client'
                    authUser={authUser}
                    role={role}
                    component={ViewClient}
                  />
                  <AuthRoute
                    path='/account'
                    authUser={authUser}
                    component={Account}
                  />
                  <AuthRoute
                    path='/admin'
                    authUser={authUser}
                    component={Admin}
                  />
                  <Route
                    path='/user'
                    render={(props) => <ViewUser {...props} />}
                  />
                  <Route
                    path='/error'
                    exact
                    render={(props) => <ViewError {...props} />}
                  />
                  <Route
                    path='/'
                    exact
                    render={(props) => <ViewMain {...props} />}
                  />
                  <Redirect to='/error' />
                </Switch>
              </Router>
            </Suspense>
          </React.Fragment>
        </IntlProvider>
        <NotificationContainer />
      </div>
    );
  }
}

const mapStateToProps = ({ authUser, settings }) => {
  const { locale } = settings;
  return { authUser, locale };
};
const mapActionsToProps = { getUserInfo };

export default connect(mapStateToProps, mapActionsToProps)(App);
