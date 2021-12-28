import React, { Component } from 'react'
import { connect } from 'react-redux'
import ui from 'utils/ui'
import Loading from 'components/Loading'
import ContentInfo from 'components/ContentInfo'
import DownloadContent from 'components/DownloadContent'

import * as contentActions from 'redux/actions/contents'

import './Feed.scss'

class Feed extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: !props.feed,
      byteSize: null,
    }
  }
  static getDerivedStateFromProps = (nextProps, prevState) => {
    const isUpdatedFeed = (nextProps.feed !== prevState.feed) && (nextProps.feed !== null)
    if (isUpdatedFeed) {
      return { isLoading: false }
    }
    return null
  }

  componentDidMount() {
    const { feed, getFeed } = this.props
    if (!feed) 
      getFeed()
  }

  render() {
    const { feed } = this.props
    if (this.state.isLoading) return <Loading />
    return (
      <div className="Feed">
        {feed.length !== 0
          ? feed.map(({
              contentName,
              contentSize,
              contentHash,
              contentType,
              contentDesc,
              accessLocation,
              createTime,
              endpoint,
            }) => {
              // bytes to KB, MB, GB
              const sizes = ['Bytes', 'KB', 'MB', 'GB'];
              const i = parseInt(Math.floor(Math.log(contentSize) / Math.log(1024)));
              const byteSize = Math.round(contentSize / Math.pow(1024, i), 2) + ' ' + sizes[i]
              
              let SRC = "";
              if (contentType === "IMAGE"){
                SRC = "/images/IMG.png";
              }
              else if (contentType === "VIDEO"){
                SRC = "/images/MP4.png";
              }
              else if (contentType === "MUSIC"){
                SRC = "/images/MP3.png";
              }
              else if (contentType === "TEXT"){
                SRC = "/images/TXT.png";
              }
              else if (contentType === "COMPRESS"){
                SRC = "/images/ZIP.png";
              }
              else{
                SRC = "/images/file.png";
              }
              return (
                <div 
                  className="FeedItem" 
                  key={contentHash}
                  onClick={() => ui.showModal({
                    header: 'Download Certification',
                    content: (
                      <DownloadContent 
                        cName={contentName}
                        cSize={byteSize}
                        cHash={contentHash}
                        cType={contentType}
                        cDesc={contentDesc}
                        accessLocation={accessLocation}
                        createdTime={createTime}
                        endPoint={endpoint}
                      />
                    ),
                  })}
                >
                <div className="FeedItem__image">
                  <img 
                  src={SRC} alt="image" />
                </div>
                <div className="FeedItem__info">
                  <ContentInfo
                    name={contentName}
                    issueDate={createTime}
                  />
                </div>
              </div>
            )
          })
          : <span className="Feed__empty">No Contents :D</span>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  feed: state.contents.feed,

})

const mapDispatchToProps = (dispatch) => ({
  getFeed: () => 
  dispatch(contentActions.getFeed()),
  
})

export default connect(mapStateToProps, mapDispatchToProps)(Feed)
