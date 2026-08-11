import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Post } from '@joanne-web/shared';

import { PageShell } from './PageShell';
import { Container, EmptyState, Reveal, Tag } from './ui';
import Loading from './Loading';
import { localPreviewPosts, shouldUseLocalPreview } from '../data/localPreview';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || 'http://localhost:3001';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (shouldUseLocalPreview(BACKEND_URL)) {
        const previewPost = localPreviewPosts.find((item) => String(item.id) === id) || localPreviewPosts[0];

        setPost(previewPost || null);
        setLoading(false);
        return;
      }

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
    <PageShell>
      <Container className="pb-8">
        {error ? (
          <EmptyState
            title="Article unavailable"
            body="This article could not be loaded in the current environment."
          />
        ) : null}

        {loading ? <Loading /> : null}

        {!loading && !error && post ? (
          <article className="mx-auto max-w-[var(--measure)]">
            <header className="border-b border-line pb-9">
              <Reveal as="p" className="label">
                Article
              </Reveal>

              <Reveal
                as="h1"
                delay={80}
                className="mt-5 text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-ink"
              >
                {post.title}
              </Reveal>

              <Reveal delay={160} className="mt-7 flex flex-col gap-4">
                <span className="text-sm text-muted">
                  Posted on {new Date(post.created_at).toLocaleDateString()}
                </span>

                {post.tags && post.tags.length ? (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                ) : null}
              </Reveal>
            </header>

            <Reveal delay={220} className="prose mt-10 text-[1.0625rem] leading-[1.75]">
              <p
                className="whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
              />
            </Reveal>
          </article>
        ) : null}
      </Container>
    </PageShell>
  );
};

export default ArticleDetail;
