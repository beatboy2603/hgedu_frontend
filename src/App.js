import React, { Component } from 'react';
import Sidenav from './components/common/Sidenav';
import Home from './components/Home';
import PersonalLibrary from './components/personalLibrary/PersonalLibrary';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import AbbreviationLibrary from './components/abbreviation/AbbreviationLibrary';
import StudentManagement from './components/StudentManagement';
import TestManagement from './components/personalLibrary/test/TestManagement';
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
import UserInfo from './components/UserInfo';
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
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <div className="App">
              <Sidenav />
              <Switch>
                <Route exact path='/' component={LandingPage} />
                <Route path='/home' component={Home} />
                <Route path='/signup' component={SignUp} />
                <Route path='/signin' component={SignIn} />
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
