import { applyMiddleware, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {thunk} from 'redux-thunk'; 

// Stato iniziale
const initialState = {
  sidebarShow: true,
};

// Reducer
const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest };
    default:
      return state;
  }
};

// Configurazione di redux-persist
const persistConfig = {
  key: 'root',
  storage, // Usa lo storage locale
};

// Persistente reducer
const persistedReducer = persistReducer(persistConfig, changeState);

// Crea lo store con il reducer persistente e middleware redux-thunk
const store = createStore(persistedReducer, applyMiddleware(thunk));

// Crea il persistor
const persistor = persistStore(store);

// Esporta sia lo store che il persistor
export { store, persistor };
