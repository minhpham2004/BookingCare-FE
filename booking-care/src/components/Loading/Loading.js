import React, { Component } from 'react';
import { connect } from "react-redux";
// import './Loading.css'

class Loading extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    async componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
    }

    render() {
        return (
            <>
                <section>
                    <div class="loader">
                        <span style={{--i: 1}}></span>
                        <span style="--i: 2"></span>
                        <span style="--i: 3"></span>
                        <span style="--i: 4"></span>
                        <span style="--i: 5"></span>
                        <span style="--i: 6"></span>
                        <span style="--i: 7"></span>
                        <span style="--i: 8"></span>
                        <span style="--i: 9"></span>
                        <span style="--i: 10"></span>
                        <span style="--i: 11"></span>
                        <span style="--i: 12"></span>
                        <span style="--i: 13"></span>
                        <span style="--i: 14"></span>
                        <span style="--i: 15"></span>
                        <span style="--i: 16"></span>
                        <span style="--i: 17"></span>
                        <span style="--i: 18"></span>
                        <span style="--i: 19"></span>
                        <span style="--i: 20"></span>
                    </div>
                </section>
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

export default connect(mapStateToProps, mapDispatchToProps)(Loading);
