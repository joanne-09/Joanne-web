import React, { useState, useEffect } from 'react';
import '../styles/Admin.css';
import { useData } from '../contexts/DataContext';

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
  const fetchTags = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/posts/tags`);
      if (res.ok) {
        const data = await res.json();
        setAvailableTags(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTags();
    }
  }, [isAuthenticated]);

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
      } catch (e) {
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
      <div className="admin-login-container">
        <form className="admin-login-form" onSubmit={handleLogin}>
          <h2>Admin Login</h2>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-wrapper">
      <div className="admin-sidebar">
        <h2>Manage Articles</h2>
        {articles.length === 0 ? <p>No articles found.</p> : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {articles.map((a) => (
              <li key={a.id} style={{ margin: '10px 0', display: 'flex', gap: '15px', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '16px', flex: 1 }}>{a.title}</span>
                <button onClick={() => handleEditArticle(a.id)} style={{ background: '#f39c12', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleDeleteArticle(a.id)} style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
              </li>
            ))}
          </ul>
        )}

        <h2 style={{ marginTop: '30px' }}>Manage Projects</h2>
        {projects.length === 0 ? <p>No projects found.</p> : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {projects.map((p) => (
              <li key={p.id} style={{ margin: '10px 0', display: 'flex', gap: '15px', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '16px', flex: 1 }}>{p.title}</span>
                <button onClick={() => handleEditProject(p.id)} style={{ background: '#f39c12', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleDeleteProject(p.id)} style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>
        <div className="admin-tabs">
          <button
            className={activeTab === 'article' ? 'active' : ''}
            onClick={() => setActiveTab('article')}
          >
            New Article
          </button>
          <button
            className={activeTab === 'project' ? 'active' : ''}
            onClick={() => setActiveTab('project')}
          >
            New Project
          </button>
          <button
            className={activeTab === 'tags' ? 'active' : ''}
            onClick={() => setActiveTab('tags')}
          >
            Manage Tags
          </button>
        </div>

      {activeTab === 'tags' && (
        <div className="admin-form">
          <h2>Existing Tags</h2>
          {availableTags.length === 0 ? (
            <p>No tags exist yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {availableTags.map(tag => (
                <li key={tag} style={{ margin: '10px 0', display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <span style={{ fontSize: '18px' }}>{tag}</span>
                  <button 
                    onClick={() => handleDeleteTag(tag)}
                    style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
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
        <form className="admin-form" onSubmit={submitArticle}>
          <h2>Create Article</h2>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              required
              value={articleTitle}
              onChange={(e) => setArticleTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Content (Markdown/Text)</label>
            <textarea
              required
              rows={15}
              value={articleContent}
              onChange={(e) => setArticleContent(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Select Existing Tags:</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
              {availableTags.map(tag => (
                <label key={tag} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedTags.includes(tag)}
                    onChange={() => toggleTag(tag)}
                  />
                  {tag}
                </label>
              ))}
            </div>
            
            <label>Or Create New Tags (comma-separated):</label>
            <input
              type="text"
              placeholder="e.g., React, Node, Web Development"
              value={newTagsInput}
              onChange={(e) => setNewTagsInput(e.target.value)}
            />
          </div>

          <button type="submit">Upload Article</button>
        </form>
      )}

      {activeTab === 'project' && (
        <form className="admin-form" onSubmit={submitProject}>
          <h2>Create Project</h2>
          <div className="form-group">
            <label>ID (e.g., project-1)</label>
            <input type="text" required value={projectId} onChange={(e) => setProjectId(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Title</label>
            <input type="text" required value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Type (e.g., Web App)</label>
            <input type="text" value={type} onChange={(e) => setType(e.target.value)} />
          </div>
          <div className="form-group">
            <label>GitHub Link</label>
            <input type="text" value={ghlink} onChange={(e) => setGhLink(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Image Source (Manual Link)</label>
            <input type="text" value={imgsrc} onChange={(e) => setImgsrc(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Or Upload Image</label>
            <input type="file" accept="image/*" onChange={(e) => setImgFile(e.target.files?.[0] || null)} />
            {imgFile && <small>Selected: {imgFile.name}</small>}
          </div>
          <div className="form-group">
            <label>Image Alt</label>
            <input type="text" value={imgalt} onChange={(e) => setImgalt(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Image Style (JSON mapping)</label>
            <input type="text" value={imgstyle} onChange={(e) => setImgstyle(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Role</label>
            <input type="text" value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows={5} required value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Tech Stack (JSON format, e.g. ["React", "Node"])</label>
            <input type="text" value={tech} onChange={(e) => setTech(e.target.value)} />
          </div>
          <button type="submit">Upload Project</button>
        </form>
      )}
      </div>
    </div>
  );
};

export default Admin;