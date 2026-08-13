#!/usr/bin/env python3
# fill-unit12.py — 填充 s6 第十二单元 周围血管疾病
import re

TARGET = '/sessions/compassionate-hopeful-thompson/mnt/syllabus/subjects/s6-waike.js'

with open(TARGET, 'r', encoding='utf-8') as f:
    before = f.read()

UNIT12 = '''{unit:"第十二单元 周围血管疾病",subunits:[
  {name:"细目一：概述",points:[{id:"wk-12-1",name:"周围血管疾病的常见症状与体征",type:"concept",
content:'<p><strong>周围血管疾病</strong>是发生在肢体血管的疾病总称。常见症状：疼痛、肿胀、皮温皮色改变、感觉异常、溃疡坏疽、脉搏异常、雷诺现象。</p><div class=compare-table><div class=ct-left><h4>动脉疾病特点</h4><p><strong>疼痛：</strong>间歇性跛行+静息痛<br><strong>皮色：</strong>苍白+紫绀<br><strong>皮温：</strong>降低（凉）<br><strong>脉搏：</strong>减弱或消失<br><strong>营养：</strong>皮肤干燥脱屑+趾甲增厚<br><strong>坏疽：</strong>干性坏疽</p></div><div class=ct-right><h4>静脉疾病特点</h4><p><strong>疼痛：</strong>胀痛沉重+活动加重+抬高减轻<br><strong>皮色：</strong>紫暗+色素沉着<br><strong>皮温：</strong>正常或稍高<br><strong>脉搏：</strong>正常<br><strong>营养：</strong>皮肤湿疹+搔痒<br><strong>溃疡：</strong>湿性溃疡（臁疮）</p></div></div><div class=classic-quote>《外科正宗》："夫脱疽者，由膏粱厚味，醇酒炙煿，积毒蕴于脏腑，毒聚于四肢，以致脉道闭阻，气血不能周流。"<span class=src>——《外科正宗》</span></div><div class=plain>周围血管病就是腿上的血管出了问题。动脉堵了——腿变白变凉走不动路（间歇性跛行）。静脉堵了——腿变紫变肿像灌了铅（肿胀沉重）。记住一个口诀：动脉病"白凉痛无脉"+静脉病"紫肿热不痛（或胀痛）"。</p><div class=mnem><strong>口诀：</strong>动白静紫要分清，动脉跛行静肿沉；动脉无脉凉如冰，静脉臁疮色褐深。</div><div class=trap-box><strong>考点：</strong>1.间歇性跛行——动脉供血不足特征+走一段路痛+休息缓解+再走又痛。2.静息痛——动脉严重缺血+夜间剧痛+下垂肢体可缓解。3.动脉皮温降低+静脉皮温正常。4.动脉干性坏疽+静脉湿性坏疽。5.Buerger试验判断动脉供血。6.四诊要点：望（皮色肿胀溃疡）+触（皮温脉搏）+问（疼痛跛行）+听（血管杂音）。</div></div>'}]
},
  {name:"细目二：股肿",points:[{id:"wk-12-2",name:"股肿的含义、特点、病因病机、诊断及辨证论治",type:"apply",
content:'<p><strong>股肿</strong>是髂股深静脉血栓形成的血管疾病。特点：肢体肿胀+疼痛+浅静脉扩张。</p><div class=compare-table><div class=ct-left><h4>急性期（湿热瘀阻）</h4><p><strong>治法：</strong>清热利湿+活血通脉<br><strong>主方：</strong>四妙勇安汤合四物汤<br><strong>外治：</strong>抬高患肢+制动<br><strong>注意：</strong>防血栓脱落致肺栓塞！</p></div><div class=ct-right><h4>慢性期（气虚血瘀）</h4><p><strong>治法：</strong>益气活血+通脉消肿<br><strong>主方：</strong>补阳还五汤<br><strong>外治：</strong>弹力袜+功能锻炼<br><strong>注意：</strong>防深静脉血栓后遗症</p></div></div><div class=classic-quote>《证治准绳》："瘀血流注，四肢疼痛肿胀，不可忍者，治当活血通络，清热利湿。"<span class=src>——《证治准绳》</span></div><div class=plain>股肿就是深静脉血栓——腿里的深静脉被血块堵住了，整条腿肿得像大象腿。最常见于手术后卧床、产妇、长途旅行久坐。最危险的是血栓脱落到肺——肺栓塞会要命！急性期清热利湿活血+慢性期益气活血通脉。</p><div class=mnem><strong>口诀：</strong>股肿深静脉血栓，肿胀疼痛静脉张；急性四妙合四物，慢性补阳还五汤；防脱防栓最关键，制动抬高切勿按！</div><div class=trap-box><strong>高频考点：</strong>1.股肿三主症：肿胀+疼痛+浅静脉扩张（Homans征阳性——足背屈时小腿后侧疼痛）。2.最严重并发症——肺栓塞（突发胸痛咳血呼吸困难）。3.急性期禁止按摩+禁止挤压患肢！4.急性期湿热瘀阻→四妙勇安汤合四物汤。5.慢性期气虚血瘀→补阳还五汤。6.鉴别：股肿vs下肢淋巴水肿（非凹陷性+足背肿）+心源性水肿（对称性+伴心衰）。</div></div><div class=mini-quiz><div class=mq-title>一分钟诊室</div><div class=mq-scene>患者产后第5天突发左下肢肿胀剧痛浅静脉扩张Homans征阳性</div><div class=mq-opts><span class=mq-opt data-ans=right>A. 四妙勇安汤合四物汤</span><span class=mq-opt data-ans=wrong>B. 补阳还五汤</span><span class=mq-opt data-ans=wrong>C. 阳和汤</span><span class=mq-opt data-ans=wrong>D. 五神汤</span></div><div class=mq-feedback style=display:none><template class=fb-right>正确！股肿急性期湿热瘀阻用四妙勇安汤合四物汤清热利湿活血通脉。</template><template class=fb-wrong>股肿分期：急性期四妙四物+慢性期补阳还五。阳和汤治脱疽寒湿+五神汤治丹毒。</template></div></div>',
cardQuiz:[{q:"股肿最严重的并发症是？",opts:["肺栓塞","下肢坏疽","心力衰竭","肾衰竭"],ans:0},{q:"股肿急性期禁忌的是？",opts:["按摩患肢","抬高患肢","制动休息","抗凝治疗"],ans:0}]}]
},
  {name:"细目三：血栓性浅静脉炎",points:[{id:"wk-12-3",name:"血栓性浅静脉炎的病因病机、临床表现及辨证论治",type:"detail",
content:'<p><strong>血栓性浅静脉炎</strong>是浅静脉壁的炎症反应伴血栓形成。特点：静脉走行区红肿热痛+条索状硬结。好发于下肢+胸腹壁+输液部位。</p><div class=compare-table><div class=ct-left><h4>湿热蕴结型（急性期）</h4><p><strong>表现：</strong>红肿热痛+条索状+灼热<br><strong>治法：</strong>清热利湿+凉血活血<br><strong>主方：</strong>五神汤合四妙勇安汤<br><strong>外治：</strong>金黄膏外敷</p></div><div class=ct-right><h4>气滞血瘀型（慢性期）</h4><p><strong>表现：</strong>条索硬结+不红不热+隐痛<br><strong>治法：</strong>行气散结+活血通脉<br><strong>主方：</strong>桃红四物汤合桂枝茯苓丸<br><strong>外治：</strong>软坚膏或温敷</p></div></div><div class=classic-quote>《医宗金鉴》："脉痹者，脉络不通，或红肿灼痛，或硬结成索，当审因而治之。"<span class=src>——《医宗金鉴》</span></div><div class=plain>血栓性浅静脉炎就是一根浅表静脉发炎了，红红肿肿的，摸上去硬硬的像一根绳子。最常见的是输液后静脉炎。胸腹壁型叫Mondor病。和股肿区别：浅静脉炎在表层不致命+股肿在深层可致肺栓塞。</p><div class=mnem><strong>口诀：</strong>浅静脉炎索条状，红肿热痛湿热伤；五神四妙清利湿，桃红桂苓化瘀良。</div><div class=trap-box><strong>考点：</strong>1.浅vs深鉴别：浅——条索硬结不致命；深——肢体肿胀可肺栓塞。2.急性期→五神汤合四妙勇安汤。3.慢性期→桃红四物汤合桂枝茯苓丸。4.最常见原因——输液刺激。5.Mondor病——胸腹壁条索+牵拉痛。</div></div>',
cardQuiz:[{q:"血栓性浅静脉炎的典型体征是？",opts:["条索状硬结","肢体肿胀","Homans征阳性","间歇性跛行"],ans:0},{q:"血栓性浅静脉炎急性期的代表方是？",opts:["五神汤合四妙勇安汤","阳和汤","补阳还五汤","四物汤"],ans:0}]}]
},
  {name:"细目四：筋瘤",points:[{id:"wk-12-4",name:"筋瘤的定义、特点及辨证论治",type:"detail",
content:'<p><strong>筋瘤</strong>是下肢静脉曲张（筋脉隆起盘曲如蚯蚓）。特点：下肢浅静脉扩张隆起+久站加重+抬高减轻。</p><div class=compare-table><div class=ct-left><h4>辨证分型</h4><p><strong>劳倦伤气：</strong>久站+遇劳加重+气短乏力→<strong>补中益气汤</strong></p><p><strong>气滞血瘀：</strong>瘤体青紫+刺痛固定→<strong>桃红四物汤合柴胡疏肝散</strong></p><p><strong>湿热下注：</strong>红肿灼痛+湿疹→<strong>五神汤合萆薢渗湿汤</strong></p></div><div class=ct-right><h4>并发症与防治</h4><p><strong>并发症：</strong>血栓性浅静脉炎+臁疮+出血<br><strong>非手术：</strong>弹力袜+抬高+避免久站<br><strong>手术禁忌：</strong>深静脉阻塞者不宜手术</p></div></div><div class=classic-quote>《外科正宗》："筋瘤者，坚而色紫，垒垒青筋，盘曲甚者，结若蚯蚓。"<span class=src>——《外科正宗》</span></div><div class=plain>筋瘤就是西医说的下肢静脉曲张——腿上青筋暴起像蚯蚓。常见于教师、售货员等久站职业。深静脉阻塞者禁忌手术——曲张静脉是代偿通路，切了反而加重！</p><div class=mnem><strong>口诀：</strong>筋瘤蚯蚓青筋盘，劳倦补中气滞桃；湿热五神萆渗治，弹力袜穿防臁疮。</div><div class=trap-box><strong>考点：</strong>1.三型辨治：劳倦伤气→补中益气汤+气滞血瘀→桃红四物汤合柴胡疏肝散+湿热下注→五神汤合萆薢渗湿汤。2.重要禁忌：深静脉阻塞者禁忌手术！3.并发症：血栓性浅静脉炎+臁疮+出血。4.Perthes试验=深静脉通畅试验+Trendelenburg试验=瓣膜功能试验。</div></div>',
cardQuiz:[{q:"筋瘤手术的禁忌证是？",opts:["深静脉阻塞","浅静脉曲张","下肢肿胀","皮肤色素沉着"],ans:0},{q:"筋瘤劳倦伤气型的代表方是？",opts:["补中益气汤","桃红四物汤","五神汤","阳和汤"],ans:0}]}]
},
  {name:"细目五：臁疮",points:[{id:"wk-12-5",name:"臁疮的病因病机、局部辨证及治疗原则",type:"apply",
content:'<p><strong>臁疮</strong>是小腿臁骨（胫骨）部位的慢性溃疡。特点：久站负重+臁骨内外侧+经久不愈+反复发作。俗名"老烂脚"。</p><div class=compare-table><div class=ct-left><h4>局部辨证（部位分经）</h4><p><strong>外臁（外侧）：</strong>三阳经+易治<br>疮面浅+肉芽红活+腐肉少<br><strong>内臁（内侧）：</strong>三阴经+难治<br>疮面深+肉芽暗淡+腐肉多</p></div><div class=ct-right><h4>治疗原则</h4><p><strong>湿热下注（急性）：</strong>五神汤合萆薢渗湿汤<br><strong>气虚血瘀（慢性）：</strong>补阳还五汤<br><strong>外治——缠缚疗法（关键！）：</strong><br>弹力绷带自下而上缠缚+抬高患肢</p></div></div><div class=classic-quote>《外科启玄》："臁疮者，生于两臁之上，初起红肿，久则溃烂。"<span class=src>——《外科启玄》</span></div><div class=plain>臁疮就是小腿上的老烂脚（静脉性溃疡）。外侧三阳经易治+内侧三阴经难治。治疗关键不是内服药——而是缠缚疗法（弹力绷带）+抬高患肢。</p><div class=mnem><strong>口诀：</strong>臁疮老烂小腿生，外臁易治内难平；湿热五神萆渗治，气虚补阳还五灵；缠缚疗法是关键，弹力绷带抬高灵。</div><div class=trap-box><strong>高频考点：</strong>1.最独特治疗——缠缚疗法（弹力绷带抬高患肢）！2.外臁三阳经易治+内臁三阴经难治。3.急性湿热下注→五神汤合萆薢渗湿汤+慢性气虚血瘀→补阳还五汤。4.鉴别：臁疮在小腿中下+脱疽在足趾末端。5.防止恶变为鳞癌——需病理活检。</div></div><div class=mini-quiz><div class=mq-title>一分钟诊室</div><div class=mq-scene>患者左小腿内侧溃疡经年不愈疮面深陷周围色素沉着</div><div class=mq-opts><span class=mq-opt data-ans=right>A. 臁疮（内臁）</span><span class=mq-opt data-ans=wrong>B. 臁疮（外臁）</span><span class=mq-opt data-ans=wrong>C. 脱疽（寒湿型）</span><span class=mq-opt data-ans=wrong>D. 丹毒</span></div><div class=mq-feedback style=display:none><template class=fb-right>正确！小腿内侧溃疡经年不愈=内臁三阴经难治型。缠缚疗法+益气活血。</template><template class=fb-wrong>内臁三阴经难治+外臁三阳经易治。脱疽在足趾+丹毒色如涂丹。</template></div></div>',
cardQuiz:[{q:"臁疮治疗的关键环节是？",opts:["缠缚疗法","内服中药","外用药膏","手术切除"],ans:0},{q:"臁疮外臁（外侧）属何经？",opts:["三阳经","三阴经","厥阴经","太阴经"],ans:0}]}]
},
  {name:"细目六：脱疽",points:[{id:"wk-12-6",name:"脱疽的定义、特点、病因病机、诊断及辨证论治",type:"apply",
content:'<p><strong>脱疽</strong>是四肢末端坏死脱落的血管疾病。特点：好发下肢+青紫坏死+脱落。相当于血栓闭塞性脉管炎（TAO）+动脉硬化闭塞症+糖尿病足。</p><div class=compare-table><div class=ct-left><h4>五期辨治</h4><p><strong>寒湿阻络（早期）：</strong>发凉苍白+间歇性跛行→<strong>阳和汤</strong></p><p><strong>血脉瘀阻（中期）：</strong>紫暗+静息痛→<strong>桃红四物汤合活络效灵丹</strong></p><p><strong>湿热毒盛（进展期）：</strong>红肿热痛+溃破腐臭→<strong>四妙勇安汤</strong></p><p><strong>热毒伤阴（破溃期）：</strong>干枯无脓+口干→<strong>顾步汤</strong></p><p><strong>气血两虚（后期）：</strong>疮面不敛+神疲→<strong>八珍汤</strong></p></div><div class=ct-right><h4>鉴别与预后</h4><p><strong>脱疽vs臁疮：</strong><br>脱疽→足趾末端（坏死脱落）<br>臁疮→小腿中下（溃疡不敛）</p><p><strong>趺阳脉：</strong>足背动脉摸不到→动脉病变<br><strong>调护：</strong>戒烟！防寒+防外伤</p></div></div><div class=classic-quote>《灵枢·痈疽》："发于足指，名脱痈（脱疽）。其状赤黑，死不治。不赤黑，不死。治之不衰，急斩之。"<span class=src>——《黄帝内经》</span></div><div class=plain>脱疽就是脚趾发黑坏死。多发于吸烟青年男性（血栓闭塞性脉管炎）或老年糖尿病人（糖尿病足）。五期辨治是必考内容——从寒到热再到虚。最关键一条：脱疽必须戒烟！</p><div class=mnem><strong>口诀：</strong>脱疽五期要记全，寒阳瘀桃热毒四妙；热伤阴液顾步救，气血八珍收口先；趺阳脉弱动脉堵，戒烟防寒是关键！</div><div class=trap-box><strong>高频考点：</strong>1.脱疽五期辨治（必考！！）：寒湿阻络→阳和汤+血脉瘀阻→桃红四物汤合活络效灵丹+湿热毒盛→四妙勇安汤+热毒伤阴→顾步汤+气血两虚→八珍汤。2.脱疽和股肿急性期都用四妙勇安汤——注意区别疾病。3.趺阳脉摸不到提示下肢动脉病变。4.绝对禁烟！5.严重时需截肢——"急斩之"。</div><div class=clinical-case>一位35岁男性吸烟20年+左足趾发凉苍白走300米小腿酸痛——脱疽寒湿阻络用阳和汤（熟地30g肉桂6g麻黄6g白芥子9g鹿角胶9g姜炭6g生甘草6g）加川牛膝12g丹参15g七剂后转温。嘱严格戒烟。</div></div><div class=mini-quiz><div class=mq-title>一分钟诊室</div><div class=mq-scene>青年男性吸烟史+左足趾发凉苍白间歇性跛行趺阳脉弱</div><div class=mq-opts><span class=mq-opt data-ans=right>A. 阳和汤</span><span class=mq-opt data-ans=wrong>B. 四妙勇安汤</span><span class=mq-opt data-ans=wrong>C. 桃红四物汤</span><span class=mq-opt data-ans=wrong>D. 顾步汤</span></div><div class=mq-feedback style=display:none><template class=fb-right>正确！脱疽早期寒湿阻络用阳和汤温阳散寒活血。严格戒烟！</template><template class=fb-wrong>脱疽五期辨治：寒湿阳和+瘀阻桃红四物+毒盛四妙勇安+阴虚顾步+气虚八珍。</template></div></div>',
cardQuiz:[{q:"脱疽最重要的治疗措施是？",opts:["严格戒烟","活血化瘀","中药外敷","抗生素"],ans:0},{q:"脱疽湿热毒盛型的主方是？",opts:["四妙勇安汤","阳和汤","顾步汤","八珍汤"],ans:0},{q:"脱疽寒湿阻络型的主方是？",opts:["阳和汤","桃红四物汤","四妙勇安汤","补阳还五汤"],ans:0}]}]
}
]}'''

# Find unit 12 block
old = r'{unit:"第十二单元 周围血管疾病".*?\]\},'
m = re.search(old, before, re.DOTALL)
if not m:
    print("ERROR: Cannot find unit 12")
    exit(1)

after = before[:m.start()] + UNIT12 + before[m.end():]
after = after.replace(']}\n{unit:"第十三单元', ']},\n{unit:"第十三单元')

with open(TARGET, 'w', encoding='utf-8') as f:
    f.write(after)

print(f"Done. Size: {len(after)} bytes, before: {len(before)} bytes")
