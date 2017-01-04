import React from 'react';
import { connect } from 'react-redux';
import { Link,browserHistory } from 'react-router';
import Config from '../../config';
import * as Actions from '../../actions';
import Code from '../common/code/pc';
import "./pc.scss";

class Forget extends React.Component {
    constructor(props){
        super(props);
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
          url: Config.api.forget,
          data:this.state,
          dataType: Config.dataType,
          success: function(res){
            if(res.code == 200){
                self.props.dispatch(Actions.setPop({
                    show:'login',
                    data:{
                        success(){
                            window.location.reload();
                        }
                    }
                }));
                
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
    render(){
        return (
            <div className="pop" onTouchMove={this.props.handleTouchMove}>
                <div className="pop-bg" onClick={this.props.handleClose} onWheel={this.props.handleWheel}></div>
                <div className="pop-box">
                    <div className="forget">
                        <div className="forget-header">
                            <div className="forget-head"><i className="icon-password"></i></div>
                            <p>密码重置</p>
                            <span>重置后请牢记您的密码</span>
                        </div>
                        <ul className="forget-box" onChange={this.handleForm.bind(this)}>
                            <li>
                                <label>手机号</label>
                                <input type="number" defaultValue={this.state.phone} name="phone" placeholder="请输入原手机号" />
                            </li>
                            <li>
                                <label><span>验证码</span><Code params={{phone:this.state.phone,code_type:1}} dispatch={this.props.dispatch} /></label>
                                <input type="number" defaultValue={this.state.code} name="code" placeholder="输入验证码" />
                            </li>
                            <li>
                                <label>设置新密码</label>
                                <input type="password" defaultValue={this.state.passwd} name="passwd" placeholder="输入新的密码" />
                            </li>
                        </ul>
                        <div className="forget-footer">
                            <button className="forget-enter" onClick={this.handleSubmit.bind(this)}>确认重置</button>

                        </div>
                    </div>
                    <a href="javascript:;" onClick={this.props.handleClose} className="icon-close pop-close"></a>
                </div>
            </div>
        )
    }
}

Forget = connect(state => ({state}))(Forget);
export default Forget;
