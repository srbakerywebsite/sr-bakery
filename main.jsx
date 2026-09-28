import {createRoot} from 'react-dom/client';
import {lazy,Suspense} from 'react';
import Site from './Site';
import './styles.css';
const Admin=lazy(()=>import('./Admin'));
const isAdmin=location.pathname.replace(/\/$/,'')==='/admin';
createRoot(document.getElementById('root')).render(isAdmin?<Suspense fallback={<p className="pad">Loading…</p>}><Admin/></Suspense>:<Site/>);
