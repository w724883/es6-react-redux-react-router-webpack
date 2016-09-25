import React,{Component} from 'react';
import 'zepto';
import './mobile.scss';
class TopFixed extends Component{
	handleScroll(){
		let container = this.props.element;
		if(typeof container == "string"){
			container = $(container);
			container && $(container).scrollTop(0);
		}
		$(window).scrollTop(0);
	}

	render(){
		let title = this.props.data;
		return (
			<div className="fix-top"  onClick={this.handleScroll.bind(this)}>{title}</div>
		)
	}
}

export default TopFixed;
