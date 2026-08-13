#!/usr/bin/env python3
"""fill-unit13.py — 填充 s6 第十三单元 其他外科疾病"""
TARGET = '/sessions/compassionate-hopeful-thompson/mnt/syllabus/subjects/s6-waike.js'

with open(TARGET, 'r', encoding='utf-8') as f:
    c = f.read()

idx13 = c.find('{unit:"第十三单元')
idx_q = c.find('var Q6 = [')

if idx13 < 0 or idx_q < 0:
    print("ERROR: Cannot find boundaries")
    exit(1)

print(f"Replace offset {idx13}-{idx_q} (len={idx_q-idx13})")

# Unit 13 is the last unit in S6, so it ends with ]};\n\nvar Q6
# The closing is ]}]};\n\nvar Q6

UNIT13 = r'''{unit:"第十三单元 其他外科疾病",subunits:[
  {name:"细目一：烧伤",points:[{id:"wk-13-1",name:"烧伤面积计算、深度分类及重度烧伤辨证治疗",type:"apply",
content:'<p><strong>烧伤</strong>是热力（火焰+热液+蒸汽）或化学+电流+放射引起的皮肤损伤。严重程度取决于面积+深度。</p><div class=compare-table><div class=ct-left><h4>烧伤面积计算</h4><p><strong>手掌法：</strong>患者自己手掌（五指并拢）面积=1%体表面积<br><strong>新九分法：</strong><br>头颈=9%（发3面3颈3）<br>上肢各9%（双上臂7双前臂6双手5）=18%<br>躯干=27%（前13后13会阴1）<br>下肢=46%（双臀5双大腿21双小腿13双足7）<br>会阴=1%</p></div><div class=ct-right><h4>深度分类（三度四分法）</h4><p><strong>I度（红斑性）：</strong>红斑+灼痛+无水疱<br>→3-5天愈合无瘢痕</p><p><strong>浅II度（水疱性）：</strong>水疱+剧痛+创基红润<br>→2周愈合无瘢痕</p><p><strong>深II度：</strong>水疱+痛觉迟钝+创基红白相间<br>→3-4周愈合有瘢痕</p><p><strong>III度（焦痂性）：</strong>蜡白焦黄炭化+痛觉消失+无弹性<br>→需植皮+瘢痕明显</p></div></div></div><div class=classic-quote>《外科正宗》："汤烫火烧，此患原无内证，皆从外来也……轻则皮肤破损，重则肌肉焦枯，甚者火毒攻心，脏腑受伤。"<span class=src>——《外科正宗》</span></div><div class=plain>烧伤的严重程度就是"面积+深度"决定。面积用手掌法（病人自己的手=1%）或用新九分法。记住一个窍门——"333+566"：头面颈9+双上肢18+躯干27+下肢46。深度记"水疱"二字：有水疱=II度+无水疱=I度或III度。I度像晒伤（红痛）+浅II度有水疱剧痛+深II度痛觉迟钝+III度不痛但皮焦了最严重。</p><div class=mnem><strong>口诀：</strong>九分法记头颈九，上肢双十加一八；下肢46躯干27，手掌1%自己查。烧伤深度看水疱：I无疱红浅II痛，深II迟钝疱基白，III度焦痂需植皮。</div><div class=compare-table style=margin-top:6px><div class=ct-left><h4>重度烧伤辨证</h4><p><strong>火毒伤津（早期）：</strong>壮热烦渴+口干便秘<br>→ <strong>黄连解毒汤</strong>合银花甘草汤</p><p><strong>阴伤阳脱（休克期）：</strong>神疲肢冷汗出<br>→ <strong>生脉散</strong>合参附汤</p></div><div class=ct-right><h4>恢复期辨证</h4><p><strong>气血两虚（恢复期）：</strong>神疲乏力+创面不敛<br>→ <strong>八珍汤</strong></p><p><strong>补液原则：</strong><br>伤后第一个24h：每1%II/III度面积×1.5ml/kg+2000ml水分</p></div></div><div class=trap-box><strong>高频考点：</strong>1.新九分法——头9+双上肢18+躯干27+下肢46+会阴1=111%（注意会阴算在躯干内）。2.手掌法——自己手掌五指并拢=1%+用于小面积快速估算。3.深度鉴别——I度无水疱+II度有水疱+III度无弹力焦痂。4.重度烧伤补液公式：第一个24h每1%面积×1.5ml/kg体重（胶体晶体各半）+水分2000ml。5.感染期最常见死因——创面脓毒症。6.外治：创面清创+湿润烧伤膏。</div><div class=clinical-case>一位30岁男性全身多处火烧伤（双上肢18%+躯干前13%+头面部9%=40%II-III度烧伤）——重度烧伤火毒伤津用黄连解毒汤合银花甘草汤（黄连6g黄芩9g黄柏9g栀子9g银花30g生甘草10g）加玄参15g生地15g麦冬12g连翘15g配合补液抗休克+创面清创敷药，渡过危险期。</div></div>'}]
},
  {name:"细目二：毒蛇咬伤",points:[{id:"wk-13-2",name:"毒蛇咬伤的病因病机及治疗措施",type:"apply",
content:'<p><strong>毒蛇咬伤</strong>是毒蛇经牙将毒液注入人体引起的急性中毒。特点：局部红肿剧痛（血循毒）/麻木（神经毒）/混合型。危急重症！</p><div class=compare-table><div class=ct-left><h4>蛇毒分类与表现</h4><p><strong>神经毒（风毒）：</strong>金环蛇银环蛇<br>局部麻木+眼睑下垂+呼吸麻痹<br>→ <strong>活血祛风解毒</strong></p><p><strong>血循毒（火毒）：</strong>蝰蛇尖吻蝮（五步蛇）<br>局部红肿剧痛+水疱血疱+DIC<br>→ <strong>凉血止血解毒</strong></p><p><strong>混合毒（风火毒）：</strong>眼镜蛇蝮蛇<br>两种症状皆有<br>→ <strong>解毒+活血+祛风</strong></p></div><div class=ct-right><h4>救治措施</h4><p><strong>急救（咬伤后立即）：</strong><br>1.缚扎：近心端绑扎+每20分松1次<br>2.冲洗：盐水/双氧水冲洗伤口<br>3.排毒：切开+负压吸毒</p><p><strong>内治：</strong>清热解毒为主<br>主方：<strong>龙胆泻肝汤</strong>合五味消毒饮/季德胜蛇药片</p></div></div><div class=classic-quote>《外科正宗》："蛇伤者，毒气内攻，最急最危，一时救治不及，即能杀人。"<span class=src>——《外科正宗》</span></div><div class=plain>毒蛇咬伤就是跟时间赛跑——急救是救命第一关！记住"缚冲洗排"三步急救法。考试最常考的是：咬伤后立即绑扎+但不能紧到阻断动脉+每隔20分钟松一次（防组织坏死）。神经毒最危险——呼吸麻痹可致死。血循毒最痛——肿胀迅速+可致DIC。治疗上最快速的药是季德胜蛇药片（内服+外敷）。</p><div class=mnem><strong>口诀：</strong>蛇伤急救缚冲洗，近心端扎要松弛；20分钟松一次，切开冲洗毒汁吸；神经麻痹血循肿，龙胆五味蛇药宜。</div><div class=trap-box><strong>高频考点：</strong>1.急救三步：缚扎（近心端松紧适度）+冲洗（盐水/双氧水）+排毒（切开负压）。2.缚扎每20分钟放松1次+每次1-2分钟+防组织坏死。3.神经毒（风毒）——呼吸麻痹+血循毒（火毒）——DIC出血。4.主方：龙胆泻肝汤合五味消毒饮清热解毒。5.季德胜蛇药片口服+外敷。6.绝对禁忌：不能饮酒（酒精扩张血管加速毒吸收）+不能奔跑（减慢毒扩散）。7.注意区分毒蛇vs无毒蛇咬伤——毒蛇有两个毒牙痕。</div><div class=clinical-case>一位42岁男性野外作业被蝮蛇咬伤左小腿+局部红肿剧痛+两个深大牙痕+半小时内出现头昏——毒蛇咬伤混合毒型立即缚扎伤口近心端+盐水冲洗+切开负压吸毒+口服季德胜蛇药片20片+内服龙胆泻肝汤合五味消毒饮（龙胆草9g栀子9g黄芩9g生地15g车前草15g泽泻12g银花15g野菊花12g蒲公英15g紫花地丁12g天葵子9g甘草6g）三剂后肿消痛减。</div></div>',
cardQuiz:[{q:"毒蛇咬伤缚扎后应多久放松一次？",opts:["20分钟","10分钟","30分钟","1小时"],ans:0},{q:"神经毒蛇咬伤最危险的症状是？",opts:["呼吸麻痹","局部坏死","DIC","剧痛"],ans:0}]}]
},
  {name:"细目三：肠痈",points:[{id:"wk-13-3",name:"肠痈的病因病机、诊断及辨证论治",type:"apply",
content:'<p><strong>肠痈</strong>是肠道急性化脓性疾病（急性阑尾炎）。特点：转移性右下腹痛+固定压痛+反跳痛+肌紧张。</p><div class=compare-table><div class=ct-left><h4>辨证分型</h4><p><strong>瘀滞证（初期）：</strong>上腹/脐周痛→固定右下腹+轻度压痛+苔白<br>→ <strong>大黄牡丹汤</strong>行气祛瘀通腑</p><p><strong>湿热证（成脓期）：</strong>右下腹剧痛+反跳痛+肌紧张+发热+苔黄腻<br>→ <strong>大黄牡丹汤</strong>合红藤煎/复方大柴胡汤</p><p><strong>热毒证（溃脓期）：</strong>全腹痛+腹膜炎+高热+中毒貌<br>→ <strong>大黄牡丹汤</strong>合黄连解毒汤+大承气汤</p><p><strong>慢性期：</strong>右下腹间歇性隐痛+无明显压痛<br>→ <strong>大黄牡丹汤</strong>（轻剂）或薏苡附子败酱散</p></div><div class=ct-right><h4>诊断与鉴别</h4><p><strong>体征：</strong>McBurney点压痛+反跳痛+结肠充气试验（Rovsing征）+腰大肌试验+闭孔肌试验<br><strong>辅助：</strong>血常规WBC↑+B超/CT</p><p><strong>鉴别：</strong><br>右输尿管结石→绞痛+血尿<br>胃十二指肠穿孔→板状腹+游离气腹<br>宫外孕→停经+阴道出血</p></div></div><div class=classic-quote>《金匮要略》："肠痈之为病，其身甲错，腹皮急，按之濡如肿状，腹无积聚，身无热，脉数，此为肠内有痈脓。"<span class=src>——《金匮要略》</span></div><div class=plain>肠痈就是阑尾炎——最经典的症状是"转移性右下腹痛"：开始是肚脐周围或者心口痛（以为是胃痛）+过几个小时转移到右下腹（这才是阑尾炎！）。记住三个字"右下腹"——阑尾就在那。经典方是大黄牡丹汤（大黄牡丹皮桃仁芒硝冬瓜子）——这就是中医外科第一急性病！考试必考大黄牡丹汤。注意：肠痈初起可保守治疗（大黄牡丹汤）+成脓和溃脓需手术治疗。</p><div class=mnem><strong>口诀：</strong>肠痈转移右下痛，大黄牡丹汤通用；瘀滞大黄桃仁硝，湿热红藤大柴胡；热毒黄连大承气，慢性薏苡败酱敷。</div><div class=trap-box><strong>高频考点（必考！）：</strong>1.肠痈最典型症状——转移性右下腹痛（上腹/脐周→右下腹McBurney点）。2.代表方——大黄牡丹汤（大黄牡丹皮桃仁芒硝冬瓜子）——大黄牡丹汤治肠痈第一方！3.三期辨治：瘀滞→大黄牡丹汤+湿热→大黄牡丹汤合红藤煎+热毒→大黄牡丹汤合黄连解毒汤大承气汤。4.体征：McBurney点压痛+反跳痛+结肠充气试验。5.女病人需排除宫外孕+黄体破裂+卵巢囊肿扭转。6.化脓坏死+穿孔需紧急手术。7.慢性肠痈可用薏苡附子败酱散（薏仁附子败酱草）。</div><div class=clinical-case>一位25岁男性突发上腹痛6小时后转移到右下腹+McBurney点压痛反跳痛+低热——肠痈瘀滞证用大黄牡丹汤（大黄12g后下牡丹皮9g桃仁9g芒硝9g冲服冬瓜子15g）加红藤30g败酱草30g连翘12g三剂后热退痛减。嘱如不缓解或加重需手术。</div></div><div class=mini-quiz><div class=mq-title>一分钟诊室</div><div class=mq-scene>患者突发上腹痛6小时转移至右下腹+McBurney点压痛反跳痛</div><div class=mq-opts><span class=mq-opt data-ans=right>A. 肠痈（大黄牡丹汤）</span><span class=mq-opt data-ans=wrong>B. 胃溃疡穿孔（手术）</span><span class=mq-opt data-ans=wrong>C. 输尿管结石（八正散）</span><span class=mq-opt data-ans=wrong>D. 胆囊炎（龙胆泻肝汤）</span></div><div class=mq-feedback style=display:none><template class=fb-right>正确！转移性右下腹痛=急性阑尾炎（肠痈）用大黄牡丹汤通腑泻热。</template><template class=fb-wrong>腹痛鉴别：转移右下→肠痈+板状腹→穿孔+绞痛血尿→结石+右上腹放射→胆囊炎。</template></div></div>',
cardQuiz:[{q:"肠痈最典型的症状是？",opts:["转移性右下腹痛","右上腹痛","左上腹痛","全腹痛"],ans:0},{q:"肠痈的代表方大黄牡丹汤出自哪部经典？",opts:["《金匮要略》","《伤寒论》","《外科正宗》","《医宗金鉴》"],ans:0},{q:"肠痈热毒溃脓期的治疗原则是？",opts:["手术为主","保守治疗","针灸","外敷"],ans:0}]}]
}
]}'''

# Unit 13 is the last unit — it ends with ]};\n\nvar Q6
# The pattern that will be replaced ends at idx_q
# Unit 13 is the last unit — the old content from idx13:idx_q includes
# the unit skeleton + its trailing ]}]};\n\n. UNIT13 needs to provide
# its own closing of S6 + Q6 array.
# UNIT13 ends with ]} (subunits close + unit close), need ]}; for units+S6+var
after = c[:idx13] + UNIT13 + ']};' + c[idx_q:]

with open(TARGET, 'w', encoding='utf-8') as f:
    f.write(after)

print(f"Done. Size: {len(after)} bytes (was {len(c)} bytes)")
