#!/usr/bin/env python3
"""fill-fuke-unit1.py — 填充 s7 第一单元 女性的生理特点"""
TARGET = '/sessions/compassionate-hopeful-thompson/mnt/syllabus/subjects/s7-fuke.js'

with open(TARGET, 'r', encoding='utf-8') as f:
    c = f.read()

idx1 = c.find('{unit:"第一单元')
idx2 = c.find('{unit:"第二单元')

UNIT1 = r'''{unit:"第一单元 女性的生理特点",subunits:[
  {name:"细目一：月经",points:[{id:"fk-1-1",name:"月经的生理表现及产生的机理（脏腑、天癸、气血、经络）",type:"detail",
content:'<p><strong>月经</strong>是女性周期性子宫出血的生理现象。初潮年龄约13-15岁+周期28天左右+经期3-7天+经量50-80ml+色暗红+不稀不稠+不凝固。绝经年龄约45-55岁。</p><div class=compare-table><div class=ct-left><h4>月经产生的四大要素</h4><p><strong>脏腑为根本：</strong><br>肾—藏精主生殖+天癸之源<br>肝—藏血主疏泄+调畅气机<br>脾—生化气血+统摄血液<br>心—主血脉+藏神明<br>肺—朝百脉+输布精微</p><p><strong>天癸为动力：</strong>肾气盛→天癸至→任通冲盛→月事以时下</p></div><div class=ct-right><h4>气血与经络</h4><p><strong>气血为物质基础：</strong><br>经血由气血所化生+血是月经的主要成分+气是月经的动力</p><p><strong>经络为通路：</strong><br>冲脉—"冲为血海"+通受十二经气血<br>任脉—"任主胞胎"+总任诸阴经<br>督脉—总督诸阳经+与任脉协调<br>带脉—约束诸经+固护胞胎</p></div></div><div class=classic-quote>《素问·上古天真论》："女子七岁，肾气盛，齿更发长。二七而天癸至，任脉通，太冲脉盛，月事以时下，故有子。"<span class=src>——《黄帝内经·素问》</span></div><div class=plain>月经产生的机理最简单的理解：肾气把"开关"（天癸）打开→冲任两条经脉气血充足→血海满了就月经来潮。就像一个蓄水池：肾是总阀门+天癸是开关+气血是水+冲脉是水池+任脉是水管。最关键的是"肾气-天癸-冲任-胞宫"这个轴——所有妇科病都离不开这个轴。</p><div class=mnem><strong>口诀：</strong>肾气天癸与冲任，气血调和经自顺；肾为根本肝为用，脾生气血心主运。</div><div class=trap-box><strong>高频考点：</strong>1.月经产生四要素：脏腑+天癸+气血+经络。2.最重要的原文——《素问·上古天真论》"二七而天癸至，任脉通，太冲脉盛，月事以时下"。3.肾在月经产生中起"主导"作用——肾藏精主生殖+天癸之源。4.冲为血海+任主胞胎——冲任二脉与月经最密切。5.月经的生理特点：28天周期+3-7天经期+50-80ml+暗红不凝。6.经期特点：经前乳房胀+经后轻松。</div></div>'}]
},
  {name:"细目二：妊娠与产育",points:[
    {id:"fk-1-2",name:"妊娠机理及妊娠期生理现象",type:"detail",
content:'<p><strong>妊娠机理：</strong>肾气充盛+天癸成熟+冲任通盛+男女之精结合→孕卵着床胞宫→成孕。</p><div class=compare-table><div class=ct-left><h4>妊娠生理现象</h4><p><strong>月经停止：</strong>受精后最早期信号<br><strong>早孕反应：</strong>孕6-12周+恶心晨吐+择食嗜酸<br><strong>乳房变化：</strong>孕8周后乳晕着色+乳房增大<br><strong>胎动：</strong>孕4-5个月后自觉胎动<br><strong>妊娠浮肿：</strong>后期轻度水肿+属生理性<br><strong>子宫增大：</strong>逐月增大+孕12周出盆腔</p></div><div class=ct-right><h4>逐月养胎</h4><p><strong>妊娠各月经脉养胎：</strong><br>1月肝养+2月胆养+3月心养<br>4月三焦养+5月脾养+6月胃养<br>7月肺养+8月大肠养+9月肾养<br>10月膀胱养+气纳三焦+待分娩</p><p>此说源于《逐月养胎法》+指导孕期用药选经</p></div></div><div class=classic-quote>《灵枢·本神》："故生之来谓之精，两精相搏谓之神。"<span class=src>——《黄帝内经》</span></div><div class=plain>怀孕就是肾精充足→天癸成熟→月经规律→男女精卵结合→着床发育。早期最重要的信号是"停经"但注意：并不是所有停经都是怀孕（也可能是月经病）。妊娠期最经典的养胎理论是"逐月养胎"——每个月有一条经脉负责滋养胎儿。这对指导妊娠用药有重要意义：某月某经当令+用药要顾及该经。</p><div class=mnem><strong>口诀：</strong>妊后经停乳晕深，早孕恶心食嗜酸；四月胎动感始见，逐月养胎一经贯。</div><div class=trap-box><strong>考点：</strong>1.妊娠早期信号：停经（最早期）+早孕反应（6-12周）。2.胎动感觉：孕4-5个月。3.预产期计算：末次月经月份-3或+9+日数+7（即月+9或-3+日+7）。4.逐月养胎：1肝2胆3心4三焦5脾6胃7肺8大肠9肾10膀胱。5.早孕反应不是病——轻者不需治疗+重者（妊娠恶阻）需治疗。</div></div>'},
    {id:"fk-1-3",name:"预产期的计算方法",type:"detail",
content:'<p><strong>预产期计算：</strong>末次月经第一天的日期+月份减3或加9+日数加7。例如：末次月经3月1日→3-3=12+（1+7=8）→同年12月8日。若月份≤3+加9（如2月→11月）。</p><div class=classic-quote>无直接经典原文+为现代产科推算方法。</div><div class=plain>预产期就是"月份-3（不够就+9）+日子+7"。很简单：最后一次月经来的第一天作为起点+月份往前推3个月（如5月→2月）+日子加7天。如果月份≤3月份不够减→改为加9（如2月→11月）。这只是估算+真正分娩可能在预产期前后2周内都算正常。</p><div class=mnem><strong>口诀：</strong>末次月经定预产，月份减三加九翻；日数加七算总日，前后两周皆正常。</div><div class=trap-box><strong>考点：</strong>1.公式：月-3（或+9）+日+7。2.月份≤3时加9（如1月→10月）。3.日子加7后可能进一位（如25+7=32→下月1日）。4.预产期前后2周分娩均属正常。5.这是考试计算题——必须会算！</div></div>'},
    {id:"fk-1-4",name:"恶露的概念及持续时间",type:"detail",
content:'<p><strong>恶露</strong>是产后由子宫排出的余血浊液。特点：有血腥味但不臭。持续3周左右（21天）。</p><div class=compare-table><div class=ct-left><h4>恶露分期</h4><p><strong>血性恶露（3-4天）：</strong>量多+色鲜红+含大量血液</p><p><strong>浆液性恶露（7-10天）：</strong>量渐少+色淡红+含少量血液+浆液多</p><p><strong>白色恶露（2-3周）：</strong>色白或淡黄+含白细胞+脱膜细胞</p></div><div class=ct-right><h4>异常恶露</h4><p><strong>持续时间>3周→恶露不绝</strong><br>色紫暗有块→血瘀<br>色红质稠味臭→热毒<br>色淡质稀量多→气虚</p></div></div><div class=classic-quote>《医宗金鉴》："产后恶露，乃裹儿污血，由胎衣破时，囊破血出。"<span class=src>——《医宗金鉴》</span></div><div class=plain>恶露就是产后子宫里排出的"垃圾"——血液坏死的蜕膜组织等。正常恶露有血腥味但不臭+持续3周左右。前面几天鲜红（血性）+中间变淡（浆液性）+最后白色（白恶露）。如果持续3周以上还淋漓不尽→就是产后恶露不绝+需要治疗。颜色气味异常也要警惕感染。</p><div class=mnem><strong>口诀：</strong>产后恶露三阶段，血性鲜红三四天；浆液七到十天淡，白色三周干净全。</div><div class=trap-box><strong>考点：</strong>1.恶露正常持续约3周（21天）。2.三阶段：血性（3-4天）→浆液性（7-10天）→白色（2-3周）。3.异常：超过3周→恶露不绝+有臭味→感染。4.恶露不绝三型：气虚+血瘀+热毒。5.恶露是生理现象+非病理。</div></div>'},
    {id:"fk-1-5",name:"哺乳期的最佳断乳时间",type:"detail",
content:'<p><strong>哺乳期最佳断乳时间：</strong>产后8个月（8个月至1岁）。哺乳对母婴均有益：促进子宫收缩+降低乳腺癌风险+天然免疫。</p><div class=compare-table><div class=ct-left><h4>哺乳期注意事项</h4><p><strong>最佳时间：</strong>产后8个月至1周岁断乳<br><strong>纯母乳喂养：</strong>6个月内<br><strong>添加辅食：</strong>6个月后逐渐添加<br><strong>断乳方法：</strong>循序渐进减少哺乳次数</p></div><div class=ct-right><h4>不通则用药</h4><p><strong>回乳方药：</strong><br>麦芽60-120g煎水代茶（生麦芽回乳效佳）</p><p><strong>哺乳禁忌：</strong><br>乳腺炎化脓期→暂停哺乳<br>服用某些药物→暂停哺乳</p></div></div><div class=classic-quote>《妇人大全良方》："产后宜哺乳，八月后则可断乳。"<span class=src>——《妇人大全良方》</span></div><div class=plain>产后哺乳一般建议到8个月到1岁。前6个月纯母乳最好+6个月后添辅食+8个月左右断乳。最经典的民间验方是"生麦芽60g煎水"回乳——一定要用生麦芽（炒麦芽反而催乳+很多考生搞混这！）。断乳不能太急+要循序渐进减少喂奶次数+配合饮食调整。</p><div class=mnem><strong>口诀：</strong>哺乳八个月最宜，纯乳半岁添辅食；断乳麦芽六十克，生用回乳炒用催。</div><div class=trap-box><strong>考点：</strong>1.最佳断乳时间——产后8个月。2.生麦芽回乳+炒麦芽催乳——一字之差效果相反！必考！3.回乳方：生麦芽60-120g煎水代茶。4.哺乳对母体益处：促子宫恢复+降乳腺癌风险。5.乳腺炎化脓→暂停哺乳。</div></div>'}
  ]}
]},

'''

after = c[:idx1] + UNIT1 + c[idx2:]

with open(TARGET, 'w', encoding='utf-8') as f:
    f.write(after)

print(f"Done. Size: {len(after)} bytes (was {len(c)} bytes)")
