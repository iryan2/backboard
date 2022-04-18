import { combineReducers } from '@reduxjs/toolkit'
import links from './sections/links/linksSlice'

const rootReducer = combineReducers({
  links: links.reducer,
})

export default rootReducer
