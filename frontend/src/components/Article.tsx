import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Article.css';
import type { Post } from '@joanne-web/shared';

import { Navbar, Footer } from './Essentials';
import Loading from './Loading';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const ArticleLists: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
    navigate(`/article/${postId}`);
  };

  return (
    <section className="article-lists">
      <div className="container">
        <h1 className="page-title">Articles</h1>
        {loading && <Loading />}
        {error && <p>Error fetching posts: {error}</p>}
        {!loading && !error && (
          <div className="posts-container">
            {posts.length > 0 ? (
              posts.map(post => (
                <div key={post.id} className="post-entry" onClick={() => handleTitleClick(post.id)}>
                  <div className="post-entry-content">
                    <h2>{post.title}</h2>
                    <p>{post.content.substring(0, 150)}...</p>
                  </div>
                  <div className="post-entry-meta">
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