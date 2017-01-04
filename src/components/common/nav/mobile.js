import React from 'react';
import { Link,IndexLink,browserHistory } from 'react-router';
import * as Actions from '../../../actions';
import './mobile.scss';

class Nav extends React.Component {
    handlePersonal(e){

        if(!this.props.state.login){

            // if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' && !!$.fn.cookie('wechat')){
            //     browserHistory.push(decodeURIComponent($.fn.cookie('wechat')));
            //     return false;
            // }
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
    handleCart(e){

        if(!this.props.state.login){

            // if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' && !!$.fn.cookie('wechat')){
            //     browserHistory.push(decodeURIComponent($.fn.cookie('wechat')));
            //     return false;
            // }
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
            <div className="nav-mobile">
                <IndexLink to="/" activeClassName="active"><i className="icon-home"></i><span>主页</span></IndexLink>
                <Link to="/category" activeClassName="active"><i className="icon-product"></i><span>产品</span></Link>
                <Link to="/show" activeClassName="active"><i className="icon-yelp"></i><span>晒单</span></Link>
                <Link to="/cart" onClick={this.handleCart.bind(this)} activeClassName="active"><i className="icon-carts"></i><span>购物车</span></Link>
                <Link to="/personal" onClick={this.handlePersonal.bind(this)} activeClassName="active"><i className="icon-account"></i><span>我</span></Link>
            </div>
        )
    }

}

export default Nav;
