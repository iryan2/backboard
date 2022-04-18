import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getHead as getHeadSelector } from 'features/selectors'
import rootReducer from 'rootReducer'
import { AppThunk } from 'store'

const host = 'https://iryan2.backboard.page'
const linksPath = `${host}/links`

export type Link = {
  id: string
  title: string
  href: string
  timestamp: string
  next: string | null
  prev: string | null
}

type Head = string

export type RootState = ReturnType<typeof rootReducer>
type State = {
  head: Head
  links: Link[]
}
export type GetState = () => RootState

const linksSlice = createSlice({
  name: 'links',
  initialState: { head: '', links: [] as Link[] },
  reducers: {
    headLoaded: (state: State, action: PayloadAction<Head>) => ({
      ...state,
      head: action.payload,
    }),
    linkLoaded: (state: State, action: PayloadAction<Link>) => ({
      ...state,
      links: [...state.links, action.payload],
    }),
  },
})

export default linksSlice

async function getHead() {
  const response = await fetch(`${linksPath}/head.json`)
  const data = await response.json()
  return data
}

export const fetchHead = (): AppThunk => async (dispatch: any) => {
  try {
    const head = await getHead()
    dispatch(linksSlice.actions.headLoaded(head.head))
  } catch (e) {
    console.error(e)
  }
}

async function getLink(head: Head) {
  const response = await fetch(`${linksPath}/${head}.json`)
  const data = await response.json()
  return data
}

export const fetchLink =
  (head: Head): AppThunk =>
  async (dispatch: any) => {
    try {
      const link = await getLink(head)
      dispatch(linksSlice.actions.linkLoaded(link))
      if (link.prev) {
        dispatch(fetchLink(link.prev))
      }
    } catch (e) {
      console.error(e)
    }
  }

export const fetchLinks =
  (): AppThunk => async (dispatch: any, getState: any) => {
    try {
      await dispatch(fetchHead())
      const head = getHeadSelector(getState())

      if (head) {
        await dispatch(fetchLink(head))
      }
    } catch (e) {
      console.error(e)
    }
  }
