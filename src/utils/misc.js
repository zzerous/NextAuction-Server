const isArray = (obj) => obj instanceof Array

const renameKeys = (obj, newKeys) => Object
  .keys(obj)
  .reduce((acc, key) => ({
    ...acc,
    ...{ [newKeys[key] || key]: obj[key] },
  }), {})

export const feedParser = (feed) => {
  const contentKeys = {
    0: 'contentName',
    1: 'fileType',
    2: 'contentSize',
    3: 'contentHash',
    4: 'contentType',
    5: 'contentDesc',
    6: 'accessLocation',
    7: 'createTime',
    8: 'issuer',
    9: 'audience',
    10: 'endpoint',
    11: 'signature'
  }

  /**
   * 1. If feed is one object of file,
   * rename just one file object's keys
   */
  if (!isArray(feed)) {
    return renameKeys(feed, contentKeys)
  }
  /**
   * 2. If feed is array of files,
   * Iterate feed array to rename all of file objects' keys
   */

  const parsedFeed = feed.map((file) => renameKeys(file, contentKeys))
  return parsedFeed
  
}
