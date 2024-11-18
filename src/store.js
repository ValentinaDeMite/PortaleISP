import { applyMiddleware, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {thunk} from 'redux-thunk'; 
import { combineReducers } from 'redux';



// Stato iniziale
const initialState = {
  sidebarShow: true,
  projects: [],  
  selectedProject: null
};

// Reducer
const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest };
    case 'setSelectedProject':
      return { ...state, selectedProject: rest.projectDetails };
    default:
      return state;
  }
};



// Configurazione di redux-persist
const persistConfig = {
  key: 'root',
  storage, 
};

const rootReducer = combineReducers({
  app: changeState
});
const persistedReducer = persistReducer(persistConfig, changeState);

const store = createStore(persistedReducer, applyMiddleware(thunk));

const persistor = persistStore(store);

export { store, persistor };
