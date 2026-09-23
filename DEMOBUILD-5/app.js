(function () {
  'use strict';

  const STORE_KEY = 'shift-talk-v1';

  const ROLES = [
    { id: 'front-desk', name: 'Front desk' },
    { id: 'housekeeping', name: 'Housekeeping' },
    { id: 'kitchen', name: 'Kitchen' },
    { id: 'management', name: 'Management' },
    { id: 'all-team', name: 'All team' }
  ];

  const LANGUAGES = [
    { code: 'en', name: 'English', voice: 'en-US' },
    { code: 'tr', name: 'Turkish', voice: 'tr-TR' },
    { code: 'es', name: 'Spanish', voice: 'es-ES' },
    { code: 'fr', name: 'French', voice: 'fr-FR' },
    { code: 'de', name: 'German', voice: 'de-DE' },
    { code: 'ru', name: 'Russian', voice: 'ru-RU' },
    { code: 'ar', name: 'Arabic', voice: 'ar-SA' },
    { code: 'uk', name: 'Ukrainian', voice: 'uk-UA' }
  ];

  const EN_PHRASES = [
    { id: 'p1', role: 'front-desk', en: 'Guest check-in starts in 10 minutes.' },
    { id: 'p2', role: 'front-desk', en: 'A guest needs an extra towel.' },
    { id: 'p3', role: 'front-desk', en: 'Please confirm the late check-out request.' },
    { id: 'p4', role: 'front-desk', en: 'The reservation is under this name.' },
    { id: 'p5', role: 'front-desk', en: 'Breakfast is served until 10:30.' },
    { id: 'p6', role: 'housekeeping', en: 'Room 305 needs fresh linen.' },
    { id: 'p7', role: 'housekeeping', en: 'Do not disturb sign is on this door.' },
    { id: 'p8', role: 'housekeeping', en: 'Please refill the mini bar.' },
    { id: 'p9', role: 'housekeeping', en: 'The hallway carpet needs vacuuming.' },
    { id: 'p10', role: 'housekeeping', en: 'Report any broken items.' },
    { id: 'p11', role: 'kitchen', en: 'We need more ice at the buffet.' },
    { id: 'p12', role: 'kitchen', en: 'A guest has a nut allergy.' },
    { id: 'p13', role: 'kitchen', en: 'Two vegetarian meals for room 212.' },
    { id: 'p14', role: 'kitchen', en: 'The dishwasher cycle is finished.' },
    { id: 'p15', role: 'kitchen', en: 'Prep for the dinner rush starts now.' },
    { id: 'p16', role: 'management', en: 'Please check the guest feedback from last night.' },
    { id: 'p17', role: 'management', en: 'The next shift meeting is at 15:00.' },
    { id: 'p18', role: 'management', en: 'Call maintenance for the lobby AC.' },
    { id: 'p19', role: 'management', en: 'Review the revised cleaning schedule.' },
    { id: 'p20', role: 'management', en: 'Train the new team member on safety steps.' },
    { id: 'p21', role: 'all-team', en: 'Hello, how can I help?' },
    { id: 'p22', role: 'all-team', en: 'I do not understand, could you repeat?' },
    { id: 'p23', role: 'all-team', en: 'Please wait one moment.' },
    { id: 'p24', role: 'all-team', en: 'Thank you.' },
    { id: 'p25', role: 'all-team', en: 'Where is the manager?' }
  ];

  const TRANSLATIONS = {
    tr: {
      'p1': 'Misafir girişleri 10 dakika içinde başlıyor.',
      'p2': 'Bir misafir ekstra havlu istiyor.',
      'p3': 'Lütfen geç çıkış talebini onaylayın.',
      'p4': 'Rezervasyon bu isim altında.',
      'p5': 'Kahvaltı 10:30\'a kadar servis edilir.',
      'p6': '305 numaralı oda temiz çarşaf bekliyor.',
      'p7': 'Bu kapıda rahatsız etmeyin tabelası var.',
      'p8': 'Lütfen mini barı doldurun.',
      'p9': 'Koridor halısının süpürülmesi gerekiyor.',
      'p10': 'Kırık eşyaları rapor edin.',
      'p11': 'Büfede daha fazla buz lazım.',
      'p12': 'Bir misafirin fındık alerjisi var.',
      'p13': '212 numaralı odaya iki vejetaryen yemek.',
      'p14': 'Bulaşık makinesi döngüsü bitti.',
      'p15': 'Akşam yoğunluğu hazırlığı şimdi başlar.',
      'p16': 'Lütfen dün geceki misafir geri bildirimlerini kontrol edin.',
      'p17': 'Bir sonraki vardiya toplantısı saat 15:00\'te.',
      'p18': 'Lobi kliması için teknik servisi arayın.',
      'p19': 'Revize edilmiş temizlik programını gözden geçirin.',
      'p20': 'Yeni ekip üyesini güvenlik adımları konusunda eğitin.',
      'p21': 'Merhaba, nasıl yardımcı olabilirim?',
      'p22': 'Anlamadım, tekrar eder misiniz?',
      'p23': 'Lütfen bir dakika bekleyin.',
      'p24': 'Teşekkür ederim.',
      'p25': 'Müdür nerede?'
    },
    es: {
      'p1': 'El check-in de huéspedes empieza en 10 minutos.',
      'p2': 'Un huésped necesita una toalla extra.',
      'p3': 'Por favor confirme la solicitud de salida tardía.',
      'p4': 'La reserva está a este nombre.',
      'p5': 'El desayuno se sirve hasta las 10:30.',
      'p6': 'La habitación 305 necesita sábanas limpias.',
      'p7': 'Hay cartel de no molestar en esta puerta.',
      'p8': 'Por favor reponga el minibar.',
      'p9': 'La alfombra del pasillo necesita aspirarse.',
      'p10': 'Reporte cualquier artículo dañado.',
      'p11': 'Necesitamos más hielo en el buffet.',
      'p12': 'Un huésped tiene alergia a los frutos secos.',
      'p13': 'Dos comidas vegetarianas para la habitación 212.',
      'p14': 'El ciclo del lavavajillas ha terminado.',
      'p15': 'La preparación para la cena empieza ahora.',
      'p16': 'Revise los comentarios de huéspedes de anoche.',
      'p17': 'La próxima reunión de turno es a las 15:00.',
      'p18': 'Llame a mantenimiento para el aire del lobby.',
      'p19': 'Revise el cronograma de limpieza actualizado.',
      'p20': 'Capacite al nuevo miembro en medidas de seguridad.',
      'p21': 'Hola, ¿cómo puedo ayudarle?',
      'p22': 'No entiendo, ¿podría repetir?',
      'p23': 'Por favor espere un momento.',
      'p24': 'Gracias.',
      'p25': '¿Dónde está el gerente?'
    },
    fr: {
      'p1': 'Les enregistrements commencent dans 10 minutes.',
      'p2': 'Un client a besoin d\'une serviette supplémentaire.',
      'p3': 'Veuillez confirmer la demande de départ tardif.',
      'p4': 'La réservation est à ce nom.',
      'p5': 'Le petit-déjeuner est servi jusqu\'à 10h30.',
      'p6': 'La chambre 305 a besoin de draps propres.',
      'p7': 'Une pancarte ne pas déranger est sur cette porte.',
      'p8': 'Veuillez recharger le mini-bar.',
      'p9': 'La moquette du couloir doit être aspirée.',
      'p10': 'Signalez tout objet cassé.',
      'p11': 'Nous avons besoin de plus de glace au buffet.',
      'p12': 'Un client a une allergie aux noix.',
      'p13': 'Deux repas végétariens pour la chambre 212.',
      'p14': 'Le cycle du lave-vaisselle est terminé.',
      'p15': 'La préparation pour le service du soir commence maintenant.',
      'p16': 'Vérifiez les commentaires clients de la nuit dernière.',
      'p17': 'La prochaine réunion d\'équipe est à 15h00.',
      'p18': 'Appelez la maintenance pour la clim du hall.',
      'p19': 'Examinez le planning de nettoyage révisé.',
      'p20': 'Formez le nouveau membre aux consignes de sécurité.',
      'p21': 'Bonjour, comment puis-je vous aider ?',
      'p22': 'Je ne comprends pas, pouvez-vous répéter ?',
      'p23': 'Veuillez patienter un instant.',
      'p24': 'Merci.',
      'p25': 'Où est le responsable ?'
    },
    de: {
      'p1': 'Der Check-in beginnt in 10 Minuten.',
      'p2': 'Ein Gast braucht ein zusätzliches Handtuch.',
      'p3': 'Bitte bestätigen Sie die späte Abreise.',
      'p4': 'Die Reservierung läuft auf diesen Namen.',
      'p5': 'Frühstück wird bis 10:30 Uhr serviert.',
      'p6': 'Zimmer 305 braucht frische Bettwäsche.',
      'p7': 'An dieser Tür hängt ein Nicht-stören-Schild.',
      'p8': 'Bitte die Minibar auffüllen.',
      'p9': 'Der Teppich im Flur muss gesaugt werden.',
      'p10': 'Kaputte Gegenstände melden.',
      'p11': 'Wir brauchen mehr Eis am Buffet.',
      'p12': 'Ein Gast hat eine Nussallergie.',
      'p13': 'Zwei vegetarische Mahlzeiten für Zimmer 212.',
      'p14': 'Der Geschirrspüler ist fertig.',
      'p15': 'Die Vorbereitung für den Abend stress beginnt jetzt.',
      'p16': 'Bitte die Gästebewertungen von gestern Abend prüfen.',
      'p17': 'Das nächste Schichtmeeting ist um 15:00 Uhr.',
      'p18': 'Rufen Sie die Wartung für die Lobby-Klimaanlage.',
      'p19': 'Den überarbeiteten Reinigungsplan prüfen.',
      'p20': 'Schulen Sie das neue Teammitglied in Sicherheitsmaßnahmen.',
      'p21': 'Hallo, wie kann ich Ihnen helfen?',
      'p22': 'Ich verstehe nicht, können Sie das wiederholen?',
      'p23': 'Bitte einen Moment warten.',
      'p24': 'Danke.',
      'p25': 'Wo ist der Manager?'
    },
    ru: {
      'p1': 'Регистрация гостей начинается через 10 минут.',
      'p2': 'Гостю нужно дополнительное полотенце.',
      'p3': 'Пожалуйста, подтвердите запрос на поздний выезд.',
      'p4': 'Бронь на это имя.',
      'p5': 'Завтрак подаётся до 10:30.',
      'p6': 'В номере 305 нужна чистая постель.',
      'p7': 'На этой двери висит табличка «Не беспокоить».',
      'p8': 'Пожалуйста, пополните мини-бар.',
      'p9': 'Ковёр в коридоре нужно пропылесосить.',
      'p10': 'Сообщайте о любых сломанных вещах.',
      'p11': 'Нам нужно больше льда для буфета.',
      'p12': 'У гостя аллергия на орехи.',
      'p13': 'Два вегетарианских блюда в номер 212.',
      'p14': 'Цикл посудомоечной машины завершён.',
      'p15': 'Подготовка к ужину начинается сейчас.',
      'p16': 'Проверьте отзывы гостей прошлой ночью.',
      'p17': 'Следующее совещание смены в 15:00.',
      'p18': 'Позвоните в техническую службу по кондиционеру в холле.',
      'p19': 'Проверьте обновлённое расписание уборки.',
      'p20': 'Обучите нового сотрудника мерам безопасности.',
      'p21': 'Здравствуйте, чем могу помочь?',
      'p22': 'Я не понимаю, повторите, пожалуйста.',
      'p23': 'Пожалуйста, подождите минуту.',
      'p24': 'Спасибо.',
      'p25': 'Где менеджер?'
    },
    ar: {
      'p1': 'تسجيل الوصول يبدأ بعد 10 دقائق.',
      'p2': 'يحتاج أحد الضيوف إلى منشفة إضافية.',
      'p3': 'يرجى تأكيد طلب المغادرة المتأخرة.',
      'p4': 'الحجز بهذا الاسم.',
      'p5': 'يتم تقديم الإفطار حتى 10:30.',
      'p6': 'الغرفة 305 تحتاج إلى ملاءات نظيفة.',
      'p7': 'هناك لافتة عدم الإزعاج على هذه الباب.',
      'p8': 'يرجى إعادة تعبئة الثلاجة الصغيرة.',
      'p9': 'يجب تنظيف سجاد الردهة بالمكنسة.',
      'p10': 'بلّغ عن أي أشياء مكسورة.',
      'p11': 'نحتاج إلى مزيد من الثلج في البوفيه.',
      'p12': 'أحد الضيوف لديه حساسية من المكسرات.',
      'p13': 'وجبتان نباتيتان للغرفة 212.',
      'p14': 'انتهت دورة غسالة الأطباق.',
      'p15': 'بدء التحضير لموجة العشاء الآن.',
      'p16': 'يرجى مراجعة ملاحظات الضيوف من الليلة الماضية.',
      'p17': 'اجتماع الوردية القادم الساعة 15:00.',
      'p18': 'اتصل بالصيانة لمكيف الردهة.',
      'p19': 'راجع جدول التنظيف المُحدّث.',
      'p20': 'دَرّب العضو الجديد على إجراءات السلامة.',
      'p21': 'مرحبًا، كيف يمكنني مساعدتك؟',
      'p22': 'لا أفهم، هل يمكنك التكرار؟',
      'p23': 'يرجى الانتظار لحظة.',
      'p24': 'شكرًا.',
      'p25': 'أين المدير؟'
    },
    uk: {
      'p1': 'Реєстрація гостей починається за 10 хвилин.',
      'p2': 'Гостю потрібен додатковий рушник.',
      'p3': 'Будь ласка, підтвердьте запит на пізній виїзд.',
      'p4': 'Бронювання на це ім\'я.',
      'p5': 'Сніданок подається до 10:30.',
      'p6': 'Номер 305 потребує чистої білизни.',
      'p7': 'На цих дверях табличка «Не турбувати».',
      'p8': 'Будь ласка, поповніть мінібар.',
      'p9': 'Килим у коридорі потрібно пропилососити.',
      'p10': 'Повідомляйте про будь-які зламані речі.',
      'p11': 'Нам потрібно більше льоду для буфету.',
      'p12': 'У гостя алергія на горіхи.',
      'p13': 'Два вегетаріанські страви в номер 212.',
      'p14': 'Цикл посудомийної машини завершено.',
      'p15': 'Підготовка до вечері починається зараз.',
      'p16': 'Будь ласка, перевірте відгуки гостей минулої ночі.',
      'p17': 'Наступна нарада зміни о 15:00.',
      'p18': 'Зателефонуйте в технічну службу через кондиціонер у холі.',
      'p19': 'Перевірте оновлений графік прибирання.',
      'p20': 'Навчіть нового члена команди заходам безпеки.',
      'p21': 'Привіт, чим я можу допомогти?',
      'p22': 'Я не розумію, повторіть, будь ласка.',
      'p23': 'Будь ласка, зачекайте хвилину.',
      'p24': 'Дякую.',
      'p25': 'Де менеджер?'
    }
  };

  const allPhrases = EN_PHRASES.map(p => {
    const tr = {};
    tr.en = p.en;
    LANGUAGES.forEach(l => {
      if (l.code !== 'en') tr[l.code] = (TRANSLATIONS[l.code] && TRANSLATIONS[l.code][p.id]) || '';
    });
    return { id: p.id, role: p.role, translations: tr };
  });

  function defaultState() {
    return {
      langs: ['en', 'tr'],
      roles: ['front-desk', 'housekeeping', 'kitchen', 'management'],
      staff: [],
      favorites: [],
      recent: [],
      tasks: [],
      boardLang: 'en',
      messageBlocks: []
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return { ...defaultState(), ...parsed };
    } catch (e) {
      return defaultState();
    }
  }

  function saveState() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }

  let state = loadState();

  function sampleData() {
    state.langs = ['en', 'tr', 'es'];
    state.roles = ['front-desk', 'housekeeping', 'kitchen'];
    state.staff = [
      { id: 's1', name: 'Elif', role: 'front-desk', lang: 'tr' },
      { id: 's2', name: 'Marco', role: 'kitchen', lang: 'es' },
      { id: 's3', name: 'Aisha', role: 'housekeeping', lang: 'ar' }
    ];
    state.favorites = ['p21', 'p24', 'p22'];
    state.recent = ['p6', 'p12'];
    state.boardLang = 'en';
    state.tasks = [
      { id: 't1', phraseId: 'p6', note: 'before 14:00', assignee: 's3', done: false, created: Date.now() },
      { id: 't2', phraseId: 'p12', note: 'inform server', assignee: 's2', done: false, created: Date.now() - 60000 },
      { id: 't3', phraseId: 'p5', note: '', assignee: 's1', done: true, created: Date.now() - 120000 }
    ];
    state.messageBlocks = [];
    saveState();
    renderAll();
  }

  const els = {
    langChips: document.getElementById('langChips'),
    langWarn: document.getElementById('langWarn'),
    roleChips: document.getElementById('roleChips'),
    staffForm: document.getElementById('staffForm'),
    staffName: document.getElementById('staffName'),
    staffRole: document.getElementById('staffRole'),
    staffLang: document.getElementById('staffLang'),
    staffError: document.getElementById('staffError'),
    staffList: document.getElementById('staffList'),
    staffEmpty: document.getElementById('staffEmpty'),
    sampleButton: document.getElementById('sampleButton'),
    pinnedList: document.getElementById('pinnedList'),
    pinnedEmpty: document.getElementById('pinnedEmpty'),
    search: document.getElementById('search'),
    roleFilter: document.getElementById('roleFilter'),
    phraseList: document.getElementById('phraseList'),
    searchEmpty: document.getElementById('searchEmpty'),
    listenHint: document.getElementById('listenHint'),
    msgRole: document.getElementById('msgRole'),
    msgPhrase: document.getElementById('msgPhrase'),
    msgAdd: document.getElementById('msgAdd'),
    msgError: document.getElementById('msgError'),
    msgBlocks: document.getElementById('msgBlocks'),
    msgDetail: document.getElementById('msgDetail'),
    msgShow: document.getElementById('msgShow'),
    msgClear: document.getElementById('msgClear'),
    msgOutput: document.getElementById('msgOutput'),
    taskForm: document.getElementById('taskForm'),
    taskRole: document.getElementById('taskRole'),
    taskPhrase: document.getElementById('taskPhrase'),
    taskNote: document.getElementById('taskNote'),
    taskAssignee: document.getElementById('taskAssignee'),
    taskError: document.getElementById('taskError'),
    boardLang: document.getElementById('boardLang'),
    taskFilter: document.getElementById('taskFilter'),
    boardEmpty: document.getElementById('boardEmpty'),
    taskList: document.getElementById('taskList'),
    resetButton: document.getElementById('resetButton'),
    confirmBox: document.getElementById('confirmBox'),
    confirmText: document.getElementById('confirmText'),
    confirmYes: document.getElementById('confirmYes'),
    confirmNo: document.getElementById('confirmNo')
 ;

  let filterRole = 'all';

  function init() {
    buildLangChips();
    buildRoleChips();
    buildStaffForm();
    buildRoleSelect(els.msgRole, true);
    buildRoleSelect(els.taskRole, true);
    updateMsgPhraseOptions();
    updateTaskPhraseOptions();
    buildBoardLangSelect();
    buildStaffAssignSelect();

    els.msgRole.addEventListener('change', updateMsgPhraseOptions);
    els.msgAdd.addEventListener('click', addMessageBlock);
    els.msgShow.addEventListener('click', showMessage);
    els.msgClear.addEventListener('click', clearMessage);
    els.msgPhrase.addEventListener('keydown', e => { if (e.key === 'Enter') addMessageBlock(); });

    els.taskRole.addEventListener('change', updateTaskPhraseOptions);
    els.taskForm.addEventListener('submit', addTask);
    els.taskFilter.addEventListener('change', renderTasks);
    els.boardLang.addEventListener('change', () => { state.boardLang = els.boardLang.value; saveState(); renderTasks(); });

    els.search.addEventListener('input', renderPhrases);
    els.sampleButton.addEventListener('click', () => confirmAction('Replace your current team and tasks with sample data?', sampleData));
    els.resetButton.addEventListener('click', () => confirmAction('Clear all settings, phrases, and tasks? This cannot be undone.', resetAll));
    els.confirmYes.addEventListener('click', confirmYes);
    els.confirmNo.addEventListener('click', confirmNo);
    els.staffForm.addEventListener('submit', addStaff);

    window.addEventListener('storage', e => { if (e.key === STORE_KEY) { state = loadState(); renderAll(); } });
    renderAll();
  }

  function buildLangChips() {
    els.langChips.innerHTML = '';
    LANGUAGES.forEach(l => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = l.name;
      btn.classList.toggle('on', state.langs.includes(l.code));
      btn.addEventListener('click', () => {
        if (state.langs.includes(l.code)) {
          if (state.langs.length > 1) state.langs = state.langs.filter(c => c !== l.code);
        } else {
          state.langs.push(l.code);
        }
        saveState();
        buildLangChips();
        buildBoardLangSelect();
        updateMsgPhraseOptions();
        updateTaskPhraseOptions();
        renderPhrases();
        renderPinned();
      });
      els.langChips.appendChild(btn);
    });
    els.langWarn.hidden = state.langs.length > 0;
  }

  function buildRoleChips() {
    els.roleChips.innerHTML = '';
    ROLES.forEach(r => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = r.name;
      btn.classList.toggle('on', state.roles.includes(r.id));
      btn.addEventListener('click', () => {
        if (state.roles.includes(r.id)) {
          if (state.roles.length > 1) state.roles = state.roles.filter(id => id !== r.id);
        } else {
          state.roles.push(r.id);
        }
        saveState();
        buildRoleChips();
        renderPhrases();
      });
      els.roleChips.appendChild(btn);
    });
  }

  function buildStaffForm() {
    els.staffRole.innerHTML = '';
    state.roles.forEach(rid => {
      const r = ROLES.find(x => x.id === rid);
      els.staffRole.appendChild(new Option(r.name, rid));
    });
    els.staffLang.innerHTML = '';
    state.langs.forEach(c => {
      const l = LANGUAGES.find(x => x.code === c);
      els.staffLang.appendChild(new Option(l.name, c));
    });
  }

  function buildRoleSelect(select, includeAll) {
    select.innerHTML = '';
    if (includeAll) select.appendChild(new Option('All roles', 'all'));
    ROLES.forEach(r => select.appendChild(new Option(r.name, r.id)));
  }

  function updateMsgPhraseOptions() {
    const role = els.msgRole.value;
    const current = els.msgPhrase.value;
    els.msgPhrase.innerHTML = '';
    getFilteredPhrases(role).forEach(p => {
      const opt = new Option(p.translations.en, p.id);
      els.msgPhrase.appendChild(opt);
    });
    if (els.msgPhrase.querySelector(`option[value="${current}"]`)) els.msgPhrase.value = current;
  }

  function updateTaskPhraseOptions() {
    const role = els.taskRole.value;
    const current = els.taskPhrase.value;
    els.taskPhrase.innerHTML = '';
    getFilteredPhrases(role).forEach(p => {
      const opt = new Option(p.translations.en, p.id);
      els.taskPhrase.appendChild(opt);
    });
    if (els.taskPhrase.querySelector(`option[value="${current}"]`)) els.taskPhrase.value = current;
  }

  function getFilteredPhrases(role) {
    return allPhrases.filter(p => role === 'all' || p.role === role || (role === 'all-team' && p.role === 'all-team'));
  }

  function buildBoardLangSelect() {
    const current = state.boardLang;
    els.boardLang.innerHTML = '';
    state.langs.forEach(c => {
      const l = LANGUAGES.find(x => x.code === c);
      els.boardLang.appendChild(new Option(l.name, c));
    });
    if (els.boardLang.querySelector(`option[value="${current}"]`)) els.boardLang.value = current;
    else if (els.boardLang.options.length) { state.boardLang = els.boardLang.value; saveState(); }
  }

  function buildStaffAssignSelect() {
    const current = els.taskAssignee.value;
    els.taskAssignee.innerHTML = '';
    els.taskAssignee.appendChild(new Option('Unassigned', ''));
    state.staff.forEach(s => {
      const r = ROLES.find(x => x.id === s.role);
      els.taskAssignee.appendChild(new Option(`${s.name} · ${r ? r.name : s.role}`, s.id));
    });
    if (els.taskAssignee.querySelector(`option[value="${current}"]`)) els.taskAssignee.value = current;
  }

  function addStaff(e) {
    e.preventDefault();
    const name = els.staffName.value.trim();
    const role = els.staffRole.value;
    const lang = els.staffLang.value;
    if (!name) { els.staffError.textContent = 'Please enter a name.'; els.staffError.hidden = false; return; }
    if (state.staff.find(s => s.name.toLowerCase() === name.toLowerCase() && s.role === role)) {
      els.staffError.textContent = 'This team member is already listed.'; els.staffError.hidden = false; return;
    }
    els.staffError.hidden = true;
    const s = { id: 's' + Date.now(), name, role, lang };
    state.staff.push(s);
    saveState();
    els.staffName.value = '';
    buildStaffAssignSelect();
    renderStaff();
  }

  function removeStaff(id) {
    state.staff = state.staff.filter(s => s.id !== id);
    state.tasks.forEach(t => { if (t.assignee === id) t.assignee = ''; });
    saveState();
    buildStaffAssignSelect();
    renderStaff();
    renderTasks();
  }

  function renderStaff() {
    els.staffList.innerHTML = '';
    state.staff.forEach(s => {
      const r = ROLES.find(x => x.id === s.role);
      const l = LANGUAGES.find(x => x.code === s.lang);
      const li = document.createElement('li');
      li.className = 'staff-pill';
      li.innerHTML = `<span class="who">${escapeHtml(s.name)}</span><span class="meta">${r ? r.name : s.role} · ${l ? l.name : s.lang}</span><button type="button" aria-label="Remove ${escapeHtml(s.name)}">&times;</button>`;
      li.querySelector('button').addEventListener('click', () => removeStaff(s.id));
      els.staffList.appendChild(li);
    });
    els.staffEmpty.hidden = state.staff.length > 0;
  }

  function renderPhrases() {
    const query = els.search.value.trim().toLowerCase();
    const activeRoles = state.roles;
    let visible = allPhrases.filter(p => activeRoles.includes(p.role));
    if (filterRole !== 'all') visible = visible.filter(p => p.role === filterRole);
    if (query) {
      visible = visible.filter(p => state.langs.some(c => (p.translations[c] || '').toLowerCase().includes(query)));
    }

    els.roleFilter.innerHTML = '';
    const allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.textContent = 'All roles';
    allBtn.classList.toggle('on', filterRole === 'all');
    allBtn.addEventListener('click', () => { filterRole = 'all'; renderPhrases(); });
    els.roleFilter.appendChild(allBtn);
    activeRoles.forEach(rid => {
      const r = ROLES.find(x => x.id === rid);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = r.name;
      btn.classList.toggle('on', filterRole === rid);
      btn.addEventListener('click', () => { filterRole = rid; renderPhrases(); });
      els.roleFilter.appendChild(btn);
    });

    els.phraseList.innerHTML = '';
    const byRole = {};
    visible.forEach(p => { byRole[p.role] = byRole[p.role] || []; byRole[p.role].push(p); });

    Object.keys(byRole).sort().forEach(rid => {
      const r = ROLES.find(x => x.id === rid);
      const group = document.createElement('div');
      group.className = 'phrase-group';
      group.innerHTML = `<h4>${r ? r.name : rid}</h4>`;
      byRole[rid].forEach(p => {
        group.appendChild(buildPhraseCard(p));
      });
      els.phraseList.appendChild(group);
    });

    els.searchEmpty.hidden = visible.length > 0 || !query;
  }

  function buildPhraseCard(p) {
    const card = document.createElement('div');
    card.className = 'phrase-card';
    const fav = state.favorites.includes(p.id);
    card.innerHTML = `
      <div class="label-row">
        <span class="en">${escapeHtml(p.translations.en)}</span>
        <div class="ctrl">
          <button type="button" class="small listen" aria-label="Listen">🔊</button>
          <button type="button" class="small send" aria-label="Add to message">+</button>
          <button type="button" class="small star" aria-label="${fav ? 'Unpin' : 'Pin'}">${fav ? '★' : '☆'}</button>
        </div>
      </div>
      <div class="translations"></div>
    `;
    const trans = card.querySelector('.translations');
    state.langs.forEach(c => {
      const l = LANGUAGES.find(x => x.code === c);
      if (!p.translations[c]) return;
      const row = document.createElement('div');
      row.className = 'phrase-lang';
      row.innerHTML = `<span class="code">${l.code}</span><span class="text">${escapeHtml(p.translations[c])}</span>`;
      const listenBtn = document.createElement('button');
      listenBtn.type = 'button';
      listenBtn.className = 'small';
      listenBtn.textContent = '🔊';
      listenBtn.setAttribute('aria-label', `Listen in ${l.name}`);
      listenBtn.addEventListener('click', () => speak(p.translations[c], l.voice));
      row.querySelector('.text').appendChild(listenBtn);
      trans.appendChild(row);
    });

    card.querySelector('.listen').addEventListener('click', () => speak(p.translations.en, 'en-US'));
    card.querySelector('.send').addEventListener('click', () => { addBlockById(p.id); });
    card.querySelector('.star').addEventListener('click', () => toggleFavorite(p.id));
    return card;
  }

  function toggleFavorite(id) {
    if (state.favorites.includes(id)) state.favorites = state.favorites.filter(x => x !== id);
    else { state.favorites.push(id); if (state.favorites.length > 24) state.favorites.shift(); }
    saveState();
    renderPhrases();
    renderPinned();
  }

  function addBlockById(id) {
    if (!state.messageBlocks.find(b => b.id === id)) {
      state.messageBlocks.push({ id });
      saveState();
    }
    renderMessageBlocks();
  }

  function addMessageBlock() {
    const id = els.msgPhrase.value;
    if (!id) return;
    addBlockById(id);
    bumpRecent(id);
  }

  function bumpRecent(id) {
    state.recent = [id, ...state.recent.filter(x => x !== id)].slice(0, 12);
    saveState();
    renderPinned();
  }

  function removeBlock(id) {
    state.messageBlocks = state.messageBlocks.filter(b => b.id !== id);
    saveState();
    renderMessageBlocks();
  }

  function renderMessageBlocks() {
    els.msgBlocks.innerHTML = '';
    state.messageBlocks.forEach(b => {
      const p = allPhrases.find(x => x.id === b.id);
      if (!p) return;
      const div = document.createElement('div');
      div.className = 'block';
      div.innerHTML = `<span>${escapeHtml(p.translations.en)}</span><button type="button" aria-label="Remove">&times;</button>`;
      div.querySelector('button').addEventListener('click', () => removeBlock(b.id));
      els.msgBlocks.appendChild(div);
    });
  }

  function clearMessage() {
    state.messageBlocks = [];
    els.msgDetail.value = '';
    els.msgOutput.innerHTML = '';
    saveState();
    renderMessageBlocks();
  }

  function showMessage() {
    const detail = els.msgDetail.value.trim();
    if (state.messageBlocks.length === 0 && !detail) {
      els.msgError.textContent = 'Add at least one phrase or a detail first.';
      els.msgError.hidden = false;
      return;
    }
    els.msgError.hidden = true;
    els.msgOutput.innerHTML = '';
    state.langs.forEach(c => {
      const l = LANGUAGES.find(x => x.code === c);
      const parts = state.messageBlocks.map(b => {
        const p = allPhrases.find(x => x.id === b.id);
        return p && p.translations[c] ? p.translations[c] : '';
      }).filter(Boolean);
      if (detail) parts.push(detail);
      const panel = document.createElement('div');
      panel.className = 'lang-panel';
      panel.innerHTML = `<h4>${l.name}</h4><p>${escapeHtml(parts.join(' · '))}</p>`;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'small';
      btn.textContent = '🔊 Listen';
      btn.addEventListener('click', () => speak(parts.join(' '), l.voice));
      panel.appendChild(btn);
      els.msgOutput.appendChild(panel);
    });
  }

  function renderPinned() {
    const pins = [...state.favorites, ...state.recent.filter(r => !state.favorites.includes(r))];
    els.pinnedList.innerHTML = '';
    if (pins.length === 0) {
      els.pinnedEmpty.hidden = false;
      return;
    }
    els.pinnedEmpty.hidden = true;
    pins.forEach(id => {
      const p = allPhrases.find(x => x.id === id);
      if (!p) return;
      const card = document.createElement('div');
      card.className = 'pin-card';
      const texts = state.langs.slice(0, 3).map(c => {
        const l = LANGUAGES.find(x => x.code === c);
        return `<div><span class="lang-tag">${l.code}</span>${escapeHtml(p.translations[c] || '')}</div>`;
      }).join('');
      card.innerHTML = `<div class="texts">${texts}</div><div class="ctrl"><button type="button" class="small listen" aria-label="Listen">🔊</button><button type="button" class="small send" aria-label="Add to message">+</button><button type="button" class="small star" aria-label="${state.favorites.includes(id) ? 'Unpin' : 'Pin'}">${state.favorites.includes(id) ? '★' : '☆'}</button></div>`;
      card.querySelector('.listen').addEventListener('click', () => speak(p.translations.en, 'en-US'));
      card.querySelector('.send').addEventListener('click', () => addBlockById(id));
      card.querySelector('.star').addEventListener('click', () => toggleFavorite(id));
      els.pinnedList.appendChild(card);
    });
  }

  function addTask(e) {
    e.preventDefault();
    const phraseId = els.taskPhrase.value;
    const note = els.taskNote.value.trim();
    const assignee = els.taskAssignee.value;
    if (!phraseId) { els.taskError.textContent = 'Please choose a task phrase.'; els.taskError.hidden = false; return; }
    els.taskError.hidden = true;
    const t = { id: 't' + Date.now(), phraseId, note, assignee, done: false, created: Date.now() };
    state.tasks.push(t);
    els.taskNote.value = '';
    saveState();
    renderTasks();
  }

  function toggleTask(id) {
    const t = state.tasks.find(x => x.id === id);
    if (t) { t.done = !t.done; saveState(); renderTasks(); }
  }

  function deleteTask(id) {
    state.tasks = state.tasks.filter(x => x.id !== id);
    saveState();
    renderTasks();
  }

  function renderTasks() {
    const all = state.tasks;
    const filter = els.taskFilter.value;
    let visible = all;
    if (filter === 'open') visible = all.filter(t => !t.done);
    if (filter === 'done') visible = all.filter(t => t.done);
    visible.sort((a, b) => a.done - b.done || b.created - a.created);

    const bl = LANGUAGES.find(x => x.code === state.boardLang);
    els.taskList.innerHTML = '';
    els.boardEmpty.hidden = visible.length > 0;
    if (visible.length > 0) {
      els.boardEmpty.textContent = filter === 'open' && all.some(t => t.done) ? 'No open tasks. Switch to Done or All to see finished ones.' : (filter === 'done' ? 'No completed tasks yet.' : 'No tasks yet. Add one above.');
    }

    visible.forEach(t => {
      const p = allPhrases.find(x => x.id === t.phraseId);
      const s = state.staff.find(x => x.id === t.assignee);
      const li = document.createElement('li');
      li.className = 'task-item' + (t.done ? ' done' : '');
      const text = p ? (p.translations[state.boardLang] || p.translations.en) : 'Unknown task';
      const assign = s ? s.name : (t.assignee ? 'Unassigned' : 'Unassigned');
      li.innerHTML = `
        <input class="task-check" type="checkbox" ${t.done ? 'checked' : ''} aria-label="Mark ${t.done ? 'not done' : 'done'}">
        <div class="task-main">
          <div class="task-text">${escapeHtml(text)}</div>
          ${t.note ? `<div class="task-note">${escapeHtml(t.note)}</div>` : ''}
          <div class="task-meta">Assigned: ${escapeHtml(assign)} · ${new Date(t.created).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        <button type="button" class="task-del" aria-label="Delete">&times;</button>
      `;
      li.querySelector('.task-check').addEventListener('change', () => toggleTask(t.id));
      li.querySelector('.task-del').addEventListener('click', () => deleteTask(t.id));
      els.taskList.appendChild(li);
    });
  }

  function renderAll() {
    buildLangChips();
    buildRoleChips();
    buildStaffForm();
    buildRoleSelect(els.msgRole, true);
    buildRoleSelect(els.taskRole, true);
    updateMsgPhraseOptions();
    updateTaskPhraseOptions();
    buildBoardLangSelect();
    buildStaffAssignSelect();
    renderStaff();
    renderPhrases();
    renderPinned();
    renderMessageBlocks();
    renderTasks();
  }

  function resetAll() {
    state = defaultState();
    saveState();
    filterRole = 'all';
    renderAll();
  }

  let confirmCallback = null;
  function confirmAction(text, cb) {
    confirmCallback = cb;
    els.confirmText.textContent = text;
    els.confirmBox.hidden = false;
  }
  function confirmYes() { els.confirmBox.hidden = true; if (confirmCallback) { confirmCallback(); confirmCallback = null; } }
  function confirmNo() { els.confirmBox.hidden = true; confirmCallback = null; }

  function speak(text, voicePref) {
    if (!window.speechSynthesis) { setHint('Text-to-speech is not supported in this browser.'); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => v.lang.startsWith(voicePref));
    if (!match && voices.length) u.voice = voices[0];
    else if (match) u.voice = match;
    u.lang = voicePref;
    window.speechSynthesis.speak(u);
    setHint('Speaking: ' + text);
  }

  function setHint(t) {
    els.listenHint.textContent = t;
    els.listenHint.hidden = false;
    setTimeout(() => { if (els.listenHint.textContent === t) els.listenHint.hidden = true; }, 3000);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  document.addEventListener('DOMContentLoaded', init);
})();
