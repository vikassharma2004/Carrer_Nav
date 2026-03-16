import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Circle,
  MessageSquare,
  FileText,
  Calendar,
  UserPlus,
  ExternalLink,
  Search,
  Hash,
} from 'lucide-react'

/* ─── Mock data (replace with API: GET /api/v1/communities/me) ─ */
const MOCK_COMMUNITIES = [
  {
    id: '1',
    name: 'Fullstack Developer Squad',
    description: 'A community for developers learning the fullstack development path.',
    domain: 'fullstack',
    members: 1842,
    online: 34,
    type: 'public',
    joined: true,
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: '2',
    name: 'React & Frontend Dev',
    description: 'Discuss React patterns, hooks, performance, and modern CSS.',
    domain: 'frontend',
    members: 3210,
    online: 78,
    type: 'public',
    joined: true,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: '3',
    name: 'AI / ML Engineers',
    description: 'Building intelligent systems. Share models, papers & debugging help.',
    domain: 'ai-ml',
    members: 956,
    online: 12,
    type: 'private',
    joined: true,
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: '4',
    name: 'DevOps & Cloud',
    description: 'CI/CD pipelines, Kubernetes, Terraform, AWS/GCP deployments.',
    domain: 'devops',
    members: 2134,
    online: 41,
    type: 'public',
    joined: false,
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: '5',
    name: 'Backend Engineering',
    description: 'Node.js, databases, API design, microservices and system architecture.',
    domain: 'backend',
    members: 4102,
    online: 96,
    type: 'public',
    joined: false,
    color: 'from-green-500 to-teal-500',
  },
  {
    id: '6',
    name: 'Security & Pentesting',
    description: 'Ethical hacking, OWASP, CVE discussions and defensive engineering.',
    domain: 'security',
    members: 721,
    online: 9,
    type: 'private',
    joined: false,
    color: 'from-red-500 to-rose-600',
  },
]

const DOMAIN_COLORS = {
  frontend:  'bg-blue-100 text-blue-700',
  backend:   'bg-green-100 text-green-700',
  fullstack: 'bg-purple-100 text-purple-700',
  devops:    'bg-amber-100 text-amber-700',
  'ai-ml':   'bg-pink-100 text-pink-700',
  security:  'bg-red-100 text-red-700',
  data:      'bg-teal-100 text-teal-700',
}

const TABS = [
  { id: 'posts',       label: 'Posts',       icon: MessageSquare },
  { id: 'discussions', label: 'Discussions', icon: Hash },
  { id: 'resources',   label: 'Resources',   icon: FileText },
  { id: 'members',     label: 'Members',     icon: Users },
  { id: 'events',      label: 'Events',      icon: Calendar },
]

const MOCK_POSTS = [
  { id: 1, author: 'Arjun K.',   avatar: 'A', text: 'Anyone tried the new React 19 use() hook? Super powerful for async state!', likes: 24, comments: 8, time: '1h ago' },
  { id: 2, author: 'Priya M.',   avatar: 'P', text: 'Just finished the Next.js module — here are my notes on server components 🧵', likes: 41, comments: 13, time: '3h ago' },
  { id: 3, author: 'Rahul S.',   avatar: 'R', text: 'What\'s the difference between useCallback and useMemo in practice?', likes: 17, comments: 22, time: '5h ago' },
]

/* ─── Community Card ─────────────────────────────────────────── */
const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

function CommunityCard({ community, onOpen }) {
  const [joined, setJoined] = useState(community.joined)

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0,0,0,0.10)' }}
      className="dash-card overflow-hidden flex flex-col"
    >
      {/* Gradient header */}
      <div className={`h-20 bg-gradient-to-r ${community.color} relative flex items-end p-3`}>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_50%,white,transparent)]" />
        <span className="relative text-white font-bold text-[15px] line-clamp-1 drop-shadow">
          {community.name}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        {community.domain && (
          <span className={`dash-badge text-[10px] mb-2 self-start ${DOMAIN_COLORS[community.domain] ?? 'bg-gray-100 text-gray-600'}`}>
            {community.domain}
          </span>
        )}
        <p className="text-[12px] text-dash-muted line-clamp-2 leading-relaxed flex-1">
          {community.description}
        </p>

        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-dash-border">
          <span className="flex items-center gap-1.5 text-[12px] text-dash-muted">
            <Users size={12} />
            {community.members >= 1000
              ? `${(community.members / 1000).toFixed(1)}k`
              : community.members} members
          </span>
          <span className="flex items-center gap-1.5 text-[12px] text-green-600">
            <Circle size={8} className="fill-green-500" />
            {community.online} online
          </span>
          <span className={`dash-badge text-[10px] ml-auto ${community.type === 'private' ? 'dash-badge-gray' : 'dash-badge-green'}`}>
            {community.type}
          </span>
        </div>

        <div className="flex gap-2 mt-3">
          {!joined ? (
            <button
              onClick={() => setJoined(true)}
              className="flex-1 dash-btn-primary text-[12px] py-1.5 flex items-center justify-center gap-1.5"
            >
              <UserPlus size={13} /> Join
            </button>
          ) : (
            <button
              onClick={() => onOpen(community)}
              className="flex-1 dash-btn-primary text-[12px] py-1.5 flex items-center justify-center gap-1.5"
            >
              <ExternalLink size={13} /> Open
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Community modal / detail view ─────────────────────────── */
function CommunityDetail({ community, onClose }) {
  const [activeTab, setActiveTab] = useState('posts')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`h-24 bg-gradient-to-r ${community.color} relative flex items-end p-4`}>
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_50%,white,transparent)]" />
          <div className="relative flex-1">
            <h2 className="text-white font-bold text-[18px]">{community.name}</h2>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-white/80 text-[12px] flex items-center gap-1.5">
                <Users size={11} /> {community.members.toLocaleString()} members
              </span>
              <span className="text-green-300 text-[12px] flex items-center gap-1.5">
                <Circle size={8} className="fill-green-400" /> {community.online} online
              </span>
            </div>
          </div>
          <button onClick={onClose} className="relative text-white/70 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-dash-border px-4 overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-3 text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === id
                  ? 'border-dash-primary text-dash-primary'
                  : 'border-transparent text-dash-muted hover:text-dash-text'
              }`}
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'posts' && (
            <div className="space-y-3">
              {MOCK_POSTS.map((post) => (
                <div key={post.id} className="dash-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-dash-primary text-white flex items-center justify-center text-xs font-bold">
                      {post.avatar}
                    </div>
                    <span className="text-[13px] font-medium text-dash-text">{post.author}</span>
                    <span className="text-[11px] text-dash-muted ml-auto">{post.time}</span>
                  </div>
                  <p className="text-[13px] text-dash-muted leading-relaxed">{post.text}</p>
                  <div className="flex items-center gap-4 mt-3 text-[12px] text-dash-muted">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments} comments</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab !== 'posts' && (
            <div className="text-center py-16">
              <p className="text-dash-muted text-[14px]">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} coming soon.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function CommunityPage() {
  const [search, setSearch] = useState('')
  const [openCommunity, setOpenCommunity] = useState(null)
  const [tab, setTab] = useState('joined') // 'joined' | 'discover'

  const filtered = MOCK_COMMUNITIES.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchesTab = tab === 'joined' ? c.joined : !c.joined
    return matchesSearch && matchesTab
  })

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-bold text-dash-text">Community</h2>
          <p className="text-[13px] text-dash-muted mt-0.5">
            Connect with learners on the same journey
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dash-muted" size={13} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search communities…"
            className="dash-input pl-8 pr-4 py-2 text-[13px] w-56"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-dash-sidebar-h rounded-xl p-1 self-start w-fit mb-5">
        {[
          { id: 'joined',   label: `My Communities (${MOCK_COMMUNITIES.filter((c) => c.joined).length})` },
          { id: 'discover', label: 'Discover' },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
              tab === id
                ? 'bg-white text-dash-text shadow-sm'
                : 'text-dash-muted hover:text-dash-text'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="dash-card p-16 text-center">
          <Users className="mx-auto text-gray-300 mb-3" size={40} />
          <p className="text-dash-text font-medium">No communities found</p>
          <p className="text-[13px] text-dash-muted mt-1">
            {tab === 'joined'
              ? 'Join a roadmap to get access to its community.'
              : 'Try a different search term.'}
          </p>
        </div>
      ) : (
        <motion.div
          key={tab}
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.map((c) => (
            <CommunityCard key={c.id} community={c} onOpen={setOpenCommunity} />
          ))}
        </motion.div>
      )}

      {/* Detail modal */}
      {openCommunity && (
        <CommunityDetail
          community={openCommunity}
          onClose={() => setOpenCommunity(null)}
        />
      )}
    </div>
  )
}
