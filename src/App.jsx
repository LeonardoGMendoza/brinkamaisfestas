import { useState, useEffect, useRef, useCallback } from 'react';
import './index.css';

/* ============================================================
   CONSTANTS
   ============================================================ */
const TOYS = [
  { id:'pula-pula',     emoji:'🏰', nome:'Pula-Pula Castelo',    cat:'inflaveis', desc:'Castelo inflável colorido para até 8 crianças. Ideal para 3–10 anos.', tags:['Inflável','Até 8 crianças'], popular:true },
  { id:'escorregador',  emoji:'🛝', nome:'Escorregador Inflável', cat:'inflaveis', desc:'Escorregador gigante com piscina de bolinhas na base. Muita emoção!', tags:['Inflável','Piscina Bolinhas'] },
  { id:'toto',          emoji:'⚽', nome:'Totó / Pebolim',        cat:'jogos',     desc:'Mesa de totó profissional. O queridinho de todas as festas!', tags:['Jogos','Todas as idades'], popular:true },
  { id:'piscina',       emoji:'🔵', nome:'Piscina de Bolinhas',   cat:'jogos',     desc:'Piscina com centenas de bolinhas coloridas. A criançada vai adorar!', tags:['Jogos','Até 5 anos'] },
  { id:'futebol',       emoji:'🥅', nome:'Gol de Futebol',        cat:'esportes',  desc:'Dois gols infantis com rede. Mini campeonato na festa!', tags:['Esportes','Times'] },
  { id:'cama-elastica', emoji:'🤸', nome:'Cama Elástica',         cat:'esportes',  desc:'Cama elástica com proteção lateral. Horas de pulos e risadas!', tags:['Esportes','Com proteção'] },
];
const CATS = [
  { id:'all', label:'Todos' }, { id:'inflaveis', label:'Infláveis' },
  { id:'jogos', label:'Jogos' }, { id:'esportes', label:'Esportes' },
];
const BALLOON_EMOJIS = ['🎈','🎀','🎉','🎊','🎁','⭐','🌟','🪅','🎶','🪷'];
const USERS = {
  admin:     { senha:'festa123',   role:'admin',     nome:'Administrador',   avatar:'AD' },
  atendente: { senha:'brinka2026', role:'atendente', nome:'Atendente',       avatar:'AT' },
};

/* ============================================================
   BALLOONS
   ============================================================ */
function makeBalloon(i) {
  return {
    id: `${i}-${Math.random()}`,
    x: Math.random() * 95,
    size: 1.6 + Math.random() * 1.8,
    speed: 12 + Math.random() * 16,
    sway: 2 + Math.random() * 4,
    delay: -(Math.random() * 22),
    emoji: BALLOON_EMOJIS[Math.floor(Math.random() * BALLOON_EMOJIS.length)],
  };
}
function Balloons({ count = 14 }) {
  const [items] = useState(() => Array.from({ length: count }, (_, i) => makeBalloon(i)));
  return (
    <div className="balloons-wrap" aria-hidden="true">
      {items.map(b => (
        <div key={b.id} className="balloon" style={{
          left: `${b.x}%`, fontSize: `${b.size}rem`,
          animationDuration: `${b.speed}s, ${b.sway}s`,
          animationDelay: `${b.delay}s, ${b.delay * 0.4}s`,
        }}>{b.emoji}</div>
      ))}
    </div>
  );
}

/* ============================================================
   TOAST
   ============================================================ */
function Toast({ msg, show }) {
  return <div className={`toast${show ? ' show' : ''}`} role="status">{msg}</div>;
}
function useToast() {
  const [state, setState] = useState({ msg: '', show: false });
  const timerRef = useRef(null);
  const fire = useCallback((msg = '✅ Feito!') => {
    clearTimeout(timerRef.current);
    setState({ msg, show: true });
    timerRef.current = setTimeout(() => setState(s => ({ ...s, show: false })), 4000);
  }, []);
  return { toastMsg: state.msg, toastShow: state.show, fireToast: fire };
}

/* ============================================================
   WA FLOAT BUTTON
   ============================================================ */
function WAFloat() {
  return (
    <a className="wa-float" href="https://wa.me/5500000000000?text=Olá!%20Vim%20pelo%20site%20Brinka%20Mais%20Festas!" target="_blank" rel="noreferrer" aria-label="WhatsApp">📱</a>
  );
}

/* ============================================================
   PUBLIC SITE
   ============================================================ */
function PublicSite({ onGoLogin, onGoRegister }) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [activeSection, setActiveSection] = useState('inicio');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close drawer on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setDrawerOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const scrollTo = (id) => {
    setDrawerOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const visibleToys = TOYS.filter(t => filter === 'all' || t.cat === filter);

  const NAV = [
    { label: 'Início', id: 'inicio' },
    { label: 'Brinquedos', id: 'brinquedos' },
    { label: 'Serviços', id: 'servicos' },
    { label: 'Como Funciona', id: 'como-funciona' },
    { label: 'Contato', id: 'contato' },
  ];

  return (
    <>
      {/* ---- HEADER ---- */}
      <header className={`pub-header${scrolled ? ' scrolled' : ''}`} id="pub-header">
        <div className="pub-header-inner">
          <button className="pub-logo" onClick={() => scrollTo('inicio')} style={{ background:'none', border:'none', cursor:'pointer' }}>
            <div className="pub-logo-icon">🎉</div>
            <span className="pub-logo-name">Brinka<span>Mais</span>Festas</span>
          </button>

          <nav className="pub-nav" aria-label="Menu principal">
            {NAV.map(n => (
              <button key={n.id} className={`pub-nav-link${activeSection===n.id?' active':''}`} onClick={() => scrollTo(n.id)} id={`pub-nav-${n.id}`}>{n.label}</button>
            ))}
          </nav>

          <div className="pub-header-actions">
            <button className="btn btn-ghost btn-sm" onClick={onGoLogin} id="pub-btn-entrar">Entrar</button>
            <button className="btn btn-primary btn-sm" onClick={onGoRegister} id="pub-btn-cadastro">Solicitar Agora</button>
            <button className="hamburger" onClick={() => setDrawerOpen(v => !v)} id="pub-hamburger" aria-label="Menu">
              <span/><span/><span/>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer${drawerOpen?' open':''}`} role="dialog" aria-modal="true">
        <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} />
        <div className="drawer-panel">
          <div className="drawer-logo">
            <div className="pub-logo-icon" style={{width:34,height:34,fontSize:'1rem'}}>🎉</div>
            <span className="pub-logo-name" style={{fontSize:'1rem'}}>Brinka<span>Mais</span>Festas</span>
          </div>
          {NAV.map(n => (
            <button key={n.id} className="drawer-nav-link" onClick={() => scrollTo(n.id)}>
              {n.label}
            </button>
          ))}
          <div className="drawer-divider" />
          <button className="drawer-nav-link" onClick={() => { setDrawerOpen(false); onGoLogin(); }}>🔑 Entrar</button>
          <button className="btn btn-primary btn-full" onClick={() => { setDrawerOpen(false); onGoRegister(); }} style={{ marginTop: 4 }} id="drawer-btn-solicitar">Solicitar Agora 🎉</button>
        </div>
      </div>

      {/* ---- HERO ---- */}
      <section id="inicio" className="hero">
        <Balloons count={10} />
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge anim-down">🎊 Diversão garantida!</div>
            <h1 className="hero-title anim-up">
              A festa dos seus filhos merece ser{' '}
              <span className="grad-text">inesquecível</span>
            </h1>
            <p className="hero-subtitle">Aluguel de brinquedos, pula-pula, escorregadores, totós e muito mais para deixar sua festa incrível!</p>
            <div className="hero-btns">
              <button className="btn btn-primary btn-lg" onClick={() => scrollTo('brinquedos')} id="hero-btn-catalogo">Ver Brinquedos 🧸</button>
              <button className="btn btn-outline btn-lg" onClick={onGoRegister} id="hero-btn-solicitar">Pedir Orçamento</button>
            </div>
            <div className="hero-stats">
              {[['500+','Festas realizadas'],['30+','Brinquedos'],['5★','Avaliação']].map(([v,l]) => (
                <div className="stat" key={l}><span className="stat-num">{v}</span><span className="stat-label">{l}</span></div>
              ))}
            </div>
          </div>
        </div>
        <div className="wave">
          <svg viewBox="0 0 1440 70" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,35 C360,70 1080,0 1440,35 L1440,70 L0,70 Z" fill="var(--bg)"/>
          </svg>
        </div>
      </section>

      {/* ---- BRINQUEDOS ---- */}
      <section id="brinquedos" className="pub-section">
        <div className="pub-container">
          <div className="pub-section-head">
            <span className="section-eyebrow">🧸 Nosso Acervo</span>
            <h2 className="section-title">Brinquedos para todos os gostos</h2>
            <p className="section-sub">Grande variedade para garantir a diversão das crianças na sua festa</p>
          </div>
          <div className="pub-filter-tabs">
            {CATS.map(c => (
              <button key={c.id} id={`pub-filter-${c.id}`} className={`pub-filter-btn${filter===c.id?' active':''}`} onClick={() => setFilter(c.id)}>{c.label}</button>
            ))}
          </div>
          <div className="pub-toys-grid">
            {visibleToys.map(toy => (
              <div key={toy.id} id={`pub-toy-${toy.id}`} className="pub-toy-card glass">
                <div className="toy-card-head">
                  <span className="toy-emoji">{toy.emoji}</span>
                  {toy.popular && <span className="toy-popular-badge">⭐ Mais Alugado</span>}
                </div>
                <h3>{toy.nome}</h3>
                <p>{toy.desc}</p>
                <div className="toy-tags">{toy.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
                <button className="btn btn-primary btn-sm" onClick={onGoRegister} id={`pub-btn-solicitar-${toy.id}`}>Solicitar →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- SERVIÇOS ---- */}
      <section id="servicos" className="pub-section pub-section-alt">
        <div className="pub-container">
          <div className="pub-section-head">
            <span className="section-eyebrow">🎯 O que oferecemos</span>
            <h2 className="section-title">Nossos Serviços</h2>
            <p className="section-sub">Do planejamento à entrega, cuidamos de tudo para você!</p>
          </div>
          <div className="pub-services-grid">
            {[
              ['🚚','Entrega e Montagem','Levamos até o local, montamos tudo e buscamos após o evento. Sem preocupações!'],
              ['📦','Pacotes Completos','Escolha os brinquedos e monte seu combo. Quanto mais itens, maior o desconto!'],
              ['🎪','Eventos e Festas','Atendemos aniversários, festas juninas, eventos escolares e condomínios.'],
              ['🤝','Suporte no Dia','Ficamos disponíveis durante o evento para garantir a diversão das crianças!'],
            ].map(([icon, titulo, desc]) => (
              <div key={titulo} className="pub-service-card glass">
                <span className="service-icon">{icon}</span>
                <h3>{titulo}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- COMO FUNCIONA ---- */}
      <section id="como-funciona" className="pub-section">
        <div className="pub-container">
          <div className="pub-section-head">
            <span className="section-eyebrow">📋 Simples assim!</span>
            <h2 className="section-title">Como funciona</h2>
            <p className="section-sub">Em apenas 3 passos a festa dos seus sonhos fica pronta</p>
          </div>
          <div className="pub-steps-grid" style={{ marginBottom: 'clamp(40px,5vw,64px)' }}>
            {[
              ['📱','Entre em contato','Fale via WhatsApp, informe a data, local e número de crianças.'],
              ['🛒','Escolha os brinquedos','Selecione os itens do catálogo que combinam com sua festa.'],
              ['🎉','Curta a festa!','Entregamos, montamos e cuidamos de tudo. É só aproveitar!'],
            ].map(([icon, titulo, desc], i) => (
              <div key={titulo} className="pub-step-card glass">
                <div className="step-num-badge">{i+1}</div>
                <span className="step-icon">{icon}</span>
                <h3>{titulo}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>

          {/* Depoimentos */}
          <div className="pub-section-head" style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 'clamp(1.2rem,3vw,1.6rem)', fontWeight: 900 }}>💬 O que dizem nossos clientes</h3>
          </div>
          <div className="pub-testimonials-grid">
            {[
              ['👩','Maria Silva','Aniversário do Lucas, 6 anos','"A festa do meu filho foi incrível! O pula-pula chegou no horário, os meninos ficaram animados a festa toda!"'],
              ['👨','Carlos Oliveira','Festa Junina do Condomínio','"Ótimo atendimento, preço justo e brinquedos de qualidade. Com certeza vou contratar novamente!"'],
              ['👩','Ana Beatriz','Aniversário da Sofia, 8 anos','"O totó e o escorregador foram os queridinhos! As crianças não queriam ir embora!"'],
            ].map(([ava, autor, evento, texto]) => (
              <div key={autor} className="pub-test-card glass">
                <div className="stars">⭐⭐⭐⭐⭐</div>
                <p>{texto}</p>
                <div className="test-author">
                  <span className="test-ava">{ava}</span>
                  <div><strong>{autor}</strong><span>{evento}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA SOLICITAR / CONTATO ---- */}
      <section id="contato" className="pub-section pub-section-alt">
        <div className="pub-container">
          <div className="pub-contact-wrap">
            <h2>Vamos fazer sua festa acontecer! 🎉</h2>
            <p>Cadastre-se e solicite seu orçamento agora mesmo. Respondemos rapidinho!</p>
            <div className="pub-contact-btns">
              <button className="btn btn-outline btn-lg" onClick={onGoRegister} id="cta-btn-cadastro">📝 Cadastrar e Solicitar</button>
              <a className="btn btn-green btn-lg" href="https://wa.me/5500000000000?text=Olá!%20Gostaria%20de%20um%20orçamento!" target="_blank" rel="noreferrer" id="cta-btn-wa">📱 WhatsApp Direto</a>
            </div>
          </div>
        </div>
      </section>

      {/* ---- FOOTER ---- */}
      <footer className="pub-footer">
        <div className="pub-footer-inner">
          <div className="pub-footer-brand pub-footer-col">
            <div className="pub-logo">
              <div className="pub-logo-icon">🎉</div>
              <span className="pub-logo-name">Brinka<span>Mais</span>Festas</span>
            </div>
            <p>Tornando cada festa uma experiência inesquecível com brinquedos de qualidade.</p>
          </div>
          <div className="pub-footer-col">
            <h4>Links</h4>
            <ul>
              {NAV.map(n => <li key={n.id}><a href={`#${n.id}`} onClick={e=>{e.preventDefault();scrollTo(n.id)}}>{n.label}</a></li>)}
            </ul>
          </div>
          <div className="pub-footer-col">
            <h4>Contato</h4>
            <ul>
              <li><a href="https://wa.me/5500000000000" target="_blank" rel="noreferrer">📱 WhatsApp</a></li>
              <li><a href="#">📸 Instagram</a></li>
              <li><a href="#">👍 Facebook</a></li>
            </ul>
          </div>
        </div>
        <p className="pub-footer-bottom">© 2026 Brinka Mais Festas — Feito com 🎉 para alegrar sua festa!</p>
      </footer>

      <WAFloat />
    </>
  );
}

/* ============================================================
   AUTH SCREENS
   ============================================================ */
function LoginPage({ onLogin, onGoRegister, onGoPublic }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    setTimeout(() => {
      const u = USERS[usuario.trim().toLowerCase()];
      if (u && u.senha === senha) {
        onLogin({ nome: u.nome, role: u.role, avatar: u.avatar, usuario: usuario.trim() });
      } else {
        setErro('Usuário ou senha incorretos.');
        setLoading(false);
      }
    }, 700);
  };

  return (
    <div className="auth-page">
      <Balloons count={12} />
      <div className="auth-card glass anim-scale">
        <div className="auth-logo-wrap">🎉</div>
        <h2>Brinka<span>Mais</span>Festas</h2>
        <p>Acesse sua conta</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="login-usuario">Usuário</label>
            <input id="login-usuario" type="text" placeholder="Digite seu usuário" value={usuario} onChange={e=>{setUsuario(e.target.value);setErro('');}} autoComplete="username" required />
          </div>
          <div className="input-group">
            <label htmlFor="login-senha">Senha</label>
            <div className="pwd-wrap">
              <input id="login-senha" type={showPwd?'text':'password'} placeholder="Digite sua senha" value={senha} onChange={e=>{setSenha(e.target.value);setErro('');}} autoComplete="current-password" required />
              <button type="button" className="pwd-toggle" onClick={()=>setShowPwd(v=>!v)} aria-label={showPwd?'Ocultar':'Mostrar'}>{showPwd?'🙈':'👁️'}</button>
            </div>
          </div>
          {erro && <div className="error-msg">⚠️ {erro}</div>}
          <button type="submit" className="auth-btn-login" id="btn-login-submit" disabled={loading}>
            {loading ? '⏳ Entrando...' : '🎊 Entrar'}
          </button>
        </form>
        <div className="auth-footer-link">
          Não tem conta?{' '}
          <button onClick={onGoRegister} id="btn-ir-cadastro">Cadastre-se aqui</button>
        </div>
        <button className="auth-back-btn" onClick={onGoPublic} id="btn-voltar-site">← Voltar ao site</button>
        <p className="auth-hint">Admin: <span>admin</span> / <span>festa123</span></p>
      </div>
    </div>
  );
}

function RegisterPage({ onRegister, onGoLogin, onGoPublic, fireToast }) {
  const [form, setForm] = useState({ nome:'', email:'', telefone:'', senha:'', confirmar:'' });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handlePhone = e => {
    let v = e.target.value.replace(/\D/g,'').slice(0,11);
    if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length > 0) v = `(${v}`;
    setForm(p => ({ ...p, telefone: v }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setErro('');
    if (form.senha !== form.confirmar) { setErro('As senhas não coincidem.'); return; }
    if (form.senha.length < 6) { setErro('Senha deve ter no mínimo 6 caracteres.'); return; }
    setLoading(true);
    setTimeout(() => {
      onRegister({ nome: form.nome, email: form.email, telefone: form.telefone, role: 'cliente', avatar: form.nome[0].toUpperCase() });
      fireToast('🎉 Cadastro realizado! Bem-vindo(a)!');
    }, 800);
  };

  return (
    <div className="auth-page">
      <Balloons count={10} />
      <div className="auth-card glass anim-scale" style={{ maxWidth: 460 }}>
        <div className="auth-logo-wrap">🎁</div>
        <h2>Criar <span>Conta</span></h2>
        <p>Cadastre-se e solicite seu orçamento!</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="reg-nome">Nome completo *</label>
            <input id="reg-nome" name="nome" type="text" placeholder="Seu nome" value={form.nome} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label htmlFor="reg-email">E-mail *</label>
            <input id="reg-email" name="email" type="email" placeholder="seu@email.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label htmlFor="reg-tel">WhatsApp *</label>
            <input id="reg-tel" name="telefone" type="tel" placeholder="(00) 00000-0000" value={form.telefone} onChange={handlePhone} required />
          </div>
          <div className="input-group">
            <label htmlFor="reg-senha">Senha *</label>
            <div className="pwd-wrap">
              <input id="reg-senha" name="senha" type={showPwd?'text':'password'} placeholder="Mínimo 6 caracteres" value={form.senha} onChange={handleChange} required />
              <button type="button" className="pwd-toggle" onClick={()=>setShowPwd(v=>!v)}>{showPwd?'🙈':'👁️'}</button>
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="reg-confirmar">Confirmar senha *</label>
            <input id="reg-confirmar" name="confirmar" type={showPwd?'text':'password'} placeholder="Repita a senha" value={form.confirmar} onChange={handleChange} required />
          </div>
          {erro && <div className="error-msg">⚠️ {erro}</div>}
          <button type="submit" className="auth-btn-login" id="btn-register-submit" disabled={loading}>
            {loading ? '⏳ Criando conta...' : '🎉 Criar Conta Grátis'}
          </button>
        </form>
        <div className="auth-footer-link">
          Já tem conta?{' '}
          <button onClick={onGoLogin} id="btn-ir-login">Entrar aqui</button>
        </div>
        <button className="auth-back-btn" onClick={onGoPublic} id="btn-voltar-site-reg">← Voltar ao site</button>
      </div>
    </div>
  );
}

/* ============================================================
   APP SHELL (sidebar + topbar)
   ============================================================ */
function AppShell({ user, onLogout, navItems, activeTab, setActiveTab, children, topbarRight }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [activeTab]);

  const PAGE_INFO = Object.fromEntries(navItems.map(n => [n.id, { title: `${n.icon} ${n.label}`, sub: n.sub || '' }]));
  const cur = PAGE_INFO[activeTab] || { title: '🏠 Painel', sub: '' };

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className={`app-sidebar${sidebarOpen?' open':''}`} id="app-sidebar">
        <div className="sidebar-logo-area">
          <div className="sidebar-logo-icon">🎉</div>
          <div>
            <div className="sidebar-logo-name">Brinka<span>Mais</span>Festas</div>
            <div className="sidebar-role-label">{user.role === 'admin' ? 'Admin' : user.role === 'atendente' ? 'Atendente' : 'Minha Área'}</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              id={`sidebar-${item.id}`}
              className={`sidebar-btn${activeTab===item.id?' active':''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="sb-icon">{item.icon}</span>
              {item.label}
              {item.badge && <span className="sb-badge badge">{item.badge}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-user-area">
          <div className="sidebar-user-card">
            <div className="sidebar-avatar">{user.avatar}</div>
            <div className="sidebar-user-info">
              <strong>{user.nome}</strong>
              <span>{user.role}</span>
            </div>
            <button className="sidebar-logout-btn" onClick={onLogout} title="Sair" id="btn-sidebar-logout">🚪</button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="app-main">
        <header className="app-topbar">
          <div className="topbar-left">
            <button className="topbar-menu-btn" onClick={() => setSidebarOpen(v => !v)} id="btn-topbar-menu" aria-label="Menu">☰</button>
            <div className="topbar-page-info">
              <h1>{cur.title}</h1>
              {cur.sub && <p>{cur.sub}</p>}
            </div>
          </div>
          <div className="topbar-right">
            {topbarRight}
            <a className="topbar-wa" href="https://wa.me/5500000000000" target="_blank" rel="noreferrer" id="topbar-wa">📱 WhatsApp</a>
          </div>
        </header>
        <main className="app-content">{children}</main>
      </div>

      <WAFloat />
    </div>
  );
}

/* ============================================================
   ADMIN DASHBOARD
   ============================================================ */
const ADMIN_NAV = [
  { id:'dashboard', icon:'🏠', label:'Dashboard',   sub:'Visão geral do negócio' },
  { id:'pedidos',   icon:'📋', label:'Pedidos',      sub:'Solicitações recebidas', badge:'3' },
  { id:'brinquedos',icon:'🧸', label:'Brinquedos',   sub:'Gerenciar catálogo' },
  { id:'clientes',  icon:'👥', label:'Clientes',      sub:'Base de clientes' },
  { id:'relatorios',icon:'📊', label:'Relatórios',    sub:'Dados e métricas' },
];

const MOCK_PEDIDOS = [
  { id:'#001', cliente:'Maria Silva',   tel:'(11)99999-0001', item:'Pula-Pula Castelo',  data:'30/05', status:'confirmado', local:'Rua das Flores, 123' },
  { id:'#002', cliente:'Carlos Oliveira',tel:'(11)99999-0002',item:'Totó + Piscina',     data:'01/06', status:'aguardando', local:'Av. Central, 456' },
  { id:'#003', cliente:'Ana Beatriz',   tel:'(11)99999-0003', item:'Kit Completo',       data:'07/06', status:'confirmado', local:'Rua dos Pinheiros, 789' },
  { id:'#004', cliente:'João Santos',   tel:'(11)99999-0004', item:'Cama Elástica',      data:'14/06', status:'pendente',  local:'Rua Nova, 321' },
];

const STATUS_COLOR = { confirmado:'green', aguardando:'yellow', pendente:'blue', cancelado:'red' };
const STATUS_LABEL = { confirmado:'✅ Confirmado', aguardando:'⏳ Aguardando', pendente:'🔵 Pendente', cancelado:'❌ Cancelado' };

function AdminDashboard({ user, onLogout, fireToast }) {
  const [tab, setTab] = useState('dashboard');
  const [pedidos, setPedidos] = useState(MOCK_PEDIDOS);

  const changeStatus = (id, status) => {
    setPedidos(ps => ps.map(p => p.id === id ? { ...p, status } : p));
    fireToast('✅ Status atualizado!');
  };

  const renderContent = () => {
    switch (tab) {
      case 'dashboard': return <AdminHome pedidos={pedidos} setTab={setTab} />;
      case 'pedidos':   return <AdminPedidos pedidos={pedidos} onChangeStatus={changeStatus} fireToast={fireToast} />;
      case 'brinquedos':return <AdminBrinquedos fireToast={fireToast} />;
      case 'clientes':  return <AdminClientes />;
      case 'relatorios':return <AdminRelatorios pedidos={pedidos} />;
      default: return null;
    }
  };

  return (
    <AppShell user={user} onLogout={onLogout} navItems={ADMIN_NAV} activeTab={tab} setActiveTab={setTab}>
      {renderContent()}
    </AppShell>
  );
}

function AdminHome({ pedidos, setTab }) {
  const confirmados = pedidos.filter(p=>p.status==='confirmado').length;
  const pendentes   = pedidos.filter(p=>p.status==='pendente'||p.status==='aguardando').length;
  return (
    <>
      <div className="metrics-grid">
        {[
          { icon:'📋', label:'Total de Pedidos',   val: pedidos.length, trend:'este mês', color:'var(--purple)' },
          { icon:'✅', label:'Confirmados',         val: confirmados,    trend:'ótimo!',   color:'var(--green)' },
          { icon:'⏳', label:'Pendentes',           val: pendentes,      trend:'atender',  color:'var(--yellow)' },
          { icon:'🧸', label:'Brinquedos Ativos',  val: TOYS.length,    trend:'disponíveis',color:'var(--pink)' },
        ].map(m => (
          <div key={m.label} className="metric-card glass anim-up" style={{'--card-color': m.color}}>
            <div className="metric-info">
              <h3>{m.label}</h3>
              <div className="metric-val">{m.val}</div>
              <div className="metric-trend">↑ {m.trend}</div>
            </div>
            <div className="metric-icon">{m.icon}</div>
          </div>
        ))}
      </div>

      <div className="panel-card glass anim-up" style={{ animationDelay:'0.1s' }}>
        <div className="panel-header">
          <h2>📋 Últimos Pedidos</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => setTab('pedidos')} id="admin-ver-pedidos">Ver todos →</button>
        </div>
        <div className="data-table-wrap">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Cliente</th><th>Item</th><th>Data</th><th>Status</th></tr></thead>
            <tbody>
              {pedidos.slice(0,4).map(p => (
                <tr key={p.id}>
                  <td><strong>{p.id}</strong></td>
                  <td>{p.cliente}</td>
                  <td>{p.item}</td>
                  <td>{p.data}</td>
                  <td><span className={`tag ${STATUS_COLOR[p.status]}`}>{STATUS_LABEL[p.status]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel-card glass anim-up" style={{ animationDelay:'0.2s' }}>
        <div className="panel-header"><h2>⚡ Ações Rápidas</h2></div>
        <div className="quick-actions">
          {[['📋','Ver Pedidos'],['🧸','Catálogo'],['👥','Clientes'],['📊','Relatórios']].map(([icon, label],i) => (
            <button key={label} className="quick-action-btn" onClick={() => setTab(['pedidos','brinquedos','clientes','relatorios'][i])} id={`admin-quick-${i}`}>
              <span>{icon}</span><span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function AdminPedidos({ pedidos, onChangeStatus, fireToast }) {
  return (
    <div className="panel-card glass anim-up">
      <div className="panel-header">
        <h2>📋 Todos os Pedidos</h2>
        <span className="tag">{pedidos.length} pedidos</span>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {pedidos.map(p => (
          <div key={p.id} className="order-card glass">
            <div className="order-card-head">
              <div>
                <div className="order-card-title">{p.cliente} <span style={{color:'var(--text3)',fontWeight:400}}>({p.id})</span></div>
                <div className="order-card-sub">📍 {p.local} · 📅 {p.data}</div>
              </div>
              <span className={`tag ${STATUS_COLOR[p.status]}`}>{STATUS_LABEL[p.status]}</span>
            </div>
            <div className="order-card-body">
              <span className="tag">🧸 {p.item}</span>
              <a className="tag blue" href={`https://wa.me/${p.tel.replace(/\D/g,'')}`} target="_blank" rel="noreferrer">📱 {p.tel}</a>
            </div>
            <div className="order-card-footer">
              {['confirmado','aguardando','pendente','cancelado'].map(s => (
                <button key={s} className={`btn btn-sm ${p.status===s?'btn-primary':'btn-ghost'}`}
                  onClick={() => onChangeStatus(p.id, s)} id={`admin-status-${p.id}-${s}`}
                  style={{ fontSize:'0.75rem', padding:'6px 12px', minHeight:32 }}>
                  {STATUS_LABEL[s].split(' ')[0]} {s.charAt(0).toUpperCase()+s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminBrinquedos({ fireToast }) {
  const [toys, setToys] = useState(TOYS.map(t => ({ ...t, disponivel: true })));
  return (
    <div className="panel-card glass anim-up">
      <div className="panel-header">
        <h2>🧸 Catálogo de Brinquedos</h2>
        <span className="tag">{toys.filter(t=>t.disponivel).length} disponíveis</span>
      </div>
      <div className="data-table-wrap">
        <table className="data-table">
          <thead><tr><th>Item</th><th>Categoria</th><th>Tags</th><th>Popular</th><th>Status</th><th>Ação</th></tr></thead>
          <tbody>
            {toys.map(t => (
              <tr key={t.id}>
                <td><span style={{marginRight:8}}>{t.emoji}</span><strong>{t.nome}</strong></td>
                <td><span className="tag">{t.cat}</span></td>
                <td><div style={{display:'flex',gap:4,flexWrap:'wrap'}}>{t.tags.map(tag=><span key={tag} className="tag" style={{fontSize:'0.68rem'}}>{tag}</span>)}</div></td>
                <td>{t.popular ? '⭐' : '—'}</td>
                <td><span className={`tag ${t.disponivel?'green':'red'}`}>{t.disponivel?'✅ Disponível':'❌ Indisponível'}</span></td>
                <td>
                  <button className="btn btn-sm btn-ghost" onClick={() => { setToys(ts => ts.map(x => x.id===t.id ? {...x, disponivel:!x.disponivel} : x)); fireToast('✅ Atualizado!'); }} id={`admin-toggle-${t.id}`}>
                    {t.disponivel ? 'Desativar' : 'Ativar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminClientes() {
  const clientes = [
    { nome:'Maria Silva', tel:'(11)99999-0001', pedidos:2, ultimo:'30/05', status:'ativo' },
    { nome:'Carlos Oliveira', tel:'(11)99999-0002', pedidos:1, ultimo:'01/06', status:'ativo' },
    { nome:'Ana Beatriz', tel:'(11)99999-0003', pedidos:3, ultimo:'07/06', status:'ativo' },
    { nome:'João Santos', tel:'(11)99999-0004', pedidos:1, ultimo:'14/06', status:'novo' },
  ];
  return (
    <div className="panel-card glass anim-up">
      <div className="panel-header">
        <h2>👥 Clientes</h2>
        <span className="tag">{clientes.length} cadastrados</span>
      </div>
      <div className="data-table-wrap">
        <table className="data-table">
          <thead><tr><th>Cliente</th><th>WhatsApp</th><th>Pedidos</th><th>Último</th><th>Status</th><th>Ação</th></tr></thead>
          <tbody>
            {clientes.map(c => (
              <tr key={c.nome}>
                <td><strong>{c.nome}</strong></td>
                <td>{c.tel}</td>
                <td style={{textAlign:'center'}}>{c.pedidos}</td>
                <td>{c.ultimo}</td>
                <td><span className={`tag ${c.status==='novo'?'blue':'green'}`}>{c.status==='novo'?'🆕 Novo':'✅ Ativo'}</span></td>
                <td>
                  <a className="btn btn-sm btn-green" href={`https://wa.me/${c.tel.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" id={`admin-wa-${c.nome}`} style={{minHeight:32,padding:'6px 12px',fontSize:'0.75rem'}}>📱 Chat</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminRelatorios({ pedidos }) {
  const conf = pedidos.filter(p=>p.status==='confirmado').length;
  const pend = pedidos.filter(p=>p.status==='pendente'||p.status==='aguardando').length;
  return (
    <>
      <div className="metrics-grid">
        {[
          { icon:'💰', label:'Receita Estimada', val:'R$ 1.240', color:'var(--green)' },
          { icon:'📈', label:'Taxa de Confirmação', val:`${Math.round(conf/pedidos.length*100)}%`, color:'var(--purple)' },
          { icon:'🎂', label:'Festas Este Mês', val: pedidos.length, color:'var(--yellow)' },
          { icon:'⏳', label:'Aguardando Retorno', val: pend, color:'var(--pink)' },
        ].map(m => (
          <div key={m.label} className="metric-card glass anim-up" style={{'--card-color': m.color}}>
            <div className="metric-info"><h3>{m.label}</h3><div className="metric-val">{m.val}</div></div>
            <div className="metric-icon">{m.icon}</div>
          </div>
        ))}
      </div>
      <div className="panel-card glass anim-up" style={{animationDelay:'0.1s'}}>
        <div className="panel-header"><h2>📊 Brinquedos Mais Solicitados</h2></div>
        {[['Totó / Pebolim','⭐⭐⭐⭐⭐',85],['Pula-Pula Castelo','⭐⭐⭐⭐⭐',78],['Escorregador Inflável','⭐⭐⭐⭐',62],['Piscina de Bolinhas','⭐⭐⭐⭐',54]].map(([nome,stars,pct]) => (
          <div key={nome} style={{marginBottom:14}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:6,gap:8,flexWrap:'wrap'}}>
              <span style={{fontWeight:700,fontSize:'0.88rem'}}>{nome}</span>
              <span style={{fontSize:'0.78rem',color:'var(--text2)'}}>{stars} · {pct}%</span>
            </div>
            <div style={{background:'rgba(255,255,255,0.06)',borderRadius:99,height:8,overflow:'hidden'}}>
              <div style={{width:`${pct}%`,height:'100%',background:'var(--grad)',borderRadius:99,transition:'width 1s ease'}}/>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ============================================================
   ATENDENTE DASHBOARD
   ============================================================ */
const ATENDENTE_NAV = [
  { id:'pedidos',  icon:'📋', label:'Pedidos',  sub:'Solicitações dos clientes', badge:'2' },
  { id:'agenda',   icon:'📅', label:'Agenda',   sub:'Eventos programados' },
  { id:'catalogo', icon:'🧸', label:'Catálogo', sub:'Ver brinquedos' },
];

function AtendenteDashboard({ user, onLogout, fireToast }) {
  const [tab, setTab] = useState('pedidos');
  const [pedidos, setPedidos] = useState(MOCK_PEDIDOS.filter(p => p.status !== 'confirmado'));

  const updateStatus = (id, status) => {
    setPedidos(ps => ps.map(p => p.id===id ? {...p, status} : p));
    fireToast('✅ Pedido atualizado!');
  };

  const renderContent = () => {
    switch(tab) {
      case 'pedidos':  return <AtendentePedidos pedidos={pedidos} onUpdate={updateStatus} />;
      case 'agenda':   return <AtendenteAgenda />;
      case 'catalogo': return <AtendenteCatalogo />;
      default: return null;
    }
  };

  return (
    <AppShell user={user} onLogout={onLogout} navItems={ATENDENTE_NAV} activeTab={tab} setActiveTab={setTab}>
      {renderContent()}
    </AppShell>
  );
}

function AtendentePedidos({ pedidos, onUpdate }) {
  return (
    <>
      <div className="metrics-grid" style={{gridTemplateColumns:'repeat(auto-fill, minmax(min(160px,100%),1fr))'}}>
        {[
          {icon:'⏳',label:'Pendentes', val:pedidos.filter(p=>p.status==='pendente').length, color:'var(--yellow)'},
          {icon:'🔵',label:'Aguardando',val:pedidos.filter(p=>p.status==='aguardando').length, color:'var(--blue)'},
          {icon:'✅',label:'Confirmados',val:pedidos.filter(p=>p.status==='confirmado').length, color:'var(--green)'},
        ].map(m => (
          <div key={m.label} className="metric-card glass anim-up" style={{'--card-color':m.color}}>
            <div className="metric-info"><h3>{m.label}</h3><div className="metric-val">{m.val}</div></div>
            <div className="metric-icon">{m.icon}</div>
          </div>
        ))}
      </div>
      <div className="panel-card glass anim-up" style={{animationDelay:'0.1s'}}>
        <div className="panel-header"><h2>📋 Pedidos para Atender</h2></div>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {pedidos.length === 0
            ? <p style={{textAlign:'center',color:'var(--text2)',padding:24}}>🎉 Nenhum pedido pendente!</p>
            : pedidos.map(p => (
              <div key={p.id} className="order-card glass">
                <div className="order-card-head">
                  <div>
                    <div className="order-card-title">{p.cliente}</div>
                    <div className="order-card-sub">📅 {p.data} · 📍 {p.local}</div>
                  </div>
                  <span className={`tag ${STATUS_COLOR[p.status]}`}>{STATUS_LABEL[p.status]}</span>
                </div>
                <div className="order-card-body"><span className="tag">🧸 {p.item}</span></div>
                <div className="order-card-footer">
                  <button className="btn btn-sm btn-primary" onClick={() => onUpdate(p.id, 'confirmado')} id={`ate-confirmar-${p.id}`}>✅ Confirmar</button>
                  <a className="btn btn-sm btn-green" href={`https://wa.me/${p.tel.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" id={`ate-wa-${p.id}`} style={{minHeight:36,padding:'8px 16px'}}>📱 WhatsApp</a>
                  <button className="btn btn-sm btn-danger" onClick={() => onUpdate(p.id, 'cancelado')} id={`ate-cancelar-${p.id}`}>❌ Cancelar</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </>
  );
}

function AtendenteAgenda() {
  const eventos = [
    { data:'30/05', dia:'Sábado', cliente:'Maria Silva',   item:'Pula-Pula Castelo',  hora:'14:00–18:00', status:'confirmado' },
    { data:'07/06', dia:'Sábado', cliente:'Ana Beatriz',   item:'Kit Completo',        hora:'15:00–20:00', status:'confirmado' },
  ];
  return (
    <div className="panel-card glass anim-up">
      <div className="panel-header"><h2>📅 Agenda de Eventos</h2><span className="tag">{eventos.length} agendados</span></div>
      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        {eventos.map((ev,i) => (
          <div key={i} className="order-card glass" style={{borderLeft:'4px solid var(--purple)'}}>
            <div className="order-card-head">
              <div>
                <div className="order-card-title">{ev.cliente}</div>
                <div className="order-card-sub">📅 {ev.dia}, {ev.data} · 🕐 {ev.hora}</div>
              </div>
              <span className="tag green">✅ Confirmado</span>
            </div>
            <div className="order-card-body"><span className="tag">🧸 {ev.item}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AtendenteCatalogo() {
  return (
    <div className="panel-card glass anim-up">
      <div className="panel-header"><h2>🧸 Catálogo (Consulta)</h2></div>
      <div className="pub-toys-grid">
        {TOYS.map(t => (
          <div key={t.id} className="pub-toy-card glass">
            <div className="toy-card-head">
              <span className="toy-emoji">{t.emoji}</span>
              {t.popular && <span className="toy-popular-badge">⭐ Popular</span>}
            </div>
            <h3>{t.nome}</h3>
            <p>{t.desc}</p>
            <div className="toy-tags">{t.tags.map(tag=><span key={tag} className="tag">{tag}</span>)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   CLIENT DASHBOARD
   ============================================================ */
const CLIENT_NAV = [
  { id:'meus-pedidos', icon:'📋', label:'Meus Pedidos',    sub:'Acompanhe suas solicitações' },
  { id:'novo-pedido',  icon:'➕', label:'Novo Pedido',     sub:'Solicitar brinquedos' },
  { id:'perfil',       icon:'👤', label:'Meu Perfil',      sub:'Seus dados' },
];

function ClientDashboard({ user, onLogout, fireToast }) {
  const [tab, setTab] = useState('meus-pedidos');
  const [pedidos, setPedidos] = useState([
    { id:'#001', item:'Pula-Pula Castelo', data:'30/05', status:'confirmado', obs:'Festa da Sofia' },
  ]);

  const addPedido = (pedido) => {
    setPedidos(ps => [...ps, { id:`#00${ps.length+2}`, ...pedido, status:'pendente' }]);
    fireToast('🎉 Pedido enviado! Entraremos em contato em breve!');
    setTab('meus-pedidos');
  };

  const renderContent = () => {
    switch(tab) {
      case 'meus-pedidos': return <ClientPedidos pedidos={pedidos} />;
      case 'novo-pedido':  return <ClientNovoPedido onSubmit={addPedido} />;
      case 'perfil':       return <ClientPerfil user={user} fireToast={fireToast} />;
      default: return null;
    }
  };

  return (
    <AppShell user={user} onLogout={onLogout} navItems={CLIENT_NAV} activeTab={tab} setActiveTab={setTab}>
      {renderContent()}
    </AppShell>
  );
}

function ClientPedidos({ pedidos }) {
  return (
    <>
      <div className="metrics-grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(min(160px,100%),1fr))'}}>
        <div className="metric-card glass anim-up" style={{'--card-color':'var(--purple)'}}>
          <div className="metric-info"><h3>Total de Pedidos</h3><div className="metric-val">{pedidos.length}</div></div>
          <div className="metric-icon">📋</div>
        </div>
        <div className="metric-card glass anim-up" style={{'--card-color':'var(--green)'}}>
          <div className="metric-info"><h3>Confirmados</h3><div className="metric-val">{pedidos.filter(p=>p.status==='confirmado').length}</div></div>
          <div className="metric-icon">✅</div>
        </div>
        <div className="metric-card glass anim-up" style={{'--card-color':'var(--yellow)'}}>
          <div className="metric-info"><h3>Pendentes</h3><div className="metric-val">{pedidos.filter(p=>p.status==='pendente').length}</div></div>
          <div className="metric-icon">⏳</div>
        </div>
      </div>
      <div className="panel-card glass anim-up" style={{animationDelay:'0.1s'}}>
        <div className="panel-header"><h2>📋 Minhas Solicitações</h2></div>
        {pedidos.length === 0
          ? <p style={{textAlign:'center',color:'var(--text2)',padding:24}}>Nenhum pedido ainda. <button style={{color:'var(--purple)',fontWeight:700,background:'none',border:'none',cursor:'pointer'}}>Fazer meu primeiro pedido!</button></p>
          : <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {pedidos.map(p => (
                <div key={p.id} className="order-card glass">
                  <div className="order-card-head">
                    <div>
                      <div className="order-card-title">🧸 {p.item}</div>
                      <div className="order-card-sub">{p.obs && `📝 ${p.obs} · `}📅 {p.data}</div>
                    </div>
                    <span className={`tag ${STATUS_COLOR[p.status]}`}>{STATUS_LABEL[p.status]}</span>
                  </div>
                  <div className="order-card-body">
                    <span className="tag blue">{p.id}</span>
                    {p.status === 'pendente' && <span className="tag yellow">⏳ Aguardando confirmação</span>}
                    {p.status === 'confirmado' && <span className="tag green">✅ Tudo certo!</span>}
                  </div>
                </div>
              ))}
            </div>
        }
      </div>
    </>
  );
}

function ClientNovoPedido({ onSubmit }) {
  const [form, setForm] = useState({ item:'', data:'', local:'', criancas:'', obs:'' });
  const handleChange = e => setForm(p => ({...p, [e.target.name]: e.target.value}));
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit({ item: form.item, data: form.data, local: form.local, obs: `Local: ${form.local}. Crianças: ${form.criancas}. ${form.obs}`.trim() });
    setForm({ item:'', data:'', local:'', criancas:'', obs:'' });
  };

  return (
    <form className="form-card glass anim-up" onSubmit={handleSubmit}>
      <div className="panel-header" style={{marginBottom:20}}>
        <h2>➕ Nova Solicitação</h2>
        <span className="tag green">🆓 Orçamento grátis</span>
      </div>
      <div className="form-grid-2">
        <div className="input-group" style={{gridColumn:'1/-1'}}>
          <label htmlFor="np-item">Brinquedo desejado *</label>
          <select id="np-item" name="item" value={form.item} onChange={handleChange} required>
            <option value="">Selecione…</option>
            {TOYS.map(t => <option key={t.id} value={t.nome}>{t.emoji} {t.nome}</option>)}
            <option value="Pacote Completo">📦 Pacote Completo (vários itens)</option>
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="np-data">Data da Festa *</label>
          <input id="np-data" name="data" type="date" value={form.data} onChange={handleChange} min={today} required />
        </div>
        <div className="input-group">
          <label htmlFor="np-criancas">Número de crianças</label>
          <input id="np-criancas" name="criancas" type="number" placeholder="Ex: 15" value={form.criancas} onChange={handleChange} min={1} />
        </div>
        <div className="input-group" style={{gridColumn:'1/-1'}}>
          <label htmlFor="np-local">Local do evento *</label>
          <input id="np-local" name="local" type="text" placeholder="Endereço completo" value={form.local} onChange={handleChange} required />
        </div>
        <div className="input-group" style={{gridColumn:'1/-1'}}>
          <label htmlFor="np-obs">Observações</label>
          <textarea id="np-obs" name="obs" rows={3} placeholder="Tema da festa, horário, algum detalhe especial…" value={form.obs} onChange={handleChange} />
        </div>
      </div>
      <div className="form-footer">
        <button type="submit" className="btn btn-primary" id="np-submit">🎉 Enviar Solicitação</button>
      </div>
      <p style={{fontSize:'0.78rem',color:'var(--text3)',marginTop:10,textAlign:'center'}}>Entraremos em contato pelo WhatsApp em até 1 hora!</p>
    </form>
  );
}

function ClientPerfil({ user, fireToast }) {
  return (
    <div className="form-card glass anim-up">
      <div className="panel-header" style={{marginBottom:20}}><h2>👤 Meu Perfil</h2></div>
      <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:28,padding:'16px 20px',borderRadius:'var(--r-md)',background:'var(--glass-light)',border:'1px solid var(--border)'}}>
        <div style={{width:56,height:56,borderRadius:'50%',background:'var(--grad)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',fontWeight:900,color:'#fff',flexShrink:0}}>{user.avatar}</div>
        <div>
          <div style={{fontWeight:800,fontSize:'1.05rem'}}>{user.nome}</div>
          <div style={{fontSize:'0.82rem',color:'var(--text2)',marginTop:2}}>Cliente • Membro desde maio/2026</div>
        </div>
      </div>
      <div className="form-grid-2">
        <div className="input-group">
          <label>Nome</label>
          <input type="text" defaultValue={user.nome} readOnly style={{opacity:0.7}} />
        </div>
        <div className="input-group">
          <label>E-mail</label>
          <input type="email" defaultValue={user.email || 'cliente@email.com'} readOnly style={{opacity:0.7}} />
        </div>
        <div className="input-group">
          <label>WhatsApp</label>
          <input type="tel" defaultValue={user.telefone || '(00) 00000-0000'} readOnly style={{opacity:0.7}} />
        </div>
        <div className="input-group">
          <label>Status</label>
          <input type="text" value="✅ Cliente Ativo" readOnly style={{opacity:0.7}} />
        </div>
      </div>
      <div className="form-footer" style={{marginTop:16}}>
        <button className="btn btn-primary btn-sm" onClick={() => fireToast('✅ Perfil salvo com sucesso!')} id="btn-salvar-perfil">Salvar Alterações</button>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */
export default function App() {
  const [view, setView]   = useState('public'); // public | login | register | admin | atendente | client
  const [user, setUser]   = useState(null);
  const { toastMsg, toastShow, fireToast } = useToast();

  const handleLogin = (userData) => {
    setUser(userData);
    setView(userData.role === 'admin' ? 'admin' : userData.role === 'atendente' ? 'atendente' : 'client');
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setView('client');
  };

  const handleLogout = () => { setUser(null); setView('public'); };

  return (
    <>
      {view === 'public'    && <PublicSite onGoLogin={() => setView('login')} onGoRegister={() => setView('register')} />}
      {view === 'login'     && <LoginPage   onLogin={handleLogin}   onGoRegister={() => setView('register')} onGoPublic={() => setView('public')} />}
      {view === 'register'  && <RegisterPage onRegister={handleRegister} onGoLogin={() => setView('login')} onGoPublic={() => setView('public')} fireToast={fireToast} />}
      {view === 'admin'     && <AdminDashboard     user={user} onLogout={handleLogout} fireToast={fireToast} />}
      {view === 'atendente' && <AtendenteDashboard user={user} onLogout={handleLogout} fireToast={fireToast} />}
      {view === 'client'    && <ClientDashboard    user={user} onLogout={handleLogout} fireToast={fireToast} />}
      <Toast msg={toastMsg} show={toastShow} />
    </>
  );
}
