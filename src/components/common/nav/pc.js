import React from 'react';
import { Link,IndexLink,browserHistory } from 'react-router';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import * as Actions from '../../../actions';
import {getQuery} from '../index';
import Search from '../../search/pc';
import './pc.scss';
import logo from '../../../static/imgs/logo.png';
// import Layer from '../layer/pc';
class Nav extends React.Component {
    constructor(){
        super();
        let keyword = getQuery().keyword;
        this.state = {
            search:false,
            text:keyword ? keyword : ''
        }
    }
    handlePersonal(e){

        if(!this.props.state.login){
            e.stopPropagation();
            e.preventDefault();
            this.props.dispatch(Actions.setPop({
                show:'login',
                data:{
                    success(){
                        window.location.href = '/personal';
                    }
                }
            }));
            return false;
        }

    }
    handleSearch(value){
        let text = $.trim(this.state.text);
        if(this.state.search && text){
            // this.props.dispatch(Actions.setSearch(text));
            browserHistory.push('/search?keyword='+text);
            return false;
        }
        this.setState({
            search:true
        });
    }
    handleClose(){
        if(this.timer){
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
           this.setState({
               search:false
           }) 
        },1000);
        
    }
    handleChange(e){
        let value = $.trim(e.target.value);
        this.setState({
            text:value
        });
    }
    handleKeyUp(e){
        let text = $.trim(this.state.text);
        if(e.keyCode == 13 && text){
            // this.props.dispatch(Actions.setSearch(text));
            browserHistory.push('/search?keyword='+text);
        }

    }
    handleCart(e){

        if(!this.props.state.login){
            e.stopPropagation();
            e.preventDefault();
            this.props.dispatch(Actions.setPop({
                show:'login',
                data:{
                    success(){
                        window.location.href = '/cart';
                    }
                }
            }));
            return false;
        }

    }
    render(){
        return (
            <div className="nav-pc">
                <div className="main">
                    <div className="float-left">
                        <IndexLink to="/" onlyActiveOnIndex={true} activeClassName="active"><i className="icon-home"></i><span>主页</span></IndexLink>
                        <Link to="/category" activeClassName="active"><i className="icon-product"></i><span>产品</span></Link>
                        <Link to="/show" activeClassName="active"><i className="icon-yelp"></i><span>晒单</span></Link>
                    </div>
                    <img src={logo} />
                    <div className="float-right">
                        <CSSTransitionGroup
                            component="div"
                            className="search-enter"
                            transitionEnterTimeout={500}
                            transitionLeaveTimeout={500}
                            transitionName="transition-search">
                            {this.state.search ? <input type="text" onKeyUp={this.handleKeyUp.bind(this)} value={this.state.text} placeholder="输入搜索关键字" onChange={this.handleChange.bind(this)} onBlur={this.handleClose.bind(this)} /> : null}
                        </CSSTransitionGroup>
                        
                        <a href="javascript:;" onClick={this.handleSearch.bind(this)}><i className="icon-search"></i>{this.state.search ? "" : <span>搜索</span>}</a>
                        <Link to="/cart" onClick={this.handleCart.bind(this)} activeClassName="active"><i className="icon-carts"></i><span>购物车</span></Link>
                        <Link to="/personal" onClick={this.handlePersonal.bind(this)} activeClassName="active"><i className="icon-account"></i><span>我</span></Link>
                    </div>
                </div>
            </div>
        )
    }

}

export default Nav;
