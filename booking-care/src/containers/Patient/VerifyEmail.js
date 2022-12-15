import React, { Component } from 'react';
import { connect } from "react-redux";
import { postVerifyBookAppointment } from '../../services/userService';
import HomeHeader from '../HomePage/HomeHeader/HomeHeader';

class VerifyEmail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            statusVerify: false,
            errCode: 0
        }
    }

    async componentDidMount() {
        if (this.props.location && this.props.location.search) {
            const urlParams = new URLSearchParams(this.props.location.search)
            const token = urlParams.get('token')
            const doctorId = urlParams.get('doctorId')

            const res = await postVerifyBookAppointment({
                token: token,
                doctorId: doctorId
            })

            if (res && res.errCode === 0) {
                this.setState({
                    statusVerify: true,
                    errCode: res.errCode
                })
            } else {
                this.setState({
                    statusVerify: true,
                    errCode: res && res.errCode ? res.errCode : -1
                })
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
    }

    render() {
        const { statusVerify, errCode } = this.state
        return (
            <>
                <HomeHeader isShowBanner={false} />
                <div style={{ paddingTop: '100px', textAlign: 'center', fontSize: '20px', fontWeight: '600', textTransform: 'uppercase' }}>
                    {!statusVerify ? <div>...Loading data</div>
                        : <div>{+errCode === 0 ? <div style={{ color: 'green' }}>Booking Success</div> : <div style={{ color: 'red' }}>Booking Fail</div>}</div>
                    }
                </div>
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
