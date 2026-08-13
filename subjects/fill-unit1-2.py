#!/usr/bin/env python3
"""fill-unit1-2.py — 填充 s6 第一、二单元"""
TARGET = '/sessions/compassionate-hopeful-thompson/mnt/syllabus/subjects/s6-waike.js'

with open(TARGET, 'r', encoding='utf-8') as f:
    c = f.read()

idx1 = c.find('{unit:"第一单元')
idx2 = c.find('{unit:"第二单元')
idx3 = c.find('{unit:"第三单元')

if idx1 < 0 or idx2 < 0 or idx3 < 0:
    print("ERROR: Cannot find boundaries")
    exit(1)

UNIT1 = r'''{unit:"第一单元 疾病命名与基本术语",subunits:[{name:"基本术语",points:[
  {id:"wk-1-1",name:"疡、疮疡、痈、疽等基本术语的含义",type:"concept",
content:'<p><strong>疡：</strong>广义—一切外科疾病总称；狭义—体表化脓性疾患。<br><strong>疮疡：</strong>体表化脓性感染性疾病的总称。<br><strong>痈：</strong>发生于皮肉之间的急性化脓性疾病。特点：光软无头+红肿6-9cm+易肿易脓易溃易敛（三易）。<br><strong>疽：</strong>深部组织的化脓性疾病。特点：漫肿无头+皮色不变+难消难敛。<br><strong>有头疽：</strong>多个粟粒样脓头+溃后蜂窝状+范围>9cm。<br><strong>无头疽：</strong>漫肿无头+发于筋骨深处+难消难溃难敛。</p><div class=compare-table><div class=ct-left><h4>核心鉴别链</h4><p><strong>疡→疮疡→痈/疽</strong><br><br><strong>痈（阳证）：</strong><br>·皮肉之间+光软无头<br>·红肿范围6-9cm<br>·易肿易脓易溃易敛（三易）<br>·代表：颈痈+乳痈等</p></div><div class=ct-right><h4>疽的进一步细分</h4><p><strong>有头疽（阳中挟阴）：</strong><br>·多个粟粒样脓头+蜂窝状<br>·范围>9cm+项背好发<br>·消渴+老年人多见<br><br><strong>无头疽（阴证）：</strong><br>·漫肿无头+筋骨深处<br>·难消难溃难敛（三难）<br>·代表：流注+附骨疽等</p></div></div><div class=classic-quote>《灵枢·痈疽》："营卫稽留于经脉之中，则血泣而不行……热胜则肉腐，肉腐则为脓。然不能陷，骨髓不为焦枯，五脏不为伤，故命曰痈。热气淳盛，下陷肌肤，筋髓枯，内连五脏，血气竭，当其痈下，筋骨良肉皆无余，故命曰疽。"<span class=src>——《黄帝内经》</span></div><div class=plain>这几个概念从宽到窄：疡（所有外科病）→疮疡（化脓性的）→痈（浅表化脓好得快）vs疽（深层化脓好得慢）。最关键的区别是"痈浅疽深+痈阳疽阴"。痈有三个"易"（易肿易脓易敛）+有头疽像蜂窝+无头疽最难缠。</p><div class=mnem><strong>口诀：</strong>疡是总称疮疡脓，痈浅光软三易好；疽深漫肿三难愈，有头蜂窝无头凶。</div><div class=trap-box><strong>高频考点：</strong>1.痈vs疽核心鉴别：痈浅（皮肉间）+光软无头+易敛；疽深（筋骨间）+漫肿无头+难敛。2.有头疽（蜂窝状痈）vs痈（单个脓头）——注意西医中"痈"=中医"有头疽"！3."三易"=易肿易脓易敛+"三难"=难消难溃难敛。4.《灵枢·痈疽》原文是经典考点。</div></div>'}
]}]},

'''

UNIT2 = r'''{unit:"第二单元 中医外科疾病的病因病机",subunits:[
  {name:"细目一：致病因素",points:[{id:"wk-1a-1",name:"外感六淫、情志内伤、饮食不节等致病因素",type:"detail",
content:'<p><strong>外科疾病的致病因素：</strong></p><div class=compare-table><div class=ct-left><h4>外因</h4><p><strong>外感六淫：</strong>风（肿宣浮+痛无定处）+寒（肿木硬+痛固定）+暑（肿焮红+夏秋多发）+湿（肿沉重+水疱糜烂）+燥（皮肤干裂脱屑）+火（肿焮红灼痛+最易致疮痈）<br><strong>特殊之毒：</strong>虫毒+蛇毒+漆毒+药毒+疫疠之毒<br><strong>外来伤害：</strong>跌打损伤+水火烫伤+冻伤</p></div><div class=ct-right><h4>内因</h4><p><strong>情志内伤：</strong>怒伤肝（气滞血瘀）+思伤脾（痰湿内生）+忧伤肺（气机不畅）<br><strong>饮食不节：</strong>膏粱厚味+醇酒炙煿→湿热内生→痈疽疮疡<br><strong>劳伤虚损：</strong>房劳伤肾+过劳伤气→正气不足→邪气易侵</p></div></div><div class=classic-quote>《外科启玄》："凡疮疡，皆由五脏不和，六腑壅滞，则令经脉不通而生焉。"<span class=src>——《外科启玄》</span></div><div class=plain>外科致病就是外因（六淫伤害）+内因（情绪饮食）+不内外因（跌打虫兽）。记住"外科之因，火毒为最"——六淫中"火"最容易引发外科病（红热肿痛）。特殊之毒里注意"漆毒"（油漆过敏）+"疫疠"（传染病）。内因中"膏粱厚味"（大吃大喝）是外科常见诱因——糖尿病、痤疮等都与此相关。</p><div class=mnem><strong>口诀：</strong>外科病因分内外，六淫火毒最易生；情志饮食伤虚损，特殊之毒要分清。</div><div class=trap-box><strong>考点：</strong>1.六淫中"火毒"是外科最常见致病因素（火主疮痈）。2.外科致病特点：六淫可化热化火+外科以"热""火"为多。3.风性上行+多犯头面；湿性趋下+多犯下肢。4.情志内伤以"肝郁气滞"最常见（乳癖+瘰疬）。5.饮食不节"膏粱厚味"生湿热+致痈疽。6.特殊之毒：漆毒、药毒、蛇毒。</div></div>'}]
},
  {name:"细目二：发病机理",points:[{id:"wk-1a-2",name:"邪正盛衰、气血凝滞、经络阻塞、脏腑失和",type:"detail",
content:'<p><strong>外科疾病发病机理四环节：</strong></p><div class=compare-table><div class=ct-left><h4>发病过程</h4><p><strong>1.邪正盛衰：</strong>正气不足+邪气入侵→发病的根本。正气旺盛→抗邪有力→疾病局限+易愈；正气虚弱→邪气深入→扩散难敛。</p><p><strong>2.气血凝滞：</strong>邪客于经络+气血运行不畅→局部肿痛。气血凝滞久→郁而化热→热盛肉腐→成脓。</p></div><div class=ct-right><h4>病机演变</h4><p><strong>3.经络阻塞：</strong>气血凝滞→经络阻塞→肿痛更甚。经络为病邪传导通路+引经药可直达病所。</p><p><strong>4.脏腑失和：</strong>体表疮疡→毒邪内攻→脏腑功能失调（走黄+内陷）。脓肿形成=正邪交争→正气托毒外出→脓出毒泄→愈合。</p></div></div><div class=classic-quote>《医宗金鉴》："痈疽原是火毒生，经络阻塞气血凝。"<span class=src>——《医宗金鉴》</span></div><div class=plain>外科发病四步走：1.正气弱了（邪正盛衰）→2.气血堵了（气血凝滞→肿痛）→3.堵久了化热（热盛肉腐→成脓）→4.经络不通影响脏腑。脓是正气把邪气"托"出来的结果——有脓是好事（正气托毒）。最严重的是"走黄"（疔毒入血）+"内陷"（疮疡毒邪内攻脏腑）。</p><div class=mnem><strong>口诀：</strong>邪正盛衰是根本，气血凝滞肿痛生；经络阻塞循行路，脏腑失和走陷凶。</div><div class=trap-box><strong>高频考点：</strong>1."热胜则肉腐，肉腐则为脓"——成脓机制。2.脓的形成=气血凝滞→郁而化热→热盛肉腐→液化成脓。3."脓"是正气托毒外出的结果+不是坏事。4.走黄=疔毒入血（败血症）+内陷=疮疡毒邪内攻（全身感染综合征）。5."痈疽原是火毒生，经络阻塞气血凝"——医宗金鉴外科总纲。6.引经药利用经络学说治疗外科病。</div></div>'}]
}
]},

'''

after = c[:idx1] + UNIT1 + c[idx2:]
# Second replacement operates on new content
idx2_new = after.find('{unit:"第二单元')
idx3_new = after.find('{unit:"第三单元')
after = after[:idx2_new] + UNIT2 + after[idx3_new:]

with open(TARGET, 'w', encoding='utf-8') as f:
    f.write(after)

print(f"Done. Size: {len(after)} bytes (was {len(c)} bytes)")
