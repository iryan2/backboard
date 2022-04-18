import { RootState } from '../store'

export const getHead = (state: RootState) => state.links.head
export const getLinks = (state: RootState) => state.links.links
