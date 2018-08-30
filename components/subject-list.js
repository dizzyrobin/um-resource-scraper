import React from 'react';
import PropType from 'prop-types';
import style from './fetched-subject.css';

import {connect} from 'react-redux';

import FetchedSubject from './fetched-subject';

class SubjectList extends React.Component {
  render() {
    const {title, checked, onToggle, subjects} = this.props;

    const subjectsRender = subjects.map(e => <FetchedSubject key={e.resource} title={e.title} checked={e.checked}/>);

    return (
      <div className={style.main}>
        Asignaturas:

        {subjectsRender}
      </div>
    );
  }
}

SubjectList.propTypes = {
  subjects: PropType.array.isRequired,
};

const mapStateToProps = state => ({
  subjects: state.subjects,
});

export default connect(mapStateToProps, null)(SubjectList);
