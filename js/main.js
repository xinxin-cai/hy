// ===== 生长周期数据 =====
var growthData = [
  { name:'育苗附着期',img:'baoyu1.jpg',labels:['第1天','第3天','第5天','第7天','第9天','第11天','第13天','第14天','第15天','第15天'],params:{ temp:'20–24°C',period:'1–15天',desc:'鲍鱼幼虫附着在采苗板上，分泌足丝固定，开始底栖生活',care:'保持水质稳定，提供充足的附着基，控制光照强度' },values:[2,5,12,20,28,35,42,48,55,62] },
  { name:'稚贝生长期',img:'baoyu2.jpg',labels:['第15天','第20天','第25天','第30天','第35天','第40天','第45天','第50天','第55天','第60天'],params:{ temp:'21–25°C',period:'15–60天',desc:'稚贝壳长增长明显，开始摄食附着性硅藻，群体生长分化',care:'适时分苗，调节养殖密度，保证饵料充足供应' },values:[55,70,90,115,140,165,190,215,240,260] },
  { name:'幼鲍培育期',img:'baoyu3.jpg',labels:['第2月','第2.5月','第3月','第3.5月','第4月','第4.5月','第5月','第5.5月','第6月','第6月'],params:{ temp:'20–26°C',period:'2–6月',desc:'幼鲍转入海上吊笼培育，壳长继续增长，摄食转向大型海藻',care:'定期清洗吊笼，防控敌害生物，关注附着基更换' },values:[260,285,310,340,370,395,415,440,465,490] },
  { name:'海上养成期',img:'baoyu4.jpg',labels:['第6月','第8月','第10月','第12月','第14月','第15月','第16月','第17月','第18月','第18月'],params:{ temp:'19–25°C',period:'6–18月',desc:'进入海上渔排规模化养成，鲍鱼快速增重，壳长达5-8cm',care:'监控海域水温盐度波动，合理调控投喂频率与饵料种类' },values:[490,530,580,635,690,745,800,850,895,940] },
  { name:'成品育肥期',img:'baoyu5.jpg',labels:['第18月','第18.5月','第19月','第19.5月','第20月','第20.5月','第21月','第21.5月','第22月','第22月'],params:{ temp:'18–24°C',period:'18–22月',desc:'鲍鱼闭壳肌增厚，肉质饱满度最佳，可达商品规格标准',care:'强化营养投喂，控制养殖密度，做好出池前品质评估' },values:[940,970,995,1015,1030,1040,1045,1048,1050,1050] },
  { name:'采收储运期',img:'baoyu6.jpg',labels:['T+1天','T+3天','T+5天','T+7天','T+10天','T+12天','T+14天','T+16天','T+18天','T+20天'],params:{ temp:'2–6°C(冷链)',period:'22月+',desc:'按规格分拣包装，冷链运输直达市场，全程可追溯管控',care:'严格控制冷链温区，缩短周转时间，保障成品鲜活品质' },values:[1050,1050,1050,1050,1050,1050,1050,1050,1050,1050] }
];

function $(id){return document.getElementById(id)}
function qs(s){return document.querySelector(s)}
function qa(s){return document.querySelectorAll(s)}

// ===== 加载器 =====
// 立即启动进度，不再绑定 window.load，避免被CDN/背景图拖死而卡在0%
(function(){
  var loaderEl = $('loader');
  if (!loaderEl) return;
  var pct = $('loaderPct');
  var bar = document.querySelector('.loader-bar-inner');
  var progress = 0;
  var done = false;
  function finish(){
    if (done) return;
    done = true;
    progress = 100;
    if (pct) pct.textContent = '100%';
    if (bar) bar.style.width = '100%';
    setTimeout(function(){ loaderEl.classList.add('done'); }, 400);
  }
  // 假进度：持续递增，越接近100越慢（渐近），不会冻住
  var timer = setInterval(function(){
    var remain = 100 - progress;
    if (remain <= 0.5) return; // 离100只差一点就不动了，等真完成收尾
    progress += remain * 0.06 + Math.random() * 1.5; // 按剩余比例递减，永远在动但越来越慢
    if (pct) pct.textContent = Math.floor(progress) + '%';
    if (bar) bar.style.width = progress + '%';
  }, 200);
  // 资源全部就绪 → 跳100%收尾
  function onLoad(){ clearInterval(timer); finish(); }
  if (document.readyState === 'complete') { onLoad(); }
  else { window.addEventListener('load', onLoad); }
  // 兜底：最多7秒强制收尾，防止CDN超时导致load永不触发、loader永久转圈
  setTimeout(function(){ clearInterval(timer); finish(); }, 7000);
})();

// ===== 导航 =====
var navbar = $('navbar');
var navToggle = $('navToggle');
var navMenu = $('navMenu');
var scrollBtn = $('scrollTop');

navToggle.addEventListener('click',function(e){ e.stopPropagation(); navToggle.classList.toggle('active'); navMenu.classList.toggle('open'); });
qa('.nav-link').forEach(function(l){ l.addEventListener('click',function(){ navToggle.classList.remove('active');navMenu.classList.remove('open'); }); });
document.addEventListener('click',function(e){ if(navMenu.classList.contains('open') && !navMenu.contains(e.target) && !navToggle.contains(e.target)){ navToggle.classList.remove('active');navMenu.classList.remove('open'); } });

// ===== 导航进度 + 高亮 =====
var navProgress = $('navProgress');
var sections = ['hero','overview','platform','research'];
function onScroll(){
  var y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 80);
  if(scrollBtn) scrollBtn.classList.toggle('visible', y > 300);
  var docH = document.documentElement.scrollHeight - window.innerHeight;
  if(navProgress) navProgress.style.width = Math.min(y/docH*100,100) + '%';
  var found = 'hero';
  for(var i=0;i<sections.length;i++){ var el = $(sections[i]); if(el && el.offsetTop <= y + 120) found = sections[i]; }
  qa('.nav-link').forEach(function(l){ var h = l.getAttribute('href'); l.classList.toggle('active', h === '#' + found); });
}
window.addEventListener('scroll', onScroll, {passive:true});
scrollBtn.addEventListener('click',function(){ window.scrollTo({top:0,behavior:'smooth'}); });

// ===== 平滑滚动 =====
qa('.nav-link, .footer-links a, .hero-cta').forEach(function(a){
  a.addEventListener('click',function(e){ var href = a.getAttribute('href'); if(href && href.startsWith('#') && href.length>1){ e.preventDefault(); var el=$(href.substring(1)); if(el) el.scrollIntoView({behavior:'smooth'}); } });
});

// ===== Hero粒子 =====
(function(){
  var canvas = $('heroCanvas'); if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H;
  function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize(); window.addEventListener('resize', resize);
  var particles = [];
  var count = Math.min(35, Math.floor(W/28));
  for(var i=0;i<count;i++){ particles.push({x:Math.random()*W,y:Math.random()*H,r:1+Math.random()*2.5,dx:(Math.random()-0.5)*0.3,dy:-(0.15+Math.random()*0.25),alpha:0.15+Math.random()*0.3}); }
  function animate(){
    ctx.clearRect(0,0,W,H);
    for(var i=0;i<particles.length;i++){
      var p = particles[i]; p.x+=p.dx; p.y+=p.dy;
      if(p.y<-10){p.y=H+10;p.x=Math.random()*W} if(p.x<-10)p.x=W+10; if(p.x>W+10)p.x=-10;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle='rgba(255,255,255,'+p.alpha+')'; ctx.fill();
      for(var j=i+1;j<particles.length;j++){ var p2=particles[j]; var dx=p.x-p2.x,dy=p.y-p2.y; var dist=Math.sqrt(dx*dx+dy*dy); if(dist<120){ ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(p2.x,p2.y); ctx.strokeStyle='rgba(255,255,255,'+(0.05*(1-dist/120))+')'; ctx.lineWidth=0.5; ctx.stroke(); } }
    }
    requestAnimationFrame(animate);
  }
  animate();
})();

// ===== 生长周期交互 =====
var stageChart = null;

function initStageChart() {
  var ctx = $('gChart');
  if (!ctx) return;
  if (stageChart) return;
  var d = growthData[0];
  stageChart = new Chart(ctx.getContext('2d'),{
    type:'line',
    data:{
      labels: d.labels || ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10'],
      datasets:[{ 
        label:d.name+' 生长曲线', 
        data:d.values, 
        borderColor:'#1a8bc4', 
        backgroundColor:'rgba(26,139,196,.12)', 
        fill:true, 
        tension:.4, 
        pointBackgroundColor:'#fff', 
        pointBorderColor:'#1a8bc4',
        pointBorderWidth:2,
        pointRadius:4,
        pointHoverRadius:7,
        pointHoverBackgroundColor:'#1a8bc4',
        pointHoverBorderColor:'#fff',
        pointHoverBorderWidth:3
      }]
    },
    options:{ 
      responsive:true, 
      maintainAspectRatio:false, 
      interaction:{mode:'index', intersect:false},
      plugins:{
        legend:{display:false},
        tooltip:{
          backgroundColor:'rgba(10,61,92,.9)',
          titleFont:{size:11,weight:'600'},
          bodyFont:{size:12},
          padding:12,
          cornerRadius:10,
          displayColors:false,
          callbacks:{
            label:function(context){ return '壳长: ' + context.parsed.y + ' mm'; }
          }
        }
      },
      animation:{duration:350}, 
      scales:{ 
        x:{grid:{display:false}, ticks:{font:{size:9},color:'#888'}}, 
        y:{grid:{color:'rgba(26,188,156,.1)'}, ticks:{font:{size:9},color:'#888'}} 
      } 
    }
  });
}

window.addEventListener('load', function() {
  setTimeout(initStageChart, 300);
});

function updateStage(index){
  var d = growthData[index];
  var gDetailName = $('gDetailName');
  var gDetailNum = $('gDetailNum');
  var gDetailImg = $('gDetailImg');
  
  if(gDetailImg) {
    gDetailImg.classList.add('stage-transition');
    setTimeout(function(){ gDetailImg.src = d.img; gDetailImg.classList.remove('stage-transition'); }, 150);
  }
  if(gDetailName) gDetailName.textContent = d.name;
  if(gDetailNum) gDetailNum.textContent = (index+1).toString().padStart(2,'0') + ' / 06';
  
  qa('.g-pcard').forEach(function(c){ c.classList.add('stage-transition'); c.classList.remove('active'); });
    setTimeout(function(){
      var gParamTemp = $('gParamTemp');
      var gParamPeriod = $('gParamPeriod');
      var gParamDesc = $('gParamDesc');
      var gParamCare = $('gParamCare');
      if(gParamTemp) gParamTemp.textContent = d.params.temp;
      if(gParamPeriod) gParamPeriod.textContent = d.params.period;
      if(gParamDesc) gParamDesc.textContent = d.params.desc;
      if(gParamCare) gParamCare.textContent = d.params.care;
      qa('.g-pcard').forEach(function(c){ c.classList.remove('stage-transition'); });
    }, 120);

  qa('.g-stage-card').forEach(function(c,i){ c.classList.toggle('active',i===index); });

  var ctx = $('gChart');
  if(!ctx) return;
  if(stageChart){
    stageChart.data.labels = d.labels || ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10'];
    stageChart.data.datasets[0].label = d.name + ' 生长曲线';
    stageChart.data.datasets[0].data = d.values;
    stageChart.update();
  }else{
    stageChart = new Chart(ctx.getContext('2d'),{
      type:'line',
      data:{
        labels: d.labels || ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10'],
        datasets:[{ label:d.name+' 生长曲线', data:d.values, borderColor:'#1a8bc4', backgroundColor:'rgba(26,139,196,.1)', fill:true, tension:.4, pointBackgroundColor:'#1a8bc4', pointRadius:3 }]
      },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, animation:{duration:350}, scales:{ x:{grid:{display:false}, ticks:{font:{size:9}}}, y:{grid:{color:'rgba(0,0,0,.05)'}, ticks:{font:{size:9}}} } }
    });
  }
}
// ===== 基地概况轮播 =====
var ovTrack = $('ovTrack');
var ovDots = qa('.ov-dot');
var ovSlides = qa('.ov-carousel-slide');
var ovPrev = $('ovPrev');
var ovNext = $('ovNext');
var ovCurrent = 0;
var ovTotal = ovSlides.length;
var ovTimer = null;

function ovGoTo(idx) {
  if (idx < 0) idx = ovTotal - 1;
  if (idx >= ovTotal) idx = 0;
  ovCurrent = idx;
  if (ovTrack) ovTrack.style.transform = 'translateX(-' + (idx * 100) + '%)';
  ovDots.forEach(function(d, i) { d.classList.toggle('active', i === idx); });
  ovSlides.forEach(function(s, i) { s.classList.toggle('active', i === idx); });
}

function ovNextSlide() { ovGoTo(ovCurrent + 1); }
function ovPrevSlide() { ovGoTo(ovCurrent - 1); }

function ovStartAuto() {
  ovStopAuto();
  ovTimer = setInterval(ovNextSlide, 3000);
}
function ovStopAuto() { if (ovTimer) { clearInterval(ovTimer); ovTimer = null; } }
function ovRestartAuto() { ovStopAuto(); ovTimer = setInterval(ovNextSlide, 3000); }

// Bind controls
if (ovPrev) ovPrev.addEventListener('click', function() { ovPrevSlide(); ovRestartAuto(); });
if (ovNext) ovNext.addEventListener('click', function() { ovNextSlide(); ovRestartAuto(); });
ovDots.forEach(function(dot) {
  dot.addEventListener('click', function() { ovGoTo(parseInt(dot.dataset.idx)); ovRestartAuto(); });
});

// Pause on hover
var ovCarousel = $('ovCarousel');
if (ovCarousel) {
  ovCarousel.addEventListener('mouseenter', ovStopAuto);
  ovCarousel.addEventListener('mouseleave', ovStartAuto);
  ovCarousel.addEventListener('touchstart', ovStopAuto);
  ovCarousel.addEventListener('touchend', ovStartAuto);
}

// Start auto-play
if (ovTotal > 1) { ovStartAuto(); }

// ===== 轮播统计数字滚动（复用观测器） =====
(function(){
  var els = document.querySelectorAll('.ov-cstat-num[data-target]');
  if (!els.length) return;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var target = parseInt(el.getAttribute('data-target'));
      if (isNaN(target)) return;
      var current = 0;
      var step = Math.max(1, Math.ceil(target / 35));
      var timer = setInterval(function() {
        current += step;
        if (current >= target) { el.textContent = target; clearInterval(timer); }
        else { el.textContent = current; }
      }, 30);
      obs.unobserve(el);
    });
  }, {threshold: 0.3});
  els.forEach(function(el) { obs.observe(el); });
})();


// ===== 阶段统一导航 - 横向滚动卡片版 =====
(function(){
  var gCardsPrev = $('gCardsPrev');
  var gCardsNext = $('gCardsNext');
  var gStageCards = $('gStageCards');
  var totalStages = growthData.length;
  var currentIdx = 0;

  function goToStage(idx) {
    if (idx < 0) idx = 0;
    if (idx >= totalStages) idx = totalStages - 1;
    if (idx === currentIdx) return;
    currentIdx = idx;
    updateStage(idx);
    scrollToCard(idx);
  }

  function scrollToCard(idx) {
    if (!gStageCards) return;
    var cards = document.querySelectorAll('.g-stage-card');
    if (!cards[idx]) return;
    var cardWidth = cards[idx].offsetWidth + 12;
    var scrollPos = idx * cardWidth - gStageCards.offsetWidth / 2 + cardWidth / 2;
    gStageCards.scrollTo({left: Math.max(0, scrollPos), behavior: 'smooth'});
  }

  if (gCardsPrev) gCardsPrev.addEventListener('click', function() { goToStage(currentIdx - 1); });
  if (gCardsNext) gCardsNext.addEventListener('click', function() { goToStage(currentIdx + 1); });

  document.querySelectorAll('.g-stage-card').forEach(function(card) {
    card.addEventListener('click', function() {
      var idx = parseInt(card.getAttribute('data-idx'));
      if (!isNaN(idx)) goToStage(idx);
    });
  });

  function isPlatformVisible() {
    var platform = $('platform');
    if (!platform) return false;
    var rect = platform.getBoundingClientRect();
    var windowHeight = window.innerHeight;
    return rect.top < windowHeight * 0.85 && rect.bottom > windowHeight * 0.15;
  }

  document.addEventListener('keydown', function(e) {
    if (!isPlatformVisible()) return;
    if (e.key === 'ArrowLeft') { goToStage(currentIdx - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { goToStage(currentIdx + 1); e.preventDefault(); }
  });
})();

// ===== 参数卡片展开交互 =====
(function(){
  qa('.g-pcard[data-expand]').forEach(function(card) {
    card.addEventListener('click', function(e) {
      if (e.target.closest('.g-pc-toggle')) {
        e.stopPropagation();
      }
      card.classList.toggle('active');
    });
  });
})();

// ===== 照片墙灯箱 =====
(function(){
  var lightbox = $('lightbox');
  var lightboxImg = $('lightboxImg');
  var lightboxCaption = $('lightboxCaption');
  var lightboxClose = $('lightboxClose');
  
  if (!lightbox || !lightboxImg || !lightboxCaption) return;
  
  // 照片墙
  qa('.photo-item[data-lightbox]').forEach(function(item) {
    item.addEventListener('click', function() {
      var img = item.querySelector('img');
      var label = item.querySelector('.photo-label');
      if (!img) return;
      lightboxImg.src = img.src.replace(/\?.*/, '');
      lightboxCaption.textContent = label ? label.textContent : img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  
  // 研学足迹时间线图片
  qa('.rx-tl-img[data-lightbox]').forEach(function(item) {
    item.addEventListener('click', function() {
      var img = item.querySelector('img');
      if (!img) return;
      lightboxImg.src = img.src.replace(/\?.*/, '');
      lightboxCaption.textContent = img.alt || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
})();

// ===== 滚动渐入动画 =====
(function(){
  var els = document.querySelectorAll('[data-aos]');
  if (!els.length) return;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        obs.unobserve(entry.target);
      }
    });
  }, {threshold: 0.05, rootMargin: '0px 0px -30px 0px'});
  els.forEach(function(el) { obs.observe(el); });
})();

// ===== 卡片3D倾斜效果 =====
(function(){
  var cards = document.querySelectorAll('.g-stage-card');
  if (!cards.length) return;
  cards.forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var cx = rect.width / 2;
      var cy = rect.height / 2;
      var rx = -((y - cy) / cy) * 8;
      var ry = ((x - cx) / cx) * 8;
      card.classList.add('tilting');
      card.style.transform = 'perspective(600px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
    });
    card.addEventListener('mouseleave', function() {
      card.classList.remove('tilting');
      card.style.transform = '';
    });
  });
})();

