/* 位移法内容组件：仅接入原实验室画布，沿用原控制台、导航和编辑器。 */
(() => {
  'use strict';
  const scriptBase = new URL('.', document.currentScript.src);
  // 仅使用已随仓库提供、与当前页面对应的 SVG。
  const svgAssets = new Set(["BEAM-01-E", "BEAM-02-A1-2", "BEAM-02-A1-0-(1)", "BEAM-02-A1-0-(2)", "BEAM-02-A1-0-(3)", "BEAM-02-A1-1-(1)", "BEAM-02-A1-1-(2)", "BEAM-02-A1-1-(3)", "BEAM-02-A1-1-(4)", "BEAM-02-A1-1-(5)", "BEAM-02-A1-1-(6)", "BEAM-02-A1-1-(7)"]);

  for (const side of ['L', 'R', 'D-R']) for (let n = 1; n <= 20; n++) svgAssets.add(`BEAM-02-A1-3-(1)-${side}-M${n}`);
  for (const name of ['BEAM-02-A2-0', 'BEAM-02-A2-1-(4)', 'BEAM-02-A2-2', 'BEAM-02-A2-3', 'BEAM-02-A2-4', 'BEAM-02-A2-5']) svgAssets.add(name);
  const asset = name => {
    const stem = name.replace(/\.png$/, "");
    return new URL(`assets/displacement/${svgAssets.has(stem) ? stem + ".svg" : name}`, scriptBase).href;
  };
  const groups = [
    { id: 'E', stage: 'E', title: '把B点当固定端，算得木柱受力0.5ql。这个结果？', count: 1 },
    { id: 'A1-0', stage: 'A1', title: '为了能查表，我们做了什么？', count: 3,
      titles: ['先看待求解的刚架', '把B点嵌进大地，将未知转成已知', '固定端：管住截面的移动与转动'] },
    { id: 'A1-1', stage: 'A1', title: '嵌固真正多管住的，只有转动', count: 7,
      titles: ['原来的B点：移动被管住，转动没有被管住', '荷载作用下，小方块转过了Z₁', '把B点嵌固，转动也被管死了', '让嵌住B点的大地，也转过Z₁', '转动之前：用载常数', '转动之后：还可以用形常数', '支座可以转动：地基不均匀沉降的类比'] },
    { id: 'A1-2', stage: 'A1', title: '两根杆都能查表了，为什么还求不出木柱受力？', count: 1 },
    { id: 'A1-3', stage: 'A1', title: '同一个Z₁，原刚架与单跨梁的变形一致', count: 2,
      titles: ['转动嵌固，实现变形等效', '任意Z₁都能变形等效，真实值是哪一个？'], dynamic: true },
    { id: 'A2-0', stage: 'A2', title: '还有什么已知条件没有用过？', count: 1, dynamic: true },
    { id: 'A2-1', stage: 'A2', title: '把平衡条件，用在结点上', count: 4, dynamic: true,
      titles: ['假设某一个Z₁就是真实值，先看两个截面的弯矩', '相应截面的弯矩，应当一致', '把单跨梁的杆端弯矩，对应到原结构', '截开取出小方块：两个截面弯矩必须平衡'] },
    { id: 'A2-2', stage: 'A2', title: 'AB杆的弯矩：荷载一份，转角一份', count: 1, control: true },
    { id: 'A2-3', stage: 'A2', title: 'BC杆的弯矩：只有转角这一份', count: 1, control: true },
    { id: 'A2-4', stage: 'A2', title: '补上结点平衡，这次能算了吗？', count: 1, dynamic: true, solution: true },
    { id: 'A2-5', stage: 'A2', title: '变形等效，再补内力平衡', count: 1, dynamic: true, solution: true },
    { id: 'A2-6', stage: 'A2', title: '再次判断：把B点当固定端得到的0.5ql，能信吗？', count: 1 },
    { id: 'M', stage: 'M', title: '游客推栏杆，多了力偶Fh，求解过程哪里需要改？', count: 1 }
  ];
  function diagram(x, color) {
    const y = 232, b = x + 155, end = 385, scale = 460, t = theta();
    const points = Array.from({ length: 49 }, (_, j) => {
      const s = j / 48;
      const m = -1 / 12 - 2 * t + (.5 + 6 * t) * s - .5 * s * s;
      return `${(x + s * 155).toFixed(2)},${(y + scale * m).toFixed(2)}`;
    }).join(' ');
    const column = b + 3 * t * scale;
    return `<g class="moment-diagram"><rect x="${x-16}" y="169" width="202" height="251" fill="white"/>
      <polygon class="beam-moment" points="${x},${y} ${points} ${b},${y}" fill="${color}" fill-opacity=".32" stroke="${color}" stroke-width="1.8"/>
      <polygon class="column-moment" points="${b},${y} ${column},${y} ${b},${end}" fill="${color}" fill-opacity=".32" stroke="${color}" stroke-width="1.8"/>
      <path d="M${x},211 V251 M${x},${y} H${b} V${end}" fill="none" stroke="#151515" stroke-width="3"/>
      ${[0,1,2,3,4,5,6].map(j => `<path d="M${x},${214+j*5} l-12,6" stroke="#151515" stroke-width="2"/>`).join('')}
      <path d="M${b},${end} l-10,17 h20 Z M${b-15},${end+21} h30" fill="white" stroke="#151515" stroke-width="2"/>
      <text x="${x+66}" y="207" font-family="Cambria,serif" font-style="italic" font-size="26">M<tspan baseline-shift="sub" font-size="17">BA</tspan></text>
      <text x="${b-67}" y="292" font-family="Cambria,serif" font-style="italic" font-size="26">M<tspan baseline-shift="sub" font-size="17">BC</tspan></text></g>`;
  }

  function moments(svg) {
    const two = Number(svg.dataset.moments) === 2;
    const connect = svg.dataset.connect === 'true';
    const turn = state.frame / 19 * 13;
    const page = svg.closest('.disp-mini') ? 4 : state.sub + 1;
    const line = (name, ax, ay, bx, by, tip = 1) => {
      const color = name.includes('red') ? 'red' : 'blue';
      return `<path data-disp-element="line-${page}-${name}" data-ax="${ax}" data-ay="${ay}" data-bx="${bx}" data-by="${by}" data-tip="${tip}" d="M${ax},${ay} L${bx},${by}" stroke="${color === 'red' ? '#ff2934' : '#2543fa'}" ${tip ? `marker-end="url(#${color}-tip)"` : ''}/>`;
    };
    // 落点跟随弯矩曲线；编辑后可为每个分镜固定起终点。
    const redY = 232 + 460 * (-1 / 12 - 2 * theta() + (.5 + 6 * theta()) * .8 - .5 * .8 * .8);
    const blueX = 3 * theta() * 460 * (1 - 28 / 153);
    const angle = Math.atan2(-turn * 2, 78) * 180 / Math.PI;
    const rotationMark = (x, color) => `<g fill="none" stroke-width="4"><path d="M${x},90 h78" stroke="#999" stroke-dasharray="5 3"/><g transform="translate(${x} 90) rotate(${angle})" stroke="${color}"><path d="M0,0 H78 M55,0 V14 H41"/></g></g>`;
    svg.innerHTML = `<defs><marker id="red-tip" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto-start-reverse"><path d="M0,0 L7,3.5 L0,7" fill="#ff2934"/></marker><marker id="blue-tip" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto-start-reverse"><path d="M0,0 L7,3.5 L0,7" fill="#2543fa"/></marker></defs>
      ${two ? diagram(23, '#e97933') : ''}${diagram(515, '#3b69ac')}
      <g fill="none" stroke-width="2.5" stroke-dasharray="6 3">
        ${line('right-red', 785, 120, 639, redY)}${line('right-blue', 834, 146, 670 + blueX, 260)}
        ${two ? line('cross-red', 639, redY, 147, redY) + line('cross-blue', 670 + blueX, 260, 178 + blueX, 260) : ''}
        ${connect ? line('left-red', 147, redY - 5, 234, 115) + line('left-blue', 178 + blueX, 255, 273, 141) + line('cut-red', 226, 72, 242, 148, 0) + line('cut-blue', 242, 148, 315, 133, 0) : ''}
      </g>
      <g font-family="Cambria,serif" font-style="italic" font-size="48" font-weight="bold"><text x="305" y="44" fill="#d86323">Z₁</text><text x="866" y="44" fill="#315795">Z₁</text></g>
      ${rotationMark(269, '#d86323')}${rotationMark(830, '#315795')}
      <g font-family="Microsoft YaHei,sans-serif" font-size="29" font-weight="bold"><text x="12" y="466" fill="#d86323">待求解的对象（变形后）</text><text x="605" y="466" fill="#315795">转动B点嵌固的基础</text></g>`;
  }


  let state = { frame: 0, sub: 0 }, activeId = '', rendered = '';
  // A1-3「AI 辅助计算」：转角从 0 逐档增大到 0.02262（第 20 档），进度条代替原来的“n / 20”档位读数。
  const aiState = { running: false, done: false, progress: 0, raf: 0, token: 0 };
  const current = () => groups.find(g => g.id === activeId);
  const theta = () => state.frame / 840;
  const frameName = side => `BEAM-02-A1-3-(1)-${side}-M${state.frame + 1}.png`;
  const img = (name, cls = 'disp-layer', alt = '', element = '') => `<img class="${cls}" src="${asset(name)}" alt="${alt}" ${element ? `data-disp-element="${element}"` : ''} draggable="false">`;
  const identity = value => value.stage === 2 ? `A1-${Number(value.force_reveal_step || 0)}` : `A2-${Number(value.deformation_reveal_step || 0)}`;
  const change = async action => { const next = await api(action); update(next); };
  function pair({ split = false, moments = 0, connect = false, mini = false, overlay = false } = {}) {
    return `<div class="disp-pair ${mini ? 'disp-mini' : ''}" data-disp-element="${mini ? 'compactCompare' : 'compare'}">
      ${img(frameName('L'), 'disp-layer disp-frame-left', '待求解的对象', 'left')}
      ${img(frameName(split ? 'D-R' : 'R'), 'disp-layer disp-frame-right', '转动B点嵌固的基础', 'right')}
      ${moments ? `<svg class="disp-layer disp-moments" viewBox="0 0 945 480" data-moments="${moments}" data-connect="${connect}" data-disp-element="moments" role="img" aria-label="随转角变化的弯矩图"></svg>` : ''}
      ${overlay ? img('BEAM-02-A2-0.png', 'disp-layer', '单跨梁的载常数与形常数', 'overlay') : ''}
    </div>`;
  }
  function scene() {
    const g = current();
    if (g.id === 'A1-3') return pair({ split: state.sub === 1 });
    if (g.id === 'A2-0') return pair({ split: true, overlay: true });
    if (g.id === 'A2-1' && state.sub < 3) return pair({ moments: state.sub ? 2 : 1, connect: state.sub === 2 });
    if ((g.id === 'A2-1' && state.sub === 3) || g.solution) {
      // 用原图的比例裁切隐藏静态右上角，替换同名原图即生效，无派生PNG。
      const file = g.id === 'A2-1' ? 'BEAM-02-A2-1-(4).png' : `BEAM-02-${g.id}.png`;
      return `${img(file, 'disp-layer disp-node-source', '小方块隔离体及杆端弯矩关系', 'overlay')}${pair({ moments: 2, connect: true, mini: true })}`;
    }
    const file = `BEAM-02-${g.id}${g.count > 1 ? `-(${state.sub+1})` : ''}.png`;
    return img(file, 'disp-layer', g.titles?.[state.sub] || g.title, 'image') +
      (g.id === 'A1-1' && state.sub === 6 ? img('bisa.jpg', 'disp-pisa', '比萨斜塔', 'pisa') : '');
  }
  function dots() {
    const g=current(); if(g.count<2)return '';
    return `<div class="disp-substeps" data-disp-element="substeps"><span>${g.id} · ${state.sub+1} / ${g.count}</span><div class="disp-dot-track" role="slider" tabindex="0" aria-label="${g.id}分镜，可点击、拖动或用方向键切换" aria-valuemin="1" aria-valuemax="${g.count}" aria-valuenow="${state.sub+1}">${Array.from({length:g.count},(_,i)=>`<span class="disp-dot ${i===state.sub?'active':''}">${i+1}</span>`).join('')}</div></div>`;
  }
  const aiButtonText = () => aiState.running ? 'AI 正在逐档计算…' : aiState.done ? 'AI 计算完成' : '启动 AI 辅助计算';
  const aiStatusText = () => aiState.running ? '两组模型随 Z₁ 同步计算中' : aiState.done ? '计算完成 · 可继续拖动滑块' : '让转角 Z₁ 从 0 开始逐档增大';
  function aiCard() {
    const pct = (aiState.progress * 100).toFixed(1);
    return `<section class="ai-deformation-card disp-ai-card" data-ai-deformation-card data-disp-ai-card${aiState.running ? ' aria-busy="true"' : ''}><div class="ai-deformation-heading"><span>AI</span><strong>辅助计算两组模型的变形</strong></div><button type="button" class="primary ai-deformation-button" data-ai-deformation-button data-disp-ai-button ${aiState.running || aiState.done ? 'disabled' : ''}>${aiButtonText()}</button><div class="disp-ai-progress" data-disp-ai-progress role="progressbar" aria-label="AI 计算进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(aiState.progress * 100)}"><span style="width:${pct}%"></span></div><small data-ai-deformation-status data-disp-ai-status>${aiStatusText()}</small></section>`;
  }
  // 只改变了的地方才写进页面，免得每一帧都触发版面调试的重套用。
  function paintAi() {
    const g = current();
    const slider = document.querySelector('[data-disp-slider]'), zero = document.querySelector('[data-disp-zero]');
    if (g?.dynamic) { if (slider) slider.disabled = aiState.running; if (zero) zero.disabled = aiState.running; }
    const card = document.querySelector('[data-disp-ai-card]'); if (!card) return;
    if (aiState.running) card.setAttribute('aria-busy', 'true'); else card.removeAttribute('aria-busy');
    const button = card.querySelector('[data-disp-ai-button]'), status = card.querySelector('[data-disp-ai-status]'), bar = card.querySelector('[data-disp-ai-progress]');
    button.disabled = aiState.running || aiState.done;
    if (button.textContent !== aiButtonText()) button.textContent = aiButtonText();
    if (status.textContent !== aiStatusText()) status.textContent = aiStatusText();
    const pct = Math.round(aiState.progress * 1000) / 10;
    bar.setAttribute('aria-valuenow', String(Math.round(pct)));
    bar.firstElementChild.style.width = `${pct}%`;
  }
  function resetAi() {
    aiState.token++; if (aiState.raf) cancelAnimationFrame(aiState.raf);
    Object.assign(aiState, { running: false, done: false, progress: 0, raf: 0 });
  }
  // 先把 20 档图预读好（本地文件很快，最多等 1.5 秒），动画时不闪。
  function preloadAiFrames() {
    const names = [];
    for (let n = 1; n <= 20; n++) for (const side of ['L', state.sub === 1 ? 'D-R' : 'R']) names.push(`BEAM-02-A1-3-(1)-${side}-M${n}.png`);
    const loads = names.map(name => new Promise(resolve => { const image = new Image(); image.onload = image.onerror = () => resolve(); image.src = asset(name); }));
    return Promise.race([Promise.all(loads), new Promise(resolve => setTimeout(resolve, 1500))]);
  }
  async function startAi() {
    if (aiState.running || aiState.done || activeId !== 'A1-3') return;
    const token = ++aiState.token;
    Object.assign(aiState, { running: true, progress: 0 }); paintAi();
    await setFrame(0);
    await preloadAiFrames();
    if (token !== aiState.token) return;
    const last = 19, duration = 2400, started = performance.now();
    let shown = 0;
    const tick = now => {
      if (token !== aiState.token) return;
      if (activeId !== 'A1-3') { resetAi(); return; }
      aiState.progress = Math.min(1, (now - started) / duration);
      const frame = Math.round(aiState.progress * last);
      if (frame !== shown) { shown = frame; setFrame(frame); }
      if (aiState.progress < 1) { paintAi(); aiState.raf = requestAnimationFrame(tick); return; }
      Object.assign(aiState, { running: false, done: true, raf: 0 }); paintAi();
    };
    aiState.raf = requestAnimationFrame(tick);
  }
  function controls() {
    const g=current();
    return `<div class="force-controls"><aside class="control-card force-control disp-control ${!g.dynamic?'disp-disabled':''}">
      ${g.id==='A1-3'?aiCard():''}
      <div class="disp-angle-title">转角 <i>Z</i><sub>1</sub></div>
      <div class="range-row"><input data-disp-slider type="range" min="0" max="19" step="1" value="${state.frame}" aria-label="转角Z1" ${!g.dynamic?'disabled':''}><strong data-disp-angle></strong></div>
      <small class="disp-angle-unit">转角单位：ql³/EI</small>
      <button class="secondary" data-disp-zero ${!g.dynamic?'disabled':''}>转角归零</button>
      ${g.solution?'<div class="readouts disp-solution"><div class="readout"><strong data-disp-force></strong><small>木柱受力 N</small></div><div class="readout"><strong data-disp-residual></strong><small>结点弯矩代数和</small></div></div><p data-disp-balance></p><button class="primary" data-disp-equilibrium>定位平衡转角</button>':''}
      <p class="hint">${g.dynamic?'逆时针为正；拖动Z₁，比较两组模型。图中变形为放大示意。':'本页讲解杆端弯矩，转角滑块暂不启用。'}</p>
    </aside></div>`;
  }
  function render(value) {
    activeId=identity(value); if(activeId!=='A1-3')resetAi(); const g=current(); if(!g)return;
    state={frame:Number(value.displacement_frame||0),sub:Math.min(g.count-1,Number(value.displacement_substep||0))};
    const dynamic=g.dynamic||g.control;
    document.getElementById('app').innerHTML=`<section class="panel force-story displacement-story ${value.stage===3?'deformation-story':''}" data-reveal-step="${value.stage===2?value.force_reveal_step:value.deformation_reveal_step}" data-disp-controlled="${Boolean(dynamic)}"><h1${g.count>1?` data-disp-title="${state.sub+1}"`:''}>${g.titles?.[state.sub]||g.title}</h1><div class="force-composition"><div class="force-free-canvas" data-disp-substep="${state.sub}" aria-label="位移法图片与交互画布"><div class="disp-scene" data-disp-element="scene"><div class="disp-aspect ${g.id.startsWith('A1')&&!g.dynamic?'disp-wide':''}">${scene()}</div></div>${dots()}</div>${dynamic?controls():''}</div></section>`;
    rendered=`${activeId}:${state.sub}`;
    bind(); refresh(); paintAi();
  }
  function update(value) {
    const id=identity(value), g=groups.find(x=>x.id===id);if(!g || id==='A2-6')return;
    const sub=Math.min(g.count-1,Number(value.displacement_substep||0));
    if(!document.querySelector('.displacement-story') || rendered!==`${id}:${sub}`) {render(value); if(typeof mountSelfGuidedNavigation==='function')mountSelfGuidedNavigation();return;}
    const frame=Number(value.displacement_frame||0);
    if(state.frame!==frame){state.frame=frame;refresh();}
  }
  function refresh() {
    const split=(activeId==='A1-3'&&state.sub===1)||activeId==='A2-0';
    document.querySelectorAll('.disp-frame-left').forEach(el=>{el.src=asset(frameName('L'));});
    document.querySelectorAll('.disp-frame-right').forEach(el=>{el.src=asset(frameName(split?'D-R':'R'));});
    document.querySelectorAll('[data-moments]').forEach(moments);
    prefetchNeighbours();
    const slider=document.querySelector('[data-disp-slider]');if(!slider)return;
    slider.value=state.frame;slider.setAttribute('aria-valuetext',`${theta().toFixed(5)} ql³/EI`);
    document.querySelector('[data-disp-angle]').textContent=theta().toFixed(5);
    if(current().solution){
      document.querySelector('[data-disp-force]').textContent=`${(.5-6*theta()).toFixed(4)} ql`;
      document.querySelector('[data-disp-residual]').textContent=`${(7*theta()-1/12).toFixed(5)} ql²`;
      document.querySelector('[data-disp-balance]').textContent=state.frame===10?'结点平衡 · N ≈ 0.43ql':'结点尚未平衡';
    }
  }
  const setFrame = n => change({type:'set_displacement_frame',value:n});
  function bind() {
    if (window.BEAM_OFFLINE?.selfGuided) {
      const heading = document.querySelector('.displacement-story h1');
      heading.insertAdjacentHTML('afterend', '<button class="secondary disp-mobile-toggle" aria-pressed="false">放大图示（可左右滑动）</button>');
      document.querySelector('.disp-mobile-toggle').addEventListener('click', event => {
        const expanded = document.querySelector('.displacement-story').classList.toggle('disp-mobile-zoom');
        event.currentTarget.setAttribute('aria-pressed', String(expanded));
        event.currentTarget.textContent = expanded ? '还原整图' : '放大图示（可左右滑动）';
      });
    }
    document.querySelector('[data-disp-slider]')?.addEventListener('input',e=>setFrame(Number(e.target.value)));
    document.querySelector('[data-disp-zero]')?.addEventListener('click',()=>setFrame(0));
    document.querySelector('[data-disp-ai-button]')?.addEventListener('click',startAi);
    document.querySelector('[data-disp-equilibrium]')?.addEventListener('click',()=>setFrame(10));
    const track=document.querySelector('.disp-dot-track');if(!track)return;
    track.addEventListener('pointerdown',event=>{
      if(event.button!==0)return;event.preventDefault();const r=track.getBoundingClientRect();
      drag={left:r.left+14,width:r.width-28,count:current().count,last:state.sub};dragTo(event.clientX);
    });
    track.addEventListener('keydown',async event=>{
      const next=event.key==='Home'?0:event.key==='End'?current().count-1:['ArrowRight','ArrowUp'].includes(event.key)?state.sub+1:['ArrowLeft','ArrowDown'].includes(event.key)?state.sub-1:null;
      if(next===null)return;event.preventDefault();await change({type:'set_displacement_substep',value:Math.max(0,Math.min(current().count-1,next))});document.querySelector('.disp-dot-track')?.focus();
    });
  }
  let drag=null;
  function dragTo(x){if(!drag)return;const sub=Math.max(0,Math.min(drag.count-1,Math.round((x-drag.left)/drag.width*(drag.count-1))));if(sub!==drag.last){drag.last=sub;change({type:'set_displacement_substep',value:sub});}}
  window.addEventListener('pointermove',e=>{if(drag){e.preventDefault();dragTo(e.clientX);}});
  window.addEventListener('pointerup',()=>{drag=null;});window.addEventListener('pointercancel',()=>{drag=null;});
  window.BEAM_DISPLACEMENT={render,update,asset};
  // 学生首屏不请求动态图；停下滑块后只预读当前两侧的相邻帧。
  let prefetchTimer;
  const prefetched = new Set();
  function prefetchNeighbours() {
    clearTimeout(prefetchTimer);
    const images = [...document.querySelectorAll('.disp-frame-left, .disp-frame-right')];
    if (!images.length) return;
    const sources = images.map(image => image.src);
    const frame = state.frame;
    prefetchTimer = setTimeout(async () => {
      await Promise.all(images.map(image => image.decode().catch(() => {})));
      if (state.frame !== frame || images.some((image, i) => !image.isConnected || image.src !== sources[i])) return;
      const connection = navigator.connection;
      if (connection?.saveData || ['slow-2g', '2g'].includes(connection?.effectiveType)) return;
      for (const source of sources) for (const next of [frame - 1, frame + 1]) {
        if (next < 0 || next > 19) continue;
        const url = source.replace(/-M\d+(\.(?:png|svg))$/, `-M${next + 1}$1`);
        if (prefetched.has(url)) continue;
        prefetched.add(url);
        const image = new Image();
        image.fetchPriority = 'low';
        image.onerror = () => prefetched.delete(url);
        image.src = url;
      }
    }, 250);
  }
})();
