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

class Complete extends React.Component {
    constructor(props){
        super();
        props.dispatch(Actions.setLoading(false));
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
          url: Config.api.complete,
          data:this.state,
          dataType: Config.dataType,
          success: function(res){
            if(res.code == 200){
                window.location.href = self.props.location.query.from ? ('/'+self.props.location.query.from) : '/';
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
    // componentWillMount(){
    //     this.props.dispatch(Actions.setLoading(false));
    // }
    render(){
        return (
            <div className="binding">
                <TopFixed data="绑定手机" />
                <ul className="binding-list" onChange={this.handleChange.bind(this)}>
                    <li>
                        <div className="binding-item">
                            <label>手机号</label>
                            <div className="binding-input">
                                <input placeholder="请输入手机号" name="phone" defaultValue={this.state.phone} type="number" />
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="binding-item">
                            <label>验证码</label>
                            <div className="binding-input">
                                <input id="code" defaultValue={this.state.code} type="number" name="code" />
                                <Code code={this.state.code} params={{phone:this.state.phone,code_type:5}} dispatch={this.props.dispatch} />
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="binding-item">
                            <label>密 码</label>
                            <div className="binding-input">
                                <input placeholder="请填写" name="passwd" defaultValue={this.state.passwd} type="password" />
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="binding-item">
                            <label>确认密码</label>
                            <div className="binding-input">
                                <input placeholder="请再次填写" name="passwd_re" defaultValue={this.state.passwd_re} type="password" />
                            </div>
                        </div>
                    </li>
                </ul>
                <BackFixed>
                    <button className="binding-submit" onClick={this.handleSubmit.bind(this)}>确认绑定</button>
                </BackFixed>
            </div>
        )
    }
}
Complete = connect(state => ({state}))(Complete);
export default Complete;
