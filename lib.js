import {initializeApp} from 'firebase/app';
import {getFirestore,doc,collection,onSnapshot} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import {getStorage} from 'firebase/storage';
import {useEffect,useState} from 'react';
import logo from './logo.jpg';import cake1 from './cake1.jpg';import cake2 from './cake2.jpg';import cake3 from './cake3.jpg';
const e=import.meta.env;
const app=initializeApp({apiKey:e.VITE_FIREBASE_API_KEY,authDomain:e.VITE_FIREBASE_AUTH_DOMAIN,projectId:e.VITE_FIREBASE_PROJECT_ID,storageBucket:e.VITE_FIREBASE_STORAGE_BUCKET,messagingSenderId:e.VITE_FIREBASE_MESSAGING_SENDER_ID,appId:e.VITE_FIREBASE_APP_ID});
export const db=getFirestore(app),auth=getAuth(app),st=getStorage(app);
export const ADMIN_DOMAIN='@srbakery.app'; // username "Oishe_admin" -> oishe_admin@srbakery.app (account created in Firebase Console)

// Central editable content. Firestore doc settings/site overrides these defaults.
export const DEF={
brand:'SR.Bakery',logo:logo,favicon:logo,footerLogo:'',footerBrand:'SR.Bakery',
founder:'Oishe Rahman',ceo:'Tanvir Hasan',designer:'Tanjim Hasan',copyright:'© SR.Bakery. All Rights Reserved.',credits:'',
whatsapp:'8801636052869',phoneDisplay:'01636052869',facebook:'',tiktok:'',instagram:'',youtube:'',others:'',
nav:'Home,Cakes,Categories,About,Why SR.Bakery,Reviews,Gallery,Contact',
heroTitle:'Made With Love, Baked For Your Moments.',heroSubtitle:'Freshly crafted cakes made to make every celebration sweeter.',heroDesc:'Handcrafted in small batches, finished by hand.',
heroImage:cake1,heroImageMobile:'',cta1:'Order Your Cake',cta1Action:'#cakes',cta2:'Explore Cakes',cta2Action:'#cakes',
rating:'4.4',customers:'3000+',
aboutTitle:'Our story',aboutText:'SR.Bakery focuses on freshly prepared cakes, quality ingredients, beautiful presentation and memorable celebrations.',
whyTitle:'Why SR.Bakery',features:'Freshly Baked|Every cake is prepared fresh for your day.\nQuality Ingredients|Carefully chosen, never compromised.\nCustom Designs|Your idea, shaped in cream and colour.\nMade For Your Moments|Birthdays, anniversaries and everything between.\nEasy WhatsApp Ordering|Pick, preview and send your order in a minute.',
customTitle:'Have Something Special In Mind?',customText:'Tell us your idea and let SR.Bakery create a cake made especially for your celebration.',customBtn:'Discuss Your Cake',
customMsg:'Hello SR.Bakery!\nI would like to discuss a custom cake.',
contactText:'Message us on WhatsApp to order or ask anything.',footerDesc:'Premium cakes made fresh for your celebrations.',
orderBtn:'Order on WhatsApp',popupTitle:'Confirm Your Order',popupDesc:'Please review your order before we open WhatsApp.',confirmBtn:'Confirm & Continue',closeBtn:'Close',
msgTemplate:'Hello {brand}! 🍰\n\nI would like to place an order.\n\nCake: {cake}\nSize: {size}\nFlavour: {flavour}\nOptions: {options}\nQuantity: {qty}\nPreferred Date: {date}\nPreferred Time: {time}\nPrice: {price}\nImage: {image}\n\nSpecial Note:\n{note}\n\nPlease confirm my order.',
seoTitle:'SR.Bakery | Premium Cakes Made For Your Moments',seoDesc:'Discover beautifully crafted cakes from SR.Bakery. Explore our collection and order your favourite cake easily through WhatsApp.',ogTitle:'',ogDesc:'',ogImage:''};
const P=(id,name,image,category,price,extra={})=>({id,name,image,category,price,shortDescription:'Handmade with fresh cream and a personal message.',description:'A small celebration cake, decorated by hand and made to order.',gallery:[],availableSizes:['4 inch','6 inch'],availableFlavours:['Vanilla','Chocolate','Red Velvet'],availableOptions:['Message on cake'],rating:4.5,availability:true,tags:[],...extra});
export const DEMO=[P('demo1','Love You Bento Cake',cake1,'Heart Shape Cakes',850,{featured:true}),P('demo2','Vintage Pink Cake',cake2,'Birthday Cakes',950,{newProduct:true}),P('demo3','Ribbon Bento Cake',cake3,'Custom Cakes',900,{featured:true})];
export const DEMO_CATS=['Birthday Cakes','Heart Shape Cakes','Custom Cakes','Cupcakes','Desserts'].map(n=>({id:n,name:n}));
export const useCol=(name,fallback=[])=>{const[v,s]=useState(fallback);useEffect(()=>onSnapshot(collection(db,name),q=>s(q.empty?fallback:q.docs.map(d=>({id:d.id,...d.data()}))),()=>{}),[name]);return v};
export const useSettings=()=>{const[v,s]=useState(DEF);useEffect(()=>onSnapshot(doc(db,'settings','site'),d=>s({...DEF,...(d.data()||{})}),()=>{}),[]);return v};
