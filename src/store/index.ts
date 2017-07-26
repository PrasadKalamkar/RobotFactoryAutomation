import { createStore, applyMiddleware, Store } from 'redux';
import rootReducer, { RootState } from '../reducers';
import thunk from 'redux-thunk';

export function configureStore(initialState?: RootState): Store<RootState> {
  return createStore(rootReducer, initialState, applyMiddleware(thunk));
}
