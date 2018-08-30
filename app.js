import React from 'react';
import PropType from 'prop-types';
import {connect} from 'react-redux';
import {fetchSubjects} from './src/actions/subjects';

import SubjectList from './components/subject-list';

// This is done like this because of a problem with "parcel"
const umFetcherLocation = '../um-fetcher';
const UmFetcher = require(umFetcherLocation);

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      user: 'pedrojavier.nicolas@um.es',
      password: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.getSubjects = this.getSubjects.bind(this);
    this.handleToggleSubject = this.handleToggleSubject.bind(this);
  }

  handleChange(event) {
    const {target} = event;
    const {name, value} = target;
    this.setState({
      [name]: value,
    });
  }

  handleClick() {
    const {user, password} = this.state;
    console.log(user, password);

    this.getSubjects(user, password);
  }

  getSubjects(user, password) {
    UmFetcher.login(user, password)
      .then(({browser, page}) => {
        UmFetcher.getSubjects(page)
          .then(subjects => {
            console.log(JSON.stringify(subjects));
            subjects.map(e => ({
              resource: e.resource,
              title: e.title,
              checked: false,
            }));
            // this.setState({subjects}); // FIXME: Change to redux
            this.props.fetchSubjects(subjects);
          }).catch(err => {
            console.error(err);
          });
      }).catch(err => {
        console.error(err);
      });
  }

  handleToggleSubject(index) {
    this.setState(prevState => {
      const {subjects} = prevState;
      subjects[index].checked = !subjects[index].checked;
      return {subjects};
    });
  }

  render() {
    const {user, password} = this.state;

    return (
      <div>

        <h1>UM RESOURCE SCRAPER</h1>

        <div>
          <div>User:</div>
          <input type="text" name="user" value={user} onChange={this.handleChange}/>
        </div>

        <br/>

        <div>
          <div>Password:</div>
          <input type="password" name="password" value={password} onChange={this.handleChange}/>
        </div>

        <br/>

        <button type="button" onClick={this.handleClick}>Fetch subjects</button>

        <br/>

        <SubjectList/>

      </div>
    );
  }
}

App.propTypes = {
  fetchSubjects: PropType.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  fetchSubjects: subjects => dispatch(fetchSubjects(subjects)),
});

export default connect(null, mapDispatchToProps)(App);
