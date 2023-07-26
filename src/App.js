import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import NewPost from './components/NewPost';
import EditPost from './components/EditPost';
import PostPage from './components/PostPage';
import About from './components/About';
import Missing from './components/Missing';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { format, set } from 'date-fns';
import api from './api/posts';

function App() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [editTitle, setEditTitle] = useState(null);
  const [editBody, setEditBody] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await api.get("/posts");
        setPosts(response.data);
      } catch (error) {
        if (error.response) {
          // show errors
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else {
          console.log(`Error :${error.message}`);
        }
      }
    }

    fetchPost();
  }, []);

  useEffect(() => {
    const filterResults = posts.filter(post =>
          ((post.body).toLowerCase()).includes(search.toLowerCase())
      ||  ((post.title).toLowerCase()).includes(search.toLowerCase()));
      setSearchResults(filterResults.reverse());
  }, [posts, search]);



  async function handleSubmit(e) {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const date = format(new Date(), 'yyyy-MM-dd');
    const newPost = {id, title: postTitle, datetime: date, body: postBody};
    try {
      const response = await api.post('/posts', newPost);
      const allPosts = [...posts, response.data];
      setPosts(allPosts);
      setPostTitle('');
      setPostBody('');
      navigate('/');
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }

  async function handleEdit(id) {
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const updatedPost = { id, title: editTitle, datetime, body: editBody };
    try {
      const response = await api.put(`/posts/${id}`, updatedPost);
      setPosts(posts.map(post => post.id === id ? { ...response.data } : post));
      setEditTitle('');
      setEditBody('');
      navigate('/');
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/posts/${id}`);
      const newPost = posts.filter(item => item.id !== id);
      setPosts(newPost);
      navigate('/');
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
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

          <Route path="/edit/:id"
            element={
              <EditPost
                posts={posts}
                handleEdit={handleEdit}
                editTitle={editTitle}
                setEditTitle={setEditTitle}
                editBody={editBody}
                setEditBody={setEditBody}
              />
            }
          />
          
          <Route exact path='/post/:id' element={<PostPage posts={posts} handleDelete={handleDelete}/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='*' element={<Missing/>}/>
        </Routes>
      <Footer />
    </div>
  );
}

export default App;