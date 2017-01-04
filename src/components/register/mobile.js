import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
// import CSSTransitionGroup from 'react-addons-css-transition-group';
// import Layer from '../layer';
import * as Actions from '../../actions';
import Config from '../../config';
import Code from '../common/code/mobile';
import {TopFixed,BackFixed} from '../common/fixed/mobile';
import "zepto";
import "./mobile.scss";

class Register extends React.Component {
    constructor(){
        super();
        this.state = {
            username:'',
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
    handleSubmit(){
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
        if(this.state.passwd !== this.state.passwd_re){
            self.props.dispatch(Actions.setMessage({
                text:'两次密码输入不相同！'
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
                window.location.href = '/';
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
            <div className="register">
                <TopFixed data="注册账号" />
                <ul className="register-list" onChange={this.handleChange.bind(this)}>
                    <li>
                        <div className="register-item">
                            <label>昵称</label>
                            <div className="register-input">
                                <input placeholder="请填写" name="username" defaultValue={this.state.username} type="text" />
                            </div>
                        </div>
                    </li>
                    
                    <li>
                        <div className="register-item">
                            <label>手机号</label>
                            <div className="register-input">
                                <input placeholder="请填写" name="phone" defaultValue={this.state.phone} type="number" />
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="register-item">
                            <label>验证码</label>
                            <div className="register-input">
                                <input id="code" name="code" defaultValue={this.state.code} type="number" />
                                <Code params={{phone:this.state.phone,code_type:1}} code={this.state.code} dispatch={this.props.dispatch} />
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="register-item">
                            <label>登录密码</label>
                            <div className="register-input">
                                <input placeholder="请填写" name="passwd" defaultValue={this.state.passwd} type="password" />
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="register-item">
                            <label>确认密码</label>
                            <div className="register-input">
                                <input placeholder="请填写" name="passwd_re" type="password" defaultValue={this.state.passwd_re} />
                            </div>
                        </div>
                    </li>
                </ul>
                <BackFixed>
                    <Link to={Config.path.personal}><i className="icon-pre"></i></Link>
                    <button className="register-submit" onClick={this.handleSubmit.bind(this)}>注册卷时</button>
                </BackFixed>
            </div>
        )
    }
}
// <li>
//     <div className="register-item">
//         <label>性别:</label>
//         <div className="register-select">
//             <select name="sex">
//                 <option>请选择</option>
//                 <option>2</option>
//                 <option>3</option>
//             </select>
//         </div>
//     </div>
// </li>
// <li>
//     <div className="register-item">
//         <label>出生年月:</label>
//         <div className="register-select">
//             <select name="birthday">
//                 <option>请选择</option>
//                 <option>2</option>
//                 <option>3</option>
//             </select>
//         </div>
//     </div>
// </li>
Register = connect(state => ({state}))(Register);
export default Register;