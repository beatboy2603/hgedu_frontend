import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers, createStore } from 'redux';

import userReducer from '../../reducers/userReducer';

const persistConfig = {
    key: 'root',
    storage: storage,
};

const reducers = combineReducers({
    // root: rootReducer,
    user: userReducer,
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

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
