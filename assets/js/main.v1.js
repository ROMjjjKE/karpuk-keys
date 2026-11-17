/* АвтоПрог Сморгонь: меню, аккордеон, подбор ключа, разбор поломки, заявка */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };

  /* ---- мобильное меню ---- */
  var drawer = $('drawer'), burger = $('burger'), closeBtn = $('drawerClose'), lastFocus = null;
  function openD() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.setAttribute('data-open', 'true'); drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    burger.setAttribute('aria-expanded', 'true');
    var f = drawer.querySelector('a, button'); if (f) f.focus();
  }
  function closeD() {
    if (!drawer) return;
    drawer.setAttribute('data-open', 'false'); drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
    burger.setAttribute('aria-expanded', 'false');
    if (lastFocus) lastFocus.focus();
  }
  if (burger) burger.addEventListener('click', openD);
  if (closeBtn) closeBtn.addEventListener('click', closeD);
  if (drawer) {
    drawer.addEventListener('click', function (e) { if (e.target === drawer) closeD(); });
    drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeD); });
  }
  document.addEventListener('keydown', function (e) {
    if (!drawer || drawer.getAttribute('data-open') !== 'true') return;
    if (e.key === 'Escape') { closeD(); return; }
    if (e.key === 'Tab') {
      var items = drawer.querySelectorAll('a, button');
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 940 && drawer && drawer.getAttribute('data-open') === 'true') closeD();
  });

  /* ---- аккордеон ---- */
  document.querySelectorAll('.faq__q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.parentElement, open = item.getAttribute('data-open') === 'true';
      item.parentElement.querySelectorAll('.faq__i').forEach(function (i) {
        i.setAttribute('data-open', 'false'); i.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
      });
      if (!open) { item.setAttribute('data-open', 'true'); q.setAttribute('aria-expanded', 'true'); }
    });
  });

  /* ---- подбор ключа ---- */
  var pickOut = $('pickOut') || $('pickOut2');
  if (pickOut) {
    var make = $('keyMake'), year = $('keyYear'), seg = $('keySeg'), pickMsg = $('pickMsg');
    var situ = 'second';
    var MK = { mercedes: 'Mercedes-Benz', vag: 'VAG: Volkswagen, Audi, Skoda, Seat', bmw: 'BMW', renault: 'Renault', other: 'Другая марка' };
    var YR = { old: 'до 2010', mid: '2011–2015', new: '2016–2019', fresh: '2020 и новее' };
    var SIT = { second: 'нужен второй ключ', lost: 'ключ утерян', bind: 'есть свой ключ' };
    if (seg) {
      seg.querySelectorAll('button').forEach(function (b) {
        b.addEventListener('click', function () {
          situ = b.getAttribute('data-t');
          seg.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        });
      });
    }
    function build() {
      var m = make ? make.value : 'other', y = year ? year.value : 'mid', s = situ;
      var type, system, lines = [], chips = [], time = 'обычно в течение дня', warn = '';
      if (m === 'mercedes') {
        if (y === 'new' || y === 'fresh') {
          type = 'Ключ Mercedes-Benz моложе 2014 года';
          system = 'уточняем индивидуально';
          warn = 'Ключи для Mercedes-Benz мы делаем до 2014 года выпуска. По вашему году честно скажем по телефону, беремся или нет.';
          time = 'по модели';
        } else {
          type = (y === 'old') ? 'Выкидной ключ или ключ с кнопками' : 'Смарт-ключ или ключ с кнопками';
          system = 'Mercedes-Benz до 2014 года';
          lines.push('Изготовим лезвие по замку и подберём корпус под ваш ключ.');
          lines.push('Пропишем транспондер и радиоканал, проверим запуск и центральный замок.');
        }
        chips.push('Mercedes-Benz', YR[y]);
      } else if (m === 'vag') {
        type = (y === 'new' || y === 'fresh') ? 'Смарт-ключ или ключ с кнопками (MQB / MLB)' : 'Выкидной ключ или ключ с кнопками';
        system = (y === 'new' || y === 'fresh') ? 'VAG, платформы MQB и MLB с 2016 года' : 'VAG группа';
        lines.push('Работаем с автомобилями VAG, включая платформы MQB и MLB с 2016 года.');
        lines.push('Нужен автомобиль и хотя бы один рабочий ключ для привязки нового.');
        chips.push('VAG', 'MQB / MLB', YR[y]);
        if (y === 'new' || y === 'fresh') time = '1–2 дня';
      } else if (m === 'bmw') {
        var sys = { old: 'EWS или CAS', mid: 'CAS', new: 'FEM', fresh: 'BDC' }[y];
        type = 'Ключ BMW (' + sys + ')';
        system = 'BMW, иммобилайзер ' + sys;
        lines.push('Все типы иммобилайзера BMW: EWS, CAS, FEM, BDC — по вашему году это ' + sys + '.');
        lines.push('Изготовим ключ и привяжем к автомобилю, при утере удалим старый из памяти.');
        chips.push('BMW', sys, YR[y]);
        if (y === 'fresh') time = '1–2 дня';
      } else if (m === 'renault') {
        type = (y === 'new' || y === 'fresh') ? 'Ключ-карта Renault' : 'Ключ с кнопками или ключ-карта';
        system = 'Renault, ключ-карта';
        lines.push('Ключ-карты Renault: изготовление, замена корпуса карты, привязка к автомобилю.');
        lines.push('Проверим считывание карты и запуск двигателя.');
        chips.push('Renault', 'ключ-карта', YR[y]);
      } else {
        type = 'Ключ под ваш автомобиль';
        system = 'уточняем по VIN и году';
        lines.push('Работаем с большинством марок: подбираем корпус, чип и способ привязки.');
        lines.push('Назовите модель, год и VIN — скажем точно, что подойдёт.');
        chips.push(YR[y]);
        time = 'по модели';
      }
      if (s === 'second') {
        lines.push('Возьмите все имеющиеся ключи: по рабочему ключу привязка проходит быстрее.');
      } else if (s === 'lost') {
        lines.push('При утере изготовим ключ с нуля и, если нужно, удалим утерянный из памяти автомобиля.');
        lines.push('Приезжайте на автомобиле, с документами и всеми оставшимися ключами.');
      } else {
        lines.push('Если ваш ключ подходит по частоте и типу чипа — привяжем его. Проверим на месте.');
        lines.push('Возьмите чек или описание ключа: так быстрее понять, подойдёт ли он.');
      }
      pickOut.innerHTML = '<span class="mono">Результат подбора</span><h3 style="margin-top:8px">' + MK[m] + '</h3>' +
        '<p>' + type + '. Система: ' + system + '. Ситуация: ' + SIT[s] + '.</p>' +
        '<ul class="pick__list">' + lines.map(function (l) { return '<li>' + l + '</li>'; }).join('') + '</ul>' +
        '<div class="pick__meta">' + chips.map(function (c) { return '<span class="chip chip--on">' + c + '</span>'; }).join('') +
        '<span class="chip">срок: ' + time + '</span></div>' +
        (warn ? '<p class="msg msg--err" style="margin-top:14px">' + warn + '</p>' : '') +
        '<div class="bk__act" style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px">' +
        '<a class="btn" target="_blank" rel="noopener" href="https://wa.me/375296198106?text=' +
        encodeURIComponent('Здравствуйте! ' + MK[m] + ', ' + YR[y] + ', ' + SIT[s] + '. Подскажите по ключу.') + '">Спросить в WhatsApp</a>' +
        '<a class="btn btn--ghost" href="tel:+375296198106">Позвонить</a></div>';
      if (pickMsg) pickMsg.textContent = '';
    }
    var go = $('pickGo');
    if (go) go.addEventListener('click', build);
    [make, year].forEach(function (el) { if (el) el.addEventListener('change', build); });
    build();
  }

  /* ---- разбор поломки ---- */
  var faultOut = $('faultOut'), faultSeg = $('faultSeg');
  if (faultOut && faultSeg) {
    var F = {
      open: ['Ключ не открывает автомобиль', 'Батарейка, окисленные контакты платы или сбитый радиоканал.', ['Проверяем батарейку и контакты', 'Чистим плату, при необходимости перепаиваем', 'Проверяем радиоканал и привязку'], '15 минут – 1 день'],
      start: ['Не заводит двигатель', 'Чаще всего транспондер: чип не считывается иммобилайзером или сбита привязка.', ['Проверяем считывание чипа', 'Смотрим ошибки по иммобилайзеру', 'Перепривязываем или меняем чип'], 'в день обращения'],
      buttons: ['Кнопки не работают или западают', 'Стёрлись микрокнопки или отошли контакты на плате.', ['Меняем микрокнопки', 'Чистим контакты', 'Проверяем все кнопки и багажник'], '1–2 часа'],
      case: ['Треснул или развалился корпус', 'Пластик стареет, петля выкидного ключа ломается от нагрузки.', ['Подбираем корпус под вашу плату', 'Переносим плату и чип', 'Собираем и проверяем механику'], 'от 1 часа'],
      blade: ['Лезвие болтается или сломалось', 'Разбито посадочное место или стёрлись штифты крепления.', ['Меняем лезвие и крепление', 'Режем новое лезвие по замку', 'Проверяем в замке'], '1–2 часа'],
      battery: ['Быстро садится батарейка', 'Утечка на плате, окислы после влаги или изношенный аккумулятор с пайкой.', ['Проверяем ток потребления', 'Чистим плату от окислов', 'Меняем элемент питания с пайкой'], '30 минут – 2 дня']
    };
    function drawFault(k) {
      var f = F[k];
      faultOut.innerHTML = '<h3>' + f[0] + '</h3><p><b>Вероятная причина:</b> ' + f[1] + '</p>' +
        '<ul class="pick__list">' + f[2].map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' +
        '<div class="pick__meta"><span class="chip chip--on">срок: ' + f[3] + '</span></div>' +
        '<p style="margin-top:12px;font-size:14px;color:var(--mut)">Точный диагноз — после осмотра: пришлите фото ключа в WhatsApp, часто этого достаточно.</p>';
    }
    faultSeg.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        faultSeg.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        drawFault(b.getAttribute('data-f'));
      });
    });
    drawFault('open');
  }

  /* ---- заявка ---- */
  var form = $('reqForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var g = function (n) { var el = form.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ''; };
      var out = $('formout');
      if (!g('name') || !g('tel')) { out.textContent = 'Заполните имя и телефон'; return; }
      var msg = 'Заявка с сайта: ' + g('name') + ' · ' + g('tel') + ' · ' + g('car') + ' · ' + g('task') + (g('note') ? ' · ' + g('note') : '');
      out.textContent = 'Открываем WhatsApp с готовым сообщением';
      window.open('https://wa.me/375296198106?text=' + encodeURIComponent(msg), '_blank');
    });
  }
})();
