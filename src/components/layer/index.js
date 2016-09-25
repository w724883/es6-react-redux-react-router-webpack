import React from 'react';
import "./mobile.scss";
class Layer extends React.Component {
	// handleTouchstart(e){
	// 	e.preventDefault();
	// 	e.stopPropagation();
	// 	return false;
	// }
	render(){
		return (
			<div className="layer">
				{this.props.children}
			</div>
		)
	}
}


export default Layer;