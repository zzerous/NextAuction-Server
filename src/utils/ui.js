import {
  showModal,
  hideModal,
} from 'redux/actions/ui'
import store from 'redux/store'

export const ui = {
  showModal: (content) => store.dispatch(showModal(content)),
  hideModal: () => store.dispatch(hideModal()),
}

export default ui
