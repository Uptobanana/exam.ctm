#!/usr/bin/env python3
"""fill-fuke-unit4-5.py — 填充 s7 第四、五单元"""
TARGET = '/sessions/compassionate-hopeful-thompson/mnt/syllabus/subjects/s7-fuke.js'

with open(TARGET, 'r', encoding='utf-8') as f:
    c = f.read()

idx4 = c.find('{unit:"第四单元')
idx5 = c.find('{unit:"第五单元')
idx6 = c.find('{unit:"第六单元')

UNIT4 = r'''{unit:"第四单元 带下病",subunits:[
  {name:"带下病",points:[
    {id:"fk-3-1",name:"带下过多的病因病机及辨证论治",type:"apply",
content:'<p><strong>带下过多</strong>是带下量明显增多+色质气味异常+伴全身不适症状。病因以"湿"为主+涉及脾肾肝三脏。</p><div class=compare-table><div class=ct-left><h4>辨证分型</h4><p><strong>脾虚：</strong>带下量多色白质稀+无臭+面色萎黄+神疲+纳少+便溏<br>→ <strong>完带汤</strong>健脾益气+升阳除湿</p><p><strong>肾阳虚：</strong>带下量多色白质清稀如水+腰膝酸冷+小腹冷感+畏寒+夜尿多<br>→ <strong>内补丸</strong>温肾培元+固涩止带</p><p><strong>阴虚夹湿：</strong>带下量多色黄质稠+阴部灼热+五心烦热+腰膝酸软<br>→ <strong>知柏地黄丸</strong></p><p><strong>湿热下注：</strong>带下量多色黄质稠+有臭味+阴痒+口苦+苔黄腻<br>→ <strong>止带方</strong></p><p><strong>热毒蕴结：</strong>带下量多色黄绿脓性+臭秽+阴部灼痛+发热<br>→ <strong>五味消毒饮</strong>合<strong>大黄牡丹汤</strong></p></div><div class=ct-right><h4>带下辨证要点</h4><p><strong>色：</strong><br>白→虚证+寒证<br>黄→热证+湿证<br>赤白相兼→湿热+肝郁<br>五色带（杂色）→危证（恶病可能）</p><p><strong>质：</strong>清稀→虚+稠厚→实<br><strong>臭：</strong>无臭→虚+腥臭→湿+秽臭→热毒</p><p>注意：带下病需排除宫颈/宫腔恶性病变</p></div></div><div class=classic-quote>《傅青主女科》："夫带下俱是湿症。"<span class=src>——《傅青主女科》</span></div><div class=plain>带下病就是"白带异常"——量太多+颜色不对+气味不对。傅青主说"带下俱是湿症"——湿是带下的根本原因。特点是"带脉不能约束+湿气下注"。完带汤是治脾虚带下的名方（白术山药人参白芍苍术甘草陈皮黑芥穗柴胡车前子）——"完带"就是"完善带脉功能"的意思。注意带下色黄绿脓性+秽臭→急性感染需中西医结合。</p><div class=mnem><strong>口诀：</strong>带下俱湿完带汤，脾虚白带量多清；肾阳内补阴虚知柏，湿热止带热毒五味大黄。</div><div class=trap-box><strong>高频考点：</strong>1.带下病总病因——"湿"（傅青主"夫带下俱是湿症"）。2.脾虚→完带汤（白术山药参芍苍草陈芥穗柴车）。3.肾阳虚→内补丸（鹿茸菟丝沙苑黄芪肉桂桑螵蛸肉苁蓉附子蒺藜）。4.阴虚夹湿→知柏地黄丸。5.湿热→止带方（猪苓茯苓车前泽泻茵陈赤芍丹皮黄柏栀子牛膝）。6.热毒→五味消毒饮合大黄牡丹汤。7.五色带→警惕恶性病变。</div></div>'},
    {id:"fk-3-1a",name:"完带汤的药物组成",type:"detail",
content:'<p><strong>完带汤（傅青主女科方）：</strong>白术+山药+人参+白芍+苍术+甘草+陈皮+黑芥穗+柴胡+车前子。</p><p>功用：健脾益气+升阳除湿。主治：脾虚肝郁+湿浊下注之带下过多（色白质稀无臭）。</p><div class=compare-table><div class=ct-left><h4>组方思路</h4><p>健脾补气：白术+山药+人参——重用（君）<br>燥湿运脾：苍术+陈皮——理气化湿<br>疏肝：柴胡+白芍——肝脾同调<br>升阳止带：黑荆芥穗——升阳入血分<br>利湿：车前子——引湿浊从下走</p></div><div class=ct-right><h4>记忆要点</h4><p>完带汤=补脾+燥湿+疏肝+利湿+升阳</p><p>十个药：白术山药参+白芍苍术草+陈皮芥穗柴车前</p><p>注意：不用茯苓（不同于参苓白术散）——完带以白术山药为主补脾</p></div></div><div class=classic-quote>《傅青主女科》："完带汤不独治带也+亦能治血枯经闭也+此方大补脾胃之气+兼舒肝木+正所以使湿气不壅也。"<span class=src>——《傅青主女科》</span></div></div>'}
  ]}
]},

'''

UNIT5 = r'''{unit:"第五单元 妊娠病",subunits:[
  {name:"细目一：概述",points:[{id:"fk-4-0",name:"妊娠病的定义、范围、病因病机及治疗原则",type:"concept",
content:'<p><strong>妊娠病</strong>是妊娠期间发生的与妊娠相关的疾病。范围包括：妊娠恶阻+妊娠腹痛+胎漏胎动不安+堕胎小产暗产+异位妊娠+子肿+子痫+妊娠小便淋痛+妊娠小便不通等。</p><div class=compare-table><div class=ct-left><h4>治疗原则</h4><p><strong>总则：</strong>治病与安胎并举</p><p>母病致胎病→先治母病+病去胎自安<br>胎病致母病→先安胎+胎安母自安</p><p><strong>安胎大法：</strong><br>补肾培脾+重在补肾<br>补肾→固胎之本<br>培脾→益气血之源</p></div><div class=ct-right><h4>妊娠用药禁忌</h4><p><strong>禁用（峻下逐水+破血通经+毒性药）：</strong><br>巴豆+牵牛+大戟+芫花+甘遂+麝香+斑蝥+水蛭+虻虫+三棱+莪术</p><p><strong>慎用（活血+攻下+温燥药）：</strong><br>桃仁+红花+大黄+枳实+附子+肉桂+半夏+牛膝+川芎+丹皮+赤芍</p><p>原则：<strong>"有故无殒+亦无殒"</strong>——确需用时+辨证准确+谨慎使用+中病即止</p></div></div><div class=classic-quote>《素问·六元正纪大论》："妇人重身+毒之何如？岐伯曰：有故无殒+亦无殒也。"<span class=src>——《黄帝内经》</span></div><div class=plain>妊娠病就是怀孕期间的病。治疗总原则——"治病与安胎并举"+"有故无殒亦无殒"。前者是目标和手段+后者是安全底线。"有故无殒"就是说如果有病当用则用+不会伤到胎儿——但前提是辨证准确+中病即止+切忌过用。妊娠禁忌药要记熟：剧毒药和破血药绝对禁用+活血攻下药谨慎使用。</p><div class=mnem><strong>口诀：</strong>妊娠病治则安胎先，补肾培脾两法兼；有故无殒内经语，禁忌药记决不偏。</div><div class=trap-box><strong>高频考点：</strong>1.治疗总则——"治病与安胎并举"。2.安胎大法——补肾培脾+重在补肾。3."有故无殒+亦无殒"——《素问》原文（必考！）。4.禁忌药：禁用（巴豆大戟斑蝥水蛭等）+慎用（桃红大黄附桂夏膝等）。5.胎动不安需先区分是"可安"还是"不可安"——胎堕难留或胎死腹中→下胎以保母。6.妊娠病不主张用猛药峻药。</div></div>'},
    {id:"fk-4-0a",name:"妊娠用药的禁忌",type:"apply",
content:'<p>同上方中禁忌部分。重点记忆：禁用（峻下+破血+毒剧）和慎用（活血+攻下+温燥+香窜）。临床原则："有故无殒+量小+中病即止+不可过服"。</p><div class=trap-box><strong>常考禁忌药速记：</strong>1.绝对禁忌——斑蝥水蛭虻虫麝香+三棱莪术巴豆大戟芫花甘遂。2.慎用——桃红牛膝大黄枳实+附子肉桂半夏川芎丹皮赤芍。3.半夏虽为妊娠恶阻常用药+但属"慎用"（传统认为有滑胎之嫌）。4.艾叶安胎但不宜大量。5.妊娠呕吐可用竹茹苏梗砂仁等理气止呕药安全。</div></div>'}
  ]},
  {name:"细目二：妊娠恶阻",points:[{id:"fk-4-1",name:"妊娠恶阻的定义及辨证论治",type:"apply",
content:'<p><strong>妊娠恶阻</strong>是妊娠早期（6-12周）出现严重恶心呕吐+食入即吐+不能进食。轻者属早孕反应+重者（恶阻）需治疗。</p><div class=compare-table><div class=ct-left><h4>辨证分型</h4><p><strong>脾胃虚弱：</strong>恶心呕吐+食入即吐+吐出清涎+头晕+神疲+脘闷<br>→ <strong>香砂六君子汤</strong></p><p><strong>肝胃不和：</strong>恶心呕吐+吐出酸水苦水+胸胁胀满+口苦咽干+嗳气<br>→ <strong>橘皮竹茹汤</strong>或<strong>苏叶黄连汤</strong></p><p><strong>气阴两虚（重症）：</strong>呕吐剧烈+持续日久+精神萎靡+眼眶凹陷+尿少+口干<br>→ <strong>生脉散</strong>合<strong>增液汤</strong></p></div><div class=ct-right><h4>调护要点</h4><p><strong>饮食：</strong>少食多餐+清淡易消化+避免油腻<br><strong>情志：</strong>舒畅心情+注意休息</p><p><strong>重症需住院补液！</strong><br>呕吐剧烈→水电解质紊乱→可致Wernicke脑病</p><p>恶阻预后一般良好+多可自行消失<br>但需防气阴两虚重症</p></div></div><div class=classic-quote>《妇人大全良方》："妊娠恶阻+恶闻食气+食入即吐+体倦肢懒+宜调气和中+降逆止呕。"<span class=src>——《妇人大全良方》</span></div><div class=plain>恶阻就是怀孕早期"害喜"太严重了——吐到不能吃饭。轻的叫"早孕反应"+重的叫"恶阻"。脾胃虚弱的吐清口水（香砂六君子健胃止呕）+肝胃不和的吐酸水苦水（橘皮竹茹汤/苏叶黄连清肝和胃）。注意恶阻重症（气阴两虚）需要住院补液+不能再光靠中药慢慢调理。</p><div class=mnem><strong>口诀：</strong>恶阻孕早期呕吐，脾胃香砂六君和；肝胃不和橘竹茹，气阴两虚生脉增液。</div><div class=trap-box><strong>考点：</strong>1.脾胃虚弱→香砂六君子汤（参术苓草夏陈+木香砂仁）。2.肝胃不和→橘皮竹茹汤（橘皮竹茹参草夏麦枇枣）或苏叶黄连汤（苏叶黄连）。3.气阴两虚（重症）→生脉散合增液汤（生脉：参麦味+增液：玄生地）。4.注意：恶阻严重可致气阴两虚+电解质紊乱→需住院。5.半夏虽属妊娠慎用药+但恶阻脾胃虚弱型常用+姜制后安全。</div></div>'}
  ]},
  {name:"细目三：妊娠腹痛",points:[{id:"fk-4-2",name:"妊娠腹痛的定义及病因病机",type:"detail",
content:'<p><strong>妊娠腹痛</strong>是妊娠期间出现小腹疼痛（非宫缩性）。又称"胞阻"。</p><div class=compare-table><div class=ct-left><h4>辨证分型</h4><p><strong>血虚：</strong>孕后小腹绵绵作痛+按之痛减+面色萎黄+头晕心悸<br>→ <strong>当归芍药散</strong></p><p><strong>气滞：</strong>孕后小腹胀痛+胸胁胀满+嗳气+心烦易怒<br>→ <strong>逍遥散</strong></p><p><strong>虚寒：</strong>孕后小腹冷痛+畏寒+得热减轻+面色晄白<br>→ <strong>胶艾汤</strong></p><p><strong>血瘀：</strong>孕后小腹刺痛+固定不移+舌紫暗<br>→ <strong>桂枝茯苓丸</strong></p></div><div class=ct-right><h4>病机要点</h4><p><strong>总病机：</strong>胞脉受阻+气血运行不畅+不通则痛或不荣则痛</p><p>注意与以下腹痛鉴别：<br>·宫外孕（异位妊娠）→剧痛+出血+急腹症<br>·先兆流产→阵发性+伴阴道出血<br>·急性阑尾炎→转移性右下腹痛</p></div></div><div class=classic-quote>《金匮要略》："妇人怀妊+腹中疞痛+当归芍药散主之。"<span class=src>——《金匮要略》</span></div><div class=plain>妊娠腹痛就是"孕妇肚子痛"。"胞阻"——胞脉阻滞不通的意思。四型辨治：血虚绵绵痛（当归芍药散）+气滞胀痛（逍遥散）+虚寒冷痛（胶艾汤）+血瘀刺痛（桂枝茯苓丸）。当归芍药散出自《金匮要略》——治妊娠腹痛第一方（当归芍药川芎+茯苓白术泽泻）。注意：桂枝茯苓丸是瘀血证用方+但属妊娠慎用方+需谨慎。</p><div class=mnem><strong>口诀：</strong>妊娠腹痛胞阻名，血虚归芍气逍遥；虚寒胶艾瘀桂苓，四型分清胎自安。</div><div class=trap-box><strong>考点：</strong>1.血虚→当归芍药散（归芍芎+苓术泻）——养血清肝+健脾利湿。2.气滞→逍遥散（归芍柴苓术草姜薄）。3.虚寒→胶艾汤（阿胶艾叶+四物+甘草）。4.血瘀→桂枝茯苓丸（桂苓丹桃芍）+慎用。5.最需鉴别——宫外孕（异位妊娠破裂）——停经+腹痛+阴道出血+休克——急症需手术！</div></div>'}
  ]},
  {name:"细目四：胎漏、胎动不安",points:[
    {id:"fk-4-3",name:"胎漏、胎动不安、堕胎、小产、暗产的定义",type:"concept",
content:'<p><strong>胎漏</strong>是妊娠期阴道少量出血+时下时止+无腰酸腹痛。<strong>胎动不安</strong>是妊娠期腰酸腹痛+胎动下坠+伴少量阴道出血。<strong>堕胎</strong>是妊娠12周内+胎儿自然殒堕。<strong>小产</strong>是妊娠12-28周+胎儿自然殒堕。<strong>暗产</strong>是妊娠1月不知已孕而堕胎者。</p><div class=compare-table><div class=ct-left><h4>鉴别要点</h4><p><strong>胎漏：</strong>仅出血+无腰酸腹痛</p><p><strong>胎动不安：</strong>腰酸腹痛+胎动下坠+可伴出血</p><p><strong>堕胎：</strong>孕12周内+胎儿堕出</p><p><strong>小产：</strong>孕12-28周+胎儿堕出</p><p><strong>暗产：</strong>孕1月+已孕不自知+似月经</p></div><div class=ct-right><h4>治疗原则</h4><p><strong>胎漏/胎动不安：</strong><br>安胎为主——补肾固冲+止血</p><p><strong>堕胎/小产：</strong><br>胎堕难留→下胎益母<br>胎死腹中→逐瘀下胎</p><p><strong>暗产：</strong><br>一般不需特殊处理</p></div></div><div class=classic-quote>《医宗金鉴》："孕五六月堕者名小产+孕三月以内堕者名堕胎+若一月堕者+人不知其孕+但如行经耳+名曰暗产。"<span class=src>——《医宗金鉴》</span></div><div class=plain>胎漏（仅出血）和胎动不安（腹痛+出血+下坠感）是"保胎"的两个阶段——前者轻+后者重。堕胎（3个月内）和小产（3-7个月）是已经掉了。暗产（1个月内）很多人根本不知道怀孕+只当月经推迟。治疗关键：胎漏和胎动不安以安胎为主+如果已经堕不可安（胎堕难留或胎死腹中）→下胎保母。</p><div class=mnem><strong>口诀：</strong>胎漏出血无腹痛+胎动不安腰腹痛；堕胎小产分三月，一月暗产不知孕。</div><div class=trap-box><strong>高频考点：</strong>1.胎漏vs胎动不安——痛与不痛是鉴别关键。2.堕胎=12周内+小产=12-28周。3.暗产=1个月内（似月经）。4.治疗：可安然胎（寿胎丸/胎元饮）+不可安下胎。5.所有阴道出血的孕妇+首先排除宫外孕！</div></div>'},
    {id:"fk-4-3a",name:"胎漏、胎动不安的辨证论治及寿胎丸、胎元饮的药物组成",type:"apply",
content:'<p><strong>辨证分型：</strong></p><div class=compare-table><div class=ct-left><h4>四型辨治</h4><p><strong>肾虚：</strong>孕后腰酸腹痛+阴道出血+头晕耳鸣+小便频数<br>→ <strong>寿胎丸</strong>补肾固冲安胎</p><p><strong>气血虚弱：</strong>孕后阴道出血+腰酸+小腹下坠+面色苍白+神疲乏力<br>→ <strong>胎元饮</strong>补气养血+固肾安胎</p><p><strong>血热：</strong>孕后阴道出血色鲜红质稠+口干+心烦+尿黄<br>→ <strong>保阴煎</strong>清热凉血+固冲安胎</p><p><strong>血瘀：</strong>孕后阴道出血色紫暗有块+小腹刺痛+舌紫暗<br>→ <strong>桂枝茯苓丸</strong>合寿胎丸化瘀安胎</p></div><div class=ct-right><h4>主方组成</h4><p><strong>寿胎丸（张锡纯）：</strong><br>菟丝子+桑寄生+续断+阿胶</p><p>菟丝子为君（补肾固精）+寄生续断为臣（强筋骨固胎）+阿胶为使（养血止血）</p><p><strong>胎元饮（景岳全书）：</strong><br>人参+当归+杜仲+芍药+熟地+白术+陈皮+炙甘草</p></div></div><div class=classic-quote>《医学衷中参西录》："寿胎丸+治滑胎方也+菟丝子为君+补肾固精之要药。"<span class=src>——《医学衷中参西录》</span></div><div class=plain>胎漏胎动不安的"四大安胎方"：寿胎丸（补肾——最常用）+胎元饮（补气血）+保阴煎（清热）+桂枝茯苓丸合寿胎丸（化瘀）。寿胎丸仅四味药（菟丝子寄生续断阿胶）——是保胎第一方+简洁而有效。胎元饮是景岳方+用于气血虚弱型（参归芍地术陈草杜）。</p><div class=mnem><strong>口诀：</strong>寿胎菟寄续阿胶+肾虚安胎第一方；胎元饮参归芍地术陈草杜保胎良；血热保阴煎+血瘀桂苓寿胎。</div><div class=trap-box><strong>高频考点：</strong>1.寿胎丸（菟丝子+桑寄生+续断+阿胶）——补肾安胎第一方。2.胎元饮（参归芍地术陈草杜）——补气养血安胎。3.血热→保阴煎。4.血瘀→桂枝茯苓丸合寿胎丸。5.滑胎（习惯性流产）→孕前调理+孕后即开始寿胎丸预防。6.寿胎丸中菟丝子为君——补肾固精安胎。</div></div>'}
  ]},
  {name:"细目五：子肿",points:[{id:"fk-4-4",name:"子肿的定义及辨证论治",type:"apply",
content:'<p><strong>子肿</strong>是妊娠中晚期出现肢体面目浮肿+称为妊娠肿胀。轻者仅脚踝肿+重者全身皆肿。根据肿胀程度分为：子宫（仅脚踝肿）+子肿（大腿以上肿）+子满（全身肿+腹大异常+喘满）。</p><div class=compare-table><div class=ct-left><h4>辨证分型</h4><p><strong>脾虚：</strong>妊娠中晚期+面目浮肿+按之凹陷+食少+便溏+神疲<br>→ <strong>白术散</strong>健脾利水</p><p><strong>肾虚：</strong>孕后面浮肢肿+下肢尤甚+按之凹陷+腰膝酸冷+畏寒<br>→ <strong>真武汤</strong></p><p><strong>气滞：</strong>孕后肢体肿胀+皮色不变+按之随手而起+胸胁胀满<br>→ <strong>天仙藤散</strong></p></div><div class=ct-right><h4>子肿与子满</h4><p><strong>子肿：</strong><br>水肿+但无腹大异常+血压可正常<br>→ 健脾利水为主</p><p><strong>子满（羊水过多）：</strong><br>腹大异常+胸膈满闷+喘不得卧<br>→ <strong>鲤鱼汤</strong></p><p>注意：子肿+血压高+蛋白尿→子痫前期（妊高症）！需中西医结合治疗。</p></div></div><div class=classic-quote>《医宗金鉴》："头面遍身浮肿+小水短少者+属水气为病+名曰子肿。"<span class=src>——《医宗金鉴》</span></div><div class=plain>子肿就是孕妇水肿——"子"指妊娠+怀孕。三型：脾虚（食少便溏水肿——白术散健脾）、肾虚（腰膝冷肿——真武汤温阳）、气滞（皮色不变按之起——天仙藤散理气）。注意：子肿如果伴高血压+蛋白尿→可能是子痫前期（妊高症）——这是产科急症！需测血压+查尿常规。</p><div class=mnem><strong>口诀：</strong>子肿水肿孕中晚，脾虚白术肾虚真武；气滞天仙藤散理，子满鲤鱼汤利水宽。</div><div class=trap-box><strong>考点：</strong>1.脾虚→白术散（白术茯苓大腹皮橘皮生姜）。2.肾虚→真武汤（附子白术白芍茯苓生姜）。3.气滞→天仙藤散（天仙藤+香附陈皮甘草乌药生姜木瓜苏叶）。4.子满→鲤鱼汤（鲤鱼+白术茯苓当归芍药橘皮生姜）。5.注意：子肿合并高血压蛋白尿→子痫前期（重度子痫前期需终止妊娠）。6.真武汤中附子属妊娠慎用药+但阳虚水泛时可用。</div></div>'}
  ]},
  {name:"细目六：妊娠小便淋痛",points:[{id:"fk-4-5",name:"妊娠小便淋痛的定义及辨证论治",type:"apply",
content:'<p><strong>妊娠小便淋痛</strong>是妊娠期间出现尿频尿急尿痛+淋漓涩痛。又称"子淋"。</p><div class=compare-table><div class=ct-left><h4>辨证分型</h4><p><strong>阴虚津亏：</strong>孕后小便频数涩痛+色深黄+量少+五心烦热+口干<br>→ <strong>知柏地黄丸</strong></p><p><strong>心火偏旺：</strong>孕后小便涩痛+尿少色黄+面赤+心烦+口舌生疮<br>→ <strong>导赤散</strong></p><p><strong>湿热下注：</strong>孕后小便频数涩痛+尿黄赤+带下黄稠+苔黄腻<br>→ <strong>加味五苓散</strong></p></div><div class=ct-right><h4>病机要点</h4><p>妊娠期血聚养胎→阴血相对不足→阴虚火旺</p><p>或孕后不注意卫生→湿热下注</p><p>或心火上炎→移热于小肠→下注膀胱</p><p>注意：尿常规检查排除急性尿路感染+必要时抗生素</p></div></div><div class=classic-quote>《医宗金鉴》："孕妇小便频数涩痛+名曰子淋。"<span class=src>——《医宗金鉴》</span></div><div class=plain>子淋就是孕妇"尿路感染"——尿频尿急尿痛。三型辨治：阴虚（五心烦热+尿少色深）→知柏地黄丸养阴清热+心火（心烦口疮）→导赤散清心利尿+湿热（尿黄带多苔腻）→加味五苓散清热利湿。注意孕期用药要谨慎+尽量避免使用对胎儿有影响的抗生素。</p><div class=mnem><strong>口诀：</strong>子淋阴虚知柏丸+心火导赤湿热五苓散。</div><div class=trap-box><strong>考点：</strong>1.阴虚津亏→知柏地黄丸（知柏+六味）。2.心火偏旺→导赤散（生地木通甘草竹叶）——注意木通需用川木通（关木通有肾毒性）。3.湿热下注→加味五苓散（五苓散+栀子黄芩车前子木通甘草）。4.注意与妊娠小便不通（转胞）鉴别——前者痛+后者不通不痛。5.急性尿路感染需配合抗生素。</div></div>'}
  ]},
  {name:"细目七：妊娠小便不通",points:[{id:"fk-4-6",name:"妊娠小便不通的定义",type:"concept",
content:'<p><strong>妊娠小便不通</strong>是妊娠期间出现小便不通+小腹胀急疼痛。又称"转胞"或"胞转"。</p><div class=compare-table><div class=ct-left><h4>辨证分型</h4><p><strong>气虚：</strong>孕后小便不通+小腹坠胀+气短+神疲+面色晄白<br>→ <strong>益气导溺汤</strong></p><p><strong>肾虚：</strong>孕后小便不通+小腹胀痛+腰膝酸软+畏寒+坐卧不宁<br>→ <strong>肾气丸</strong></p></div><div class=ct-right><h4>病机要点</h4><p>转胞——胎儿压迫膀胱→小便不通</p><p>气虚：中气下陷+胎重下坠+压迫膀胱<br>肾虚：肾气不足+膀胱气化不利</p><p>注意：与子淋鉴别——小便不利vs小便涩痛</p><p>重症（尿潴留）需导尿+必要时考虑提前终止妊娠</p></div></div><div class=classic-quote>《金匮要略》："妇人病+饮食如故+烦热不得卧+而反倚息者+此名转胞+不得溺也。"<span class=src>——《金匮要略》</span></div><div class=plain>转胞就是"孕妇尿不出来"——胎儿大了压住了膀胱。轻的用中药（益气导溺汤/肾气丸）+重的需要导尿。和"子淋"（孕妇尿路感染）的区别：转胞是尿不出来+子淋是尿了痛。记住：转胞为"不通"（尿闭）+子淋为"不利"（尿痛）。</p><div class=mnem><strong>口诀：</strong>转胞不通子淋痛，气虚举胎导溺汤+肾虚肾气丸温阳。</div><div class=trap-box><strong>考点：</strong>1.转胞=妊娠小便不通+因胎儿压迫膀胱所致。2.气虚→益气导溺汤（参术苓草扁豆桔梗乌药升麻通草桂枝）。3.肾虚→肾气丸（六味+桂附+牛膝车前子）。4.转胞vs子淋关键鉴别：不通vs涩痛。5.尿潴留→导尿+必要时终止妊娠。</div></div>'}
  ]}
]},

'''

# Do unit 4 first
after = c[:idx4] + UNIT4 + c[idx5:]

# Then unit 5 on the updated content
idx5_new = after.find('{unit:"第五单元')
idx6_new = after.find('{unit:"第六单元')
after = after[:idx5_new] + UNIT5 + after[idx6_new:]

with open(TARGET, 'w', encoding='utf-8') as f:
    f.write(after)

print(f"Done. Size: {len(after)} bytes (was {len(c)} bytes)")
