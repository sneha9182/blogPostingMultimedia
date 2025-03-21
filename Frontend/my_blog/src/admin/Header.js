
import { BellIcon, SearchIcon } from '@heroicons/react/solid';
import axios from 'axios';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LetterCanvas from '../component/LetterCanvas';

const Header = ({ user, onSignOut, setSearchQuery }) => {
    const [notificationCount, setNotificationCount] = useState(0);
    const [letter, setLetter] = useState('');

    const handleSearch = useCallback(
        debounce((searchQuery) => {
            setSearchQuery(searchQuery);
        }, 300), // Adjust the delay time as needed (e.g., 300ms)
        []
      );

    useEffect(() => {
        const fetchNotificationCount = async () => {
            try {
                const response = await axios.get('http://localhost:9001/admin/notificationsCount');
                const count = parseInt(response.data.count, 10);
                console.log('Notification count fetched:', count);
                setNotificationCount(count);
            } catch (error) {
                console.error('Error fetching notification count:', error);
            }
        };
    
        fetchNotificationCount();
    }, []);
 


  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.error('No token found in localStorage');
          return;
        }

        const response = await axios.get('http://localhost:9001/admin/letter', {
          headers: {
            'token': `${token}`
          }
        });

        const capitalizedLetter = response.data.firstLetter ? response.data.firstLetter.toUpperCase() : '';
        setLetter(capitalizedLetter);
      } catch (error) {
        console.error('Error fetching letter:', error.response ? error.response.data : error.message);
      }
    };
    fetchLetter();
  }, []);


    return (
        <header className="bg-gray-900 text-white flex justify-between items-center p-4 shadow-md">
            <div className="flex items-center bg-gray-800 p-2 rounded-full border border-gray-700">
                <SearchIcon className="h-5 w-5 text-gray-400 mr-2" />
                <input
                    type="text"
                    placeholder="Search blogs..."
                    className="bg-gray-800 text-white placeholder-gray-400 focus:outline-none w-full"
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            <div className="flex items-center space-x-6">
                <Link to="/notifications">
                <button className="relative text-gray-300 hover:text-gray-400">
                   <BellIcon className="h-8 w-8" />
                    <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {notificationCount}
                      </span>
                     </button>
                </Link>

                <div className="flex items-center space-x-4">
                <LetterCanvas letter={letter} />
                    <button
                        onClick={onSignOut}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition duration-200"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;