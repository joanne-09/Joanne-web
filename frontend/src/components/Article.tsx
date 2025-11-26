import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Article.css';

import { Navbar, Footer } from './Essentials';
import { useData } from '../contexts/DataContext';

const ArticleLists: React.FC = () => {
  const { articles: posts, error } = useData();
  const navigate = useNavigate();

  const handleTitleClick = (postId: number) => {
    navigate(`/article/${postId}`);
  };

  return (
    <section className="article-lists">
      <div className="container">
        <h1 className="page-title">Articles</h1>
        {error && <p>Error fetching posts: {error}</p>}
        {!error && (
          <div className="posts-container">
            {posts.length > 0 ? (
              posts.map(post => (
                <div key={post.id} className="post-entry" onClick={() => handleTitleClick(post.id)}>
                  <div className="post-entry-content">
                    <h2>{post.title}</h2>
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
      </div>
    </section>
  )
};

const Article: React.FC = () => {
  return (
    <div className="Article">
      <Navbar />
      <main>
        <ArticleLists />
      </main>
      <Footer />
    </div>
  );
};

export default Article;