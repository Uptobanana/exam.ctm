#!/usr/bin/env python3
"""fill-unit11.py — 填充 s6 第十一单元 泌尿男性疾病"""
TARGET = '/sessions/compassionate-hopeful-thompson/mnt/syllabus/subjects/s6-waike.js'

with open(TARGET, 'r', encoding='utf-8') as f:
    c = f.read()

idx11 = c.find('{unit:"第十一单元')
idx12 = c.find('{unit:"第十二单元')

if idx11 < 0 or idx12 < 0:
    print("ERROR: Cannot find unit boundaries")
    exit(1)

print(f"Replace offset {idx11}-{idx12} (len={idx12-idx11})")

UNIT11 = r'''{unit:"第十一单元 泌尿男性疾病",subunits:[
  {name:"细目一：概述",points:[{id:"wk-11-1",name:"男性前阴各部与脏腑的关系",type:"concept",
content:'<p><strong>前阴</strong>为宗筋之所聚+太阴阳明之所合。各部位对应关系：<br><strong>阴茎：</strong>属肝（肝脉循阴器）<br><strong>睾丸（肾子）：</strong>属肾（肾主生殖）<br><strong>精索（子系）：</strong>属肝（肝主筋）<br><strong>阴囊：</strong>属肾（足厥阴肝经+足少阴肾经所过）</p><div class=compare-table><div class=ct-left><h4>前阴与脏腑经络关系</h4><p><strong>肝：</strong>足厥阴肝经循行绕阴器+肝主筋+宗筋为肝所主<br><strong>肾：</strong>开窍于二阴+肾藏精主生殖+肾子（睾丸）属肾<br><strong>脾：</strong>足太阴脾经+阳明经合于前阴+主肌肉<br><strong>心：</strong>心主神明+欲念动于心+君火相火</p></div><div class=ct-right><h4>临床意义</h4><p><strong>阳痿：</strong>多责之肝肾<br><strong>睾丸肿痛：</strong>多责之肝经湿热<br><strong>不育：</strong>多责之肾虚<br><strong>阴囊湿疹：</strong>多责之肝经湿热下注<br><strong>遗精早泄：</strong>多责之心肾不交</p></div></div><div class=classic-quote>《灵枢·经脉》："肝足厥阴之脉……循股阴，入毛中，环阴器，抵小腹。"<span class=src>——《黄帝内经》</span></div><div class=plain>前阴就是男性生殖器官的总称。中医说"前阴者，宗筋之所聚"——一堆筋（韧带肌腱）的汇聚处。肝主筋+肾主生殖+脾主肌肉——前阴问题主要找肝肾。阴茎属肝+睾丸属肾+阴囊属肾经肝经所过。</p><div class=mnem><strong>口诀：</strong>前阴宗筋肝肾主，阴茎属肝睾属肾；阳痿阳强多从肝，不育遗精责在肾。</div><div class=trap-box><strong>考点：</strong>1."前阴者，宗筋之所聚"——出处和含义。2.前阴与脏腑关系：肝（主筋络阴器）+肾（主生殖开窍二阴）+脾（阳明合前阴）。3.阴茎属肝+睾丸属肾——辨证定位的根本。4.阳痿从肝治+不育从肾治。5.足厥阴肝经"环阴器"+足少阴肾经上股内后廉。</div></div>'}]
},
  {name:"细目二：子痈",points:[{id:"wk-11-2",name:"子痈的含义、病因病机及诊断治疗",type:"apply",
content:'<p><strong>子痈</strong>是睾丸及附睾的急性化脓性疾病。特点：睾丸肿痛+硬结+化脓。急性子痈起病急+灼热痛+酿脓溃后脓稠+慢性子痈硬结不消+附睾硬结+不痛或隐痛。</p><div class=compare-table><div class=ct-left><h4>急性子痈</h4><p><strong>病因：</strong>湿热下注肝经+外感寒湿化热<br><strong>表现：</strong>睾丸肿痛灼热+阴囊红肿+发热<br><strong>治法：</strong>清热利湿+解毒消痈<br><strong>主方：</strong>龙胆泻肝汤<br><strong>外治：</strong>金黄膏+脓成切开</p></div><div class=ct-right><h4>慢性子痈</h4><p><strong>病因：</strong>急性失治迁延+肝肾阴虚+痰瘀互结<br><strong>表现：</strong>附睾硬结+不痛或隐痛+不红不热<br><strong>治法：</strong>疏肝散结+化痰通络<br><strong>主方：</strong>橘核丸<br><strong>外治：</strong>冲和膏+温敷</p></div></div><div class=classic-quote>《外科证治全书》："子痈者，肾子作痈，溃后脓出，其肿渐消。"<span class=src>——《外科证治全书》</span></div><div class=plain>子痈就是睾丸或附睾发炎了——"子"指睾丸（肾子）+"痈"化脓感染。急性子痈睾丸肿得巨大红如番茄痛不能碰。慢性子痈附睾硬结不痛不痒。鉴别：子痈（化脓性）vs卵子瘟（腮腺炎并发睾丸炎+不化脓）。</p><div class=mnem><strong>口诀：</strong>子痈睾丸急慢分，急性红肿痛热深；龙胆泻肝清湿热，慢性硬结橘核丸。</div><div class=trap-box><strong>考点：</strong>1.急性子痈——龙胆泻肝汤（龙胆草栀子黄芩柴胡生地车前泽泻木通当归甘草）。2.慢性子痈——橘核丸（橘核海藻昆布川楝子桃仁厚朴实延胡索桂心）。3.子痈vs卵子瘟：化脓性vs病毒性（腮腺炎后）。4.外治：急性金黄膏+慢性冲和膏。5.鉴别睾丸扭转——扭转起病更急+睾丸抬高+提睾反射消失。</div><div class=clinical-case>一位28岁男性右侧睾丸肿大灼热疼痛+阴囊红肿+发热——急性子痈湿热下注用龙胆泻肝汤（龙胆草9g栀子9g黄芩9g柴胡9g生地15g车前草15g泽泻12g木通6g当归9g甘草6g）加银花15g连翘12g七剂后肿消。</div></div>',
cardQuiz:[{q:"急性子痈的主方是？",opts:["龙胆泻肝汤","橘核丸","逍遥散","知柏地黄丸"],ans:0},{q:"子痈和卵子瘟的关键鉴别是？",opts:["是否化脓","疼痛程度","部位","大小"],ans:0}]}]
},
  {name:"细目三：尿石症",points:[{id:"wk-11-3",name:"尿石症的病因病机、诊断及辨证论治",type:"apply",
content:'<p><strong>尿石症</strong>是泌尿系统结石的总称（肾结石+输尿管结石+膀胱结石+尿道结石）。特点：腰腹绞痛+血尿+排尿困难。</p><div class=compare-table><div class=ct-left><h4>辨证分型</h4><p><strong>湿热蕴结（初起）：</strong>突发腰腹绞痛+尿频尿急尿痛+血尿+苔黄腻<br>→ <strong>八正散</strong>清热利湿通淋</p><p><strong>气滞血瘀（结石停留）：</strong>腰腹胀痛固定不移+排尿涩痛+舌紫暗<br>→ <strong>金铃子散合失笑散</strong>行气活血排石</p><p><strong>肾气亏虚（久病）：</strong>结石日久+腰膝酸软+排尿无力<br>→ <strong>济生肾气丸</strong>补益肾气</p></div><div class=ct-right><h4>诊断与调护</h4><p><strong>典型表现：</strong>肾绞痛（腰腹阵发性剧烈绞痛向会阴放射）+血尿<br><strong>辅助检查：</strong>B超首选+KUB平片+CT<br><strong>调护：</strong>多饮水（每日2000-3000ml）+跳跃运动促排石</p></div></div><div class=classic-quote>《诸病源候论》："石淋者，淋而出石也。肾主水，水结则化为石，故肾客沙石。"<span class=src>——《诸病源候论》</span></div><div class=plain>尿石症就是身体里长了结石——尿液矿物质结晶形成。肾绞痛痛得死去活来——一阵阵的剧烈腰痛往大腿根放射。最常用八正散清热利湿通淋。排石关键：多喝水+运动+中药。结石>1cm或嵌顿严重考虑体外碎石或手术。</p><div class=mnem><strong>口诀：</strong>尿石绞痛腰腹痛，血尿淋沥痛难当；湿热八正清利通，气滞金铃失笑良；肾虚济生肾气丸，多水跳跃石自降。</div><div class=trap-box><strong>考点：</strong>1.湿热蕴结→八正散（萹蓄瞿麦车前滑石栀子木通大黄甘草）。2.肾绞痛：腰→腹部→会阴放射。3.血尿（绞痛后出现）。4.石淋属淋证范畴。5.调护：多饮水+跳跃运动。6.总则：清热利湿+通淋排石。</div></div>',
cardQuiz:[{q:"尿石症湿热蕴结型的主方是？",opts:["八正散","金铃子散","济生肾气丸","龙胆泻肝汤"],ans:0},{q:"肾绞痛的典型放射方向是？",opts:["向会阴放射","向背部放射","向胸部放射","向头部放射"],ans:0}]}]
},
  {name:"细目四：男性不育症",points:[{id:"wk-11-4",name:"男性不育症的病因病机、诊断方法及辨证论治",type:"apply",
content:'<p><strong>男性不育症</strong>是指夫妇同居未避孕1年以上+女方正常+因男方原因导致不孕。中医称"无子"。</p><div class=compare-table><div class=ct-left><h4>辨证分型</h4><p><strong>肾阳虚衰：</strong>精清精冷+性欲减退+腰膝酸软+畏寒肢冷→<strong>金匮肾气丸</strong></p><p><strong>肾阴不足：</strong>精少精稀+五心烦热+盗汗→<strong>五子衍宗丸合左归丸</strong></p><p><strong>肝郁气滞：</strong>精子质量下降+精神抑郁+胸胁胀痛→<strong>开郁种玉汤</strong></p><p><strong>湿热下注：</strong>精液不液化+小便黄赤+苔黄腻→<strong>龙胆泻肝汤</strong></p></div><div class=ct-right><h4>诊断与调护</h4><p><strong>精液常规：</strong>密度>15×10⁶/mL+活力（PR+NP）>40%+正常形态>4%<br><strong>调护：</strong>戒烟酒+避免高温+规律性生活</p></div></div><div class=classic-quote>《医宗必读》："无子之因，有肾虚精冷者，有湿热伤精者，有痰湿阻络者，有肝郁气滞者。"<span class=src>——《医宗必读》</span></div><div class=plain>男性不育就是男方原因怀不上孩子。最出名的助孕方"五子衍宗丸"——五种植物的种子以"子"补"子"（种子补精子）。精液检查是核心：看数量+活力+形态。生活最大杀手：抽烟+喝酒+桑拿（高温杀精）。</p><div class=mnem><strong>口诀：</strong>不育五型要记牢，肾阳金匮肾气好；阴虚五子左归妙，肝郁开郁种玉汤；湿热龙胆泻肝治，戒烟戒酒防桑澡。</div><div class=trap-box><strong>考点：</strong>1.诊断标准：同居1年未孕+女方正常。2.肾阳虚→金匮肾气丸+肾阴虚→五子衍宗丸合左归丸。3.五子衍宗丸（枸杞子菟丝子五味子覆盆子车前子）"以子补子"。4.精液检查前禁欲3-5天。5.开郁种玉汤源于傅青主女科+也用于男性肝郁不育。</div></div>',
cardQuiz:[{q:'五子衍宗丸以子补子的思路是补？',opts:["肾阴","肾阳","肝血","脾气"],ans:0},{q:"男性不育诊断标准中同居未孕时间？",opts:["1年","半年","2年","3年"],ans:0}]}]
},
  {name:"细目五：慢性前列腺炎",points:[{id:"wk-11-5",name:"慢性前列腺炎的病因病机、诊断及辨证论治",type:"apply",
content:'<p><strong>慢性前列腺炎</strong>是前列腺的慢性炎症。特点：尿频尿急尿痛+会阴坠胀+反复发作。好发于青壮年男性。</p><div class=compare-table><div class=ct-left><h4>辨证分型</h4><p><strong>湿热蕴结：</strong>尿频尿急尿痛+尿道灼热+苔黄腻→<strong>八正散</strong></p><p><strong>气滞血瘀：</strong>会阴睾丸坠胀刺痛+前列腺质硬结节+舌紫暗→<strong>少腹逐瘀汤</strong></p><p><strong>阴虚火旺：</strong>腰膝酸软+五心烦热+遗精+尿道口滴白→<strong>知柏地黄丸</strong></p><p><strong>肾阳虚损：</strong>腰膝酸冷+阳痿+尿频清长→<strong>金匮肾气丸</strong></p></div><div class=ct-right><h4>诊断与调护</h4><p><strong>直肠指检：</strong>前列腺压痛+可伴结节<br><strong>前列腺液：</strong>白细胞>10/HP+卵磷脂小体减少<br><strong>调护：</strong>忌久坐+忌辛辣+规律排精+温水坐浴</p></div></div><div class=classic-quote>《证治汇补》："浊病之因，有湿热下注者，有肾虚不固者，有痰瘀互结者。"<span class=src>——《证治汇补》</span></div><div class=plain>慢性前列腺炎是最常见的男科病——青壮年男性十个里三四个有。三大症状：尿频尿急尿痛+会阴不适+尿道口滴白。容易反复难断根。和前列腺增生区别：前者青壮年+后者老年。生活调理最重要：不久坐+不吃辣+规律排精。</p><div class=mnem><strong>口诀：</strong>慢性前列腺炎缠，湿热八正气滞少；阴虚知柏地黄丸，阳虚金匮肾气好；滴白会阴坠胀苦，忌辣忌久坐莫燥。</div><div class=trap-box><strong>高频考点：</strong>1.四型辨治：湿热→八正散+气滞血瘀→少腹逐瘀汤+阴虚火旺→知柏地黄丸+肾阳虚→金匮肾气丸。2.诊断关键：直肠指检+前列腺液白细胞>10/HP+卵磷脂小体减少。3.尿道口滴白是特征性症状。4.鉴别：慢性前列腺炎（青壮年+滴白）vs前列腺增生（老年+排尿困难）。5.急性前列腺炎禁用按摩+慢性可按摩。6.规律排精不可忍精。</div></div>',
cardQuiz:[{q:"慢性前列腺炎诊断中前列腺液白细胞>？",opts:["10/HP","5/HP","20/HP","50/HP"],ans:0},{q:"慢前与前列腺增生鉴别要点是？",opts:["发病年龄","有无疼痛","是否尿频","是否影响性功能"],ans:0}]}]
},
  {name:"细目六：前列腺增生症",points:[{id:"wk-11-6",name:"前列腺增生症的主要临床表现及辨证论治",type:"apply",
content:'<p><strong>前列腺增生症（BPH）</strong>是老年男性良性前列腺增生。特点：排尿困难+尿频+夜尿增多。中医称"精癃"。</p><div class=compare-table><div class=ct-left><h4>辨证分型</h4><p><strong>湿热下注：</strong>尿频尿急尿痛+排尿不畅+苔黄腻→<strong>八正散</strong></p><p><strong>气滞血瘀：</strong>排尿费力+尿细如线+会阴胀痛→<strong>代抵当汤</strong></p><p><strong>肾气亏虚：</strong>夜尿增多+排尿无力+腰膝酸软→<strong>济生肾气丸</strong></p></div><div class=ct-right><h4>临床表现与调护</h4><p><strong>症状分期：</strong>早期尿频夜尿增多+中期排尿费力尿线变细+晚期尿潴留<br><strong>调护：</strong>忌憋尿+忌受寒+忌饮酒+定期PSA</p></div></div><div class=classic-quote>《素问·宣明五气》："膀胱不利为癃，不约为遗尿。"<span class=src>——《黄帝内经》</span></div><div class=plain>前列腺增生就是老年男性的前列腺变大了——挤住尿道。表现：尿尿要等半天+尿线细如发丝+晚上起来好几趟。严重了尿不出来（尿潴留）需插尿管。和慢性前列腺炎区别：增生是老年病+排尿困难为主+前列腺炎是青壮年+疼痛刺激为主。</p><div class=mnem><strong>口诀：</strong>老年增生精癃名，湿热八正气滞代；肾虚济生肾气丸，排尿困难夜尿频。</div><div class=trap-box><strong>高频考点：</strong>1.三型辨治：湿热→八正散+气滞血瘀→代抵当汤+肾气亏虚→济生肾气丸。2.最典型症状：进行性排尿困难+尿线变细+夜尿增多。3.直肠指检：前列腺增大+中央沟变浅+表面光滑有弹性。4.鉴别：前列腺增生（光滑有弹性）vs前列腺癌（结节+质硬+PSA升高）。5.急性尿潴留→导尿术。6.IPSS评分评估。</div></div>',
cardQuiz:[{q:"前列腺增生的首发症状通常是？",opts:["夜尿增多","排尿困难","急性尿潴留","血尿"],ans:0},{q:"前列腺增生和前列腺癌的鉴别要点？",opts:["前列腺质地","年龄","排尿症状","尿频"],ans:0}]}]
}
]}'''

# Replace by index positions — add trailing comma to separate from next unit
after = c[:idx11] + UNIT11 + ',' + c[idx12:]

with open(TARGET, 'w', encoding='utf-8') as f:
    f.write(after)

print(f"Done. Size: {len(after)} bytes (was {len(c)} bytes)")
