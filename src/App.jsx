import { useEffect, useMemo, useState } from 'react';
import { Moon, Sun, Volume2, VolumeX, Plus, X, Star, SlidersHorizontal, ShoppingBag, MapPin } from 'lucide-react';
import { ITEMS, SECS } from './data.js';

const LAT = 22.3282798, LON = -97.874498; // Degas Cafe Restaurant

const BANNERS = {
  d: [
    'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80'
  ],
  c: [
    'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1481070414801-51fd732d7184?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80'
  ],
  t: [
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=800&q=80'
  ],
  n: [
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=800&q=80'
  ]
};

const PRE = [['☀️ Calor', 34, 'clear'], ['⛅ Templado', 24, 'cloud'], ['🌧️ Lluvia', 21, 'rain'], ['❄️ Frío', 14, 'cloud']];
const periodOf = h => h >= 6 && h < 11 ? 'd' : h >= 11 && h < 16 ? 'c' : h >= 16 && h < 20 ? 't' : 'n';
const MSG = { d: 'Buenos días', c: 'Hora de comer', t: '¿Antojo para empezar el día?', n: 'Noche de terraza' };
const condOf = c => c >= 95 ? 'storm' : (c >= 51 && c <= 67) || (c >= 80 && c <= 82) ? 'rain' : c >= 2 ? 'cloud' : 'clear';
const WX = { clear: 'Despejado', cloud: 'Nublado', rain: 'Lluvia', storm: 'Tormenta' };

function useWeather() {
  const [w, setW] = useState({ temp: null, cond: 'clear' });
  useEffect(() => {
    let off = false;
    const go = () => fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code&timezone=auto`)
      .then(r => r.json()).then(j => !off && setW({ temp: Math.round(j.current.temperature_2m), cond: condOf(j.current.weather_code) })).catch(() => {});
    go();
    const id = setInterval(go, 15 * 60e3);
    return () => { off = true; clearInterval(id); };
  }, []);
  return w;
}

function useHour() {
  const [h, setH] = useState(new Date().getHours());
  useEffect(() => {
    const id = setInterval(() => setH(new Date().getHours()), 60e3);
    return () => clearInterval(id);
  }, []);
  return h;
}

function useAmbient(on, night) {
  useEffect(() => {
    if (!on) return;
    const ctx = new AudioContext(), len = ctx.sampleRate * 4, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; }
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = night ? 380 : 900;
    const g = ctx.createGain(); g.gain.value = 0.07;
    src.connect(f).connect(g).connect(ctx.destination); src.start();
    return () => ctx.close();
  }, [on, night]);
}

export default function App() {
  const h0 = useHour(), w0 = useWeather(), [sim, setSim] = useState(null), [showSim, setShowSim] = useState(false);
  const h = sim ? sim.h : h0, w = sim ? { temp: sim.temp, cond: sim.cond } : w0, p = periodOf(h);
  const [mode, setMode] = useState(null), [sound, setSound] = useState(false);
  const night = (mode ?? (h >= 18 || h < 7 ? 'night' : 'lounge')) === 'night';
  const [sec, setSec] = useState('rec'), [sz, setSz] = useState({}), [cart, setCart] = useState({}), [sheet, setSheet] = useState(false), [done, setDone] = useState(null);
  const [highDemand, setHighDemand] = useState(false);
  const [pendingAlcohol, setPendingAlcohol] = useState(null), [alcoholSeconds, setAlcoholSeconds] = useState(50), [alcoholNotice, setAlcoholNotice] = useState('');

  useEffect(() => { document.documentElement.dataset.theme = night ? 'night' : 'lounge'; }, [night]);
  useAmbient(sound, night);

  const rainy = w.cond === 'rain' || w.cond === 'storm';
  const hot = w.temp != null && w.temp >= 29 && !rainy, cold = (w.temp != null && w.temp <= 25) || rainy;
  const score = i => (i.per.includes(p) ? 2 : 0) + (hot ? (i.t === 'f' ? 4 : i.t === 'a' ? 1 : 0) : cold ? (i.t === 'h' ? 4 : i.t === 'a' ? 1 : 0) : 1);
  const best = i => (hot && i.t === 'f') || (cold && i.t === 'h');
  const rec = useMemo(() => {
    const c = {};
    return [...ITEMS].filter(i => i.per.includes(p) && !/Leche|Shot/.test(i.n)).sort((a, b) => score(b) - score(a) || a.id - b.id)
      .filter(i => (c[i.sec] = (c[i.sec] || 0) + 1) <= 2).slice(0, 8);
  }, [p, hot, cold]);

  const quickRec = useMemo(() => {
    const limits = { espressos: 2, calientes: 1, croissants: 2, refrescos: 2, galletas: 1 };
    const selected = [];
    [...ITEMS]
      .filter(i => i.per.includes(p) && Object.hasOwn(limits, i.sec))
      .sort((a, b) => score(b) - score(a) || a.id - b.id)
      .forEach(item => {
        if (selected.filter(i => i.sec === item.sec).length < limits[item.sec]) selected.push(item);
      });
    return selected;
  }, [p, hot, cold]);

  useEffect(() => {
    if (!pendingAlcohol) return undefined;
    const updateCountdown = () => {
      const remaining = Math.max(0, Math.ceil((pendingAlcohol.deadline - Date.now()) / 1000));
      setAlcoholSeconds(remaining);
      if (remaining === 0) {
        setCart(current => {
          const next = { ...current };
          delete next[pendingAlcohol.key];
          return next;
        });
        setAlcoholNotice(`${pendingAlcohol.name} se eliminó del pedido porque no se mostró la INE a tiempo.`);
        setPendingAlcohol(null);
      }
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 250);
    return () => clearInterval(timer);
  }, [pendingAlcohol]);

  useEffect(() => {
    if (!alcoholNotice) return undefined;
    const timer = setTimeout(() => setAlcoholNotice(''), 6000);
    return () => clearTimeout(timer);
  }, [alcoholNotice]);

  const cur = SECS.find(x => x.id === sec);
  const list = sec === 'rec' ? rec : ITEMS.filter(i => i.sec === sec).sort((a, b) => score(b) - score(a));
  const pr = k => { const [id, z] = k.split(':'), it = ITEMS[id]; return it.p[z] ?? it.p[0]; };
  const count = Object.values(cart).reduce((a, b) => a + b, 0), total = Object.entries(cart).reduce((t, [k, q]) => t + pr(k) * q, 0);
  const add = (k, d = 1) => {
    const item = ITEMS[Number(k.split(':')[0])];
    if (d > 0 && item?.sec === 'cerveza') {
      setCart(current => ({ ...current, [k]: (current[k] || 0) + d }));
      setAlcoholNotice('');
      setPendingAlcohol({ key: k, name: item.n, deadline: Date.now() + 50000 });
      return;
    }
    setCart(current => { const q = (current[k] || 0) + d, next = { ...current }; q > 0 ? next[k] = q : delete next[k]; return next; });
  };
  const resolveAlcohol = valid => {
    if (!pendingAlcohol) return;
    if (!valid) {
      setCart(current => {
        const next = { ...current };
        delete next[pendingAlcohol.key];
        return next;
      });
      setAlcoholNotice(`${pendingAlcohol.name} se eliminó del pedido porque la INE no fue válida.`);
    }
    setPendingAlcohol(null);
  };

  const order = (
    <>
      <h2 className="menu-serif text-lg text-green">Tu orden ({count})</h2>
      <div className="flex-1 overflow-auto my-2 text-sm">
        {count === 0 && <p className="text-muted">Toca + en un producto para agregar.</p>}
        {Object.entries(cart).map(([k, q]) => {
          const it = ITEMS[k.split(':')[0]], z = +k.split(':')[1];
          return (
            <div key={k} className="flex items-center gap-2 py-1.5 border-b border-ink/10">
              <span className="flex-1 leading-tight">{q} {it.n}{it.p.length > 1 && ` ${z ? '16' : '12'}oz`}</span><b>${pr(k) * q}</b>
              <button onClick={() => add(k, -1)} aria-label={`Quitar ${it.n}`} className="rounded-full bg-neon text-white p-0.5"><X size={14} /></button>
            </div>
          );
        })}
      </div>
      <p className="menu-serif text-xl">Consumo: <span className="text-gold">${total}</span> <small className="font-body font-normal text-muted text-sm">MXN</small></p>
      <button disabled={!count} onClick={() => { setDone(Math.floor(100 + Math.random() * 900)); setCart({}); setSheet(false); }} className="mt-2 rounded-xl bg-neon text-white font-extrabold py-3 disabled:opacity-40">Pedir</button>
    </>
  );

  return (
    <div className="h-[100dvh] flex flex-col max-w-6xl mx-auto bg-bg md:border-x border-ink/10">
      <header className="flex items-center justify-between gap-2 px-3 py-2 border-b border-ink/10 pt-[max(8px,env(safe-area-inset-top))]">
        <div className="flex items-center gap-2">
          <img src="/logodegas.png" alt="DegasCafé" draggable={false} className={`h-7 sm:h-8 w-auto object-contain ${night ? 'glow' : ''}`} />
          <span className="hidden sm:inline text-xs text-muted"><MapPin size={12} className="inline" /> Tampico</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <span className="rounded-full bg-surface border border-ink/10 px-2.5 py-1.5 font-bold">{w.temp != null ? `${w.temp}°C · ` : ''}{WX[w.cond]} · {String(h).padStart(2, '0')}h{sim && ' (sim.)'}</span>
          <button onClick={() => setMode(night ? 'lounge' : 'night')} aria-label={night ? 'Cambiar a Café Lounge' : 'Cambiar a Terraza Night'} className="rounded-full bg-surface border border-ink/10 p-2">{night ? <Sun size={16} /> : <Moon size={16} />}</button>
          <button onClick={() => setSound(s => !s)} aria-label="Sonido ambiente" className="rounded-full bg-surface border border-ink/10 p-2">{sound ? <Volume2 size={16} /> : <VolumeX size={16} />}</button>
          <button onClick={() => setShowSim(s => !s)} aria-label="Simulador de clima" aria-pressed={showSim} className={`rounded-full border border-ink/10 p-2 ${showSim ? 'bg-gold text-black' : 'bg-surface'}`}><SlidersHorizontal size={16} /></button>
        </div>
      </header>

      {showSim && (
        <div className="bg-surface border-b border-ink/10 text-xs px-3 py-2 flex flex-wrap items-center gap-x-3 gap-y-2">
          <button onClick={() => setSim(null)} aria-pressed={!sim} className={`rounded-full px-3 py-1.5 font-bold border border-ink/10 ${!sim ? 'bg-leaf text-white' : 'text-muted'}`}>Real (API)</button>
          {PRE.map(([l, t, c]) => <button key={l} onClick={() => setSim(s => ({ h: s ? s.h : h0, temp: t, cond: c }))} className={`rounded-full px-3 py-1.5 font-bold border border-ink/10 ${sim?.temp === t && sim?.cond === c ? 'bg-gold text-black' : 'text-muted'}`}>{l}</button>)}
          <label className="flex items-center gap-1">Temp <input type="range" min="5" max="42" value={w.temp ?? 25} onChange={e => setSim(s => ({ h: s ? s.h : h0, cond: s ? s.cond : w0.cond, temp: +e.target.value }))} className="accent-[#D93829]" />{w.temp ?? 25}°</label>
          <label className="flex items-center gap-1">Hora <input type="range" min="0" max="23" value={h} onChange={e => setSim(s => ({ temp: s ? s.temp : (w0.temp ?? 25), cond: s ? s.cond : w0.cond, h: +e.target.value }))} className="accent-[#D93829]" />{String(h).padStart(2, '0')}:00</label>
          <span className="hidden sm:block h-6 border-l border-ink/15" />
          <span className="font-bold text-muted">Demanda</span>
          <button onClick={() => setHighDemand(value => !value)} aria-pressed={highDemand} className={`rounded-full px-3 py-1.5 font-bold border border-ink/10 ${highDemand ? 'bg-neon text-white' : 'text-muted'}`}>{highDemand ? 'Alta demanda' : 'Normal'}</button>
        </div>
      )}

      <div className="relative h-40 sm:h-40 overflow-hidden shrink-0">
        <img 
          src="/bannerday.jpg" 
          alt="Banner Degas Café" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
          <p className="menu-serif text-2xl sm:text-4xl text-white tracking-wide px-4 py-1 bg-transparent rounded-md text-center">
            {MSG[p]} · {hot ? 'refréscate' : cold ? 'algo calientito' : 'lo mejor de la casa'}
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col md:flex-row">
        <aside className="md:w-60 shrink-0 md:border-r border-ink/10 flex flex-col min-h-0">
          <h2 className="hidden md:block menu-serif text-2xl text-center text-neon py-2">Menú</h2>
          <nav className="flex md:flex-col gap-1.5 md:gap-0 overflow-x-auto md:overflow-y-auto md:flex-1 px-2 py-2 md:py-0 [scrollbar-width:none]" aria-label="Menú">
            {[{ id: 'rec', title: '★ Recomendados' }, ...SECS].map(x => (
              <button key={x.id} onClick={() => setSec(x.id)} aria-current={sec === x.id}
                className={`shrink-0 text-left text-sm font-extrabold uppercase tracking-wide px-3 py-2.5 md:rounded-none rounded-full md:border-b border-ink/10 whitespace-nowrap md:whitespace-normal ${sec === x.id ? 'bg-neon text-white' : x.id === 'rec' ? 'text-gold' : 'text-ink/80 bg-surface md:bg-transparent'}`}>{x.title}</button>
            ))}
          </nav>
          <div className="hidden md:flex flex-col h-[40%] min-h-[220px] border-t border-ink/10 p-3">{order}</div>
        </aside>

        {/* CONTENEDOR DEL MENÚ REESTRUCTURADO COMO CARTA EDITORIAL */}
        <main className="flex-1 overflow-auto p-4 md:p-6 pb-24 md:pb-6">
          <div className="mb-5 border-b border-ink/10 pb-2">
            <h1 className="menu-serif text-2xl md:text-3xl font-bold flex items-center gap-2">
              {sec === 'rec' && <Star className="text-gold" size={22} fill="currentColor" />}
              {sec === 'rec' ? 'Recomendados para ti' : cur.title}
            </h1>
            <p className="text-xs text-muted mt-0.5">
              {sec === 'rec' ? `${w.temp != null ? `${w.temp}°C · ` : ''}${WX[w.cond]} · ${cold ? 'Sugerencias para clima frío: bebidas calientes y alimentos reconfortantes.' : hot ? 'Sugerencias para el calor: bebidas frías y refrescantes.' : 'Sugerencias equilibradas según la hora y el clima.'}` : cur.sub || ''}
            </p>
          </div>

          {sec === 'rec' && highDemand && (
            <section className="mb-6" aria-labelledby="quick-recommendations-title">
              <div className="mb-3 border-b border-ink/10 pb-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Alta demanda</p>
                <h2 id="quick-recommendations-title" className="menu-serif text-xl text-ink">Opciones rápidas para preparar o entregar</h2>
                <p className="text-xs text-muted mt-1">Incluye cafés y croissants preparados al momento, además de productos listos para entregar.</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {quickRec.map(i => {
                  const z = sz[i.id] || 0;
                  return (
                    <button key={i.id} onClick={() => add(`${i.id}:${z}`)} className="flex items-center justify-between gap-2 border-b border-dashed border-ink/15 px-2 py-2 text-left hover:bg-surface/40">
                      <span className="text-sm font-bold">{i.n}</span><span className="menu-serif text-sm font-bold text-gold">${i.p[z]}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
            {list.map(i => {
              const z = sz[i.id] || 0;
              const k = `${i.id}:${z}`;

              return (
                <div key={i.id} className="flex items-start justify-between gap-3 py-2.5 border-b border-dashed border-ink/15 hover:bg-surface/40 px-1.5 rounded-lg transition-colors">
                  <div className="flex-1 pr-1">
                    <h3 className="font-bold text-sm sm:text-base text-ink leading-tight">{i.n}</h3>
                    {i.d && <p className="text-[11px] sm:text-xs text-muted mt-0.5 leading-snug">{i.d}</p>}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {i.p.length > 1 && (
                      <div className="flex text-[10px] font-bold rounded-md bg-black/10 dark:bg-white/10 p-0.5">
                        {['12', '16'].map((l, j) => (
                          <button
                            key={j}
                            onClick={() => setSz(s => ({ ...s, [i.id]: j }))}
                            aria-pressed={z === j}
                            className={`px-1.5 py-0.5 rounded ${z === j ? 'bg-gold text-black' : 'text-ink/60'}`}
                          >
                            {l}oz
                          </button>
                        ))}
                      </div>
                    )}

                    <span className="menu-serif text-base sm:text-lg font-bold text-gold min-w-[38px] text-right">
                      ${i.p[z]}
                    </span>

                    <button
                      onClick={() => add(k)}
                      aria-label={`Agregar ${i.n}`}
                      className="rounded-full bg-neon text-white p-1 hover:scale-105 active:scale-95 transition"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs text-muted mt-8">
            Sujetos a disponibilidad · Pregunta por los cafés de nuestras barras de especialidad (Espresso Lab by Degas Café) · Café caliente, frío o frappé disponible descafeinado por $4 más · El pedido es una simulación.
          </p>
        </main>
      </div>

      <button onClick={() => setSheet(true)} className="md:hidden fixed left-3 right-3 bottom-[calc(12px+env(safe-area-inset-bottom))] z-30 flex items-center justify-between rounded-2xl bg-neon text-white font-extrabold px-5 py-4 shadow-xl">
        <span className="flex items-center gap-2"><ShoppingBag size={18} />Ver orden ({count})</span><span>${total}</span>
      </button>

      {sheet && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60 flex items-end" onClick={e => e.target === e.currentTarget && setSheet(false)}>
          <div className="bg-surface w-full rounded-t-3xl p-5 pb-[calc(20px+env(safe-area-inset-bottom))] max-h-[80vh] flex flex-col">{order}</div>
        </div>
      )}

      {done && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6" role="dialog" aria-modal="true">
          <div className="bg-surface rounded-3xl p-8 text-center max-w-sm">
            <p className="text-6xl">✅</p>
            <h2 className="menu-serif text-3xl mt-2">Orden #{done}</h2>
            <p className="text-muted mt-1">Simulación: tu pedido está en preparación.</p>
            <button onClick={() => setDone(null)} className="mt-5 rounded-xl bg-neon text-white font-extrabold px-8 py-3">Nueva orden</button>
          </div>
        </div>
      )}

      {pendingAlcohol && (
        <div className="fixed inset-0 z-[60] bg-black/75 flex items-center justify-center p-5" role="dialog" aria-modal="true" aria-labelledby="ine-reader-title">
          <div className="w-full max-w-md rounded-3xl bg-surface p-6 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold text-3xl" aria-hidden="true">▣</div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold">Lector de cámara · Simulación</p>
            <h2 id="ine-reader-title" className="menu-serif text-2xl mt-1">Verifica tu INE</h2>
            <p className="text-sm text-muted mt-2">Coloca una identificación oficial frente al lector para confirmar la compra de <strong className="text-ink">{pendingAlcohol.name}</strong>.</p>
            <p className="mt-4 text-sm font-bold">Tiempo restante: <span className="text-neon tabular-nums">{alcoholSeconds} s</span></p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <button onClick={() => resolveAlcohol(true)} className="rounded-xl bg-leaf px-4 py-3 text-sm font-extrabold text-white">INE válida</button>
              <button onClick={() => resolveAlcohol(false)} className="rounded-xl bg-neon px-4 py-3 text-sm font-extrabold text-white">INE inválida</button>
            </div>
            <p className="text-[11px] text-muted mt-3">Si no se muestra en 50 segundos, la bebida se quitará del pedido.</p>
          </div>
        </div>
      )}

      {alcoholNotice && (
        <div className="fixed bottom-5 left-1/2 z-[70] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-xl bg-surface px-4 py-3 text-center text-sm font-bold shadow-xl" role="status">
          {alcoholNotice}
        </div>
      )}
    </div>
  );
}