import React,{Component} from 'react';
// import CSSTransitionGroup from 'react-addons-css-transition-group';
import "./mobile.scss";


class Number extends Component{
	// constructor(props){
	// 	super(props);
	// 	let value = props.value == 'undefined' ? 1 : props.value;
	// 	this.state = {
	// 		number:value
	// 	}
	// }
	handleAdd(){
		let input = this.refs.number;
		let value = input.value;
		let max = this.props.max;
		max  = (typeof max == "undefined") ? this.max : max;
		if(value == max) return false;
		input.value = ++value;
		// this.setState({
		// 	number:value
		// });
		this.props.handleChange && this.props.handleChange(value);
	}
	handleRemove(){
		let input = this.refs.number;
		let value = input.value;
		let min = this.props.min;
		min  = (typeof min == "undefined") ? this.min : min;
		if(value == min) return false;
		input.value = --value;
		// this.setState({
		// 	number:value
		// });
		this.props.handleChange && this.props.handleChange(value);
	}
	handleChange(e){
		let value = parseInt(e.target.value);
		let min = this.props.min;
		let max = this.props.max;
		min  = (typeof min == "undefined") ? this.min : min;
		max  = (typeof max == "undefined") ? this.max : max;

		if(isNaN(parseInt(value))){
			
			value = min;
		}else{
			if(value > max){
			    value = max;
			}else if(value < min){
			    value = min;
			}
		}
		e.target.value = value;
		// this.setState({
		// 	number:value
		// });
		this.props.handleChange && this.props.handleChange(value);
	}
	componentWillMount(){
		this.max = 9999999;
		this.min = 0;
	}
	render(){
		let value = this.props.value == 'undefined' ? 1 : this.props.value;
		return (
			<div className="number">
				<span className="icon-remove" onClick={this.handleRemove.bind(this)}></span>
				<input ref="number" type="number" defaultValue={value} onChange={this.handleChange.bind(this)} />
				<span className="icon-add" onClick={this.handleAdd.bind(this)}></span>
			</div>
		)
	}
}

export default Number;