import React, { useState, useEffect } from 'react';
import '../styles/Article.css';
import type { Post } from '@joanne-web/shared';

import { Navbar, Footer } from './Essentials';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const ArticleLists: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/posts`);
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

  const handleTitleClick = (postId: number) => {
    setExpandedPostId(prevId => (prevId === postId ? null : postId));
  };

  return (
    <div className="container">
      <h1>Articles</h1>
      {loading && <p>Loading posts...</p>}
      {error && <p>Error fetching posts: {error}</p>}
      {!loading && !error && (
        <div>
          {posts.length > 0 ? (
            posts.map(post => (
              <div key={post.id} className="post">
                <h2 onClick={() => handleTitleClick(post.id)} style={{ cursor: 'pointer' }}>
                  {post.title}
                </h2>
                {expandedPostId === post.id && (
                  <>
                    <p>{post.content}</p>
                    <small>Posted on: {new Date(post.created_at).toLocaleDateString()}</small>
                  </>
                )}
              </div>
            ))
          ) : (
            <p>No posts found.</p>
          )}
        </div>
      )}
    </div>
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