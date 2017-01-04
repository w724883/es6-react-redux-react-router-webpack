import React,{Component} from 'react';
import { Link,browserHistory } from 'react-router';
import * as Actions from '../../../actions';
// import CSSTransitionGroup from 'react-addons-css-transition-group';
import 'zepto';
import './pc.scss';
// class BackFixed extends Component{

//     render(){
//         return (
//             <div className="bottom-nav">
//                 {this.props.children}
//             </div>
//         )
//     }
// }

// class CartFixed extends Component{
//     constructor(){
//         super();
//         // this.getTotal = this.getTotal.bind(this);
//         this.state = {
//             nav:false
//         }
//     }
//     handleClick(e){
//         let callback = this.props.handleClick;
//         callback && callback();
//         // return false;
//     }
//     handlePersonal(e){
//         if(!this.props.state.login){
//             // if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' && !!$.fn.cookie('wechat')){
//             //     browserHistory.push(decodeURIComponent($.fn.cookie('wechat')));
//             //     return false;
//             // }
//             e.stopPropagation();
//             e.preventDefault();
//             this.props.dispatch(Actions.setPop({
//                 show:'login',
//                 data:{
//                     success(){
//                         window.location.href = '/personal';
//                     },
//                     cancle(){
//                         browserHistory.push('/');
//                     }
//                 }
//             }));
//             return false;
//         }

//     }
//     handleShowNav(){
//         this.setState({
//             nav:true
//         })
//     }
//     handleHideNav(){
//         this.setState({
//             nav:false
//         })
//     }
//     getTotal(){
//         let price = 0;
//         let {state,total,handleIntegral} = this.props;
//         let {list,add} = state.cart;
//         for(let i of list.concat(add)){
//             if(i.checked){
//                 price += (i.price*i.num)
//             }
//         }
//         // 如果是order、pay则计算待支付
//         if(state.order.cost && (total != undefined || handleIntegral != undefined)){
//             let freight = state.order.cost.freight*1 || 0;
//             let discount = state.order.cost.discount*1 || 0;
//             let integral = state.order.cost.integral*1 || 0;
//             let sale = state.order.cost.sale*1 || 0;
//             // let balance = state.order.cost.balance*1 || 0;
//             freight = (freight > sale) ? (freight-sale) : 0;
//             price += freight;
//             price -= (discount < price ? discount : price);
//             this.props.handleIntegral && this.props.handleIntegral(price);
//             if(price){
//                 price -= (integral/100 < price ? integral/100 : price);
//             }
            
//             // price -= (balance >= price) ? price : balance;
//         }

//         // for(let i of add){
//         //     if(i.checked){
//         //         price += (i.price*i.num)
//         //     }
//         // }
//         // let cart = this.props.state.cart;
//         // if(cart.list.length){
//         //     this.props.dispatch(Actions.setOrder({
//         //         total:price
//         //     }));
//         // }
//         // this.props.handleTotal && this.props.handleTotal(price);
//         return parseFloat(price).toFixed(2);
//     }
//     render(){
//         return (
//             <div className="cart-fixed">
//                 <div className="cart-bar">
//                     <p onClick={this.handleShowNav.bind(this)}>
//                         <i className="icon-menu"></i>
//                         <strong>待付 <span className="price">{this.props.total != undefined ? parseFloat(this.props.total).toFixed(2) : this.getTotal()}</span></strong>
//                     </p>
//                     <div className="cart-btns">
//                     {this.props.data.link ? <Link to={this.props.data.link} onClick={this.handleClick.bind(this)}>{this.props.data.btn}</Link> : <a href="javascript:;" onClick={this.handleClick.bind(this)}>{this.props.data.btn}</a>}
//                     </div>
//                     <CSSTransitionGroup
//                         component="div"
//                         transitionLeaveTimeout={400}
//                         transitionEnterTimeout={400}
//                         transitionName="transition-cartfix">
//                         {this.state.nav ? (<div className="cart-nav">
//                             <a href="javascript:;" onClick={this.handleHideNav.bind(this)}><i className="icon-close"></i></a>
//                             <Link to="/" activeClassName="active" onlyActiveOnIndex={true}><i className="icon-home"></i><span>主页</span></Link>
//                             <Link to="/category" activeClassName="active"><i className="icon-product"></i><span>产品</span></Link>
//                             <Link to="/cart" activeClassName="active"><i className="icon-carts"></i><span>购物车</span></Link>
//                             <Link onClick={this.handlePersonal.bind(this)} to="/personal" activeClassName="active"><i className="icon-account"></i><span>我</span></Link>
//                         </div>) : null}
//                     </CSSTransitionGroup>
//                 </div>
//             </div>
//         )
//     }
// }


class PopFixed extends Component{
    handleSelect(e){
        this.props.handleSelect && this.props.handleSelect(e);
    }
    render(){
        let title = this.props.title;
        return (
            <div className="fix-pop" onChange={this.handleSelect.bind(this)}>
                <span>{title}</span>
                {
                    this.props.data ? (
                        this.props.handleSelect ? (
                            <select>
                                {
                                    this.props.data.map((value,key) => (
                                       <option value={value.key}>{value.value}</option> 
                                    ))
                                }
                            </select>
                        ) : (
                            this.props.data
                        )
                    ) : null
                }
            </div>
        )
    }
}

export {
    // CartFixed,
    // BackFixed,
    PopFixed
};
