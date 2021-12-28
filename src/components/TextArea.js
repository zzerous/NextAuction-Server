import React from 'react'
import cx from 'classnames'

import './TextArea.scss'

const TextArea = ({
  className,
  name,
  label,
  value,
  err,
  cols,
  rows,
  readOnly,
}) => (
  <div className={cx('TextArea', className)}>
    {
      label &&
      <label className="TextArea__label" htmlFor={name}>
        {label}
      </label>
    }
    <textarea
      id={name}
      name={name}
      value={value}
      cols={cols}
      rows={rows}
      readOnly={readOnly}
      className={cx(
        'TextArea__input',
        { 'TextArea__input--err': err },
      )}
      autoComplete="off"
    />
    {
      err &&
      <p className="TextArea__err">{err}</p>
    }
  </div>
)

export default TextArea
