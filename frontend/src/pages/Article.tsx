import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Article.css';

import { Navbar, Footer } from '../components/Essentials';
import { useData } from '../contexts/DataContext';
import LoadingPage from './LoadingPage';

const ArticleLists: React.FC = () => {
  const { articles: posts, error } = useData();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const handleTitleClick = (postId: number) => {
    navigate(`/article/${postId}`);
  };

  // Extract unique tags from all posts
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [posts]);

  // Filter posts based on search query and selected tag
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag ? (post.tags && post.tags.includes(selectedTag)) : true;
      return matchesSearch && matchesTag;
    });
  }, [posts, searchQuery, selectedTag]);

  return (
    <section className="article-lists">
      <div className="article-filters">
        {/* tags button */}
        <div className="filter-controls">
          <button 
            className={`icon-btn search-toggle-btn ${isSearchVisible ? 'active' : ''}`}
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            title="Toggle Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          
          <div className="filter-divider"></div>

          {allTags.length > 0 && (
            <div className="tag-filters">
              <button 
                className={`tag-btn ${selectedTag === null ? 'active' : ''}`}
                onClick={() => setSelectedTag(null)}
              >
                All
              </button>
              {allTags.map(tag => (
                <button 
                  key={tag}
                  className={`tag-btn ${selectedTag === tag ? 'active' : ''}`}
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* search bar */}
        {isSearchVisible && (
          <input 
            type="text" 
            className="search-input"
            placeholder="Search articles by title..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        )}
      </div>
      
      {error && <p>Error fetching posts: {error}</p>}
      {!error && (
        <div className="posts-container">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <div key={post.id} className="post-entry" onClick={() => handleTitleClick(post.id)}>
                <div className="post-entry-content">
                  <h2>{post.title}</h2>
                  {post.tags && post.tags.length > 0 && (
                    <div className="post-tags">
                      {post.tags.map(tag => (
                        <span key={tag} className="post-tag-pill">{tag}</span>
                      ))}
                    </div>
                  )}
                  <p>{post.content.substring(0, 150)}...</p>
                </div>
                <div className="post-entry-date">
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <p>No posts found.</p>
          )}
        </div>
      )}
    </section>
  )
};

const Article: React.FC = () => {
  const { loading } = useData();

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="Article">
      <Navbar />
      <main>
        <div className="container">
          <h1 className="page-title">Articles</h1>
          <ArticleLists />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Article;