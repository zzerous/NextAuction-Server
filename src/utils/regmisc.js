const isArray = (obj) => obj instanceof Array

const renameKeys = (obj, newKeys) => Object
  .keys(obj)
  .reduce((acc, key) => ({
    ...acc,
    ...{ [newKeys[key] || key]: obj[key] },
  }), {})

export const regfeedParser = (feed) => {
  const registerKeys = {
    0: 'contentName',
    1: 'auctionID',
    2: 'expiretime',
    3: 'minprice',
    4: 'NFT',
    5: 'description',
    6: 'NFTAddr',
    7: 'owner',
    8: 'state',
  }

  /**
   * 1. If feed is one object of file,
   * rename just one file object's keys
   */
  if (!isArray(feed)) {
    return renameKeys(feed, registerKeys)
  }
  /**
   * 2. If feed is array of files,
   * Iterate feed array to rename all of file objects' keys
   */

  const parsedFeed = feed.map((file) => renameKeys(file, registerKeys))
  return parsedFeed
  
}
