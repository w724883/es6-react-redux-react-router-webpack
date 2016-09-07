import React,{Component} from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';



class Number extends Component{
	constructor(props){
		super(props);
		this.state = {
			number:1
		}
	}
	handleAdd(){
		let input = this.refs.number;
		let value = input.value;
		let max = this.props.max;
		max  = (typeof max == "undefined") ? 10000 : max;
		if(value == max) return false;
		input.value = ++value;
	}
	handleRemove(){
		let input = this.refs.number;
		let value = input.value;
		let min = this.props.min;
		min  = (typeof min == "undefined") ? 0 : min;
		if(value == min) return false;
		input.value = --value;
	}
	handleChange(e){
		let value = parseInt(e.target.value);
		let min = this.props.min;
		let max = this.props.max;
		min  = (typeof min == "undefined") ? 0 : min;
		max  = (typeof max == "undefined") ? 10000 : max;

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
		this.setState({
			number:value
		});
	}
	render(){
		return (
			<div className="number">
				<span className="icon-remove" onClick={this.handleRemove.bind(this)}></span>
				<input ref="number" type="number" defaultValue={this.state.number} onChange={this.handleChange.bind(this)} />
				<span className="icon-add" onClick={this.handleAdd.bind(this)}></span>
			</div>
		)
	}
}

export default Number;