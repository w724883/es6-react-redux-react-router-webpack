import React,{Component} from 'react';
import { connect } from 'react-redux';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router';
import Config from '../../config';
import * as Actions from '../../actions';
import Focus from '../focus/mobile';
import "zepto";
import "./index.scss";


class Details extends Component{
	constructor(props){
		super(props);
		this.getFocusData = this.getFocusData.bind(this);
		this.state = {
			focusData:[]
		}
	}
	getFocusData(){
		let self = this;
		let dfd = $.Deferred();
		let {dispatch} = this.props;
		$.get(Config.api.details,function(res){
			if(res.code == 200){
				// dispatch(Actions.setFocus(res.data));
				self.setState({
					focusData:res.data
				})
			}else{
				console.log(res.message);
			}
			
		}).fail(function(error){
			console.log(error);
		}).always(function(){
			dfd.resolve();
			// dfd.resolve();
			// dfd.reject();
		});
		return dfd.promise();
	}
	componentWillMount(){
		let {dispatch} = this.props;
		var dfdTasks = [];
		dfdTasks.push(this.getFocusData());

		$.when.apply(null,dfdTasks).done(function(){
			dispatch(Actions.setLoading(false));
		});
	}
	
	render(){
		let focusData = this.state.focusData;
		return (
			<div>
				{focusData.length ? <Focus data={focusData} /> : ""}
			</div>
		)
	}
}
Details = connect(state => ({state}))(Details);
export default Details;
