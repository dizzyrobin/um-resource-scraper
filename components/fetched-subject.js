import React from 'react';
import PropType from 'prop-types';
import {connect} from 'react-redux';

import {toggleSubject} from '../src/actions/subjects';

import style from './fetched-subject.css';

class FetchedSubject extends React.Component {
  constructor() {
    super();

    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle() {
    const {resource, toggleSubject} = this.props;
    toggleSubject(resource);
  }

  render() {
    const {title, checked} = this.props;

    return (
      <div className={style.main}>
        <input type="checkbox" checked={checked} onClick={this.handleToggle}/>
        {title}
      </div>
    );
  }
}

FetchedSubject.propTypes = {
  title: PropType.string.isRequired,
  resource: PropType.string.isRequired,
  checked: PropType.bool.isRequired,
  toggleSubject: PropType.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  toggleSubject: resource => dispatch(toggleSubject(resource)),
});

export default connect(null, mapDispatchToProps)(FetchedSubject);
