// practical-exam.js — 实践考试备考模块
// 入口函数 window.renderPractical 覆盖 app.js 中的空占位符
(function() {
'use strict';

// localStorage key
var PROGRESS_KEY = 'practicalProgress';

function getProgress() {
  return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
}

function saveProgress(itemId, status) {
  var p = getProgress();
  p[itemId] = { status: status };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}

// ---- CSS injection ----
(function injectCSS() {
  var s = document.createElement('style');
  s.textContent = '.pe-layout{display:flex;gap:0;min-height:500px}.pe-sidebar{width:260px;min-width:260px;background:#fff;border-right:1px solid #e8ddd0;overflow-y:auto;max-height:calc(100vh - 160px)}.pe-sidebar h3{font-size:.78rem;padding:10px 14px;color:#7a4e36;border-bottom:1px solid #e8ddd0;cursor:pointer;display:flex;align-items:center;gap:6px;user-select:none}.pe-sidebar h3 .pe-arrow{font-size:.6rem;transition:transform .2s}.pe-sidebar h3.open .pe-arrow{transform:rotate(90deg)}.pe-cat-items{display:none}.pe-cat-items.show{display:block}.pe-cat-item{padding:8px 14px 8px 24px;font-size:.74rem;cursor:pointer;color:#6b5a44;display:flex;align-items:center;gap:6px;transition:background .12s;border-left:3px solid transparent}.pe-cat-item:hover{background:#f7f1e8}.pe-cat-item.active{background:#ede0cc;color:#3a2210;border-left-color:#c9a87c;font-weight:600}.pe-cat-item .pe-status{font-size:.7rem}.pe-main{flex:1;padding:16px 20px;overflow-y:auto}.pe-detail-card{background:#fff;border-radius:10px;padding:20px 22px;box-shadow:0 1px 6px rgba(0,0,0,.05)}.pe-detail-card h3{font-size:1rem;color:#3a2210;margin-bottom:6px;display:flex;align-items:center;gap:8px}.pe-weight{font-size:.6rem;padding:2px 8px;border-radius:8px;font-weight:400}.pe-w-required{background:#fdedec;color:#922b21}.pe-w-common{background:#fef9e7;color:#7d6608}.pe-section{margin-top:16px}.pe-section-title{font-size:.78rem;font-weight:700;color:#5b3a29;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #f0e8dc}.pe-steps{list-style:decimal;margin:8px 0 8px 20px;font-size:.82rem;line-height:1.8;color:#4a3f35}.pe-scoring-table{width:100%;border-collapse:collapse;font-size:.78rem;margin:8px 0}.pe-scoring-table th{background:#f5f0eb;color:#5b3a29;padding:8px 10px;text-align:left;font-weight:600;border-bottom:2px solid #d5cfc0}.pe-scoring-table td{padding:7px 10px;border-bottom:1px solid #eee;color:#4a3f35}.pe-pitfalls{list-style:none;margin:8px 0;font-size:.78rem;line-height:1.6}.pe-pitfalls li::before{content:"⚠️ ";color:#e74c3c}.pe-pitfalls li{color:#4a3f35;padding:4px 0}.pe-question-box{background:#fef9f0;border:1px solid #e8d5b0;border-radius:8px;padding:14px 16px;font-size:.85rem;line-height:1.7;color:#3a2210;margin:8px 0}.pe-answer-section{margin-top:14px}.pe-answer-toggle{background:#5b3a29;color:#f5e6d3;border:none;border-radius:8px;padding:10px 18px;font-size:.78rem;cursor:pointer;font-family:inherit}.pe-answer-toggle:active{background:#4a2e20}.pe-answer-content{display:none;background:#f8f6f0;border:1px solid #e8ddd0;border-radius:8px;padding:14px 16px;margin-top:10px;font-size:.82rem;line-height:1.8;color:#4a3f35}.pe-answer-content.show{display:block}.pe-answer-content li{margin-bottom:4px}.pe-related{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.pe-related-tag{font-size:.65rem;padding:3px 8px;background:#f0f4e8;color:#6b8c42;border-radius:6px}.pe-master-btn{display:inline-block;padding:10px 20px;border-radius:8px;font-size:.82rem;cursor:pointer;font-family:inherit;margin-top:14px;border:none;transition:all .15s}.pe-btn-mastered{background:#d5f5e3;color:#145a32}.pe-btn-mastered:active{background:#abebc6}.pe-btn-pending{background:#fef9f0;color:#7d6608;border:1.5px solid #e8d5b0}.pe-btn-pending:active{background:#fdf6ec}.pe-sidebar.collapsed{width:0;min-width:0;opacity:0;overflow:hidden;border-right:none}@media(max-width:768px){.pe-layout{flex-direction:column}.pe-sidebar{width:100%;min-width:auto;max-height:none;border-right:none;border-bottom:1px solid #e8ddd0}.pe-main{padding:12px 10px}}';
  document.head.appendChild(s);
})();

// ---- Main entry ----
function init() {
  var container = document.getElementById('practical-tab');
  if (!container) { setTimeout(init, 100); return; }

  // Ensure container is visible in layout mode
  var mainLayout = document.getElementById('layout');
  if (mainLayout) mainLayout.style.display = 'block';
  var sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.style.display = 'none';

  // Remove the default empty state from container
  container.innerHTML = '';

  // Try to load from external JSON, fallback to inline data
  var data = null;
  if (window.PRACTICAL_DATA) {
    data = window.PRACTICAL_DATA;
  }
  if (!data) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'subjects/practical-exam.json', false);
      xhr.overrideMimeType('application/json');
      xhr.send();
      if (xhr.status === 0 || xhr.status === 200 || xhr.responseText) {
        data = JSON.parse(xhr.responseText);
      }
    } catch(e) {}
  }
  if (!data) {
    // Inline fallback for file:// protocol
    data = {"categories": [{"id": "acupuncture-op", "name": "针灸操作", "type": "operation", "weight": "必考", "items": [{"id": "acup-op-001", "name": "足三里穴定位与进针", "description": "准确定位足三里穴并完成毫针进针操作（胃经合穴、胃下合穴）", "steps": ["取穴：犊鼻穴下3寸，胫骨前嵴外一横指（中指同身寸）", "消毒：用75%酒精棉球由中心向外周擦拭穴位及周围皮肤", "进针：直刺1-1.5寸，捻转进针", "得气观察：局部酸麻胀感并向足背放射即为得气", "出针：缓慢捻转退针，用干棉球按压针孔"], "scoring": [{"criterion": "定位准确", "maxScore": 3}, {"criterion": "消毒规范", "maxScore": 2}, {"criterion": "进针手法正确", "maxScore": 2}, {"criterion": "得气判断准确", "maxScore": 3}], "pitfalls": ["定位偏移：注意胫骨前嵴的触诊，切勿偏移至腓侧", "进针过深：足三里直刺不超过1.5寸，过深可能伤及胫后神经血管"]}, {"id": "acup-op-002", "name": "合谷穴定位与进针", "description": "准确定位合谷穴并完成毫针进针操作（大肠经原穴）", "steps": ["取穴：手背第1、2掌骨间，第2掌骨桡侧中点处", "消毒：穴位及医者手指常规消毒", "进针：直刺0.5-1寸，或向劳宫透刺", "得气观察：局部胀麻感向示指端放散", "注意：孕妇禁用"], "scoring": [{"criterion": "定位准确", "maxScore": 3}, {"criterion": "消毒规范", "maxScore": 2}, {"criterion": "进针方向正确", "maxScore": 2}, {"criterion": "安全告知（孕妇禁用）", "maxScore": 3}], "pitfalls": ["定位过高：勿将合谷定在靠近腕关节处", "孕妇漏问：合谷有催产作用，操作前必须确认患者非孕妇"]}, {"id": "acup-op-003", "name": "三阴交穴定位与进针", "description": "准确定位三阴交穴并完成毫针进针操作（脾经穴，足三阴经交会穴）", "steps": ["取穴：内踝尖上3寸，胫骨内侧缘后方", "消毒：常规消毒", "进针：直刺1-1.5寸", "得气观察：局部酸胀感向小腿内侧放散", "注意：孕妇禁用"], "scoring": [{"criterion": "定位准确", "maxScore": 3}, {"criterion": "消毒规范", "maxScore": 2}, {"criterion": "进针深度恰当", "maxScore": 2}, {"criterion": "安全告知", "maxScore": 3}], "pitfalls": ["内踝尖定位错误：应在胫骨内侧缘后方，非胫骨前缘", "孕妇未告知：三阴交孕妇禁针，同合谷"]}, {"id": "acup-op-004", "name": "内关穴定位与进针", "description": "准确定位内关穴并完成毫针进针操作（心包经络穴，八脉交会穴）", "steps": ["取穴：腕横纹上2寸，掌长肌腱与桡侧腕屈肌腱之间", "消毒：常规消毒", "进针：直刺0.5-1寸", "得气观察：局部酸麻胀感向中指端或前臂放散"], "scoring": [{"criterion": "定位准确", "maxScore": 3}, {"criterion": "消毒规范", "maxScore": 2}, {"criterion": "进针手法正确", "maxScore": 2}, {"criterion": "得气描述正确", "maxScore": 3}], "pitfalls": ["两肌腱辨识不清：嘱患者用力屈腕可明显触及两腱", "进针偏斜：应保持针体在两腱正中"]}, {"id": "acup-op-005", "name": "太冲穴定位与进针", "description": "准确定位太冲穴并完成毫针进针操作（肝经原穴、输穴）", "steps": ["取穴：足背第1、2跖骨结合部前凹陷中", "消毒：常规消毒", "进针：直刺0.5-0.8寸", "得气观察：局部胀感向足大趾方向传导"], "scoring": [{"criterion": "定位准确", "maxScore": 3}, {"criterion": "消毒规范", "maxScore": 2}, {"criterion": "进针角度正确", "maxScore": 2}, {"criterion": "得气描述正确", "maxScore": 3}], "pitfalls": ["定位偏前：应在跖骨结合部前方凹陷而非趾蹼", "进针过深：足背部组织薄，勿超过0.8寸"]}, {"id": "acup-op-006", "name": "曲池穴定位与进针", "description": "准确定位曲池穴并完成毫针进针操作（大肠经合穴）", "steps": ["取穴：屈肘成直角，肘横纹外侧端与肱骨外上髁连线中点", "消毒：常规消毒", "进针：直刺0.8-1.5寸", "得气观察：局部酸胀感向前臂桡侧放散"], "scoring": [{"criterion": "定位准确（屈肘直角位）", "maxScore": 3}, {"criterion": "消毒规范", "maxScore": 2}, {"criterion": "进针深度恰当", "maxScore": 2}, {"criterion": "得气判断", "maxScore": 3}], "pitfalls": ["未嘱患者屈肘：曲池定位必须以屈肘直角为前提", "进针偏内：注意避开肘窝血管"]}, {"id": "acup-op-007", "name": "百会穴定位与进针", "description": "准确定位百会穴并完成进针操作（督脉穴，诸阳之会）", "steps": ["取穴：前发际正中直上5寸，或两耳尖连线中点", "消毒：头部皮肤消毒", "进针：平刺0.5-0.8寸（沿皮下刺入，不可直刺）", "得气观察：局部头皮胀重感"], "scoring": [{"criterion": "定位准确", "maxScore": 3}, {"criterion": "进针方向正确（平刺）", "maxScore": 3}, {"criterion": "安全深度控制", "maxScore": 2}, {"criterion": "得气描述", "maxScore": 2}], "pitfalls": ["直刺危险：百会穴下方为颅骨及矢状窦，必须平刺沿皮下", "定位偏高：注意发际线位置因人而异，用两耳尖连线法辅助"]}, {"id": "acup-op-008", "name": "关元穴定位与进针", "description": "准确定位关元穴并完成进针操作（任脉穴，小肠募穴）", "steps": ["取穴：前正中线脐下3寸", "消毒：常规消毒", "进针：直刺1-1.5寸（嘱患者排尿后取仰卧位）", "得气观察：局部沉胀感向会阴部放散"], "scoring": [{"criterion": "定位准确（脐下3寸）", "maxScore": 3}, {"criterion": "术前告知（排空膀胱）", "maxScore": 2}, {"criterion": "进针手法正确", "maxScore": 2}, {"criterion": "安全深度控制", "maxScore": 3}], "pitfalls": ["未嘱排尿：膀胱充盈时针刺关元可能伤及膀胱", "深度失控：关元不宜过深，掌握1-1.5寸"]}, {"id": "acup-op-009", "name": "中脘穴定位与进针", "description": "准确定位中脘穴并完成进针操作（任脉穴，胃募穴，八会穴之腑会）", "steps": ["取穴：前正中线脐上4寸（胸剑联合至脐连线中点）", "消毒：常规消毒", "进针：直刺1-1.5寸", "得气观察：局部胀感向胃脘部扩散"], "scoring": [{"criterion": "定位准确", "maxScore": 3}, {"criterion": "消毒规范", "maxScore": 2}, {"criterion": "进针手法正确", "maxScore": 3}, {"criterion": "得气描述", "maxScore": 2}], "pitfalls": ["定位偏差：以脐到胸剑联合的中点为准，勿用骨度分寸粗略估算", "勿过深：中脘下方为胃，过深可刺入胃腔"]}, {"id": "acup-op-010", "name": "列缺穴定位与进针", "description": "准确定位列缺穴并完成进针操作（肺经络穴，八脉交会穴通任脉）", "steps": ["取穴：桡骨茎突上方，腕横纹上1.5寸，肱桡肌与拇长展肌腱之间", "消毒：常规消毒", "进针：向上斜刺0.3-0.5寸", "得气观察：局部酸胀感向拇指方向传导"], "scoring": [{"criterion": "定位准确（双手交叉示指尽处）", "maxScore": 3}, {"criterion": "消毒规范", "maxScore": 2}, {"criterion": "进针方向正确（向上斜刺）", "maxScore": 2}, {"criterion": "得气判断", "maxScore": 3}], "pitfalls": ["定位模糊：可用简法——两手虎口交叉，示指压在桡骨茎突上，指尖下即为列缺", "直刺错误：列缺应向上斜刺而非直刺"]}, {"id": "acup-op-011", "name": "阳陵泉穴定位与进针", "description": "准确定位阳陵泉穴并完成毫针进针操作（胆经合穴，八会穴之筋会）", "steps": ["取穴：腓骨小头前下方凹陷中", "消毒：常规消毒", "进针：直刺1-1.5寸", "得气观察：局部酸胀感向小腿外侧至足背放散"], "scoring": [{"criterion": "定位准确", "maxScore": 3}, {"criterion": "消毒规范", "maxScore": 2}, {"criterion": "进针手法正确", "maxScore": 2}, {"criterion": "得气描述正确", "maxScore": 3}], "pitfalls": ["腓骨小头辨识不清：屈膝位更容易触及腓骨小头", "定位偏下：注意是前下方凹陷，不是正下方"]}, {"id": "acup-op-012", "name": "委中穴定位与进针", "description": "准确定位委中穴并完成进针操作（膀胱经合穴，四总穴之一）", "steps": ["取穴：腘横纹中点，股二头肌腱与半腱肌腱之间", "消毒：常规消毒", "进针：直刺0.5-1寸；或三棱针点刺放血", "得气观察：局部胀感向小腿后侧传导"], "scoring": [{"criterion": "定位准确（腘横纹中点）", "maxScore": 3}, {"criterion": "消毒规范", "maxScore": 2}, {"criterion": "避开腘血管", "maxScore": 3}, {"criterion": "操作安全", "maxScore": 2}], "pitfalls": ["刺中腘动脉：委中正中有腘动脉通过，应严格掌握深度和方向", "体位不当：应取俯卧位，小腿放松"]}]}, {"id": "tuina-op", "name": "推拿手法", "type": "operation", "weight": "常考", "items": [{"id": "tuina-001", "name": "一指禅推法", "description": "用拇指指端或罗纹面着力于施术部位，通过腕关节的屈伸带动拇指做节律性摆动", "steps": ["沉肩：肩部放松自然下垂", "垂肘：肘关节屈曲120-140度，低于腕部", "悬腕：腕关节自然悬屈", "掌虚：虎口分开，其余四指自然微屈", "指实：拇指指端着力于治疗部位", "前臂做主动摆动带动腕关节摆动，使拇指交替按压和放松"], "scoring": [{"criterion": "沉肩垂肘悬腕掌虚指实", "maxScore": 3}, {"criterion": "拇指吸定不移", "maxScore": 2}, {"criterion": "节律均匀（120-160次/分钟）", "maxScore": 3}, {"criterion": "力度渗透持久", "maxScore": 2}], "pitfalls": ["腕部用力而非前臂发力：应以前臂为动力源，腕关节仅被动摆动", "拇指移动：一指禅要求吸定不移，不是推擦移动", "耸肩：肩部紧张导致力量无法传导"]}, {"id": "tuina-002", "name": "滚法", "description": "以第5掌指关节背侧吸附于施术部位，前臂旋转带动腕关节屈伸使手背尺侧做连续滚压运动", "steps": ["术式：半握拳，第5掌指关节及小鱼际肌尺侧着力", "沉肩：肩部放松", "前臂做旋转运动，带动腕关节屈伸", "施术部位由手背尺侧→小鱼际→第5掌指关节背侧交替滚压", "频率120-160次/分钟，用力均匀柔和"], "scoring": [{"criterion": "着力部位正确", "maxScore": 3}, {"criterion": "前臂旋转流畅", "maxScore": 2}, {"criterion": "节律均匀连贯", "maxScore": 3}, {"criterion": "力度持久", "maxScore": 2}], "pitfalls": ["以肘代臂：滚法的动力在前臂，不是肘部", "操作生硬：滚法追求柔和渗透，非生硬的拖动", "频率不均：过快或过慢均影响疗效"]}, {"id": "tuina-003", "name": "按揉法", "description": "用手指或手掌着力于施术部位，垂直用力按压的同时做小幅度的环形揉动", "steps": ["选择着力部位：指端、指腹或掌根", "将着力部位置于施术穴位或部位", "先垂直按压达一定深度得气", "在按压基础上做小幅度环形揉动（揉动或可配合用力）", "用力由轻到重再到轻，每穴1-3分钟"], "scoring": [{"criterion": "按压深度得当", "maxScore": 3}, {"criterion": "揉动幅度合适", "maxScore": 2}, {"criterion": "力度由轻到重再由重到轻", "maxScore": 3}, {"criterion": "操作时间控制恰当", "maxScore": 2}], "pitfalls": ["先揉后按：应为先按压得气再揉，不是先揉后按", "揉动幅度过大：应为小幅度环形揉动，非大幅度的推揉"]}, {"id": "tuina-004", "name": "拿法", "description": "用拇指与其余四指相对捏提施术部位筋肉，一紧一松地反复操作", "steps": ["拇指与示、中二指（或余四指）张开呈钳形", "相对用力捏住施术部位筋肉", "做有节律的捏提、放松动作", "自上而下或自下而上循序操作", "力度以受术者酸胀舒适为度"], "scoring": [{"criterion": "手势正确（钳形捏提）", "maxScore": 3}, {"criterion": "节律均匀有力", "maxScore": 2}, {"criterion": "力度得当", "maxScore": 3}, {"criterion": "操作均匀连贯", "maxScore": 2}], "pitfalls": ["掐而非拿：指尖用力掐为掐法，拿法用指腹捏提", "力度过猛：造成皮下瘀血，应柔和渗透"]}]}, {"id": "cupping-op", "name": "拔罐操作", "type": "operation", "weight": "常考", "items": [{"id": "cup-001", "name": "闪火拔罐法", "description": "用止血钳夹持酒精棉球点燃后伸入罐内闪燃排氧，迅速将罐吸附于体表", "steps": ["准备：选择合适口径的火罐，检查罐口光滑无缺损", "制作火棒：止血钳夹持95%酒精棉球，挤去多余酒精", "点燃火棒，伸入火罐内旋转1-2圈使罐内氧气燃尽", "迅速将罐口扣于选定穴位或部位", "轻拉罐体确认吸附牢固", "留罐时间：5-15分钟"], "scoring": [{"criterion": "罐具检查（罐口光滑）", "maxScore": 2}, {"criterion": "火棒制作（挤去多余酒精）", "maxScore": 2}, {"criterion": "闪火动作规范", "maxScore": 3}, {"criterion": "吸附牢固", "maxScore": 2}, {"criterion": "留罐时间控制", "maxScore": 1}], "pitfalls": ["酒精过多滴落烫伤：必须挤去多余酒精", "罐口过热：罐口温度过高可烫伤皮肤", "吸附不牢：闪火后移罐速度太慢"]}, {"id": "cup-002", "name": "走罐法", "description": "在施术部位涂润滑剂后吸附火罐，推拉罐体来回滑动", "steps": ["选罐：选用口径较大、罐口光滑的玻璃罐", "涂润滑剂：在施术部位涂凡士林或按摩油", "闪火拔罐使罐吸附于体表", "术者握住罐体，均匀用力向一个方向推拉", "罐口边缘始终紧贴皮肤，走罐距离5-10cm", "至皮肤潮红或瘀点为度，起罐"], "scoring": [{"criterion": "选罐合适", "maxScore": 2}, {"criterion": "涂润滑剂（不可省略）", "maxScore": 2}, {"criterion": "推拉力度均匀", "maxScore": 3}, {"criterion": "走罐距离方向正确", "maxScore": 2}, {"criterion": "起罐手法正确", "maxScore": 1}], "pitfalls": ["未涂润滑剂：直接走罐会造成皮肤损伤疼痛", "推拉不匀：导致罐体吸附中断脱落", "走罐方向紊乱：应为单向推拉，肩背部从上向下"]}, {"id": "cup-003", "name": "刺络拔罐法", "description": "先用三棱针或皮肤针在施术部位点刺放血，再在刺血部位拔罐吸出瘀血", "steps": ["选穴：选取有明显瘀血或疼痛的穴位", "消毒：用碘酒和75%酒精消毒刺血部位", "刺血：三棱针点刺3-5下或皮肤针叩刺至微出血", "拔罐：在刺血部位闪火拔罐", "留罐：留罐5-10分钟", "起罐后消毒针眼，覆盖无菌敷料"], "scoring": [{"criterion": "刺前消毒规范", "maxScore": 3}, {"criterion": "刺血操作正确", "maxScore": 3}, {"criterion": "拔罐吸附正常", "maxScore": 2}, {"criterion": "起罐后处理正确", "maxScore": 2}], "pitfalls": ["消毒不严：刺络操作必须严格消毒，防止感染", "刺血过深：三棱针浅刺即可，勿伤深层血管"]}]}, {"id": "moxa-op", "name": "艾灸操作", "type": "operation", "weight": "常考", "items": [{"id": "moxa-001", "name": "温和灸", "description": "将艾条一端点燃，距皮肤2-3cm施灸，使局部温热无灼痛", "steps": ["准备：取清艾条一根，点燃一端", "取穴：准确定位施灸穴位", "将点燃端对准穴位，距皮肤约2-3cm固定悬灸", "施灸过程中随时询问患者热感，保持温热无灼痛", "施灸时间：每穴10-15分钟，至皮肤潮红为度"], "scoring": [{"criterion": "艾条操作安全", "maxScore": 2}, {"criterion": "距离控制得当", "maxScore": 3}, {"criterion": "温度感知及时调整", "maxScore": 2}, {"criterion": "时间控制及皮肤潮红", "maxScore": 3}], "pitfalls": ["距离过近烫伤：艾灰掉落是常见烫伤原因，及时弹灰", "距离过远无效：超过5cm几乎无温热效应"]}, {"id": "moxa-002", "name": "雀啄灸", "description": "将点燃的艾条距穴位一上一下如雀啄食般移动施灸", "steps": ["准备：点燃艾条一端", "将点燃端对准穴位，距皮肤约2-3cm", "做一上一下的雀啄样移动，上下幅度约1-2cm", "注意勿触及皮肤", "每穴3-5分钟，至局部皮肤潮红"], "scoring": [{"criterion": "艾条操作安全", "maxScore": 2}, {"criterion": "上下移动节律均匀", "maxScore": 3}, {"criterion": "距离控制（勿触及皮肤）", "maxScore": 3}, {"criterion": "时间控制", "maxScore": 2}], "pitfalls": ["移动幅度过大：幅度超过3cm变为温和灸而非雀啄灸", "触及皮肤：雀啄动作太快可能误触皮肤造成烫伤"]}, {"id": "moxa-003", "name": "隔姜灸", "description": "在穴位上放姜片再放艾炷点燃施灸，利用生姜辛温之性增强温通效果", "steps": ["制姜片：新鲜生姜切约0.3cm厚片，用针穿刺数孔", "制艾炷：取陈艾绒捏成圆锥形艾炷（底部直径约1cm）", "将姜片放于穴位上，艾炷置于姜片中央", "点燃艾炷顶端，待燃尽后更换新艾炷", "连续灸3-7壮，至皮肤潮红湿润", "灸后清洁局部，保持干燥"], "scoring": [{"criterion": "姜片制作规范（厚度+穿孔）", "maxScore": 2}, {"criterion": "艾炷制作正确", "maxScore": 2}, {"criterion": "操作安全无烫伤", "maxScore": 3}, {"criterion": "壮数及皮肤反应控制", "maxScore": 3}], "pitfalls": ["姜片过薄：姜片＜0.2cm容易烫伤皮肤", "未穿孔：不穿孔的热力传导不够", "艾炷脱落：姜片未放平或艾炷放置不稳"]}]}, {"id": "defense", "name": "现场答辩", "type": "oral", "weight": "必考", "items": [{"id": "def-001", "name": "胃痛——肝气犯胃证", "question": "患者男，45岁。胃脘胀痛反复发作半年，嗳气频作，每因情志不遂而加重，大便不畅，舌苔薄白，脉弦。请进行辨证论治。", "answerFramework": ["辨证：肝气犯胃证", "病机：肝郁气滞，横逆犯胃，胃失和降", "治法：疏肝理气，和胃止痛", "代表方：柴胡疏肝散加减", "方解：柴胡疏肝解郁为君；香附、川芎行气活血为臣；枳壳、陈皮理气和胃；芍药、甘草缓急止痛。加减：嗳气重加旋覆花、代赭石"], "relatedKnowledge": ["中诊：四诊/问诊/切诊", "内科：胃痛/肝气犯胃证", "方剂：柴胡疏肝散"]}, {"id": "def-002", "name": "咳嗽——痰湿蕴肺证", "question": "患者女，52岁。咳嗽反复发作3年，咳声重浊，痰白而黏，每晨起咳甚，伴胸闷脘痞，纳少，舌苔白腻，脉濡滑。请辨证论治。", "answerFramework": ["辨证：痰湿蕴肺证", "病机：脾虚生痰，痰湿蕴肺，肺失宣降", "治法：健脾燥湿，化痰止咳", "代表方：二陈汤合三子养亲汤加减", "方解：半夏燥湿化痰为君；陈皮理气化痰；茯苓健脾渗湿；苏子、白芥子、莱菔子降气化痰。加减：痰多胸闷加苍术、厚朴"], "relatedKnowledge": ["中诊：望诊/闻诊/切诊", "内科：咳嗽/痰湿蕴肺证", "方剂：二陈汤"]}, {"id": "def-003", "name": "头痛——风寒证", "question": "患者男，28岁。昨日受凉后头痛连及项背，恶风畏寒，遇风加重，口不渴，舌苔薄白，脉浮紧。请辨证论治。", "answerFramework": ["辨证：风寒头痛", "病机：风寒外袭，清阳被遏，脉络不通", "治法：疏风散寒，通络止痛", "代表方：川芎茶调散加减", "方解：川芎行血中之气祛风止痛为君；羌活、白芷、细辛、防风祛风散寒；薄荷清利头目；荆芥解表散寒。加减：巅顶痛加藁本"], "relatedKnowledge": ["中诊：四诊/切诊", "内科：头痛/风寒证", "中药：川芎/羌活/白芷/细辛"]}, {"id": "def-004", "name": "心悸——心脾两虚证", "question": "患者女，42岁。心悸怔忡半年，伴面色萎黄，失眠多梦，倦怠乏力，纳差便溏，舌淡苔薄白，脉细弱。请辨证论治。", "answerFramework": ["辨证：心脾两虚证", "病机：心脾两虚，气血生化不足，心失所养", "治法：补血养心，益气健脾", "代表方：归脾汤加减", "方解：人参、黄芪、白术、炙甘草益气健脾；当归、龙眼肉补血养心；茯神、酸枣仁、远志安神定悸；木香理气醒脾"], "relatedKnowledge": ["中诊：望诊/切诊", "内科：心悸/心脾两虚证", "方剂：归脾汤"]}, {"id": "def-005", "name": "水肿——脾阳虚衰证", "question": "患者男，60岁。双下肢水肿半年，按之凹陷不易恢复，伴脘腹胀闷，纳减便溏，面色萎黄，神疲乏力，舌淡苔白滑，脉沉缓。请辨证论治。", "answerFramework": ["辨证：脾阳虚衰证（阴水）", "病机：脾阳虚衰，运化无权，水湿内停", "治法：温运脾阳，以利水湿", "代表方：实脾饮加减", "方解：干姜、附子温运脾阳；白术、茯苓健脾利水；木瓜、大腹皮、厚朴理气化湿；木香行气醒脾；甘草调和诸药"], "relatedKnowledge": ["中诊：望诊/切诊", "内科：水肿/脾阳虚衰证", "方剂：实脾饮"]}, {"id": "def-006", "name": "痛经——寒凝血瘀证", "question": "患者女，22岁。经前或经期小腹冷痛拒按，得热痛减，经血量少色暗有块，畏寒肢冷，舌暗苔白，脉沉紧。请辨证论治。", "answerFramework": ["辨证：寒凝血瘀证", "病机：寒邪客于胞宫，血为寒凝，瘀阻胞脉", "治法：温经散寒，化瘀止痛", "代表方：少腹逐瘀汤加减", "方解：小茴香、干姜、肉桂温经散寒；蒲黄、五灵脂活血化瘀止痛；当归、川芎养血活血；延胡索、没药理气化瘀止痛"], "relatedKnowledge": ["中诊：望诊/问诊", "妇科：痛经/寒凝血瘀证", "方剂：少腹逐瘀汤"]}, {"id": "def-007", "name": "崩漏——脾虚证", "question": "患者女，38岁。经血非时而下，量多如注或淋漓不净，色淡质稀，伴面色萎黄，气短懒言，纳差便溏，舌淡苔薄白，脉细弱。请辨证论治。", "answerFramework": ["辨证：脾虚证", "病机：脾虚气陷，统摄无权，冲任不固", "治法：补气摄血，固冲止崩", "代表方：固本止崩汤加减", "方解：人参、黄芪、白术益气健脾摄血；熟地、当归养血和血；炮姜温中止血。加减：出血多加乌贼骨、棕榈炭"], "relatedKnowledge": ["中诊：望诊/问诊", "妇科：崩漏/脾虚证", "方剂：固本止崩汤"]}, {"id": "def-008", "name": "小儿泄泻——湿热泻", "question": "患儿男，2岁。腹泻3日，泻下稀水夹黏液，色黄臭秽，日行5-6次，肛门红赤，伴发热口渴，小便短赤，舌红苔黄腻，指纹紫滞。请辨证论治。", "answerFramework": ["辨证：湿热泻", "病机：湿热之邪蕴结脾胃，下注大肠，传导失司", "治法：清热利湿，安肠止泻", "代表方：葛根黄芩黄连汤加减", "方解：葛根升清止泻为君；黄芩、黄连清热燥湿为臣；甘草调和诸药。加减：腹痛加木香、白芍"], "relatedKnowledge": ["中诊：望诊/切诊", "儿科：泄泻/湿热泻", "方剂：葛根黄芩黄连汤"]}, {"id": "def-009", "name": "眩晕——肝阳上亢证", "question": "患者男，55岁。头晕目眩反复发作2年，头胀痛，面红目赤，急躁易怒，口苦，失眠多梦，舌红苔黄，脉弦数。血压160/95mmHg。请辨证论治。", "answerFramework": ["辨证：肝阳上亢证", "病机：肝阳上亢，上扰清窍", "治法：平肝潜阳，清火息风", "代表方：天麻钩藤饮加减", "方解：天麻、钩藤平肝息风为君；石决明重镇潜阳；黄芩、栀子清肝泻火；牛膝引血下行；杜仲、桑寄生补肝肾"], "relatedKnowledge": ["中诊：望诊/切诊", "内科：眩晕/肝阳上亢证", "方剂：天麻钩藤饮"]}, {"id": "def-010", "name": "发热——外感风寒证", "question": "患者男，30岁。发热恶寒2日，头痛身痛，无汗，鼻塞流清涕，咳嗽痰白，舌苔薄白，脉浮紧。体温38.2℃。请辨证论治。", "answerFramework": ["辨证：外感风寒表实证", "病机：风寒袭表，卫阳被遏，肺气失宣", "治法：辛温解表，宣肺散寒", "代表方：麻黄汤加减", "方解：麻黄发汗解表宣肺平喘为君；桂枝解肌发表助麻黄发汗为臣；杏仁降肺止咳；炙甘草调和诸药"], "relatedKnowledge": ["中诊：四诊", "内科：感冒/风寒证", "方剂：麻黄汤"]}]}]};
  }
  container.innerHTML = '';
  render(container, data);
}

// ---- Main render ----
function render(container, data) {
  var progress = getProgress();
  var categories = data.categories;
  var activeCatId = null;
  var activeItemId = null;

  // Build layout
  var html = '<div class="pe-layout">';

  // Left sidebar
  html += '<div class="pe-sidebar" id="peSidebar"><h3 style="font-size:.78rem;padding:10px 14px;color:#7a4e36;border-bottom:1px solid #e8ddd0;font-weight:600">📋 考点目录</h3>';
  categories.forEach(function(cat, ci) {
    var catOpen = ci === 0;
    html += '<h3 class="pe-cat-toggle ' + (catOpen ? 'open' : '') + '" data-cat="' + cat.id + '">' +
      '<span class="pe-arrow">▶</span> ' + cat.name + ' <span style="font-size:.6rem;color:#c9a87c">(' + cat.items.length + ')</span></h3>' +
      '<div class="pe-cat-items ' + (catOpen ? 'show' : '') + '" data-cat="' + cat.id + '">';
    cat.items.forEach(function(item) {
      var p = progress[item.id];
      var statusIcon = (p && p.status === 'mastered') ? '✔️' : '⏳';
      html += '<div class="pe-cat-item' + (ci === 0 && cat.items.indexOf(item) === 0 ? ' active' : '') + '" data-cat="' + cat.id + '" data-item="' + item.id + '">' +
        '<span class="pe-status">' + statusIcon + '</span> ' + item.name + '</div>';
    });
    html += '</div>';
  });
  html += '</div>';

  // Right content
  var firstCat = categories[0];
  var firstItem = firstCat.items[0];
  html += '<div class="pe-main" id="peMain">';
  html += renderItemDetail(firstCat, firstItem, progress);
  html += '</div>';

  html += '</div>'; // .pe-layout
  container.innerHTML = html;
  // 同步考点目录折叠状态(与主侧栏按钮一致)
  var _sCb = document.getElementById('sidebarCollapseBtn');
  var _peSb = container.querySelector('.pe-sidebar');
  if (_peSb && _sCb && !_sCb.classList.contains('show')) _peSb.classList.add('collapsed');

  // Bind sidebar events
  bindSidebarEvents(container, categories, progress);
}

function bindSidebarEvents(container, categories, progress) {
  // Category toggle
  container.querySelectorAll('.pe-cat-toggle').forEach(function(el) {
    el.addEventListener('click', function() {
      el.classList.toggle('open');
      var items = container.querySelector('.pe-cat-items[data-cat="' + el.dataset.cat + '"]');
      if (items) items.classList.toggle('show');
    });
  });

  // Item click
  container.querySelectorAll('.pe-cat-item').forEach(function(el) {
    el.addEventListener('click', function() {
      var catId = el.dataset.cat;
      var itemId = el.dataset.item;

      // Highlight active
      container.querySelectorAll('.pe-cat-item').forEach(function(c) { c.classList.remove('active'); });
      el.classList.add('active');

      // Find data
      var cat = null, item = null;
      categories.forEach(function(c) {
        if (c.id === catId) {
          cat = c;
          c.items.forEach(function(it) { if (it.id === itemId) item = it; });
        }
      });
      if (!item) return;

      // Update main
      var main = document.getElementById('peMain');
      if (main) {
        main.innerHTML = renderItemDetail(cat, item, getProgress());
        bindDetailEvents(item);
      }
    });
  });

  // Mastered toggle (initial)
  var firstMain = document.getElementById('peMain');
  if (firstMain) {
    var firstBtn = firstMain.querySelector('.pe-master-btn');
    if (firstBtn && firstBtn.dataset.item) bindMasteredToggle(firstBtn);
  }
}

function renderItemDetail(cat, item, progress) {
  var html = '<div class="pe-detail-card">';
  var weightLabel = cat.weight === '必考' ? '必考' : '常考';
  var weightClass = cat.weight === '必考' ? 'pe-w-required' : 'pe-w-common';

  html += '<h3>' + item.name + ' <span class="pe-weight ' + weightClass + '">' + weightLabel + '</span></h3>';
  if (item.description) html += '<p style="font-size:.8rem;color:#a09080;margin-bottom:12px">' + item.description + '</p>';

  var isMastered = progress[item.id] && progress[item.id].status === 'mastered';

  if (cat.type === 'operation') {
    // Operation type
    if (item.steps && item.steps.length > 0) {
      html += '<div class="pe-section"><div class="pe-section-title">📝 操作步骤</div>' +
        '<ol class="pe-steps">' + item.steps.map(function(s) { return '<li>' + s + '</li>'; }).join('') + '</ol></div>';
    }
    if (item.scoring && item.scoring.length > 0) {
      html += '<div class="pe-section"><div class="pe-section-title">📊 评分标准</div>' +
        '<table class="pe-scoring-table"><thead><tr><th>评分项</th><th style="text-align:center;width:60px">分值</th></tr></thead><tbody>' +
        item.scoring.map(function(s) {
          return '<tr><td>' + s.criterion + '</td><td style="text-align:center;font-weight:600;color:#5b3a29">' + s.maxScore + '分</td></tr>';
        }).join('') +
        '<tr style="font-weight:600"><td>总分</td><td style="text-align:center;color:#c9a87c">' +
        item.scoring.reduce(function(sum, s) { return sum + s.maxScore; }, 0) + '分</td></tr>' +
        '</tbody></table></div>';
    }
    if (item.pitfalls && item.pitfalls.length > 0) {
      html += '<div class="pe-section"><div class="pe-section-title">⚠️ 常见失分点</div>' +
        '<ul class="pe-pitfalls">' + item.pitfalls.map(function(pf) { return '<li>' + pf + '</li>'; }).join('') + '</ul></div>';
    }
  } else if (cat.type === 'oral') {
    // Oral/defense type
    html += '<div class="pe-section"><div class="pe-section-title">📋 病例题干</div>' +
      '<div class="pe-question-box">' + item.question + '</div></div>';

    html += '<div class="pe-section"><div class="pe-section-title">💬 考场模拟</div>' +
      '<p style="font-size:.78rem;color:#a09080;margin-bottom:8px">建议先自行口述回答，再查看参考答案框架</p>' +
      '<button class="pe-answer-toggle" data-item="' + item.id + '" id="peAnsBtn">👁️ 查看答题框架</button>' +
      '<div class="pe-answer-content" id="peAnsContent">' +
      '<ol style="margin:0 0 8px 18px">' +
      item.answerFramework.map(function(a) { return '<li>' + a + '</li>'; }).join('') +
      '</ol></div></div>';

    if (item.relatedKnowledge && item.relatedKnowledge.length > 0) {
      html += '<div class="pe-section"><div class="pe-section-title">🔗 关联知识点</div>' +
        '<div class="pe-related">' +
        item.relatedKnowledge.map(function(k) { return '<span class="pe-related-tag">' + k + '</span>'; }).join('') +
        '</div></div>';
    }
  }

  // Mastered toggle button
  html += '<button class="pe-master-btn ' + (isMastered ? 'pe-btn-mastered' : 'pe-btn-pending') + '" data-item="' + item.id + '" id="peMasterBtn">' +
    (isMastered ? '✔️ 已掌握' : '⏳ 标记已掌握') + '</button>';

  html += '</div>'; // .pe-detail-card
  return html;
}

function bindDetailEvents(item) {
  // Answer toggle button
  var ansBtn = document.getElementById('peAnsBtn');
  if (ansBtn) {
    ansBtn.addEventListener('click', function() {
      var content = document.getElementById('peAnsContent');
      if (content) {
        var showing = content.classList.contains('show');
        if (showing) {
          content.classList.remove('show');
          ansBtn.textContent = '👁️ 查看答题框架';
        } else {
          content.classList.add('show');
          ansBtn.textContent = '🙈 收起答题框架';
        }
      }
    });
  }

  // Mastered toggle
  var masterBtn = document.getElementById('peMasterBtn');
  if (masterBtn) bindMasteredToggle(masterBtn, item);
}

function bindMasteredToggle(btn) {
  btn.addEventListener('click', function() {
    var itemId = btn.dataset.item;
    if (!itemId) return;
    var p = getProgress();
    var current = p[itemId] && p[itemId].status === 'mastered';
    saveProgress(itemId, current ? 'pending' : 'mastered');
    // Update button
    if (current) {
      btn.classList.remove('pe-btn-mastered');
      btn.classList.add('pe-btn-pending');
      btn.textContent = '⏳ 标记已掌握';
    } else {
      btn.classList.remove('pe-btn-pending');
      btn.classList.add('pe-btn-mastered');
      btn.textContent = '✔️ 已掌握';
    }
    // Update sidebar status icon
    var sidebarItem = document.querySelector('.pe-cat-item[data-item="' + itemId + '"]');
    if (sidebarItem) {
      var statusSpan = sidebarItem.querySelector('.pe-status');
      if (statusSpan) statusSpan.textContent = current ? '⏳' : '✔️';
    }
  });
}

// ---- Expose to app.js ----
// Called by app.js renderPractical() after injecting #practical-tab
window.renderPractical = function() { init(); };

})();
