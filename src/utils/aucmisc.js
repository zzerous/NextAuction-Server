const isArray = (obj) => obj instanceof Array

const renameKeys = (obj, newKeys) => Object
  .keys(obj)
  .reduce((acc, key) => ({
    ...acc,
    ...{ [newKeys[key] || key]: obj[key] },
  }), {})

export const aucfeedParser = (feed) => {
  const auctionKeys = {
    0: 'auctionName',
    1: 'auctionID',
    2: 'timestamp',
    3: 'minprice',
    4: 'NFT',
    5: 'description',
    6: 'contentCreator',
    7: 'contentOwner',
    8: 'NFTAddr',
    9: 'owner',
    10: 'state',
  }

  /**
   * 1. If feed is one object of file,
   * rename just one file object's keys
   */
  if (!isArray(feed)) {
    return renameKeys(feed, auctionKeys)
  }
  /**
   * 2. If feed is array of files,
   * Iterate feed array to rename all of file objects' keys
   */

  const parsedFeed = feed.map((file) => renameKeys(file, auctionKeys))
  return parsedFeed
  
}
