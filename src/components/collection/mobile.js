import React,{Component} from 'react';
import { connect } from 'react-redux';
import { Link,browserHistory } from 'react-router';
import * as Actions from '../../actions';
import {TopFixed,BackFixed} from '../common/fixed/mobile';
// import {Waiting} from '../loading';
import Config from '../../config';
import Nav from '../common/nav/mobile';
import 'zepto';
import "./mobile.scss";



class Collection extends Component{
    constructor(props){
        super(props);
        props.dispatch(Actions.setLoading(true));
        this.state = {
            data:[]
        }
    }
    getData(){
        let self = this;
        let dfd = $.Deferred();
        $.ajax({
          type: 'POST',
          url: Config.api.my_like,
          dataType: Config.dataType,
          success: function(res){
            if(res.code == 200){
                let data = self.state.data;
                data = res.data;
                self.setState({data});

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
    componentWillMount(){
        let self = this;
        let dfdTasks = [this.getData.call(this)];

        $.when.apply(null,dfdTasks).done(function(){
            self.props.dispatch(Actions.setLoading(false));
        });

    }
    render(){
        return (
            <div className="collection">
                <TopFixed data="我的收藏" />
                <div className="collection-content">
                    <ul className="mobile-items">
                        {
                            this.state.data.length ? this.state.data.map((value,key) => (
                                <li key={key}>
                                    <div className="mobile-item">
                                        <div className="mobile-img">
                                        <a href={"/details?id="+value.goods_id} style={{backgroundImage:"url("+value.goods_cover+")"}}></a>
                                        {value.activty_message ? <span className="mobile-tag">{value.activty_message}</span> : null}
                                        </div>
                                        <div className="mobile-about">
                                            <p>{value.goods_name}</p>
                                            <span className="price">{value.price}</span>
                                        </div>
                                    </div>
                                </li>
                            )) : null
                        }
                    </ul>
                </div>
                <BackFixed>
                    <Link to={Config.path.personal}><i className="icon-pre"></i></Link>
                </BackFixed>
            </div>
        )
    }
}
Collection = connect(state => ({state}))(Collection);
export default Collection;
