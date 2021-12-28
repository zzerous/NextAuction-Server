import React, { Component } from 'react'
import object from 'klaytn/Contracts'
import { connect } from 'react-redux'
import ui from 'utils/ui'
import Loading from 'components/Loading'
import ContentInfo from 'components/ContentInfo'
import AuctionInfo from 'components/AuctionInfo'
import AuctionDoneInfo from 'components/AuctionDoneInfo'

import * as aucActions from 'redux/actions/auctions'

import './UserAuctionFeed.scss'

class UserAuctionFeed extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: !props.userauc,
    }
  }
  static getDerivedStateFromProps = (nextProps, prevState) => {
    const isUpdatedFeed = (nextProps.userauc !== prevState.userauc) && (nextProps.userauc !== null)
    if (isUpdatedFeed) {
      return { isLoading: false }
    }
    return null
  }

  componentDidMount() {
    const { userauc, getUserAuction } = this.props
    if (!userauc) 
      getUserAuction()
      
  }

  render() {
    const { userauc } = this.props;
    if (this.state.isLoading) return <Loading />
    return (

    <div>
      <div className="Feed__Desc">User Auction Page</div>
      
      <div className="UserAuctionFeed">
        
        { userauc.length !== 0
          ? ( 
              userauc.map(({
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

                let SRC = "/images/"+auctionName;

                const unixTimestamp = new Date(timestamp*1000);
                const options = {year:"numeric", month:"long", day:"numeric", hour:"numeric"}
                const expTime = unixTimestamp.toLocaleDateString("en-US", options);

                if (state == 1){
                  state = "ACTIVE"

                  return (
                    
                    <div 
                      className="UserFeedItem" 
                      key={auctionID}
                      onClick={() => 
                        ui.showModal({
                          header: 'Auction INFO',
                          content: (
                            <AuctionInfo
                              aucName={auctionName}
                              aucID={auctionID}
                              aucEXP={expTime}
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
                        <img src={SRC} alt="image" />
                      </div>

                      <div className="FeedItem__info">
                        <ContentInfo
                          name={auctionName}
                          issueDate={expTime}
                          state={state}
                        />
                      </div>
                    </div> 
                  )
                }
                else if(state == 2){
                  state = "CANCEL"

                  return(
                    <div 
                      className="UserFeedItem" 
                      key={auctionID}
                      onClick={() => 
                        ui.showModal({
                          header: 'Cancel Auction Result',
                          content: (
                            <AuctionDoneInfo
                              aucName={auctionName}
                              aucID={auctionID}
                              aucDesc={description}
                              NFT={NFT}
                            />
                          ),
                        })}
                    >
                      <div className="FeedItem__image">
                        <img src={SRC} alt="image" />
                      </div>
                      
                      <div className="FeedItem__info">
                        <ContentInfo
                          name={auctionName}
                          issueDate={expTime}
                          state={state}
                        />
                      </div>
                    </div>                    
                  )
                }
                else if (state == 3){
                  state = "DONE"

                  return(

                    <div 
                      className="UserFeedItem" 
                      key={auctionID}
                      onClick={() => 
                        ui.showModal({
                          header: 'Auction Result',
                          content: (
                            <AuctionDoneInfo
                              aucName={auctionName}
                              aucID={auctionID}
                              aucDesc={description}
                              NFT={NFT}
                            />
                          ),
                        })}
                    >
                      <div className="FeedItem__image">
                        <img src={SRC} alt="image" />
                      </div>
                      
                      <div className="FeedItem__info">
                        <ContentInfo
                          name={auctionName}
                          issueDate={expTime}
                          state={state}
                        />
                      </div>
                    </div>
                  )
                }
                else{
                  state = "ERROR"
                }
              }) 
          )
          : <span className="Feed__empty">No Contents :D</span>
        }
      </div>
    </div>
    )
  }
}

const mapStateToProps = (state) => ({

  userauc : state.auctions.userauc,

})

const mapDispatchToProps = (dispatch) => ({
  getUserAuction: () => dispatch(aucActions.getUserAuction()),
  
})

export default connect(mapStateToProps, mapDispatchToProps)(UserAuctionFeed)
