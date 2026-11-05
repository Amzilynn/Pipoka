import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import ModuleIllustration from '../components/ModuleIllustration';
import './LandingPage.css';

const modules = [
  { key: 'learn', title: 'Apprendre', label: 'La curiosité en action', text: 'Des lettres, des nombres et de petites énigmes pour le plaisir de découvrir.', icon: 'Aa', color: '#e8edff' },
  { key: 'communicate', title: 'Communiquer', label: 'Chaque expression compte', text: 'Mettre des mots sur ses besoins, construire des phrases et échanger.', icon: '♡', color: '#fce6e8' },
  { key: 'move', title: 'Bouger', label: 'Le corps aussi apprend', text: 'Explorer les mouvements, les directions et les gestes en s’amusant.', icon: '↗', color: '#dff1e6' },
  { key: 'grow', title: 'Grandir', label: 'Les petits pas du quotidien', text: 'Se préparer, organiser son sac et découvrir les routines de la journée.', icon: '☀', color: '#fff0ce' },
];

const contacts = [
  { name: 'Amal El jazi', initials: 'AE', email: 'amal.eljazi@example.com', phone: '+1 202-555-0101' },
  { name: 'Jemil Otmani', initials: 'JO', email: 'jemil.otmani@example.com', phone: '+1 202-555-0102' },
  { name: 'Mael playe', initials: 'MP', email: 'mael.playe@example.com', phone: '+1 202-555-0103' },
  { name: 'Balsamo Marianna Pia', initials: 'BM', email: 'marianna.balsamo@example.com', phone: '+1 202-555-0104' },
  { name: 'Capone Matilde', initials: 'CM', email: 'matilde.capone@example.com', phone: '+1 202-555-0105' },
];
export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="lp">
      <a className="lp-skip" href="#contenu">Aller au contenu</a>
      <header className="lp-header">
        <Link to="/" className="lp-brand" aria-label="Boblii, accueil"><Logo /></Link>
        <button className="lp-menu" aria-expanded={menuOpen} aria-controls="landing-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Fermer ✕' : 'Menu ☰'}</button>
        <nav id="landing-nav" className={menuOpen ? 'lp-nav is-open' : 'lp-nav'} aria-label="Navigation principale" onClick={() => setMenuOpen(false)}>
          <a href="#univers">Nos univers</a><a href="#approche">Notre approche</a><a href="#ensemble">Pour les familles</a><a href="#tarifs">Tarifs</a><a href="#contact">Contact</a>
          <Link className="lp-button lp-button-small" to="/connexion">Se connecter / S’inscrire <span aria-hidden="true">↗</span></Link>
        </nav>
      </header>
      <main id="contenu">
        <section className="lp-hero">
          <div className="lp-hero-copy">
            <span className="lp-eyebrow"><span/> UN MONDE DE POSSIBILITÉS</span>
            <h1>Les petits pas<br/>font les <span>grandes<br className="lp-desktop-break"/> découvertes.</span></h1>
            <p>Apprendre, s’exprimer, bouger, grandir. Un univers ludique pour accompagner chaque enfant, à son rythme et à sa façon.</p>
            <div className="lp-actions"><Link to="/connexion" className="lp-button">Se connecter / S’inscrire <span aria-hidden="true">↗</span></Link><a href="#univers" className="lp-text-link"><span className="lp-play" aria-hidden="true">↓</span> Explorer les activités</a></div>
            <div className="lp-hero-note"><span aria-hidden="true">✦</span> Chaque enfant a sa place. Chaque progrès compte.</div>
          </div>
          <div className="lp-world" aria-label="Boblii, le compagnon des quatre univers d’activités" role="img">
            <div className="lp-world-orbit"/><span className="lp-spark lp-spark-one" aria-hidden="true">✦</span><span className="lp-spark lp-spark-two" aria-hidden="true">✳</span>
            <span className="lp-hello">Coucou, moi c’est Boblii ! <span aria-hidden="true">♡</span></span>
            <div className="lp-mascot"><img className="lp-brand-mascot" src={`${import.meta.env.BASE_URL}assets/brand/boblii-mascot.png`} alt="" width="240" height="284" /></div>
            <div className="lp-float lp-float-learn"><span>Aa</span>Apprendre</div>
            <div className="lp-float lp-float-talk"><span>♡</span>Communiquer</div>
            <div className="lp-float lp-float-move"><span>↗</span>Bouger</div>
            <div className="lp-float lp-float-grow"><span>☀</span>Grandir</div>
            <span className="lp-world-caption">Une aventure qui commence avec toi.</span>
          </div>
        </section>
        <div className="lp-values"><span>✳ Des activités visuelles</span><span>◉ Des consignes à écouter</span><span>♡ Un rythme personnel</span><span>✦ Le plaisir d’essayer</span></div>
        <section id="univers" className="lp-section">
          <div className="lp-section-heading"><div><span className="lp-eyebrow">EXPLORER, ESSAYER, RECOMMENCER</span><h2>Quatre univers.<br/>Mille façons de s’épanouir.</h2></div><p>Une envie, une découverte, un petit défi.<br/>À chaque journée son aventure.</p></div>
          <div className="lp-module-grid">{modules.map((item, index) => <Link to="/connexion" key={item.key} className={`lp-module lp-module-${item.key}`} style={{ '--module-bg': item.color }}><div className="lp-module-art"><span className="lp-module-number">0{index + 1}</span><ModuleIllustration theme={item.key} title={`Découvrir l’univers ${item.title.toLowerCase()}`}/></div><div className="lp-module-copy"><span className="lp-module-label">{item.label}</span><h3>{item.title}<span aria-hidden="true">↗</span></h3><p>{item.text}</p></div></Link>)}</div>
        </section>
        <section id="approche" className="lp-approach lp-section">
          <div className="lp-approach-art"><span className="lp-sticker">À chacun<br/>son tempo ♡</span><img className="lp-brand-mascot lp-brand-mascot--small" src={`${import.meta.env.BASE_URL}assets/brand/boblii-mascot.png`} alt="" width="180" height="213" /><div className="lp-progress-demo"><span>Un essai, une découverte</span><div><i/><i/><i/><i/><i/></div><small>Le plaisir d’avancer, pas à pas.</small></div></div>
          <div><span className="lp-eyebrow">LA CONFIANCE, ÇA SE CULTIVE</span><h2>Pas de course.<br/>Juste le plaisir d’avancer.</h2><p className="lp-body-copy">On n’apprend pas tous de la même façon. Boblii fait une place aux images, aux mots et aux mouvements pour rendre chaque découverte plus concrète.</p><ul className="lp-checks"><li>Des activités pour apprendre en faisant</li><li>Des repères visuels et des consignes audio</li><li>Un compagnon pour encourager l’exploration</li></ul><Link to="/connexion" className="lp-text-link">Découvrir mon espace <span aria-hidden="true">↗</span></Link></div>
        </section>
        <section id="ensemble" className="lp-section lp-together"><span className="lp-eyebrow">ON GRANDIT MIEUX ENSEMBLE</span><h2>Une aventure à partager.</h2><p>Autour de l’enfant, chacun a son espace pour l’accompagner.</p><div className="lp-audiences"><Link to="/connexion"><span aria-hidden="true">☺</span><h3>Pour les enfants</h3><p>Choisir, jouer et découvrir avec Boblii.</p><strong>Je découvre <span aria-hidden="true">↗</span></strong></Link><Link to="/connexion"><span aria-hidden="true">♡</span><h3>Pour les parents</h3><p>Accompagner les activités et suivre le parcours.</p><strong>J’accompagne <span aria-hidden="true">↗</span></strong></Link><Link to="/connexion"><span aria-hidden="true">✳</span><h3>Pour les spécialistes</h3><p>Retrouver un espace dédié à l’accompagnement.</p><strong>J’explore <span aria-hidden="true">↗</span></strong></Link></div></section>
        <section id="tarifs" className="lp-section lp-pricing" aria-labelledby="pricing-title">
          <div className="lp-section-heading"><div><span className="lp-eyebrow">CHOISIR CE QUI VOUS CONVIENT</span><h2 id="pricing-title">Pour votre enfant.<br/>Pour votre classe.</h2></div><p>Commencer gratuitement, aller plus loin en famille<br/>ou accompagner toute une classe.</p></div>
          <div className="lp-pricing-grid">
            <article className="lp-price-card"><span className="lp-price-icon" aria-hidden="true">☀</span><p className="lp-price-audience">POUR FAIRE SES PREMIERS PAS</p><h3>Gratuit</h3><p className="lp-price"><strong>0 €</strong></p><p className="lp-price-detail">Un accès gratuit pour commencer.</p><p>Découvrir Boblii et entrer dans l’aventure, au rythme de votre enfant.</p><Link className="lp-button" to="/connexion?mode=signup">Commencer gratuitement <span aria-hidden="true">↗</span></Link></article>
            <article className="lp-price-card lp-price-premium"><span className="lp-price-icon" aria-hidden="true">♡</span><p className="lp-price-audience">POUR LES FAMILLES</p><h3>Premium</h3><p className="lp-price"><strong>10 €</strong><span>/ mois</span></p><p className="lp-price-detail">ou <strong>100 € par an</strong><br/>Par enfant, TVA incluse.</p><ul><li>L’accès Premium pour votre enfant</li><li>Votre tableau de bord parent</li><li>Des nouvelles à partager, si vous le souhaitez</li></ul><Link className="lp-button" to="/connexion/parent?mode=signup">Créer mon compte parent <span aria-hidden="true">↗</span></Link></article>
            <article className="lp-price-card"><span className="lp-price-icon" aria-hidden="true">✦</span><p className="lp-price-audience">POUR LES ÉTABLISSEMENTS ET LES ULIS</p><h3>Avec toute la classe</h3><p className="lp-price"><strong>1 000 €</strong><span>/ an</span></p><p className="lp-price-detail">Hors TVA, par groupe-classe.<br/>Jusqu’à 30 élèves.</p><p>Un accès pour accompagner les enfants au sein de votre classe ou de votre dispositif ULIS.</p><Link className="lp-button" to="/connexion/specialiste?mode=signup">Découvrir l’espace éducateur <span aria-hidden="true">↗</span></Link></article>
          </div>
          <div className="lp-pricing-notes"><div><h3>Rendre Boblii plus accessible</h3><p>Un tarif réduit pourra être proposé aux familles si des aides extérieures le permettent.</p></div><div><h3>Prendre le temps de découvrir en classe</h3><p>Avant l’abonnement annuel, une première période de découverte permet aux enseignants, aux enfants et aux responsables de l’établissement de prendre en main Boblii.</p></div></div>
        </section>
        <section className="lp-final"><span aria-hidden="true" className="lp-final-star">✳</span><span className="lp-eyebrow">LE PREMIER PAS, C’EST PAR ICI</span><h2>Et si on découvrait<br/>quelque chose aujourd’hui ?</h2><Link to="/connexion" className="lp-button">Bienvenue dans Boblii <span aria-hidden="true">↗</span></Link><p>Un petit clic. Une nouvelle aventure.</p></section>
        <section id="contact" className="lp-section lp-contact" aria-labelledby="contact-title">
          <div className="lp-section-heading">
            <div><span className="lp-eyebrow">FAISONS CONNAISSANCE</span><h2 id="contact-title">Contactez-nous.</h2></div>
            <p>Une question, une idée, une envie d’échanger ?<br/>Retrouvez les membres de notre équipe.</p>
          </div>
          <figure className="lp-team-photo">
            <img src={`${import.meta.env.BASE_URL}assets/brand/boblii-team.png`} alt="Les cinq membres de l’équipe Boblii en t-shirts rose pâle devant le campus." width="1672" height="941" loading="lazy" decoding="async" />
            <figcaption>L’équipe Boblii — ensemble, pour grandir.</figcaption>
          </figure>
          <p className="lp-contact-note">Coordonnées de démonstration : les numéros et adresses ci-dessous sont fictifs.</p>
          <div className="lp-contact-grid">
            {contacts.map((contact) => (
              <article className="lp-contact-card" key={contact.email}>
                <span className="lp-contact-avatar" aria-hidden="true">{contact.initials}</span>
                <h3>{contact.name}</h3>
                <address>
                  <a href={`mailto:${contact.email}`}><span aria-hidden="true">✉</span>{contact.email}</a>
                  <span className="lp-contact-phone"><span aria-hidden="true">☎</span>{contact.phone}</span>
                </address>
              </article>
            ))}
          </div>
        </section>
      </main>
      <footer className="lp-footer"><Link to="/" className="lp-brand"><Logo /></Link><p>Chacun son rythme. Ensemble, plus loin.</p><a href="#contenu">Retour en haut ↑</a></footer>
    </div>
  );
}
