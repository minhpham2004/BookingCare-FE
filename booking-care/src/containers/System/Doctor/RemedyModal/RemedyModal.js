import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './RemedyModal.scss'
import { Modal, Button, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import * as actions from '../../../../store/actions'
import { CommonUtils } from '../../../../utils';

class RemedyModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            imgBase64: ''
        }
    }

    async componentDidMount() {
        if (this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.dataModal !== this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }
    }

    handleChangeEmail = (e) => {
        this.setState({
            email: e.target.value
        })
    }

    handleChangeImage = async (e) => {
        const fileData = e.target.files
        const file = fileData[0]
        if (file) {
            const base64 = await CommonUtils.getBase64(file)

            this.setState({
               imgBase64: base64
            })
        }
    }

    handleSendRemedy = async () => {
        await this.props.sendRemedy(this.state)
    }

    render() {
        const { isOpenRemedyModal, isCloseRemedyModal } = this.props
        const { email } = this.state

        return (
            <Modal
                isOpen={isOpenRemedyModal}
                className='booking-modal-container'
                size='md'
                centered
            >
                <ModalHeader toggle={isCloseRemedyModal}>Gui hoa don kham benh thanh cong</ModalHeader>
                <ModalBody>
                    <div className='row'>
                        <div className='col-6 form-group'>
                            <label>Email</label>
                            <input
                                className='form-control'
                                type='email'
                                value={email}
                                onChange={(e) => this.handleChangeEmail(e)}
                            />
                        </div>
                        <div className='col-6 form-group'>
                            <label>Chon file don thuoc</label>
                            <input
                                className='form-control-file'
                                type='file'
                                onChange={(e) => this.handleChangeImage(e)}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button className='px-3' color="primary" onClick={this.handleSendRemedy}>
                        Send
                    </Button>
                    <Button className='px-3' color="secondary" onClick={isCloseRemedyModal}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchGender: () => dispatch(actions.fetchGenderStart())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
