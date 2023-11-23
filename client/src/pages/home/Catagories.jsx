import React from 'react'

function Catagories( { selectedCategory, setSelectedCategory, setSearchInput, searchInput} ) {

    const categories = [
        {
          name: "Catagory-1",
        },
        {
          name: "Catagory-2",
        },
        {
          name: "Catagory-3",
        },
    
      ]

  return (
    <div>
        <div className="category">

        <button className={`categoryBtn ${selectedCategory === "All" && 'category-active' } ` } onClick={() => setSelectedCategory("All")}>
            {/* <h3 className="categoryName">All</h3> */}
            All
          </button>

        {categories.map((category) => (

          <button key={category.name} className={`categoryBtn ${selectedCategory === category.name && 'category-active'}`} onClick={() => setSelectedCategory(category.name)}>
            {category.name}
            {/* Category-o... */}
          </button>
        ))}
        
        <div className="searchInput">
            <input 
                className='searchInputHome' 
                type="text"  
                onChange={ e => setSearchInput(e.target.value)}
                value={searchInput}
                placeholder='Search Product'
                 />
        </div>

      </div>
    </div>
  )
}

export default Catagories