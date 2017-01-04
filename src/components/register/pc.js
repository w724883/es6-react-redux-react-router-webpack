import React from 'react';
import { connect } from 'react-redux';
import { Link,browserHistory } from 'react-router';
import Config from '../../config';
import * as Actions from '../../actions';
import Code from '../common/code/pc';
import "./pc.scss";

class Register extends React.Component {
    constructor(props){
        super(props);
        // this.props.dispatch(Actions.setLoading(false));
        this.state = {
            phone:'',
            code:'',
            passwd:''
        }
    }
    handleForm(e){
        let target = e.target;
        let state = this.state;
        state[target.name] = target.value;
        this.setState(state);
    }
    handleRegister(){
        let self = this;
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
        if(!$.trim(this.state.passwd)){
            self.props.dispatch(Actions.setMessage({
                text:'请填写密码'
            }));
            return false;
        }
        if(!$.trim(this.state.passwd).length < 6){
            self.props.dispatch(Actions.setMessage({
                text:'密码太简单，请重新输入'
            }));
            return false;
        }
        $.ajax({
          type: 'POST',
          url: Config.api.register,
          data:this.state,
          dataType: Config.dataType,
          success: function(res){
            if(res.code == 200){
                window.location.reload();
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
    handleLogin(){
        this.props.dispatch(Actions.setPop({
            show:'login',
            data:{
                success(){
                    window.location.href = '/personal';
                }
            }
        }));
    }
    // handleRegister(){
    //     browserHistory.push('/register');
    //     this.props.dispatch(Actions.setPop({
    //         show:false
    //     }));
    // }
    render(){
        return (
            <div className="pop" onTouchMove={this.props.handleTouchMove}>
                <div className="pop-bg" onClick={this.props.handleClose} onWheel={this.props.handleWheel}></div>
                <div className="pop-box">
                    <div className="register">
                        <div className="register-header">
                            <div className="register-head"><i className="icon-account"></i></div>
                            <p>注册账号</p>
                            <span>仅支持国内手机号注册</span>
                        </div>
                        <ul className="register-box" onChange={this.handleForm.bind(this)}>
                            <li>
                                <label>手机号</label>
                                <input type="number" defaultValue={this.state.phone} name="phone" placeholder="请输入真实手机号" />
                            </li>
                            <li>
                                <label><span>验证码</span><Code params={{phone:this.state.phone,code_type:1}} dispatch={this.props.dispatch} /></label>
                                <input type="number" defaultValue={this.state.code} name="code" placeholder="输入验证码" />
                            </li>
                            <li>
                                <label>设置密码</label>
                                <input type="password" defaultValue={this.state.passwd} name="passwd" placeholder="输入注册时的密码" />
                            </li>
                        </ul>
                        <div className="register-footer">
                            <button className="register-enter" onClick={this.handleRegister.bind(this)}>注册卷时</button>
                            <p>
                                <a href="javascript:;">微信注册</a>
                                <a href="javascript:;" onClick={this.handleLogin.bind(this)}>我有账号</a>
                            </p>

                        </div>
                    </div>
                    <a href="javascript:;" onClick={this.props.handleClose} className="icon-close pop-close"></a>
                </div>
            </div>
        )
    }
}

Register = connect(state => ({state}))(Register);
export default Register;
