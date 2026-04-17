import React, {useState, useEffect} from 'react'
import { SearchIcon } from '../assets/SearchIcon.jsx';

const ChannelSearch = () => {
    const [ query, setQuery ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const getChannels = async (text) => {
        try {
            // fetch channels
        }
        catch (error) {
            setQuery('');
        }
    }

    const onSearch = (event) => {
        event.preventDefault();
        setLoading(true); // onclicking search button, it will show loading state
        setQuery(event.target.value); // onclicking search button, it will set the query to the value of the input field
        getChannels(event.target.value); // onclicking search button, it will fetch the channels based on the query
    }
  return (
    <div className='channel-search__container'>
        <div className='channel-search__input__wrapper'>
            <div className='channel-search__input__icon'>
                <SearchIcon/>
            </div>
            <div className='channel-search__input__text'>
                <input
                className='channel-search__input__text'
                placeholder="Search conversations..."
                type='text'
                value={query}
                onChange={onSearch}
                />
            </div>
        </div>
      
    </div>
  )
}

export default ChannelSearch
