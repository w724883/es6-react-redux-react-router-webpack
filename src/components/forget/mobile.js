import React from 'react';
import { connect } from 'react-redux';
import { Link,browserHistory } from 'react-router';
// import CSSTransitionGroup from 'react-addons-css-transition-group';
// import Layer from '../layer';
// import {Loading} from '../loading';
import * as Actions from '../../actions';
import Config from '../../config';
import {TopFixed,BackFixed} from '../common/fixed/mobile';
import Code from '../common/code/mobile';
import "zepto";
import "./mobile.scss";

class Forget extends React.Component {
    constructor(){
        super();
        this.state = {
            phone:'',
            code:'',
            passwd:'',
            passwd_re:''
        }
    }
    handleChange(e){
        let name = e.target.name;
        let state = {};
        state[name] = e.target.value;
        this.setState(state);
    }
    handleBack(){
      browserHistory.goBack();
    }
    handleSubmit(){
        if(!/^1[34578]\d{9}$/.test(this.state.phone)){
            this.props.dispatch(Actions.setMessage({
                text:'请输入正确手机号'
            }));
            return false;
        }
        if(!this.state.code){
            this.props.dispatch(Actions.setMessage({
                text:'请输入验证码'
            }));
            return false;
        }
        if(!this.state.passwd){
            this.props.dispatch(Actions.setMessage({
                text:'请输入新密码'
            }));
            return false;
        }
        if(!this.state.passwd_re){
            this.props.dispatch(Actions.setMessage({
                text:'请再次输入密码'
            }));
            return false;
        }
        if(this.state.passwd != this.state.passwd_re){
            this.props.dispatch(Actions.setMessage({
                text:'两次密码不一致，请重新输入'
            }));
            return false;
        }
        let self = this;
        $.ajax({
          type: 'POST',
          url: Config.api.forget,
          data:this.state,
          dataType: Config.dataType,
          success: function(res){
            if(res.code == 200){
                if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger'){
                    window.location.href = '/';
                }else{
                    self.props.dispatch(Actions.setPop({
                        show:'login',
                        data:{
                            success(){
                                window.location.href = '/';
                            }
                        }
                    }));
                }                
            }else{
                self.props.dispatch(Actions.setMessage({
                    text:res.message
                }));
            }
          },
          error: function(xhr, type){
            self.props.dispatch(Actions.setMessage({
                text:Config.text.network
            }));
          }
        });
    }
    componentWillMount(){
        this.props.dispatch(Actions.setLoading(false));
    }
    render(){
        return (
            <div className="forget">
                <TopFixed data="重置密码" />
                <ul className="forget-list" onChange={this.handleChange.bind(this)}>
                    <li>
                        <div className="forget-item">
                            <label className="forget-label">手机号:</label>
                            <div className="forget-input">
                                <input placeholder="请输入原手机号" name="phone" defaultValue={this.state.phone} type="number" />
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="forget-item">
                            <label className="forget-label">验证码:</label>
                            <div className="forget-input">
                                <input id="code" defaultValue={this.state.code} type="number" name="code" />
                                <Code code={this.state.code} params={{phone:this.state.phone,code_type:2}} dispatch={this.props.dispatch} />
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="forget-item">
                            <label className="forget-label">新密码:</label>
                            <div className="forget-input">
                                <input placeholder="请填写" name="passwd" defaultValue={this.state.passwd} type="password" />
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="forget-item">
                            <label className="forget-label">确认密码:</label>
                            <div className="forget-input">
                                <input placeholder="请再次填写" name="passwd_re" defaultValue={this.state.passwd_re} type="password" />
                            </div>
                        </div>
                    </li>
                </ul>
                <BackFixed>
                    <a href="javascript:;" onClick={this.handleBack.bind(this)}><i className="icon-pre"></i></a>
                    <button className="forget-submit" onClick={this.handleSubmit.bind(this)}>确认重置</button>
                </BackFixed>
            </div>
        )
    }
}
Forget = connect(state => ({state}))(Forget);
export default Forget;
