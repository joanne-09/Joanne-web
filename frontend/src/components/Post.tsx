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
    <div className="relative isolate min-h-screen w-full bg-[var(--footer-background)]">
      <Navbar />
      <main className="relative z-[2] min-h-screen bg-[var(--background)] px-5 pb-20 pt-28 text-[var(--text)] shadow-[var(--page-shadow)] md:pt-36">
        <div className="mx-auto w-full max-w-[920px]">
          {error && <p>Error fetching post: {error}</p>}
          {loading && <Loading />}
          {!loading && !error && post && (
            <article>
              <div className="border-b border-[var(--border-strong)] pb-8">
                <p className="mb-4 text-sm font-semibold uppercase text-[var(--accent)]">Article</p>
                <h1 className="font-serif text-4xl font-semibold leading-tight text-[var(--primary)] md:text-6xl">{post.title}</h1>
                <div className="mt-7 flex flex-col gap-4 text-sm text-[var(--text-muted)]">
                  <span>Posted on {new Date(post.created_at).toLocaleDateString()}</span>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map(tag => (
                        <span key={tag} className="rounded-full border border-[var(--tag-border)] bg-[var(--tag-background)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="prose prose-lg mt-10 max-w-none text-[var(--text)]">
                <p className="whitespace-pre-line text-lg leading-9" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
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
