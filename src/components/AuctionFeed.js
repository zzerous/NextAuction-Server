import React, { Component } from 'react'
import object from 'klaytn/Contracts'
import { connect } from 'react-redux'
import ui from 'utils/ui'
import Loading from 'components/Loading'
import ContentInfo from 'components/ContentInfo'
import AuctionInfo from 'components/AuctionInfo'

import * as aucActions from 'redux/actions/auctions'

import './AuctionFeed.scss'

class AuctionFeed extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: !props.aucfeed,
      BidOwner: '',
    }
  }
  static getDerivedStateFromProps = (nextProps, prevState) => {
    const isUpdatedFeed = (nextProps.aucfeed !== prevState.aucfeed) && (nextProps.aucfeed !== null)
    if (isUpdatedFeed) {
      return { isLoading: false }
    }
    return null
  }

  componentDidMount() {
    const { aucfeed, getAuctionFeed } = this.props
    if (!aucfeed) 
      getAuctionFeed()
      
  }

  render() {
    const { aucfeed } = this.props;
    if (this.state.isLoading) return <Loading />
    return (

    <div>

      <div className="Feed__Desc">Main Auction Page</div>

      <div className="AucFeed">
        { aucfeed.length !== 0
          ? aucfeed.map(({
              auctionName,
              auctionID,
              timestamp,
              minprice,
              NFT,
              description,
              contentCreator,
              contentOwner,
              NFTAddr,
              owner,
              state,
            }) => { 
              
              let contentType = auctionName.slice(-3);

              switch(contentType){
                case 'mp4':
                  auctionName = 'MP4.png'; break;
                case 'mp3':
                  auctionName = 'MP3.png'; break;
                case 'txt':
                  auctionName = 'TXT.png'; break;
                default:
                  auctionName = auctionName; 
              }
              let SRC = "/images/"+auctionName;

              const unixTimestamp = new Date(timestamp*1000);
              const options = {year:"numeric", month:"long", day:"numeric", hour:"numeric"}
              const expTime = unixTimestamp.toLocaleDateString("en-US", options);

              return (
                <div 
                  className="FeedItem" 
                  key={auctionID}
                  onClick={() => 
                    ui.showModal({
                    header: 'Auction INFO',
                    content: (
                      <AuctionInfo
                        aucName={auctionName}
                        aucID={auctionID}
                        aucEXP={expTime}
                        timestamp={unixTimestamp}
                        aucMIN={minprice}
                        aucDesc={description}
                        nftAddr={NFTAddr}
                        aucOwner={owner}
                        contentCreator={contentCreator}
                        contentOwner={contentOwner}
                        NFT={NFT}
                        aucState={state}
                        image={SRC}
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
                    name={auctionName}
                    issueDate={expTime}
                  />
                </div>
              </div>
            )
          })
          : <span className="Feed__empty">No Contents :D</span>
        }
      </div>
    </div>
    )
  }
}

const mapStateToProps = (state) => ({
  aucfeed: state.auctions.aucfeed,

})

const mapDispatchToProps = (dispatch) => ({
  getAuctionFeed: () => 
  dispatch(aucActions.getAuctionFeed()),
  
})

export default connect(mapStateToProps, mapDispatchToProps)(AuctionFeed)
