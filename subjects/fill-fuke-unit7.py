#!/usr/bin/env python3
"""fill-fuke-unit7.py — 填充 s7 第七单元 妇科杂病"""
TARGET = '/sessions/compassionate-hopeful-thompson/mnt/syllabus/subjects/s7-fuke.js'

with open(TARGET, 'r', encoding='utf-8') as f:
    c = f.read()

idx7 = c.find('{unit:"第七单元')
idxq = c.find('var Q7 = [')

# UNIT7 ends with ]} (subunits + unit). Script adds ]}; to close S7.units + S7.
UNIT7 = r'''{unit:"第七单元 妇科杂病",subunits:[
  {name:"细目一：概述",points:[{id:"fk-6-0",name:"妇科杂病的定义、范围及治法概要",type:"concept",
content:'<p><strong>妇科杂病</strong>是除外经带胎产之外+与女性生理病理特点密切相关的疾病。范围包括：癥瘕+盆腔炎+不孕症+阴痒+子宫脱垂等。</p><div class=compare-table><div class=ct-left><h4>治疗原则</h4><p>总则：辨证论治+结合女性生理特点</p><p>癥瘕→化瘀散结+攻补兼施<br>盆腔炎→清热利湿+化瘀通络<br>不孕症→补肾疏肝+调理冲任<br>阴痒→清热利湿+杀虫止痒<br>子宫脱垂→益气升提+补肾固脱</p></div><div class=ct-right><h4>病机特点</h4><p>妇科杂病多与以下相关：<br>·肝郁气滞（情志不畅）<br>·肾虚精亏（先天不足+房劳多产）<br>·湿热瘀毒（感染+经期不洁）<br>·痰湿凝结（肥胖+代谢紊乱）</p><p>注意：杂病≠杂症+各有专方专药</p></div></div><div class=classic-quote>《妇人大全良方》："妇人杂病+与男子同+唯经带胎产为异。"<span class=src>——《妇人大全良方》</span></div><div class=plain>妇科杂病就是"除经带胎产以外的妇科病"。其实很多"杂病"在今天看来很常见——子宫肌瘤（癥瘕）+盆腔炎+不孕+子宫脱垂。这些病虽然"杂"但有一个共同点：都与"血"和"气"有关（血瘀+气滞+气虚+湿热）。</p><div class=mnem><strong>口诀：</strong>杂病癥瘕盆腔炎，不孕阴痒子宫垂；血瘀湿热肾虚多，辨证论治治各随。</div></div>'}]
},
  {name:"细目二：癥瘕",points:[{id:"fk-6-1",name:"癥瘕的定义及辨证论治",type:"apply",
content:'<p><strong>癥瘕</strong>是妇女下腹部有结块+或胀+或满+或痛。癥者坚硬不移+痛有定处+属血分（有形）；瘕者假聚推之可动+痛无定处+属气分（无形）。合称癥瘕+相当于盆腔包块（子宫肌瘤+卵巢囊肿等）。</p><div class=compare-table><div class=ct-left><h4>辨证分型</h4><p><strong>气滞：</strong>小腹胀满+积块不坚+推之可移+时聚时散+痛无定处+胸胁胀满<br>→ <strong>香棱丸</strong>行气活血+散结消癥</p><p><strong>血瘀：</strong>下腹积块坚硬+固定不移+刺痛+肌肤甲错+月经量多有块+舌紫暗<br>→ <strong>桂枝茯苓丸</strong>活血化瘀+消癥散结</p><p><strong>痰湿：</strong>下腹包块+时或作痛+按之柔软+带多+体胖+胸闷+苔白腻<br>→ <strong>苍附导痰丸</strong>合<strong>桂枝茯苓丸</strong></p></div><div class=ct-right><h4>癥瘕鉴别</h4><p><strong>癥vs瘕</strong><br>癥：有形+坚硬+固定+刺痛+血分<br>瘕：无形+柔软+移动+胀痛+气分</p><p>需排除：妊娠子宫+异位妊娠+卵巢囊肿蒂扭转+恶性肿瘤</p><p>最常用方：桂枝茯苓丸——化瘀消癥第一方</p></div></div><div class=classic-quote>《金匮要略》："妇人宿有癥病+经断未及三月+而得漏下不止+胎动在脐上者+此为癥痼害……当下其癥+桂枝茯苓丸主之。"<span class=src>——《金匮要略》</span></div><div class=plain>癥瘕就是肚子里有"疙瘩"——硬疙瘩推不动（癥+血分/实）+软疙瘩时有时无（瘕+气分/虚）。最出名的方是桂枝茯苓丸（桂枝茯苓丹皮桃仁芍药）——是治子宫肌瘤（癥瘕）的千年古方。桂枝茯苓丸的要点：化瘀而不破+缓消癥块。</p><div class=mnem><strong>口诀：</strong>癥瘕包块气血分，癥坚瘕移要辨清；气滞香棱血瘀桂苓+痰湿苍附导痰桂苓。</div><div class=trap-box><strong>高频考点：</strong>1.癥——有形固定+血分+实证+癥瘕（需区分）。2.瘕——无形移动+气分+虚证。3.气滞→香棱丸（木香丁香三棱莪术枳壳青皮川楝子小茴香）。4.血瘀→桂枝茯苓丸（桂枝茯苓丹皮桃仁芍药）。5.痰湿→苍附导痰丸合桂枝茯苓丸。6.治疗癥瘕注意：攻补兼施+不可过于攻伐（尤其是久病体虚者）。</div></div>'}
  ]},
  {name:"细目三：盆腔炎",points:[{id:"fk-6-2",name:"急慢性盆腔炎的定义及辨证论治",type:"apply",
content:'<p><strong>盆腔炎</strong>是女性上生殖道感染性疾病（子宫内膜炎+输卵管炎+卵巢炎+盆腔腹膜炎）。分急性+慢性两种。</p><div class=compare-table><div class=ct-left><h4>急性盆腔炎</h4><p><strong>热毒炽盛：</strong>高热寒战+下腹剧痛拒按+带下黄稠臭秽+口干+苔黄燥<br>→ <strong>五味消毒饮</strong>合<strong>大黄牡丹汤</strong></p><p><strong>湿热瘀结：</strong>低热起伏+下腹疼痛拒按+带下黄稠+苔黄腻<br>→ <strong>仙方活命饮</strong></p><p>急性盆腔炎需联合抗生素治疗！</p></div><div class=ct-right><h4>慢性盆腔炎</h4><p><strong>湿热瘀结：</strong>下腹隐痛+带下黄稠+低热+劳累加重+苔黄腻<br>→ <strong>银甲丸</strong></p><p><strong>气滞血瘀：</strong>下腹胀痛刺痛+经前加重+乳房胀痛+舌紫暗<br>→ <strong>膈下逐瘀汤</strong></p><p><strong>寒湿凝滞：</strong>小腹冷痛+得热减轻+月经后期+畏寒<br>→ <strong>少腹逐瘀汤</strong></p></div></div><div class=classic-quote>《医宗金鉴》："妇人腹中瘀血+结块作痛+宜化瘀消癥。"<span class=src>——《医宗金鉴》</span></div><div class=plain>盆腔炎就是女性"盆腔里发炎"了——急性盆腔炎像"热毒爆发"（高热剧痛）+慢性盆腔炎像"反复发作的闷痛"。急性盆腔炎是妇科急症+需要中西医结合（抗生素+中药）。慢性盆腔炎容易反复发作+治疗周期长+常用中药（银甲丸+少腹逐瘀汤+膈下逐瘀汤）。</p><div class=mnem><strong>口诀：</strong>盆腔炎急慢分，急性热毒五味大黄+湿热仙方活命饮；慢性湿热银甲丸+气滞膈下逐瘀+寒凝少腹逐瘀。</div><div class=trap-box><strong>考点：</strong>1.急性热毒→五味消毒饮合大黄牡丹汤。2.急性湿热→仙方活命饮（外痈方+也可用于盆腔炎）。3.慢性湿热→银甲丸（银花连翘蒲公英+鳖甲+红藤地丁蒲黄等）。4.慢性气滞血瘀→膈下逐瘀汤。5.慢性寒湿→少腹逐瘀汤。6.慢性盆腔炎可配合中药灌肠（局部给药）。</div></div>'}
  ]},
  {name:"细目四：不孕症",points:[{id:"fk-6-3",name:"不孕症的定义及辨证论治",type:"apply",
content:'<p><strong>不孕症</strong>是女子婚后（或性生活正常）未避孕+同居1年以上未受孕。原发性不孕（从未妊娠）+继发性不孕（曾妊娠+后1年未再受孕）。</p><div class=compare-table><div class=ct-left><h4>辨证分型</h4><p><strong>肾虚：</strong>婚久不孕+月经不调+腰膝酸软+头晕耳鸣<br>→ <strong>毓麟珠</strong>补肾益精+调理冲任</p><p><strong>肝郁：</strong>婚久不孕+月经先后不定+经前乳胀+胸胁不舒+抑郁易怒<br>→ <strong>开郁种玉汤</strong>疏肝解郁+理血调经</p><p><strong>痰湿：</strong>婚久不孕+形体肥胖+月经后期+带多+胸闷呕恶+苔白腻<br>→ <strong>苍附导痰丸</strong>燥湿化痰+理气调经</p><p><strong>血瘀：</strong>婚久不孕+月经后期量少有块+小腹刺痛+胸胁胀满<br>→ <strong>少腹逐瘀汤</strong></p></div><div class=ct-right><h4>不孕检查要点</h4><p>男方精液常规（必须先查！）</p><p>女方：<br>·卵巢功能（排卵监测+性激素）<br>·输卵管通畅（造影）<br>·子宫（B超+宫腔镜）<br>·免疫因素（抗体）</p><p>注意：不孕是夫妻双方的事+男方检查简单无创+应先查！</p></div></div><div class=classic-quote>《女科证治准绳》："妇人无子+当审其因+或血虚+或肾虚+或痰湿+或肝郁+或血瘀+或湿热+各因证调治。"<span class=src>——《女科证治准绳》</span></div><div class=plain>不孕症就是"怀不上"。中医治疗不孕四大方：毓麟珠（肾虚——最常用——补益肾精）+开郁种玉汤（肝郁——傅青主方——疏肝解郁）+苍附导痰丸（痰湿——肥胖不孕）+少腹逐瘀汤（血瘀——子宫内膜异位症等）。注意：男方检查（精液常规）一定要先查！很多不孕是男方问题+简单便宜无创。</p><div class=mnem><strong>口诀：</strong>不孕四型肾毓麟+肝郁开郁+痰湿苍附+血瘀少腹逐瘀。</div><div class=trap-box><strong>高频考点：</strong>1.肾虚→毓麟珠（参术苓草归芎芍地+菟丝杜仲鹿角霜川椒）。2.肝郁→开郁种玉汤（当归白芍白术茯苓丹皮花粉香附）。3.痰湿→苍附导痰丸。4.血瘀→少腹逐瘀汤。5.男方精液常规是检查第一步——必考！6.原发性不孕=从未妊娠+继发性=曾妊娠后未再孕。</div></div>'},
    {id:"fk-6-3a",name:"毓麟珠的药物组成",type:"detail",
content:'<p><strong>毓麟珠（景岳全书）：</strong>人参+白术+茯苓+甘草+当归+川芎+白芍+熟地+菟丝子+杜仲+鹿角霜+川椒。</p><div class=compare-table><div class=ct-left><h4>组方分析</h4><p>毓麟珠=八珍汤（补气血）+菟丝子杜仲鹿角霜（补肾精）+川椒（温阳散寒）</p><p>八珍——补气血以养冲任<br>菟丝杜仲鹿角霜——补肾益精<br>川椒——温阳散寒+促受孕</p></div><div class=ct-right><h4>记忆要点</h4><p>毓麟珠=八珍+菟丝杜仲鹿角霜+川椒</p><p>八珍（参术苓草归芎芍地）<br>+菟丝子+杜仲+鹿角霜+川椒</p><p>特点：补气血以治本+调冲任以助孕+"育麟"意为生育麟儿</p></div></div><div class=classic-quote>《景岳全书》："治妇人气血俱虚+经脉不调+或断续不来+或崩漏不止+或带下+或身弱不孕。"<span class=src>——《景岳全书》</span></div></div>'}
  ]},
  {name:"细目五：阴痒",points:[{id:"fk-6-4",name:"阴痒的定义及辨证论治",type:"apply",
content:'<p><strong>阴痒</strong>是女性外阴及阴道瘙痒+甚则痒痛难忍+坐卧不宁+可伴带下异常。</p><div class=compare-table><div class=ct-left><h4>辨证分型</h4><p><strong>肝经湿热：</strong>阴部瘙痒灼痛+带下量多色黄质稠+有臭味+心烦易怒+口苦+苔黄腻+小便黄<br>→ <strong>龙胆泻肝汤</strong></p><p><strong>肝肾阴虚：</strong>阴部干涩瘙痒+灼热感+带下量少色黄+五心烦热+头晕+腰酸+口干<br>→ <strong>知柏地黄丸</strong></p></div><div class=ct-right><h4>外治法</h4><p><strong>熏洗：</strong>蛇床子散（蛇床子花椒明矾百部苦参）</p><p><strong>坐浴：</strong>苦参汤（苦参蛇床子白芷银花黄柏地肤子菖蒲）</p><p><strong>阴道纳药：</strong>中药栓剂（保妇康栓等）</p><p>注意：阴痒最常见原因是滴虫+霉菌感染+需结合白带化验+必要时西药抗真菌/滴虫</p></div></div><div class=classic-quote>《医宗金鉴》："妇人阴痒+多因湿热生虫+甚则肢倦+不寐+经水不调+食少+胸膈不利。"<span class=src>——《医宗金鉴》</span></div><div class=plain>阴痒就是"下面痒"——最常见的原因是霉菌（白色念珠菌）+滴虫。中医说"湿热生虫"+湿热环境容易滋生滴虫霉菌。肝经湿热型（带多色黄+痒+龙胆泻肝汤）和肝肾阴虚型（干涩痒+知柏地黄丸）。外用药更重要——蛇床子散熏洗。注意：如果霉菌或滴虫感染明确+用西药栓剂效果更直接。</p><div class=mnem><strong>口诀：</strong>阴痒肝经湿热龙胆+肝肾阴虚知柏丸；外洗蛇床子苦参+内外兼治痒自安。</div><div class=trap-box><strong>考点：</strong>1.肝经湿热→龙胆泻肝汤（清肝胆+利湿热）。2.肝肾阴虚→知柏地黄丸。3.外治→蛇床子散/苦参汤熏洗。4.最常见病因——滴虫+霉菌+需查白带常规。5.注意：阴痒久治不愈+需查血糖（糖尿病可致顽固性阴痒）。6.阴痒与糖尿病的关系——反复阴痒需查血糖。</div></div>'}
  ]},
  {name:"细目六：子宫脱垂",points:[{id:"fk-6-5",name:"子宫脱垂的定义及辨证论治",type:"apply",
content:'<p><strong>子宫脱垂</strong>是子宫从正常位置沿阴道下降+宫颈外口达坐骨棘水平以下+甚至子宫全部脱出阴道口外。中医称"阴挺"或"阴脱"。</p><div class=compare-table><div class=ct-left><h4>辨证分型</h4><p><strong>气虚：</strong>子宫下移或脱出+劳则加重+小腹下坠+神疲+气短+面色无华+带多质稀<br>→ <strong>补中益气汤</strong>补气升提</p><p><strong>肾虚：</strong>子宫脱出+腰膝酸软+小腹下坠+小便频数+头晕耳鸣<br>→ <strong>大补元煎</strong>合<strong>黄芪当归散</strong></p></div><div class=ct-right><h4>分度与调护</h4><p><strong>分度：</strong><br>I度：宫颈距处女膜<4cm<br>II度：宫颈脱出阴道口+宫体尚在<br>III度：宫颈+宫体完全脱出</p><p>注意避免：<br>·长期站立+负重+咳嗽+便秘<br>·产后过早体力劳动</p><p>可配合：盆腔康复训练（Kegel运动）</p></div></div><div class=classic-quote>《医宗金鉴》："妇人阴挺+或因胞络伤损+或因分娩用力太过+或因气虚下陷+或因湿热下注。"<span class=src>——《医宗金鉴》</span></div><div class=plain>子宫脱垂就是"子宫掉下来了"。最常见于产后过早干重活（气提不住往下掉）。中医叫"阴挺"——"挺"就是"挺出"的意思。补中益气汤是治子宫脱垂的第一方——"补中"就是补中焦之气+"益气"就是让气提上去把子宫拉回来。严重的（III度）需要手术。</p><div class=mnem><strong>口诀：</strong>子宫脱垂阴挺名，气虚补中益气升；肾虚大补元煎用，重症手术难自行。</div><div class=trap-box><strong>考点：</strong>1.气虚→补中益气汤（黄芪人参白术当归陈皮升麻柴胡甘草）——升阳举陷。2.肾虚→大补元煎合黄芪当归散。3."阴挺"即子宫脱垂。4.预防：产后避免过早体力劳动+避免长期站立。5.分度：I度（宫颈低）+II度（宫颈出）+III度（全脱出）。6.III度脱垂需手术治疗。</div></div>'}
  ]}
]}'''

# UNIT7 ends with ]} (subunits+unit). Need also ]}; for S7.units + S7 var.
# Replace the old unit 7 block (which ends with ]};\n\nvar Q7)
# Note: the old content from idx7 to idxq includes ]};\n\n
# So we just replace idx7..idxq with UNIT7, then close S7
after = c[:idx7] + UNIT7 + ']};' + c[idxq:]

with open(TARGET, 'w', encoding='utf-8') as f:
    f.write(after)

print(f"Done. Size: {len(after)} bytes (was {len(c)} bytes)")
