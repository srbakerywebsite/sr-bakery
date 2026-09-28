import {useEffect,useMemo,useState} from 'react';
import {useCol,useSettings,DEMO,DEMO_CATS} from './lib';
const money=n=>'৳'+Number(n||0).toLocaleString('en-US');
const sizes=a=>(a||[]).map(s=>{const[l,p]=String(s).split('=');return{label:l.trim(),price:p?Number(p):null}});
const fmtD=d=>new Date(d+'T00:00').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
const fmtT=t=>{const[h,m]=t.split(':');return new Date(2000,0,1,h,m).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})};
const today=()=>{const d=new Date();return new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,10)};
const waUrl=(n,t)=>{let d=String(n).replace(/\D/g,'');if(d.startsWith('0'))d='88'+d;return `https://wa.me/${d}?text=${encodeURIComponent(t)}`};
const fill=(t,v)=>t.replace(/\{(\w+)\}/g,(_,k)=>v[k]??'');
const IDS=['home','cakes','categories','about','why','reviews','gallery','contact'];
const abs=u=>{try{return new URL(u,location.origin).href}catch{return u}};
const useEsc=f=>useEffect(()=>{const h=e=>e.key==='Escape'&&f();addEventListener('keydown',h);return()=>removeEventListener('keydown',h)},[f]);
const price=p=>p.discountPrice>0?p.discountPrice:p.price;
const Stars=({n})=><span aria-label={`Rating ${n} of 5`} className="stars">{'★'.repeat(Math.round(n))}{'☆'.repeat(5-Math.round(n))}</span>;

function Seo({S}){useEffect(()=>{
 document.title=S.seoTitle;const m=(sel,attr,k,v)=>{let el=document.head.querySelector(sel);if(!el){el=document.createElement('meta');el.setAttribute(attr,k);document.head.appendChild(el)}el.setAttribute('content',v)};
 m('meta[name=description]','name','description',S.seoDesc);m('meta[property="og:title"]','property','og:title',S.ogTitle||S.seoTitle);m('meta[property="og:description"]','property','og:description',S.ogDesc||S.seoDesc);
 if(S.ogImage)m('meta[property="og:image"]','property','og:image',abs(S.ogImage));m('meta[name="twitter:card"]','name','twitter:card','summary_large_image');
 let l=document.querySelector('link[rel=icon]');if(l&&S.favicon)l.href=S.favicon;
 let j=document.getElementById('ld');if(!j){j=document.createElement('script');j.id='ld';j.type='application/ld+json';document.head.appendChild(j)}
 j.textContent=JSON.stringify({'@context':'https://schema.org','@type':'Bakery',name:S.brand,description:S.seoDesc,image:abs(S.logo),telephone:'+'+S.whatsapp.replace(/\D/g,''),url:location.origin});
},[S]);return null}

export default function Site(){
 const S=useSettings(),prods=useCol('products',DEMO).filter(p=>!p.hidden),cats=useCol('categories',DEMO_CATS).filter(c=>!c.hidden),reviews=useCol('reviews',[]).filter(r=>!r.hidden);
 const[splash,setSplash]=useState(true),[menu,setMenu]=useState(false),[q,setQ]=useState(''),[cat,setCat]=useState('All'),[open,setOpen]=useState(null),[lb,setLb]=useState(null),[qs,setQ]=useState({});
 useEffect(()=>{const t=setTimeout(()=>setSplash(false),1600);return()=>clearTimeout(t)},[]);
 const list=useMemo(()=>prods.filter(p=>(cat==='All'||p.category===cat)&&(p.name+' '+p.category+' '+(p.tags||[]).join(' ')+' '+(p.shortDescription||'')).toLowerCase().includes(q.toLowerCase())),[prods,cat,q]);
 const gallery=useMemo(()=>[...new Set(prods.flatMap(p=>[p.image,...(p.gallery||[])]).filter(Boolean))],[prods]);
 const nav=S.nav.split(',');const feats=S.features.split('\n').filter(Boolean).map(l=>l.split('|'));
 const socials=[['Facebook',S.facebook],['TikTok',S.tiktok],['Instagram',S.instagram],['YouTube',S.youtube],...S.others.split('\n').filter(Boolean).map(l=>l.split('|'))].filter(s=>s[1]);
 const go=(a)=>{if(a?.startsWith('#'))document.querySelector(a)?.scrollIntoView({behavior:'smooth'});else if(a)window.open(a,'_blank','noopener')};
 const custom=()=>window.open(waUrl(S.whatsapp,S.customMsg),'_blank','noopener');
 const gp=(fn)=>e=>{e.preventDefault();fn()};
 const section=(id,cls,children)=><section id={id} className={'sec '+cls}>{children}</section>;
 return <>
 <Seo S={S}/>
 {S.notice&&<div className="notice">{S.notice}</div>}
 {splash&&<div className="splash" role="status"><img src={S.logo} alt={S.brand}/><i/></div>}
 <header className="nav"><a href="#home" className="brand"><img src={S.logo} alt="" width="40" height="40"/>{S.brand}</a>
  <nav className={menu?'links open':'links'} aria-label="Main">{nav.map((n,i)=><a key={i} href={'#'+IDS[i]} onClick={()=>setMenu(false)}>{n}</a>)}
   <a className="btn sm" href="#cakes" onClick={()=>setMenu(false)}>{S.orderBtn.replace(/ on WhatsApp/i,'')}</a></nav>
  <button className="burger" aria-label="Menu" aria-expanded={menu} onClick={()=>setMenu(!menu)}><span/><span/><span/></button></header>
 <main>
 <section id="home" className="hero"><div className="wrap hero-in"><div className="hero-t">
  <h1>{S.heroTitle}</h1><p className="lead">{S.heroSubtitle}</p><p className="muted">{S.heroDesc}</p>
  <div className="row"><button className="btn" onClick={()=>go(S.cta1Action)}>{S.cta1}</button><button className="btn ghost" onClick={()=>go(S.cta2Action)}>{S.cta2}</button></div>
  <p className="proof"><b>{S.rating}</b> / 5 <Stars n={S.rating}/> &nbsp; <b>{S.customers}</b> happy customers</p></div>
  <picture className="hero-i"><source media="(max-width:700px)" srcSet={S.heroImageMobile||S.heroImage}/><img src={S.heroImage} alt="Signature SR.Bakery cake" fetchpriority="high"/></picture></div></section>
 {S.trustTitle&&<div className="wrap"><div className="trust"><b>{S.trustTitle}</b><span className="muted">{S.trustText}</span></div></div>}

 {section('categories','wrap',<><h2>{nav[2]}</h2><div className="cats">{[{name:'All'},...cats].map(c=><button key={c.name} className={'cat'+(cat===c.name?' on':'')} style={c.image?{backgroundImage:`linear-gradient(#0006,#0006),url(${c.image})`}:null} onClick={()=>{setCat(c.name);document.getElementById('cakes').scrollIntoView({behavior:'smooth'})}}>{c.name}</button>)}</div></>)}

 {section('cakes','wrap',<><h2>{nav[1]}</h2>
  <div className="tools"><input type="search" aria-label="Search" placeholder="Search cakes, desserts, cookies..." value={q} onChange={e=>setQ(e.target.value)}/></div>
  <div className="grid">{list.map(p=><article key={p.id} className="card">
   <button className="card-img" onClick={()=>setOpen(p)} aria-label={'View '+p.name}><img src={p.image} alt={p.name} loading="lazy"/>{p.newProduct&&<em>New</em>}{p.featured&&!p.newProduct&&<em>Featured</em>}</button>
   <div className="card-b"><small>{p.category}</small><h3>{p.name}</h3><p className="price"><b>{money(sizes(p.availableSizes)[0]?.price??price(p))}</b> {p.discountPrice>0&&<s className="muted">{money(p.price)}</s>}</p><Stars n={p.rating||0}/>
    <div className="row"><span className="step"><button aria-label="Less" onClick={()=>setQ({...qs,[p.id]:Math.max(1,(qs[p.id]||1)-1)})}>−</button><b>{qs[p.id]||1}</b><button aria-label="More" onClick={()=>setQ({...qs,[p.id]:Math.min(20,(qs[p.id]||1)+1)})}>+</button></span><button className="btn sm" disabled={!p.availability} onClick={()=>setOpen({...p,q0:qs[p.id]||1})}>{p.availability?'Order Now':'Sold out'}</button></div></div></article>)}
   {!list.length&&<p className="muted">No cakes match your search.</p>}</div></>)}

 {section('custom','band',<div className="wrap center"><h2>{S.customTitle}</h2><p className="lead">{S.customText}</p><button className="btn" onClick={custom}>{S.customBtn}</button></div>)}
 {section('about','wrap two',<><div><h2>{S.aboutTitle}</h2><p>{S.aboutText}</p><p className="muted">Founder: {S.founder} · CEO: {S.ceo}</p></div><img src={prods[1]?.image||S.heroImage} alt="Handmade SR.Bakery cake" loading="lazy"/></>)}
 {section('why','wrap',<><h2>{S.whyTitle}</h2><div className="feats">{feats.map((f,i)=><div key={i}><h3>{f[0]}</h3><p className="muted">{f[1]}</p></div>)}</div></>)}
 {section('reviews','wrap',<><h2>{nav[5]}</h2><p className="proof"><b>{S.rating}</b> / 5 <Stars n={S.rating}/> · <b>{S.customers}</b> happy customers</p>
  <div className="grid rv">{reviews.map(r=><blockquote key={r.id} className="card card-b">{r.image&&<img src={r.image} alt="" loading="lazy"/>}<Stars n={r.rating}/><p>{r.comment}</p><footer className="muted">{r.name} {r.date&&'· '+r.date}</footer></blockquote>)}{!reviews.length&&<p className="muted">Reviews will appear here.</p>}</div></>)}
 {section('gallery','wrap',<><h2>{nav[6]}</h2><div className="masonry">{gallery.map((g,i)=><button key={g} onClick={()=>setLb(i)} aria-label="Open image"><img src={g} alt={`SR.Bakery cake ${i+1}`} loading="lazy"/></button>)}</div></>)}
 {section('contact','wrap center',<><h2>{nav[7]}</h2><p>{S.contactText}</p><p className="lead">{S.brand} · WhatsApp {S.phoneDisplay}</p><a className="btn" href={waUrl(S.whatsapp,`Hello ${S.brand}!`)} target="_blank" rel="noopener">{S.orderBtn}</a></>)}
 </main>
 <footer className="foot"><div className="wrap"><div className="between"><div><b className="brand"><img src={S.footerLogo||S.logo} alt="" width="36" height="36"/>{S.footerBrand}</b><p className="muted">{S.footerDesc}</p>{S.footerText&&<p className="muted">{S.footerText}</p>}<p className="muted">WhatsApp: {S.phoneDisplay}</p></div>
  <div className="soc">{socials.map(s=><a key={s[0]} href={s[1]} target="_blank" rel="noopener noreferrer">{s[0]}</a>)}</div></div>
  <p className="muted">{S.copyright} · Founder {S.founder} · CEO {S.ceo} · Design {S.designer} {S.credits}</p></div></footer>
 {open&&<Detail p={open} S={S} onClose={()=>setOpen(null)}/>}
 {lb!==null&&<Lightbox imgs={gallery} i={lb} set={setLb}/>}
 </>}

function Detail({p,S,onClose}){
 const sz=sizes(p.availableSizes),imgs=[p.image,...(p.gallery||[])].filter(Boolean);
 const[img,setImg]=useState(imgs[0]),[size,setSize]=useState(sz[0]?.label||''),[fl,setFl]=useState((p.availableFlavours||[])[0]||''),[opts,setOpts]=useState([]),[qty,setQty]=useState(p.q0||1),[date,setDate]=useState(''),[time,setTime]=useState(''),[note,setNote]=useState(''),[err,setErr]=useState(''),[conf,setConf]=useState(false);
 useEsc(()=>conf?setConf(false):onClose());
 const unit=sz.find(s=>s.label===size)?.price??price(p),total=unit*qty;
 const order={cake:p.name,size:size||'-',flavour:fl||'-',options:opts.join(', ')||'-',qty,date:date&&fmtD(date),time:time&&fmtT(time),price:money(total),note:note||'-',image:abs(p.image),brand:S.brand};
 const review=()=>{if(!date||!time)return setErr('Please choose a delivery date and time.');
  if(date<today()||(date===today()&&time<new Date().toTimeString().slice(0,5)))return setErr('Please choose a date and time in the future.');setErr('');setConf(true)};
 const confirm=()=>{window.open(waUrl(S.whatsapp,fill(S.msgTemplate,order)),'_blank','noopener');setConf(false)};
 return <div className="ov" onClick={onClose}><div className="modal" role="dialog" aria-modal="true" aria-label={p.name} onClick={e=>e.stopPropagation()}>
  <button className="x" onClick={onClose} aria-label="Close">×</button>
  <div className="md"><div><img className="big" src={img} alt={p.name}/><div className="thumbs">{imgs.map(i=><button key={i} onClick={()=>setImg(i)}><img src={i} alt="" loading="lazy"/></button>)}</div></div>
  <div className="form"><h2>{p.name}</h2><Stars n={p.rating||0}/><p>{p.description}</p><p><b>{money(unit)}</b></p>
   {sz.length>0&&<label>Size<select value={size} onChange={e=>setSize(e.target.value)}>{sz.map(s=><option key={s.label} value={s.label}>{s.label}{s.price?` – ${money(s.price)}`:''}</option>)}</select></label>}
   {(p.availableFlavours||[]).length>0&&<label>Flavour<select value={fl} onChange={e=>setFl(e.target.value)}>{p.availableFlavours.map(f=><option key={f}>{f}</option>)}</select></label>}
   {(p.availableOptions||[]).length>0&&<fieldset><legend>Options</legend>{p.availableOptions.map(o=><label key={o} className="chk"><input type="checkbox" checked={opts.includes(o)} onChange={e=>setOpts(e.target.checked?[...opts,o]:opts.filter(x=>x!==o))}/>{o}</label>)}</fieldset>}
   <div className="row"><label>Quantity<input type="number" min="1" max="20" value={qty} onChange={e=>setQty(Math.max(1,Math.min(20,+e.target.value||1)))}/></label><label>Delivery date<input type="date" min={today()} value={date} onChange={e=>setDate(e.target.value)}/></label><label>Delivery time<input type="time" value={time} onChange={e=>setTime(e.target.value)}/></label></div>
   <label>Special note<textarea rows="2" value={note} onChange={e=>setNote(e.target.value)}/></label>
   <div className="sum"><b>Order summary</b><br/>{p.name} · {size} · {fl} · ×{qty}<br/>{date?fmtD(date):'Date: –'} · {time?fmtT(time):'Time: –'}<br/><b>{money(total)}</b></div>
   {err&&<p className="no" role="alert">{err}</p>}
   <button className="btn" disabled={!p.availability} onClick={review}>{S.orderBtn}</button></div></div>
  {conf&&<div className="ov in" onClick={()=>setConf(false)}><div className="modal pop" role="dialog" aria-modal="true" aria-label={S.popupTitle} onClick={e=>e.stopPropagation()}>
   <h2>{S.popupTitle}</h2><p className="muted">{S.popupDesc}</p>
   <dl>{[['Cake',order.cake],['Size',order.size],['Flavour',order.flavour],['Quantity',qty],['Delivery date',order.date],['Delivery time',order.time],['Price',order.price],['Special note',order.note]].map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
   <div className="row"><button className="btn" onClick={confirm}>{S.confirmBtn}</button><button className="btn ghost" onClick={()=>setConf(false)}>{S.closeBtn}</button></div></div></div>}
 </div></div>}

function Lightbox({imgs,i,set}){
 const n=imgs.length,prev=()=>set((i+n-1)%n),next=()=>set((i+1)%n);
 useEffect(()=>{const h=e=>{if(e.key==='Escape')set(null);if(e.key==='ArrowLeft')prev();if(e.key==='ArrowRight')next()};addEventListener('keydown',h);return()=>removeEventListener('keydown',h)});
 return <div className="ov lb" role="dialog" aria-modal="true" aria-label="Gallery" onClick={()=>set(null)}><button className="x" onClick={()=>set(null)} aria-label="Close">×</button>
  <button className="nv l" onClick={e=>{e.stopPropagation();prev()}} aria-label="Previous">‹</button><img src={imgs[i]} alt={`Gallery ${i+1}`} onClick={e=>e.stopPropagation()}/>
  <button className="nv r" onClick={e=>{e.stopPropagation();next()}} aria-label="Next">›</button></div>}
