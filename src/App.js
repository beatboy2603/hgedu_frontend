import React, { Component } from 'react';
import Sidenav from './components/common/Sidenav';
import Home from './components/Home';
import NotFoundPage from './components/NotFoundPage';
import PersonalLibrary from './components/personalLibrary/PersonalLibrary';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import AbbreviationLibrary from './components/abbreviation/AbbreviationLibrary';
import StudentList from './components/StudentClassManagement/StudentList';
import TestManagement from './components/Exams/TestManagement';
import DoExam from './components/Exams/DoExam';
import ExamInfo from './components/Exams/ExamInfo';
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
import { getAuthenCookie, setCookie } from './components/common/common';
import ViewNews from './components/News/ViewNews';
import PersonalInfo from './components/UserInfo/PersonalInfo';
import axios from 'axios';
import TeacherList from './components/StudentClassManagement/TeacherList';
import StudentManagement from './components/classManagement/StudentManagement'

import StudentExams from './components/Exams/StudentExams';
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
    isRender: false,
  }

  checkAuthen = () => {
    let isAuthenticated = getAuthenCookie();
    if (isAuthenticated) {
      axios.defaults.headers.common['Authorization'] = "Bearer " + store.getState().user.jwt;
    } else {
      axios.defaults.headers.common['Authorization'] = null;
    }
    this.setState({
      isAuthenticated
    })
  }

  componentDidMount() {
    setTimeout(() => {
      this.checkAuthen();
      console.log(store.getState());
      axios.defaults.headers.common['Authorization'] = "Bearer " + store.getState().user.jwt;
      axios.interceptors.response.use(function (response) {
        if (response.headers.wrongtoken) {
          axios.defaults.headers.common['Authorization'] = null;
          setCookie("authenticated", "false", -1);
          store.dispatch({ type: "SIGN_OUT", payload: null });
        }
        if (response.headers.renewtoken) {
          axios.defaults.headers.common['Authorization'] = "Bearer " + response.headers.renewtoken;
          store.dispatch({
            type: "UPDATE_USER", payload: {
              jwt: response.headers.renewtoken,
            }
          });
        }

        return response;
      }, function (error) {
        return Promise.reject(error);
      });
      this.setState({
        isRender: true,
      })
    }, 500);
  }

  render() {
    return (
      <div>
        {this.state.isRender &&
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <BrowserRouter>
                <div className="App" onClick={() => { this.checkAuthen() }}>
                  {window.location.pathname !== '/doExam' &&
                    <div style={{ zIndex: "1" }}>
                      <Sidenav isAuthenticated={this.state.isAuthenticated} />
                    </div>
                  }
                  <Switch>
                    <ProtectedRoute isAuthenticated={this.state.isAuthenticated} authenReq={false} exact path='/'>
                      <LandingPage checkAuthen={this.checkAuthen} />
                    </ProtectedRoute>

                    <ProtectedRoute isAuthenticated={this.state.isAuthenticated} authenReq={false} path='/signup'>
                      <SignUp />
                    </ProtectedRoute>

                    <ProtectedRoute isAuthenticated={this.state.isAuthenticated} authenReq={false} path='/signin'>
                      <SignIn />
                    </ProtectedRoute>

                    <ProtectedRoute isAuthenticated={this.state.isAuthenticated} authenReq={true} path='/home'>
                      <Home />
                    </ProtectedRoute>

                    <ProtectedRoute isAuthenticated={this.state.isAuthenticated} authenReq={true} path='/user'>
                      <UserInfo />
                    </ProtectedRoute>

                    <ProtectedRoute isAuthenticated={this.state.isAuthenticated} authenReq={true} path='/personalLibrary'>
                      <PersonalLibrary />
                    </ProtectedRoute>

                    <ProtectedRoute isAuthenticated={this.state.isAuthenticated} authenReq={true} path='/abbreviationLibrary'>
                      <AbbreviationLibrary />
                    </ProtectedRoute>

                    <ProtectedRoute isAuthenticated={this.state.isAuthenticated} authenReq={true} path='/studentManagement/studentList'>
                      <StudentList />
                    </ProtectedRoute>

                    <ProtectedRoute isAuthenticated={this.state.isAuthenticated} authenReq={true} path='/studentManagement/teacherList'>
                      <TeacherList />
                    </ProtectedRoute>

                    <ProtectedRoute isAuthenticated={this.state.isAuthenticated} authenReq={true} path='/studentManagement'>
                      <StudentManagement />
                    </ProtectedRoute>

                    <ProtectedRoute isAuthenticated={this.state.isAuthenticated} authenReq={true} exact path='/testManagement'>
                      <Redirect to="/testManagement/examHistory" />
                    </ProtectedRoute>

                    <ProtectedRoute isAuthenticated={this.state.isAuthenticated} authenReq={true} path='/testManagement/examSchedule'>
                      <TestManagement type={"SCHEDULE"} />
                    </ProtectedRoute>

                    <ProtectedRoute isAuthenticated={this.state.isAuthenticated} authenReq={true} path='/testManagement/examHistory'>
                      <TestManagement type={"HISTORY"} />
                    </ProtectedRoute>

                    {/* <Route exact path="/testManagement" render={() => (
                      <Redirect to="/testManagement/examHistory" />
                    )} />
                    <Route path='/testManagement/examSchedule' render={() => <TestManagement type="SCHEDULE" />} />
                    <Route path='/testManagement/examHistory' render={() => <TestManagement type="HISTORY" />} /> */}

                    <ProtectedRoute isAuthenticated={this.state.isAuthenticated} authenReq={true} path='/newsList'>
                      <NewsList />
                    </ProtectedRoute>

                    <ProtectedRoute isAuthenticated={this.state.isAuthenticated} authenReq={true} path='/testWord'>
                      <TestWord />
                    </ProtectedRoute>

                    <ProtectedRoute isAuthenticated={this.state.isAuthenticated} authenReq={true} path='/userManagement'>
                      <UserManagement />
                    </ProtectedRoute>

                    {/* <ProtectedRoute isAuthenticated={this.state.isAuthenticated} authenReq={true} path='/news/view/:newsTitle'>
                      <ViewNews />
                    </ProtectedRoute> */}
                    <Route path='/news/view/:newsTitle' component={ViewNews} />

                    <ProtectedRoute isAuthenticated={this.state.isAuthenticated} authenReq={true} path='/doExam'>
                      <DoExam />
                    </ProtectedRoute>

                    <ProtectedRoute isAuthenticated={this.state.isAuthenticated} authenReq={true} path='/examInfo'>
                      <ExamInfo />
                    </ProtectedRoute>

                    <ProtectedRoute isAuthenticated={this.state.isAuthenticated} authenReq={true} path='/studentExams'>
                      <StudentExams />
                    </ProtectedRoute>

                    <ProtectedRoute isAuthenticated={this.state.isAuthenticated} authenReq={true} path='/exam/:examTitle'>
                      <ExamInfo />
                    </ProtectedRoute>

                    <Route path="*" component={NotFoundPage} />

                    {/* <Route path='/user' component={UserInfo} />
                    <Route path='/personalLibrary' component={PersonalLibrary} />
                    <Route path='/abbreviationLibrary' component={AbbreviationLibrary} />
                    <Route path='/studentManagement/studentList' component={StudentList} />
                    <Route path='/studentManagement/teacherList' component={TeacherList} />
                    <Route path='/studentManagement' component={StudentManagement} />
                    <Route exact path="/testManagement" render={() => (
                      <Redirect to="/testManagement/examHistory" />
                    )} />
                    <Route path='/testManagement/examSchedule' render={() => <TestManagement type="SCHEDULE" />} />
                    <Route path='/testManagement/examHistory' render={() => <TestManagement type="HISTORY" />} />
                    <Route path='/newsList' component={NewsList} />
                    <Route path='/testWord' component={TestWord} />
                    <Route path='/userManagement' component={UserManagement} />
                    <Route path='/news/view/:newsTitle' component={ViewNews} />
                    <Route path='/doExam' component={DoExam} />
                    <Route path='/examInfo' component={ExamInfo} />
                    <Route path='/studentExams' component={StudentExams} />
                    <Route path='/exam/:examTitle' component={ExamInfo} /> */}

                    {/* <Route path='/userInfo' component={UserInfo}/> */}
                  </Switch>
                </div>
              </BrowserRouter>
            </PersistGate>
          </Provider>
        }
      </div>
    );
  }
}

export default App;
