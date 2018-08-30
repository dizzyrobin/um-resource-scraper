import React from 'react';
import PropType from 'prop-types';
import style from './fetched-subject.css';

class FetchedSubject extends React.Component {
  render() {
    const {title, checked, onToggle} = this.props;

    return (
      <div className={style.main}>
        <input type="checkbox" checked={checked} onClick={onToggle}/>
        {title}
      </div>
    );
  }
}

FetchedSubject.propTypes = {
  title: PropType.string.isRequired,
  checked: PropType.bool.isRequired,
  onToggle: PropType.func.isRequired,
};

export default FetchedSubject;
