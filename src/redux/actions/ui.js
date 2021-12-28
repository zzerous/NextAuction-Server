import {
  SHOW_MODAL,
  HIDE_MODAL,
} from './actionTypes'

export const showModal = (content) => {
  return ({
    type: SHOW_MODAL,
    payload: {
      content,
    },
  })
}

export const hideModal = () => ({
  type: HIDE_MODAL,
})
