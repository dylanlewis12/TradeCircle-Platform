/*
{/* Listings Tab - All offerings and seekings *//*}
{activeTab === 'listings' && (
  <div className="tab-content">
    <h2>My Listings</h2>
    <div className="listings-filter">
      <button onClick={() => setListingFilter('offering')}>Offering</button>
      <button onClick={() => setListingFilter('seeking')}>Seeking</button>
    </div>
    
    {filteredListings.map(skill => (
      <div key={skill._id} className="listing-card">
        <h3>{skill.name}</h3>
        <p>Type: {skill.listingType}</p>
        <p>Status: {skill.status}</p>
        <button>Edit Listing</button>
      </div>
    ))}
  </div>
)}
*/