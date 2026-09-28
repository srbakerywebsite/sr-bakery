import {useEffect,useState} from 'react';
import {onAuthStateChanged,signInWithEmailAndPassword,signOut} from 'firebase/auth';
import {doc,setDoc,addDoc,deleteDoc,collection} from 'firebase/firestore';
import {auth,db,ADMIN_DOMAIN,DEF,DEMO,useCol,useSettings} from './lib';
const up=f=>new Promise((res,rej)=>{const i=new Image();i.onload=()=>{const s=Math.min(1,900/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=i.width*s;c.height=i.height*s;c.getContext('2d').drawImage(i,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.72))};i.onerror=rej;i.src=URL.createObjectURL(f)}); // resized and saved inside Firestore (no Storage/Blaze plan needed)
const slug=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const G={
Brand:[['brand','Brand name'],['logo','Logo','img'],['favicon','Favicon','img'],['founder','Founder'],['ceo','CEO'],['designer','Designer'],['copyright','Copyright'],['rating','Rating (e.g. 4.4)'],['customers','Happy customers (e.g. 3000+)']],
Hero:[['heroTitle','Hero title'],['heroSubtitle','Hero subtitle'],['heroDesc','Hero description','area'],['heroImage','Hero image','img'],['heroImageMobile','Mobile hero image','img'],['cta1','Primary button text'],['cta1Action','Primary button action (#cakes or a URL)'],['cta2','Secondary button text'],['cta2Action','Secondary button action']],
'Site Content':[['notice','Top notice bar (leave empty to hide)'],['trustTitle','Highlight strip title (empty = hidden)'],['trustText','Highlight strip text'],['nav','Navigation labels (8, comma-separated)'],['aboutTitle','About title'],['aboutText','About text','area'],['whyTitle','Why choose us title'],['features','Features (one per line: Title|Description)','area'],['customTitle','Custom cake title'],['customText','Custom cake text','area'],['customBtn','Custom cake button'],['customMsg','Custom cake WhatsApp message','area'],['contactText','Contact text','area']],
'Social Links':[['facebook','Facebook URL'],['tiktok','TikTok URL'],['instagram','Instagram URL'],['youtube','YouTube URL'],['others','Other links (one per line: Label|URL)','area']],
'Contact & Orders':[['whatsapp','WhatsApp number (international, e.g. 8801636052869)'],['phoneDisplay','Displayed phone number'],['orderBtn','Order button text'],['popupTitle','Popup title'],['popupDesc','Popup description'],['confirmBtn','Confirm button text'],['closeBtn','Close button text'],['msgTemplate','WhatsApp message template ({brand} {cake} {size} {flavour} {options} {qty} {date} {time} {price} {image} {note})','area']],
SEO:[['seoTitle','Website title'],['seoDesc','Meta description','area'],['ogTitle','OG title'],['ogDesc','OG description','area'],['ogImage','OG image','img']],
Footer:[['footerText','Extra footer text','area'],['footerLogo','Footer logo','img'],['footerBrand','Footer brand name'],['footerDesc','Footer description','area'],['credits','Footer credits']]};
const PF=[['name','Name'],['shortDescription','Short description'],['description','Description','area'],['price','Price','num'],['discountPrice','Discount price','num'],['image','Main image','img'],['gallery','Gallery image URLs (comma-separated)','imgs'],['category','Category','cat'],['subcategory','Subcategory'],['availableSizes','Sizes: label=price, comma-separated (e.g. 1 Pound=850, 2 Pound=1600)','list'],['availableFlavours','Flavours (comma-separated)','list'],['availableOptions','Options (comma-separated)','list'],['rating','Rating (0-5)','num'],['tags','Tags (comma-separated)','list'],['availability','Available','bool'],['featured','Featured','bool'],['newProduct','New product','bool'],['hidden','Hidden from website','bool']];
const CF=[['name','Category name'],['image','Category image','img'],['hidden','Hidden','bool']];
const RF=[['name','Customer name'],['rating','Rating (1-5)','num'],['comment','Comment','area'],['date','Date (text)'],['image','Image','img'],['hidden','Hidden (unpublished)','bool']];

function Field({f,v,set,cats}){const[k,l,t]=f;const[busy,setBusy]=useState(false);
 const file=async e=>{const x=e.target.files[0];if(!x)return;setBusy(true);try{const u=await up(x);set(t==='imgs'?[...(v||[]),u]:u)}catch(er){alert('Upload failed: '+er.message)}setBusy(false)};
 if(t==='bool')return <label className="chk"><input type="checkbox" checked={!!v} onChange={e=>set(e.target.checked)}/>{l}</label>;
 if(t==='area')return <label>{l}<textarea rows="4" value={v||''} onChange={e=>set(e.target.value)}/></label>;
 if(t==='num')return <label>{l}<input type="number" step="any" value={v??''} onChange={e=>set(e.target.value===''?'':+e.target.value)}/></label>;
 if(t==='cat')return <label>{l}<select value={v||''} onChange={e=>set(e.target.value)}><option value="">—</option>{cats.map(c=><option key={c.id}>{c.name}</option>)}</select></label>;
 if(t==='list'||t==='imgs')return <label>{l}<input value={(v||[]).join(', ')} onChange={e=>set(e.target.value.split(',').map(s=>s.trim()).filter(Boolean))}/>{t==='imgs'&&<input type="file" accept="image/*" onChange={file}/>}{busy&&'Uploading…'}</label>;
 return <label>{l}<input value={v||''} onChange={e=>set(e.target.value)}/>{t==='img'&&<><input type="file" accept="image/*" onChange={file}/>{busy&&'Uploading…'}{v&&<img src={v} alt="" width="80"/>}</>}</label>}

function Settings({group}){const S=useSettings();const[v,setV]=useState(null);const[msg,setMsg]=useState('');
 useEffect(()=>setV(null),[group]);const cur=v||S;
 const save=async e=>{e.preventDefault();try{await setDoc(doc(db,'settings','site'),cur,{merge:true});setMsg('Saved.')}catch(er){setMsg('Save failed: '+er.message)}};
 return <form className="f" onSubmit={save}><h2>{group}</h2>{G[group].map(f=><Field key={f[0]} f={f} v={cur[f[0]]} set={x=>setV({...cur,[f[0]]:x})}/>)}<button className="btn">Save settings</button>{msg&&<p role="status">{msg}</p>}</form>}

function Crud({col,fields,title,seed}){const rows=useCol(col),cats=useCol('categories');const[ed,setEd]=useState(null),[del,setDel]=useState(null),[msg,setMsg]=useState('');
 const save=async e=>{e.preventDefault();const{id,...d}=ed;if(col==='products')d.slug=slug(d.name);try{id?await setDoc(doc(db,col,id),d):await addDoc(collection(db,col),d);setEd(null)}catch(er){setMsg(er.message)}};
 const patch=(r,p)=>setDoc(doc(db,col,r.id),p,{merge:true});
 const dup=r=>{const{id,...d}=r;return addDoc(collection(db,col),{...d,name:d.name+' (Copy)',hidden:true})};
 if(ed)return <form className="f" onSubmit={save}><h2>{ed.id?'Edit':'Add'} {title}</h2>{fields.map(f=><Field key={f[0]} f={f} v={ed[f[0]]} cats={cats} set={x=>setEd({...ed,[f[0]]:x})}/>)}<div className="row"><button className="btn">Save</button><button type="button" className="btn ghost" onClick={()=>setEd(null)}>Cancel</button></div>{msg&&<p role="alert">{msg}</p>}</form>;
 return <div><h2>{title}s</h2><div className="row"><button className="btn" onClick={()=>setEd({availability:true})}>Add {title}</button>{seed&&!rows.length&&<button className="btn ghost" onClick={()=>seed.forEach(({id,...d})=>setDoc(doc(db,col,id),d))}>Import demo {title.toLowerCase()}s</button>}</div><br/>
  {rows.map(r=><div className="rowi" key={r.id}><span>{r.image&&<img src={r.image} alt=""/>} {r.name} {r.hidden&&'(hidden)'}</span><span className="row"><button className="btn sm ghost" onClick={()=>setEd(r)}>Edit</button><button className="btn sm ghost" onClick={()=>patch(r,{hidden:!r.hidden})}>{r.hidden?'Show':'Hide'}</button>{col==='products'&&<button className="btn sm ghost" onClick={()=>dup(r)}>Duplicate</button>}<button className="btn sm" onClick={()=>setDel(r)}>Delete</button></span></div>)}
  {!rows.length&&<p>Nothing here yet.</p>}
  {del&&<div className="ov" onClick={()=>setDel(null)}><div className="modal pop" role="dialog" aria-modal="true" onClick={e=>e.stopPropagation()}><h2>Are you sure you want to delete this {title.toLowerCase()}?</h2><p>{del.name}</p><div className="row"><button className="btn" onClick={async()=>{await deleteDoc(doc(db,col,del.id));setDel(null)}}>Delete</button><button className="btn ghost" onClick={()=>setDel(null)}>Cancel</button></div></div></div>}</div>}

export default function Admin(){
 const[user,setUser]=useState(undefined),[u,setU]=useState(''),[p,setP]=useState(''),[err,setErr]=useState(''),[tab,setTab]=useState('Dashboard'),[side,setSide]=useState(false);
 const prods=useCol('products'),cats=useCol('categories'),revs=useCol('reviews');
 useEffect(()=>onAuthStateChanged(auth,setUser),[]);
 const login=async e=>{e.preventDefault();setErr('');try{await signInWithEmailAndPassword(auth,u.trim().toLowerCase()+ADMIN_DOMAIN,p)}catch{setErr('Invalid username or password.')}};
 if(user===undefined)return <p className="pad">Loading…</p>;
 if(!user)return <form className="f login" onSubmit={login}><h1>Admin login</h1><label>Username<input value={u} onChange={e=>setU(e.target.value)} autoComplete="username" required/></label><label>Password<input type="password" value={p} onChange={e=>setP(e.target.value)} autoComplete="current-password" required/></label>{err&&<p className="no" role="alert">{err}</p>}<button className="btn">Log in</button></form>;
 const tabs=['Dashboard','Products','Categories','Reviews',...Object.keys(G),'Logout'];
 const pick=t=>{setSide(false);t==='Logout'?signOut(auth):setTab(t)};
 return <div className="adm"><div className="tbar"><b>SR.Bakery Admin</b><button onClick={()=>setSide(!side)} aria-label="Menu">☰</button></div>
  <aside className={'side'+(side?' open':'')}>{tabs.map(t=><button key={t} className={t===tab?'on':''} onClick={()=>pick(t)}>{t}</button>)}</aside>
  <div className="main">{tab==='Dashboard'?<div><h2>Dashboard</h2><p>{prods.length} products · {cats.length} categories · {revs.length} reviews</p><p><a href="/" target="_blank">View website</a> · Signed in as {user.email}</p></div>
   :tab==='Products'?<Crud col="products" fields={PF} title="Product" seed={DEMO}/>:tab==='Categories'?<Crud col="categories" fields={CF} title="Category"/>:tab==='Reviews'?<Crud col="reviews" fields={RF} title="Review"/>:<Settings group={tab}/>}</div></div>}
