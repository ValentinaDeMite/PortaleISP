import { applyMiddleware, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {thunk} from 'redux-thunk'; 
import { combineReducers } from 'redux';



// Stato iniziale
const initialState = {
  sidebarShow: true,
  projects: [],  // Assicurati che questo stato esista se ti serve per caricare i progetti
  selectedProject: null // Inizializza a null
};

// Reducer
const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }; // Assicurati che `rest` contenga `projects: data.values`
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

// Configura il rootReducer se usi `combineReducers`
const rootReducer = combineReducers({
  app: changeState
});
const persistedReducer = persistReducer(persistConfig, changeState);

const store = createStore(persistedReducer, applyMiddleware(thunk));

const persistor = persistStore(store);

// Esporta sia lo store che il persistor
export { store, persistor };
