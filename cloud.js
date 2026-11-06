/* BRAINSTORM VAULT V1.0 - nube privada. Solo publishable key; RLS controla el acceso. */
const CLOUD_URL='https://rghfzazfgbbjamhnucin.supabase.co';
const CLOUD_PUBLIC_KEY='sb_publishable_MfypsdmwtpJlKyt_2qS_2A_soI2A7E1';
const cloud={client:null,user:null,loading:false,localSynced:new Set(),remote:[],busy:false};
const cloudMsg=e=>String(e?.message||e||'Error desconocido');
const cloudTracks=()=>S.tracks.filter(t=>t.cloud);
const cloudLocal=()=>S.tracks.filter(t=>!t.cloud&&!t.demo);
function cloudStatus(msg){const el=document.getElementById('cloudLoginStatus');if(el)el.textContent=msg;}
function cloudGate(message='Inicia sesión para sincronizar tu música.'){
 const root=document.getElementById('cloudauthroot');if(!root)return;
 root.innerHTML=`<div class="cloud-auth-backdrop"><div class="cloud-login"><div class="brandmark" style="height:48px;width:48px">B</div><h1>Brainstorm Vault</h1><p>Tu archivo musical privado, ahora disponible en todos tus dispositivos.</p><form onsubmit="cloudSignIn(event)"><label class="field">Correo electrónico<input name="email" type="email" autocomplete="username" required placeholder="tu@correo.com"></label><label class="field">Contraseña<input name="password" type="password" autocomplete="current-password" required></label><button class="action" type="submit">Entrar a mi biblioteca</button><div class="cloud-status" id="cloudLoginStatus" role="status">${esc(message)}</div></form><p style="font-size:11px">Solo cuentas creadas previamente en Supabase. Tus canciones permanecen privadas.</p></div></div>`;
}
function cloudUnlock(){const root=document.getElementById('cloudauthroot');if(root)root.innerHTML='';}
function cloudSyncedKey(){return 'bv10-synced-'+(cloud.user?.id||'none')}
function cloudRememberLocal(id){cloud.localSynced.add(id);localStorage.setItem(cloudSyncedKey(),JSON.stringify([...cloud.localSynced]))}
function cloudMapping(row,cover){return {id:row.id,name:row.title,artist:row.artist||'Brainstorm',type:row.track_type||'Demo',bpm:row.bpm!=null?`${row.bpm} BPM`:'',key:row.musical_key||'',length:row.duration_seconds||0,cover:cover||'assets/placeholder.svg',liked:!!row.is_favorite,date:(row.created_at||'').slice(0,10),cloud:true,audioPath:row.audio_path,coverPath:row.cover_path||null};}
async function cloudBoot(){
 if(!window.supabase?.createClient){cloudGate('No se pudo cargar el cliente Supabase. Comprueba Internet y vuelve a abrir la página.');return;}
 try{
  cloud.client=window.supabase.createClient(CLOUD_URL,CLOUD_PUBLIC_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
  cloudGate('Comprobando acceso seguro…');
  cloud.client.auth.onAuthStateChange((event,session)=>{
   if(event==='SIGNED_OUT'){cloud.user=null;cloud.remote=[];S.tracks=S.tracks.filter(t=>!t.cloud);audio.pause();audio.removeAttribute('src');S.current=null;S.playing=false;render();cloudGate();return;}
   if((event==='SIGNED_IN'||event==='INITIAL_SESSION')&&session?.user&&(!cloud.user||cloud.user.id!==session.user.id)){
    setTimeout(()=>cloudEnter(session.user),0);
   }
  });
  const {data,error}=await cloud.client.auth.getSession();
  if(error)throw error;
  if(data.session?.user)await cloudEnter(data.session.user); else cloudGate('Ingresa con el usuario que creaste en Supabase.');
 }catch(e){cloudGate('No se pudo conectar: '+cloudMsg(e));}
}
async function cloudSignIn(e){
 e.preventDefault();if(!cloud.client){cloudStatus('No se cargó Supabase; revisa tu conexión.');return;}
 const form=e.currentTarget,button=form.querySelector('button[type=submit]');button.disabled=true;cloudStatus('Verificando cuenta…');
 try{const {data,error}=await cloud.client.auth.signInWithPassword({email:form.elements.email.value.trim(),password:form.elements.password.value});if(error)throw error;await cloudEnter(data.user);}
 catch(err){cloudStatus('No se pudo iniciar sesión. Revisa correo, contraseña y configuración de Auth. '+cloudMsg(err));}
 finally{button.disabled=false;}
}
async function cloudEnter(user){
 if(!user)return;cloud.user=user;cloud.localSynced=new Set(JSON.parse(localStorage.getItem(cloudSyncedKey())||'[]'));
 cloudUnlock();await cloudRefresh();
}
async function cloudRefresh(){
 if(!cloud.client||!cloud.user)return;
 cloud.loading=true;
 try{
  const {data,error}=await cloud.client.from('tracks').select('*').order('created_at',{ascending:true});if(error)throw error;
  const rows=await Promise.all((data||[]).map(async row=>{
   let cover=null;
   if(row.cover_path){const result=await cloud.client.storage.from('music').createSignedUrl(row.cover_path,3600);cover=result.data?.signedUrl||null;}
   return cloudMapping(row,cover);
  }));
  cloud.remote=rows;
  S.tracks=[...cloudLocal().filter(t=>!cloud.localSynced.has(t.id)),...rows];
  // Tras cerrar sesión y volver a entrar, no se mezclan metadatos de otras cuentas.
  render();
 }catch(e){toast('Error al cargar la biblioteca en la nube: '+cloudMsg(e));}
 finally{cloud.loading=false;}
}
async function cloudSignOut(){if(cloud.client){await cloud.client.auth.signOut();cloud.user=null;cloudGate();}}
const oldSettingsView=otherView;
otherView=function(){
 if(S.view!=='Ajustes')return oldSettingsView();
 const local=cloudLocal().filter(t=>!cloud.localSynced.has(t.id));
 return `<div class="viewhead"><div><h1>Ajustes</h1><p>Biblioteca privada sincronizada con Supabase.</p></div></div><div class="settingsrow"><div><strong>Cuenta de la nube</strong><p>${esc(cloud.user?.email||'Sin sesión')}</p></div><div class="cloud-actions"><span class="cloud-chip">${cloud.user?'Conectado':'Desconectado'}</span><button class="action secondary" onclick="cloudSignOut()">Cerrar sesión</button></div></div><div class="settingsrow"><div><strong>Sincronizar canciones locales</strong><p>${local.length} canción${local.length===1?'':'es'} guardada${local.length===1?'':'s'} en este navegador, pendiente${local.length===1?'':'s'} de subir.</p><p>Se subirán audios y portadas al bucket privado, sin borrar los archivos de este equipo.</p></div><button class="action" onclick="cloudMigrateAll()" ${!local.length?'disabled':''}>Sincronizar ahora</button></div><div class="settingsrow"><div><strong>Actualizar biblioteca</strong><p>Recarga las canciones sincronizadas desde Supabase.</p></div><button class="action secondary" onclick="cloudRefresh()">Actualizar</button></div><div class="settingsrow"><div><strong>Exportar catálogo local</strong><p>Exporta metadatos, no los archivos de audio.</p></div><button class="action secondary" onclick="exportCatalogue()">Exportar</button></div>`;
};
const originalUploadForm=openUpload;
openUpload=function(){if(!cloud.user){cloudGate();return;}originalUploadForm();const note=document.querySelector('.modal .hint');if(note)note.textContent='Importa música a tu biblioteca privada en Supabase. Límite actual: 50 MB por archivo.';}
async function cloudPutAudio(file,path){const {error}=await cloud.client.storage.from('music').upload(path,file,{contentType:file.type||'application/octet-stream',cacheControl:'3600',upsert:false});if(error)throw error;}
function cloudFileExtension(file){return (file.name.split('.').pop()||'bin').toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,8)||'bin'}
async function cloudUploadTrack(track,file,coverfile){
 if(!cloud.user)throw Error('Inicia sesión primero.');
 if(!file)throw Error('Archivo de audio no disponible.');
 if(file.size>50*1024*1024)throw Error('Este archivo supera 50 MB, el límite actual de tu bucket.');
 const id=crypto.randomUUID(),uid=cloud.user.id,paths=[];
 const audioPath=`${uid}/audio/${id}.${cloudFileExtension(file)}`;
 try{
  await cloudPutAudio(file,audioPath);paths.push(audioPath);
  let coverPath=null;
  if(coverfile){if(coverfile.size>8*1024*1024)throw Error('La portada supera 8 MB.');coverPath=`${uid}/covers/${id}.${cloudFileExtension(coverfile)}`;await cloudPutAudio(coverfile,coverPath);paths.push(coverPath);}
  const payload={id,user_id:uid,title:track.name,artist:track.artist||'Brainstorm',track_type:track.type||'Demo',bpm:Number.parseFloat(track.bpm)||null,musical_key:track.key||null,duration_seconds:track.length||null,audio_path:audioPath,cover_path:coverPath,is_favorite:!!track.liked};
  const {error}=await cloud.client.from('tracks').insert(payload);if(error)throw error;
  return id;
 }catch(e){if(paths.length)await cloud.client.storage.from('music').remove(paths).catch(()=>{});throw e;}
}
submitUpload=async function(e){
 e.preventDefault();if(!cloud.user){cloudGate();return;}
 const form=e.target,f=field(form,'audiofile').files[0];if(!f)return;
 const button=form.querySelector('[type=submit]');button.disabled=true;button.textContent='Subiendo a nube…';
 try{
  if(window._uploadAnalysisPromise)await window._uploadAnalysisPromise;
  const coverFile=field(form,'coverfile').files[0],length=await getDuration(f);
  const track={name:field(form,'name').value.trim()||f.name.replace(/\.[^.]+$/,''),artist:field(form,'artist').value||'Brainstorm',type:field(form,'type').value,bpm:field(form,'bpm').value,key:field(form,'key').value,length,liked:false};
  await cloudUploadTrack(track,f,coverFile);closeModal();await cloudRefresh();toast('Canción sincronizada. Ya puedes abrirla en tu iPhone.');
 }catch(err){toast('No se pudo subir: '+cloudMsg(err));button.disabled=false;button.textContent='Reintentar subida';}
};
async function cloudMigrateAll(){
 if(!cloud.user||cloud.busy)return;cloud.busy=true;
 const local=cloudLocal().filter(t=>!cloud.localSynced.has(t.id));
 if(!local.length){cloud.busy=false;toast('No hay canciones locales pendientes.');return;}
 if(!confirm(`¿Sincronizar ${local.length} canción(es) locales en Supabase? No se borrarán los archivos del navegador.`)){cloud.busy=false;return;}
 let done=0,failed=[];
 for(const t of local){
  toast(`Subiendo ${done+1} de ${local.length}: ${t.name}`);
  try{
   const record=await dbGet(t.id);if(!record?.file)throw Error('Audio local no encontrado');
   let coverfile=null;
   if(t.cover?.startsWith('data:image/')){const response=await fetch(t.cover);const blob=await response.blob();coverfile=new File([blob],'cover.png',{type:blob.type||'image/png'});}
   await cloudUploadTrack(t,record.file,coverfile);cloudRememberLocal(t.id);done++;
  }catch(e){failed.push(`${t.name}: ${cloudMsg(e)}`);}
 }
 cloud.busy=false;await cloudRefresh();
 if(failed.length){toast(`${done} sincronizadas; ${failed.length} fallaron. Revisa límite de 50 MB.`);console.warn('Migración parcial:',failed);}
 else toast(`${done} canciones sincronizadas. Ya aparecen en tu iPhone.`);
}
const localPlayTrack=playTrack;
playTrack=async function(id){
 const t=S.tracks.find(t=>t.id===id);if(!t)return;
 if(!t.cloud)return localPlayTrack(id);
 if(S.current===id){togglePlay();return;}
 try{
  const {data,error}=await cloud.client.storage.from('music').createSignedUrl(t.audioPath,3600);if(error||!data?.signedUrl)throw error||Error('No se pudo generar acceso temporal');
  audio.pause();if(S.objecturl){URL.revokeObjectURL(S.objecturl);S.objecturl=null;}
  audio.src=data.signedUrl;S.current=id;audio.load();
  try{await audio.play();S.playing=true;}catch(e){S.playing=false;toast('Pulsa reproducir de nuevo para iniciar audio en este dispositivo.');}
  render();cloudMediaSession(t);
 }catch(e){toast('Error al reproducir desde la nube: '+cloudMsg(e));}
};
function cloudMediaSession(t){
 if(!('mediaSession' in navigator))return;
 try{navigator.mediaSession.metadata=new MediaMetadata({title:t.name,artist:t.artist||'Brainstorm',album:'Brainstorm Vault',artwork:t.cover?.startsWith('https:')?[{src:t.cover}]:[]});
  navigator.mediaSession.setActionHandler('play',()=>togglePlay());navigator.mediaSession.setActionHandler('pause',()=>togglePlay());
  navigator.mediaSession.setActionHandler('previoustrack',()=>previousTrack());navigator.mediaSession.setActionHandler('nexttrack',()=>nextTrack());
  navigator.mediaSession.setActionHandler('seekto',details=>{if(details.seekTime!=null)audio.currentTime=details.seekTime;});
 }catch(e){console.warn('Media Session no disponible:',e)}
}
const localLike=toggleLike;
toggleLike=async function(id){
 const t=S.tracks.find(t=>t.id===id);if(!t)return;
 if(!t.cloud)return localLike(id);
 const desired=!t.liked;t.liked=desired;render();
 const {error}=await cloud.client.from('tracks').update({is_favorite:desired}).eq('id',id);
 if(error){t.liked=!desired;render();toast('No se pudo guardar el favorito.');}
};
const localDelete=deleteTrack;
deleteTrack=async function(id){
 const t=S.tracks.find(t=>t.id===id);if(!t)return;
 if(!t.cloud)return localDelete(id);
 if(!confirm('¿Eliminar esta canción de la nube en todos tus dispositivos?'))return;
 // Primero se elimina el registro, después los archivos. Una falla en Storage puede dejar
 // objetos huérfanos; mostramos un aviso y nunca afirmamos eliminación total en ese caso.
 const {error}=await cloud.client.from('tracks').delete().eq('id',id);if(error){toast('No se pudo eliminar: '+cloudMsg(error));return;}
 const paths=[t.audioPath,t.coverPath].filter(Boolean);
 const result=await cloud.client.storage.from('music').remove(paths);
 if(S.current===id){audio.pause();audio.removeAttribute('src');S.current=null;S.playing=false;}
 closeModal();await cloudRefresh();toast(result.error?'Se eliminó del catálogo; revisa archivos huérfanos en Storage.':'Canción eliminada de la nube.');
};
const localSaveTrack=saveTrack;
saveTrack=async function(e,id){
 const t=S.tracks.find(t=>t.id===id);if(!t||!t.cloud)return localSaveTrack(e,id);
 e.preventDefault();const f=e.target;
 const patch={title:field(f,'name').value,artist:field(f,'artist').value||'Brainstorm',track_type:field(f,'type').value,bpm:parseFloat(field(f,'bpm').value)||null,musical_key:field(f,'key').value||null};
 try{
  if(field(f,'cover').files[0]){
   const file=field(f,'cover').files[0],coverPath=`${cloud.user.id}/covers/${crypto.randomUUID()}.${cloudFileExtension(file)}`;
   await cloudPutAudio(file,coverPath);patch.cover_path=coverPath;
  }
  const {error}=await cloud.client.from('tracks').update(patch).eq('id',id);if(error)throw error;
  closeModal();await cloudRefresh();toast('Metadatos sincronizados.');
 }catch(err){toast('No se pudo guardar: '+cloudMsg(err));}
};
const localAnalyze=reanalyzeTrack;
reanalyzeTrack=async function(id){
 const t=S.tracks.find(t=>t.id===id);if(!t||!t.cloud)return localAnalyze(id);
 closeModal();toast('Analizando canción de la nube…');
 try{
  const {data,error}=await cloud.client.storage.from('music').download(t.audioPath);if(error)throw error;
  const file=new File([data],t.name+'.mp3',{type:data.type||'audio/mpeg'});
  const result=await analyzeAudioFile(file);
  const patch={bpm:result.bpm||null,musical_key:result.key||null};
  const updated=await cloud.client.from('tracks').update(patch).eq('id',id);if(updated.error)throw updated.error;
  await cloudRefresh();openTrack(id);toast('Análisis actualizado.');
 }catch(err){toast('Análisis no disponible: '+cloudMsg(err));}
};
const localGetRowWave=getRowWave;
getRowWave=async function(id){
 const t=S.tracks.find(t=>t.id===id);
 if(!t?.cloud)return localGetRowWave(id);
 if(rowWaveCache.has(id))return rowWaveCache.get(id);
 const {data,error}=await cloud.client.storage.from('music').download(t.audioPath);if(error)throw error;
 const ctx=new (window.AudioContext||window.webkitAudioContext)();
 try{
  const decoded=await ctx.decodeAudioData(await data.arrayBuffer()),channel=decoded.getChannelData(0),N=96,arr=[];
  for(let i=0;i<N;i++){
   const start=Math.floor(i*channel.length/N),end=Math.floor((i+1)*channel.length/N),stride=Math.max(1,Math.floor((end-start)/650));
   let peak=0,rms=0,n=0;for(let j=start;j<end;j+=stride){const v=Math.abs(channel[j]);peak=Math.max(peak,v);rms+=v*v;n++;}
   arr.push(.8*Math.sqrt(rms/Math.max(n,1))+.2*peak);
  }
  const sorted=[...arr].sort((a,b)=>a-b),low=sorted[8]||0,high=sorted[90]||1;
  const output=arr.map(v=>.16+.84*Math.pow(Math.max(0,Math.min(1,(v-low)/Math.max(.0001,high-low))),.72));
  rowWaveCache.set(id,output);return output;
 }finally{await ctx.close().catch(()=>{})}
};
// FLOW expandido: descarga temporal privada solo cuando se abre, sin publicar el audio.
const localLoadFlowWave=loadFlowWave;
loadFlowWave=async function(id){
 const t=S.tracks.find(t=>t.id===id);if(!t?.cloud)return localLoadFlowWave(id);
 const serial=++flowState.serial;flowState.loading=true;flowState.song=null;flowState.peaks=[];
 const status=document.getElementById('flowWaveStatus');if(status)status.textContent='Analizando forma de onda…';
 try{
  const {data,error}=await cloud.client.storage.from('music').download(t.audioPath);if(error)throw error;
  if(data.size>50*1024*1024)throw Error('Archivo demasiado grande');
  const ctx=new (window.AudioContext||window.webkitAudioContext)();let decoded;
  try{decoded=await ctx.decodeAudioData(await data.arrayBuffer());}finally{await ctx.close().catch(()=>{})}
  if(serial!==flowState.serial)return;
  const n=260,ch=decoded.getChannelData(0),peaks=new Float32Array(n),stride=Math.max(1,Math.floor(ch.length/n));
  for(let i=0;i<n;i++){const a=i*stride,b=Math.min(ch.length,a+stride),hop=Math.max(1,Math.floor((b-a)/700));let max=0;for(let j=a;j<b;j+=hop)max=Math.max(max,Math.abs(ch[j]));peaks[i]=max;}
  const max=Math.max(...peaks,.001);flowState.peaks=Array.from(peaks,v=>Math.max(.035,Math.sqrt(v/max)));
  flowState.song=id;flowState.loading=false;drawFlowWave();
  const el=document.getElementById('flowWaveStatus');if(el)el.textContent='Interactiva · pulsa para navegar';
 }catch(err){if(serial!==flowState.serial)return;flowState.loading=false;const el=document.getElementById('flowWaveStatus');if(el)el.textContent='No se pudo cargar la onda';drawFlowWave();}
};
// A/B Studio también permite alternar con un archivo en la nube.
switchAB=async function(side){
 const id=flowState[side]||(side==='a'?S.current:'');if(!id)return toast('Elige una canción');
 if(side==='b'&&id===flowState.a)return toast('Elige dos canciones diferentes');
 if(id===S.current){flowState.active=side;refreshFlow();return;}
 const previous=audio.currentTime||0,wasPlaying=!audio.paused;
 await playTrack(id);
 if(S.current===id){const setTime=()=>{audio.currentTime=Math.max(0,Math.min(previous,Math.max(0,(audio.duration||0)-.05)));if(!wasPlaying){audio.pause();S.playing=false;}updatePlayer();};
  if(audio.readyState>=1)setTime();else audio.addEventListener('loadedmetadata',setTime,{once:true});
  flowState.active=side;refreshFlow();}
};
// Inicio: la sesión se mantiene al recargar y no se pide la contraseña en cada visita.
cloudBoot();
