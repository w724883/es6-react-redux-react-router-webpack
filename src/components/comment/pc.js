import React from 'react';
import { Link,browserHistory } from 'react-router';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import Config from '../../config';
import {TopFixed,BackFixed} from '../common/fixed/mobile';
import "zepto";
import "./mobile.scss";

class Comment extends React.Component {
    constructor(props){
        super();
        props.dispatch(Actions.setLoading(false));
        this.state = {
            score : Array(5).fill(false),
            text:'',
            images:[]
        }
    }
    // getData(){
    //     let self = this;
    //     let dfd = $.Deferred();
    //     $.ajax({
    //       type: 'POST',
    //       url: Config.api.myorder,
    //       data:{param:0},
    //       dataType: Config.dataType,
    //       success: function(res){
    //         if(res.code == 200){
    //             console.log(res)
    //             self.setState({
    //                 data:res.data
    //             });
    //
    //         }else if(res.code == 401){
    //             self.props.dispatch(Actions.setPop({
    //                 show:'login',
    //                 data:{
    //                     success(){
    //                         window.location.reload();
    //                     }
    //                 }
    //             }));
    //         }else{
    //             self.props.dispatch(Actions.setMessage({
    //                 text:res.message
    //             }));
    //         }
    //       },
    //       complete:function(){
    //         dfd.resolve();
    //       },
    //       error: function(xhr, type){
    //         console.log(type);
    //       }
    //     });
    //     return dfd.promise();
    // }
    handleClose(){
        browserHistory.goBack();
    }
    handleScore(key){
        let score = Array(5).fill(false);
        this.setState({
            score:score.fill(true,0,key+1)
        });
    }
    handleText(e){
        let value = e.target.value;
        if(value.length > 200){
            return false;
        }
        this.setState({
            text:value
        });
    }
    handleUpload(e){
        let self = this;
        try{
            e.persist();
            let el = e.target;
            let files = el.files;
            let formData = new FormData();
            for(let i = 0; i < files.length; i++){
              if(/image\/\w+/.test(files[i].type)){
                formData.append(el.name+i,files[i]);
              }else{
                self.props.dispatch(Actions.setMessage({
                    text:'请选择图片'
                }));
                return false;
              }

            }

            $.ajax({
                url: Config.api.uploadcommentpic,
                type: 'POST',
                dataType:Config.dataType,
                data: formData,
                success: (res) => {
                    if(res.code == 0){
                        let images = this.state.images;

                        self.setState({
                            images:images.concat(res.data)
                        });
                        self.props.dispatch(Actions.setMessage({
                            text:'上传成功'
                        }));
                    }else if(res.code == 401){
                        self.props.dispatch(Actions.setPop({
                            show:'login',
                            data:{
                                success(){
                                    window.location.reload();
                                },
                                cancle(){
                                    browserHistory.push('/');
                                }
                            }
                        }));
                        self.props.dispatch(Actions.setMessage({
                            text:res.message
                        }));
                    }else{
                        self.props.dispatch(Actions.setMessage({
                            text:'上传失败，请重试'
                        }));
                    }
                },
                error: (error) => {
                    self.props.dispatch(Actions.setMessage({
                        text:'网络不好，请重试'
                    }));
                },
                cache: false,
                contentType: false,
                processData: false
            });
            // if(typeof FileReader !== "undefined"){
            //     if(/image\/\w+/.test(file.type)){
            //         let reader = new FileReader();
            //         reader.readAsDataURL(file);
            //         reader.onload = (e) => {
            //             // let data = this.state.data;
            //             // if(!data[key].images_large) {
            //             //     data[key].images_large = [];
            //             // }
            //             // data[key].images_large.push(e.target.result);
            //             // self.setState({
            //             //     data
            //             // });
            //         }
            //     }
            // }

        }catch(error){
            self.props.dispatch(Actions.setMessage({
                text:'浏览器版本太低，出错了'
            }));
        }
    }
    handleDelete(key){
        let images = this.state.images;
        images.splice(key,1);
        this.setState({
            images
        });
    }
    handleSubmit(){
        let self = this;
        let state = this.state;
        $.ajax({
          type: 'POST',
          url: Config.api.createcomment,
          data:{
            score:state.score.filter(v => (!!v)).length,
            text:state.text,
            images:state.images
          },
          dataType: Config.dataType,
          success: function(res){
            if(res.code == 200){
                window.location.href = '/';
            }else if(res.code == 401){
                self.props.dispatch(Actions.setPop({
                    show:'login',
                    data:{
                        success(){
                            window.location.reload();
                        },
                        cancle(){
                            browserHistory.push('/');
                        }
                    }
                }));
                self.props.dispatch(Actions.setMessage({
                    text:res.message
                }));
            }else{
                self.props.dispatch(Actions.setMessage({
                    text:res.message
                }));
            }
          },
          error: function(xhr, type){
            console.log(type);
          }
        });
    }
    // componentWillMount(){
    //     let self = this;
    //
    //     let dfdTasks = [];
    //     $.when.apply(null,dfdTasks).done(function(){
    //         // self.setState({
    //         //  loading:false
    //         // })
    //         self.props.dispatch(Actions.setLoading(false));
    //     });
    //
    // }
    render(){
        return (
            <div className="comment">
                <TopFixed data="点评晒单" />
                <div className="comment-list">
                    <ul className="comment-list-img">
                        <li className="comment-list-item">
                            <div className="comment-list-head" style={{backgroundImage:'url()'}}></div>
                            <div className="comment-list-text">
                                <strong>vvv</strong>
                                <span>nnnn</span>
                            </div>
                            <div className="vertical-middle">
                                <p>
                                    <strong>¥ 1</strong>
                                    <span>x 1</span>
                                </p>
                            </div>
                        </li>
                    </ul>
                    <div className="comment-score">
                        {
                            this.state.score.map((value,key) => (
                                <a href="javascript:;" className={value ? "active" : ""} onClick={this.handleScore.bind(this,key)}><i className="icon-yelp"></i></a>
                            ))
                        }
                        <span>不错</span>
                    </div>
                    <div className="comment-text">
                        <textarea placeholder="写下你的点评" onChange={this.handleText.bind(this)} value={this.state.text} />
                        <span>{this.state.text.length} / 200</span>
                    </div>
                    <ul className="comment-upload">
                        <li style={{borderStyle:'dashed'}}><i className="icon-add"></i><input type="file" name="pic" accept="image/gif, image/jpeg, image/png" multiple="multiple" onChange={this.handleUpload.bind(this)} /></li>
                        {
                            this.state.images.length ? this.state.images.map((value,key) => (
                                <li style={{backgroundImage:'url('+value+')'}}><a href="javascript:;" className="icon-close" onClick={this.handleDelete.bind(this,key)}></a></li>
                            )) : null
                        }
                    </ul>
                </div>
                <BackFixed>
                    <a href="javascript:;" onClick={this.handleClose.bind(this)}><i className="icon-close"></i></a>
                    <button className="comment-submit" onClick={this.handleSubmit.bind(this)}>提交点评</button>
                </BackFixed>

            </div>
        )
    }
}
Comment = connect((state) => ({state}))(Comment);
export default Comment;
