import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk'

import userReducer from '../../reducers/userReducer';
import errorReducer from '../../reducers/errorReducer';
import classReducer from '../../reducers/classReducer';
import examReducer from '../../reducers/examReducer';
import examTestReducer from '../../reducers/examTestReducer';
import folderReducer from '../../reducers/folderReducer';
import abbreviationReducer from '../../reducers/abbreviationReducer';
import questionReducer from '../../reducers/questionReducer';

const persistConfig = {
    key: 'root',
    storage: storage,
    blacklist: ['error', 'class', 'exam', 'examTest',"folder"],
};

const reducers = combineReducers({
    // root: rootReducer,
    user: userReducer,
    error: errorReducer,
    class: classReducer,
    exam: examReducer,
    examTest: examTestReducer,
    folder: folderReducer,
    abbreviation: abbreviationReducer,
    question: questionReducer,
})

const rootReducer = (state, action) => {
    if (action.type === 'SIGN_OUT') {
        storage.removeItem('persist:root');
        storage.removeItem('persist:user');
        state = undefined;
    }

    return reducers(state, action);
}

const persistedReducer = persistReducer(persistConfig, rootReducer);
const midlleware = [thunk]

export const store = createStore(
    persistedReducer,
    compose(applyMiddleware(...midlleware)),
);
export const persistor = persistStore(store);
