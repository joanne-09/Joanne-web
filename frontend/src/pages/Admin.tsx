import React, { useState, useEffect, useCallback } from 'react';
import { useData } from '../contexts/useData';

const panelClass = "rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]";
const inputClass = "w-full rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2.5 text-[var(--text)] outline-none transition-colors placeholder:text-[var(--text-muted)] hover:border-[var(--text-muted)] focus:border-[var(--text)]";
const labelClass = "text-sm font-semibold text-[var(--text)]";
const listItemClass = "flex items-center gap-3 border-b border-[var(--border)] py-4 last:border-b-0";
const editButtonClass = "rounded-[var(--radius-sm)] px-3 py-2 text-sm font-semibold text-[var(--text-muted)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--text)] active:translate-y-px";
const deleteButtonClass = "rounded-[var(--radius-sm)] px-3 py-2 text-sm font-semibold text-[var(--brand-strong)] transition hover:bg-[var(--brand-soft)] active:translate-y-px";
const primaryButtonClass = "rounded-[var(--radius-sm)] bg-[var(--text)] px-4 py-2.5 text-sm font-semibold text-[var(--fg-invert)] transition hover:opacity-85 active:translate-y-px";
const submitButtonClass = "rounded-[var(--radius-sm)] bg-[var(--text)] px-4 py-3 text-sm font-semibold text-[var(--fg-invert)] transition hover:opacity-85 active:translate-y-px";
const tabButtonClass = (active: boolean) =>
  `${active ? 'bg-[var(--text)] text-[var(--fg-invert)]' : 'text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]'} rounded-[var(--radius-sm)] px-4 py-2.5 text-sm font-semibold transition`;

const Admin = () => {
  const { refreshData, articles, projects } = useData();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'article' | 'project' | 'tags'>('article');
  const [editorMode, setEditorMode] = useState<'list' | 'create' | 'edit'>('list');

  // Article Edit State
  const [editingArticleId, setEditingArticleId] = useState<number | null>(null);

  // Project Edit State
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // Tags State
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagsInput, setNewTagsInput] = useState('');

  // Article State
  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState('');

  // Project State
  const [projectId, setProjectId] = useState('');
  const [ghlink, setGhLink] = useState('');
  const [imgsrc, setImgsrc] = useState('');
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgalt, setImgalt] = useState('');
  const [imgstyle, setImgstyle] = useState('{}');
  const [projectTitle, setProjectTitle] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [role, setRole] = useState('');
  const [tech, setTech] = useState('{}');

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || 'http://localhost:3001';

  const resetArticleForm = () => {
    setArticleTitle('');
    setArticleContent('');
    setSelectedTags([]);
    setNewTagsInput('');
    setEditingArticleId(null);
  };

  const resetProjectForm = () => {
    setProjectId('');
    setGhLink('');
    setImgsrc('');
    setImgFile(null);
    setImgalt('');
    setImgstyle('{}');
    setProjectTitle('');
    setType('');
    setDescription('');
    setRole('');
    setTech('{}');
    setEditingProjectId(null);
  };

  const handleNewArticle = () => {
    resetArticleForm();
    setActiveTab('article');
    setEditorMode('create');
  };

  const handleNewProject = () => {
    resetProjectForm();
    setActiveTab('project');
    setEditorMode('create');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        alert('Incorrect password');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to authentication server');
    }
  };

  // ===== Tag Management =====
  const fetchTags = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/posts/tags`);
      if (res.ok) {
        const data = await res.json();
        setAvailableTags(data);
      }
    } catch (e) {
      console.error(e);
    }
  }, [BACKEND_URL]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTags();
    }
  }, [isAuthenticated, fetchTags]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleDeleteTag = async (tag: string) => {
    if (!window.confirm(`Are you sure you want to delete the tag "${tag}"?`)) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/posts/tags/${encodeURIComponent(tag)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Tag deleted successfully!');
        fetchTags();
      } else {
        alert('Failed to delete tag.');
      }
    } catch (e) {
      console.error('Error deleting tag', e);
      alert('Error deleting tag');
    }
  };

  // ===== Article Management =====
  const submitArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedNewTags = newTagsInput.split(',').map(t => t.trim()).filter(Boolean);
      const allTagsForArticle = Array.from(new Set([...selectedTags, ...parsedNewTags]));

      const isEditing = editorMode === 'edit' && editingArticleId !== null;
      const url = isEditing ? `${BACKEND_URL}/api/posts/${editingArticleId}` : `${BACKEND_URL}/api/posts`;
      const method = isEditing ? 'PUT' : 'POST';

      const updateRes = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title: articleTitle, 
          content: articleContent,
          tags: allTagsForArticle 
        }),
      });

      if (updateRes.ok) {
        alert(isEditing ? 'Article updated successfully' : 'Article posted successfully');
        resetArticleForm();
        setEditorMode('list');
        await refreshData();
        fetchTags();
      } else {
        alert('Failed to post article');
      }
    } catch (err) {
      console.error(err);
      alert('Error posting article');
    }
  };

  // ===== Project Management =====
  const submitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let parsedImgStyle = {};
      let parsedTech = {};
      try {
        parsedImgStyle = imgstyle ? JSON.parse(imgstyle) : {};
        parsedTech = tech ? JSON.parse(tech) : {};
      } catch {
        alert('Invalid JSON in imgstyle or tech fields');
        return;
      }

      let finalImgSrc = imgsrc;

      if (imgFile) {
        const formData = new FormData();
        formData.append('image', imgFile);
        formData.append('title', projectTitle);

        const uploadRes = await fetch(`${BACKEND_URL}/api/projects/upload-image`, {
          method: 'POST',
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          finalImgSrc = uploadData.imageUrl;
        } else {
          alert('Failed to upload image. Please try again.');
          return;
        }
      }

      const isEditing = editorMode === 'edit' && editingProjectId !== null;
      const url = isEditing ? `${BACKEND_URL}/api/projects/${editingProjectId}` : `${BACKEND_URL}/api/projects`;
      const method = isEditing ? 'PUT' : 'POST';

      const updateRes = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: projectId, // id is used manually so we keep it same when PUTTING
          ghlink: ghlink || '',
          imgsrc: finalImgSrc,
          imgalt,
          imgstyle: parsedImgStyle,
          title: projectTitle,
          type,
          description,
          role,
          tech: parsedTech,
        }),
      });

      if (updateRes.ok) {
        alert(isEditing ? 'Project updated successfully' : 'Project posted successfully');
        resetProjectForm();
        setEditorMode('list');
        await refreshData();
      } else {
        alert('Failed to save project');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving project');
    }
  };

  const handleEditArticle = (id: number) => {
    const article = articles.find(a => a.id === id);
    if (!article) return;
    setEditingArticleId(article.id);
    setArticleTitle(article.title);
    setArticleContent(article.content);
    setSelectedTags(article.tags || []);
    setNewTagsInput('');
    setActiveTab('article');
    setEditorMode('edit');
  };

  const handleDeleteArticle = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Article deleted successfully');
        await refreshData();
      } else {
        alert('Failed to delete article');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting article');
    }
  };

  const handleEditProject = (id: string) => {
    const proj = projects.find(p => p.id === id);
    if (!proj) return;
    setEditingProjectId(proj.id);
    setProjectId(proj.id);
    setProjectTitle(proj.title);
    setGhLink(proj.ghlink || '');
    setImgsrc(proj.imgsrc || '');
    setImgFile(null);
    setImgalt(proj.imgalt || '');
    setImgstyle(proj.imgstyle ? JSON.stringify(proj.imgstyle) : '{}');
    setType(proj.type || '');
    setDescription(proj.description || '');
    setRole(proj.role || '');
    setTech(proj.tech ? JSON.stringify(proj.tech) : '{}');
    setActiveTab('project');
    setEditorMode('edit');
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Project deleted successfully');
        await refreshData();
      } else {
        alert('Failed to delete project');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting project');
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-[var(--bg)] px-5 py-12 text-[var(--text)]">
        <div className={`${panelClass} grid w-full max-w-[860px] overflow-hidden md:grid-cols-[1.05fr_0.95fr]`}>
          <section className="flex min-h-64 flex-col justify-between bg-[var(--text)] p-8 text-[var(--fg-invert)] sm:p-10">
            <div>
              <p className="text-sm font-semibold opacity-65">Joanne Chen</p>
              <h1 className="mt-5 max-w-[12ch] text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl">
                Keep the portfolio current.
              </h1>
            </div>
            <p className="mt-10 max-w-[34ch] text-sm leading-relaxed opacity-70">
              A private workspace for articles, projects, and tags.
            </p>
          </section>
          <form className="flex flex-col justify-center p-8 sm:p-10" onSubmit={handleLogin}>
            <h2 className="text-2xl font-semibold tracking-[-0.025em]">Admin sign in</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">Enter the admin password to continue.</p>
            <div className="mt-8 grid gap-2">
              <label className={labelClass} htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                className={inputClass}
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className={`${primaryButtonClass} mt-6 w-full`} type="submit">Sign in</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[var(--bg)] text-[var(--text)]">
      <header className="border-b border-[var(--border)]">
        <div className="mx-auto flex min-h-[72px] w-full max-w-[1400px] items-center justify-between gap-5 px-5 py-4 sm:px-8">
          <div>
            <p className="font-semibold tracking-[-0.02em]">Portfolio admin</p>
            <p className="mt-0.5 hidden text-xs text-[var(--text-muted)] sm:block">Create and maintain site content.</p>
          </div>
          <a href="#/" className="rounded-[var(--radius-sm)] px-3 py-2 text-sm font-semibold text-[var(--text-muted)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--text)]">
            View site
          </a>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1400px] gap-8 px-5 py-7 sm:px-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 lg:py-10">
      <aside className={`${panelClass} h-max p-3 lg:sticky lg:top-6`}>
        <p className="px-3 pb-2 pt-1 text-xs font-semibold text-[var(--text-muted)]">Content</p>
        <nav className="grid grid-cols-3 gap-1 lg:grid-cols-1" aria-label="Admin sections">
          <button
            className={tabButtonClass(activeTab === 'article')}
            onClick={() => {
              resetArticleForm();
              setActiveTab('article');
              setEditorMode('list');
            }}
          >
            <span>Articles</span>
            <span className="ml-2 text-xs opacity-60">{articles.length}</span>
          </button>
          <button
            className={tabButtonClass(activeTab === 'project')}
            onClick={() => {
              resetProjectForm();
              setActiveTab('project');
              setEditorMode('list');
            }}
          >
            <span>Projects</span>
            <span className="ml-2 text-xs opacity-60">{projects.length}</span>
          </button>
          <button
            className={tabButtonClass(activeTab === 'tags')}
            onClick={() => {
              setActiveTab('tags');
              setEditorMode('list');
            }}
          >
            <span>Tags</span>
            <span className="ml-2 text-xs opacity-60">{availableTags.length}</span>
          </button>
        </nav>
      </aside>

      <main className="min-w-0">
        <div className="flex flex-col gap-5 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {editorMode !== 'list' && activeTab !== 'tags' && (
              <button
                type="button"
                className="-ml-3 mb-3 rounded-[var(--radius-sm)] px-3 py-2 text-sm font-semibold text-[var(--text-muted)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
                onClick={() => {
                  activeTab === 'article' ? resetArticleForm() : resetProjectForm();
                  setEditorMode('list');
                }}
              >
                Back to {activeTab === 'article' ? 'articles' : 'projects'}
              </button>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[2rem] font-semibold leading-tight tracking-[-0.035em] sm:text-[2.35rem]">
                {activeTab === 'tags'
                  ? 'Tags'
                  : editorMode === 'edit'
                    ? `Edit ${activeTab}`
                    : editorMode === 'create'
                      ? `New ${activeTab}`
                      : activeTab === 'article' ? 'Articles' : 'Projects'}
              </h1>
              {editorMode === 'edit' && (
                <span className="rounded-full border border-[var(--brand)]/35 bg-[var(--brand-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--brand-strong)]">
                  Editing existing
                </span>
              )}
              {editorMode === 'create' && (
                <span className="rounded-full border border-[var(--border-strong)] bg-[var(--surface-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--text-muted)]">
                  New entry
                </span>
              )}
            </div>
            <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-[var(--text-muted)]">
              {activeTab === 'tags'
                ? 'Review and remove labels used across your writing.'
                : editorMode === 'edit'
                  ? 'Update this entry. Saving will not create a new one.'
                  : editorMode === 'create'
                    ? 'Create a separate entry from scratch.'
                    : 'Review published entries or open one to edit.'}
            </p>
          </div>
          {activeTab === 'article' && editorMode === 'list' && (
            <button className={primaryButtonClass} type="button" onClick={handleNewArticle}>New article</button>
          )}
          {activeTab === 'project' && editorMode === 'list' && (
            <button className={primaryButtonClass} type="button" onClick={handleNewProject}>New project</button>
          )}
        </div>

      {activeTab === 'article' && editorMode === 'list' && (
        <section className="mt-6" aria-label="Published articles">
          {articles.length === 0 ? (
            <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--border-strong)] px-6 py-12 text-center">
              <h2 className="text-lg font-semibold">No articles yet</h2>
              <p className="mt-2 text-sm text-[var(--text-muted)]">Publish the first article to start your writing archive.</p>
              <button className={`${primaryButtonClass} mt-5`} type="button" onClick={handleNewArticle}>New article</button>
            </div>
          ) : (
            <ul className="mt-1 border-y border-[var(--border)]">
              {articles.map((article) => (
                <li key={article.id} className={listItemClass}>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{article.title}</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">{article.tags?.length || 0} {article.tags?.length === 1 ? 'tag' : 'tags'}</p>
                  </div>
                  <button type="button" onClick={() => handleEditArticle(article.id)} className={editButtonClass}>Edit</button>
                  <button type="button" onClick={() => handleDeleteArticle(article.id)} className={deleteButtonClass}>Delete</button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {activeTab === 'project' && editorMode === 'list' && (
        <section className="mt-6" aria-label="Published projects">
          {projects.length === 0 ? (
            <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--border-strong)] px-6 py-12 text-center">
              <h2 className="text-lg font-semibold">No projects yet</h2>
              <p className="mt-2 text-sm text-[var(--text-muted)]">Add the first project to begin your portfolio collection.</p>
              <button className={`${primaryButtonClass} mt-5`} type="button" onClick={handleNewProject}>New project</button>
            </div>
          ) : (
            <ul className="mt-1 border-y border-[var(--border)]">
              {projects.map((project) => (
                <li key={project.id} className={listItemClass}>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{project.title}</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">{project.id} - {project.type || 'Uncategorized'}</p>
                  </div>
                  <button type="button" onClick={() => handleEditProject(project.id)} className={editButtonClass}>Edit</button>
                  <button type="button" onClick={() => handleDeleteProject(project.id)} className={deleteButtonClass}>Delete</button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {activeTab === 'tags' && (
        <div className="mt-6 flex flex-col gap-4">
          {availableTags.length === 0 ? (
            <p>No tags exist yet.</p>
          ) : (
            <ul className="space-y-3">
              {availableTags.map(tag => (
                <li key={tag} className={listItemClass}>
                  <span className="flex-1 text-lg text-[var(--text)]">{tag}</span>
                  <button 
                    onClick={() => handleDeleteTag(tag)}
                    className={deleteButtonClass}
                  >
                    Delete Tag
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {activeTab === 'article' && editorMode !== 'list' && (
        <form className="mt-7 flex flex-col gap-6" onSubmit={submitArticle}>
          <div className="grid gap-2">
            <label className={labelClass}>Title</label>
            <input
              className={inputClass}
              type="text"
              required
              value={articleTitle}
              onChange={(e) => setArticleTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label className={labelClass}>Content (Markdown/Text)</label>
            <textarea
              className={`${inputClass} resize-y`}
              required
              rows={15}
              value={articleContent}
              onChange={(e) => setArticleContent(e.target.value)}
            />
          </div>
          
          <div className="grid gap-3">
            <label className={labelClass}>Select Existing Tags</label>
            <div className="mb-2 flex flex-wrap gap-3">
              {availableTags.map(tag => (
                <label key={tag} className="flex cursor-pointer items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-semibold text-[var(--secondary)]">
                  <input 
                    type="checkbox" 
                    checked={selectedTags.includes(tag)}
                    onChange={() => toggleTag(tag)}
                  />
                  {tag}
                </label>
              ))}
            </div>
            
            <label className={labelClass}>Or Create New Tags (comma-separated)</label>
            <input
              className={inputClass}
              type="text"
              placeholder="e.g., React, Node, Web Development"
              value={newTagsInput}
              onChange={(e) => setNewTagsInput(e.target.value)}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[var(--text-muted)]">
              {editorMode === 'edit' ? 'This updates the existing article only.' : 'This creates a new published article.'}
            </p>
            <div className="flex gap-3">
              <button
                className="rounded-[var(--radius-sm)] border border-[var(--border-strong)] px-4 py-3 text-sm font-semibold transition hover:bg-[var(--surface-soft)]"
                type="button"
                onClick={() => {
                  resetArticleForm();
                  setEditorMode('list');
                }}
              >
                Cancel
              </button>
              <button className={submitButtonClass} type="submit">
                {editorMode === 'edit' ? 'Save changes' : 'Publish article'}
              </button>
            </div>
          </div>
        </form>
      )}

      {activeTab === 'project' && editorMode !== 'list' && (
        <form className="mt-7 flex flex-col gap-6" onSubmit={submitProject}>
          <div className="grid gap-2">
            <label className={labelClass}>ID (e.g., project-1)</label>
            <input className={inputClass} type="text" required disabled={editorMode === 'edit'} value={projectId} onChange={(e) => setProjectId(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <label className={labelClass}>Title</label>
            <input className={inputClass} type="text" required value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <label className={labelClass}>Type (e.g., Web App)</label>
            <input className={inputClass} type="text" value={type} onChange={(e) => setType(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <label className={labelClass}>GitHub Link</label>
            <input className={inputClass} type="text" value={ghlink} onChange={(e) => setGhLink(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <label className={labelClass}>Image Source (Manual Link)</label>
            <input className={inputClass} type="text" value={imgsrc} onChange={(e) => setImgsrc(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <label className={labelClass}>Or Upload Image</label>
            <input className={inputClass} type="file" accept="image/*" onChange={(e) => setImgFile(e.target.files?.[0] || null)} />
            {imgFile && <small className="text-[var(--text-muted)]">Selected: {imgFile.name}</small>}
          </div>
          <div className="grid gap-2">
            <label className={labelClass}>Image Alt</label>
            <input className={inputClass} type="text" value={imgalt} onChange={(e) => setImgalt(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <label className={labelClass}>Image Style (JSON mapping)</label>
            <input className={inputClass} type="text" value={imgstyle} onChange={(e) => setImgstyle(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <label className={labelClass}>Role</label>
            <input className={inputClass} type="text" value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <label className={labelClass}>Description</label>
            <textarea className={`${inputClass} resize-y`} rows={5} required value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <label className={labelClass}>Tech Stack (JSON format, e.g. ["React", "Node"])</label>
            <input className={inputClass} type="text" value={tech} onChange={(e) => setTech(e.target.value)} />
          </div>
          <div className="flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[var(--text-muted)]">
              {editorMode === 'edit' ? 'This updates the existing project only.' : 'This creates a new portfolio project.'}
            </p>
            <div className="flex gap-3">
              <button
                className="rounded-[var(--radius-sm)] border border-[var(--border-strong)] px-4 py-3 text-sm font-semibold transition hover:bg-[var(--surface-soft)]"
                type="button"
                onClick={() => {
                  resetProjectForm();
                  setEditorMode('list');
                }}
              >
                Cancel
              </button>
              <button className={submitButtonClass} type="submit">
                {editorMode === 'edit' ? 'Save changes' : 'Publish project'}
              </button>
            </div>
          </div>
        </form>
      )}
      </main>
      </div>
    </div>
  );
};

export default Admin;
