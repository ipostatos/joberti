// ===========================================================================
// СГЕНЕРИРОВАННЫЙ ФАЙЛ — НЕ РЕДАКТИРОВАТЬ РУКАМИ.
// Источник правды: data/*.json. Пересобрать:  python tools/build_webapp_data.py
// CI падает, если этот файл отстал от data/.
// ===========================================================================
(function (global) {
  "use strict";
  var DATA =
{
 "cases":[],
 "englishDrills":[
  {
   "category":"О себе",
   "hint":"Три части: кто вы сейчас, что делали раньше, чего хотите дальше. Заканчивайте мостиком к этой вакансии.",
   "id":"ed-self-001",
   "keywords":[
    "I've been working",
    "responsible for",
    "what caught my attention"
   ],
   "level":1,
   "model_answer_en":"I'm a junior specialist with about two years of hands-on experience. Right now I'm responsible for day-to-day tasks in a small team: I plan the work, do it myself and report the results. Before that I worked in a different field, and I moved here because I like problems where you can measure the outcome. Recently I've been focused on getting deeper into the technical side, and that's exactly what caught my attention in your job description.",
   "model_answer_ru":"Я джуниор с примерно двухлетним практическим опытом. Сейчас отвечаю за ежедневные задачи в небольшой команде: планирую работу, делаю её сам(а) и отчитываюсь о результате. До этого работал(а) в другой сфере и перешёл(перешла) сюда, потому что люблю задачи с измеримым результатом. В последнее время углубляюсь в техническую часть — именно это привлекло меня в вашей вакансии.",
   "prompt_en":"Tell me about yourself.",
   "prompt_ru":"Расскажите о себе.",
   "rubric":{
    "0":"Не смог(ла) начать без подготовки на русском",
    "1":"Отдельные фразы, много пауз, структура рассыпалась",
    "2":"Рассказал(а) по сути, но с русскими словами и без финального мостика к вакансии",
    "3":"Связный ответ за минуту, структура держится, мостик к вакансии есть",
    "4":"Уверенно, естественно, с конкретикой и без единой русской вставки"
   },
   "seconds":90,
   "track_ids":[]
  },
  {
   "category":"О себе",
   "hint":"Причина про то, куда вы идёте, а не про то, от чего бежите. Никакой критики бывших коллег.",
   "id":"ed-self-002",
   "keywords":[
    "I'm looking for",
    "grow into",
    "the next step"
   ],
   "level":2,
   "model_answer_en":"I've learned a lot in my current role, but the tasks have become repetitive. I'm looking for a place where I can take on more responsibility and work with a bigger system. This role looks like the next step rather than the same job somewhere else.",
   "model_answer_ru":"На текущем месте я многому научился(научилась), но задачи стали повторяться. Ищу место, где смогу взять больше ответственности и работать с системой побольше. Эта позиция выглядит как следующий шаг, а не как та же работа в другом месте.",
   "prompt_en":"Why are you leaving your current job?",
   "prompt_ru":"Почему уходите с текущего места?",
   "rubric":{
    "0":"Ответ не сложился",
    "1":"Прозвучала критика прошлого места",
    "2":"Нейтрально, но без объяснения, чего вы хотите дальше",
    "3":"Спокойно и с причиной, направленной вперёд",
    "4":"Естественно, коротко, с привязкой к этой вакансии"
   },
   "seconds":60,
   "track_ids":[]
  },
  {
   "category":"О себе",
   "hint":"Одна сильная сторона с примером и одна слабая с планом. Слабость не должна быть ключевым навыком вакансии.",
   "id":"ed-self-003",
   "keywords":[
    "my strongest side",
    "actively working on",
    "for example"
   ],
   "level":2,
   "model_answer_en":"My strongest side is that I finish what I start and I document it, so other people can pick it up. For example, I wrote the checklist our team still uses. The area I'm actively working on is speaking up earlier when I disagree — I used to wait until the decision was made. Now I say it during the discussion, even if my English is not perfect.",
   "model_answer_ru":"Сильная сторона — я довожу дело до конца и описываю его так, чтобы другой человек мог подхватить. Например, я написал(а) чек-лист, которым команда пользуется до сих пор. Работаю над тем, чтобы раньше высказывать несогласие: раньше я ждал(а) до принятого решения, теперь говорю во время обсуждения.",
   "prompt_en":"What are your strengths and weaknesses?",
   "prompt_ru":"Какие у вас сильные и слабые стороны?",
   "rubric":{
    "0":"Ответ не сложился",
    "1":"Слабость названа шаблонно («я перфекционист»)",
    "2":"Есть обе части, но без примеров",
    "3":"Сильная сторона с примером, слабая с планом",
    "4":"Звучит честно и конкретно, слабость не бьёт по вакансии"
   },
   "seconds":60,
   "track_ids":[]
  },
  {
   "category":"Опыт и проекты",
   "hint":"STAR: ситуация, задача, ваши действия, результат. Говорите «I», а не «we», когда речь о ваших действиях.",
   "id":"ed-exp-001",
   "keywords":[
    "my role was",
    "I personally",
    "as a result"
   ],
   "level":2,
   "model_answer_en":"The situation was that our reports were built by hand every Monday and it took half a day. My task was to make it faster without buying anything. I personally collected the requirements from three people, built a template with automatic data import and wrote a short guide. As a result, the report takes about twenty minutes now, and two other people can do it without me.",
   "model_answer_ru":"Ситуация: отчёты собирались руками каждый понедельник и занимали полдня. Задача — ускорить без покупки инструментов. Я собрал(а) требования у трёх человек, сделал(а) шаблон с автоматическим импортом данных и написал(а) короткую инструкцию. В итоге отчёт занимает около двадцати минут, и его могут собрать ещё два человека без меня.",
   "prompt_en":"Walk me through a project you're proud of.",
   "prompt_ru":"Расскажите про проект, которым гордитесь.",
   "rubric":{
    "0":"Ответ не сложился",
    "1":"Сплошное «we», вклад не виден",
    "2":"История есть, результата или цифр нет",
    "3":"Полная схема STAR, вклад и результат названы",
    "4":"Схема STAR, цифры, и вы готовы к уточняющим вопросам"
   },
   "seconds":120,
   "track_ids":[]
  },
  {
   "category":"Опыт и проекты",
   "hint":"Признать, объяснить, что сделали немедленно, и что поменяли в процессе, чтобы не повторилось.",
   "id":"ed-exp-002",
   "keywords":[
    "I made a mistake",
    "what I did first",
    "since then"
   ],
   "level":2,
   "model_answer_en":"I made a mistake when I changed a setting on the live system without telling anyone. Users saw errors for about ten minutes. The first thing I did was roll the change back, then I wrote what happened in the team chat before anyone asked. Since then we agreed that changes on the live system go through a second pair of eyes, and I've never repeated it.",
   "model_answer_ru":"Я ошибся(ошиблась), поменяв настройку на боевой системе никого не предупредив. Пользователи видели ошибки минут десять. Первым делом я откатил(а) изменение, потом сам(а) написал(а) в чат команды, до того как меня спросили. После этого мы договорились, что изменения на бою проходят через вторую пару глаз.",
   "prompt_en":"Tell me about a time when something went wrong because of you.",
   "prompt_ru":"Расскажите про случай, когда что-то сломалось по вашей вине.",
   "rubric":{
    "0":"Ответ не сложился",
    "1":"Вина переложена на других",
    "2":"Признал(а), но без выводов и изменений в процессе",
    "3":"Ошибка, действия и вывод названы спокойно",
    "4":"Звучит зрело: без самобичевания и без оправданий"
   },
   "seconds":90,
   "track_ids":[]
  },
  {
   "category":"Технический вопрос",
   "hint":"Аналогия, один пример, без жаргона. Проверяют не знание, а умение объяснить.",
   "id":"ed-tech-001",
   "keywords":[
    "think of it as",
    "for example",
    "the reason is"
   ],
   "level":2,
   "model_answer_en":"Think of it as a queue in a shop. Requests come in faster than we can serve them, so they wait in line. If the line gets too long, people leave — that's a timeout. The reason we care is that a long line looks to the user exactly like a broken system, even though nothing is broken.",
   "model_answer_ru":"Представьте очередь в магазине. Запросы приходят быстрее, чем мы их обслуживаем, и ждут в очереди. Если очередь становится слишком длинной, люди уходят — это таймаут. Важно это потому, что для пользователя длинная очередь выглядит как поломка, даже если ничего не сломано.",
   "prompt_en":"Explain something technical from your work to a person who is not a specialist.",
   "prompt_ru":"Объясните что-то техническое из своей работы неспециалисту.",
   "rubric":{
    "0":"Ответ не сложился",
    "1":"Сплошной жаргон, объяснения не получилось",
    "2":"Объяснил(а), но длинно и без примера",
    "3":"Аналогия плюс пример, без жаргона",
    "4":"Коротко, ясно, собеседник точно понял бы"
   },
   "seconds":90,
   "track_ids":[]
  },
  {
   "category":"Ситуация на работе",
   "hint":"Уточнить его аргументы, принести данные, обозначить риск, принять решение команды и зафиксировать его письменно.",
   "id":"ed-sit-001",
   "keywords":[
    "I'd ask why",
    "look at the data",
    "write it down"
   ],
   "level":2,
   "model_answer_en":"First I'd ask why they prefer that option — often there's context I don't have. Then I'd bring data instead of opinions: numbers from the logs or a small test. If we still disagree, I'd say what risk I see, write it down in the ticket, and go with the team decision. Being right later is worth less than being clear now.",
   "model_answer_ru":"Сначала спросил(а) бы, почему он(а) выбирает этот вариант — часто есть контекст, которого я не знаю. Потом принёс(принесла) бы данные вместо мнений: цифры из логов или маленький тест. Если согласия нет, назвал(а) бы риск, зафиксировал(а) его в задаче и пошёл(пошла) бы за решением команды.",
   "prompt_en":"You disagree with a senior colleague about a technical decision. What do you do?",
   "prompt_ru":"Вы не согласны с более опытным коллегой по техническому решению. Что делаете?",
   "rubric":{
    "0":"Ответ не сложился",
    "1":"Либо «соглашусь молча», либо спор без аргументов",
    "2":"Есть идея принести данные, но нет фиксации решения",
    "3":"Уточнить, аргументировать, зафиксировать, принять решение команды",
    "4":"Звучит как рабочая практика, а не как теория"
   },
   "seconds":90,
   "track_ids":[]
  },
  {
   "category":"Вопросы работодателю",
   "hint":"Два-три вопроса про работу и команду. «Нет вопросов» — худший из возможных ответов.",
   "id":"ed-ask-001",
   "keywords":[
    "first three months",
    "measure the results",
    "next steps"
   ],
   "level":1,
   "model_answer_en":"Yes, three short ones. What would my first three months look like? How do you measure the results of this role? And what are the next steps in the process?",
   "model_answer_ru":"Да, три коротких. Как будут выглядеть мои первые три месяца? Как измеряется результат на этой позиции? И какие следующие шаги в процессе?",
   "prompt_en":"Do you have any questions for us?",
   "prompt_ru":"У вас есть вопросы к нам?",
   "rubric":{
    "0":"Вопросов не нашлось",
    "1":"Один вопрос про условия и всё",
    "2":"Вопросы есть, но общие и подошли бы любой компании",
    "3":"Два-три вопроса про работу, команду и критерии результата",
    "4":"Вопросы показывают, что вы читали описание вакансии и слушали разговор"
   },
   "seconds":60,
   "track_ids":[]
  },
  {
   "category":"Технический вопрос",
   "hint":"Цель упражнения — не ответить, а вежливо и точно переспросить. Назовите, какая часть вопроса потерялась.",
   "id":"ed-mix-001",
   "keywords":[
    "could you repeat",
    "I missed the part",
    "do you mean"
   ],
   "level":3,
   "model_answer_en":"Sorry, I missed the middle part of the question. Could you repeat it a bit more slowly? Just to make sure I understand: do you mean the process we use now, or the one I would design from scratch?",
   "model_answer_ru":"Извините, я потерял(а) середину вопроса. Можете повторить чуть медленнее? И чтобы убедиться, что я правильно понял(а): вы про процесс, который у нас сейчас, или про тот, который я бы спроектировал(а) с нуля?",
   "prompt_en":"I'm going to ask this quickly: what did you not understand in my last question?",
   "prompt_ru":"Отработайте переспрашивание: скажите, что именно вы не поняли.",
   "rubric":{
    "0":"Промолчал(а) бы и ответил(а) наугад",
    "1":"Только «what?» или «sorry?»",
    "2":"Переспросил(а), но не назвал(а), что именно потерялось",
    "3":"Назвал(а) потерянную часть и уточнил(а) смысл",
    "4":"Звучит спокойно и уверенно, разговор продолжается без неловкости"
   },
   "seconds":60,
   "track_ids":[]
  },
  {
   "category":"О себе",
   "hint":"Два-три конкретных совпадения с вакансией и одно доказательство. Без превосходных степеней.",
   "id":"ed-mix-002",
   "keywords":[
    "you're looking for",
    "I've done exactly that",
    "I can show"
   ],
   "level":3,
   "model_answer_en":"You're looking for someone who can take a task end to end and communicate with developers. I've done exactly that for two years, and I can show the checklist and the reports I built. I'm junior, so I'll need guidance on the parts I haven't seen, but I learn fast and I write things down so the team doesn't explain them twice.",
   "model_answer_ru":"Вы ищете человека, который доведёт задачу от начала до конца и сможет общаться с разработчиками. Я делал(а) ровно это два года и могу показать чек-лист и отчёты. Я джуниор, поэтому по незнакомым частям мне понадобится помощь, но я быстро учусь и записываю, чтобы команде не объяснять дважды.",
   "prompt_en":"Sum up in 30 seconds why we should hire you.",
   "prompt_ru":"За 30 секунд: почему стоит нанять именно вас.",
   "rubric":{
    "0":"Ответ не сложился",
    "1":"Общие слова про ответственность и обучаемость",
    "2":"Есть совпадения с вакансией, доказательств нет",
    "3":"Совпадения, доказательство и честная граница опыта",
    "4":"Укладывается в 30 секунд и звучит спокойно"
   },
   "seconds":60,
   "track_ids":[]
  }
 ],
 "englishPhrases":[
  {
   "category":"Начало разговора",
   "en":"Thanks for taking the time to talk to me today.",
   "id":"ph-open-001",
   "level":1,
   "note":"Не начинайте с извинений за свой английский: это первое, что запомнит интервьюер.",
   "ru":"Спасибо, что нашли время поговорить со мной сегодня.",
   "track_ids":[],
   "variants":[
    "Thank you for the invitation, I'm glad to be here."
   ],
   "when":"Первая фраза после приветствия — нейтральная и уместная в любой компании."
  },
  {
   "category":"Начало разговора",
   "en":"Can you hear me well? Let me know if the connection drops.",
   "id":"ph-open-002",
   "level":1,
   "note":"",
   "ru":"Меня хорошо слышно? Скажите, если связь пропадёт.",
   "track_ids":[],
   "variants":[
    "My connection is a bit unstable today, I might freeze for a second."
   ],
   "when":"Начало созвона. Заранее договориться о сбоях связи спокойнее, чем объясняться потом."
  },
  {
   "category":"Начало разговора",
   "en":"Before we start, could you tell me how the interview is structured?",
   "id":"ph-open-003",
   "level":1,
   "note":"Вопрос показывает, что вы планируете время, а не просто плывёте по разговору.",
   "ru":"Прежде чем начнём, расскажете, как устроено собеседование?",
   "track_ids":[],
   "variants":[
    "How much time do we have today?"
   ],
   "when":"Полезно узнать заранее: будет ли живое кодирование, сколько частей, кто ещё присоединится."
  },
  {
   "category":"Начало разговора",
   "en":"My English is intermediate, so I might ask you to repeat something — I hope that's fine.",
   "id":"ph-open-004",
   "level":2,
   "note":"Формулировка «I might ask you to repeat» звучит как рабочая договорённость, а не как оправдание.",
   "ru":"Мой английский на среднем уровне, так что я могу попросить повторить — надеюсь, это нормально.",
   "track_ids":[],
   "variants":[
    "I'm still improving my English, so I'll speak a bit slowly."
   ],
   "when":"Один раз в начале, спокойным тоном. Дальше к теме языка не возвращайтесь."
  },
  {
   "category":"Начало разговора",
   "en":"Just to confirm, we're talking about the position of …, right?",
   "id":"ph-open-005",
   "level":1,
   "note":"",
   "ru":"Уточню: мы говорим о позиции …, верно?",
   "track_ids":[],
   "variants":[
    "Am I right that this role is mostly about …?"
   ],
   "when":"Когда компания ведёт несколько вакансий сразу и вы не уверены, о какой речь."
  },
  {
   "category":"Начало разговора",
   "en":"Would you like me to start with my background or go straight to the technical part?",
   "id":"ph-open-006",
   "level":2,
   "note":"",
   "ru":"Начать с рассказа о себе или сразу перейти к технической части?",
   "track_ids":[],
   "variants":[
    "Where would you like me to start?"
   ],
   "when":"Если интервьюер молчит и ждёт от вас инициативы."
  },
  {
   "category":"Начало разговора",
   "en":"Sorry, I didn't catch your name — could you spell it for me?",
   "id":"ph-open-007",
   "level":1,
   "note":"",
   "ru":"Извините, я не расслышал(а) имя — продиктуете по буквам?",
   "track_ids":[],
   "variants":[
    "How do you pronounce your name correctly?"
   ],
   "when":"Лучше переспросить в первую минуту, чем весь разговор избегать обращения."
  },
  {
   "category":"Начало разговора",
   "en":"I've prepared a couple of questions for the end, if we have time.",
   "id":"ph-open-008",
   "level":2,
   "note":"",
   "ru":"Я подготовил(а) пару вопросов на конец, если останется время.",
   "track_ids":[],
   "variants":[],
   "when":"Ставит рамку разговора и заранее резервирует время на ваши вопросы."
  },
  {
   "category":"Рассказ о себе",
   "en":"I've been working with … for about two years, mostly on …",
   "id":"ph-self-001",
   "level":1,
   "note":"Present Perfect Continuous здесь уместен: занятие началось в прошлом и продолжается.",
   "ru":"Я работаю с … около двух лет, в основном над …",
   "track_ids":[],
   "variants":[
    "I have around two years of hands-on experience in …"
   ],
   "when":"Первое предложение ответа на «Tell me about yourself»: сфера, срок, чем именно занимались."
  },
  {
   "category":"Рассказ о себе",
   "en":"My background is in …, and I moved into … because …",
   "id":"ph-self-002",
   "level":1,
   "note":"Причина должна быть про интерес к работе, а не про недостатки прошлого места.",
   "ru":"Мой бэкграунд — …, и я перешёл(перешла) в …, потому что …",
   "track_ids":[],
   "variants":[
    "I started in … and gradually moved towards …"
   ],
   "when":"Смена профессии. Причина перехода закрывает первый же вопрос интервьюера."
  },
  {
   "category":"Рассказ о себе",
   "en":"Right now I'm focused on …, and that's exactly what caught my attention in this role.",
   "id":"ph-self-003",
   "level":2,
   "note":"Сильный ответ всегда заканчивается мостиком к этой конкретной работе.",
   "ru":"Сейчас я сосредоточен(а) на …, и именно это привлекло меня в этой вакансии.",
   "track_ids":[],
   "variants":[
    "That's the part of the job I enjoy most, and I saw it in your job description."
   ],
   "when":"Финал рассказа о себе: связывает ваш текущий фокус с вакансией."
  },
  {
   "category":"Рассказ о себе",
   "en":"In my current role I'm responsible for …",
   "id":"ph-self-004",
   "level":1,
   "note":"«Responsible for» + существительное или -ing: responsible for testing, not responsible to test.",
   "ru":"На текущем месте я отвечаю за …",
   "track_ids":[],
   "variants":[
    "My main responsibility is …",
    "I take care of …"
   ],
   "when":"Описание зоны ответственности одним предложением."
  },
  {
   "category":"Рассказ о себе",
   "en":"I'd say my strongest side is …, and the area I'm actively working on is …",
   "id":"ph-self-005",
   "level":2,
   "note":"Не называйте слабостью то, что критично для вакансии.",
   "ru":"Сильная сторона у меня — …, а над … я сейчас активно работаю.",
   "track_ids":[],
   "variants":[
    "Something I want to get better at is …"
   ],
   "when":"Вопрос про сильные и слабые стороны. Вторая часть обязана звучать как план, а не как жалоба."
  },
  {
   "category":"Рассказ о себе",
   "en":"I'm looking for a role where I can …",
   "id":"ph-self-006",
   "level":1,
   "note":"",
   "ru":"Я ищу работу, где смогу …",
   "track_ids":[],
   "variants":[
    "What matters to me is working on …"
   ],
   "when":"Ответ на «What are you looking for?» — про содержание работы, а не про условия."
  },
  {
   "category":"Рассказ о себе",
   "en":"I learn best by doing, so I usually build a small project to test a new tool.",
   "id":"ph-self-007",
   "level":2,
   "note":"Дальше сразу назовите конкретный пример проекта, иначе это останется общими словами.",
   "ru":"Я учусь на практике, поэтому обычно делаю маленький проект, чтобы попробовать новый инструмент.",
   "track_ids":[],
   "variants":[
    "I keep a list of things to learn and go through it every week."
   ],
   "when":"Вопрос «How do you learn new things?» — частый для джуниоров."
  },
  {
   "category":"Рассказ о себе",
   "en":"To sum up: two years in …, strong in …, and looking to grow into …",
   "id":"ph-self-008",
   "level":2,
   "note":"",
   "ru":"Итого: два года в …, силён(сильна) в …, хочу вырасти в …",
   "track_ids":[],
   "variants":[
    "In short, …"
   ],
   "when":"Короткое резюме в конце длинного ответа. Помогает, когда вы почувствовали, что говорите слишком долго."
  },
  {
   "category":"Опыт и проекты",
   "en":"The project I'm most proud of is …",
   "id":"ph-exp-001",
   "level":1,
   "note":"Держите схему STAR: situation, task, action, result.",
   "ru":"Проект, которым я больше всего горжусь, — …",
   "track_ids":[],
   "variants":[
    "A good example would be …"
   ],
   "when":"Начало рассказа о проекте. Дальше — задача, ваши действия, результат."
  },
  {
   "category":"Опыт и проекты",
   "en":"My role there was to …, while the rest of the team handled …",
   "id":"ph-exp-002",
   "level":1,
   "note":"Говорите «I», а не «we», когда речь о ваших действиях. «We» в рассказе о себе — самая частая претензия.",
   "ru":"Моя роль была в том, чтобы …, а остальная команда занималась …",
   "track_ids":[],
   "variants":[
    "I personally was responsible for …"
   ],
   "when":"Отделяет ваш вклад от командного. Интервьюер спрашивает именно про ваш."
  },
  {
   "category":"Опыт и проекты",
   "en":"As a result, we reduced … by about 30% within two months.",
   "id":"ph-exp-003",
   "level":2,
   "note":"Если точной цифры нет, скажите «roughly» или «around» — выдуманная точность легко ломается уточняющим вопросом.",
   "ru":"В результате мы снизили … примерно на 30% за два месяца.",
   "track_ids":[],
   "variants":[
    "That saved the team around five hours a week."
   ],
   "when":"Итог рассказа. Цифра и срок делают историю проверяемой."
  },
  {
   "category":"Опыт и проекты",
   "en":"It didn't work out at first, and here's what I changed …",
   "id":"ph-exp-004",
   "level":2,
   "note":"",
   "ru":"Сначала не получилось, и вот что я поменял(а) …",
   "track_ids":[],
   "variants":[
    "Looking back, I would do … differently."
   ],
   "when":"Вопрос про провал или ошибку. Честное признание плюс вывод — сильнее «у меня не было провалов»."
  },
  {
   "category":"Опыт и проекты",
   "en":"We disagreed on …, so I suggested we look at the data before deciding.",
   "id":"ph-exp-005",
   "level":2,
   "note":"Не переходите на личности собеседников — интервьюер услышит это как сигнал.",
   "ru":"Мы разошлись во мнениях о …, и я предложил(а) посмотреть на данные до решения.",
   "track_ids":[],
   "variants":[
    "Instead of arguing, we ran a quick experiment."
   ],
   "when":"Вопрос про конфликт в команде. Показывает способ решать спор, а не сам спор."
  },
  {
   "category":"Опыт и проекты",
   "en":"I worked closely with developers, so I know how to explain … in their terms.",
   "id":"ph-exp-006",
   "level":1,
   "note":"",
   "ru":"Я плотно работал(а) с разработчиками, поэтому умею объяснять … на их языке.",
   "track_ids":[],
   "variants":[
    "I'm used to working with people outside my team."
   ],
   "when":"Когда важна кросс-командная коммуникация."
  },
  {
   "category":"Опыт и проекты",
   "en":"There was a trade-off between speed and reliability, and we chose … because …",
   "id":"ph-exp-007",
   "level":3,
   "note":"",
   "ru":"Был компромисс между скоростью и надёжностью, и мы выбрали …, потому что …",
   "track_ids":[],
   "variants":[
    "We knew the downside was …, and we accepted it because …"
   ],
   "when":"Когда просят объяснить принятое решение. Названный компромисс показывает инженерное мышление."
  },
  {
   "category":"Опыт и проекты",
   "en":"I don't have commercial experience with that yet, but I've used it in a personal project.",
   "id":"ph-exp-008",
   "level":2,
   "note":"Честная граница между «работал в проде» и «пробовал сам» — то, что проверяют на второй минуте.",
   "ru":"Коммерческого опыта с этим у меня пока нет, но я использовал(а) это в своём проекте.",
   "track_ids":[],
   "variants":[
    "Only in a test environment so far, not in production."
   ],
   "when":"Требование вакансии, которое вы закрываете не работой, а практикой."
  },
  {
   "category":"Технические объяснения",
   "en":"Let me walk you through it step by step.",
   "id":"ph-tech-001",
   "level":1,
   "note":"После этой фразы держите обещание: «first… then… finally…».",
   "ru":"Давайте я пройду по шагам.",
   "track_ids":[],
   "variants":[
    "I'll break it down into three parts."
   ],
   "when":"Начало объяснения процесса. Сразу задаёт структуру ответу."
  },
  {
   "category":"Технические объяснения",
   "en":"The short answer is …; the longer version is …",
   "id":"ph-tech-002",
   "level":1,
   "note":"",
   "ru":"Коротко — …; если подробнее, то …",
   "track_ids":[],
   "variants":[
    "In one sentence: …"
   ],
   "when":"Даёт интервьюеру выбор: остановить вас или услышать детали."
  },
  {
   "category":"Технические объяснения",
   "en":"It depends on … — for example, if …, then …",
   "id":"ph-tech-003",
   "level":2,
   "note":"Никогда не оставляйте «it depends» без продолжения.",
   "ru":"Зависит от … — например, если …, то …",
   "track_ids":[],
   "variants":[
    "There are two cases here: …"
   ],
   "when":"Вопрос без единственно верного ответа. Голое «it depends» звучит как уход от ответа, поэтому сразу давайте пример."
  },
  {
   "category":"Технические объяснения",
   "en":"The main difference between A and B is that …",
   "id":"ph-tech-004",
   "level":2,
   "note":"«Difference between A and B», не «difference of A from B».",
   "ru":"Главное различие между A и B в том, что …",
   "track_ids":[],
   "variants":[
    "A and B look similar, but they solve different problems."
   ],
   "when":"Классический вопрос на сравнение двух понятий."
  },
  {
   "category":"Технические объяснения",
   "en":"First I'd check …, then I'd look at …, and only after that I'd change anything.",
   "id":"ph-tech-005",
   "level":2,
   "note":"Интервьюер оценивает порядок действий, а не угаданную причину.",
   "ru":"Сначала я проверил(а) бы …, потом посмотрел(а) бы …, и только после этого что-то менял(а) бы.",
   "track_ids":[],
   "variants":[
    "My first step would be to reproduce it."
   ],
   "when":"Вопрос-диагностика: «сайт упал», «платёж не прошёл», «тест падает»."
  },
  {
   "category":"Технические объяснения",
   "en":"To give you a concrete example from my work: …",
   "id":"ph-tech-006",
   "level":2,
   "note":"",
   "ru":"Приведу конкретный пример из работы: …",
   "track_ids":[],
   "variants":[
    "We had exactly this case last year."
   ],
   "when":"Переход от теории к практике. Сильно повышает доверие к ответу."
  },
  {
   "category":"Технические объяснения",
   "en":"I'd rather double-check that in the documentation than guess.",
   "id":"ph-tech-007",
   "level":3,
   "note":"Это не слабость: в проде угадывание дороже проверки.",
   "ru":"Я бы лучше уточнил(а) это в документации, чем угадывал(а).",
   "track_ids":[],
   "variants":[
    "I remember the idea, but I'd verify the exact syntax."
   ],
   "when":"Когда вы помните суть, но не уверены в деталях."
  },
  {
   "category":"Технические объяснения",
   "en":"Does that answer your question, or would you like more detail?",
   "id":"ph-tech-008",
   "level":1,
   "note":"",
   "ru":"Это отвечает на ваш вопрос или рассказать подробнее?",
   "track_ids":[],
   "variants":[
    "Should I go deeper into that?"
   ],
   "when":"Финал длинного ответа. Возвращает управление разговором интервьюеру."
  },
  {
   "category":"Если не понял или нужно время",
   "en":"Sorry, could you repeat that, please?",
   "id":"ph-clar-001",
   "level":1,
   "note":"Не кивайте, если не поняли: ответ невпопад хуже, чем просьба повторить.",
   "ru":"Извините, можете повторить?",
   "track_ids":[],
   "variants":[
    "Sorry, I missed the last part."
   ],
   "when":"Самая нужная фраза на собеседовании на английском. Переспросить нормально."
  },
  {
   "category":"Если не понял или нужно время",
   "en":"Could you speak a bit more slowly, please?",
   "id":"ph-clar-002",
   "level":1,
   "note":"",
   "ru":"Можно чуть медленнее?",
   "track_ids":[],
   "variants":[
    "Would you mind slowing down a little?"
   ],
   "when":"Один раз в начале — и дальше разговор пойдёт в комфортном темпе."
  },
  {
   "category":"Если не понял или нужно время",
   "en":"Just to make sure I understand: you're asking about …, right?",
   "id":"ph-clar-003",
   "level":2,
   "note":"Заодно даёт вам время подумать.",
   "ru":"Чтобы убедиться, что я правильно понял(а): вы спрашиваете про …, так?",
   "track_ids":[],
   "variants":[
    "If I got it right, you mean …"
   ],
   "when":"Длинный или размытый вопрос. Пересказ своими словами экономит минуту разговора."
  },
  {
   "category":"Если не понял или нужно время",
   "en":"That's a good question — let me think for a second.",
   "id":"ph-clar-004",
   "level":2,
   "note":"Не растягивайте паузу дольше пяти секунд, лучше начните рассуждать вслух.",
   "ru":"Хороший вопрос — дайте секунду подумать.",
   "track_ids":[],
   "variants":[
    "Let me take a moment to structure my answer."
   ],
   "when":"Легальная пауза. Тишина в две-три секунды выглядит лучше, чем «э-э-э»."
  },
  {
   "category":"Если не понял или нужно время",
   "en":"How do you call it in English? … I mean the thing that …",
   "id":"ph-clar-005",
   "level":2,
   "note":"",
   "ru":"Как это по-английски? … Я имею в виду то, что …",
   "track_ids":[],
   "variants":[
    "I forgot the word — it's the tool that …"
   ],
   "when":"Забыли слово. Описание через функцию работает: собеседник сам подскажет термин."
  },
  {
   "category":"Если не понял или нужно время",
   "en":"Could you rephrase the question, please?",
   "id":"ph-clar-006",
   "level":1,
   "note":"«Rephrase» вежливее, чем «I don't understand».",
   "ru":"Можете переформулировать вопрос?",
   "track_ids":[],
   "variants":[
    "What exactly do you mean by …?"
   ],
   "when":"Когда вы услышали слова, но не поняли смысл."
  },
  {
   "category":"Если не понял или нужно время",
   "en":"Would it be easier if I showed you in the code?",
   "id":"ph-clar-007",
   "level":2,
   "note":"",
   "ru":"Может, будет проще, если я покажу в коде?",
   "track_ids":[],
   "variants":[
    "Can I draw it quickly?"
   ],
   "when":"Когда объяснение словами буксует, а экран доступен."
  },
  {
   "category":"Если не понял или нужно время",
   "en":"Sorry, my connection froze for a moment — could you repeat the last question?",
   "id":"ph-clar-008",
   "level":1,
   "note":"",
   "ru":"Извините, связь подвисла — повторите последний вопрос?",
   "track_ids":[],
   "variants":[
    "I think we lost each other for a second."
   ],
   "when":"Честная причина, которая никого не удивляет на удалённом созвоне."
  },
  {
   "category":"Когда не знаешь ответа",
   "en":"I haven't worked with that, but here's how I would approach it.",
   "id":"ph-idk-001",
   "level":1,
   "note":"Продолжение обязательно: без него фраза превращается в «не знаю».",
   "ru":"С этим я не работал(а), но вот как бы я к этому подошёл(подошла).",
   "track_ids":[],
   "variants":[
    "That's new to me — my first guess would be …"
   ],
   "when":"Лучший ответ на незнакомую тему: честно плюс ход мысли."
  },
  {
   "category":"Когда не знаешь ответа",
   "en":"I know the concept, but I've never used it in production.",
   "id":"ph-idk-002",
   "level":2,
   "note":"",
   "ru":"Понятие я знаю, но в проде не использовал(а).",
   "track_ids":[],
   "variants":[
    "I've read about it, but only tried it in a sandbox."
   ],
   "when":"Честная граница знания. Интервьюеры проверяют её почти всегда."
  },
  {
   "category":"Когда не знаешь ответа",
   "en":"I'd start by checking the official documentation and asking someone on the team.",
   "id":"ph-idk-003",
   "level":2,
   "note":"Назовите конкретный источник, а не «загуглю»: это выглядит профессиональнее.",
   "ru":"Я бы начал(а) с официальной документации и спросил(а) бы кого-то в команде.",
   "track_ids":[],
   "variants":[
    "I'd look at the docs first, then at similar cases in our codebase."
   ],
   "when":"Вопрос «что вы сделаете, если не знаете?»."
  },
  {
   "category":"Когда не знаешь ответа",
   "en":"Can I come back to this question at the end?",
   "id":"ph-idk-004",
   "level":2,
   "note":"Обязательно вернитесь — иначе фраза читается как уклонение.",
   "ru":"Можно вернуться к этому вопросу в конце?",
   "track_ids":[],
   "variants":[
    "I might have a better answer after we discuss …"
   ],
   "when":"Если ответ вертится на языке, но не складывается прямо сейчас."
  },
  {
   "category":"Когда не знаешь ответа",
   "en":"I'm not sure, and I don't want to guess — could you point me in the right direction?",
   "id":"ph-idk-005",
   "level":3,
   "note":"Интервьюер часто подсказывает и продолжает вопрос вместе с вами — это нормальная часть интервью.",
   "ru":"Я не уверен(а) и не хочу гадать — подскажете направление?",
   "track_ids":[],
   "variants":[
    "A hint would help me a lot here."
   ],
   "when":"Сильная фраза: признаёт незнание и продолжает диалог."
  },
  {
   "category":"Когда не знаешь ответа",
   "en":"I might be wrong here, but my understanding is that …",
   "id":"ph-idk-006",
   "level":2,
   "note":"Не начинайте так каждый ответ: постоянные оговорки читаются как неуверенность.",
   "ru":"Возможно, я ошибаюсь, но насколько я понимаю, …",
   "track_ids":[],
   "variants":[
    "As far as I remember, …"
   ],
   "when":"Когда вы почти уверены. Оговорка защищает от резкой ошибки и не мешает ответить."
  },
  {
   "category":"Когда не знаешь ответа",
   "en":"That's outside my experience, but it sounds close to … which I have done.",
   "id":"ph-idk-007",
   "level":2,
   "note":"",
   "ru":"Это вне моего опыта, но похоже на …, что я делал(а).",
   "track_ids":[],
   "variants":[
    "I've solved a similar problem in a different context."
   ],
   "when":"Перенос знакомого опыта на незнакомую задачу."
  },
  {
   "category":"Когда не знаешь ответа",
   "en":"I'll look into it after our call and can send you my answer.",
   "id":"ph-idk-008",
   "level":1,
   "note":"",
   "ru":"Я разберусь после созвона и могу прислать ответ.",
   "track_ids":[],
   "variants":[
    "I'd like to read up on it properly before answering."
   ],
   "when":"Работает только если вы действительно напишете письмо. Тогда это сильный ход."
  },
  {
   "category":"Вопросы работодателю",
   "en":"What would my first three months look like?",
   "id":"ph-ask-001",
   "level":1,
   "note":"",
   "ru":"Как будут выглядеть мои первые три месяца?",
   "track_ids":[],
   "variants":[
    "What does success look like in this role after six months?"
   ],
   "when":"Лучший первый вопрос: показывает, что вы думаете о работе, а не только о найме."
  },
  {
   "category":"Вопросы работодателю",
   "en":"Who would I work with most closely?",
   "id":"ph-ask-002",
   "level":1,
   "note":"",
   "ru":"С кем я буду работать плотнее всего?",
   "track_ids":[],
   "variants":[
    "How is the team organised?"
   ],
   "when":"Про команду и связи, а не про формальную структуру."
  },
  {
   "category":"Вопросы работодателю",
   "en":"What's the biggest challenge the team is facing right now?",
   "id":"ph-ask-003",
   "level":2,
   "note":"",
   "ru":"Какая самая большая сложность у команды сейчас?",
   "track_ids":[],
   "variants":[
    "What keeps the team busy these days?"
   ],
   "when":"Ответ покажет реальное состояние дел лучше, чем описание вакансии."
  },
  {
   "category":"Вопросы работодателю",
   "en":"How do you measure the results of this role?",
   "id":"ph-ask-004",
   "level":2,
   "note":"",
   "ru":"Как измеряется результат на этой позиции?",
   "track_ids":[],
   "variants":[
    "Which metrics does the team look at?"
   ],
   "when":"Хороший вопрос от кандидата любого уровня: вы спрашиваете про критерии, по которым вас будут оценивать."
  },
  {
   "category":"Вопросы работодателю",
   "en":"How does the team handle code review and knowledge sharing?",
   "id":"ph-ask-005",
   "level":2,
   "note":"",
   "ru":"Как в команде устроены код-ревью и обмен знаниями?",
   "track_ids":[],
   "variants":[
    "Is there someone who would mentor me at the start?"
   ],
   "when":"Для джуниора это вопрос о том, будет ли у вас обучение на работе."
  },
  {
   "category":"Вопросы работодателю",
   "en":"How much of the communication happens in English?",
   "id":"ph-ask-006",
   "level":2,
   "note":"",
   "ru":"Насколько много общения идёт на английском?",
   "track_ids":[],
   "variants":[
    "Is the documentation in English as well?"
   ],
   "when":"Практичный вопрос: письменный английский и созвоны требуют разной подготовки."
  },
  {
   "category":"Вопросы работодателю",
   "en":"What happens when something goes wrong in production — what's the process?",
   "id":"ph-ask-007",
   "level":3,
   "note":"",
   "ru":"Что происходит, когда в проде что-то ломается — как устроен процесс?",
   "track_ids":[],
   "variants":[
    "Do you run post-mortems after incidents?"
   ],
   "when":"Ответ многое скажет о зрелости команды и о том, ищут ли в ней виноватых."
  },
  {
   "category":"Вопросы работодателю",
   "en":"What are the next steps in the process?",
   "id":"ph-ask-008",
   "level":1,
   "note":"",
   "ru":"Какие следующие шаги в процессе найма?",
   "track_ids":[],
   "variants":[
    "When can I expect to hear back from you?"
   ],
   "when":"Последний вопрос перед прощанием. Задавайте его всегда."
  },
  {
   "category":"Условия и финал",
   "en":"What's the salary range for this position?",
   "id":"ph-fin-001",
   "level":2,
   "note":"«Salary range», а не «how much money will I get».",
   "ru":"Какая вилка по зарплате на этой позиции?",
   "track_ids":[],
   "variants":[
    "Could you share the budget you have for this role?"
   ],
   "when":"Прямой и нормальный вопрос. Спрашивать про вилку не считается бестактным."
  },
  {
   "category":"Условия и финал",
   "en":"My expectation is around …, but I'm open to discussing it.",
   "id":"ph-fin-002",
   "level":2,
   "note":"Не называйте сумму первым, если можете вежливо вернуть вопрос.",
   "ru":"Мои ожидания — около …, но я готов(а) обсуждать.",
   "track_ids":[],
   "variants":[
    "I'd rather hear your range first, if that's possible."
   ],
   "when":"Ответ на вопрос об ожиданиях. Называйте вилку, а не одно число."
  },
  {
   "category":"Условия и финал",
   "en":"Is the role fully remote, hybrid, or on-site?",
   "id":"ph-fin-003",
   "level":1,
   "note":"",
   "ru":"Позиция полностью удалённая, гибрид или из офиса?",
   "track_ids":[],
   "variants":[
    "How many days in the office are expected?"
   ],
   "when":"Уточняйте до оффера, а не после."
  },
  {
   "category":"Условия и финал",
   "en":"Which time zone does the team work in, and how flexible are the hours?",
   "id":"ph-fin-004",
   "level":2,
   "note":"",
   "ru":"В каком часовом поясе работает команда и насколько гибкий график?",
   "track_ids":[],
   "variants":[
    "Are there fixed meeting hours?"
   ],
   "when":"Для распределённых команд это важнее зарплаты."
  },
  {
   "category":"Условия и финал",
   "en":"Could I have a couple of days to think it over?",
   "id":"ph-fin-005",
   "level":2,
   "note":"Назовите конкретный срок, тогда пауза не выглядит как сомнение.",
   "ru":"Можно мне пару дней подумать?",
   "track_ids":[],
   "variants":[
    "I'd like to discuss it with my family and come back to you on Friday."
   ],
   "when":"Ответ на оффер. Просить время — обычная практика."
  },
  {
   "category":"Условия и финал",
   "en":"Thank you, it was a pleasure talking to you.",
   "id":"ph-fin-006",
   "level":1,
   "note":"",
   "ru":"Спасибо, было приятно пообщаться.",
   "track_ids":[],
   "variants":[
    "Thanks again for your time today."
   ],
   "when":"Прощание. Коротко и без лишних слов."
  },
  {
   "category":"Условия и финал",
   "en":"I'm still interested in the role — is there any update on my application?",
   "id":"ph-fin-007",
   "level":2,
   "note":"Одно напоминание уместно, три — нет.",
   "ru":"Я по-прежнему заинтересован(а) в позиции — есть ли новости по моей заявке?",
   "track_ids":[],
   "variants":[
    "Just following up on our conversation last week."
   ],
   "when":"Письмо-напоминание через неделю после обещанного срока."
  },
  {
   "category":"Условия и финал",
   "en":"Thank you for letting me know. Could you share what I could improve?",
   "id":"ph-fin-008",
   "level":2,
   "note":"Отвечайте спокойно: компании возвращаются к кандидатам через полгода.",
   "ru":"Спасибо, что сообщили. Подскажете, что мне стоит подтянуть?",
   "track_ids":[],
   "variants":[
    "I'd appreciate any feedback that could help me next time."
   ],
   "when":"Ответ на отказ. Обратная связь после отказа — самый дешёвый источник роста."
  }
 ],
 "englishVocab":[
  {
   "category":"Базовая лексика",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/queue",
   "example_en":"Messages pile up in the queue when the worker is down.",
   "example_ru":"Сообщения копятся в очереди, когда обработчик не работает.",
   "id":"ev-queue",
   "ipa":"/kjuː/",
   "level":1,
   "meaning":"очередь: задач, сообщений, запросов",
   "ru_hint":"кью",
   "term":"queue",
   "track_ids":[],
   "wrong":"«ку-е-у-е» по буквам — читается только первая буква, остальные немые"
  },
  {
   "category":"Базовая лексика",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/cache",
   "example_en":"Clear the cache and try again.",
   "example_ru":"Очистите кэш и повторите попытку.",
   "id":"ev-cache",
   "ipa":"/kæʃ/",
   "level":1,
   "meaning":"промежуточное хранилище, чтобы не считать одно и то же дважды",
   "ru_hint":"кэш",
   "term":"cache",
   "track_ids":[],
   "wrong":"«кашэ» на французский манер — это другое слово (cachet)"
  },
  {
   "category":"Данные и API",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/schema",
   "example_en":"We changed the schema, so the old client breaks.",
   "example_ru":"Мы поменяли схему, поэтому старый клиент ломается.",
   "id":"ev-schema",
   "ipa":"/ˈskiːmə/",
   "level":1,
   "meaning":"описание структуры данных: таблиц, полей, типов",
   "ru_hint":"СКИ-ма",
   "term":"schema",
   "track_ids":[],
   "wrong":"«шема» или «схема» — начало читается как «ск», не «ш»"
  },
  {
   "category":"Процесс и команда",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/suite",
   "example_en":"The whole test suite takes about ten minutes.",
   "example_ru":"Весь набор тестов идёт около десяти минут.",
   "id":"ev-suite",
   "ipa":"/swiːt/",
   "level":1,
   "meaning":"набор: тестов, инструментов, продуктов",
   "ru_hint":"суит (как sweet)",
   "term":"suite",
   "track_ids":[],
   "wrong":"«сьют» как suit (костюм) — это другое слово"
  },
  {
   "category":"Процесс и команда",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/deploy",
   "example_en":"We deploy to production twice a week.",
   "example_ru":"Мы выкатываем в прод дважды в неделю.",
   "id":"ev-deploy",
   "ipa":"/dɪˈplɔɪ/",
   "level":1,
   "meaning":"выкатить код на сервер",
   "ru_hint":"ди-ПЛОЙ",
   "term":"deploy",
   "track_ids":[],
   "wrong":"ударение на первый слог: «ДЕплой»"
  },
  {
   "category":"Инфраструктура",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/route",
   "example_en":"This route is handled by the API gateway.",
   "example_ru":"Этот маршрут обрабатывает API-шлюз.",
   "id":"ev-route",
   "ipa":"/ruːt/ (BrE), /raʊt/ (AmE)",
   "level":2,
   "meaning":"маршрут запроса или адрес в приложении",
   "ru_hint":"рут (британский), раут (американский)",
   "term":"route",
   "track_ids":[],
   "wrong":"смешение с root /ruːt/ — «корень». В британском они звучат одинаково, поэтому уточняйте по контексту"
  },
  {
   "category":"Процесс и команда",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/issue",
   "example_en":"I opened an issue and linked the logs.",
   "example_ru":"Я завёл(а) задачу и приложил(а) логи.",
   "id":"ev-issue",
   "ipa":"/ˈɪʃuː/",
   "level":1,
   "meaning":"задача в трекере или проблема",
   "ru_hint":"И-шу",
   "term":"issue",
   "track_ids":[],
   "wrong":"«иссуе» по буквам"
  },
  {
   "category":"Данные и API",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/query",
   "example_en":"This query takes two seconds on production data.",
   "example_ru":"Этот запрос выполняется две секунды на боевых данных.",
   "id":"ev-query",
   "ipa":"/ˈkwɪəri/",
   "level":1,
   "meaning":"запрос: к базе, к поиску, к API",
   "ru_hint":"КВИ-ри",
   "term":"query",
   "track_ids":[],
   "wrong":"«кьюери» — первая буква читается как «кв»"
  },
  {
   "category":"Данные и API",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/data",
   "example_en":"The data comes from two different sources.",
   "example_ru":"Данные приходят из двух разных источников.",
   "id":"ev-data",
   "ipa":"/ˈdeɪtə/",
   "level":1,
   "meaning":"данные",
   "ru_hint":"ДЭЙ-та",
   "term":"data",
   "track_ids":[],
   "wrong":"«дата» по-русски. В английском первый слог — «дэй»"
  },
  {
   "category":"Базовая лексика",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/status",
   "example_en":"The request returns status 404.",
   "example_ru":"Запрос возвращает статус 404.",
   "id":"ev-status",
   "ipa":"/ˈsteɪtəs/",
   "level":1,
   "meaning":"состояние: заявки, задачи, ответа сервера",
   "ru_hint":"СТЭЙ-тас",
   "term":"status",
   "track_ids":[],
   "wrong":"«статус» с русским «а» в первом слоге"
  },
  {
   "category":"Инфраструктура",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/environment",
   "example_en":"It works on my machine but fails in the staging environment.",
   "example_ru":"У меня локально работает, а на тестовой среде падает.",
   "id":"ev-environment",
   "ipa":"/ɪnˈvaɪrənmənt/",
   "level":2,
   "meaning":"среда: тестовая, боевая, локальная",
   "ru_hint":"ин-ВАЙ-рон-мент",
   "term":"environment",
   "track_ids":[],
   "wrong":"«энвайронмент» с ударением не туда; второй слог — «вай»"
  },
  {
   "category":"Базовая лексика",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/variable",
   "example_en":"The value comes from an environment variable.",
   "example_ru":"Значение приходит из переменной окружения.",
   "id":"ev-variable",
   "ipa":"/ˈveəriəbl/",
   "level":1,
   "meaning":"переменная",
   "ru_hint":"ВЭ-ри-эбл",
   "term":"variable",
   "track_ids":[],
   "wrong":"«вариабле» с ударением на «а» в середине"
  },
  {
   "category":"Базовая лексика",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/hierarchy",
   "example_en":"The page hierarchy is three levels deep.",
   "example_ru":"Иерархия страниц уходит на три уровня.",
   "id":"ev-hierarchy",
   "ipa":"/ˈhaɪərɑːki/",
   "level":2,
   "meaning":"иерархия: страниц, папок, ролей",
   "ru_hint":"ХАЙ-э-ра-ки",
   "term":"hierarchy",
   "track_ids":[],
   "wrong":"«хиерархи» — первый слог «хай»"
  },
  {
   "category":"Базовая лексика",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/architecture",
   "example_en":"Let me draw the architecture quickly.",
   "example_ru":"Давайте я быстро нарисую архитектуру.",
   "id":"ev-architecture",
   "ipa":"/ˈɑːkɪtektʃə/",
   "level":2,
   "meaning":"устройство системы в целом",
   "ru_hint":"А-ки-тек-ча",
   "term":"architecture",
   "track_ids":[],
   "wrong":"«архитекчур» с «х» в начале: в английском это «к»"
  },
  {
   "category":"Инфраструктура",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/latency",
   "example_en":"Latency went up after the last release.",
   "example_ru":"Задержка выросла после последнего релиза.",
   "id":"ev-latency",
   "ipa":"/ˈleɪtənsi/",
   "level":2,
   "meaning":"задержка между запросом и ответом",
   "ru_hint":"ЛЭЙ-тен-си",
   "term":"latency",
   "track_ids":[],
   "wrong":"«латенси» с русским «а»"
  },
  {
   "category":"Инфраструктура",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/throughput",
   "example_en":"We doubled throughput without adding servers.",
   "example_ru":"Мы удвоили пропускную способность без новых серверов.",
   "id":"ev-throughput",
   "ipa":"/ˈθruːpʊt/",
   "level":3,
   "meaning":"пропускная способность: сколько работы система тянет за единицу времени",
   "ru_hint":"СРУ-пут (первый звук — межзубный)",
   "term":"throughput",
   "track_ids":[],
   "wrong":"«сроугхпут» с попыткой прочитать gh — оно немое"
  },
  {
   "category":"Данные и API",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/authentication",
   "example_en":"Authentication happens before authorization.",
   "example_ru":"Аутентификация идёт до авторизации.",
   "id":"ev-authentication",
   "ipa":"/ɔːˌθentɪˈkeɪʃn/",
   "level":2,
   "meaning":"проверка, что пользователь тот, за кого себя выдаёт",
   "ru_hint":"о-сен-ти-КЭЙ-шн",
   "term":"authentication",
   "track_ids":[],
   "wrong":"путают с authorization — это уже проверка прав, а не личности"
  },
  {
   "category":"Инфраструктура",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/image",
   "example_en":"The image is about 200 megabytes.",
   "example_ru":"Образ весит около 200 мегабайт.",
   "id":"ev-image",
   "ipa":"/ˈɪmɪdʒ/",
   "level":1,
   "meaning":"образ (контейнера) или картинка",
   "ru_hint":"И-мидж",
   "term":"image",
   "track_ids":[],
   "wrong":"«имейдж» с длинным «эй»"
  },
  {
   "category":"Базовая лексика",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/engine",
   "example_en":"Search engines see the page differently.",
   "example_ru":"Поисковые системы видят страницу иначе.",
   "id":"ev-engine",
   "ipa":"/ˈendʒɪn/",
   "level":1,
   "meaning":"движок: поисковый, шаблонный, игровой",
   "ru_hint":"ЭН-джин",
   "term":"engine",
   "track_ids":[],
   "wrong":"«энджайн» с «ай» во втором слоге"
  },
  {
   "category":"Базовая лексика",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/library",
   "example_en":"We use a third-party library for that.",
   "example_ru":"Для этого мы используем стороннюю библиотеку.",
   "id":"ev-library",
   "ipa":"/ˈlaɪbrəri/",
   "level":1,
   "meaning":"библиотека кода",
   "ru_hint":"ЛАЙ-бра-ри",
   "term":"library",
   "track_ids":[],
   "wrong":"«либрари» с «и» в первом слоге"
  },
  {
   "category":"Данные и API",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/integer",
   "example_en":"The field expects an integer, not a string.",
   "example_ru":"Поле ждёт целое число, а не строку.",
   "id":"ev-integer",
   "ipa":"/ˈɪntɪdʒə/",
   "level":2,
   "meaning":"целое число",
   "ru_hint":"ИН-ти-джа",
   "term":"integer",
   "track_ids":[],
   "wrong":"«интегер» с твёрдым «г»"
  },
  {
   "category":"Базовая лексика",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/height",
   "example_en":"Set a fixed height for the container.",
   "example_ru":"Задайте фиксированную высоту контейнера.",
   "id":"ev-height",
   "ipa":"/haɪt/",
   "level":1,
   "meaning":"высота",
   "ru_hint":"хайт",
   "term":"height",
   "track_ids":[],
   "wrong":"«хейт» по аналогии с weight — исключение"
  },
  {
   "category":"Данные и API",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/null",
   "example_en":"The field is null, not an empty string.",
   "example_ru":"В поле null, а не пустая строка.",
   "id":"ev-null",
   "ipa":"/nʌl/",
   "level":1,
   "meaning":"пустое значение, отсутствие значения",
   "ru_hint":"нал",
   "term":"null",
   "track_ids":[],
   "wrong":"«нулл» с русским «у»"
  },
  {
   "category":"Данные и API",
   "dict_url":"",
   "example_en":"The function returns a tuple of two values.",
   "example_ru":"Функция возвращает кортеж из двух значений.",
   "id":"ev-tuple",
   "ipa":"/ˈtjuːpl/ или /ˈtʌpl/",
   "level":2,
   "meaning":"кортеж: набор значений фиксированной длины",
   "ru_hint":"ТЬЮ-пл или ТА-пл",
   "term":"tuple",
   "track_ids":[],
   "wrong":"оба варианта допустимы, спорить с собеседником об этом не стоит"
  },
  {
   "category":"Процесс и команда",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/deprecated",
   "example_en":"That method is deprecated since version 3.",
   "example_ru":"Этот метод устарел начиная с третьей версии.",
   "id":"ev-deprecated",
   "ipa":"/ˈdeprəkeɪtɪd/",
   "level":2,
   "meaning":"устаревший: ещё работает, но использовать не надо",
   "ru_hint":"ДЕ-пре-кэй-тид",
   "term":"deprecated",
   "track_ids":[],
   "wrong":"«депрекейтед» с ударением на третий слог"
  },
  {
   "category":"Базовая лексика",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/threshold",
   "example_en":"The alert fires when we cross the threshold.",
   "example_ru":"Алерт срабатывает, когда мы переходим порог.",
   "id":"ev-threshold",
   "ipa":"/ˈθreʃhəʊld/",
   "level":2,
   "meaning":"порог: срабатывания алерта, лимита, метрики",
   "ru_hint":"СРЕШ-холд (первый звук межзубный)",
   "term":"threshold",
   "track_ids":[],
   "wrong":"«тресхолд» с обычным «т»"
  },
  {
   "category":"Процесс и команда",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/maintenance",
   "example_en":"The service is down for scheduled maintenance.",
   "example_ru":"Сервис выключен на плановое обслуживание.",
   "id":"ev-maintenance",
   "ipa":"/ˈmeɪntənəns/",
   "level":2,
   "meaning":"поддержка и обслуживание системы",
   "ru_hint":"МЭЙН-те-нанс",
   "term":"maintenance",
   "track_ids":[],
   "wrong":"«мейнтенэнс» с ударением на второй слог"
  },
  {
   "category":"Данные и API",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/asynchronous",
   "example_en":"The call is asynchronous, so we get a callback later.",
   "example_ru":"Вызов асинхронный, поэтому ответ приходит позже.",
   "id":"ev-asynchronous",
   "ipa":"/eɪˈsɪŋkrənəs/",
   "level":3,
   "meaning":"асинхронный: результат приходит не сразу",
   "ru_hint":"эй-СИН-кро-нас",
   "term":"asynchronous",
   "track_ids":[],
   "wrong":"«асинхроноус» с «х»: в середине звук «к»"
  },
  {
   "category":"Процесс и команда",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/requirement",
   "example_en":"That was a hard requirement from the client.",
   "example_ru":"Это было жёсткое требование от клиента.",
   "id":"ev-requirement",
   "ipa":"/rɪˈkwaɪəmənt/",
   "level":1,
   "meaning":"требование к продукту или к кандидату",
   "ru_hint":"ри-КВАЙ-эр-мент",
   "term":"requirement",
   "track_ids":[],
   "wrong":"«реквирмент» без «ай»"
  },
  {
   "category":"Процесс и команда",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/release",
   "example_en":"We freeze the release two days before the launch.",
   "example_ru":"Мы замораживаем релиз за два дня до запуска.",
   "id":"ev-release",
   "ipa":"/rɪˈliːs/",
   "level":1,
   "meaning":"выпуск версии",
   "ru_hint":"ри-ЛИС",
   "term":"release",
   "track_ids":[],
   "wrong":"«релиз» со звонким «з» на конце: там глухой «с»"
  },
  {
   "category":"Базовая лексика",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/failure",
   "example_en":"A single failure should not take down the whole system.",
   "example_ru":"Один сбой не должен ронять всю систему.",
   "id":"ev-failure",
   "ipa":"/ˈfeɪljə/",
   "level":1,
   "meaning":"отказ, сбой",
   "ru_hint":"ФЭЙ-лья",
   "term":"failure",
   "track_ids":[],
   "wrong":"«фейлуре» с чтением последней «e»"
  },
  {
   "category":"Данные и API",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/parameter",
   "example_en":"Pass the user id as a query parameter.",
   "example_ru":"Передайте идентификатор пользователя параметром запроса.",
   "id":"ev-parameter",
   "ipa":"/pəˈræmɪtə/",
   "level":1,
   "meaning":"параметр запроса или функции",
   "ru_hint":"па-РА-ми-та",
   "term":"parameter",
   "track_ids":[],
   "wrong":"«параметэр» с ударением на последний слог"
  },
  {
   "category":"Инфраструктура",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/certificate",
   "example_en":"The certificate expired last night.",
   "example_ru":"Сертификат истёк вчера ночью.",
   "id":"ev-certificate",
   "ipa":"/səˈtɪfɪkət/",
   "level":2,
   "meaning":"сертификат, в том числе TLS",
   "ru_hint":"са-ТИ-фи-кат",
   "term":"certificate",
   "track_ids":[],
   "wrong":"«цертификат» с «ц» в начале"
  },
  {
   "category":"Базовая лексика",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/available",
   "example_en":"I'm available for a call after 3 p.m.",
   "example_ru":"Я свободен(свободна) для созвона после трёх.",
   "id":"ev-available",
   "ipa":"/əˈveɪləbl/",
   "level":1,
   "meaning":"доступный: сервис, слот в календаре, человек",
   "ru_hint":"э-ВЭЙ-ла-бл",
   "term":"available",
   "track_ids":[],
   "wrong":"«авайлабле» с чтением конечной «e»"
  },
  {
   "category":"Базовая лексика",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/purchase",
   "example_en":"The purchase failed but the money was reserved.",
   "example_ru":"Покупка не прошла, а деньги зарезервировались.",
   "id":"ev-purchase",
   "ipa":"/ˈpɜːtʃəs/",
   "level":2,
   "meaning":"покупка",
   "ru_hint":"ПЁ-час",
   "term":"purchase",
   "track_ids":[],
   "wrong":"«пурчейс» с ударением на второй слог"
  },
  {
   "category":"Базовая лексика",
   "dict_url":"https://dictionary.cambridge.org/dictionary/english/determine",
   "example_en":"We couldn't determine the root cause from the logs alone.",
   "example_ru":"По одним логам мы не смогли определить первопричину.",
   "id":"ev-determine",
   "ipa":"/dɪˈtɜːmɪn/",
   "level":2,
   "meaning":"определить, установить причину",
   "ru_hint":"ди-ТЁ-мин",
   "term":"determine",
   "track_ids":[],
   "wrong":"«детермайн» с «ай» в конце"
  }
 ],
 "englishWriting":[
  {
   "category":"Документация",
   "en":"The client MUST send the header. The server SHOULD retry. Implementations MAY cache the response.",
   "id":"ew-doc-001",
   "kind":"pattern",
   "level":2,
   "note":"Заглавные буквы здесь не крик, а термины стандарта. Различать их важнее, чем перевести дословно.",
   "ru":"MUST — обязательно, иначе всё сломается. SHOULD — рекомендуется, отступать можно осознанно. MAY — на ваше усмотрение.",
   "title":"MUST, SHOULD, MAY",
   "track_ids":[]
  },
  {
   "category":"Документация",
   "en":"By default, the timeout is set to 30 seconds.",
   "id":"ew-doc-002",
   "kind":"pattern",
   "level":1,
   "note":"Самая частая конструкция в описании настроек. Значение по умолчанию всегда стоит проверить: в проде оно часто другое.",
   "ru":"По умолчанию таймаут равен 30 секундам.",
   "title":"By default",
   "track_ids":[]
  },
  {
   "category":"Документация",
   "en":"This endpoint is deprecated in favor of /v2/payments and will be removed in the next major release.",
   "id":"ew-doc-003",
   "kind":"pattern",
   "level":2,
   "note":"«Deprecated» значит «ещё работает, но новый код на этом писать нельзя».",
   "ru":"Метод устарел, вместо него — /v2/payments; его уберут в следующем крупном релизе.",
   "title":"Is deprecated in favor of",
   "track_ids":[]
  },
  {
   "category":"Документация",
   "en":"Note that the value is case-sensitive.",
   "id":"ew-doc-004",
   "kind":"pattern",
   "level":2,
   "note":"После «note that» почти всегда идёт то, на чём люди спотыкаются. Эти абзацы читайте внимательнее остальных.",
   "ru":"Обратите внимание: значение чувствительно к регистру.",
   "title":"Note that / Keep in mind",
   "track_ids":[]
  },
  {
   "category":"Документация",
   "en":"Unless otherwise specified, all amounts are in minor units.",
   "id":"ew-doc-005",
   "kind":"pattern",
   "level":2,
   "note":"Формулировка задаёт умолчание для всего документа сразу.",
   "ru":"Если не указано иное, все суммы — в минорных единицах (копейках, центах).",
   "title":"Unless otherwise specified",
   "track_ids":[]
  },
  {
   "category":"Документация",
   "en":"Refer to the migration guide for details.",
   "id":"ew-doc-006",
   "kind":"pattern",
   "level":1,
   "note":"«Refer to» — вежливое «читайте там», а не «смотрите справочник по теме».",
   "ru":"Подробности — в руководстве по миграции.",
   "title":"Refer to / See also",
   "track_ids":[]
  },
  {
   "category":"Документация",
   "en":"Any value above 100 will be ignored.",
   "id":"ew-doc-007",
   "kind":"pattern",
   "level":2,
   "note":"Ошибки не будет — просто настройка не сработает. Такие места ловятся только чтением документации.",
   "ru":"Значение больше 100 будет проигнорировано.",
   "title":"Will be ignored / has no effect",
   "track_ids":[]
  },
  {
   "category":"Документация",
   "en":"You can send at most 100 items per request, up to 1 MB in total.",
   "id":"ew-doc-008",
   "kind":"pattern",
   "level":2,
   "note":"«Up to» — это верхняя граница, а не обещание. «At least» — нижняя.",
   "ru":"Не более 100 элементов на запрос и суммарно до 1 МБ.",
   "title":"At most / at least / up to",
   "track_ids":[]
  },
  {
   "category":"Документация",
   "en":"The order of the results is not guaranteed and is subject to change.",
   "id":"ew-doc-009",
   "kind":"pattern",
   "level":3,
   "note":"Полагаться на такое поведение нельзя: сегодня работает, после обновления — нет.",
   "ru":"Порядок результатов не гарантирован и может измениться.",
   "title":"Subject to change / not guaranteed",
   "track_ids":[]
  },
  {
   "category":"Документация",
   "en":"id — string, read-only. amount — integer, required. comment — string, optional.",
   "id":"ew-doc-010",
   "kind":"pattern",
   "level":2,
   "note":"Read-only поле нельзя отправлять при создании: сервер вернёт ошибку валидации.",
   "ru":"id — строка, только для чтения. amount — целое, обязательное. comment — строка, необязательная.",
   "title":"Required / optional / read-only",
   "track_ids":[]
  },
  {
   "category":"Документация",
   "en":"The request body is structured as follows.",
   "id":"ew-doc-011",
   "kind":"pattern",
   "level":2,
   "note":"Сигнал, что дальше идёт пример или таблица, а не продолжение мысли.",
   "ru":"Тело запроса устроено следующим образом.",
   "title":"As follows / the following",
   "track_ids":[]
  },
  {
   "category":"Документация",
   "en":"If you exceed the rate limit, the API returns 429 and a Retry-After header.",
   "id":"ew-doc-012",
   "kind":"pattern",
   "level":3,
   "note":"Ответ 429 — это «слишком часто», а не «доступ запрещён».",
   "ru":"При превышении лимита частоты API возвращает 429 и заголовок Retry-After.",
   "title":"Rate limit exceeded",
   "track_ids":[]
  },
  {
   "category":"Письма",
   "en":"Hi [Name],\n\nThank you for the conversation today — I enjoyed hearing about the team's plans for [topic].\n\nOne addition to my answer about [question]: [one or two sentences].\n\nPlease let me know if you need anything else from my side.\n\nBest regards,\n[Your name]",
   "id":"ew-mail-001",
   "kind":"template",
   "level":1,
   "note":"Отправляйте в течение суток и не переписывайте всё интервью заново: три абзаца — потолок.",
   "ru":"Короткое письмо в тот же день. Одна мысль, которую не успели сказать, и предложение прислать недостающее.",
   "title":"Письмо после собеседования",
   "track_ids":[]
  },
  {
   "category":"Письма",
   "en":"Hi [Name],\n\nI'm following up on my application for the [role] position — we spoke on [date].\n\nI'm still very interested and happy to provide any additional information.\n\nIs there any update you can share?\n\nBest regards,\n[Your name]",
   "id":"ew-mail-002",
   "kind":"template",
   "level":2,
   "note":"Один раз — нормально. Три письма подряд читаются как давление.",
   "ru":"Напоминание через неделю после обещанного срока. Вежливо, без упрёков и без второго напоминания подряд.",
   "title":"Напоминание о статусе заявки",
   "track_ids":[]
  },
  {
   "category":"Письма",
   "en":"Hi [Name],\n\nSomething came up on my side and I won't be able to join at [time].\n\nWould [option 1] or [option 2] work for you? I'm flexible on both days.\n\nSorry for the short notice.\n\nBest regards,\n[Your name]",
   "id":"ew-mail-003",
   "kind":"template",
   "level":2,
   "note":"Предложить конкретные слоты вежливее, чем спросить «когда вам удобно?».",
   "ru":"Причина одной строкой, сразу два варианта времени и извинение за короткий срок.",
   "title":"Просьба перенести встречу",
   "track_ids":[]
  },
  {
   "category":"Письма",
   "en":"Hi [Name],\n\nThank you for the offer and for the time your team invested in the process.\n\nAfter careful thought, I've decided to accept another opportunity that is closer to [reason].\n\nI hope we can stay in touch — it was a pleasure talking to you.\n\nBest regards,\n[Your name]",
   "id":"ew-mail-004",
   "kind":"template",
   "level":2,
   "note":"Рынок узкий: те же люди встретятся через год.",
   "ru":"Отказ без подробных объяснений: благодарность, решение, пожелание остаться на связи.",
   "title":"Вежливый отказ от оффера",
   "track_ids":[]
  },
  {
   "category":"Письма",
   "en":"Hi [Name],\n\nThank you for the offer — I'm excited about the role.\n\nBefore I confirm, could you clarify two things: the salary range for this level and whether the position is fully remote?\n\nCould I have until [day] to give you my final answer?\n\nBest regards,\n[Your name]",
   "id":"ew-mail-005",
   "kind":"template",
   "level":3,
   "note":"Не задавайте десять вопросов сразу: выберите те, что реально влияют на решение.",
   "ru":"Благодарность, два конкретных вопроса и срок ответа. Просить время — нормально.",
   "title":"Уточнение условий оффера",
   "track_ids":[]
  },
  {
   "category":"Письма",
   "en":"Hi [Name],\n\nQuick question about [topic]: [one sentence].\n\nContext: [one or two sentences about what you already tried].\n\nNo rush — sometime this week would be great.\n\nThanks,\n[Your name]",
   "id":"ew-mail-006",
   "kind":"template",
   "level":1,
   "note":"«No rush» и конкретный срок снимают напряжение и всё равно двигают дело.",
   "ru":"Вопрос первой строкой, контекст второй, срок третьей. Так на письмо отвечают в тот же день.",
   "title":"Письмо с вопросом к коллеге",
   "track_ids":[]
  },
  {
   "category":"Письма",
   "en":"Hi [Name] / Dear [Name] … Best regards, / Kind regards, / Thanks,",
   "id":"ew-mail-007",
   "kind":"pattern",
   "level":1,
   "note":"«Dear Sir or Madam» в IT почти не используют, оно звучит канцелярски.",
   "ru":"«Hi» — обычное рабочее письмо. «Dear» — формальное, к незнакомому адресату. Прощание: Best regards или Kind regards.",
   "title":"Начало и конец письма",
   "track_ids":[]
  },
  {
   "category":"Письма",
   "en":"Could you please …? / Would you mind …? / When you have a moment, could you …?",
   "id":"ew-mail-008",
   "kind":"pattern",
   "level":2,
   "note":"«Send me the file» без смягчения читается как приказ, даже если вы этого не имели в виду.",
   "ru":"Три степени вежливости для одной и той же просьбы.",
   "title":"Смягчение просьбы",
   "track_ids":[]
  },
  {
   "category":"Тикеты и баг-репорты",
   "en":"Summary: [what is broken, one line]\nEnvironment: [browser / version / environment]\nSteps to reproduce:\n1. …\n2. …\n3. …\nExpected result: …\nActual result: …\nImpact: [who is affected and how often]\nAttachments: [logs, screenshots, request id]",
   "id":"ew-ticket-001",
   "kind":"template",
   "level":1,
   "note":"«Impact» — часть, которую чаще всего забывают, а именно по ней задачу берут в работу.",
   "ru":"Стандартная структура. Английские заголовки узнают в любой команде, даже если текст пишется на другом языке.",
   "title":"Баг-репорт",
   "track_ids":[]
  },
  {
   "category":"Тикеты и баг-репорты",
   "en":"Reproducible on staging, 3 out of 5 attempts. I cannot reproduce it locally.",
   "id":"ew-ticket-002",
   "kind":"pattern",
   "level":2,
   "note":"Частота воспроизведения — важная деталь: «иногда» и «3 из 5» ведут к разным решениям.",
   "ru":"Воспроизводится на тестовой среде в трёх попытках из пяти. Локально воспроизвести не удаётся.",
   "title":"Reproducible / cannot reproduce",
   "track_ids":[]
  },
  {
   "category":"Тикеты и баг-репорты",
   "en":"This is blocked by #412 — we need the new endpoint before we can test it.",
   "id":"ew-ticket-003",
   "kind":"pattern",
   "level":2,
   "note":"Пишите, чем именно заблокировано, а не просто «blocked»: иначе задачу вернут с вопросом.",
   "ru":"Задача заблокирована задачей #412: без нового метода протестировать нельзя.",
   "title":"Blocked by / depends on",
   "track_ids":[]
  },
  {
   "category":"Тикеты и баг-репорты",
   "en":"Closing as works as intended: the limit is documented here [link].",
   "id":"ew-ticket-004",
   "kind":"pattern",
   "level":2,
   "note":"Такой ответ без ссылки выглядит как отписка. Ссылка превращает его в аргумент.",
   "ru":"Закрываю как «работает по задумке»: ограничение описано в документации [ссылка].",
   "title":"Works as intended / by design",
   "track_ids":[]
  },
  {
   "category":"Тикеты и баг-репорты",
   "en":"Could you share the request id and the exact time (with time zone) when it happened? With that I can find it in the logs within a few minutes.",
   "id":"ew-ticket-005",
   "kind":"template",
   "level":2,
   "note":"Называйте, что именно вам нужно и зачем — так отвечают быстрее.",
   "ru":"Просьба прислать идентификатор запроса и точное время с часовым поясом.",
   "title":"Просьба дать данные для разбора",
   "track_ids":[]
  },
  {
   "category":"Тикеты и баг-репорты",
   "en":"Severity: high (money is lost). Priority: medium (affects 0.2% of payments).",
   "id":"ew-ticket-006",
   "kind":"pattern",
   "level":3,
   "note":"Смешение этих двух понятий — классический вопрос на собеседовании QA.",
   "ru":"Severity — насколько страшны последствия. Priority — насколько срочно чинить. Это разные шкалы.",
   "title":"Severity и приоритет",
   "track_ids":[]
  },
  {
   "category":"Код-ревью и чат",
   "en":"Could you take a look when you have time? No rush.",
   "id":"ew-review-001",
   "kind":"pattern",
   "level":1,
   "note":"Если срочно — так и напишите и укажите срок: «I'd need it before the release at 5 p.m.».",
   "ru":"Посмотрите, когда будет время? Не срочно.",
   "title":"Просьба посмотреть работу",
   "track_ids":[]
  },
  {
   "category":"Код-ревью и чат",
   "en":"nit: typo in the comment. Non-blocking, feel free to merge.",
   "id":"ew-review-002",
   "kind":"pattern",
   "level":2,
   "note":"Помечать мелочи как non-blocking экономит часы: иначе правку ждут как обязательную.",
   "ru":"«nit» — мелкое замечание, не мешающее принять изменение.",
   "title":"nit: и non-blocking",
   "track_ids":[]
  },
  {
   "category":"Код-ревью и чат",
   "en":"I see it differently — could you explain why this option is better? I might be missing some context.",
   "id":"ew-review-003",
   "kind":"pattern",
   "level":2,
   "note":"Вопрос вместо утверждения снимает половину споров в переписке.",
   "ru":"Я вижу иначе — объясните, почему этот вариант лучше? Возможно, я не знаю контекста.",
   "title":"Мягкое несогласие",
   "track_ids":[]
  },
  {
   "category":"Код-ревью и чат",
   "en":"LGTM (looks good to me). One small comment above, but I'm fine either way.",
   "id":"ew-review-004",
   "kind":"pattern",
   "level":1,
   "note":"LGTM без оговорок означает полное одобрение — не ставьте его, если сомневаетесь.",
   "ru":"«Мне нравится, можно вливать». Одно замечание выше, но решать вам.",
   "title":"LGTM и одобрение",
   "track_ids":[]
  },
  {
   "category":"Код-ревью и чат",
   "en":"I'll pick this up. / I'm on it. / I'll take care of it today.",
   "id":"ew-review-005",
   "kind":"pattern",
   "level":1,
   "note":"«I'm on it» — короткое подтверждение в чате, уместное почти везде.",
   "ru":"Три способа сказать «беру на себя».",
   "title":"Взять задачу на себя",
   "track_ids":[]
  },
  {
   "category":"Код-ревью и чат",
   "en":"Correction: I said 200 ms earlier, it's actually 2 seconds. Sorry for the confusion.",
   "id":"ew-review-006",
   "kind":"pattern",
   "level":2,
   "note":"Отдельное сообщение с исправлением надёжнее, чем правка старого: старое уже прочитали.",
   "ru":"Исправление: раньше я сказал(а) 200 мс, на самом деле 2 секунды.",
   "title":"Исправить своё сообщение",
   "track_ids":[]
  },
  {
   "category":"Созвоны и статусы",
   "en":"Yesterday I finished [task]. Today I'm working on [task]. I'm blocked on [blocker] — I need [what exactly] from [who].",
   "id":"ew-meet-001",
   "kind":"template",
   "level":1,
   "note":"«I'm blocked» без имени и предмета не решает проблему: назовите человека и конкретное действие.",
   "ru":"Три части: вчера, сегодня, что мешает. Про блокер говорите конкретно, кто и что должен сделать.",
   "title":"Ежедневный статус",
   "track_ids":[]
  },
  {
   "category":"Созвоны и статусы",
   "en":"Let's take this offline — I'll set up a short call with [name] after the standup.",
   "id":"ew-meet-002",
   "kind":"pattern",
   "level":2,
   "note":"Фраза уместна, когда двое углубились в детали, а остальные ждут.",
   "ru":"Обсудим отдельно: договорюсь о коротком созвоне после статуса.",
   "title":"Отложить обсуждение",
   "track_ids":[]
  },
  {
   "category":"Созвоны и статусы",
   "en":"Can we park this and come back to it at the end?",
   "id":"ew-meet-003",
   "kind":"pattern",
   "level":2,
   "note":"«Park» — стандартный способ не потерять тему и не сорвать повестку.",
   "ru":"Можем отложить и вернуться к этому в конце?",
   "title":"Вернуться к вопросу",
   "track_ids":[]
  },
  {
   "category":"Созвоны и статусы",
   "en":"You're breaking up. / I think you're on mute. / Could you repeat the last part?",
   "id":"ew-meet-004",
   "kind":"pattern",
   "level":1,
   "note":"Эти три фразы звучат на каждом созвоне — узнавать их важнее, чем произносить.",
   "ru":"Три дежурные фразы удалённого созвона: связь рвётся, у вас выключен микрофон, повторите последнюю часть.",
   "title":"Проблемы со связью",
   "track_ids":[]
  },
  {
   "category":"Созвоны и статусы",
   "en":"Thanks everyone. Summary:\n- Decision: [what we agreed]\n- Open question: [what is not decided]\n- Next step: [who does what by when]",
   "id":"ew-meet-005",
   "kind":"template",
   "level":2,
   "note":"Письмо с итогами делает вас человеком, который двигает дело, — это заметно быстро.",
   "ru":"Три пункта после встречи: решение, открытый вопрос, следующий шаг с именем и сроком.",
   "title":"Итоги встречи письмом",
   "track_ids":[]
  }
 ],
 "glossary":[],
 "lessons":[],
 "mockQuestions":[],
 "questions":[],
 "questionsByTopic":{},
 "roadmap":[],
 "stories":[],
 "termsByTopic":{},
 "topics":[],
 "vacancies":[]
};
  var C = global.CONTENT || (global.CONTENT = {});
  Object.keys(DATA).forEach(function (k) { C[k] = DATA[k]; });
  C.trackLoaded = "technical-engineer";
  if (typeof module !== "undefined" && module.exports) module.exports = DATA;
})(typeof window !== "undefined" ? window : globalThis);
