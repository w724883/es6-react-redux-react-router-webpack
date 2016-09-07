import React,{Component} from 'react';
import Nav from '../nav/mobile';
import Focus from '../focus/mobile';
import HomeList from '../homeList';
import Footer from '../footer';
import "./mobile.scss";

class Mobile extends Component{

	render(){
		let focusData = this.props.focusData;
		let hotData = this.props.hotData;

		
		return (
		  	<div className="home">
		  		{focusData.length ? <Focus data={focusData} /> : ""}
		  		{hotData.length ? <HomeList {...this.props} /> : ""}
		  		<Footer />
		  		<Nav />
		  	</div>
		)
	}
	
}
export default Mobile;
