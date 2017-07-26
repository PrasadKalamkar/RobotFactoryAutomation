import { combineReducers, Reducer } from 'redux';
import RobotReducer from './RobotReducer';

export interface RootState {  
}

export default combineReducers<RootState>({
  RobotReducer
});
