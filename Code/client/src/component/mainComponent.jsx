import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import React, { Component } from 'react'
import JiraApiCall from './jiraApiCall'

export default class MainComponent extends Component {
  render() {
    return (
  <JiraApiCall />
    )
  }
}
