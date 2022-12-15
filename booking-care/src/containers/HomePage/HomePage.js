import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from './HomeHeader/HomeHeader';
import Specialty from './Section/Specialty/Specialty';
import MedicalFacility from './Section/MedicalFacility/MedicalFacility';
import OutstandingDoctors from './Section/OutstandingDoctors';

class HomePage extends Component {

    render() {

        return (
            <div>
                <HomeHeader isShowBanner={true} />
                <Specialty />
                <MedicalFacility />
                <OutstandingDoctors />
                <MedicalFacility />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
