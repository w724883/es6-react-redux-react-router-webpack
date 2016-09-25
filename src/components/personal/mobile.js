import React from 'react';
// import { connect } from 'react-redux';
// import { Link,browserHistory } from 'react-router';
// import CSSTransitionGroup from 'react-addons-css-transition-group';
// import Layer from '../layer';
// import {Loading} from '../loading';

// import * as Actions from '../../actions';
// import CartFixed from '../fixed/cartFixed';
// import TopFixed from '../fixed/topFixed';
import Config from '../../config';
import './mobile.scss';
import "zepto";
class Personal extends React.Component {
	constructor(){
		super();
		this.state = {
			
		}
	}
	
	render(){
		return (
			<div className="personal">
				<div className="personal-head"></div>
				<p className="personal-username"></p>
				<div className="personal-head-line"></div>
				<ul className="personal-account">
					<li>
						<i className=""></i>
						<span>
							<strong>666</strong>
							<em>账户余额</em>
						</span>
					</li>
					<li className="personal-account-line"></li>
					<li>
						<i className=""></i>
						<span>
							<strong>666</strong>
							<em>账户积分</em>
						</span>
					</li>
				</ul>
			</div>
		)
		
	}
}
// Pay = connect(state => ({state}))(Pay);
export default Personal;