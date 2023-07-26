import React from 'react'
import Feed from './Feed';

function Home({posts}) {
  return (
    <main className='Home'>
        {posts.length > 0 ? 
          <Feed posts={posts}/>
        : (
          <p style={{marginTop: "2rem"}}>
            No posts found.
          </p>
        )}
    </main>
  )
}

export default Home;