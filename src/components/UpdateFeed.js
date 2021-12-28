import React, { Component } from 'react'
import { connect } from 'react-redux'
import ui from 'utils/ui'
import Button from 'components/Button'

import * as contentActions from 'redux/actions/contents'

class UpdateFeed extends Component {

  handleSubmit = (e) => {
    e.preventDefault()
    const { contentHash, downloadCert } = this.props
    
    const self = this;

    setTimeout(()=>{
        self.props.updateFeed(contentHash, downloadCert);
    }, 2000);

    ui.hideModal()
  }

  render() {
    return (
      <form className="UpdateFeed" onSubmit={this.handleSubmit}>
        <Button
          className="Update__Feed"
          type="submit"
          title="UPDATE FEED"
        />
      </form>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  updateFeed: (cHash, downloadCert) =>
    dispatch(contentActions.updateFeed(cHash, downloadCert)),
})

export default connect(null, mapDispatchToProps)(UpdateFeed)
