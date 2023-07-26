import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import NewPost from './components/NewPost';
import PostPage from './components/PostPage';
import About from './components/About';
import Missing from './components/Missing';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

function App() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'My First Post',
      datetime: '2021-01-01',
      body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
    },
    {
      id: 2,
      title: 'My Second Post',
      datetime: '2021-01-02',
      body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
    },
    {
      id: 3,
      title: 'My Third Post',
      datetime: '2021-01-03',
      body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
    },
    {
      id: 4,
      title: 'My Fourth Post',
      datetime: '2021-01-04',
      body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
    }
  ]);

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const filterResults = posts.filter(post =>
          ((post.body).toLowerCase()).includes(search.toLowerCase())
      ||  ((post.title).toLowerCase()).includes(search.toLowerCase()));
      setSearchResults(filterResults.reverse());
  }, [posts, search]);

  function handleDelete(id) {
    const newPost = posts.filter(item => item.id !== id);
    setPosts(newPost);
    navigate('/');
  }

  function handleSubmit(e) {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const date = format(new Date(), 'yyyy-MM-dd');
    const newPost = {id, title: postTitle, datetime: date, body: postBody};
    const allPosts = [...posts, newPost];
    setPosts(allPosts);
    setPostTitle('');
    setPostBody('');
    navigate('/');
  }

  return (
    <div className="App">
      <Header title="Brand"/>
      <Navbar search={search} setSearch={setSearch}/>
        <Routes>
          <Route exact path='/' element={<Home posts={searchResults}/>}/>
          <Route exact path='/post' element={<NewPost 
            handleSubmit={handleSubmit}
            postTitle={postTitle}
            setPostTitle={setPostTitle}
            postBody={postBody}
            setPostBody={setPostBody}
          />}/>
          <Route exact path='/post/:id' element={<PostPage posts={posts} handleDelete={handleDelete}/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='*' element={<Missing/>}/>
        </Routes>
      <Footer />
    </div>
  );
}

export default App;