import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageClinic.scss'
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import CommonUtils from '../../../utils/CommonUtils'
import { createNewClinic } from '../../../services/userService';
import { toast } from 'react-toastify';

const mdParser = new MarkdownIt;

class ManageClinic extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            address: '',
            image: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
        }
    }

    async componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {
    }

    handleEditorChange({ html, text }) {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text
        })
    }

    handleOnChangeInput = (e, name) => {
        let cloneState = { ...this.state }
        cloneState[name] = e.target.value
        this.setState({
            ...cloneState
        })
    }

    handleOnChangeImage = async (e) => {
        const fileData = e.target.files
        const file = fileData[0]
        if (file) {
            const base64 = await CommonUtils.getBase64(file)
            this.setState({
                image: base64
            })
        }
    }

    handleSaveNewClinic = async () => {
        const res = await createNewClinic(this.state)
        if (res && res.errCode === 0) {
            toast.success('Add new clinic data succeed =))')
            this.setState({
                name: '',
                address: '',
                image: '',
                descriptionHTML: '',
                descriptionMarkdown: ''
            })

        } else {
            toast.error('Add clinic fail :((')
        }
    }

    render() {
        return (
            <div className='manage-specialty-container'>
                <div className='ms-title'>Quan li phong kham</div>
                <div className='add-new-specialty row'>
                    <div className='col-6 form-group'>
                        <label>Ten phong kham</label>
                        <input
                            className='form-control'
                            value={this.state.name}
                            onChange={(e) => this.handleOnChangeInput(e, 'name')}
                        />
                    </div>
                    <div className='col-6 form-group'>
                        <label>Anh phong kham</label>
                        <input
                            className='form-control-file'
                            type='file'
                            onChange={(e) => this.handleOnChangeImage(e)}
                        />
                    </div>
                    <div className='col-6 form-group'>
                        <label>Dia chi phong kham</label>
                        <input
                            className='form-control'
                            value={this.state.address}
                            onChange={(e) => this.handleOnChangeInput(e, 'address')}
                        />
                    </div>
                    <div className='col-12'>
                        <MdEditor
                            style={{ height: '500px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={({ html, text }) => this.handleEditorChange({ html, text })}
                            value={this.state.descriptionMarkdown}
                        />
                    </div>
                    <div className='col-12'>
                        <button onClick={() => this.handleSaveNewClinic()} className='btn-save-specialty'>Save</button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
