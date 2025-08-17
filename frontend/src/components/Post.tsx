import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar, Footer } from './Essentials';
import type { Post } from '@joanne-web/shared';
import '../styles/Post.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/posts/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPost(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  return (
    <div className="Article">
      <Navbar />
      <main className="article-detail-main">
        <div className="container">
          {loading && <p>Loading post...</p>}
          {error && <p>Error fetching post: {error}</p>}
          {post && (
            <article className="article-content">
              <h1>{post.title}</h1>
              <small className="article-meta">
                Posted on: {new Date(post.created_at).toLocaleDateString()}
              </small>
              <div className="article-body">
                {/* Using dangerouslySetInnerHTML to render newlines, use with caution */}
                <p dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
              </div>
            </article>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleDetail;