import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import axios from 'axios';

function SlidingCatagories( { selectedCategory, setSelectedCategory} ) {
    const [categories, setCategories] = useState([]);
    const dispatch = useDispatch();

    useEffect(()=>{
            const getCategories = async ()=>{
                try {
                    dispatch({
                      type: "SHOW_LOADING",
                    });
                    const {data} = await axios.get('/api/categories/getCategories');
                    setCategories(data);
                    // console.log(data);
              
                    dispatch({
                      type: "HIDE_LOADING",
                    });
                  } catch(error) {
                    console.log(error);
                  }
            }

            getCategories();
    },[])

  return (
    <div>
        <div className="category">

        <div className="categories-slide">

        <button className={`categoryBtn ${selectedCategory === "All" && 'category-active' } ` } onClick={() => setSelectedCategory("All")}>
            All
          </button>

            {categories.map((element) => (

          <button key={element.category} className={`categoryBtn ${selectedCategory === element.category && 'category-active'}`} onClick={() => setSelectedCategory(element.category)}>
            {element.category}
          </button>
          
        ))}
        </div>
      </div>
    </div>
  )
}

export default SlidingCatagories