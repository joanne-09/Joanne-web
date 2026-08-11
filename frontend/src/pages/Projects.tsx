import React from 'react';

import { PageHeader, PageShell } from '../components/PageShell';
import { Card, Container, EmptyState, Img, Reveal, Tag } from '../components/ui';
import { useData } from '../contexts/useData';
import LoadingPage from './LoadingPage';

const getImageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${cleanPath}`;
};

const tagList = (tech: unknown) => (Array.isArray(tech) ? tech.map(String) : []);

const Projects: React.FC = () => {
  const { projects, error, loading } = useData();

  if (loading) {
    return <LoadingPage />;
  }

  const [featuredProject, ...otherProjects] = projects;

  return (
    <PageShell>
      <PageHeader
        kicker="Selected work"
        title={'Projects'}
        lead="Practical builds across AI, web systems, games, and interface experiments."
      />

      <Container className="mt-14 pb-8">
        {error ? (
          <EmptyState
            title="Projects unavailable"
            body="The project archive could not be loaded in this environment. The page frame is ready, and live content will appear when the API is reachable."
          />
        ) : null}

        {!error && projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            body="Nothing has been published to the archive so far. Check back soon."
          />
        ) : null}

        {!error && featuredProject ? (
          <div className="flex flex-col gap-5">
            {/* Lead project gets the wide treatment; the rest read as a grid. */}
            <Reveal>
              <Card href={featuredProject.ghlink}>
                <div className="grid md:grid-cols-2">
                  <div className="clip-reveal aspect-[16/10] overflow-hidden border-b border-line bg-surface-soft md:aspect-auto md:border-b-0 md:border-r">
                    <Img
                      src={getImageUrl(featuredProject.imgsrc)}
                      alt={featuredProject.imgalt}
                      style={featuredProject.imgstyle}
                      priority
                      className="h-full w-full scale-100 object-cover group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="flex flex-col gap-4 p-7 md:p-10">
                    <p className="label">{featuredProject.type}</p>

                    <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-semibold text-ink">
                      {featuredProject.title}
                    </h2>

                    <p className="max-w-[52ch] text-base leading-relaxed text-muted">
                      {featuredProject.description}
                    </p>

                    {featuredProject.role ? (
                      <p className="text-sm text-subtle">Role — {featuredProject.role}</p>
                    ) : null}

                    {tagList(featuredProject.tech).length ? (
                      <div className="mt-1 flex flex-wrap gap-2">
                        {tagList(featuredProject.tech).map((tag) => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </Card>
            </Reveal>

            <div className="grid gap-5 md:grid-cols-2">
              {otherProjects.map((project, index) => (
                <Reveal key={project.id} delay={index * 70}>
                  <Card href={project.ghlink} className="h-full">
                    <div className="clip-reveal aspect-[16/10] w-full overflow-hidden border-b border-line bg-surface-soft">
                      <Img
                        src={getImageUrl(project.imgsrc)}
                        alt={project.imgalt}
                        style={project.imgstyle}
                        className="h-full w-full scale-100 object-cover group-hover:scale-[1.04]"
                      />
                    </div>

                    <div className="flex flex-col gap-3 p-6">
                      <div className="flex items-baseline justify-between gap-4">
                        <p className="label">{project.type}</p>
                        <span className="label tabular-nums">
                          {String(index + 2).padStart(2, '0')}
                        </span>
                      </div>

                      <h2 className="text-xl font-semibold text-ink">{project.title}</h2>

                      <p className="text-sm leading-relaxed text-muted">{project.description}</p>

                      {tagList(project.tech).length ? (
                        <div className="mt-1 flex flex-wrap gap-2">
                          {tagList(project.tech).slice(0, 4).map((tag) => (
                            <Tag key={tag}>{tag}</Tag>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </PageShell>
  );
};

export default Projects;
