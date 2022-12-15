import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import './UserManage.scss'

class ModalEditUser extends Component {

    constructor(props) {
        super(props)
        this.state = {
            id: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: ''
        }

    }

    componentDidMount() {
        const user = this.props.currentUser 

        if(user) {
            this.setState({
                id: user.id,
                email: user.email,
                password: 'harcode',
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address
            })
        }        
    }

    toogle = () => {
        this.props.toogleFromParent()
    }

    handleOnChangeInput = (e, id) => {
        const copyState = { ...this.state }
        copyState[id] = e.target.value
        this.setState({
            ...copyState
        })
    }

    checkValidateInput = () => {
        let isValid = true
        const arrInput = ['email', 'password', 'firstName', 'lastName', 'address']
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false
                alert('Please fill in your ' + arrInput[i])
                break;
            }
        }
        return isValid
    }

    handleSaveUser = () => {
        const isValid = this.checkValidateInput()
        if (isValid) {
           this.props.editUser(this.state)
        }
    }

    render() {

        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={this.toogle}
                createNewUser={() => this.createNewUser()}
                size="lg"
                className='big-modal'
                centered
            >
                <ModalHeader className='model-header' toggle={this.toogle}>Edit an user</ModalHeader>
                <ModalBody>
                    <div className='modal-user-container'>
                        <div className='modal-user-body'>
                            <div className='input-container'>
                                <label>Email</label>
                                <input
                                    type='email'
                                    value={this.state.email}
                                    disabled
                                />
                            </div>
                            <div className='input-container'>
                                <label>Password</label>
                                <input
                                    type='password'
                                    value={this.state.password}
                                    disabled
                                />
                            </div>
                            <div className='input-container'>
                                <label>First Name</label>
                                <input
                                    type='text'
                                    value={this.state.firstName}
                                    onChange={(e) => this.handleOnChangeInput(e, "firstName")}
                                />
                            </div>
                            <div className='input-container'>
                                <label>Last Name</label>
                                <input
                                    type='text'
                                    value={this.state.lastName}
                                    onChange={(e) => this.handleOnChangeInput(e, "lastName")}
                                />
                            </div>
                            <div className='input-container max-width-input'>
                                <label>Address</label>
                                <input
                                    type='text'
                                    value={this.state.address}
                                    onChange={(e) => this.handleOnChangeInput(e, "address")}
                                />
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button className='px-3' color="primary" onClick={() => this.handleSaveUser()}>
                        Save Changes
                    </Button>{' '}
                    <Button className='px-3' color="secondary" onClick={this.toogle}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
        )
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);



