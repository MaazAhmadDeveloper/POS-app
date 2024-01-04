import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function HeaderInput( {setSearchInput, searchInput, selectedCategory } ) {
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef();
  const { pathname } = location;

  useEffect(() => {

    if (pathname === '/') {
      inputRef.current.focus();
    }

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        navigate('/cart');
      }
    };
    document.addEventListener('keypress', handleKeyPress);
    // Clean up the event listener when the component is unmounted
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [selectedCategory]);

  return (
    <div>
        
        <div className="searchInput">
            <input 
                ref={inputRef}
                className='searchInputHome' 
                type="text"  
                onChange={ e => setSearchInput(e.target.value)}
                value={searchInput}
                placeholder='Search Product'
                 />
        </div>

      </div>
  )
}

export default HeaderInput