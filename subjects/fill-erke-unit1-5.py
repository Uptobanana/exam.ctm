#!/usr/bin/env python3
"""fill-erke-unit1-5.py — 填充 s8 第一~五单元（总论+基础）"""
TARGET = '/sessions/compassionate-hopeful-thompson/mnt/syllabus/subjects/s8-erke.js'

with open(TARGET, 'r', encoding='utf-8') as f:
    c = f.read()

idx1 = c.find('{unit:"第一单元')
idx2 = c.find('{unit:"第二单元')
idx3 = c.find('{unit:"第三单元')
idx4 = c.find('{unit:"第四单元')
idx5 = c.find('{unit:"第五单元')
idx6 = c.find('{unit:"第六单元')

# --- UNIT 1 ---
UNIT1 = r'''{unit:"第一单元 小儿生长发育",subunits:[
  {name:"细目一：年龄分期",points:[{id:"ek-1-1",name:"年龄分期的标准",type:"detail",
content:'<p><strong>小儿年龄分期标准：</strong></p><div class=compare-table><div class=ct-left><h4>各期划分</h4><p><strong>胎儿期：</strong>受孕~分娩（40周）<br>·养胎护胎+预防先天性疾病</p><p><strong>新生儿期：</strong>出生~28天<br>·适应环境+发病率死亡率最高<br>·胎黄+脐风+脐湿等</p><p><strong>婴儿期（乳儿期）：</strong>28天~1周岁<br>·生长发育第一高峰+易消化不良</p><p><strong>幼儿期：</strong>1~3周岁<br>·断乳+传染病发病率高+意外多</p><p><strong>学龄前期：</strong>3~7周岁<br>·智力发育快+易患免疫性疾病</p></div><div class=ct-right><h4>各期补充</h4><p><strong>学龄期：</strong>7~青春期前<br>·发病率降低+近视+龋齿+心理问题</p><p><strong>青春期：</strong>女11-12~17-18岁+男13-14~18-20岁<br>·生长发育第二高峰+性发育成熟</p><p>注意：年龄分期与发病特点密切相关——不同期有不同高发疾病</p></div></div><div class=classic-quote>《小儿药证直诀》："小儿五脏六腑，成而未全，全而未壮。"<span class=src>——《小儿药证直诀》</span></div><div class=plain>小儿年龄分七期：胎儿→新生儿→婴儿→幼儿→学龄前→学龄→青春期。每个阶段有不同特点：新生儿期最难带（发病率死亡率最高）+婴儿期长得最快（第一生长高峰）+青春期又猛长（第二高峰）。记住两大高峰：婴儿期（1岁内）+青春期。</p><div class=mnem><strong>口诀：</strong>胎新婴幼学龄前，学龄青春两高峰；新生婴儿多感染，幼儿意外要防中。</div></div>'}]
},
  {name:"细目二：生理常数",points:[
    {id:"ek-1-2",name:"体重正常值及临床意义",type:"detail",
content:'<p><strong>体重计算公式：</strong></p><div class=compare-table><div class=ct-left><h4>正常体重推算</h4><p><strong>出生：</strong>约3kg（2.5-4kg）<br><strong>1-6个月：</strong>体重(kg)=出生体重+月龄×0.7<br><strong>7-12个月：</strong>体重(kg)=6+月龄×0.25<br><strong>2岁~青春期前：</strong>体重(kg)=年龄×2+8</p><p><strong>生理性体重下降：</strong>出生后3-4天+下降3-9%+7-10天恢复</p></div><div class=ct-right><h4>临床意义</h4><p>·体重<正常均值±2SD→异常<br>·体重增长过快→肥胖症<br>·体重不增或下降→营养不良+慢性疾病</p><p><strong>体重翻倍/三倍时间：</strong><br>3~5个月→出生体重的2倍<br>1岁时→出生体重的3倍<br>2岁时→出生体重的4倍</p></div></div><div class=plain>小儿体重是判断生长发育和营养状况最重要的指标。记住公式：出生3kg+前半年每月长0.7kg+后半年每月长0.25kg+2岁后每年长2kg。简单记"3-6-9-12"：3个月约6kg+1岁约9kg+2岁约12kg。</p><div class=mnem><strong>口诀：</strong>出生三公斤，半岁翻一番，一岁三倍整，两岁四倍算。</div><div class=trap-box><strong>高频考点：</strong>1.出生体重约3kg。2.1-6个月公式：体重=出生体重+月龄×0.7。3.7-12个月公式：体重=6+月龄×0.25。4.2岁以上公式：体重=年龄×2+8。5.体重翻倍：3-5个月2倍+1岁3倍+2岁4倍。6.生理性体重下降：3-4天+降3-9%。</div></div>'},
    {id:"ek-1-3",name:"身长测定方法及正常值",type:"detail",
content:'<p><strong>身长（身高）正常值：</strong></p><div class=compare-table><div class=ct-left><h4>正常值推算</h4><p><strong>出生：</strong>约50cm<br><strong>1岁：</strong>约75cm（增长50%）<br><strong>2岁：</strong>约85cm<br><strong>2岁~青春期前：</strong>身高(cm)=年龄×7+75</p></div><div class=ct-right><h4>增长规律</h4><p>·第一年增长最快→25cm（0-3月约12cm）<br>·第二年增长约10cm<br>·2岁后至青春期前→每年增长5-7cm</p><p>身长是反映骨骼发育的重要指标<br>>出生50cm+1岁75cm+2岁85cm+公式</p></div></div><div class=plain>身长（身高）主要反映骨骼发育。记住三个关键数：出生50cm+1岁75cm+2岁85cm。第一年长得最快（25cm）+第二年10cm+之后每年5-7cm。</p><div class=mnem><strong>口诀：</strong>生五十，一七五，二八五，三后每年五到七。</div><div class=trap-box><strong>考点：</strong>1.出生身长约50cm。2.1岁约75cm（第一年长25cm）。3.2岁约85cm。4.2岁后公式：身高=年龄×7+75。5.身长增长速度：第一年>第二年>青春期前。</div></div>'},
    {id:"ek-1-4",name:"囟门闭合时间及病理意义",type:"detail",
content:'<p><strong>囟门</strong>是婴幼儿颅骨未闭合的间隙。前囟+后囟。</p><div class=compare-table><div class=ct-left><h4>囟门闭合时间</h4><p><strong>前囟：</strong>出生时约1.5-2cm×1.5-2cm<br>→12-18个月闭合（最晚24个月）</p><p><strong>后囟：</strong>出生时很小或已闭<br>→最迟出生后2-4个月闭合</p></div><div class=ct-right><h4>病理意义</h4><p><strong>前囟早闭/过小：</strong>小头畸形+脑发育不良</p><p><strong>前囟迟闭/过大：</strong>佝偻病（最常见）+呆小症+脑积水</p><p><strong>前囟饱满：</strong>颅内压增高（脑炎+脑膜炎）</p><p><strong>前囟凹陷：</strong>脱水（严重腹泻+呕吐）</p></div></div><div class=classic-quote>《小儿药证直诀》："囟填囟陷，各有所因。囟填者，肺热也；囟陷者，肺虚也。"<span class=src>——《小儿药证直诀》</span></div><div class=plain>囟门就是婴儿头顶上软软的那个地方（摸得到跳动）。前囟12-18个月闭合——如果太早闭合（<6个月）可能小头畸形+太晚闭合（>2岁）可能是缺钙（佝偻病）。囟门鼓起来（饱满）→颅内压高+囟门凹陷→脱水。看囟门是儿科望诊的重要内容。</p><div class=mnem><strong>口诀：</strong>前囟1岁半闭合，后囟2月已长合；早闭头小晚佝偻，饱满高压陷脱水。</div><div class=trap-box><strong>高频考点：</strong>1.前囟12-18个月闭合（最晚24个月）。2.后囟2-4个月闭合。3.前囟迟闭最常见原因——佝偻病（维生素D缺乏）。4.前囟饱满——颅内压增高（脑炎+脑膜炎）。5.前囟凹陷——脱水。6.前囟出生时约1.5-2cm。</div></div>'},
    {id:"ek-1-5",name:"乳牙萌出正常值",type:"detail",
content:'<p><strong>乳牙萌出：</strong>生后4-10个月开始出牙。最晚2-2.5岁出齐（共20颗）。2岁以下乳牙数≈月龄-4（或6）。</p><div class=compare-table><div class=ct-left><h4>出牙规律</h4><p><strong>萌出时间：</strong>4-10个月（最早）<br><strong>顺序：</strong>下中切牙→上中切牙→上侧切牙→下侧切牙→第一磨牙→尖牙→第二磨牙</p><p><strong>出齐：</strong>2-2.5岁（20颗乳牙）</p><p><strong>换牙：</strong>6岁开始换恒牙</p></div><div class=ct-right><h4>临床意义</h4><p><strong>出牙迟：</strong>>12个月仍未出牙→佝偻病+呆小症+营养不良</p><p><strong>出牙顺序紊乱：</strong>可能是先天性疾病</p><p><strong>乳牙数公式：</strong>乳牙数=月龄-4（或-6）</p></div></div><div class=plain>乳牙就是"奶牙"。记住"4-10"个月开始出牙+最晚2岁半出齐20颗。简单的公式算乳牙数：月龄减4。比如8个月的宝宝→8-4=4颗牙。出牙太晚（>1岁）最常见的原因是缺钙。</p><div class=mnem><strong>口诀：</strong>4-10月乳牙萌，2岁半齐二十颗；牙数月龄减四算，出牙过晚佝偻多。</div></div>'},
    {id:"ek-1-6",name:"呼吸、脉搏、血压与年龄增长的关系",type:"detail",
content:'<p><strong>小儿呼吸+脉搏+血压随年龄变化规律：</strong>年龄越小呼吸脉搏越快+血压越低。</p><div class=compare-table><div class=ct-left><h4>呼吸与脉搏</h4><p><strong>新生儿：</strong>呼吸40-45次/分+脉搏120-140次/分<br><strong>1岁：</strong>呼吸30-40次/分+脉搏110-130次/分<br><strong>3岁：</strong>呼吸25-30次/分+脉搏100-120次/分<br><strong>7岁：</strong>呼吸20-25次/分+脉搏80-100次/分<br><strong>14岁：</strong>呼吸18-20次/分+脉搏70-90次/分</p><p>呼吸脉搏比：新生儿1:3+以后约1:4</p></div><div class=ct-right><h4>血压</h4><p><strong>收缩压(mmHg)=80+年龄×2</strong><br><strong>舒张压=收缩压×2/3</strong></p><p>新生儿收缩压约60-70mmHg<br>1岁约70-80mmHg<br>5岁约90mmHg<br>10岁约100mmHg<br>14岁约110mmHg</p></div></div><div class=plain>小儿生理特点是"三快"：呼吸快+脉搏快+代谢快。年龄越小越快——新生儿呼吸像小狗狗（40-45次/分）+到14岁接近成人。血压公式"80+年龄×2"必须记住。记住一个规律：年龄↓→呼吸脉搏↑→血压↓。</p><div class=mnem><strong>口诀：</strong>小儿脉速年龄反，新生120老年缓；血压公式八十加二倍年龄，舒张收缩三分之二乘。</div><div class=trap-box><strong>考点：</strong>1.年龄越小呼吸脉搏越快+血压越低。2.呼吸脉搏比新生儿1:3+以后约1:4。3.收缩压公式：80+年龄×2。4.舒张压=收缩压×2/3。5.新生儿血压约60-70/40-50mmHg。</div></div>'},
    {id:"ek-1-7",name:"动作发育、语言发育要点",type:"detail",
content:'<p><strong>小儿动作+语言发育规律：</strong></p><div class=compare-table><div class=ct-left><h4>动作发育"二抬四翻六会坐"</h4><p><strong>2个月：</strong>抬头<br><strong>4个月：</strong>翻身<br><strong>6个月：</strong>会坐<br><strong>8个月：</strong>会爬<br><strong>10个月：</strong>扶站<br><strong>12个月：</strong>独走</p><p>动作发育口诀："二抬四翻六会坐，七滚八爬周会走"</p></div><div class=ct-right><h4>语言发育</h4><p><strong>2-3个月：</strong>发出喉音（啊+哦）<br><strong>5-6个月：</strong>无意识叫"ba""ma"<br><strong>8-9个月：</strong>模仿发音<br><strong>1岁：</strong>有意识叫"爸爸""妈妈"<br><strong>2岁：</strong>说简单句子<br><strong>3岁：</strong>唱歌+说短故事</p></div></div><div class=classic-quote>《小儿药证直诀》："小儿母腹中时，全赖母血以养；既生之后，全赖乳食以养。"<span class=src>——《小儿药证直诀》</span></div><div class=plain>小儿动作发育口诀"二抬四翻六会坐，七滚八爬周会走"是必背！语言发育记住"1岁叫爸妈+2岁说句子"。这些发育里程碑可以帮助判断发育迟缓——如果到相应月份还做不到就要警惕。</p><div class=mnem><strong>口诀：</strong>二抬四翻六会坐，七滚八爬周会走；一岁爸妈两岁句，三岁歌谣脱口出。</div><div class=trap-box><strong>高频考点：</strong>1.动作发育口诀——"二抬四翻六会坐，七滚八爬周会走"。2.1岁有意识叫爸妈。3.2岁说简单句子。4.粗大运动发育顺序：抬头→翻身→坐→爬→站→走。5.发育迟缓的判断——比正常延迟2个月以上。</div></div>'}
  ]}
]},

'''

after = c[:idx1] + UNIT1 + c[idx2:]

# --- UNIT 2 ---
idx2_new = after.find('{unit:"第二单元')
idx3_new = after.find('{unit:"第三单元')

UNIT2 = r'''{unit:"第二单元 小儿生理病因病理特点",subunits:[
  {name:"细目一：生理特点",points:[{id:"ek-2-1",name:'小儿生理的基本特点及"稚阴稚阳""纯阳"学说的意义',type:"concept",
content:'<p><strong>小儿两大生理特点：</strong></p><div class=compare-table><div class=ct-left><h4>"稚阴稚阳"</h4><p>含义：小儿脏腑娇嫩+形气未充——无论物质基础（阴）还是功能活动（阳）都尚未成熟</p><p>·"阴"指精血津液等物质基础<br>·"阳"指脏腑功能活动<br>·"稚"即幼稚+不完善</p><p>临床意义：发育未成熟+易病+病后易康复</p></div><div class=ct-right><h4>"纯阳"学说</h4><p>含义：小儿生机蓬勃+发育迅速——如同旭日初升</p><p>·"纯阳"指生机旺盛+非有热无寒<br>·"纯"即纯正+阳气相对偏旺<br>·≠"纯阳之体"（错误理解）</p><p>临床意义：生长快+易化热+用药不宜过于温补</p></div></div><div class=classic-quote>《小儿药证直诀》："小儿五脏六腑，成而未全，全而未壮。"<span class=src>——《小儿药证直诀》</span></div><div class=plain>小儿的两大生理特点就像小树苗和嫩芽——"稚阴稚阳"（小苗还不够壮实+经不起风雨）+"纯阳"（小苗长得快+天天向上）。"稚阴稚阳"说的是"弱"（功能物质都不足）+"纯阳"说的是"旺"（生长快+活力足）。两者不矛盾+一个说现状+一个说趋势。注意：纯阳≠有热无寒（不是阳亢阴亏）。</p><div class=mnem><strong>口诀：</strong>稚阴稚阳形气弱，纯阳生机旺盛说；阴物质来阳功能，两者并见儿科诀。</div><div class=trap-box><strong>高频考点（必考！）：</strong>1.小儿生理两大特点——"脏腑娇嫩+形气未充"（稚阴稚阳）和"生机蓬勃+发育迅速"（纯阳）。2."稚阴稚阳"——阴（物质）阳（功能）均未成熟。3."纯阳"——生机旺盛+不等于阳亢阴亏。4.钱乙《小儿药证直诀》——"五脏六腑，成而未全，全而未壮"。5.吴鞠通《温病条辨》——"稚阳未充+稚阴未长"。</div></div>'}]
},
  {name:"细目二：病因特点",points:[{id:"ek-2-2",name:"儿科病因特点",type:"detail",
content:'<p><strong>儿科病因特点：</strong>与成人不同+以外感+乳食+先天因素为主。</p><div class=compare-table><div class=ct-left><h4>外感因素</h4><p>·外感六淫（风寒暑湿燥火）<br>·小儿肺常不足→易外感+易咳嗽<br>·小儿卫外不固→易受邪</p><p>最多见的是——风寒+风热+暑邪</p></div><div class=ct-right><h4>乳食+先天+其他因素</h4><p><strong>乳食因素（最常见内因）：</strong><br>·喂养不当→呕吐+泄泻+积滞+疳证<br>·饮食不洁→肠道寄生虫<br>·饮食偏嗜→营养不良</p><p><strong>先天因素：</strong><br>·胎传（胎弱+胎毒+胎黄）<br>·遗传（五迟五软+先天性心脏病）</p><p><strong>其他：</strong>意外伤害+情志因素</p></div></div><div class=classic-quote>《小儿药证直诀》："小儿易为虚实，脾虚多泻，肺虚多嗽，心虚多惊，肝虚多搐，肾虚多解颅。"<span class=src>——《小儿药证直诀》</span></div><div class=plain>小儿病因特点可概括为"三多"：外感多（肺常不足）+乳食多（脾常不足）+先天因素多（肾常虚）。和成人最大区别：成人病因七情内伤多+小孩病因外感伤食多。所以说"小儿病因不过三：外感+伤食+先天"。</p><div class=mnem><strong>口诀：</strong>儿科病因三个多，外感乳食先天病；肺虚易咳脾虚泻，肾虚发育迟缓成。</div></div>'}
  ]},
  {name:"细目三：病理特点",points:[{id:"ek-2-3",name:"小儿病理的基本特点及临床意义",type:"detail",
content:'<p><strong>小儿病理三大特点：</strong></p><div class=compare-table><div class=ct-left><h4>发病容易+传变迅速</h4><p>·"肺常不足"→易感冒+咳嗽+肺炎<br>·"脾常不足"→易积食+泄泻+疳证<br>·"肝常有余"→易惊风+抽搐<br>·"肾常虚"→生长发育落后+遗尿</p><p>但一旦发病+病情变化极快（朝热夜惊）<br>"易虚易实+易寒易热"</p></div><div class=ct-right><h4>脏器清灵+易趋康复</h4><p>·小儿生机旺盛+组织再生能力强<br>·病因相对单纯+无情志因素纠缠<br>·反应敏锐+用药后见效快<br>·治疗得当则痊愈快</p><p>所以"小儿病难治也易治"——难在变化快+易在恢复快。</p></div></div><div class=classic-quote>《温病条辨·解儿难》："小儿肤薄神怯，经络脏腑嫩小，不奈三气发泄。邪之来也，势如奔马；其传变也，急如掣电。"<span class=src>——《温病条辨》</span></div><div class=plain>小儿病理特点就像"小鞭炮"——一点就着（容易生病）而且炸得快（传变迅速）。但也是个"打不死的小强"——治好了恢复特别快（脏器清灵）。这告诉医生：看儿科要快（赶紧处理）+用药要准+不要太担心预后。</p><div class=mnem><strong>口诀：</strong>肺脾常不足肝肾有余，发病快传变速易虚实；脏器清灵生机旺，易趋康复是佳处。</div><div class=trap-box><strong>高频考点：</strong>1.小儿病理三大特点：①发病容易传变迅速②脏气清灵易趋康复③易虚易实易寒易热。2."肺常不足"→易外感+"脾常不足"→易积食+"肝常有余"→易惊风+"肾常虚"→发育迟。3."易虚易实+易寒易热"——儿科病机特点。4.吴鞠通《温病条辨·解儿难》——"邪之来也势如奔马+其传变也急如掣电"。</div></div>'}
  ]}
]},

'''

after = after[:idx2_new] + UNIT2 + after[idx3_new:]

# --- UNIT 3 ---
idx3_new = after.find('{unit:"第三单元')
idx4_new = after.find('{unit:"第四单元')

UNIT3 = r'''{unit:"第三单元 四诊概要",subunits:[
  {name:"望诊、闻诊、问诊、切诊",points:[
    {id:"ek-3-1",name:"望诊的主要内容（望神态、审苗窍、斑疹、大便、指纹）",type:"detail",
content:'<p><strong>儿科望诊</strong>是四诊之首（小儿不会说话+问诊靠家长+脉诊不可靠）。</p><div class=compare-table><div class=ct-left><h4>望神态+审苗窍</h4><p><strong>望神态：</strong><br>有神→目光有神+精神好→病轻<br>无神→目光呆滞+精神萎靡→病重</p><p><strong>审苗窍（九窍）：</strong><br>·目—肝之窍（目赤肝热+巩膜蓝斑虫积）<br>·鼻—肺之窍（鼻塞风寒+流黄涕风热）<br>·口唇—脾之窍（唇干阴虚+唇红脾热）<br>·舌—心之窍（舌红心火+地图舌阴虚）</p></div><div class=ct-right><h4>斑疹+大便+指纹</h4><p><strong>辨斑疹：</strong><br>·斑—点大成片+不高出皮肤（热入营血）<br>·疹—点小如粟+高出皮肤（卫分气分）</p><p><strong>望大便：</strong><br>·清稀夹泡沫→风寒泻<br>·黄褐臭秽→湿热泻<br>·赤白黏冻→痢疾</p><p><strong>望指纹（3岁以下）：</strong><br>"浮沉分表里+红紫辨寒热+淡滞定虚实+三关测轻重"——风关（轻）→气关（重）→命关（危）</p></div></div><div class=classic-quote>《小儿药证直诀》："小儿脉法无凭，唯察色为要。"<span class=src>——《小儿药证直诀》</span></div><div class=plain>儿科望诊最重要——因为"小儿脉法无凭"（脉诊不可靠）且小儿不会描述症状。"望指纹"是儿科特色诊断方法（3岁以下）。指纹分风关（食指第一节）、气关（第二节）、命关（第三节）。"浮沉分表里+红紫辨寒热+淡滞定虚实+三关测轻重"——十六字口诀必背！指纹到命关是危重证。</p><div class=mnem><strong>口诀：</strong>望诊第一闻问切辅，指纹风口气命三关；浮沉表里红紫寒热，淡滞虚实三关危安。</div><div class=trap-box><strong>高频考点：</strong>1.儿科望诊为首要诊法。2.指纹三关：风关(轻)→气关(重)→命关(危)。3.指纹辨证十六字诀："浮沉分表里+红紫辨寒热+淡滞定虚实+三关测轻重"。4.斑vs疹——斑大成片不高皮+疹小如粟高皮肤。5.审苗窍：目肝+鼻肺+唇脾+舌心+耳肾。</div></div>'},
    {id:"ek-3-2",name:"闻诊（啼哭声、咳嗽声、大小便闻诊）",type:"detail",
content:'<p><strong>儿科闻诊</strong>包括听声音+嗅气味。小儿不能表达自己+闻诊很重要。</p><div class=compare-table><div class=ct-left><h4>啼哭声</h4><p>·哭声洪亮有力→实证+热证<br>·哭声低微无力→虚证+寒证<br>·哭声尖锐阵发性+伴屈腰→腹痛<br>·夜啼+烦躁→心热/脾寒/惊恐<br>·哭声绵长+吮乳缓解→饥饿</p></div><div class=ct-right><h4>咳嗽声+大小便</h4><p><strong>咳嗽声：</strong><br>·咳声重浊→风寒<br>·咳声清扬→风热<br>·咳声阵发性+鸡鸣样回声→百日咳<br>·咳声如犬吠→喉炎</p><p><strong>大小便闻诊：</strong><br>·大便酸腐→伤食<br>·大便腥臭→风寒<br>·大便臭秽→湿热<br>·小便臭浊→膀胱湿热</p></div></div><div class=classic-quote>《小儿药证直诀》："啼哭有声+当辨其所因。"<span class=src>——《小儿药证直诀》</span></div><div class=plain>闻诊对小婴儿特别重要——因为婴儿不会说话+哭声就是"语言"。哭声洪亮=病轻+哭声低微=病重。咳嗽声也很关键——"鸡鸣样回声"是百日咳特征（咳到最后有一声像鸡叫的吸气声）+"犬吠样咳嗽"是喉炎（急性喉梗阻危险！）。</p><div class=mnem><strong>口诀：</strong>哭闹洪亮实热+低微虚寒+阵发腹痛；咳嗽重浊风寒清扬热，鸡鸣百日咳犬吠喉炎。</div></div>'},
    {id:"ek-3-3",name:"问诊（个人史、病情、大便、饮食）",type:"detail",
content:'<p><strong>儿科问诊</strong>主要向家长询问+结合"十问歌"。</p><div class=compare-table><div class=ct-left><h4>问诊要点（儿科特色）</h4><p><strong>个人史：</strong><br>·出生史（顺产/剖腹+早产/足月）<br>·喂养史（母乳/人工+辅食添加+断乳）<br>·生长发育史（抬头+坐+爬+走+说话时间）<br>·预防接种史（卡介苗+乙肝+脊灰等）<br>·既往病史+过敏史</p></div><div class=ct-right><h4>问病情+二便+饮食</h4><p><strong>问寒热：</strong>恶寒发热→表证+但热不寒→里证</p><p><strong>问大便：</strong><br>·便秘→燥热/气虚<br>·泄泻→伤食/风寒/湿热/脾虚</p><p><strong>问饮食：</strong><br>·不欲食—脾虚+积滞<br>·多食易饥—胃火炽盛</p></div></div><div class=plain>儿科问诊和成人最大不同是要问"个人史"（出生喂养发育）+而且很多时候家长说不清楚。预防接种史很重要——没打过疫苗容易得传染病（麻疹+百日咳等）。问诊要结合小儿的年龄特点——小婴儿最常见的问题是喂养和消化+幼儿要问意外伤害预防。</p></div>'},
    {id:"ek-3-4",name:"切诊（脉诊、囟门按诊）",type:"detail",
content:'<p><strong>儿科切诊</strong>包括脉诊+按诊（按囟门+按腹部+按皮肤等）。</p><div class=compare-table><div class=ct-left><h4>小儿脉诊特点</h4><p>一指定三关（小儿寸口脉短+用拇指同时按寸关尺）</p><p><strong>主要脉象：</strong><br>·浮脉→表证<br>·沉脉→里证<br>·迟脉→寒证<br>·数脉→热证（小儿脉偏数—生理性）<br>·细脉→虚证+阴虚<br>·滑脉→痰食+热盛</p><p><strong>正常小儿脉象：</strong><br>新生儿120-140次/分<br>婴儿110-130次/分<br>幼儿100-120次/分</p></div><div class=ct-right><h4>按诊要点</h4><p><strong>按囟门：</strong><br>·囟门迟闭→佝偻病<br>·囟门凹陷→脱水<br>·囟门饱满→颅内压增高</p><p><strong>按腹部：</strong><br>·腹痛喜按→虚证<br>·腹痛拒按→实证<br>·腹胀+叩之鼓音→气滞</p><p><strong>按皮肤：</strong><br>·皮肤干燥弹性差→脱水<br>·手足心热→阴虚内热</p></div></div><div class=classic-quote>《小儿药证直诀》"小儿脉法无凭"并非否定切诊+而是强调望诊为主+四诊合参。"<span class=src>——《小儿药证直诀》</span></div><div class=plain>小儿切诊特色是"一指定三关"——成人用三个手指+小儿手指寸口脉位置短+用一个拇指就能按到三部。小儿正常脉象比成人快（年龄越小越快）+不要误认为"数脉"（需知生理性快）。</p><div class=mnem><strong>口诀：</strong>一指定三关小儿脉，浮沉迟数细滑寻；按囟按腹按肢皮，四诊合参儿科珍。</div></div>'}
  ]}
]},

'''

after = after[:idx3_new] + UNIT3 + after[idx4_new:]

# --- UNIT 4 ---
idx4_new = after.find('{unit:"第四单元')
idx5_new = after.find('{unit:"第五单元')

UNIT4 = r'''{unit:"第四单元 儿科治法概要",subunits:[
  {name:"中药内外治法",points:[
    {id:"ek-4a-1",name:"用药原则、中药用量、给药方法及常用内治法",type:"apply",
content:'<p><strong>儿科用药原则：</strong>治疗及时+方药精简+辨证准确+中病即止。</p><div class=compare-table><div class=ct-left><h4>用药原则与用量</h4><p><strong>用药特点：</strong><br>·及时正确+但不可过剂<br>·方药精简+药味少+剂量轻<br>·中病即止+不可过服</p><p><strong>中药用量：</strong><br>新生儿→成人量1/6<br>婴儿→成人量1/3-1/2<br>幼儿→成人量2/3<br>学龄儿童→接近成人量</p><p>注意：根据体质+病情灵活调整</p></div><div class=ct-right><h4>给药方法与常用内治法</h4><p><strong>给药方法：</strong><br>口服为主+汤剂+颗粒+糖浆<br>不能口服→鼻饲+灌肠</p><p><strong>常用内治法：</strong><br>·疏风解表→感冒<br>·止咳平喘→咳嗽+哮喘<br>·清热解毒→肺炎+传染病<br>·消食导滞→积滞+疳证<br>·健脾益气→脾虚泄泻<br>·补肾培元→五迟五软</p></div></div><div class=classic-quote>《温病条辨·解儿难》："其用药也，稍呆则滞，稍重则伤。"<span class=src>——《温病条辨》</span></div><div class=plain>儿科用药和成人最大区别——"轻"！因为小儿"脏腑娇嫩+形气未充"——药量重了伤身体+药性呆滞了也伤。所以新生儿用成人量的1/6+婴儿1/3-1/2+幼儿2/3+学龄期接近成人。吴鞠通说"稍呆则滞+稍重则伤"——这是儿科用药的金标准。</p><div class=mnem><strong>口诀：</strong>儿科用药轻精简，新生六分婴半减；幼儿三分之二量，中病即止勿过煎。</div><div class=trap-box><strong>考点：</strong>1.新生儿用量=成人1/6+婴儿=1/3-1/2+幼儿=2/3。2.用药原则：及时+精简+适量+中病即止。3."稍呆则滞+稍重则伤"——吴鞠通。4.给药以口服为主。5.儿科不宜用峻猛攻伐之品。</div></div>'},
    {id:"ek-4a-2",name:"常用外治法举例",type:"detail",
content:'<p><strong>儿科常用外治法：</strong>简+便+廉+验——小儿不愿服药时尤其适用。</p><div class=compare-table><div class=ct-left><h4>常用外治法</h4><p><strong>熏洗法：</strong>用中药煎汤熏洗患部/全身<br>·麻疹透疹→香菜汤<br>·皮肤湿疹→苦参汤</p><p><strong>涂敷法：</strong>药粉调糊敷患处<br>·腮腺炎→金黄散外敷</p><p><strong>罨包法：</strong>药物加热布包熨患处<br>·腹痛→炒盐熨脐</p></div><div class=ct-right><h4>其他外治法</h4><p><strong>灌肠法：</strong>药物保留灌肠<br>·高热惊厥→安宫牛黄丸灌肠</p><p><strong>雾化吸入：</strong>药液雾化吸入<br>·咳喘→中药雾化</p><p><strong>吹药法：</strong>药粉吹入咽喉/口腔<br>·口腔溃疡→冰硼散吹口</p><p><strong>药袋法：</strong>药末装入布袋佩带<br>·预防感冒→香囊佩挂</p></div></div><div class=plain>儿科外治法很实用——小孩不爱喝药+外用贴肚脐+泡澡+敷脚心等效果好。特别是有时候家长喂不进药+外用是很好的替代方案。</p></div>'},
    {id:"ek-4a-3",name:"捏脊疗法及刺四缝疗法的主要适应病证",type:"apply",
content:'<p><strong>捏脊疗法</strong>（捏积）和<strong>刺四缝疗法</strong>是儿科最特色的外治法。</p><div class=compare-table><div class=ct-left><h4>捏脊疗法</h4><p><strong>操作方法：</strong>双手拇指食指沿脊柱两侧（督脉+膀胱经）从下向上捏拿皮肤+反复3-5遍+每日1次</p><p><strong>适应证：</strong><br>·疳证（小儿营养不良）——首选！<br>·积滞+厌食+泄泻<br>·脾胃虚弱之各种病证</p><p><strong>作用：</strong>调理脾胃+疏通经络+调整阴阳</p></div><div class=ct-right><h4>刺四缝疗法</h4><p><strong>操作方法：</strong>用三棱针/毫针刺四缝穴（第2-5指掌面近端指间关节横纹中点）+挤出少量黄白色黏液</p><p><strong>适应证：</strong><br>·疳证（小儿营养不良）——首选！<br>·厌食+积滞+消化不良<br>·百日咳</p><p><strong>作用：</strong>消食导滞+清热除烦+化痰止咳</p></div></div><div class=classic-quote>《小儿按摩经》："捏脊法+治小儿积滞羸瘦+百病皆效。"<span class=src>——《小儿按摩经》</span></div><div class=plain>这两个是儿科特有的外治法——都主要治"疳证"（营养不良）。捏脊法从屁股往上捏到脖子+调理脾胃+增强抵抗力。刺四缝是在手指关节横纹中点扎一下挤出黏液——看着吓人但效果很好。两个方法都特别适合小儿脾胃病。考试常考适应证——两者都治"疳证"。</p><div class=mnem><strong>口诀：</strong>捏脊刺四缝，疳积最常用；捏脊调脾胃，四缝消积功。</div><div class=trap-box><strong>高频考点：</strong>1.捏脊疗法适应证——疳证+积滞+厌食+泄泻（脾胃病）。2.刺四缝适应证——疳证+厌食+积滞+百日咳。3.四缝穴位置——第2-5指掌面近端指间关节横纹中点。4.捏脊方向——从下向上（从尾骨到大椎）。5.刺四缝挤出黄白色黏液效果更好。</div></div>'}
  ]}
]},

'''

after = after[:idx4_new] + UNIT4 + after[idx5_new:]

# --- UNIT 5 ---
idx5_new = after.find('{unit:"第五单元')
idx6_new = after.find('{unit:"第六单元')

UNIT5 = r'''{unit:"第五单元 喂养与保健",subunits:[
  {name:"新生儿及婴儿期保健",points:[{id:"ek-5a-1",name:"新生儿期保健及婴儿喂养方式、辅食添加、断奶",type:"detail",
content:'<p><strong>新生儿期保健：</strong>保暖+喂养+护理+预防感染。婴儿喂养方式有三种：母乳喂养+人工喂养+混合喂养。</p><div class=compare-table><div class=ct-left><h4>喂养方式</h4><p><strong>母乳喂养（首选！）：</strong><br>·最适合婴儿的营养品<br>·含免疫球蛋白+增强抵抗力<br>·按需哺乳+2-3小时一次</p><p><strong>人工喂养：</strong>配方奶粉替代<br>·奶量计算：每日总奶量=体重(kg)×100-120ml</p><p><strong>混合喂养：</strong>母乳不足时补配方奶</p></div><div class=ct-right><h4>辅食添加与断奶</h4><p><strong>辅食添加原则：</strong><br>·从少到多+从稀到稠+从细到粗<br>·从一种到多种+逐渐增加<br>·4-6个月开始添加</p><p><strong>添加顺序：</strong><br>4-6月→米粉+蛋黄+菜泥<br>7-9月→烂面+肝泥+鱼泥<br>10-12月→稠粥+软饭+碎肉</p><p><strong>断奶：</strong>8-12个月最佳+夏季不宜断奶</p></div></div><div class=classic-quote>《小儿药证直诀》："乳贵有时+食贵有节。"<span class=src>——《小儿药证直诀》</span></div><div class=plain>婴儿喂养记住三句话：母乳最好（首选）+4-6个月添辅食+8-12个月断奶。辅食添加原则"从少到多从稀到稠"——和成人学新东西一样循序渐进。注意夏季不宜断奶（容易腹泻）。钱乙说"乳贵有时+食贵有节"——喂奶和吃饭都要有规律有节制。</p><div class=mnem><strong>口诀：</strong>母乳最佳首选先，喂养按时2-3点；辅食4-6月渐添，8-12月断奶全。</div><div class=trap-box><strong>考点：</strong>1.母乳喂养是首选+母乳含IgA+增强免疫。2.辅食添加时间4-6个月。3.辅食添加原则：由少到多+由稀到稠+由一种到多种。4.断奶最佳时间8-12个月+夏季不宜。5."乳贵有时+食贵有节"——《小儿药证直诀》。</div></div>'}
  ]}
]},

'''

after = after[:idx5_new] + UNIT5 + after[idx6_new:]

with open(TARGET, 'w', encoding='utf-8') as f:
    f.write(after)

print(f"Done. Size: {len(after)} bytes (was {len(c)} bytes)")
