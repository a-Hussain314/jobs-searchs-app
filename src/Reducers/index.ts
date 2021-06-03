import {combineReducers} from 'redux';
import jobs from "./jobs";
import skills from './skills';
import jobSearchResults from './jobSearchResults'

export default combineReducers({
   jobs,
   jobSearchResults,
   skills
});

