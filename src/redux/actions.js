/*
* 包含多个action creator函数的模块
* 同步action：返回对象{type:'xxx', data:数据值}
* 异步action：返回函数dispatch => {}
* */

import {SET_HEAD_TITLE} from "./action-types";

/**
 * 设置头部标题的同步action
 */
export const setHeadTitle = headTitle => ({type: SET_HEAD_TITLE, data: headTitle});