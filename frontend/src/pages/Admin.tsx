import React, { useState, useEffect, useCallback } from 'react';
import { useData } from '../contexts/useData';

const panelClass = "rounded-lg border border-[var(--border)] bg-[var(--background-dark)] p-6 shadow-sm";
const inputClass = "w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-[var(--text)] outline-none";
const labelClass = "text-sm text-[var(--text)] opacity-90";
const listItemClass = "flex items-center gap-4 rounded-lg border border-[var(--border)] bg-[var(--background)] p-2.5";
const editButtonClass = "rounded bg-[var(--accent)] px-2.5 py-1 text-sm text-[var(--text-light)]";
const deleteButtonClass = "rounded bg-[var(--accent-dark)] px-2.5 py-1 text-sm text-[var(--text-light)]";
const primaryButtonClass = "rounded bg-[var(--primary)] px-3 py-2.5 font-bold text-[var(--text-light)] transition hover:bg-[var(--accent)]";
const submitButtonClass = "mt-2 rounded bg-[var(--primary)] px-3 py-3 text-base font-bold text-[var(--text-light)] transition hover:bg-[var(--accent)]";
const tabButtonClass = (active: boolean) =>
  `${active ? 'bg-[var(--primary)] text-[var(--text-light)]' : 'bg-transparent text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--text-light)]'} rounded border border-[var(--primary)] px-5 py-2.5 transition`;

const Admin = () => {
  const { refreshData, articles, projects } = useData();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'article' | 'project' | 'tags'>('article');

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

      await fetch(`${BACKEND_URL}/api/posts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title: articleTitle, 
          content: articleContent,
          tags: allTagsForArticle 
        }),
      });

      const url = editingArticleId ? `${BACKEND_URL}/api/posts/${editingArticleId}` : `${BACKEND_URL}/api/posts`;
      const method = editingArticleId ? 'PUT' : 'POST';

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
        alert(editingArticleId ? 'Article updated successfully' : 'Article posted successfully');
        setArticleTitle('');
        setArticleContent('');
        setSelectedTags([]);
        setNewTagsInput('');
        setEditingArticleId(null);
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

      await fetch(`${BACKEND_URL}/api/projects/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: projectId,
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

      const url = editingProjectId ? `${BACKEND_URL}/api/projects/${editingProjectId}` : `${BACKEND_URL}/api/projects`;
      const method = editingProjectId ? 'PUT' : 'POST';

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
        alert(editingProjectId ? 'Project updated successfully' : 'Project posted successfully');
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
    setActiveTab('article');
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
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 text-[var(--text)]">
        <form className={`${panelClass} flex w-full max-w-[300px] flex-col gap-5 backdrop-blur`} data-reveal="rise" onSubmit={handleLogin}>
          <h2 className="m-0 text-center text-2xl font-semibold text-[var(--text)]">Admin Login</h2>
          <input
            className={inputClass}
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className={primaryButtonClass} type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] px-5 py-[100px] text-[var(--text)]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[30px] lg:flex-row">
      <aside className={`${panelClass} h-max max-h-[80vh] flex-1 overflow-y-auto`} data-reveal="rise">
        <h2 className="mb-4 text-2xl font-semibold text-[var(--text)]">Manage Articles</h2>
        {articles.length === 0 ? <p>No articles found.</p> : (
          <ul className="space-y-3">
            {articles.map((a) => (
              <li key={a.id} className={listItemClass}>
                <span className="flex-1 text-[var(--text)]">{a.title}</span>
                <button onClick={() => handleEditArticle(a.id)} className={editButtonClass}>Edit</button>
                <button onClick={() => handleDeleteArticle(a.id)} className={deleteButtonClass}>Delete</button>
              </li>
            ))}
          </ul>
        )}

        <h2 className="mb-4 mt-[30px] text-2xl font-semibold text-[var(--text)]">Manage Projects</h2>
        {projects.length === 0 ? <p>No projects found.</p> : (
          <ul className="space-y-3">
            {projects.map((p) => (
              <li key={p.id} className={listItemClass}>
                <span className="flex-1 text-[var(--text)]">{p.title}</span>
                <button onClick={() => handleEditProject(p.id)} className={editButtonClass}>Edit</button>
                <button onClick={() => handleDeleteProject(p.id)} className={deleteButtonClass}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <main className={`${panelClass} flex-[2]`} data-reveal="rise" style={{ '--reveal-delay': '110ms' } as React.CSSProperties}>
        <h1 className="mb-[30px] text-center text-4xl font-semibold text-[var(--text)]">Admin Dashboard</h1>
        <div className="mb-[30px] flex flex-wrap justify-center gap-5">
          <button
            className={tabButtonClass(activeTab === 'article')}
            onClick={() => setActiveTab('article')}
          >
            New Article
          </button>
          <button
            className={tabButtonClass(activeTab === 'project')}
            onClick={() => setActiveTab('project')}
          >
            New Project
          </button>
          <button
            className={tabButtonClass(activeTab === 'tags')}
            onClick={() => setActiveTab('tags')}
          >
            Manage Tags
          </button>
        </div>

      {activeTab === 'tags' && (
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-[var(--primary)]">Existing Tags</h2>
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

      {activeTab === 'article' && (
        <form className="flex flex-col gap-5" onSubmit={submitArticle}>
          <h2 className="text-2xl font-semibold text-[var(--primary)]">Create Article</h2>
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

          <button className={submitButtonClass} type="submit">Upload Article</button>
        </form>
      )}

      {activeTab === 'project' && (
        <form className="flex flex-col gap-5" onSubmit={submitProject}>
          <h2 className="text-2xl font-semibold text-[var(--primary)]">Create Project</h2>
          <div className="grid gap-2">
            <label className={labelClass}>ID (e.g., project-1)</label>
            <input className={inputClass} type="text" required value={projectId} onChange={(e) => setProjectId(e.target.value)} />
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
          <button className={submitButtonClass} type="submit">Upload Project</button>
        </form>
      )}
      </main>
      </div>
    </div>
  );
};

export default Admin;
