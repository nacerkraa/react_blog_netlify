import { createContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../api/posts';
import useAxiosFetch from '../hooks/useAxiosFetch';

const DataContex = createContext({});

export const DataProvider = ({children}) => {
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [editTitle, setEditTitle] = useState(null);
    const [editBody, setEditBody] = useState(null);
    const navigate = useNavigate();
    const {data, fetchError, isLoading} = useAxiosFetch("http://localhost:3500/posts");

    useEffect(()=> {
        setPosts(data);
    }, [data]);

    useEffect(() => {
        const filterResults = posts.filter(post =>
            ((post.body).toLowerCase()).includes(search.toLowerCase())
        ||  ((post.title).toLowerCase()).includes(search.toLowerCase()));
        setSearchResults(filterResults.reverse());
    }, [posts, search]);

    

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
        <DataContex.Provider value={{
            search, setSearch,
            searchResults, fetchError, isLoading,
            posts, setPosts, handleEdit, editTitle, setEditTitle, editBody, setEditBody,
            handleDelete
        }}>
            {children}
        </DataContex.Provider>
    )
};

export default DataContex;