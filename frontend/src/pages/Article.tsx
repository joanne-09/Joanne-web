import React, { useMemo, useState } from 'react';

import { PageHeader, PageShell } from '../components/PageShell';
import { Container, EmptyState, Reveal, Tag } from '../components/ui';
import { SearchIcon } from '../components/Icons';
import { useData } from '../contexts/useData';
import { useViewNavigate } from '../lib/navigation';
import LoadingPage from './LoadingPage';

const filterChip = (active: boolean) =>
  `inline-flex min-h-10 items-center rounded-[var(--radius-full)] border px-3.5 py-1.5 text-sm transition-[background-color,border-color,color] duration-[var(--dur)] md:min-h-0 ${
    active
      ? 'border-transparent bg-brand text-brand-contrast'
      : 'border-line text-muted hover:border-line-strong hover:text-ink'
  }`;

const ArticleList: React.FC = () => {
  const { articles: posts, error } = useData();
  const navigate = useViewNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((post) => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach((tag) => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [posts]);

  const filteredPosts = useMemo(
    () =>
      posts.filter((post) => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = selectedTag ? post.tags && post.tags.includes(selectedTag) : true;
        return matchesSearch && matchesTag;
      }),
    [posts, searchQuery, selectedTag],
  );

  if (error) {
    return (
      <EmptyState
        title="Articles unavailable"
        body="Writing could not be loaded in this environment. The article index will fill in once the API is reachable."
      />
    );
  }

  return (
    <>
      <Reveal className="flex flex-col gap-4 border-b border-line pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="label">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'piece' : 'pieces'}
          </p>

          <button
            onClick={() => setIsSearchVisible((visible) => !visible)}
            aria-label="Toggle search"
            aria-expanded={isSearchVisible}
            className={filterChip(isSearchVisible)}
          >
            <span className="flex items-center gap-2">
              <SearchIcon className="h-3.5 w-3.5" />
              Search
            </span>
          </button>
        </div>

        {isSearchVisible ? (
          <input
            type="text"
            autoFocus
            placeholder="Search articles by title…"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full rounded-[var(--radius-md)] border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-subtle transition-colors duration-[var(--dur)] hover:border-line-strong focus:border-line-strong"
          />
        ) : null}

        {allTags.length ? (
          <div className="flex flex-wrap gap-2">
            <button className={filterChip(selectedTag === null)} onClick={() => setSelectedTag(null)}>
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                className={filterChip(selectedTag === tag)}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        ) : null}
      </Reveal>

      {filteredPosts.length ? (
        <ol>
          {filteredPosts.map((post, index) => (
            <Reveal as="li" key={post.id} delay={index * 60}>
              <button
                onClick={() => navigate(`/article/${post.id}`)}
                className="group grid w-full grid-cols-[2.5rem_1fr] gap-4 border-b border-line py-7 text-left transition-colors duration-[var(--dur)] hover:bg-[var(--hover-wash)] md:grid-cols-[3rem_1fr_9rem] md:gap-8"
              >
                <span className="label tabular-nums md:pt-1.5">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <span className="flex flex-col gap-3">
                  <span className="text-xl font-semibold tracking-[-0.02em] text-ink transition-colors duration-[var(--dur)] group-hover:text-brand md:text-2xl">
                    {post.title}
                  </span>

                  <span className="max-w-[64ch] text-sm leading-relaxed text-muted">
                    {post.content.substring(0, 180)}…
                  </span>

                  {post.tags && post.tags.length ? (
                    <span className="mt-1 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </span>
                  ) : null}
                </span>

                <span className="label col-start-2 md:col-start-3 md:pt-1.5 md:text-right">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </button>
            </Reveal>
          ))}
        </ol>
      ) : (
        <EmptyState
          title="Nothing matches"
          body="No posts match the current search or tag. Try clearing the filters."
        />
      )}
    </>
  );
};

const Article: React.FC = () => {
  const { loading } = useData();

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <PageShell>
      <PageHeader
        kicker="Writing"
        title={'Articles'}
        lead="Short notes on projects, interfaces, research details, and technical decisions."
      />

      <Container className="mt-14 pb-8">
        <ArticleList />
      </Container>
    </PageShell>
  );
};

export default Article;
