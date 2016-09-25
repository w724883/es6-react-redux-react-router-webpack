import React,{Component} from 'react';
import { Link } from 'react-router';
import * as Actions from '../../actions';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import Layer from '../layer';
import {Loading} from '../loading';
class CartFixed extends Component{
	constructor(){
		super();
		this.state = {
			nav:false
		}
	}
	handleClick(e){
		let callback = this.props.handleClick;
		callback && callback();
		// return false;
	}
	handleShowNav(){
		this.setState({
			nav:true
		})
	}
	handleHideNav(){
		this.setState({
			nav:false
		})
	}
	render(){
		return (
			<div className="cart-fixed">
				<div className="cart-bar">
					<p onClick={this.handleShowNav.bind(this)}>
						<i className="icon-product"></i>
						<strong>已选 <span className="price">688.00</span></strong>
					</p>
					<div className="cart-btns">
					{this.props.data.link ? <Link to={this.props.data.link} onClick={this.handleClick.bind(this)}>{this.props.data.btn}</Link> : <a href="javascript:;" onClick={this.handleClick.bind(this)}>{this.props.data.btn}</a>}
					</div>
					<CSSTransitionGroup
						component="div"
		              	transitionLeaveTimeout={400}
		              	transitionEnterTimeout={400}
		              	transitionName="transition-cartfix">
		              	{this.state.nav ? (<div className="cart-nav">
		              		<a href="javascript:;" onClick={this.handleHideNav.bind(this)}><i className="icon-close"></i></a>
		              		<Link to="/" activeClassName="active"><i className="icon-home"></i></Link>
		              		<Link to="/category" activeClassName="active"><i className="icon-product"></i></Link>
		              		<Link to="/show" activeClassName="active"><i className="icon-yelp"></i></Link>
		              		<Link to="/personal" activeClassName="active"><i className="icon-account"></i></Link>
		              	</div>) : null}
					</CSSTransitionGroup>
				</div>
			</div>
		)
	}
}

export default CartFixed;
