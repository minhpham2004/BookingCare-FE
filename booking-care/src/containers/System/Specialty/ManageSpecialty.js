import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageSpecialty.scss'
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import CommonUtils from '../../../utils/CommonUtils'
import { createNewSpecialty } from '../../../services/userService';
import { toast } from 'react-toastify';

const mdParser = new MarkdownIt;

class ManageSpecialty extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
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

    handleSaveNewSpecialty = async () => {
        const res = await createNewSpecialty(this.state)
        if (res && res.errCode === 0) {
            toast.success('Add new specialty data succeed =))')
            this.setState({
                name: '',
                image: '',
                descriptionHTML: '',
                descriptionMarkdown: ''
            })

        } else {
            toast.error('Add specialty fail :((')
        }
    }

    render() {
        return (
            <div className='manage-specialty-container'>
                <div className='ms-title'>Quan li chuyen khoa</div>
                <div className='add-new-specialty row'>
                    <div className='col-6 form-group'>
                        <label>Ten chuyen khoa</label>
                        <input
                            className='form-control'
                            value={this.state.name}
                            onChange={(e) => this.handleOnChangeInput(e, 'name')}
                        />
                    </div>
                    <div className='col-6 form-group'>
                        <label>Anh chuyen khoa</label>
                        <input
                            className='form-control-file'
                            type='file'
                            onChange={(e) => this.handleOnChangeImage(e)}
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
                        <button onClick={() => this.handleSaveNewSpecialty()} className='btn-save-specialty'>Save</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
