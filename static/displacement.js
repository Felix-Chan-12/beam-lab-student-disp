/* 位移法内容组件：仅接入原实验室画布，沿用原控制台、导航和编辑器。 */
(() => {
  'use strict';
  const scriptBase = new URL('.', document.currentScript.src);
  // 版面调试（tune=1）里：平时藏着的框（A2-5 的红、蓝框，A1-0 中间的占位框）淡淡地显示出来，方便选中调整。
  if (new URLSearchParams(location.search).get('tune') === '1') document.documentElement.classList.add('disp-tune');
  // 仅使用已随仓库提供、与当前页面对应的 SVG。
  const svgAssets = new Set(["01-top-3-Beams", "BEAM-01-E", "BEAM-02-A1-2", "BEAM-02-A1-1-(1)", "BEAM-02-A1-1-(2)", "BEAM-02-A1-1-(3)"]);
  for (let n = 1; n <= 8; n++) svgAssets.add(`BEAM-02-A1-0-(${n})`);

  for (const side of ['L', 'R', 'D-R']) for (let n = 1; n <= 20; n++) svgAssets.add(`BEAM-02-A1-3-(1)-${side}-M${n}`);
  for (const name of ['BEAM-02-A2-0', 'BEAM-02-A2-1-(4)', 'BEAM-02-A2-4', 'BEAM-02-A2-5']) svgAssets.add(name);
  for (let n = 1; n <= 6; n++) svgAssets.add(`BEAM-02-A2-2-${n}`);
  for (let n = 1; n <= 5; n++) svgAssets.add(`BEAM-02-A2-3-${n}`);
  const asset = name => {
    const stem = name.replace(/\.png$/, "");
    return new URL(`assets/displacement/${svgAssets.has(stem) ? stem + ".svg" : name}`, scriptBase).href;
  };
  const groups = [
    { id: 'E', stage: 'E', title: '把B点当固定端，算得木柱受力0.5ql。这个结果？', count: 1 },
    // A1-0 八个分镜（2026-10-23 起）：从「原结构 / 第1根梁代替」讲到「让B点的基础也转Z₁」，B点变形对比一口气讲完。
    //   图是 BEAM-02-A1-0-(1)～(8)；(3) 和 (2) 是同一张图（第3个分镜在画面中间放大显示「2个条件」框），第3→4个之间可以拖动转场。
    //   （原来的 A1-0-(3) 改名为 (4)，原来的 A1-1-(1)～(4) 改名为 A1-0-(5)～(8)。）
    // A1-1 三个分镜：三根梁拼出来，图是 BEAM-02-A1-1-(1)～(3)（原来的 A1-1-(5)～(7)）。
    { id: 'A1-0', stage: 'A1', title: '为了能查表，我们做了什么？', count: 8,
      titles: ['先看待求解的刚架', '用第1根梁代替横梁AB', '已知算未知，结果可信要满足2个条件', '右边的B点：不能移动，也不能转动', '原结构的B点：也不能移动，这一点一致', '荷载作用下，原结构的B点转过了Z₁', '右边的B点转不了：变形不一致', '让右边B点的基础，也转过Z₁'] },
    { id: 'A1-1', stage: 'A1', title: '右边的结构，由3根已知的梁拼出来', count: 3,
      titles: ['右边的结构，由3根已知的梁拼出来', '横梁AB：第1根梁＋第2根梁', '木柱BC：第3根梁'] },
    { id: 'A1-2', stage: 'A1', title: '两根杆都能查表了，为什么还求不出木柱受力？', count: 1 },
    { id: 'A1-3', stage: 'A1', title: '同一个Z₁，原刚架与单跨梁的变形一致', count: 2,
      titles: ['转动嵌固，实现变形等效', '任意Z₁都能变形等效，真实值是哪一个？'], dynamic: true },
    { id: 'A2-0', stage: 'A2', title: '还有什么已知条件没有用过？', count: 1, dynamic: true },
    { id: 'A2-1', stage: 'A2', title: '把平衡条件，用在结点上', count: 4, dynamic: true,
      titles: ['假设某一个Z₁就是真实值，先看两个截面的弯矩', '相应截面的弯矩，应当一致', '把单跨梁的杆端弯矩，对应到原结构', '截开取出小方块：两个截面弯矩必须平衡'] },
    // seq：分镜图名是 BEAM-02-A2-2-1、-2…（不带括号）。
    { id: 'A2-2', stage: 'A2', title: 'AB杆的弯矩：荷载一份，转角一份', count: 6, control: true, seq: true },
    // A2-3（2026-10-26 起）：只留一个圆。进页是第1张图（BEAM-02-A2-3-1），点圆直接到第5张（带「第3根梁」卡片），
    //   再点卡片（或翻页笔再按一下）露出 3i·Z₁。frames 是每个分镜用第几张图；single 表示只画一个圆，点它在两个分镜之间切换。
    { id: 'A2-3', stage: 'A2', title: 'BC杆的弯矩：只有转角这一份', count: 2, control: true, seq: true, frames: [1, 5], single: true },
    { id: 'A2-4', stage: 'A2', title: '补上结点平衡，这次能算了吗？', count: 1, dynamic: true, solution: true },
    { id: 'A2-5', stage: 'A2', title: '变形等效，再补内力平衡', count: 1, dynamic: true, solution: true },
    { id: 'A2-6', stage: 'A2', title: '再次判断：把B点当固定端得到的0.5ql，能信吗？', count: 1 },
    { id: 'M', stage: 'M', title: '游客推栏杆，多了力偶Fh，求解过程哪里需要改？', count: 1 }
  ];
  // 顶部（A1-0～A2-5）：左边三根梁的配图，右边「已知算未知，结果可信的2个条件」。
  // 每个分镜两个条件后面的标记：0 不标，1 问号，2 叉，3 勾（[变形一致, 内力一致]）；版面调试里可以按页、按分镜改。
  const HEAD_MARKS = {
    'A1-0': [[1, 0], [1, 0], [1, 0], [1, 0], [1, 0], [1, 0], [2, 0], [3, 0]],
    'A1-1': [[3, 0], [3, 0], [3, 0]],
    'A1-2': [[3, 0]],
    'A1-3': [[3, 0], [3, 0]],
    'A2-0': [[3, 1]],
    'A2-1': [[3, 1], [3, 1], [3, 1], [3, 1]],
    'A2-2': [[3, 1]], 'A2-3': [[3, 1]], 'A2-4': [[3, 1]],
    'A2-5': [[3, 3]]
  };
  // 顶部三根梁，每根各有一个遮罩（半透明）和一个描边框（橘色、无填充），大小、位置在版面调试里调（所有页通用）。
  // 每页、每个分镜，每根梁用哪个：0 不用，1 遮罩，2 描边框（[第1根, 第2根, 第3根]）；版面调试里可以按页、按分镜改。
  // 默认：A1-0 前7个分镜盖住第2、3根梁；A1-0 第8个分镜（让基础也转Z₁）圈出第2、3根梁；其余都不用。
  const BEAM_USE = {
    'A1-0': [[0, 1, 1], [0, 1, 1], [0, 1, 1], [0, 1, 1], [0, 1, 1], [0, 1, 1], [0, 1, 1], [0, 2, 2]]
  };
  // 「2个条件」框每个分镜的样子：hide 不显示，big 放大摆在画面中间（位置在版面调试的「中间的「2个条件」框」里调），show 在右上角（默认）。
  const CONDS_SHOW = { 'A1-0': ['hide', 'hide', 'big', 'show'] };
  // 点顶部的梁切换矩形：哪一页哪个分镜、哪几根梁一起切；每点一次按 遮罩 → 描边框 → 不显示 → 遮罩… 轮换（只在本机画面上变，换页后复原）。
  const CYCLE_BEAMS = { 'A1-0:6': [2, 3] }; // A1-0 第7个分镜（右边的B点转不了）
  const cycle = { key: '', use: null };
  // 点「2个条件」里的某一条，画面里出现对应的框，这一条的字也变成框的颜色（再点一次收起）。只在下面这些页。
  // 2026-10-25 起 A2-5 不再点开强调（原来是 { 'A2-5': true }：先红框「变形一致」、再蓝框「内力一致」），这里留空；要恢复就填回去。
  const CLICK_FRAMES = {};
  const hl = { page: '', on: [false, false] };
  const subKey = () => `${activeId}:${state.sub}`;
  function headHtml() {
    const marks = HEAD_MARKS[activeId];
    if (!marks) return '';
    const sub = state.sub + 1, [m1, m2] = marks[state.sub] || marks[0];
    const use = BEAM_USE[activeId]?.[state.sub] || [0, 0, 0];
    const group = CYCLE_BEAMS[subKey()] || [];
    const beam = n => {
      const cyc = group.includes(n), u = cyc && cycle.key === subKey() && cycle.use != null ? cycle.use : use[n - 1];
      const forced = cyc && cycle.key === subKey() && cycle.use != null ? ` style="${beamVars(u)}"` : '';
      return `<div class="disp-beam" data-disp-element="beam${n}" data-beam="${n}" data-sub="${sub}" data-use="${u}"${cyc ? ' data-cycle' : ''}${forced}><div class="disp-beam-cover" data-disp-element="beamCover${n}"></div><div class="disp-beam-frame" data-disp-element="beamFrame${n}"></div></div>`;
    };
    const click = CLICK_FRAMES[activeId] ? ' data-click role="button" tabindex="0"' : '';
    const cond = (n, text, mark) => `<li class="disp-cond" data-disp-element="mark${n}" data-disp-cond="${n}" data-sub="${sub}" data-mark="${mark}"${click}><span class="disp-cond-text" data-disp-element="condText${n}">${n}. ${text}</span><span class="disp-cond-mark" aria-hidden="true"></span></li>`;
    return `<div class="disp-head" data-disp-element="head" data-conds="${CONDS_SHOW[activeId]?.[state.sub] || 'show'}">
      <div class="disp-head-figure" data-disp-element="headFigure">
        <img class="disp-head-image" src="${asset('01-top-3-Beams.png')}" alt="第1、2、3根梁" draggable="false">
        ${beam(1)}${beam(2)}${beam(3)}
      </div>
      <aside class="disp-conds" data-disp-element="conds" aria-label="结果可信的2个条件">
        <h2 class="disp-conds-title" data-disp-element="condsTitle">已知算未知，结果可信的2个条件</h2>
        <ol>${cond(1, '变形一致', m1)}${cond(2, '内力一致', m2)}</ol>
      </aside>
      <div class="disp-head-rule" data-disp-element="headRule" aria-hidden="true"></div>
    </div>`;
  }

  // 曲线箭头：从顶部第1、2、3根梁指向中间的图。起终点按白色页面（.force-story）的宽、高百分比；
  // 版面调试改过的值写在变量 --disp-cax 等里，没改过时用下面按图算出的默认位置（每页分开存）。
  const CURVE_START = [0.125, 0.39, 0.64]; // 三根梁在顶部配图里的横向位置（配图宽的比例）
  // 每页（分镜）画哪几条：[第几根梁, 落点X, 落点Y（中间图的宽、高比例）, 终点方向（0 从上往下，1 从右往左，2 从左往右）, 竖走的X, 横走的Y]。
  // 后两项可以不写（按默认规则算）；写了的话也按中间图的宽、高比例。双图页（A1-3、A2-0）的「中间图」是整组双图。
  // 横走的高度都在分镜圆球下面（A1-3 第2个分镜右上角有分镜圆球）；第1根梁横走得最低，三条线互不交叉。
  const A13_CURVES = [
    [1, 0.613, 0.097, 0, null, -0.0035],  // 第1根梁 → 拆开后的横梁（落在均布荷载上沿，q 的左边）
    [2, 0.677, 0.097, 0, null, -0.0406],  // 第2根梁 → 拆开后的横梁（q 的右边）
    [3, 0.924, 0.498, 1, 0.961, -0.0220]  // 第3根梁 → 木柱（从右边指过去：从 Z₁ 的线和字之间竖着下来，箭头尖离木柱右边一点）
  ];
  const CURVES = {
    'A1-0:1': [[1, 0.46, 0.165, 0]], 'A1-0:2': [[1, 0.46, 0.165, 0]],     // A1-0-(2)：第1根梁 → 中间的空心箭头
    'A1-1:1': [[1, 0.19, 0.10, 0], [2, 0.44, 0.16, 0]],                  // A1-1 第2个分镜：第1根梁 → 左图，第2根梁 → 中图
    'A1-1:2': [[3, 0.576, 0.56, 1]],                                     // A1-1 第3个分镜：第3根梁 → 中图木柱（从右边指过去，竖线从 Z₁ 和等号之间穿过）
    'A1-2:0': [[1, 0.80, 0.10, 0], [2, 0.915, 0.13, 0], [3, 0.94, 0.55, 1]], // A1-2：横梁、B端基础、木柱BC
    'A1-3:1': A13_CURVES,  // A1-3 第2个分镜：点右下角的圆才出现（见 PINS）
    'A2-0:0': A13_CURVES   // A2-0：和 A1-3 第2个分镜同一组箭头，一直显示
  };
  const curvesHtml = (key = subKey()) => {
    const list = CURVES[key];
    const pinned = PINS[key]?.show === 'curves' ? ` disp-pinned${pinHides('curves') ? ' disp-pin-off' : ''}` : '';
    const opt = (name, v) => v == null ? '' : ` data-${name}="${v}"`;
    return !list ? '' : `<svg class="disp-curves${pinned}" aria-hidden="true"><g class="disp-curve-gaps"></g>${list.map(([n, ex, ey, dir, mx, my]) => `<g data-disp-element="curve-${n}" data-beam="${n}" data-ex="${ex}" data-ey="${ey}"${opt('mx', mx)}${opt('my', my)} data-bw="3" data-bcolor="${0xd86323}" data-cdir="${dir}"><path class="disp-curve-line"/><path class="disp-curve-head"/></g>`).join('')}</svg>`;
  };
  // 页内的圆（2026-10-25）：点一下才显示本分镜的一部分内容，再点一下收起；换分镜后复原。翻页笔：先按一下点开，再按才进下一步。
  //   A1-3 第2个分镜：画布右下角一个圆（和右上角最后一个分镜圆球竖着对齐），点开后出现顶部三根梁指过来的箭头（A2-0 一直显示这几条）。
  //   A2-1 第1个分镜：同样在画布右下角一个圆，点开后出现右边模型的弯矩图和红、蓝虚线箭头。
  // where：圆放在哪里（canvas 画布右下角）；位置在版面调试里可调。
  const PINS = {
    'A1-3:1': { show: 'curves', where: 'canvas', el: 'pinCurves', label: '显示顶部三根梁指过来的箭头' },
    'A2-1:0': { show: 'moments', where: 'canvas', el: 'pinMoments', label: '显示右边模型的弯矩图和红、蓝虚线' }
  };
  const pin = { key: '', on: false };
  const pinOn = () => pin.key === subKey() && pin.on;
  const pinHides = what => PINS[subKey()]?.show === what && !pinOn();
  function pinHtml(where) {
    const p = PINS[subKey()];
    if (!p || p.where !== where) return '';
    return `<button type="button" class="disp-pin disp-pin-${where}${pinOn() ? ' active' : ''}" data-disp-element="${p.el}" data-disp-pin aria-pressed="${pinOn()}" aria-label="${p.label}"></button>`;
  }
  function setPin(on) {
    const p = PINS[subKey()];
    if (!p) return;
    Object.assign(pin, { key: subKey(), on });
    document.querySelectorAll('[data-disp-pin]').forEach(el => { el.classList.toggle('active', on); el.setAttribute('aria-pressed', String(on)); });
    if (p.show === 'curves') document.querySelectorAll('.disp-curves.disp-pinned').forEach(svg => svg.classList.toggle('disp-pin-off', !on));
    if (p.show === 'moments') document.querySelectorAll('.disp-pair:not(.disp-mini) [data-moments]').forEach(svg => svg.toggleAttribute('data-pin-off', !on));
    scheduleCurves();
  }
  function drawCurves() {
    const svg = document.querySelector('.disp-curves'), story = svg?.closest('.force-story');
    if (!svg || !story) return;
    const box = story.getBoundingClientRect();
    if (!box.width || !box.height) return;
    svg.setAttribute('viewBox', `0 0 ${box.width.toFixed(1)} ${box.height.toFixed(1)}`);
    const fig = story.querySelector('.disp-head-image')?.getBoundingClientRect();
    const pic = story.querySelector('.disp-scene [data-disp-element="image"], .disp-scene [data-disp-element="compare"]')?.getBoundingClientRect();
    const f = n => n.toFixed(1);
    svg.querySelectorAll('g[data-disp-element^="curve-"]').forEach((g, i) => {
      // 默认位置（按当前版面量出来），写回 data- 属性，版面调试里显示的就是这些数。
      const pct = (v, total) => +(v / total * 100).toFixed(2);
      if (fig && fig.width) { g.dataset.cax = pct(fig.left + CURVE_START[g.dataset.beam - 1] * fig.width - box.left, box.width); g.dataset.cay = pct(fig.bottom - box.top + 4, box.height); }
      if (pic && pic.width) { g.dataset.cbx = pct(pic.left + g.dataset.ex * pic.width - box.left, box.width); g.dataset.cby = pct(pic.top + g.dataset.ey * pic.height - box.top, box.height); }
      const cs = getComputedStyle(g);
      const val = key => { const v = parseFloat(cs.getPropertyValue(`--disp-${key}`)); return Number.isFinite(v) ? v : Number(g.dataset[key]) || 0; };
      const color = cs.getPropertyValue('--disp-bcolor').trim() || `#${Number(g.dataset.bcolor).toString(16).padStart(6, '0')}`;
      const w = Math.max(.5, val('bw')), mode = Math.round(val('cdir'));
      const ax = val('cax') / 100 * box.width, ay = val('cay') / 100 * box.height;
      const bx = val('cbx') / 100 * box.width, by = val('cby') / 100 * box.height;
      const head = Math.max(10, w * 3.4), r = box.width * .06;
      // 先竖直离开配图，在顶部和画布之间的空白处横过去，再圆滑地拐弯落到终点（全程光滑）。
      // 三条线横走的高度错开（第1根最低、第3根最高），互相不交叉。
      // 从右（左）指过去时，竖着下来的那段默认在终点外侧页面宽 5% 处。
      // CURVES 里写了 mx、my 的，按图定横走的高度、竖走的位置；版面调试改过的（--disp-cmy、--disp-cmx）优先。
      const dir = by >= ay ? 1 : -1;
      let cy = ay + dir * Math.min(Math.abs(by - ay) * .5, box.height * (.07 - .025 * i));
      let xr = bx + (mode === 2 ? -1 : 1) * box.width * .05;
      if (pic && pic.width && g.dataset.my != null) cy = pic.top + g.dataset.my * pic.height - box.top;
      if (pic && pic.width && g.dataset.mx != null) xr = pic.left + g.dataset.mx * pic.width - box.left;
      g.dataset.cmy = pct(cy, box.height); g.dataset.cmx = pct(xr, box.width);
      const tuned = key => Number.isFinite(parseFloat(cs.getPropertyValue(`--disp-${key}`)));
      if (tuned('cmy')) cy = val('cmy') / 100 * box.height;
      if (tuned('cmx')) xr = val('cmx') / 100 * box.width;
      // 一段「先横后竖」的圆角：从 (x0,y0) 横走到 x1，再竖着到 y1；圆角半径不超过两段长度的一半。
      const corner = (x0, y0, x1, y1, rad) => {
        const sx = x1 >= x0 ? 1 : -1, sy = y1 >= y0 ? 1 : -1, k = Math.max(.5, Math.min(rad, Math.abs(x1 - x0) / 2, Math.abs(y1 - y0) / 2));
        return ` L${f(x1 - sx * k)},${f(y0)} C${f(x1)},${f(y0)} ${f(x1)},${f(y0)} ${f(x1)},${f(y0 + sy * k)}`;
      };
      const [line, tip] = g.children;
      let d = `M${f(ax)},${f(ay)}`, tipD;
      if (mode === 1 || mode === 2) {
        // 从右（或左）横着指向终点：横走到终点外侧，竖着落到终点高度，再横着拐进去。
        const side = mode === 1 ? 1 : -1, ex = bx + side * head * .85;
        const k0 = Math.max(.5, Math.min(r, Math.abs(xr - ax) / 2, Math.abs(cy - ay))), sx0 = xr >= ax ? 1 : -1;
        d += ` C${f(ax)},${f(cy)} ${f(ax)},${f(cy)} ${f(ax + sx0 * k0)},${f(cy)}` + corner(ax + sx0 * k0, cy, xr, by, r);
        const k2 = Math.max(.5, Math.min(r, Math.abs(by - cy) / 2, Math.abs(xr - ex)));
        d += ` L${f(xr)},${f(by - (by >= cy ? 1 : -1) * k2)} C${f(xr)},${f(by)} ${f(xr)},${f(by)} ${f(xr - side * k2)},${f(by)} L${f(ex)},${f(by)}`;
        tipD = `M${f(bx + side * head)},${f(by - head * .55)} L${f(bx)},${f(by)} L${f(bx + side * head)},${f(by + head * .55)} Z`;
      } else {
        const ey = by - dir * head * .85, sx = bx >= ax ? 1 : -1, k0 = Math.max(.5, Math.min(r, Math.abs(bx - ax) / 2));
        d += ` C${f(ax)},${f(cy)} ${f(ax)},${f(cy)} ${f(ax + sx * k0)},${f(cy)}` + corner(ax + sx * k0, cy, bx, ey, r) + ` L${f(bx)},${f(ey)}`;
        tipD = `M${f(bx - head * .55)},${f(by - dir * head)} L${f(bx)},${f(by)} L${f(bx + head * .55)},${f(by - dir * head)} Z`;
      }
      line.setAttribute('d', d);
      line.setAttribute('stroke', color); line.setAttribute('stroke-width', w);
      tip.setAttribute('d', tipD);
      tip.setAttribute('fill', color);
    });
    curveGaps(svg, story, box);
  }
  // 曲线和横线（顶部分割线、画布上沿）交叉的地方，在曲线下面垫一小块白色，横线在曲线两边断开一点。
  function curveGaps(svg, story, box) {
    const gaps = svg.querySelector('.disp-curve-gaps');
    if (!gaps) return;
    const lines = [];
    const rule = story.querySelector('.disp-head-rule');
    if (rule && getComputedStyle(rule).display !== 'none') {
      const r = rule.getBoundingClientRect();
      if (r.width) lines.push({ y: r.top + r.height / 2 - box.top, h: r.height, x0: r.left - box.left, x1: r.right - box.left });
    }
    const canvas = story.querySelector('.force-free-canvas');
    if (canvas) {
      const r = canvas.getBoundingClientRect(), bw = parseFloat(getComputedStyle(canvas).borderTopWidth) || 0;
      if (bw && r.width) lines.push({ y: r.top + bw / 2 - box.top, h: bw, x0: r.left - box.left, x1: r.right - box.left });
    }
    // 分镜圆球之间的横线（A1-3 第2个分镜，第3根梁的箭头从这里穿过）：横线在圆球中心的高度，两端到第一个、最后一个圆球的中心。
    const track = story.querySelector('.disp-dot-track'), dot = track?.querySelector('.disp-dot');
    if (track && dot) {
      const r = track.getBoundingClientRect(), d = dot.getBoundingClientRect().width;
      if (r.width) lines.push({ y: r.top + r.height / 2 - box.top, h: 3, x0: r.left + d / 2 + 3 - box.left, x1: r.right - d / 2 - 3 - box.left });
    }
    // 双图里B点的转角标记：灰虚线（原位置，水平）和彩色线（随 Z₁ 转动，斜的）。都只取前 78 个图内单位那一段。
    const slants = [];
    story.querySelectorAll('svg[data-disp-marks] path[stroke="#999"], svg[data-disp-marks] g[transform] > path').forEach(path => {
      const m = path.getScreenCTM();
      if (!m) return;
      let p0, p1;
      try { p0 = path.getPointAtLength(0); p1 = path.getPointAtLength(78); } catch (_) { return; }
      const a = new DOMPoint(p0.x, p0.y).matrixTransform(m), b = new DOMPoint(p1.x, p1.y).matrixTransform(m);
      const h = (parseFloat(getComputedStyle(path).strokeWidth) || 4) * Math.hypot(m.a, m.b);
      if (Math.abs(a.y - b.y) < .01) lines.push({ y: a.y - box.top, h, x0: Math.min(a.x, b.x) - box.left, x1: Math.max(a.x, b.x) - box.left });
      else slants.push({ x0: a.x - box.left, y0: a.y - box.top, x1: b.x - box.left, y1: b.y - box.top, h });
    });
    let html = '';
    svg.querySelectorAll('.disp-curve-line').forEach(line => {
      let len = 0;
      try { len = line.getTotalLength(); } catch (_) { return; }
      const w = Number(line.getAttribute('stroke-width')) || 3;
      let a = line.getPointAtLength(0);
      for (let at = 2; at < len + 2; at += 2) {
        const b = line.getPointAtLength(Math.min(at, len));
        for (const L of lines) {
          if ((a.y < L.y) === (b.y < L.y) || a.y === b.y) continue;
          const x = a.x + (b.x - a.x) * (L.y - a.y) / (b.y - a.y);
          if (x < L.x0 || x > L.x1) continue;
          const gw = w + 14, gh = L.h + 6;
          // 断口离线头不到 8px 时，干脆断到线头，不留一小截。
          let x0 = x - gw / 2, x1 = x + gw / 2;
          if (x0 - L.x0 < 8) x0 = L.x0 - 1;
          if (L.x1 - x1 < 8) x1 = L.x1 + 1;
          html += `<rect x="${x0.toFixed(1)}" y="${(L.y - gh / 2).toFixed(1)}" width="${+(x1 - x0).toFixed(1)}" height="${gh.toFixed(1)}" fill="#fff"/>`;
        }
        // 斜线：求两段的交点，白块顺着斜线的方向摆。
        for (const L of slants) {
          const dx = b.x - a.x, dy = b.y - a.y, ex = L.x1 - L.x0, ey = L.y1 - L.y0, den = dx * ey - dy * ex;
          if (!den) continue;
          const t = ((L.x0 - a.x) * ey - (L.y0 - a.y) * ex) / den, u = ((L.x0 - a.x) * dy - (L.y0 - a.y) * dx) / den;
          if (t < 0 || t >= 1 || u < 0 || u > 1) continue;
          const len = Math.hypot(ex, ey), x = a.x + t * dx, y = a.y + t * dy, sin = Math.abs(den) / Math.hypot(dx, dy) / len;
          const gw = (w + 14) / Math.max(.3, sin), gh = L.h + 6, deg = Math.atan2(ey, ex) * 180 / Math.PI;
          // 顺着斜线量：断口离线头不到 8px 时，断到线头。
          const back = u * len - gw / 2 < 8 ? u * len + 1 : gw / 2, ahead = (1 - u) * len - gw / 2 < 8 ? (1 - u) * len + 1 : gw / 2;
          html += `<rect x="${(x - back).toFixed(1)}" y="${(y - gh / 2).toFixed(1)}" width="${(back + ahead).toFixed(1)}" height="${gh.toFixed(1)}" fill="#fff" transform="rotate(${deg.toFixed(2)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
        }
        a = b;
      }
    });
    if (gaps.innerHTML !== html) gaps.innerHTML = html;
  }
  let curveFrame = 0;
  // 曲线和底色矩形：版面调试改了（写在 <head> 里的样式表）或版面变了，都重画一次。
  const scheduleCurves = () => { if (curveFrame) return; curveFrame = requestAnimationFrame(() => { curveFrame = 0; drawCurves(); clipNode(); placeConds(); syncHl(); document.querySelectorAll('.displacement-story svg[data-moments], .displacement-story svg[data-disp-marks]').forEach(fitTags); }); };
  window.addEventListener('resize', scheduleCurves);
  // 版面调试改了曲线（写在 <head> 里的样式表）或版面变了：重画。
  new MutationObserver(scheduleCurves).observe(document.head, { childList: true, subtree: true, characterData: true });
  if ('ResizeObserver' in window) new ResizeObserver(scheduleCurves).observe(document.getElementById('app'));

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

  // 两个模型B点的转角标记与Z₁：灰虚线为原位置，彩色线随Z₁转动；
  // 中间折线连接彩色线与灰虚线，转角为0时不画，转角越大越长（最大转角时与原来的固定大小一致）。
  // split：右图换成拆开的小方块（D-R）时，B点在图中更靠上、靠右，标记和Z₁随之挪过去。
  function rotationMarks(split = false) {
    const a = Math.atan2(state.frame / 19 * 13 * 2, 78), r = 55;
    const leg = r * Math.sin(a) / (Math.cos(a) + Math.sin(a)); // 末端恰好落在灰虚线上
    const angle = -a * 180 / Math.PI;
    const mark = (x, y, color) => `<g fill="none" stroke-width="4"><path d="M${x},${y} h78" stroke="#999" stroke-dasharray="5 3"/><g transform="translate(${x} ${y}) rotate(${angle})" stroke="${color}"><path d="M0,0 H78${leg > .5 ? ` M${r},0 V${leg.toFixed(2)} H${(r - leg).toFixed(2)}` : ''}"/></g></g>`;
    // Z₁ 跟着转：放在两条线夹角的平分线上、线端外侧，转角为0时就在两线的延长线上。
    const label = (x, y, color) => `<text x="${(x + 84 * Math.cos(a / 2)).toFixed(2)}" y="${(y - 84 * Math.sin(a / 2)).toFixed(2)}" dominant-baseline="central" fill="${color}">Z₁</text>`;
    const [rx, ry] = split ? [840.3, 62.6] : [830, 90];
    return `<g font-family="Cambria,serif" font-style="italic" font-size="48" font-weight="bold">${label(269, 90, '#d86323')}${label(rx, ry, '#315795')}</g>
      ${mark(269, 90, '#d86323')}${mark(rx, ry, '#315795')}`;
  }

  // 左右两组模型的说明文字（仿 BEAM-02-A1-2.svg）：放在模型下方；（未知）（已知）垫浅色底。
  // 底色先按字数估位，进入页面后再按实际字形量准（fitTags）。
  // 两句话（labelLeft、labelRight）和两块底色（tagLeft、tagRight）在版面调试里各自单独调。
  function sideLabels(left, right, y, size) {
    const tag = (x, fill, side) => `<rect data-disp-tag data-disp-element="tag${side}" x="${x}" y="${y - size * .9}" width="${size * 4}" height="${size * 1.15}" rx="${size * .15}" fill="${fill}"/>`;
    const text = (side, x, attrs, body) => `<text data-disp-tag data-disp-element="label${side}" x="${x}" y="${y}" font-size="${size}" data-x="${x}" data-y="${y}" data-size="${size}" ${attrs} xml:space="preserve">${body}</text>`;
    const num = 'font-family="Times New Roman,Liberation Serif,serif" font-size="1.14em"';
    return `<g font-family="Microsoft YaHei,sans-serif" font-weight="bold" data-disp-element="sideLabels">${tag(left + size * 6, '#fcdcc6', 'Left')}${tag(right - size * 4, '#d5e5f6', 'Right')}`
      + text('Left', left, 'fill="#d16022"', '待求解的 原结构 (未知)')
      + text('Right', right, 'text-anchor="end" fill="#2f5597"', `用 <tspan fill="#000">第</tspan><tspan ${num} fill="#d16022">1/2/3</tspan><tspan fill="#000">根梁</tspan> 拼出来的结构<tspan>（已知）</tspan>`) + '</g>';
  }
  // 两句话：版面调试改的位置、大小写在变量 --disp-ldx（左右）、--disp-ldy（上下）、--disp-lsize（大小 %）里，单位同图内坐标；颜色直接改 fill。
  // 底色只垫在末尾“（未知）”“（已知）”四个字下面，跟着字走。版面调试里调过底色的位置、大小时，
  // 改动写在变量 --disp-tdx（左右）、--disp-tdy（上下）、--disp-tdw（加宽）、--disp-tdh（加高）里，单位同图内坐标。
  function fitTags(svg) {
    const rects = svg.querySelectorAll('rect[data-disp-tag]'), texts = svg.querySelectorAll('text[data-disp-tag]');
    const vars = el => { const cs = getComputedStyle(el); return key => { const x = parseFloat(cs.getPropertyValue(`--disp-${key}`)); return Number.isFinite(x) ? x : 0; }; };
    texts.forEach((text, i) => {
      const lv = vars(text), scale = (lv('lsize') || 100) / 100;
      const fs = Number(text.dataset.size) * scale, ty = Number(text.dataset.y) + lv('ldy');
      text.setAttribute('x', (Number(text.dataset.x) + lv('ldx')).toFixed(2));
      text.setAttribute('y', ty.toFixed(2));
      // 页面统一字号（typography）会强制画布里文字的字号；改了「大小」时，在它的基础上按比例放大缩小（整句话一起变）。
      text.style.removeProperty('font-size');
      text.querySelectorAll('tspan').forEach(t => t.style.removeProperty('font-size'));
      if (Math.abs(scale - 1) > 1e-3) {
        const base = parseFloat(getComputedStyle(text).fontSize) || Number(text.dataset.size);
        text.style.setProperty('font-size', `${(base * scale).toFixed(2)}px`, 'important');
        text.querySelectorAll('tspan').forEach(t => t.style.setProperty('font-size', 'inherit', 'important'));
      }
      const rect = rects[i], v = vars(rect);
      rect.setAttribute('y', (ty - fs * .9 + v('tdy')).toFixed(2));
      rect.setAttribute('height', Math.max(1, fs * 1.15 + v('tdh')).toFixed(2));
      try {
        const n = text.getNumberOfChars(), a = text.getExtentOfChar(n - 4), b = text.getExtentOfChar(n - 1);
        if (!a.width) return;
        rect.setAttribute('x', (a.x - 2 + v('tdx')).toFixed(2));
        rect.setAttribute('width', Math.max(1, b.x + b.width - a.x + 4 + v('tdw')).toFixed(2));
      } catch (_) { /* 未显示时量不到，保留估位 */ }
    });
  }
  // 右图拆开（D-R）时，右边木柱和支座更靠下，右边那句话收到支座左边、字小一点，免得压在支座上。
  const marksLayer = split => rotationMarks(split) + (split ? sideLabels(12, 700, 466, 25) : sideLabels(12, 925, 466, 29));

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
    svg.innerHTML = `<defs><marker id="red-tip" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto-start-reverse"><path d="M0,0 L7,3.5 L0,7" fill="#ff2934"/></marker><marker id="blue-tip" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto-start-reverse"><path d="M0,0 L7,3.5 L0,7" fill="#2543fa"/></marker></defs>
      ${two ? diagram(23, '#e97933') : ''}${diagram(515, '#3b69ac')}
      <g class="disp-mlines" fill="none" stroke-width="2.5" stroke-dasharray="6 3">
        ${line('right-red', 785, 120, 639, redY)}${line('right-blue', 834, 146, 670 + blueX, 260)}
        ${two ? line('cross-red', 639, redY, 147, redY) + line('cross-blue', 670 + blueX, 260, 178 + blueX, 260) : ''}
        ${connect ? line('left-red', 147, redY - 5, 234, 115) + line('left-blue', 178 + blueX, 255, 273, 141) + line('cut-red', 226, 72, 242, 148, 0) + line('cut-blue', 242, 148, 315, 133, 0) : ''}
      </g>
      ${rotationMarks()}
      ${svg.closest('.disp-mini') ? '' : sideLabels(12, 925, 466, 29)}`;
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
  function pair({ split = false, moments = 0, connect = false, mini = false, overlay = false, marks = false } = {}) {
    return `<div class="disp-pair ${mini ? 'disp-mini' : ''}" data-disp-element="${mini ? 'compactCompare' : 'compare'}">
      ${img(frameName('L'), 'disp-layer disp-frame-left', '待求解的对象', 'left')}
      ${img(frameName(split ? 'D-R' : 'R'), 'disp-layer disp-frame-right', '转动B点嵌固的基础', 'right')}
      ${moments ? `<svg class="disp-layer disp-moments" viewBox="0 0 945 480" style="overflow:visible" data-moments="${moments}" data-connect="${connect}" data-disp-element="moments"${!mini && pinHides('moments') ? ' data-pin-off' : ''} role="img" aria-label="随转角变化的弯矩图"></svg>` : ''}
      ${overlay ? img('BEAM-02-A2-0.png', 'disp-layer', '单跨梁的载常数与形常数', 'overlay') : ''}
      ${marks ? `<svg class="disp-layer" viewBox="0 0 945 480" style="overflow:visible" data-disp-marks aria-hidden="true">${marksLayer(split)}</svg>` : ''}
    </div>`;
  }
  function scene() {
    const g = current();
    if (g.id === 'A1-3') return pair({ split: state.sub === 1, marks: true }); // 不再叠「三根梁弯矩图」那张图（BEAM-02-A2-0）
    if (g.id === 'A2-0') return pair({ split: true, marks: true });
    if (g.id === 'A2-1' && state.sub < 3) return pair({ moments: state.sub ? 2 : 1, connect: state.sub === 2 });
    if ((g.id === 'A2-1' && state.sub === 3) || g.solution) {
      // 用原图的比例裁切隐藏静态右上角，替换同名原图即生效，无派生PNG。
      const file = g.id === 'A2-1' ? 'BEAM-02-A2-1-(4).png' : `BEAM-02-${g.id}.png`;
      return `${img(file, 'disp-layer disp-node-source', '小方块隔离体及杆端弯矩关系', 'overlay')}${pair({ moments: 2, connect: true, mini: true })}${hlFrames()}`;
    }
    const spot = CONDS_SHOW[g.id]?.[state.sub] === 'big' ? condsSpot() : '';
    return img(picFile(g, state.sub), 'disp-layer', g.titles?.[state.sub] || g.title, 'image') + spot + revealHtml();
  }
  // A2-2 第5、6个分镜，A2-3 点圆以后：弯矩图先用「第n根梁」卡片盖住，公式里对应的那一项也先遮住；
  // 点卡片，卡片和遮挡一起淡出，露出弯矩图和那一项。只在本机画面上，换分镜后复原。
  // 位置按图宽、图高的 %：[左, 上, 宽, 高]；card 盖弯矩图，mask 盖公式里的那一项。版面调试里可调。
  const REVEALS = {
    'A2-2:4': { n: 1, card: [52.8, 47, 16.2, 18.8], mask: [66, 82.8, 10.6, 13.9] },   // 盖住 1/12ql² 的弯矩图和「−1/12ql²」
    'A2-2:5': { n: 2, card: [52.8, 65.4, 16.2, 16.7], mask: [77.3, 83, 10.4, 13.7] }, // 盖住 4i·Z₁ 的弯矩图和「+4i·Z₁」
    'A2-3:1': { n: 3, card: [52.8, 54.2, 16.2, 18.8], mask: [72.3, 83, 16.4, 13.7] }      // A2-3 点圆以后（第5张图）：盖住 3i·Z₁ 的弯矩图和「3i·Z₁」
  };
  const reveal = { key: '', open: false };
  const boxStyle = ([l, t, w, h]) => `left:${l}%;top:${t}%;width:${w}%;height:${h}%`;
  function revealHtml() {
    const r = REVEALS[subKey()];
    if (!r) return '';
    const open = reveal.key === subKey() && reveal.open ? ' open' : '';
    return `<div class="disp-reveal-mask${open}" data-disp-element="revealMask${r.n}" style="${boxStyle(r.mask)}" aria-hidden="true"></div>`
      + `<div class="disp-reveal-card${open}" data-disp-element="revealCard${r.n}" style="${boxStyle(r.card)}" role="button" tabindex="0" aria-label="点一下，看第${r.n}根梁的弯矩"><span>第<b>${r.n}</b>根梁</span></div>`;
  }
  function openReveal() {
    Object.assign(reveal, { key: subKey(), open: true });
    document.querySelectorAll('.disp-reveal-card, .disp-reveal-mask').forEach(el => el.classList.add('open'));
  }
  // 第 sub 个分镜的主图：A2-2、A2-3 是 BEAM-02-A2-2-1…；其余是 BEAM-02-A1-0-(1)…（按分镜编号）。
  function picFile(g, sub) {
    if (g.seq) return `BEAM-02-${g.id}-${g.frames ? g.frames[sub] : sub + 1}.png`;
    return `BEAM-02-${g.id}${g.count > 1 ? `-(${sub + 1})` : ''}.png`;
  }
  // 「2个条件」框放大摆在画面中间时的位置（看不见的占位框；版面调试里调它的位置、宽度，高度按框的比例自动定）。
  const condsSpot = () => '<div class="disp-conds-spot" data-disp-element="condsSpot" aria-hidden="true"></div>';
  // A2-5：点「变形一致」出现红框（框住右上角两组模型），点「内力一致」出现蓝框（框住左边B点）。
  const hlFrames = () => !CLICK_FRAMES[activeId] ? '' : [1, 2].map(n => `<div class="disp-hl${hl.page === activeId && hl.on[n - 1] ? ' on' : ''}" data-hl="${n}" data-disp-element="${n === 1 ? 'hlDeform' : 'hlForce'}" aria-hidden="true"></div>`).join('');
  // 分镜圆球：不再显示「A1-1 · 5 / 7」这行字。A2-1 第3、4个、A1-0 第3、4个圆球之间是一段进度条（拖动时显示转场进度）。
  // 圆球都不写编号；大小各页统一（displacement.css 里的 --disp-dot-size，版面调试的「分镜圆球大小」可改）。
  function dots() {
    const g=current(); if(g.count<2)return '';
    // 只有一个圆的页（A2-3）：圆画在原来最后一个圆的位置，点一下在两个分镜之间切换。
    if(g.single)return `<div class="disp-substeps disp-substeps-single" data-disp-element="substeps"><div class="disp-dot-track disp-dot-single" role="button" tabindex="0" aria-pressed="${state.sub>0}" aria-label="${g.id}：点一下显示下一个画面，再点一下回来"><span class="disp-dot ${state.sub>0?'active':''}"></span></div></div>`;
    const parts=[], at=MORPHS[g.id]?.at;
    for(let i=0;i<g.count;i++){
      parts.push(`<span class="disp-dot ${i===state.sub?'active':''}"></span>`);
      if(i<g.count-1)parts.push(i===at
        ?`<span class="disp-dot-gap disp-morph-bar" style="--disp-morph:${state.sub>at?1:0}" aria-hidden="true"><span class="disp-morph-fill"></span><span class="disp-morph-thumb"></span></span>`
        :'<span class="disp-dot-gap" aria-hidden="true"></span>');
    }
    return `<div class="disp-substeps" data-disp-element="substeps"><div class="disp-dot-track" role="slider" tabindex="0" aria-label="${g.id}分镜，可点击、拖动或用方向键切换" aria-valuemin="1" aria-valuemax="${g.count}" aria-valuenow="${state.sub+1}">${parts.join('')}</div></div>`;
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
    const dynamic=g.dynamic||g.control, before=rendered;
    if(cycle.key!==subKey())Object.assign(cycle,{key:subKey(),use:null}); // 换了页或分镜：顶部矩形恢复默认
    if(hl.page!==activeId)Object.assign(hl,{page:activeId,on:[false,false]}); // 换了页：A2-5 的红、蓝框收起
    if(reveal.key!==subKey())Object.assign(reveal,{key:subKey(),open:false}); // 换了分镜：「第n根梁」卡片重新盖上
    if(pin.key!==subKey())Object.assign(pin,{key:subKey(),on:false}); // 换了分镜：页内的圆复位，它管的内容重新藏起来
    const head=headHtml(), refocus=document.activeElement?.classList?.contains('disp-dot-track');
    document.getElementById('app').innerHTML=`<section class="panel force-story displacement-story ${value.stage===3?'deformation-story':''} ${head?'disp-has-head':''}" data-reveal-step="${value.stage===2?value.force_reveal_step:value.deformation_reveal_step}" data-disp-controlled="${Boolean(dynamic)}"><h1${g.count>1?` data-disp-title="${state.sub+1}"`:''}>${g.titles?.[state.sub]||g.title}</h1>${head}${curvesHtml()}<div class="force-composition"><div class="force-free-canvas" data-disp-substep="${state.sub}" aria-label="位移法图片与交互画布"><div class="disp-scene" data-disp-element="scene"><div class="disp-aspect ${g.id.startsWith('A1')&&!g.dynamic?'disp-wide':''}">${scene()}</div></div>${dots()}${pinHtml('canvas')}</div>${dynamic?controls():''}</div></section>`;
    rendered=`${activeId}:${state.sub}`;
    if(before!==rendered)Object.assign(extra,{key:subKey(),done:0,undo:[]}); // 换了分镜：翻页笔的页内动作重新开始
    stopMorph(); morph.t=MORPHS[activeId]&&state.sub>MORPHS[activeId].at?1:0;
    // A1-0：从第2个分镜点到第3个，中间的「2个条件」框淡入。
    if(CONDS_SHOW[activeId]?.[state.sub]==='big'&&before===`${activeId}:${state.sub-1}`)document.querySelector('.disp-head')?.classList.add('disp-conds-enter');
    bind(); refresh(); paintAi(); fitAspect(); placeConds(); syncHl(); scheduleCurves();
    if(refocus)document.querySelector('.disp-dot-track')?.focus({preventScroll:true}); // 用方向键翻分镜时，重画后还能接着按
    MORPHS[activeId]?.preload?.();
    if (g.seq) preloadSeq(g);
    // 配图载入后版面会变：再画一次曲线。
    document.querySelectorAll('.disp-head-image, .disp-scene img').forEach(image => { if (!image.complete) image.addEventListener('load', scheduleCurves, { once: true }); });
  }
  function update(value) {
    const id=identity(value), g=groups.find(x=>x.id===id);if(!g || id==='A2-6')return;
    const sub=Math.min(g.count-1,Number(value.displacement_substep||0));
    const target=`${id}:${sub}`;
    if(morph.pending===target)return; // 转场正在播放，播完再换页
    if(morph.active&&target===rendered)return; // 课堂状态没变（定时刷新），转场继续
    if(morph.active&&!morph.dragging)stopMorph();
    // 有转场的两个分镜（A2-1 第3、4个，A1-0 第3、4个）之间点圆球或用方向键切换：也播放转场（拖动时由拖动控制）。
    const at=MORPHS[id]?.at, a=`${id}:${at}`, b=`${id}:${at+1}`;
    if(at!=null&&!morph.dragging&&document.querySelector('.displacement-story')&&((rendered===a&&target===b)||(rendered===b&&target===a))){
      playMorph(target===b?1:0,()=>{render(value);if(typeof mountSelfGuidedNavigation==='function')mountSelfGuidedNavigation();},target);return;
    }
    if(!document.querySelector('.displacement-story') || rendered!==target) {render(value); if(typeof mountSelfGuidedNavigation==='function')mountSelfGuidedNavigation();return;}
    const frame=Number(value.displacement_frame||0);
    if(state.frame!==frame){state.frame=frame;refresh();}
  }
  function refresh() {
    const split=(activeId==='A1-3'&&state.sub===1)||activeId==='A2-0';
    document.querySelectorAll('.disp-frame-left').forEach(el=>{el.src=asset(frameName('L'));});
    document.querySelectorAll('.disp-frame-right').forEach(el=>{el.src=asset(frameName(split?'D-R':'R'));});
    document.querySelectorAll('[data-moments]').forEach(svg=>{moments(svg);fitTags(svg);});
    document.querySelectorAll('[data-disp-marks]').forEach(svg=>{svg.innerHTML=marksLayer(split);fitTags(svg);});
    if(document.querySelector('.disp-curves'))scheduleCurves(); // 箭头穿过转角标记处的白色断口跟着 Z₁ 走
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
    document.querySelectorAll('.disp-beam[data-cycle]').forEach(cell=>cell.addEventListener('click',cycleBeams));
    document.querySelectorAll('[data-disp-pin]').forEach(button=>button.addEventListener('click',()=>setPin(!pinOn())));
    document.querySelectorAll('.disp-reveal-card').forEach(card=>{
      card.addEventListener('click',openReveal);
      card.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openReveal();}});
    });
    document.querySelectorAll('.disp-cond[data-click]').forEach(item=>{
      item.addEventListener('click',()=>toggleHl(Number(item.dataset.dispCond)));
      item.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleHl(Number(item.dataset.dispCond));}});
    });
    const track=document.querySelector('.disp-dot-track');if(!track)return;
    if(track.classList.contains('disp-dot-single')){
      const toggle=async()=>{await change({type:'set_displacement_substep',value:state.sub>0?0:1});document.querySelector('.disp-dot-single')?.focus({preventScroll:true});};
      track.addEventListener('click',toggle);
      track.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();toggle();}});
      return;
    }
    track.addEventListener('pointerdown',event=>{
      if(event.button!==0)return;event.preventDefault();
      // 按各圆球的实际圆心换算位置（A2-1 第3、4个圆球之间更宽）。
      const centers=[...track.querySelectorAll('.disp-dot')].map(dot=>{const r=dot.getBoundingClientRect();return r.left+r.width/2;});
      drag={centers,count:current().count,last:state.sub,moved:false};dragTo(event.clientX);
    });
    track.addEventListener('keydown',async event=>{
      const next=event.key==='Home'?0:event.key==='End'?current().count-1:['ArrowRight','ArrowUp'].includes(event.key)?state.sub+1:['ArrowLeft','ArrowDown'].includes(event.key)?state.sub-1:null;
      if(next===null)return;event.preventDefault();await change({type:'set_displacement_substep',value:Math.max(0,Math.min(current().count-1,next))});document.querySelector('.disp-dot-track')?.focus();
    });
  }
  // 顶部的梁：点一下按 遮罩 → 描边框 → 不显示 轮换（同一组的几根梁一起换），盖过版面调试里的设置，只在本机画面上。
  const beamVars = u => `--db-cover:${u === 1 ? 'block' : 'none'} !important;--db-frame:${u === 2 ? 'block' : 'none'} !important`;
  function cycleBeams() {
    const cells = [...document.querySelectorAll('.disp-beam[data-cycle]')];
    if (!cells.length) return;
    const cs = getComputedStyle(cells[0]);
    const now = cs.getPropertyValue('--db-cover').trim() === 'block' ? 1 : cs.getPropertyValue('--db-frame').trim() === 'block' ? 2 : 0;
    const next = now === 1 ? 2 : now === 2 ? 0 : 1;
    Object.assign(cycle, { key: subKey(), use: next });
    cells.forEach(cell => { cell.dataset.use = next; cell.setAttribute('style', beamVars(next)); });
  }
  // A2-5：点「2个条件」里的一条，出现（或收起）对应的框；这一条的字和左边竖条变成框的颜色，并放大闪一下，提醒大家看。
  const flash = (el, cls, ms) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); clearTimeout(el._flash); el._flash = setTimeout(() => el.classList.remove(cls), ms); };
  function toggleHl(n) {
    if (!CLICK_FRAMES[activeId]) return;
    hl.page = activeId; hl.on[n - 1] = !hl.on[n - 1];
    const frame = document.querySelector(`.disp-hl[data-hl="${n}"]`), item = document.querySelector(`.disp-cond[data-disp-cond="${n}"]`);
    if (frame) { frame.classList.toggle('on', hl.on[n - 1]); if (hl.on[n - 1]) flash(frame, 'disp-flash', 1900); }
    syncHl();
    if (item) flash(item, 'disp-pop', 1100);
  }
  function syncHl() {
    if (!CLICK_FRAMES[activeId]) return;
    [1, 2].forEach(n => {
      const item = document.querySelector(`.disp-cond[data-disp-cond="${n}"]`), frame = document.querySelector(`.disp-hl[data-hl="${n}"]`);
      if (!item || !frame) return;
      const on = hl.page === activeId && hl.on[n - 1], color = on ? getComputedStyle(frame).borderTopColor : '';
      item.classList.toggle('disp-hl-on', on);
      if (on) { item.style.setProperty('--dm-fg', color, 'important'); item.style.setProperty('--dm-bar', color, 'important'); }
      else { item.style.removeProperty('--dm-fg'); item.style.removeProperty('--dm-bar'); }
    });
  }
  let drag=null;
  function dragTo(x){
    if(!drag)return;
    const c=drag.centers;let pos=x<=c[0]?0:c.length-1;
    for(let i=0;i<c.length-1;i++)if(x>c[i]&&x<=c[i+1]){pos=i+(x-c[i])/(c[i+1]-c[i]);break;}
    // A2-1、A1-0：在第3、4个圆球之间拖动时，画面跟着连续变化（转场），松手再落到较近的那个分镜。
    const at=MORPHS[activeId]?.at;
    if(at!=null&&drag.moved&&pos>at&&pos<at+1){
      if(!morph.active&&!startMorph())return;
      if(morph.raf){cancelAnimationFrame(morph.raf);morph.raf=0;morph.pending='';} // 正在自动播放的转场让给拖动
      morph.dragging=true;setMorph(pos-at);return;
    }
    const sub=Math.round(pos);
    // 拖出了第3、4个圆球之间：转场停在端点，再按正常分镜重画。
    if(morph.active){setMorph(pos>=at+1?1:0);stopMorph();rendered='';drag.last=sub;change({type:'set_displacement_substep',value:sub});return;}
    if(sub!==drag.last){drag.last=sub;change({type:'set_displacement_substep',value:sub});}
  }
  function endDrag(){
    if(morph.active&&morph.dragging){
      morph.dragging=false;
      const at=MORPHS[activeId].at, sub=morph.t>=.5?at+1:at;
      playMorph(sub>at?1:0,()=>{stopMorph();rendered='';change({type:'set_displacement_substep',value:sub});},`${activeId}:${sub}`,500);
    }
    drag=null;
  }
  window.addEventListener('pointermove',e=>{if(drag){e.preventDefault();drag.moved=true;dragTo(e.clientX);}});
  window.addEventListener('pointerup',endDrag);window.addEventListener('pointercancel',endDrag);

  /* A2-1 第3→4分镜的转场：t 从 0 到 1。
     前一半：整组双图缩小到右上角（第4分镜里右上角双图的位置）；
     后一半：原结构B点的部分（红、蓝截面虚线围出的那块）从左图上分出来，一边往左下移动一边放大，
     最后和第4分镜左边的B点大图重合（交叉淡入），落成第4分镜原有的画面。
     位置都按第4分镜实际排好的版面量出来，版面调试改过右上角双图的位置也能对上。 */
  const PAIR_B = [273.8, 92.2];   // 双图里左边原结构B点（黑方块中心），图内坐标（945×480）
  const NODE_B = [311.5, 202];    // BEAM-02-A2-1-(4) 里B点大图的黑方块中心，同一坐标
  const NODE_SCALE = 4.03;        // 大图黑方块边长 ÷ 双图里黑方块边长
  const PIECE_CLIP = [[226, 82.8], [242, 148], [315, 133], [315, 58], [266, 58], [266, 82.8]]; // 沿红、蓝截面虚线切出的B点部分（不带均布荷载的箭头）
  const morph = { active: false, dragging: false, t: 0, raf: 0, pending: '', geo: null };
  const ease = u => u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
  const clamp01 = u => Math.max(0, Math.min(1, u));
  // 只有一张主图的页（A1-0～A1-2、A2-1-(4)、A2-2～A2-5）：画面框按这张图本身的宽高比，图换宽了也不留白。
  // 右上角小双图（A2-1-(4)、A2-4、A2-5）保持原来的大小、贴右上角；大图上被它盖住的那块按小双图的实际位置裁掉。
  // 右上角小双图（945×480 的双图缩到 52.6%，宽 497 个图内单位）在大图里的左边位置（图内单位）。
  // 25 cm 的图（宽 945）在 448；30 cm 的图（宽 1133.5，A2-2～A2-5）整体右移了 113.5，在 561.5。其他宽度按同样比例推。
  const miniLeft = units => 448 + (units - 945) * .6;
  // A2-1-(4) 还是 25 cm 的图：画面框按后面 A2-2 的宽度排（B点大图按原尺寸靠左），这样翻到 A2-2 时相同的部分不动。
  function frameUnits(nw, nh) {
    return activeId === 'A2-1' && wideSize.w ? Math.max(nw, wideSize.w / wideSize.h * nh) : nw;
  }
  function fitAspect(known) {
    const box = document.querySelector('.disp-aspect');
    const pic = box?.querySelector(':scope > img.disp-layer');
    if (!pic) return;
    known = known || naturalSize.get(pic.src);
    const apply = () => {
      const nw = known?.w || pic.naturalWidth, nh = known?.h || pic.naturalHeight;
      if (!nw || !nh || !box.isConnected) return;
      const fw = frameUnits(nw, nh), wider = fw > nw + 1;
      box.style.setProperty('--disp-ar', (fw / nh).toFixed(5));
      if (wider) pic.style.width = `${(nw / fw * 100).toFixed(3)}%`; else pic.style.removeProperty('width');
      const mini = box.querySelector('.disp-mini'), units = fw / nh * 480;
      if (mini && Math.abs(units - 945) > 2) { mini.style.width = `${(497.07 / units * 100).toFixed(3)}%`; mini.style.left = `${(miniLeft(units) / units * 100).toFixed(3)}%`; }
      // 大图上被右上角小双图盖住的那块裁掉：图比画面框窄时按它自己原来的位置裁，否则按小双图实际的位置裁。
      if (wider && pic.classList.contains('disp-node-source')) { pic.dataset.ownClip = '1'; pic.style.clipPath = 'polygon(0 0,47.4% 0,47.4% 52.7%,100% 52.7%,100% 100%,0 100%)'; }
      else { delete pic.dataset.ownClip; clipNode(); }
    };
    if (known || pic.complete) apply(); else pic.addEventListener('load', () => { apply(); scheduleCurves(); }, { once: true });
  }
  // A2-1 就先把第4分镜的大图和 A2-2 的图读进来，转场一开始就知道它们的宽高。
  const nodeSize = { w: 0, h: 0 }, wideSize = { w: 0, h: 0 };
  function preloadNode() {
    const load = (name, size) => {
      if (size.w) return;
      const image = new Image();
      image.onload = () => { size.w = image.naturalWidth; size.h = image.naturalHeight; if (activeId === 'A2-1' && !morph.active) fitAspect(); };
      image.src = asset(name);
    };
    load('BEAM-02-A2-1-(4).png', nodeSize);
    load('BEAM-02-A2-2-1.png', wideSize);
  }
  // A2-2、A2-3：进页就把各分镜的图读进来，记下宽高；切分镜时画面框直接按这个宽高排，不闪、不跳。
  const naturalSize = new Map();
  function preloadSeq(g) {
    for (let i = 0; i < g.count; i++) {
      const url = asset(picFile(g, i));
      if (naturalSize.has(url)) continue;
      const image = new Image();
      image.onload = () => naturalSize.set(url, { w: image.naturalWidth, h: image.naturalHeight });
      image.src = url;
    }
  }
  function clipNode() {
    const box = document.querySelector('.disp-aspect'), node = box?.querySelector(':scope > .disp-node-source'), mini = box?.querySelector('.disp-mini');
    if (!node || !mini || morph.active || node.dataset.ownClip) return;
    const b = node.getBoundingClientRect(), m = mini.getBoundingClientRect();
    if (!b.width || !b.height) return;
    const lp = ((m.left - b.left) / b.width * 100).toFixed(2), bp = ((m.bottom - b.top) / b.height * 100).toFixed(2);
    node.style.clipPath = `polygon(0 0,${lp}% 0,${lp}% ${bp}%,100% ${bp}%,100% 100%,0 100%)`;
  }
  function startNodeMorph() {
    const box = document.querySelector('.disp-aspect');
    if (!box) return false;
    const clip = PIECE_CLIP.map(([x, y]) => `${(x / 945 * 100).toFixed(2)}% ${(y / 480 * 100).toFixed(2)}%`).join(',');
    box.innerHTML = `${img('BEAM-02-A2-1-(4).png', 'disp-layer disp-node-source disp-morph-node', '小方块隔离体及杆端弯矩关系', 'overlay')}${pair({ moments: 2, connect: true, mini: true })}`
      + `<div class="disp-morph-piece" aria-hidden="true" style="clip-path:polygon(${clip})">${img(frameName('L'), 'disp-layer disp-frame-left')}</div>`;
    refresh(); fitAspect(nodeSize.w ? nodeSize : { w: 945, h: 480 });
    const mini = box.querySelector('.disp-mini'), b = box.getBoundingClientRect(), m = mini.getBoundingClientRect();
    const node = box.querySelector('.disp-morph-node'), natW = nodeSize.w || 945, natH = nodeSize.h || 480;
    // 第3分镜里整幅双图的位置：画面框里按 945×480 的比例居中（第4分镜的大图换宽了也能对上）。
    const sc = box.parentElement.getBoundingClientRect(), fw = Math.min(sc.width, sc.height * 945 / 480), fh = fw * 480 / 945;
    const full = { x: sc.left + (sc.width - fw) / 2 - b.left, y: sc.top + (sc.height - fh) / 2 - b.top, w: fw, h: fh };
    const piece = box.querySelector('.disp-morph-piece');
    piece.style.width = `${(b.height * 945 / 480).toFixed(2)}px`; piece.style.height = `${b.height.toFixed(2)}px`;
    // 右上角小双图不带底部那两句话；转场开头（双图还是整幅大小）先带着，缩小时淡出。
    const msvg = mini.querySelector('[data-moments]');
    if (msvg) { msvg.insertAdjacentHTML('beforeend', `<g class="disp-morph-labels">${sideLabels(12, 925, 466, 29)}</g>`); fitTags(msvg); }
    morph.geo = { W: b.width, H: b.height, mx: m.left - b.left, my: m.top - b.top, mw: m.width, mh: m.height, full, cN: b.width / frameUnits(natW, natH), natH };
    return true;
  }
  function setNodeMorph() {
    const box = document.querySelector('.disp-aspect'), g = morph.geo;
    if (!box) return;
    const mini = box.querySelector('.disp-mini'), node = box.querySelector('.disp-morph-node'), piece = box.querySelector('.disp-morph-piece');
    // 前一半：右上角双图从整幅大小缩到原位
    const u = ease(clamp01(morph.t / .5)), F = g.full;
    const s = (F.w + (g.mw - F.w) * u) / g.mw;
    mini.style.transformOrigin = '0 0';
    mini.style.transform = `translate(${(F.x + (g.mx - F.x) * u - g.mx).toFixed(2)}px,${(F.y + (g.my - F.y) * u - g.my).toFixed(2)}px) scale(${s.toFixed(5)})`;
    const labels = mini.querySelector('.disp-morph-labels');
    if (labels) labels.style.opacity = (1 - clamp01(morph.t / .3)).toFixed(3);
    // 后一半：B点部分先沿截面分开一点，再往左下移动、放大，和大图重合
    const v = clamp01((morph.t - .5) / .5), v1 = ease(clamp01(v / .15)), v2 = ease(clamp01((v - .15) / .85));
    // c0：切下来那块（按双图 945×480 排）每个图内单位多少 px；cN：B点大图每个图内单位多少 px。
    const c0 = g.H / 480, a = g.mw / 945, big = NODE_SCALE * g.cN;
    const bm = [g.mx + PAIR_B[0] * a, g.my + PAIR_B[1] * a], bn = [NODE_B[0] * g.cN, NODE_B[1] * g.cN];
    const gap = [-.025 * g.W * v1, .025 * g.W * v1];
    const cx = bm[0] + gap[0] + (bn[0] - bm[0] - gap[0]) * v2, cy = bm[1] + gap[1] + (bn[1] - bm[1] - gap[1]) * v2;
    const sig = a + (big - a) * v2;
    piece.style.transform = `translate(${(cx - sig * PAIR_B[0]).toFixed(2)}px,${(cy - sig * PAIR_B[1]).toFixed(2)}px) scale(${(sig / c0).toFixed(5)})`;
    piece.style.opacity = morph.t <= .5 ? 0 : (1 - clamp01((v - .6) / .3)).toFixed(3);
    const k = sig / big;
    node.style.transform = `translate(${(cx - k * bn[0]).toFixed(2)}px,${(cy - k * bn[1]).toFixed(2)}px) scale(${k.toFixed(5)})`;
    node.style.opacity = clamp01((v - .45) / .4).toFixed(3);
  }
  /* A1-0 第3→4分镜的转场：t 从 0 到 1。画面中间放大的「2个条件」框一边缩小、一边移回右上角原位；
     第1根梁指过来的箭头先淡出；后半段 A1-0-(3) 的图（和 (2) 同一张）淡出、A1-0-(4) 的图淡入，到第4分镜就是 A1-0-(4) 的画面。 */
  function startCondsMorph() {
    const box = document.querySelector('.disp-aspect'), head = document.querySelector('.disp-head'), g = current(), at = MORPHS[g.id].at;
    if (!box || !head) return false;
    box.innerHTML = img(picFile(g, at), 'disp-layer', '', 'image') + img(picFile(g, at + 1), 'disp-layer disp-morph-next') + condsSpot();
    fitAspect();
    if (!document.querySelector('.disp-curves')) { head.insertAdjacentHTML('afterend', curvesHtml(`${g.id}:${at}`)); drawCurves(); }
    head.classList.remove('disp-conds-enter');
    head.dataset.conds = 'big';
    morph.geo = condsGeo() || { k: 1, tx: 0, ty: 0 };
    return true;
  }
  function setCondsMorph(t) {
    const g = morph.geo, conds = document.querySelector('.disp-head > .disp-conds'), u = ease(t), k = g.k + (1 - g.k) * u;
    if (conds) conds.style.transform = `translate(${(g.tx * (1 - u)).toFixed(2)}px,${(g.ty * (1 - u)).toFixed(2)}px) scale(${k.toFixed(5)})`;
    const v = clamp01((t - .55) / .4), [a, b] = document.querySelectorAll('.disp-aspect > img.disp-layer');
    if (a) a.style.opacity = (1 - v).toFixed(3);
    if (b) b.style.opacity = v.toFixed(3);
    const curves = document.querySelector('.disp-curves');
    if (curves) curves.style.opacity = (1 - clamp01(t / .35)).toFixed(3);
  }
  // 「2个条件」框从右上角原位放大到画面中间占位框（condsSpot）的位置：左上角对齐，宽度一样。手机上不挪。
  const phone = () => window.matchMedia('(max-width: 699px)').matches;
  function condsGeo() {
    const conds = document.querySelector('.disp-head > .disp-conds'), spot = document.querySelector('.disp-conds-spot');
    if (!conds || !spot || phone()) return null;
    const keep = conds.style.transform;
    conds.style.transform = 'none';
    const n = conds.getBoundingClientRect();
    conds.style.transform = keep;
    if (!n.width || !n.height) return null;
    spot.style.aspectRatio = `${n.width.toFixed(2)} / ${n.height.toFixed(2)}`;
    const s = spot.getBoundingClientRect(), unit = n.width / (conds.offsetWidth || n.width);
    return { k: s.width / n.width, tx: (s.left - n.left) / unit, ty: (s.top - n.top) / unit };
  }
  function placeConds() {
    const head = document.querySelector('.disp-head'), conds = head?.querySelector(':scope > .disp-conds');
    if (!conds || morph.active) return;
    const geo = head.dataset.conds === 'big' ? condsGeo() : null;
    if (geo) conds.style.transform = `translate(${geo.tx.toFixed(2)}px,${geo.ty.toFixed(2)}px) scale(${geo.k.toFixed(5)})`;
    else conds.style.removeProperty('transform');
  }
  // 有转场的页：在第 at+1、at+2 个圆球之间（进度条上）拖动，或在这两个分镜之间切换。
  const MORPHS = {
    'A2-1': { at: 2, start: startNodeMorph, set: setNodeMorph, preload: preloadNode },
    'A1-0': { at: 2, start: startCondsMorph, set: setCondsMorph, preload: () => { const image = new Image(); image.src = asset('BEAM-02-A1-0-(4).png'); } }
  };
  function startMorph() {
    const m = MORPHS[activeId];
    if (!m || !m.start()) return false;
    morph.active = true;
    return true;
  }
  function setMorph(t) {
    morph.t = clamp01(t);
    const m = MORPHS[activeId];
    if (!m || !morph.geo) return;
    m.set(morph.t);
    // 圆球：离哪个分镜近，就亮哪个；两个圆球之间的进度条跟着走
    document.querySelectorAll('.disp-dot').forEach((dot, i) => dot.classList.toggle('active', i === (morph.t >= .5 ? m.at + 1 : m.at)));
    const bar = document.querySelector('.disp-morph-bar');
    if (bar) { bar.style.setProperty('--disp-morph', morph.t.toFixed(4)); bar.classList.toggle('moving', morph.t > 0 && morph.t < 1); }
  }
  function playMorph(to, done, pending = '', ms = 1600) {
    if (!morph.active && !startMorph()) { done(); return; }
    cancelAnimationFrame(morph.raf);
    morph.pending = pending;
    const from = morph.t, started = performance.now(), dur = Math.max(1, ms * Math.abs(to - from));
    const tick = now => {
      const p = clamp01((now - started) / dur);
      setMorph(from + (to - from) * p);
      if (p < 1) { morph.raf = requestAnimationFrame(tick); return; }
      morph.raf = 0; morph.pending = ''; morph.active = false; done();
    };
    morph.raf = requestAnimationFrame(tick);
  }
  function stopMorph() {
    cancelAnimationFrame(morph.raf);
    Object.assign(morph, { active: false, dragging: false, raf: 0, pending: '' });
  }
  // 翻页笔（2026-10-23，见 app.js「翻页笔」）：本页里能往前走的先走——「第n根梁」卡片先揭开、页内的圆（PINS）先点开；再换分镜。
  // （A2-5 先红框、再蓝框那两下，2026-10-25 起随 CLICK_FRAMES 一起去掉了。）
  // 走到本页头尾时返回 false，由 app.js 换页、换阶段。转场、A1-3 的 AI 动画播放时，按键不起作用（返回 true 吞掉）。
  // 往回翻时停在上一个分镜（或上一页）的最后状态：卡片揭开、页内的圆点开。
  // 2026-10-24 起，分镜里还有几步也交给翻页笔（EXTRAS）：A1-0 第7个分镜点一下顶部的梁（并在那里出一个点击波纹）；
  // A1-3 第1个分镜先点 AI、再滑一遍 Z₁；A2-1 第3个分镜滑一遍 Z₁；A2-4 点「定位平衡转角」。前进依次做，后退依次撤销。
  const EXTRAS = { 'A1-0:6': ['cycle'], 'A1-3:0': ['ai', 'sweep'], 'A2-1:2': ['sweep'], 'A2-4:0': ['locate'] };
  // A1-3 来回滑最后停在 Z₁ ≈ 0.019：Z₁ 一档 0.0012，0.019 附近只有第16档（0.01905），所以终点固定在这一档，每次随机的是来回的路线。
  // A2-1 第3个分镜的来回滑可以打断：滑的时候再按一下，立刻停住并进第4个分镜。
  const SWEEP_OPTS = { 'A1-3:0': { end: () => 16 }, 'A2-1:2': { interruptible: true } };
  const extra = { key: '', done: 0, undo: [] };
  let sweeping = false;
  const extraState = () => { if (extra.key !== subKey()) Object.assign(extra, { key: subKey(), done: 0, undo: [] }); return extra; };
  const cycled = () => cycle.key === subKey() && cycle.use != null;
  function extraDone(kind) {
    if (kind === 'cycle') return cycled();
    if (kind === 'ai') return aiState.done || aiState.running;
    return false;
  }
  // 点击波纹：画在第一根被轮换的梁（第2根梁）的正中，提示「在这里点了一下」
  function clickRipple(cells) {
    const rects = cells.slice(0, 1).map(cell => cell.getBoundingClientRect()).filter(r => r.width && r.height);
    if (!rects.length) return;
    const left = Math.min(...rects.map(r => r.left)), right = Math.max(...rects.map(r => r.right));
    const top = Math.min(...rects.map(r => r.top)), bottom = Math.max(...rects.map(r => r.bottom));
    const dot = document.createElement('div');
    dot.className = 'disp-click-ripple';
    dot.style.left = `${(left + right) / 2}px`; dot.style.top = `${(top + bottom) / 2}px`;
    dot.innerHTML = '<i></i>';
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 1400);
  }
  function restoreCycle() { Object.assign(cycle, { key: subKey(), use: null }); render(currentState); }
  function quickExtra(kind, ripple) {
    if (kind !== 'cycle') return undefined;
    const cells = [...document.querySelectorAll('.disp-beam[data-cycle]')];
    if (!cells.length) return null;
    cycleBeams();
    if (ripple) clickRipple(cells);
    return restoreCycle;
  }
  const setFrameValue = n => { const slider = document.querySelector('[data-disp-slider]'); if (slider && n != null) { slider.value = String(n); } return setFrame(n); };
  async function runExtra(kind) {
    const quick = quickExtra(kind, true);
    if (quick !== undefined) return quick;
    const from = state.frame;
    if (kind === 'ai') { await startAi(); return async () => { resetAi(); paintAi(); await setFrameValue(from); }; }
    if (kind === 'locate') { document.querySelector('[data-disp-equilibrium]')?.click(); return () => setFrameValue(from); }
    if (kind === 'sweep') {
      sweeping = true;
      try { await clickerSweep(document.querySelector('[data-disp-slider]'), SWEEP_OPTS[subKey()] || {}); } finally { sweeping = false; }
      return () => setFrameValue(from);
    }
    return null;
  }
  async function extraStep(dir) {
    const list = EXTRAS[subKey()];
    if (!list) return false;
    const ex = extraState();
    if (dir > 0) {
      while (ex.done < list.length && extraDone(list[ex.done])) { ex.undo.push(null); ex.done += 1; }
      if (ex.done >= list.length) return false;
      const undo = await runExtra(list[ex.done]);
      ex.undo.push(undo || (() => {}));
      ex.done += 1;
      return true;
    }
    while (ex.done > 0 && ex.undo[ex.done - 1] === null) { ex.undo.pop(); ex.done -= 1; }
    if (ex.done === 0) return false;
    ex.done -= 1;
    await ex.undo.pop()();
    return true;
  }
  // 往回翻落到有 EXTRAS 的分镜：不花时间的（点顶部的梁）直接做完，AI、滑动不重做。
  function landExtras() {
    const list = EXTRAS[subKey()];
    if (!list) return;
    const ex = extraState();
    for (const kind of list.slice(ex.done)) {
      if (extraDone(kind)) { ex.undo.push(null); ex.done += 1; continue; }
      const undo = quickExtra(kind, false);
      if (undo === undefined) break;
      ex.undo.push(undo || (() => {}));
      ex.done += 1;
    }
  }
  function closeReveal() {
    Object.assign(reveal, { key: subKey(), open: false });
    document.querySelectorAll('.disp-reveal-card, .disp-reveal-mask').forEach(el => el.classList.remove('open'));
  }
  function setHlAll(on) {
    if (!CLICK_FRAMES[activeId]) return;
    hl.page = activeId; hl.on = [on, on];
    document.querySelectorAll('.disp-hl').forEach(frame => frame.classList.toggle('on', on));
    syncHl();
  }
  async function clicker(dir) {
    const g = current();
    if (!g || !document.querySelector('.displacement-story')) return false;
    if (morph.active || morph.pending || aiState.running || sweeping) return true;
    const ex = EXTRAS[subKey()] ? extraState() : null;
    if (dir < 0 && ex && ex.done > 0 && await extraStep(dir)) return true;
    if (CLICK_FRAMES[activeId]) {
      const on = hl.page === activeId ? hl.on : [false, false];
      if (dir > 0 && !on[0]) { toggleHl(1); return true; }
      if (dir > 0 && !on[1]) { toggleHl(2); return true; }
      if (dir < 0 && on[1]) { toggleHl(2); return true; }
      if (dir < 0 && on[0]) { toggleHl(1); return true; }
    }
    if (REVEALS[subKey()]) {
      const opened = reveal.key === subKey() && reveal.open;
      if (dir > 0 && !opened) { openReveal(); return true; }
      if (dir < 0 && opened) { closeReveal(); return true; }
    }
    if (PINS[subKey()]) {
      const on = pinOn();
      if (dir > 0 && !on) { setPin(true); return true; }
      if (dir < 0 && on) { setPin(false); return true; }
    }
    if (dir > 0 && await extraStep(dir)) return true;
    const sub = state.sub + dir;
    if (sub < 0 || sub >= g.count) return false;
    await change({ type: 'set_displacement_substep', value: sub });
    if (dir < 0 && !morph.pending && REVEALS[subKey()]) openReveal();
    if (dir < 0 && !morph.pending && PINS[subKey()]) setPin(true);
    if (dir < 0 && !morph.pending) landExtras();
    return true;
  }
  function clickerEnd() {
    if (!document.querySelector('.displacement-story')) return;
    if (REVEALS[subKey()]) openReveal();
    if (PINS[subKey()]) setPin(true);
    setHlAll(true);
    landExtras();
  }
  const countOf = value => (value && (Number(value.stage) === 2 || Number(value.stage) === 3) && groups.find(x => x.id === identity(value))?.count) || 1;
  window.BEAM_DISPLACEMENT={render,update,asset,clicker,clickerEnd,countOf};
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
