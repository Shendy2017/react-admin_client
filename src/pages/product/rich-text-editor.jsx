import React, {Component} from 'react';
import {EditorState, convertToRaw, ContentState} from "draft-js";
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"; // 记得引入这个
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import PropTypes from "prop-types";

class RichTextEditor extends Component {

    constructor(props) {
        super(props);
        const html = this.props.detail;
        if (html){ // 如果有值
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.state = {
                    editorState,
                };
            }
        }else{
            this.state = {
                editorState: EditorState.createEmpty(), // 创建一个没内容的
            };
        }
    }

    /**
     * 获取带标签的信息
     */
    getDetail = () => (draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())));

    /**
     * 界面里面还必须写alt的信息才能成功add
     *
     * todo 删除富文本中的本地图片，服务器中的怎么删除?
     * todo 群里面的大佬推荐使用这个 https://help.aliyun.com/document_detail/32068.html?spm=a2c4g.11186623.2.14.401f5d26l4xXbp#concept-32068-zh
     * todo 或者使用 @alicloud/pop-core 调一下resetful api.
     * @param file
     * @return {Promise<any>}
     */
    uploadImageCallBack = file => {
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/manage/img/upload');
                // xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
                const data = new FormData();
                data.append('image', file);
                xhr.send(data);
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText);
                    // resolve(response);
                    // 这部分代码是百度得到的，反正这个插件上传图片不好用。
                    // 那么，上传图片有没有限制？如果删除本地的图片，那么服务器中的图片无法删除的，怎么办？
                    resolve({data: {link: response.data.url}});
                });
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText);
                    reject(error);
                });
            }
        );
    }

    /*
    * 实时传递输入信息
    * */
    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    render() {
        const {editorState} = this.state;
        return (
            <div>
                <Editor
                    editorState={editorState}
                    editorStyle={{border: '1px solid black', minHeight: 200, paddingLeft: 10}}
                    onEditorStateChange={this.onEditorStateChange}
                    localization={{
                        locale: 'zh',
                    }}
                    toolbar={{
                        inline: { inDropdown: true },
                        list: { inDropdown: true },
                        textAlign: { inDropdown: true },
                        link: { inDropdown: true },
                        history: { inDropdown: true },
                        image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                    }}
                />
                {/*这里的textarea生成html标签，存入服务器*/}
                {/*<textarea*/}
                {/*disabled*/}
                {/*value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}*/}
                {/*/>*/}
            </div>
        );
    }
}

RichTextEditor.propTypes = {detail: PropTypes.string};

export default RichTextEditor;