import React, {useRef} from 'react'
import cx from 'classnames'

import './InputContent.scss'

const InputContent = ({
  className,
  name,
  value,
  label,
  contentName,
  onChange,
  required,
  err,
}) => {
  const el = useRef();
  return (
  <div className={cx('InputContent', className, { 'InputContent--err': err })}>
    <p className="InputContent__label">{label}</p>
    <label className="InputContent__button" htmlFor="upload">
      Search
    </label>
    <input
      className="InputContent__input"
      id="upload"
      type="file"
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      ref={el}
    />
    <p
      className={cx('InputContent__contentName', {
        'InputContent__contentName--empty': !contentName,
      })
      }
    >
      {contentName || 'No content !'}
    </p>
    {
      err &&
      <p className="InputContent__err">{err}</p>
    }
  </div>
  );
}

export default InputContent
