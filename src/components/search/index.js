import React,{Component} from 'react';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import Config from '../../config';
import Mobile from './mobile';
// import Pc from './pc';

class Search extends Component{
	render(){
		let {state,dispatch} = this.props;
		let boundActionCreators = bindActionCreators(Actions, dispatch);
		return state.width < Config.media ? <Mobile data={state.searchData} {...boundActionCreators} /> : <Pc data={state} {...boundActionCreators} />
	}
}
Search = connect(state => ({state}))(Search);
export default Search;
