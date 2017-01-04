import React from 'react';
import Config from '../../../config';
import * as Actions from '../../../actions';
import "zepto";
import "./mobile.scss";

class Code extends React.Component {
    constructor(){
        super();
        this.time = 60;
        this.state = {
            text:'获取验证码'
        }
    }
    handleCode(){

        if(!/^1[34578]\d{9}$/.test(this.props.params.phone)){
            this.props.dispatch(Actions.setMessage({
                text:'请输入正确手机号'
            }));
            return false;
        }
        $('#code').focus();
        if(this.time >= 0 && this.time < 30 && this.props.params){
            return false;
        }
        let self = this;
        $.ajax({
          type: 'POST',
          url: Config.api.code,
          data:this.props.params,
          dataType: Config.dataType,
          beforeSend:function(){
            self.setState({
                text:'正在发送请求...'
            })
          },
          success: function(res){
            if(res.code == 200){
                let timer = setInterval(function(){
                    if(self.time < 0){
                        clearInterval(timer);
                        self.time = 60;
                        self.setState({
                            text:'获取验证码'
                        });
                        return false;
                    }
                    self.setState({
                        text:self.time-- + 's后重新发送'
                    });
                },1000);
            }else{
                self.props.dispatch(Actions.setMessage({
                    text:res.message
                }));
                self.setState({
                    text:'获取验证码'
                });
            }
          },
          error: function(xhr, type){
            self.props.dispatch(Actions.setMessage({
                text:"验证码发送失败"
            }));
            self.setState({
                text:'获取验证码'
            });
          }
        });
    }
    render(){
        return (
            <div style={this.props.code ? {display:"none"} : {display:"block"}} className={this.time >= 0 && this.time < 30  ? "verifycode verifycode-disable" : "verifycode"} onClick={this.handleCode.bind(this)}>
                <a href="javascript:;">{this.state.text}</a>
            </div>
        )
    }
}
export default Code;

