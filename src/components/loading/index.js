import React,{Component} from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import {setPop} from '../../actions';
import "./index.scss";
import gif from "../../static/imgs/loading.gif";

class Loading extends Component{
	constructor(props){
		super(props);
		this.state = {data:props.hotData};
	}
	handleTouchstart(e){
		e.preventDefault();
		e.stopPropagation();
		return false;
	}
	render(){
		let loading = this.props.data;
		return (
			<CSSTransitionGroup
				component="div"
              	transitionEnterTimeout={200}
              	transitionLeaveTimeout={500}
              	transitionName="transition-loading">
				{loading ? <div className="loading" style={{backgroundImage:"url("+gif+")"}} onTouchStart={this.handleTouchstart}></div> : null}
			</CSSTransitionGroup>
		)
	}
}
export default Loading;
