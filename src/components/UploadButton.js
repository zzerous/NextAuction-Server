import React from 'react'
import ui from 'utils/ui'
import UploadContent from 'components/UploadContent'

import './UploadButton.scss'

const UploadButton = () => (
  <button
    className="UploadButton"
    onClick={() => ui.showModal({
      header: 'Upload Content',
      content: <UploadContent />,
    })}
  >
    Upload Content
  </button>
)

export default UploadButton
