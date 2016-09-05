import React,{Component} from 'react';
import {Link} from 'react-router';
import Config from '../../config';
import "zepto";
import "./mobile.scss";

class Search extends Component{
	render(){
		return (
			<div className="search">
				<div className="search-fixed">
					<Input setSearch={this.props.setSearch} data={this.props.data} />
				</div>
				
				<ul className="mobile-items">
					{
						this.props.data.data.length ? this.props.data.data.map((value,key) => (
							<li key={key}>
								<div className="mobile-item">
									<div className="mobile-img"><a href="/" style={{backgroundImage:"url("+value.goods_cover+")"}}></a></div>
									<div className="mobile-about">
										<p>{value.goods_name}</p>
										<span className="price">{value.price}</span>
										<a href="javascript:;" className="vertical-middle"><i className="icon-like"></i></a>
									</div>
								</div>
							</li>
						)) : ''
					}
				</ul>
			</div>
		)
	}
}
class Input extends Component{
	constructor(props){
		super(props);
	    this.state = {
	    	value:this.props.data.value
	    };
	}
	handleChange(e){
		let value = e.target.value.trim();
		this.setState({
			value:value
		})
	}
	handleClick(){
		let self = this;
		$.get(Config.api.search,{keyword:this.state.value},function(res){
			if(res.code == 200){

				self.props.setSearch({
					value:self.state.value,
					data:res.data.item
				});

			}else{
				console.log(res.message);
			}
		}).fail(function(error){
			console.log(error);
		});
	}
	render(){
		let value = this.state.value;
		let originValue = this.props.data.value;
		return (
			<div className={this.props.data.data.length ? "search-input search-result" : "search-input"}>
				<label htmlFor="search" className="icon-search"></label>
				<input onChange={this.handleChange.bind(this)} type="text" placeholder="输入关键字" defaultValue={this.state.value} />
				{(!value || value == originValue) ? <Link to="/" className="icon-close"></Link> : <a onClick={this.handleClick.bind(this)} className="search-button" href="javascript:;">搜索</a>}
			</div>
		)
	}
}

export default Search;
