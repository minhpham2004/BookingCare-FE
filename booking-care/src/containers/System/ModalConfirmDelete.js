import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import './UserManage.scss'

class ModalConfirmDelete extends Component {

    constructor(props) {
        super(props)
        this.state = {
            id: ''
        }

    }

    componentDidMount() {
        const userDeleteId = this.props.currentUserId
        this.setState({
            id: userDeleteId
        })
    }

    toogle = () => {
        this.props.toogleFromParent()
    }

    handleDelete = () => {
        this.props.deleteUser(this.state.id)
    }


    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                size="sm"
                className='big-modal'
                centered
            >
                <ModalBody>
                    Are you sure want to delete this user?
                </ModalBody>
                <ModalFooter>
                    <Button className='px-3' color="primary" onClick={this.handleDelete}>
                        Yes
                    </Button>{' '}
                    <Button className='px-3' color="secondary" onClick={this.toogle}>
                        Undo
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalConfirmDelete);




