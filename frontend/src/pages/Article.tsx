import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Navbar, Footer } from '../components/Essentials';
import { useData } from '../contexts/DataContext';
import LoadingPage from './LoadingPage';

const tagButtonClass = (active: boolean) =>
  `${active ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--text-light)]' : 'border-[var(--accent-dark)] bg-transparent text-[var(--text)] hover:bg-[var(--accent-dark)] hover:text-[var(--text-light)]'} rounded-full border px-[15px] py-1.5 text-sm transition`;

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
    <section className="flex min-h-[calc(100vh-80px)] w-full flex-col items-start bg-[var(--background)] pb-[30px] pt-2.5">
      <div className="mb-[30px] flex w-full flex-col gap-[15px]">
        <div className="mb-2.5 flex flex-wrap items-center gap-[15px]">
          <button 
            className={`${isSearchVisible ? 'bg-[rgba(var(--primary-rgb),0.1)] text-[var(--primary)]' : 'text-[var(--primary)]'} flex h-9 w-9 items-center justify-center rounded-full border border-transparent bg-transparent p-2 transition hover:bg-[var(--background-dark)] hover:text-[var(--accent)]`}
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            title="Toggle Search"
            aria-label="Toggle Search"
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
          
          <div className="h-6 w-px bg-[var(--secondary)] opacity-50"></div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2.5">
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
            className="w-full rounded-lg border border-[var(--secondary)] bg-[var(--background-dark)] px-5 py-3 text-base text-[var(--text)] outline-none focus:border-[var(--primary)] focus:shadow-[0_0_0_2px_rgba(var(--primary-rgb),0.2)]"
            placeholder="Search articles by title..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        )}
      </div>
      
      {error && <p>Error fetching posts: {error}</p>}
      {!error && (
        <div className="flex w-full flex-col gap-5">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <div key={post.id} className="flex cursor-pointer flex-col rounded-lg bg-[var(--background-dark)] p-[25px] shadow-[0_3px_10px_rgba(0,0,0,0.05)] transition hover:-translate-y-[5px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] sm:flex-row sm:items-center sm:justify-between" onClick={() => navigate(`/article/${post.id}`)}>
                <div>
                  <h2 className="mb-2.5 text-[22px] font-semibold text-[var(--primary)]">{post.title}</h2>
                  {post.tags && post.tags.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {post.tags.map(tag => (
                        <span key={tag} className="rounded-xl border border-[rgba(var(--primary-rgb),0.3)] bg-[rgba(var(--primary-rgb),0.1)] px-2.5 py-[3px] text-xs text-[var(--primary)]">{tag}</span>
                      ))}
                    </div>
                  )}
                  <p className="leading-normal text-[var(--text)]">{post.content.substring(0, 150)}...</p>
                </div>
                <div className="mt-4 whitespace-nowrap text-sm text-[var(--secondary)] sm:ml-5 sm:mt-0">
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
  );
};

const Article: React.FC = () => {
  const { loading } = useData();

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="relative min-h-screen w-full bg-[#1a252f]">
      <Navbar />
      <main className="relative z-[3] min-h-screen bg-[var(--background)] pt-20 text-[var(--text)]">
        <div className="mx-auto w-full max-w-[1200px] px-5">
          <h1 className="mb-10 pt-2.5 text-center font-serif text-4xl font-semibold text-[var(--primary)]">Articles</h1>
          <ArticleLists />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Article;
