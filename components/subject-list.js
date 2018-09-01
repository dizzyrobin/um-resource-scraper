import React from 'react';
import PropType from 'prop-types';
import {connect} from 'react-redux';
// import {ipcRenderer} from 'electron';

import style from './fetched-subject.css';

import FetchedSubject from './fetched-subject';

// This is done like this because of a problem with "parcel"
const umFetcherLocation = '../um-fetcher';
const UmFetcher = require(umFetcherLocation);

class SubjectList extends React.Component {
  getResources(page, subjects) {
    // for (const subject of subjects) {
    // }

    console.log("GETTING THE RESOURCE...");
    console.log(page);
    console.log(subjects[0].resource);

    UmFetcher.getResources(page, subjects[0].resource)
      .then(links => {
        UmFetcher.downloadList(page, links)
          .then(() => {
            console.log("List downloaded!");
          }).catch(err => {
            console.error(err);
          });
      }).catch(err => {
        console.error(err);
      });
  }

  render() {
    const {subjects, nav} = this.props;

    if (subjects.length === 0) {
      return (
        <div className={style.main}>
          <div>No se han encontrado asignaturas</div>
        </div>
      );
    }

    const subjectsRender = subjects.map(e => <FetchedSubject key={e.resource} title={e.title} resource={e.resource} checked={e.checked}/>);


    return (
      <div className={style.main}>
        <div>Asignaturas:</div>

        {subjectsRender}

        <div>Los archivos se guardarán dentro de la carpeta de este programa, en la carpeta {'"recursos"'}</div>

        <button type="button" onClick={() => this.getResources(nav.page, subjects.filter(e => e.checked === true))}>Get resources</button>
      </div>
    );
  }
}

SubjectList.propTypes = {
  subjects: PropType.array.isRequired,
  nav: PropType.object.isRequired,
};

const mapStateToProps = state => ({
  subjects: state.subjects,
  nav: state.nav,
});

export default connect(mapStateToProps, null)(SubjectList);
