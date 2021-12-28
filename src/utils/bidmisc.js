const isArray = (obj) => obj instanceof Array

const renameKeys = (obj, newKeys) => Object
  .keys(obj)
  .reduce((acc, key) => ({
    ...acc,
    ...{ [newKeys[key] || key]: obj[key] },
  }), {})

export const bidParser = (feed) => {
  const bidKeys = {
    0: 'bidOwner',
    1: 'bidAmount',
  }

  /**
   * 1. If feed is one object of file,
   * rename just one file object's keys
   */
  if (!isArray(feed)) {
    return renameKeys(feed, bidKeys)
  }
  /**
   * 2. If feed is array of files,
   * Iterate feed array to rename all of file objects' keys
   */

  const parsedFeed = feed.map((file) => renameKeys(file, bidKeys))
  return parsedFeed
  
}
