import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar, Footer } from './Essentials';
import type { Post } from '@joanne-web/shared';
import Loading from './Loading';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || 'http://localhost:3001';

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
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  return (
    <div className="relative min-h-screen w-full bg-[#1a252f]">
      <Navbar />
      <main className="relative z-[3] min-h-screen bg-[var(--background)] pt-20 text-[var(--text)]">
        <div className="mx-auto w-full max-w-[1200px] px-5">
          {error && <p>Error fetching post: {error}</p>}
          {loading && <Loading />}
          {!loading && !error && post && (
            <article className="mx-auto my-[30px] min-w-[300px] max-w-[800px] rounded-lg bg-[var(--background-dark)] p-5 shadow-[0_3px_10px_var(--shadow-color)] sm:p-10">
              <h1 className="mb-[15px] font-serif text-2xl font-semibold text-[var(--primary)] sm:text-[32px]">{post.title}</h1>
              <div className="mb-[30px] flex flex-col gap-2.5 border-b border-[var(--secondary)] pb-5">
                <small className="block text-sm text-[var(--secondary)]">
                  Posted on: {new Date(post.created_at).toLocaleDateString()}
                </small>
                {post.tags && post.tags.length > 0 && (
                  <div className="mb-0 flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span key={tag} className="rounded-xl border border-[rgba(var(--primary-rgb),0.3)] bg-[rgba(var(--primary-rgb),0.1)] px-2.5 py-[3px] text-xs text-[var(--primary)]">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-[15px] leading-[1.8] text-[var(--text)] sm:text-[17px]">
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
