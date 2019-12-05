import React, { Component } from 'react';
import Sidenav from './components/common/Sidenav';
import Home from './components/Home';
import PersonalLibrary from './components/personalLibrary/PersonalLibrary';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import AbbreviationLibrary from './components/abbreviation/AbbreviationLibrary';
import StudentManagement from './components/StudentManagement';
import TestManagement from './components/Exams/TestManagement';
import LandingPage from './components/LandingPage';
import NewsList from './components/News/NewsList';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { Provider } from 'react-redux';
// import userReducer from './reducers/userReducer';
// import { combineReducers, createStore } from 'redux';
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import { store, persistor } from './components/common/Store'
import SignUp from './components/common/SignUp';
import SignIn from './components/common/SignIn';
import UserInfo from './components/UserInfo/UserInfo';
import TestWord from './components/TestWord';
import ProtectedRoute from './components/common/ProtectedRoute';
import UserManagement from './components/UserManagement/UserManagement';
import { getAuthenCookie } from './components/common/common';
import ViewNews from './components/News/ViewNews';
// const persistConfig = {
//   key: 'root',
//   storage: storage,
// };

// const reducers = combineReducers({
//   user: userReducer,
// })

// const persistedReducer = persistReducer(persistConfig, reducers);

// const store = createStore(persistedReducer);
// const persistor = persistStore(store);

class App extends Component {
  state = {
    isAuthenticated: false,
  }

  checkAuthen = () => {
    let isAuthenticated = getAuthenCookie();
    this.setState({
      isAuthenticated
    })
  }

  componentDidMount() {
    this.checkAuthen();
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <div className="App" onClick={() => { this.checkAuthen() }}>
              <div style={{ zIndex: "1" }}>
                <Sidenav isAuthenticated={this.state.isAuthenticated} />
              </div>
              <Switch>
                <ProtectedRoute isAuthenticated={this.state.isAuthenticated} authenReq={false} exact path='/'>
                  <LandingPage />
                </ProtectedRoute>
                <ProtectedRoute isAuthenticated={this.state.isAuthenticated} authenReq={true} path='/home'>
                  <Home />
                </ProtectedRoute>
                {/* <ProtectedRoute isAuthenticated={this.state.isAuthenticated} authenReq={true} children={Home} path='/home'/> */}
                {/* <Route path='/home' component={Home} /> */}
                <Route path='/user' component={UserInfo} />
                <ProtectedRoute isAuthenticated={this.state.isAuthenticated} authenReq={false} path='/signup'>
                  <SignUp />
                </ProtectedRoute>
                {/* <Route path='/signup' component={SignUp} /> */}
                <ProtectedRoute isAuthenticated={this.state.isAuthenticated} authenReq={false} path='/signin'>
                  <SignIn />
                </ProtectedRoute>
                {/* <Route path='/signin' component={SignIn} /> */}
                <Route path='/personalLibrary' component={PersonalLibrary} />
                <Route path='/personalLibrary/question/:questionId' component={PersonalLibrary} />
                <Route path='/abbreviationLibrary' component={AbbreviationLibrary} />
                <Route path='/studentManagement' component={StudentManagement} />
                <Route exact path="/testManagement" render={() => (
                    <Redirect to="/testManagement/examHistory"/>
                )}/>
                <Route path='/testManagement/examSchedule' render={ () => <TestManagement type="SCHEDULE"/> } />
                <Route path='/testManagement/examHistory' render={() => <TestManagement type="HISTORY"/>} />
                <Route path='/newsList' component={NewsList} />
                <Route path='/testWord' component={TestWord} />
                <Route path='/userManagement' component={UserManagement} />
                <Route path='/news/view/:newsTitle' component={ViewNews} />
                {/* <Route path='/userInfo' component={UserInfo}/> */}
              </Switch>
            </div>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
