import { useState } from 'react'
import './index.css'

const App = () => {
  const [username, setUsername] = useState('')
  const [commit, setCommit] = useState(null)
  const [repoName, setRepoName] = useState(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCommit(null)
    setRepoName(null)
    setError('')

    try {
      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`)

      if (reposRes.status === 404) {
        throw new Error("User not found. Please check the username and try again.")
      }

      if (reposRes.status === 403) {
        throw new Error("Rate limit exceeded. Please try again later.")
      }      

      const repos = await reposRes.json()
      
      if (repos.length === 0) {
        throw new Error("No repos found")
      }
      
      const repoName = repos[repos.length - 1].name
      setRepoName(repoName)

      const commitsRes = await fetch(`https://api.github.com/repos/${username}/${repoName}/commits?per_page=1`)
      const commits = await commitsRes.json()
      
      if (commits.length === 0) {
        throw new Error("No commits found in repository.")
      }

      const commit = commits[0].commit
      setCommit(commit)

    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container">
      <h1>Find your first GitHub Commit</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter GitHub username"
          />
          {error && <div className="error">{error}</div>}
        </div>
        <button type="submit">Search</button>
      </form>
      {commit && (
        <div className="result">
          <div><strong>Repository:</strong> {repoName}</div>
          <div><strong>Author:</strong> {commit.author.name}</div>
          <div><strong>Date:</strong> {commit.author.date}</div>
          <div><strong>Message:</strong> {commit.message}</div>
        </div>
      )}
    </div>
  )

}

export default App