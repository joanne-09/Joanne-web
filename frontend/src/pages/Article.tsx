import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Navbar, Footer } from '../components/Essentials';
import { useData } from '../contexts/DataContext';
import LoadingPage from './LoadingPage';

const tagButtonClass = (active: boolean) =>
  `${active ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--text-light)]' : 'border-[var(--border-strong)] bg-transparent text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]'} rounded-full border px-4 py-2 text-sm font-semibold transition`;

const ArticleLists: React.FC = () => {
  const { articles: posts, error } = useData();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag ? (post.tags && post.tags.includes(selectedTag)) : true;
      return matchesSearch && matchesTag;
    });
  }, [posts, searchQuery, selectedTag]);

  return (
    <section className="w-full bg-[var(--background)]">
      <div className="mb-10 flex w-full flex-col gap-5 border-y border-[var(--border-strong)] py-5">
        <div className="flex flex-wrap items-center gap-3">
          <button
            className={`${isSearchVisible ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-[var(--border-strong)] text-[var(--primary)]'} flex h-10 w-10 items-center justify-center rounded-full border bg-transparent transition hover:border-[var(--accent)] hover:text-[var(--accent)]`}
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            title="Toggle Search"
            aria-label="Toggle Search"
          >
            <span className="text-sm font-semibold" aria-hidden="true">⌕</span>
          </button>

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button className={tagButtonClass(selectedTag === null)} onClick={() => setSelectedTag(null)}>All</button>
              {allTags.map(tag => (
                <button key={tag} className={tagButtonClass(selectedTag === tag)} onClick={() => setSelectedTag(tag)}>{tag}</button>
              ))}
            </div>
          )}
        </div>

        {isSearchVisible && (
          <input
            type="text"
            className="w-full border-0 border-b border-[var(--border-strong)] bg-[var(--input-background)] px-0 py-4 text-base text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:shadow-[var(--focus-ring)]"
            placeholder="Search articles by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        )}
      </div>

      {error && <p>Error fetching posts: {error}</p>}
      {!error && (
        <div className="border-t border-[var(--border-strong)]">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <article
                key={post.id}
                className="group grid cursor-pointer gap-5 border-b border-[var(--border-strong)] py-8 transition hover:bg-[var(--button-hover-background)] md:grid-cols-[70px_1fr_150px]"
                onClick={() => navigate(`/article/${post.id}`)}
              >
                <p className="text-sm font-semibold text-[var(--accent)]">{String(index + 1).padStart(2, '0')}</p>
                <div>
                  <h2 className="text-3xl font-semibold leading-tight text-[var(--primary)] transition group-hover:text-[var(--accent)]">{post.title}</h2>
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map(tag => (
                        <span key={tag} className="rounded-full border border-[var(--tag-border)] bg-[var(--tag-background)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">{tag}</span>
                      ))}
                    </div>
                  )}
                  <p className="mt-4 max-w-[780px] leading-7 text-[var(--text-muted)]">{post.content.substring(0, 180)}...</p>
                </div>
                <div className="text-sm text-[var(--text-muted)] md:text-right">
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </article>
            ))
          ) : (
            <p className="py-8 text-[var(--text-muted)]">No posts found.</p>
          )}
        </div>
      )}
    </section>
  );
};

const Article: React.FC = () => {
  const { loading } = useData();

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="relative isolate min-h-screen w-full bg-[var(--footer-background)]">
      <Navbar />
      <main className="relative z-[2] min-h-screen bg-[var(--background)] px-5 pb-20 pt-28 text-[var(--text)] shadow-[var(--page-shadow)] md:pt-36">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="mb-14 grid gap-6 md:grid-cols-[0.72fr_1fr] md:items-end">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase text-[var(--accent)]">Writing</p>
              <h1 className="font-serif text-5xl font-semibold leading-tight text-[var(--primary)] md:text-7xl">Articles</h1>
            </div>
          </div>
          <ArticleLists />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Article;
