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
        props.dispatch(Actions.setLoading(true));
        this.state = {
            data:{},
            score : Array(5).fill(false),
            text:'',
            rated:'',
            images:[]
        }
    }
    getData(){
        let self = this;
        let params = null;   
        try{
            params = JSON.parse(this.props.location.query.params);
        }catch(e){
            self.props.dispatch(Actions.setMessage({
                text:'参数错误'
            }));
            browserHistory.push('/myorder');
            return false;
        }
        let dfd = $.Deferred();
        $.ajax({
          type: 'POST',
          url: Config.api.getordergoods,
          data:params,
          dataType: Config.dataType,
          success: function(res){
            if(res.code == 200){
                self.setState({
                    data:res.data.item
                });

            }else if(res.code == 401){
                // if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' && !!$.fn.cookie('wechat')){
                //     browserHistory.push(decodeURIComponent($.fn.cookie('wechat')));
                //     return false;
                // }
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
          complete:function(){
            dfd.resolve();
          },
          error: function(xhr, type){
            self.props.dispatch(Actions.setMessage({
                text:Config.text.network
            }));
          }
        });
        return dfd.promise();
    }
    handleClose(){
        browserHistory.goBack();
    }
    handleScore(key){
        let score = Array(5).fill(false);
        let rated = this.state.rated;
        switch(key){
            case 0: rated = '很差';break;
            case 1: rated = '不好';break;
            case 2: rated = '一般';break;
            case 3: rated = '很好';break;
            case 4: rated = '非常好';break;
        }
        this.setState({
            score:score.fill(true,0,key+1),
            rated
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
                    if(res.code == 200){
                        let images = this.state.images;

                        self.setState({
                            images:images.concat(res.data)
                        });
                        self.props.dispatch(Actions.setMessage({
                            text:'上传成功'
                        }));
                    }else if(res.code == 401){
                        // if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' && !!$.fn.cookie('wechat')){
                        //     browserHistory.push(decodeURIComponent($.fn.cookie('wechat')));
                        //     return false;
                        // }
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
        let self = this;
        let images = this.state.images;
        $.ajax({
          type: 'POST',
          url: Config.api.deletecommentpic,
          data:{
            image_name:images[key]
          },
          dataType: Config.dataType,
          success: function(res){
            if(res.code == 200){
                images.splice(key,1);
                self.setState({
                    images
                });
                self.props.dispatch(Actions.setMessage({
                    text:'删除成功'
                }));
            }else if(res.code == 401){
                // if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' && !!$.fn.cookie('wechat')){
                //     browserHistory.push(decodeURIComponent($.fn.cookie('wechat')));
                //     return false;
                // }
                self.props.dispatch(Actions.setPop({
                    show:'login',
                    data:{
                        success(){
                            window.location.reload();
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
            self.props.dispatch(Actions.setMessage({
                text:Config.text.network
            }));
          }
        });
    }
    handleSubmit(){
        let self = this;
        let state = this.state;
        let score = state.score.filter(v => (!!v)).length;
        if(!score){
            this.props.dispatch(Actions.setMessage({
                text:'给个评分吧'
            }));
            return false;
        }
        if(!$.trim(state.text)){
            this.props.dispatch(Actions.setMessage({
                text:'请输入评论'
            }));
            return false;
        }
        $.ajax({
          type: 'POST',
          url: Config.api.createcomment,
          data:{
            order_id:state.data.id,
            goods_id:state.data.goods_id,
            order_goods_id:state.data.order_goods_id,
            comment_num:score,
            contents:state.text,
            comment_img:state.images.join('&')
          },
          dataType: Config.dataType,
          success: function(res){
            if(res.code == 200){
                browserHistory.push('/myorder');
                self.props.dispatch(Actions.setMessage({
                    text:'提交成功'
                }));
            }else if(res.code == 401){
                // if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' && !!$.fn.cookie('wechat')){
                //     browserHistory.push(decodeURIComponent($.fn.cookie('wechat')));
                //     return false;
                // }
                self.props.dispatch(Actions.setPop({
                    show:'login',
                    data:{
                        success(){
                            window.location.reload();
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
            self.props.dispatch(Actions.setMessage({
                text:Config.text.network
            }));
          }
        });
    }
    componentWillMount(){
        let self = this;

        let dfdTasks = [this.getData.call(this)];
        $.when.apply(null,dfdTasks).done(function(){
            // self.setState({
            //  loading:false
            // })
            self.props.dispatch(Actions.setLoading(false));
        });

    }
    render(){
        return (
            <div className="comment">
                <TopFixed data="点评晒单" />
                {
                    this.state.data.id ? (
                        <div className="comment-list">
                            <ul className="comment-list-img">
                                <li className="comment-list-item">
                                    <div className="comment-list-head" style={{backgroundImage:'url('+this.state.data.goods_img+')'}}></div>
                                    <div className="comment-list-text">
                                        <strong>{this.state.data.goods_name}</strong>
                                        <span>{this.state.data.goods_attribute}</span>
                                    </div>
                                    <div className="vertical-middle">
                                        <p>
                                            <strong>¥ {this.state.data.goods_price}</strong>
                                            <span>x {this.state.data.goods_num}</span>
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
                                <span>{this.state.rated}</span>
                            </div>
                            <div className="comment-text">
                                <textarea placeholder="写下你的点评" onChange={this.handleText.bind(this)} value={this.state.text} />
                                <span>{this.state.text.length} / 200</span>
                            </div>
                            <ul className="comment-upload">
                                <li style={{borderStyle:'dashed'}}><i className="icon-add"></i><input type="file" name="pic" accept="image/gif, image/jpeg, image/png" onChange={this.handleUpload.bind(this)} /></li>
                                {
                                    this.state.images.length ? this.state.images.map((value,key) => (
                                        <li style={{backgroundImage:'url('+value+')'}}><a href="javascript:;" className="icon-close" onClick={this.handleDelete.bind(this,key)}></a></li>
                                    )) : null
                                }
                            </ul>
                        </div>
                    ) : null
                }
                
                <BackFixed>
                    <a href="javascript:;" onClick={this.handleClose.bind(this)}><i className="icon-close"></i></a>
                    <button className="comment-submit" disabled={this.state.data.id ? "" : "disabled"} onClick={this.handleSubmit.bind(this)}>提交点评</button>
                </BackFixed>

            </div>
        )
    }
}
Comment = connect((state) => ({state}))(Comment);
export default Comment;
