import React, { useState, useEffect } from 'react';
import '../styles/Article.css';
import type { Post } from '@joanne-web/shared';

import { Navigation, Footer } from './Essentials';

const Header: React.FC = () => {
  return (
    <header>
      <div className="nav-container container">
        <div className="logo">JC</div>
        <ul className="nav-links">
          <li><Navigation /></li>
        </ul>
      </div>
    </header>
  );
};

const Article: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // The backend runs on port 3001
        const response = await fetch('http://localhost:3001/api/posts');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="Article">
      <Header />
      <main>
        <div className="container">
          <h1>Articles</h1>
          {loading && <p>Loading posts...</p>}
          {error && <p>Error fetching posts: {error}</p>}
          {!loading && !error && (
            <div>
              {posts.length > 0 ? (
                posts.map(post => (
                  <div key={post.id} className="post">
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                    <small>Posted on: {new Date(post.created_at).toLocaleDateString()}</small>
                  </div>
                ))
              ) : (
                <p>No posts found.</p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Article;