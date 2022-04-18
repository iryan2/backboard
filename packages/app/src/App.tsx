import { useToken } from 'sections/login/useToken'
import { AddLinkForm } from 'sections/create/AddLinkForm'
import './App.css'
import { Links } from 'sections/links/LinksSection'

const App: React.FC = () => {
  const token = useToken()

  const loggedIn = typeof token === 'string'
  return (
    <div className="App">
      <AddLinkForm loggedIn={loggedIn} />
      <Links />
    </div>
  )
}

export default App
