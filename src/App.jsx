import { useState } from 'react'
import './index.css'

const App = () => {
  const [username, setUsername] = useState('')
  const [commit, setCommit] = useState(null)
  const [repoName, setRepoName] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCommit(null)
    setRepoName(null)

    try {
      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`)

      if (!reposRes.ok) {
        throw new Error(`Error: ${reposRes.status} ${reposRes.statusText}`)
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
        throw new Error("No commits found in repositary.")
      }

      const commit = commits[0].commit
      setCommit(commit)

      console.log("Most recent pushed commit", commit.name)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="container">
      <h1>Find your First GitHub Commit</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
        />
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