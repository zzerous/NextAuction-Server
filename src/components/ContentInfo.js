import React, { Fragment } from 'react'

import './ContentInfo.scss'

const ContentInfo = ({ name, issueDate, state }) => (
  <Fragment>
    <h2 className="ContentInfo__name">{name}</h2>
    <span className="ContentInfo__issueDate">{issueDate}</span>
    <h3 className="ContentInfo__state">{state}</h3>
  </Fragment>
)

export default ContentInfo
