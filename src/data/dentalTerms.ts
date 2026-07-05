/* ==================== 口腔医学术语词库（含拼音首字母） ==================== */

export interface TermGroup {
  category: string
  terms: { text: string; pinyin: string }[]
}

export const dentalTerms: TermGroup[] = [
  {
    category: '主诉',
    terms: [
      { text: '牙齿疼痛', pinyin: 'yctt' },
      { text: '牙龈出血', pinyin: 'yycx' },
      { text: '牙齿松动', pinyin: 'ycsd' },
      { text: '冷热刺激痛', pinyin: 'lrcjt' },
      { text: '夜间自发痛', pinyin: 'yjzft' },
      { text: '咀嚼时疼痛', pinyin: 'jjsstt' },
      { text: '牙龈肿痛', pinyin: 'yyzt' },
      { text: '牙齿敏感', pinyin: 'ycmg' },
      { text: '口腔异味', pinyin: 'kqyw' },
      { text: '牙齿发黑', pinyin: 'ycfh' },
      { text: '牙齿缺失', pinyin: 'ycqs' },
      { text: '义齿不适', pinyin: 'ycbs' },
      { text: '张口受限', pinyin: 'zksx' },
      { text: '面部肿胀', pinyin: 'mbzz' },
      { text: '牙齿不齐', pinyin: 'ycbq' },
      { text: '牙齿颜色偏黄', pinyin: 'ycysph' },
      { text: '笑时不敢露齿', pinyin: 'xsbglc' },
    ],
  },
  {
    category: '现病史',
    terms: [
      { text: '患者于', pinyin: 'hzy' },
      { text: '天前无明显诱因出现', pinyin: 'tqwmx' },
      { text: '周前开始出现', pinyin: 'zqkscx' },
      { text: '月前因', pinyin: 'yqy' },
      { text: '年前曾于外院行', pinyin: 'nqcywyx' },
      { text: '曾于外院行根管治疗', pinyin: 'cywyxggzl' },
      { text: '曾于外院行充填治疗', pinyin: 'cywyxctzl' },
      { text: '自发病以来一般情况可', pinyin: 'zfblyybqkk' },
      { text: '疼痛呈持续性', pinyin: 'ttccxx' },
      { text: '疼痛呈阵发性', pinyin: 'ttczfx' },
      { text: '夜间疼痛加重', pinyin: 'yjttjz' },
      { text: '服药后症状缓解', pinyin: 'fyhzzhj' },
      { text: '症状反复发作', pinyin: 'zzffzz' },
      { text: '无发热、恶心、呕吐等伴随症状', pinyin: 'wfrxotdbszz' },
      { text: '口腔卫生习惯良好', pinyin: 'kqwsxglh' },
      { text: '否认近期外伤史', pinyin: 'frjqwss' },
      { text: '未经任何治疗', pinyin: 'wjrhzl' },
      { text: '自行服用止痛药', pinyin: 'zxfyztoy' },
    ],
  },
  {
    category: '既往史',
    terms: [
      { text: '否认高血压、糖尿病等系统性疾病史', pinyin: 'frgxytnbdxtxjbs' },
      { text: '否认心脏病史', pinyin: 'frxzbs' },
      { text: '否认肝炎、结核等传染病史', pinyin: 'frgyjhdcrbs' },
      { text: '否认药物及食物过敏史', pinyin: 'frywjswgms' },
      { text: '青霉素过敏', pinyin: 'qmsgm' },
      { text: '磺胺类药物过敏', pinyin: 'halywgm' },
      { text: '高血压病史', pinyin: 'gxybs' },
      { text: '糖尿病史', pinyin: 'tnbs' },
      { text: '心脏病史', pinyin: 'xzbs' },
      { text: '肝炎病史', pinyin: 'gybs' },
      { text: '否认手术外伤史', pinyin: 'frsswss' },
      { text: '否认输血史', pinyin: 'frsxs' },
      { text: '无吸烟饮酒史', pinyin: 'wxyyjs' },
      { text: '偶有饮酒', pinyin: 'oyyj' },
      { text: '长期吸烟', pinyin: 'cqxy' },
    ],
  },
  {
    category: '诊断',
    terms: [
      { text: '慢性牙髓炎', pinyin: 'mxysy' },
      { text: '急性牙髓炎', pinyin: 'jxysy' },
      { text: '慢性根尖周炎', pinyin: 'mxgjzy' },
      { text: '急性根尖周炎', pinyin: 'jxgjzy' },
      { text: '龋病（浅龋）', pinyin: 'qbqq' },
      { text: '龋病（中龋）', pinyin: 'qbzq' },
      { text: '龋病（深龋）', pinyin: 'qbsq' },
      { text: '慢性牙周炎', pinyin: 'mxyzy' },
      { text: '侵袭性牙周炎', pinyin: 'qxxyzy' },
      { text: '牙龈炎', pinyin: 'yyy' },
      { text: '智齿冠周炎', pinyin: 'zcgzy' },
      { text: '牙折', pinyin: 'yz' },
      { text: '楔状缺损', pinyin: 'xzqs' },
      { text: '牙隐裂', pinyin: 'yyl' },
      { text: '安氏I类错颌畸形', pinyin: 'as1lchjx' },
      { text: '安氏II类错颌畸形', pinyin: 'as2lchjx' },
      { text: '安氏III类错颌畸形', pinyin: 'as3lchjx' },
      { text: '深覆颌', pinyin: 'sfh' },
      { text: '开颌', pinyin: 'kh' },
      { text: '反颌', pinyin: 'fh' },
      { text: '牙列缺损', pinyin: 'ylqs' },
      { text: '牙列缺失', pinyin: 'ylqs2' },
      { text: '牙体缺损', pinyin: 'ytqs' },
      { text: '乳牙滞留', pinyin: 'ryzl' },
      { text: '多生牙', pinyin: 'dsy' },
      { text: '阻生牙', pinyin: 'zsy' },
      { text: '口腔溃疡', pinyin: 'kqky' },
      { text: '颞下颌关节紊乱', pinyin: 'nxhgjwl' },
      { text: '外源性色素沉着', pinyin: 'wyxsscz' },
    ],
  },
  {
    category: '治疗',
    terms: [
      { text: '树脂充填', pinyin: 'szct' },
      { text: '玻璃离子充填', pinyin: 'blizct' },
      { text: '根管治疗', pinyin: 'ggzl' },
      { text: '根管再治疗', pinyin: 'ggzzl' },
      { text: '根尖切除术', pinyin: 'gjqcs' },
      { text: '龈上洁治', pinyin: 'ysjz' },
      { text: '龈下刮治及根面平整', pinyin: 'yxgzjgmpz' },
      { text: '牙周翻瓣术', pinyin: 'yzfbs' },
      { text: '牙周固定', pinyin: 'yzgd' },
      { text: '拔牙术', pinyin: 'bys' },
      { text: '阻生牙拔除术', pinyin: 'zsybcs' },
      { text: '种植体植入术', pinyin: 'zztzrs' },
      { text: '种植二期手术', pinyin: 'zzeqss' },
      { text: '种植上部修复', pinyin: 'zzsbxf' },
      { text: '上颌窦提升术', pinyin: 'shdtss' },
      { text: '全瓷冠修复', pinyin: 'qcgxf' },
      { text: '烤瓷熔附金属冠', pinyin: 'kcrfjsg' },
      { text: '嵌体修复', pinyin: 'qtxf' },
      { text: '活动义齿修复', pinyin: 'hdycxf' },
      { text: '隐形矫治', pinyin: 'yxjz' },
      { text: '固定托槽矫治', pinyin: 'gdtcjz' },
      { text: '早期干预矫治', pinyin: 'zqgyjz' },
      { text: '冷光美白', pinyin: 'lgmb' },
      { text: '瓷贴面', pinyin: 'ctm' },
      { text: '窝沟封闭', pinyin: 'wgfb' },
      { text: '涂氟防龋', pinyin: 'tffq' },
      { text: '拔除乳牙', pinyin: 'bcry' },
      { text: '间隙保持器', pinyin: 'jxbcq' },
      { text: '局部浸润麻醉', pinyin: 'jbjrmz' },
      { text: '阻滞麻醉', pinyin: 'zzmz' },
      { text: '数字化口内扫描', pinyin: 'szhknsm' },
      { text: 'CBCT三维影像检查', pinyin: 'cbct' },
      { text: '口腔卫生宣教', pinyin: 'kqwsxj' },
      { text: '冲洗上药', pinyin: 'cxsy' },
      { text: '切开引流', pinyin: 'qkyl' },
      { text: '缝合', pinyin: 'fh' },
      { text: '拆线', pinyin: 'cx' },
    ],
  },
  {
    category: '处方',
    terms: [
      { text: '阿莫西林克拉维酸钾片', pinyin: 'amxlklwsjp' },
      { text: '甲硝唑片', pinyin: 'jxz' },
      { text: '奥硝唑片', pinyin: 'axz' },
      { text: '头孢克洛胶囊', pinyin: 'tbkljn' },
      { text: '布洛芬缓释胶囊', pinyin: 'blfhsjn' },
      { text: '对乙酰氨基酚片', pinyin: 'dyxajfp' },
      { text: '复方氯己定含漱液', pinyin: 'ffljdhsy' },
      { text: '西吡氯铵含漱液', pinyin: 'xblahsy' },
      { text: '康复新液', pinyin: 'kfxy' },
      { text: '阿替卡因肾上腺素注射液', pinyin: 'atkysssszsy' },
      { text: '盐酸利多卡因注射液', pinyin: 'ysldkyssy' },
      { text: '口服 每日两次 每次一片', pinyin: 'kf' },
      { text: '含漱 每日三次 每次10ml', pinyin: 'hs' },
      { text: '饭后服用', pinyin: 'fhfy' },
      { text: '必要时服用', pinyin: 'bysfy' },
    ],
  },
  {
    category: '医嘱',
    terms: [
      { text: '保持口腔卫生，早晚刷牙', pinyin: 'bckqws' },
      { text: '使用软毛牙刷，Bass刷牙法', pinyin: 'syrmys' },
      { text: '使用含氟牙膏', pinyin: 'syhfyg' },
      { text: '使用牙线或牙缝刷清洁牙缝', pinyin: 'syyx' },
      { text: '避免患侧咀嚼', pinyin: 'bmhcjj' },
      { text: '一周内避免辛辣刺激性食物', pinyin: 'yznbm' },
      { text: '24小时内避免刷牙漱口', pinyin: '24xn' },
      { text: '24小时内勿饮热水', pinyin: '24xn2' },
      { text: '冰敷24小时，每次15分钟', pinyin: 'bf' },
      { text: '戒烟限酒', pinyin: 'jyxj' },
      { text: '控制血糖', pinyin: 'kzxt' },
      { text: '控制血压', pinyin: 'kzxy' },
      { text: '遵医嘱服药', pinyin: 'zyzfy' },
      { text: '定期复查，每3个月一次', pinyin: 'dqfc' },
      { text: '定期复查，每半年一次', pinyin: 'dqfc2' },
      { text: '不适随诊', pinyin: 'bssz' },
      { text: '如有疼痛加重或肿胀，及时就诊', pinyin: 'rytt' },
      { text: '建议每年洁牙1-2次', pinyin: 'jymnjy' },
      { text: '注意口腔卫生习惯', pinyin: 'zykqwsxg' },
    ],
  },
]

// Flatten all terms for searching
export const allTerms = dentalTerms.flatMap((g) => g.terms.map((t) => ({ ...t, category: g.category })))

// Match function: checks if query matches text or pinyin initials
export const searchTerms = (query: string, limit = 8): { text: string; category: string }[] => {
  if (!query.trim()) return []
  const q = query.toLowerCase().trim()

  return allTerms
    .filter((t) => {
      if (t.text.includes(q)) return true
      if (t.pinyin.startsWith(q)) return true
      // Match first letters of each word in pinyin
      if (t.pinyin.replace(/[^a-z]/g, '').startsWith(q)) return true
      return false
    })
    .slice(0, limit)
    .map((t) => ({ text: t.text, category: t.category }))
}
