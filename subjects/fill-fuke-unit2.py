#!/usr/bin/env python3
"""fill-fuke-unit2.py — 填充 s7 第二单元 妇科疾病的病因病机"""
TARGET = '/sessions/compassionate-hopeful-thompson/mnt/syllabus/subjects/s7-fuke.js'

with open(TARGET, 'r', encoding='utf-8') as f:
    c = f.read()

idx2 = c.find('{unit:"第二单元')
idx3 = c.find('{unit:"第三单元')

UNIT2 = r'''{unit:"第二单元 妇科疾病的病因病机",subunits:[
  {name:"细目一：病因",points:[{id:"fk-2x-1",name:"寒热湿邪、七情内伤、生活失度、体质因素",type:"detail",
content:'<p><strong>妇科致病因素：</strong>外感（寒热湿）+内伤（七情）+生活失度（饮食房劳）+体质因素。</p><div class=compare-table><div class=ct-left><h4>外感三邪</h4><p><strong>寒邪：</strong>经期产后+感受寒邪→血为寒凝+瘀滞不通<br>·实寒—经行腹痛+月经后期+量少色暗<br>·虚寒—小腹冷痛喜按+经迟色淡</p><p><strong>热邪：</strong>热扰冲任+迫血妄行<br>·实热—月经先期+量多+经色紫红+质稠<br>·虚热—月经先期+量少+经色鲜红+五心烦热</p><p><strong>湿邪：</strong>湿性重浊黏滞+易袭下焦<br>·湿热带下+经行浮肿+妊娠肿胀</p></div><div class=ct-right><h4>内伤及其他因素</h4><p><strong>七情内伤：</strong><br>怒伤肝→肝气郁结→月经不调+痛经<br>思伤脾→脾失健运→带下+经行泄泻<br>恐伤肾→肾气不固→胎漏+堕胎</p><p><strong>生活失度：</strong><br>·饮食不节→损伤脾胃+生湿生痰<br>·房劳多产→损伤肾气+耗伤精血<br>·劳逸失度→气血失调+脏腑功能失常</p><p><strong>体质因素：</strong><br>先天肾气不足+后天脾胃虚弱+素性抑郁等</p></div></div><div class=classic-quote>《妇人大全良方》："妇人以血为基本，苟能谨于调护，则气血充行，精神自守；若或失宜，则荣卫乖离，诸疾生焉。"<span class=src>——《妇人大全良方》</span></div><div class=plain>妇科的病因可以概括为"外寒热湿+内情志+生活失度+体质"。最特殊的点是：妇科病"寒热湿"最突出——因为女性生理核心是"血"（经孕产乳都以血为用）+寒则血凝+热则血妄行+湿则血浊。七情中"肝郁"最常见——肝藏血主疏泄+情志不畅直接影响月经。记住四个字："女子以血为本"。</p><div class=mnem><strong>口诀：</strong>外感寒热湿为多，内伤七情肝郁最；房劳多产伤肾气，饮食不节脾失和。</div><div class=trap-box><strong>考点：</strong>1.妇科外邪以"寒热湿"为主+不同于外科的"六淫"。2.寒凝血瘀→少腹逐瘀汤/温经汤（经行腹痛）。3.热迫血行→先期量多+用清经散/两地汤。4.湿邪下注→带下病+完带汤。5.七情以"怒伤肝"最常见——肝郁气滞→月经不调。6.房劳多产→最易伤肾。7."女子以血为本"——妇人良方总纲。</div></div>'}]
},
  {name:"细目二：病机",points:[{id:"fk-2x-2",name:"脏腑功能失常、气血失调、冲任督带损伤",type:"detail",
content:'<p><strong>妇科病机</strong>三层次：脏腑功能失常→气血失调→冲任督带损伤→胞宫病。</p><div class=compare-table><div class=ct-left><h4>脏腑功能失常</h4><p><strong>肾虚：</strong>肾精亏虚→月经迟发+闭经+不孕+胎漏<br>肾气不固→胎动不安+子宫脱垂<br>肾阳虚→宫寒不孕+带下清冷<br>肾阴虚→经少色暗+经断前后诸证</p><p><strong>肝失和调：</strong><br>肝郁气滞→经行乳房胀痛+月经先后无定期<br>肝郁化热→月经先期+经行吐衄<br>肝血不足→经少色淡+闭经</p><p><strong>脾失健运：</strong><br>脾虚失摄→月经先期+月经过多+崩漏<br>脾虚湿盛→带下+经行浮肿+泄泻</p></div><div class=ct-right><h4>气血失调与冲任损伤</h4><p><strong>气血失调：</strong><br>气虚→月经先期+量多+崩漏<br>气滞→痛经+经行乳胀<br>血虚→经少+经迟+闭经<br>血瘀→痛经+异位妊娠+癥瘕</p><p><strong>冲任督带损伤（核心病机！）：</strong><br>冲任不固→胎漏+崩漏+子宫脱垂<br>冲任失调→月经不调+不孕<br>任脉不固→带下+胎漏</p><p><strong>总病机：</strong>脏腑→气血→冲任→胞宫</p></div></div><div class=classic-quote>《妇人大全良方》："妇人病三十六种，皆由冲任劳损所致。"<span class=src>——《妇人大全良方》</span></div><div class=plain>妇科病机的核心链条：脏腑出问题（肝脾肾最常见）→气血失调（气滞血瘀气虚血虚）→冲任损伤（冲任不固/失调）→最后反映到胞宫。其中"冲任损伤"是妇科病机的关键——无论是脏腑还是气血的问题+最终都是通过冲任影响到胞宫。考试最爱问这句话："冲任督带"是妇科病机的中心环节。</p><div class=mnem><strong>口诀：</strong>脏腑气血到冲任，肾肝脾三脏最要；冲任不固崩漏起，任脉不固带下多。</div><div class=trap-box><strong>高频考点：</strong>1.妇科病机总链条：脏腑→气血→冲任→胞宫。2.肾在妇科的核心地位——"经本于肾""肾主生殖"。3.肝郁是妇科最常见病机（肝藏血+主疏泄+与情绪密切相关）。4."冲任损伤"是妇科病机的关键环节。5.气虚不摄→先期+崩漏；气滞→痛经+乳胀；血虚→闭经。6.脾虚→带下+泄泻——脾主运化水湿。</div></div>'}]
}
]},

'''

after = c[:idx2] + UNIT2 + c[idx3:]

with open(TARGET, 'w', encoding='utf-8') as f:
    f.write(after)

print(f"Done. Size: {len(after)} bytes (was {len(c)} bytes)")
