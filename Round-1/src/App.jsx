import { useState } from 'react'
import { Bell, Check, ChevronDown, Download, Home, Image as ImageIcon, Images, Layers3, Lightbulb, LoaderCircle, Menu, Moon, MoreHorizontal, PanelLeft, Plus, RefreshCw, Search, Settings, Share2, Sparkles, Star, WandSparkles, X } from 'lucide-react'
import './App.css'

const imageUrls = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=90',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=90',
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1200&q=90',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1200&q=90',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1200&q=90',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=90',
]

const navItems = [
  { label: 'Home', icon: Home }, { label: 'Generate', icon: WandSparkles },
  { label: 'Explore', icon: Images }, { label: 'Library', icon: PanelLeft }, { label: 'Settings', icon: Settings },
]

function Sidebar({ activeNav, setActiveNav, onMenu }) {
  return <aside className="sidebar glass-panel"><div className="brand-row"><div className="brand-mark"><Sparkles size={18} strokeWidth={2.6} /></div><span>Imagine<span>AI</span></span><button className="mobile-menu" onClick={onMenu} aria-label="Close menu"><X size={18} /></button></div><div className="nav-label">Workspace</div><nav className="side-nav">{navItems.map(({ label, icon: Icon }) => <button key={label} className={activeNav === label ? 'nav-item active' : 'nav-item'} onClick={() => setActiveNav(label)}><Icon size={18} /><span>{label}</span>{label === 'Generate' && <span className="nav-dot" />}</button>)}</nav><div className="sidebar-footer"><div className="upgrade-card"><div className="upgrade-icon"><Star size={15} fill="currentColor" /></div><div><strong>Unlock more magic</strong><span>Get unlimited generations</span></div><ChevronDown size={15} className="upgrade-arrow" /></div><button className="profile-row"><img src="https://i.pravatar.cc/80?img=47" alt="Maya Patel" /><span><strong>Maya Patel</strong><small>Pro Member</small></span><MoreHorizontal size={18} /></button></div></aside>
}

function TopNavbar({ onMenu }) {
  return <header className="topbar glass-panel"><button className="mobile-open" onClick={onMenu} aria-label="Open menu"><Menu size={20} /></button><div className="mode-tabs"><button className="mode-tab active"><ImageIcon size={16} /> Image</button><button className="mode-tab"><Layers3 size={16} /> Video <span className="soon">Soon</span></button><button className="mode-tab"><Lightbulb size={16} /> AI Tools</button></div><div className="top-actions"><button className="icon-button" aria-label="Search"><Search size={18} /></button><button className="icon-button notification" aria-label="Notifications"><Bell size={18} /><i /></button><img className="mini-avatar" src="https://i.pravatar.cc/80?img=47" alt="Maya Patel" /></div></header>
}

function SelectControl({ label, value, options }) {
  return <label className="select-control"><span>{label}</span><div className="select-input">{value}<ChevronDown size={15} /></div><select defaultValue={value} aria-label={label}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>
}

function PromptPanel({ prompt, setPrompt, onGenerate, isGenerating }) {
  const [style] = useState('Cinematic')
  const [ratio, setRatio] = useState('4:3')
  return <section className="prompt-panel glass-panel"><div className="panel-heading"><div><p className="eyebrow">CREATE SOMETHING NEW</p><h1>AI Image <em>Generation</em></h1><p className="subtitle">Turn your ideas into stunning visuals.</p></div><button className="theme-button" aria-label="Toggle theme"><Moon size={17} /></button></div><div className="prompt-box"><textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Describe the image you want to create..." maxLength={500} /><div className="prompt-tools"><button className="magic-button" aria-label="Enhance prompt"><Sparkles size={16} /></button><span>{prompt.length} / 500</span></div></div><button className="generate-button" onClick={onGenerate} disabled={isGenerating}>{isGenerating ? <><LoaderCircle size={18} className="spin" /> Creating magic...</> : <><WandSparkles size={18} /> Generate image</>} {!isGenerating && <span className="shortcut">⌘ ↵</span>}</button><div className="settings-heading"><span>Generation settings</span><button aria-label="Reset settings"><RefreshCw size={14} /></button></div><div className="settings-stack"><SelectControl label="Style" value={style} options={['Realistic', 'Cinematic', 'Anime', 'Digital Art', '3D']} /><SelectControl label="Model" value="Imagine v2" options={['Imagine v1', 'Imagine v2', 'Realistic Pro', 'Cinematic Pro']} /></div><div className="ratio-setting"><span>Aspect ratio</span><div className="ratio-pills">{['1:1', '16:9', '4:3', '9:16'].map((item) => <button key={item} className={ratio === item ? 'selected' : ''} onClick={() => setRatio(item)}>{item}</button>)}</div></div><div className="prompt-tip"><div><Sparkles size={15} /></div><p><strong>Pro tip</strong><br />Add details about lighting, mood, and composition for more expressive results.</p></div></section>
}

function ImageHistory({ history, selectedImage, onSelect }) {
  return <aside className="history-panel"><div className="section-heading"><div><p className="eyebrow">YOUR CREATIONS</p><h2>History</h2></div><button className="text-button">View all <ChevronDown size={14} /></button></div><div className="history-grid">{history.map((url, index) => <button className={selectedImage === url ? 'history-thumb selected' : 'history-thumb'} key={`${url}-${index}`} onClick={() => onSelect(url)}><img src={url} alt={`Generated creation ${index + 1}`} />{selectedImage === url && <span><Check size={13} /></span>}</button>)}</div><button className="new-project"><Plus size={16} /> New project</button></aside>
}

function PreviewCard({ selectedImage, liked, setLiked, onGenerate, isGenerating }) {
  const downloadImage = async () => {
    const response = await fetch(selectedImage)
    const blob = await response.blob()
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'imagineai-portrait.jpg'
    link.click()
    URL.revokeObjectURL(link.href)
  }
  return <div className="preview-column"><div className="preview-card glass-panel"><div className="preview-meta"><div><p className="eyebrow">LATEST CREATION</p><h2>Portrait study · 04</h2></div><span className="status-pill"><span /> Ready</span></div><div className="image-frame"><img src={selectedImage} alt="Generated portrait of a woman" /><div className="image-badge"><Sparkles size={13} /> Imagine v2</div><button className="image-expand" aria-label="Open image"><PanelLeft size={16} /></button></div><div className="image-footer"><div className="image-info"><span>4:3</span><span>2048 × 1536</span><span>18 sec</span></div><div className="image-actions"><button className="soft-action" onClick={downloadImage} aria-label="Download image"><Download size={16} /></button><button className={liked ? 'soft-action liked' : 'soft-action'} onClick={() => setLiked(!liked)} aria-label="Like image"><Star size={16} fill={liked ? 'currentColor' : 'none'} /></button><button className="soft-action" aria-label="Share image"><Share2 size={16} /></button><button className="regenerate-action" onClick={onGenerate} disabled={isGenerating}><RefreshCw size={15} /> Regenerate</button></div></div></div></div>
}

function SimilarImages({ selectedImage, onSelect }) {
  return <section className="similar-section"><div className="section-heading"><div><p className="eyebrow">KEEP EXPLORING</p><h2>Similar images</h2><p className="section-subtitle">Explore variations and related ideas</p></div><button className="round-arrow" aria-label="Next images"><ChevronDown size={17} /></button></div><div className="similar-grid">{imageUrls.slice(1).map((url, index) => <button className={selectedImage === url ? 'similar-card selected' : 'similar-card'} key={url} onClick={() => onSelect(url)}><img src={url} alt={`Related portrait ${index + 1}`} /><span className="similar-overlay"><Plus size={17} /></span></button>)}</div></section>
}

function App() {
  const [activeNav, setActiveNav] = useState('Generate')
  const [prompt, setPrompt] = useState('A cinematic portrait of a woman in a sunlit garden, soft shadows, editorial photography')
  const [selectedImage, setSelectedImage] = useState(imageUrls[0])
  const [history, setHistory] = useState(imageUrls.slice(0, 5))
  const [liked, setLiked] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const generate = () => {
    if (isGenerating) return
    setIsGenerating(true)
    window.setTimeout(() => {
      const nextImage = imageUrls[Math.floor(Math.random() * imageUrls.length)]
      setSelectedImage(nextImage)
      setHistory((current) => [nextImage, ...current.filter((item) => item !== nextImage)].slice(0, 5))
      setIsGenerating(false)
    }, 1100)
  }

  return (
    <div className="app-shell"><div className={menuOpen ? 'sidebar-wrap open' : 'sidebar-wrap'}><Sidebar activeNav={activeNav} setActiveNav={setActiveNav} onMenu={() => setMenuOpen(false)} /></div>{menuOpen && <button className="scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}<main className="main-content"><TopNavbar onMenu={() => setMenuOpen(true)} /><div className="workspace-grid"><PromptPanel prompt={prompt} setPrompt={setPrompt} onGenerate={generate} isGenerating={isGenerating} /><div className="results-area"><div className="results-grid"><PreviewCard selectedImage={selectedImage} liked={liked} setLiked={setLiked} onGenerate={generate} isGenerating={isGenerating} /><ImageHistory history={history} selectedImage={selectedImage} onSelect={setSelectedImage} /></div><SimilarImages selectedImage={selectedImage} onSelect={setSelectedImage} /></div></div></main></div>
  )
}

export default App
