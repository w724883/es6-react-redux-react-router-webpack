import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as Actions from '../../actions';
// import Config from '../../config';
import Layer from '../common/layer/mobile';

import "zepto";
import "./mobile.scss";

class Error extends React.Component {
    render(){
        return (
            <div className="prompt-error">
                <div className="prompt-error-icon">
                    <i className="icon-close"></i>
                </div>
                <p>{this.props.query.title ? this.props.query.title : '页面错误'}</p>
                <span>{this.props.query.message ? this.props.query.message : '当前页面无法访问'}</span>
                <div className="prompt-btns">
                    <Link to="/" className="active">重新加载</Link>
                    <Link to="/">回到主页</Link>
                </div>
            </div>
        )
    }
}
class Pay extends React.Component {
    render(){
        return (
            <div className="prompt-pay">
                <div className="prompt-pay-icon">
                    <i className="icon-close"></i>
                </div>
                <p>{this.props.query.title ? this.props.query.title : '支付错误'}</p>
                <span>{this.props.query.message ? this.props.query.message : '由于某些原因无法完成支付'}</span>
                <div className="prompt-btns">
                    <Link to="/myorder" className="active">查看订单</Link>
                    <Link to="/">回到主页</Link>
                </div>
            </div>
        )
    }
}
class Prompt extends React.Component {
    constructor(props){
        super();
        props.dispatch(Actions.setLoading(false));
    }
    renderType(){
        let query = this.props.location ? this.props.location.query : '';
        switch(query.type){
            case 'pay':return <Pay query={query} />;break;
            default :return <Error query={query} />;break;
        }
    }
    render(){
        return (
            <div className="prompt">
                <Layer>
                    <div className="prompt-content">
                        {this.renderType.call(this)}
                    </div>
                </Layer>
            </div>
        )     
    }
}
Prompt = connect((state) => ({state}))(Prompt);
export default Prompt;

