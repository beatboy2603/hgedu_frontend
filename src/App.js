import React, { Component } from 'react';
import Sidenav from './components/Sidenav';
import Home from './components/Home';
import PersonalLibrary from './components/PersonalLibrary';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import AbbreviationLibrary from './components/AbbreviationLibrary';
import StudentManagement from './components/StudentManagement';
import TestManagement from './components/TestManagement';
import LandingPage from './components/LandingPage';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import userReducer from './reducers/userReducer';
import UserInfo from './components/UserInfo';
import PersonalInfo from './components/PersonalInfo';
import personalInfoEdit from './components/PersonalInfoEdit';
const reducers = combineReducers({
  user: userReducer,
})

const store = createStore(reducers);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="App">
            <Sidenav />
            {/* Chuyen Post thanh News */}
            <Switch>
              <Route exact path='/' component={LandingPage} />
              <Route exact path='/home' component={Home} />
              {/* <Route path='/personalInfo' component={PersonalInfo} /> */}
              <Route path='/user' component={UserInfo} />
              {/* <Route path='/personalInfoEdit' component={personalInfoEdit} /> */}
              <Route path='/personalLibrary' component={PersonalLibrary} />
              <Route path='/personalLibrary/question/:questionId' component={PersonalLibrary} />
              <Route path='/abbreviationLibrary' component={AbbreviationLibrary} />
              <Route path='/studentManagement' component={StudentManagement} />
              <Route path='/testManagement' component={TestManagement} />
            </Switch>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
