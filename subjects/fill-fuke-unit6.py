#!/usr/bin/env python3
"""fill-fuke-unit6.py — 填充 s7 第六单元 产后病"""
TARGET = '/sessions/compassionate-hopeful-thompson/mnt/syllabus/subjects/s7-fuke.js'

with open(TARGET, 'r', encoding='utf-8') as f:
    c = f.read()

idx6 = c.find('{unit:"第六单元')
idx7 = c.find('{unit:"第七单元')

UNIT6 = r'''{unit:"第六单元 产后病",subunits:[
  {name:"细目一：概述",points:[
    {id:"fk-5-0",name:'产后病的定义及产后"三冲""三病""三急"',type:"concept",
content:'<p><strong>产后病</strong>是产后至产褥期（产后6-8周）内发生的与分娩相关的疾病。经典三大症候群：三冲+三病+三急。</p><div class=compare-table><div class=ct-left><h4>产后"三冲"</h4><p><strong>冲心：</strong>恶露上攻+神昏谵语+烦躁不安→败血冲心（最危重）<br>相当于产后精神障碍/心衰</p><p><strong>冲胃：</strong>恶露上攻+恶心呕吐+腹胀→败血冲胃<br>相当于产后胃肠功能障碍</p><p><strong>冲肺：</strong>恶露上攻+面赤呕逆+喘急→败血冲肺<br>相当于产后呼吸窘迫/肺栓塞</p><p>三冲皆属危证+败血（瘀血）上攻所致</p></div><div class=ct-right><h4>三病与三急</h4><p><strong>产后"三病"（金匮）：</strong><br><strong>病痉：</strong>产后血虚+筋脉失养+感邪→抽搐（产后破伤风/子痫）<br><strong>病郁冒：</strong>产后失血+阴虚阳亢→头晕目眩（产后体位性低血压）<br><strong>大便难：</strong>产后血虚津亏+肠道失润→便秘</p><p><strong>产后"三急"：</strong><br>呕吐+盗汗+泄泻——三者并见→危重</p></div></div><div class=classic-quote>《金匮要略》："新产妇人有三病：一者病痉+二者病郁冒+三者大便难。"<span class=src>——《金匮要略》</span></div><div class=plain>产后病是生了孩子之后发生的病。"三冲"（败血冲心冲胃冲肺）——是恶露变成瘀血往上走+走到哪里哪里出问题——最危险。"三病"（病痉郁冒大便难）——张仲景说的+主要是血虚导致。"三急"（呕吐盗汗泄泻一起出现）——气血大伤的危重信号。记住"三冲最危+三病血虚+三急危重"。</p><div class=mnem><strong>口诀：</strong>三冲败血冲心肺胃+三病金匮痉郁冒难+三急吐汗泄并见危。</div><div class=trap-box><strong>高频考点：</strong>1.三病（金匮原文）——痉+郁冒+大便难。2.三冲——冲心+冲胃+冲肺（败血上攻）。3.三急——呕吐+盗汗+泄泻（三者并见危重）。4.产后病总病机——亡血伤津+瘀血内阻+多虚多瘀。5.治疗原则——"勿拘于产后+亦勿忘于产后"。6.产后用药宜忌：宜温补+忌寒凉攻伐。</div></div>'},
    {id:"fk-5-0a",name:"产后病的病因病机、治疗原则及用药宜忌",type:"apply",
content:'<p><strong>病因病机：</strong>亡血伤津（产时失血）+瘀血内阻（恶露不净）+外感六淫（产后体虚易感）+饮食劳倦（产后调护不当）。</p><div class=compare-table><div class=ct-left><h4>治疗原则</h4><p><strong>总则：</strong>"勿拘于产后+亦勿忘于产后"</p><p>勿拘于产后：有是证用是药+不要因为产后就一味温补</p><p>亦勿忘于产后：产后多虚多瘀+用药顾及气血</p></div><div class=ct-right><h4>用药宜忌</h4><p><strong>宜：</strong><br>温药调养+补气养血+活血化瘀（适度）<br>产后多虚→宜补+产后多瘀→宜化</p><p><strong>忌：</strong><br>·大汗——防亡阳<br>·峻下——伤正气<br>·寒凉——遏瘀血<br>·过于温燥——耗伤阴血</p></div></div><div class=classic-quote>《医宗金鉴》："古云胎前无不足+产后无有余+此言其常也。然亦有胎前有余+产后不足者+亦不可执一论也。"<span class=src>——《医宗金鉴》</span></div><div class=plain>产后病的病机特点：多虚（失血）+多瘀（恶露）。治疗总则"勿拘于产后+亦勿忘于产后"——意思是：不要认为产后只能温补（有热证就得清热）+但也不能忘记产后体虚而一味攻伐。用药上宜温补气血+化瘀而不破+忌大汗峻下寒凉。</p><div class=mnem><strong>口诀：</strong>产后多虚又多瘀，勿拘勿忘总则立；宜温宜补宜化瘀，忌汗忌下忌寒袭。</div></div>'}
  ]},
  {name:"细目二：产后血晕",points:[{id:"fk-5-1",name:"产后血晕的定义及辨证论治",type:"apply",
content:'<p><strong>产后血晕</strong>是产妇分娩后突然头晕眼花+不能坐起+恶心呕吐+甚至神昏口噤。相当于产后出血性休克。</p><div class=compare-table><div class=ct-left><h4>辨证分型</h4><p><strong>血虚气脱（脱证）：</strong>产后失血过多+突然晕眩+面色苍白+心悸+冷汗淋漓+肢冷+脉微欲绝<br>→ <strong>清魂散</strong>（重者独参汤/生脉散）<br>西医：产后大出血→休克</p><p><strong>瘀阻气闭（闭证）：</strong>产后恶露不下或量少+小腹阵痛拒按+神昏+面色紫暗+双手紧握<br>→ <strong>夺命散</strong>合<strong>黑神散</strong></p></div><div class=ct-right><h4>急救要点</h4><p>产后血晕是产科急症！</p><p>1.立即平卧+吸氧+保暖<br>2.查找出血原因+止血<br>3.血虚气脱→独参汤/参附汤益气固脱<br>4.瘀阻气闭→活血开闭</p><p>注意：产后出血是孕产妇死亡的首位原因！</p></div></div><div class=classic-quote>《妇人大全良方》："产后血晕+其由有二：一因去血过多+血虚气脱；二因恶露不行+血瘀气逆。治当辨之。"<span class=src>——《妇人大全良方》</span></div><div class=plain>产后血晕就是产后大出血引起的休克。分两种：虚的（失血过多→休克）和实的（恶露排不出→瘀血上冲）。虚的要补气固脱（参附汤独参汤）+实的要活血开闭（夺命散）。虚的更多见更危险+产后出血是产妇死亡的第一原因！考试重点就是分清"虚脱"和"实闭"。</p><div class=mnem><strong>口诀：</strong>产后血晕脱闭分，血虚气脱清魂散+独参参附固脱先；瘀阻气闭夺命黑神+虚实辨治救逆还。</div><div class=trap-box><strong>高频考点：</strong>1.虚脱→清魂散（人参泽兰川芎荆芥穗甘草）+重者独参汤/参附汤。2.实闭→夺命散（没药血竭）合黑神散（熟地归芍桂姜草豆蒲黄）。3.头号鉴别：虚脱（面色苍白+冷汗+脉微）vs闭证（面色紫暗+腹痛拒按+手握）。4.产后血晕是危急重症+需中西医结合抢救。5.血虚气脱者+急则独参汤益气固脱。</div></div>'}
  ]},
  {name:"细目三：产后发热",points:[{id:"fk-5-2",name:"产后发热的定义及辨证论治",type:"apply",
content:'<p><strong>产后发热</strong>是产褥期出现发热+持续不退或高热寒战。产后1-2天内因阴血骤虚+阳气浮越导致的低热（<38℃）为生理性发热+不需治疗。</p><div class=compare-table><div class=ct-left><h4>辨证分型</h4><p><strong>感染邪毒（最常见+最严重）：</strong>产后高热寒战+小腹疼痛拒按+恶露秽臭+色紫暗如败酱<br>→ <strong>五味消毒饮</strong>合<strong>失笑散</strong></p><p><strong>血瘀：</strong>产后寒热时作+恶露不下或下少+色紫暗有块+小腹刺痛<br>→ <strong>生化汤</strong></p><p><strong>外感：</strong>产后恶寒发热+鼻塞流涕+头痛<br>→ <strong>四物汤</strong>加<strong>荆芥防风苏叶</strong></p><p><strong>血虚：</strong>产后低热不退+汗多+面色潮红+头晕心悸<br>→ <strong>补中益气汤</strong>或<strong>八珍汤</strong></p></div><div class=ct-right><h4>鉴别要点</h4><p><strong>感染邪毒→最危险！</strong><br>相当于产褥感染（产后败血症）<br>是产妇死亡的重要原因之一</p><p>鉴别要点：<br>感染邪毒→高热+寒战+恶露臭<br>血瘀→寒热时作+恶露少<br>外感→恶寒+鼻塞+表证<br>血虚→低热+汗多+头晕</p></div></div><div class=classic-quote>《医宗金鉴》："产后发热+非止一端+有因风寒外感者+有因败血瘀滞者+有因去血过多者+有因饮食停滞者+当详辨之。"<span class=src>——《医宗金鉴》</span></div><div class=plain>产后发热最常见的原因是"产褥感染"——生孩子时细菌进入子宫引起的感染。这是最危险的产后发热类型+可发展成败血症。记住"产后发热四型"：感染（高热+恶露臭）→五味消毒饮+血瘀（寒热时作+恶露少）→生化汤+外感（表证）→四物荆防+血虚（低热+头晕）→补中益气/八珍。</p><div class=mnem><strong>口诀：</strong>产后发热四型分，感染五味合失笑+血瘀生化外感四物荆防+血虚补中八珍汤。</div><div class=trap-box><strong>高频考点：</strong>1.感染邪毒→五味消毒饮合失笑散——产后发热最严重。2.血瘀→生化汤（归芎桃草姜）。3.外感→四物汤加荆芥防风苏叶。4.血虚→补中益气汤/八珍汤。5.鉴别：感染（高热臭恶露）vs血虚（低热汗多）。6.产后发热持续>24小时+需查血常规+C反应蛋白+必要时抗生素。</div></div>'}
  ]},
  {name:"细目四：产后腹痛",points:[{id:"fk-5-3",name:"产后腹痛的定义及辨证论治",type:"apply",
content:'<p><strong>产后腹痛</strong>是产后小腹疼痛（子宫收缩痛）。轻者属生理现象（产后宫缩痛）重者需治疗。</p><div class=compare-table><div class=ct-left><h4>辨证分型</h4><p><strong>血虚：</strong>产后小腹隐隐作痛+喜按+小腹柔软无块+恶露量少色淡+头晕+心悸<br>→ <strong>肠宁汤</strong>或<strong>圣愈汤</strong></p><p><strong>血瘀：</strong>产后小腹刺痛拒按+按之有块（包块）+恶露量少+色紫暗有块+块下痛减<br>→ <strong>生化汤</strong>化瘀生新+温经止痛</p></div><div class=ct-right><h4>生化汤详解</h4><p><strong>生化汤（傅青主女科）：</strong><br>当归+川芎+桃仁+炮姜+炙甘草</p><p>功用：化瘀生新+温经止痛<br>主治：产后血瘀腹痛+恶露不行</p><p>特点：产后第一方——"生化"即"生新化瘀"之意</p><p>加减：<br>腹痛甚加延胡索<br>恶露不下加蒲黄五灵脂<br>血虚加人参黄芪</p></div></div><div class=classic-quote>《傅青主女科》："此方去瘀生新+温中止痛+为产后第一方。"<span class=src>——《傅青主女科》</span></div><div class=plain>产后腹痛最常见的是"宫缩痛"——生了孩子后子宫收缩痛。中医的"生化汤"是产后第一方——"生"是生新血+"化"是化瘀血。记住生化汤五味药：当归（君）+川芎（臣）+桃仁（臣）+炮姜（佐）+甘草（使）。产后无论有无腹痛+很多地方都要喝生化汤——帮助排恶露+促子宫恢复。但要注意：生化汤要产后才用+不能用于产前安胎！</p><div class=mnem><strong>口诀：</strong>生化汤是产后方，归芎桃草姜；化瘀生新温经痛，产后腹痛第一方。</div><div class=trap-box><strong>高频考点：</strong>1.血虚→肠宁汤（当归熟地阿胶山药续断麦冬甘草肉桂）或圣愈汤（四物+黄芪人参）。2.血瘀→生化汤（当归川芎桃仁炮姜甘草）——产后第一方。3.生化汤功能：化瘀生新+温经止痛。4.生化汤可治多种产后病（腹痛+恶露不绝+发热等）。5.注意：生化汤是温性方（有炮姜）+血热有火者不宜。6.产后腹痛轻者可自行缓解+重者用药。</div></div>'},
    {id:"fk-5-3a",name:"生化汤的药物组成",type:"detail",
content:'<p><strong>生化汤（傅青主女科）：</strong>当归+川芎+桃仁+炮姜+炙甘草。</p><div class=compare-table><div class=ct-left><h4>组方分析</h4><p><strong>当归（君）：</strong>全当归24g——补血活血+化瘀生新</p><p><strong>川芎（臣）：</strong>9g——活血行气+散寒</p><p><strong>桃仁（臣）：</strong>9g——活血祛瘀</p><p><strong>炮姜（佐）：</strong>2g——温经散寒+止血</p><p><strong>炙甘草（使）：</strong>2g——调和诸药</p><p>加黄酒童便煎服——增强活血散寒效果（传统用法）</p></div><div class=ct-right><h4>考点精华</h4><p>生化汤——"产后第一方"</p><p>功用：化瘀生新+温经止痛<br>主治：产后血瘀腹痛+恶露不行</p><p>君臣佐使的"君"是——当归（不是桃仁！）</p><p>特点：<br>祛瘀不伤正+补血不留瘀<br>归多（24g）桃少（9g）——以补为通</p></div></div><div class=classic-quote>《傅青主女科》："产后恶露不行+腹中疼痛+服生化汤以化瘀生新。"<span class=src>——《傅青主女科》</span></div></div>'}
  ]},
  {name:"细目五：产后恶露不绝",points:[{id:"fk-5-4",name:"恶露不绝的定义及辨证论治",type:"apply",
content:'<p><strong>恶露不绝</strong>是产后恶露持续3周以上仍淋漓不断。产后恶露正常持续约3周（21天）左右+量逐渐减少+颜色从红到白。</p><div class=compare-table><div class=ct-left><h4>辨证分型</h4><p><strong>气虚：</strong>恶露过期不止+量多色淡质稀+无臭味+小腹空坠+神疲+气短<br>→ <strong>补中益气汤</strong>益气摄血</p><p><strong>血瘀：</strong>恶露过期不止+量少或时多+色紫暗有块+小腹刺痛+块下痛减<br>→ <strong>生化汤</strong>化瘀止血</p><p><strong>血热：</strong>恶露过期不止+量多色鲜红/紫红质稠+有臭味+心烦+口渴<br>→ <strong>保阴煎</strong>清热凉血+固冲止血</p></div><div class=ct-right><h4>诊断要点</h4><p><strong>正常恶露：</strong>3周左右干净+量从多到少+色从红到白+无臭</p><p><strong>异常：</strong>持续>3周=恶露不绝</p><p>恶露有臭+发热+腹痛→产褥感染！</p><p>注意：<br>·与月经复潮鉴别（产后6-12周恢复）<br>·B超排查宫腔内残留物</p></div></div><div class=classic-quote>《医宗金鉴》："产后恶露+乃裹儿污血+产后当去+若日久不断+时时淋漓者+或因气虚+或因血热+或因瘀血。"<span class=src>——《医宗金鉴》</span></div><div class=plain>恶露不绝就是产后20多天了还在出血。三型：气虚（色淡质稀+乏力+补中益气汤）+血瘀（色暗有块+腹痛+生化汤）+血热（色鲜红质稠+臭+保阴煎）。注意和产后宫缩痛的鉴别——恶露不绝是"出血时间延长"+产后腹痛是"小腹疼痛"。</p><div class=mnem><strong>口诀：</strong>恶露不绝三周过，气虚补中血瘀生化汤；血热保阴煎三型+分型辨治恶露康。</div><div class=trap-box><strong>考点：</strong>1.气虚→补中益气汤。2.血瘀→生化汤。3.血热→保阴煎（生地熟地白芍山药续断芩柏草）。4.生化汤既治产后腹痛又治恶露不绝。5.恶露不绝超过3周需B超+排除宫腔残留+必要时清宫。6.恶露有臭味+发热→产褥感染。</div></div>'}
  ]}
]},

'''

after = c[:idx6] + UNIT6 + c[idx7:]

with open(TARGET, 'w', encoding='utf-8') as f:
    f.write(after)

print(f"Done. Size: {len(after)} bytes (was {len(c)} bytes)")
