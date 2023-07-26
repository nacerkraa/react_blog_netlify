import React from 'react';
import { Link } from 'react-router-dom';

function Missing() {
  return (
    <main className='Missing'>
        <h2>Page Not found</h2>
        <p>Well, That's dissaponting</p>
        <p>
            <Link to='/'>Visit Our Homepage</Link>
        </p>
    </main>
  )
}

export default Missing