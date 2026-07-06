/* ==================== 牙科 HIS 系统 Mock 数据库 ==================== */

// --- 类型定义 ---
export type Role = 'doctor' | 'nurse' | 'reception' | 'admin'
export type ApptStatus = 'waiting' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
export type RecordType = '初诊' | '复诊' | '急诊' | '手术'
export type PaymentMethod = '现金' | '微信' | '支付宝' | '医保' | '银行卡'
export type ToothCondition = 'healthy' | 'decay' | 'filled' | 'crown' | 'missing' | 'implant' | 'root_canal' | 'bridge'

export interface User { id: string; name: string; role: Role; title: string; avatar: string }
export interface Patient { id: string; name: string; gender: string; age: number; phone: string; idCard?: string; address?: string; allergies?: string; medicalHistory?: string; tags: string[]; totalVisits: number; lastVisit: string; createdAt: string; notes?: string }
export interface Appointment { id: string; patientId: string; patientName: string; doctorName: string; date: string; time: string; type: string; status: ApptStatus; queueNumber?: string; note?: string }
export interface ToothRecord { tooth: number; condition: ToothCondition; note?: string }
export interface MedicalRecord { id: string; patientId: string; patientName: string; date: string; doctorName: string; type: RecordType; chiefComplaint: string; presentIllness: string; pastHistory: string; oralExam: string; auxExam: string; diagnosis: string; treatmentPlan: string; treatment: string; orders: string; notes: string; teeth: ToothRecord[]; fee?: number }
export interface BillingItem { id: string; patientName: string; patientId: string; date: string; items: { name: string; category: string; price: number; qty: number }[]; total: number; paid: boolean; method?: PaymentMethod; cashier?: string }
export interface Drug { id: string; name: string; category: string; spec: string; stock: number; unit: string; price: number; manufacturer: string; expiryDate: string; alertStock: number }
export interface Imaging { id: string; patientName: string; patientId: string; type: 'CBCT' | '全景片' | '根尖片' | '头颅侧位片'; date: string; doctor: string; status: '已完成' | '待阅片'; report?: string }
export interface ReportData { monthlyRevenue: { month: string; value: number }[]; serviceDistribution: { name: string; value: number }[]; patientStats: { newPatients: number; returningPatients: number; totalVisits: number; avgFee: number } }

// --- 用户 ---
export const users: User[] = [
  { id: 'U1', name: '陈志明', role: 'doctor', title: '主任医师 · 院长', avatar: '陈' },
  { id: 'U2', name: '林婉清', role: 'doctor', title: '副主任医师', avatar: '林' },
  { id: 'U3', name: '张思远', role: 'doctor', title: '主治医师', avatar: '张' },
  { id: 'U4', name: '李敏', role: 'nurse', title: '护士长', avatar: '李' },
  { id: 'U5', name: '赵琳', role: 'reception', title: '前台主管', avatar: '赵' },
  { id: 'U6', name: '系统管理员', role: 'admin', title: '系统管理员', avatar: '管' },
]

// --- 患者 ---
export const patients: Patient[] = [
  { id: 'P001', name: '王晓明', gender: '男', age: 32, phone: '138****6789', allergies: '无', medicalHistory: '无', tags: ['种植牙', 'VIP'], totalVisits: 8, lastVisit: '2026-06-28', createdAt: '2024-03-15', notes: '对诊疗环境要求较高，偏好上午就诊' },
  { id: 'P002', name: '李芳华', gender: '女', age: 28, phone: '139****8901', allergies: '青霉素过敏', medicalHistory: '无', tags: ['隐形矫正'], totalVisits: 3, lastVisit: '2026-06-25', createdAt: '2026-01-10', notes: '矫治器佩戴配合度好' },
  { id: 'P003', name: '张建国', gender: '男', age: 55, phone: '136****4567', allergies: '无', medicalHistory: '高血压（服药控制中）', tags: ['牙周治疗', '慢病'], totalVisits: 15, lastVisit: '2026-06-20', createdAt: '2023-08-22', notes: '血压需每次就诊前测量，控制在140/90以下' },
  { id: 'P004', name: '刘小美', gender: '女', age: 7, phone: '137****2345', allergies: '无', medicalHistory: '无', tags: ['儿童齿科'], totalVisits: 5, lastVisit: '2026-06-15', createdAt: '2025-06-01', notes: '需家长陪同，喜欢看动画片分散注意力' },
  { id: 'P005', name: '陈伟强', gender: '男', age: 41, phone: '135****7890', allergies: '无', medicalHistory: '无', tags: ['牙齿美白', '洁牙'], totalVisits: 6, lastVisit: '2026-07-01', createdAt: '2025-02-14' },
  { id: 'P006', name: '赵丽娜', gender: '女', age: 35, phone: '133****3456', allergies: '磺胺类过敏', medicalHistory: '无', tags: ['牙周治疗', '种植牙'], totalVisits: 12, lastVisit: '2026-06-08', createdAt: '2024-07-03' },
  { id: 'P007', name: '周文博', gender: '男', age: 12, phone: '132****5678', allergies: '无', medicalHistory: '无', tags: ['早期矫治'], totalVisits: 4, lastVisit: '2026-06-05', createdAt: '2025-11-20' },
  { id: 'P008', name: '吴美玲', gender: '女', age: 45, phone: '131****7891', allergies: '无', medicalHistory: '糖尿病（饮食控制）', tags: ['牙周治疗', '种植牙', 'VIP'], totalVisits: 20, lastVisit: '2026-05-28', createdAt: '2023-01-05', notes: '注重口腔卫生，配合度极高' },
  { id: 'P009', name: '郑浩然', gender: '男', age: 19, phone: '130****9012', allergies: '无', medicalHistory: '无', tags: ['洁牙'], totalVisits: 1, lastVisit: '2026-07-01', createdAt: '2026-07-01' },
  { id: 'P010', name: '孙雅文', gender: '女', age: 30, phone: '158****0123', allergies: '无', medicalHistory: '无', tags: ['牙齿美白'], totalVisits: 2, lastVisit: '2026-07-02', createdAt: '2026-06-20' },
  { id: 'P011', name: '钱大伟', gender: '男', age: 62, phone: '159****3456', allergies: '阿司匹林过敏', medicalHistory: '冠心病（支架术后）', tags: ['种植牙', '慢病', 'VIP'], totalVisits: 25, lastVisit: '2026-06-18', createdAt: '2022-05-10', notes: '需注意抗凝药物使用情况，术前需心内科会诊' },
  { id: 'P012', name: '黄晓燕', gender: '女', age: 24, phone: '157****7890', allergies: '无', medicalHistory: '无', tags: ['隐形矫正'], totalVisits: 7, lastVisit: '2026-06-22', createdAt: '2025-09-01' },
]

// --- 预约挂号 ---
export const appointments: Appointment[] = [
  { id: 'A001', patientId: 'P010', patientName: '孙雅文', doctorName: '陈志明', date: '2026-07-02', time: '09:00', type: '牙齿美白', status: 'waiting', queueNumber: 'A001' },
  { id: 'A002', patientId: 'P003', patientName: '张建国', doctorName: '陈志明', date: '2026-07-02', time: '10:30', type: '牙周治疗', status: 'confirmed', queueNumber: 'A002' },
  { id: 'A003', patientId: 'P009', patientName: '郑浩然', doctorName: '林婉清', date: '2026-07-02', time: '11:00', type: '洁牙', status: 'in_progress', queueNumber: 'A003' },
  { id: 'A004', patientId: 'P002', patientName: '李芳华', doctorName: '林婉清', date: '2026-07-02', time: '14:00', type: '隐形矫正调整', status: 'confirmed', queueNumber: 'A004' },
  { id: 'A005', patientId: 'P001', patientName: '王晓明', doctorName: '陈志明', date: '2026-07-02', time: '15:30', type: '种植牙复诊', status: 'confirmed', queueNumber: 'A005' },
  { id: 'A006', patientId: 'P004', patientName: '刘小美', doctorName: '张思远', date: '2026-07-02', time: '16:00', type: '儿童涂氟', status: 'confirmed', queueNumber: 'A006' },
  { id: 'A007', patientId: 'P006', patientName: '赵丽娜', doctorName: '陈志明', date: '2026-07-03', time: '09:30', type: '种植牙手术', status: 'confirmed', note: '右上第一磨牙，术前检查已完成' },
  { id: 'A008', patientId: 'P007', patientName: '周文博', doctorName: '林婉清', date: '2026-07-03', time: '10:00', type: '早期矫治复查', status: 'confirmed' },
  { id: 'A009', patientId: 'P008', patientName: '吴美玲', doctorName: '陈志明', date: '2026-07-03', time: '14:30', type: '牙周复查', status: 'confirmed' },
  { id: 'A010', patientId: 'P005', patientName: '陈伟强', doctorName: '陈志明', date: '2026-07-04', time: '09:00', type: '洁牙', status: 'confirmed' },
  { id: 'A011', patientId: 'P012', patientName: '黄晓燕', doctorName: '林婉清', date: '2026-07-04', time: '10:30', type: '矫正器更换', status: 'confirmed' },
  { id: 'A012', patientId: 'P011', patientName: '钱大伟', doctorName: '陈志明', date: '2026-07-04', time: '14:00', type: '种植牙二期手术', status: 'confirmed', note: '心内科会诊已完成，凝血功能正常' },
  { id: 'A013', patientId: 'P004', patientName: '刘小美', doctorName: '张思远', date: '2026-07-05', time: '09:30', type: '窝沟封闭', status: 'confirmed' },
  { id: 'A014', patientId: 'P001', patientName: '王晓明', doctorName: '陈志明', date: '2026-07-05', time: '15:30', type: '口腔检查', status: 'confirmed' },
  { id: 'A015', patientId: 'P003', patientName: '张建国', doctorName: '陈志明', date: '2026-07-06', time: '10:00', type: '牙周刮治（局麻）', status: 'confirmed', note: '术前测量血压' },
]

// --- 牙位治疗记录（用于电子病历） ---
export const toothConditions: ToothCondition[] = ['healthy', 'decay', 'filled', 'crown', 'missing', 'implant', 'root_canal', 'bridge']

export const toothConditionLabels: Record<ToothCondition, string> = {
  healthy: '健康', decay: '龋坏', filled: '已充填', crown: '冠修复',
  missing: '缺失', implant: '种植', root_canal: '根管治疗', bridge: '桥体',
}

export const toothConditionColors: Record<ToothCondition, string> = {
  healthy: 'bg-gray-100 border-gray-200', decay: 'bg-red-100 border-red-400',
  filled: 'bg-blue-100 border-blue-400', crown: 'bg-amber-100 border-amber-400',
  missing: 'bg-gray-300 border-gray-400', implant: 'bg-teal-100 border-teal-500',
  root_canal: 'bg-purple-100 border-purple-400', bridge: 'bg-indigo-100 border-indigo-400',
}

// 恒牙 FDI 编号：右上18-11 → 左上21-28 → 左下38-31 → 右下48-41
export const permanentTeeth = {
  upperRight: [18, 17, 16, 15, 14, 13, 12, 11],
  upperLeft: [21, 22, 23, 24, 25, 26, 27, 28],
  lowerRight: [48, 47, 46, 45, 44, 43, 42, 41],
  lowerLeft: [31, 32, 33, 34, 35, 36, 37, 38],
}

export const allTeeth = [
  ...permanentTeeth.upperRight,
  ...permanentTeeth.upperLeft,
  ...permanentTeeth.lowerRight,
  ...permanentTeeth.lowerLeft,
]

// --- 电子病历 ---
// (病历数据已迁移至 useStore，旧 mock 数据已废弃)

// --- 收费账单 ---
export const billings: BillingItem[] = [
  { id: 'B001', patientName: '孙雅文', patientId: 'P010', date: '2026-07-02', items: [
    { name: '冷光美白治疗', category: '美容', price: 2500, qty: 1 },
    { name: '家庭美白套装', category: '材料', price: 300, qty: 1 },
  ], total: 2800, paid: true, method: '微信', cashier: '赵琳' },
  { id: 'B002', patientName: '陈伟强', patientId: 'P005', date: '2026-07-01', items: [
    { name: '超声波洁治', category: '治疗', price: 280, qty: 1 },
    { name: '喷砂抛光', category: '治疗', price: 100, qty: 1 },
  ], total: 380, paid: true, method: '支付宝', cashier: '赵琳' },
  { id: 'B003', patientName: '张建国', patientId: 'P003', date: '2026-06-20', items: [
    { name: '全口龈上洁治', category: '治疗', price: 280, qty: 1 },
    { name: '龈下刮治（半口）', category: '治疗', price: 1600, qty: 1 },
    { name: '局部浸润麻醉', category: '麻醉', price: 120, qty: 4 },
  ], total: 2360, paid: true, method: '医保', cashier: '赵琳' },
  { id: 'B004', patientName: '李芳华', patientId: 'P002', date: '2026-06-25', items: [
    { name: 'Invisalign隐形矫治（全口）', category: '正畸', price: 38000, qty: 1 },
    { name: '口内扫描及方案设计', category: '检查', price: 2000, qty: 1 },
    { name: 'CBCT拍摄', category: '检查', price: 500, qty: 1 },
    { name: '拔除智齿（4颗）', category: '手术', price: 600, qty: 4 },
  ], total: 42900, paid: false },
  { id: 'B005', patientName: '赵丽娜', patientId: 'P006', date: '2026-06-08', items: [
    { name: '种植体植入术', category: '种植', price: 8000, qty: 1 },
    { name: '士卓曼BLT种植体', category: '材料', price: 4200, qty: 1 },
    { name: 'CBCT拍摄', category: '检查', price: 500, qty: 1 },
    { name: '术前血常规+凝血', category: '化验', price: 100, qty: 1 },
  ], total: 12800, paid: true, method: '银行卡', cashier: '赵琳' },
]

// --- 药品库存 ---
export const drugs: Drug[] = [
  { id: 'D001', name: '阿替卡因肾上腺素注射液', category: '麻醉药', spec: '1.7ml/支', stock: 200, unit: '支', price: 8.5, manufacturer: '碧兰公司', expiryDate: '2027-03-15', alertStock: 50 },
  { id: 'D002', name: '复方氯己定含漱液', category: '消毒防腐', spec: '200ml/瓶', stock: 30, unit: '瓶', price: 25, manufacturer: '江苏晨牌', expiryDate: '2026-12-20', alertStock: 10 },
  { id: 'D003', name: '阿莫西林克拉维酸钾片', category: '抗生素', spec: '625mg×12片', stock: 45, unit: '盒', price: 42, manufacturer: '华北制药', expiryDate: '2027-06-01', alertStock: 15 },
  { id: 'D004', name: '布洛芬缓释胶囊', category: '解热镇痛', spec: '300mg×20粒', stock: 60, unit: '盒', price: 18, manufacturer: '中美史克', expiryDate: '2027-09-10', alertStock: 15 },
  { id: 'D005', name: '3M Filtek Z350XT 树脂', category: '充填材料', spec: '4g/支', stock: 3, unit: '支', price: 320, manufacturer: '3M ESPE', expiryDate: '2027-01-25', alertStock: 5 },
  { id: 'D006', name: '玻璃离子水门汀', category: '充填材料', spec: '粉液套装', stock: 8, unit: '套', price: 180, manufacturer: 'GC', expiryDate: '2026-11-08', alertStock: 3 },
  { id: 'D007', name: '藻酸盐印模材', category: '印模材料', spec: '450g/罐', stock: 12, unit: '罐', price: 65, manufacturer: '贺利氏', expiryDate: '2027-04-30', alertStock: 5 },
  { id: 'D008', name: '次氯酸钠冲洗液', category: '根管治疗', spec: '250ml/瓶', stock: 4, unit: '瓶', price: 45, manufacturer: '朗力生物', expiryDate: '2026-08-12', alertStock: 5 },
  { id: 'D009', name: '3M Clinpro 窝沟封闭剂', category: '预防保健', spec: '1.2ml/支', stock: 2, unit: '支', price: 280, manufacturer: '3M ESPE', expiryDate: '2026-10-05', alertStock: 4 },
  { id: 'D010', name: '可吸收缝合线 5-0', category: '手术耗材', spec: '12根/盒', stock: 6, unit: '盒', price: 120, manufacturer: '强生', expiryDate: '2028-02-18', alertStock: 3 },
]

// --- 影像记录 ---
export const imagings: Imaging[] = [
  { id: 'I001', patientName: '孙雅文', patientId: 'P010', type: '全景片', date: '2026-07-02', doctor: '陈志明', status: '已完成', report: '全口牙列完整，未见明显龋坏、根尖病变及颌骨异常。' },
  { id: 'I002', patientName: '王晓明', patientId: 'P001', type: 'CBCT', date: '2026-06-28', doctor: '陈志明', status: '已完成', report: '#16种植体周围骨密度正常，骨结合良好，未见透射影。' },
  { id: 'I003', patientName: '李芳华', patientId: 'P002', type: 'CBCT', date: '2026-06-25', doctor: '林婉清', status: '已完成', report: '上下颌骨对称，气道宽度正常，TMJ关节间隙可。#18、#28、#38、#48阻生智齿，建议择期拔除。' },
  { id: 'I004', patientName: '张建国', patientId: 'P003', type: '全景片', date: '2026-06-20', doctor: '陈志明', status: '已完成', report: '全口牙槽骨水平吸收约1/3-1/2，#36、#46区垂直骨吸收明显。多颗后牙根分叉区透射影。' },
  { id: 'I005', patientName: '赵丽娜', patientId: 'P006', type: 'CBCT', date: '2026-06-08', doctor: '陈志明', status: '已完成', report: '#16区牙槽骨宽度7mm，高度12mm，骨密度D3，适合种植体植入（4.1×10mm）。' },
  { id: 'I006', patientName: '周文博', patientId: 'P007', type: '头颅侧位片', date: '2026-06-05', doctor: '林婉清', status: '已完成', report: 'SNA 82°, SNB 78°, ANB 4°，下颌平面角32°，显示II类骨型趋势，上颌前突。' },
  { id: 'I007', patientName: '钱大伟', patientId: 'P011', type: 'CBCT', date: '2026-06-18', doctor: '陈志明', status: '待阅片' },
]

// --- 统计报表数据 ---
export const reportData: ReportData = {
  monthlyRevenue: [
    { month: '1月', value: 0 }, { month: '2月', value: 0 }, { month: '3月', value: 0 },
    { month: '4月', value: 0 }, { month: '5月', value: 0 }, { month: '6月', value: 0 },
    { month: '7月', value: 0 },
  ],
  serviceDistribution: [
    { name: '种植牙', value: 35 }, { name: '正畸', value: 28 }, { name: '牙周治疗', value: 15 },
    { name: '洁牙', value: 10 }, { name: '美白', value: 7 }, { name: '儿童齿科', value: 5 },
  ],
  patientStats: { newPatients: 38, returningPatients: 186, totalVisits: 312, avgFee: 1680 },
}

// 收费项目目录
export const serviceCatalog = [
  { category: '检查', items: ['口腔常规检查', 'CBCT拍摄', '全景片', '根尖片', '头颅侧位片', '口内扫描'] },
  { category: '洁牙', items: ['超声波洁治', '喷砂抛光', '氟化泡沫涂布'] },
  { category: '牙体牙髓', items: ['树脂充填（单面）', '树脂充填（多面）', '根管治疗（前牙）', '根管治疗（后牙）'] },
  { category: '牙周', items: ['龈上洁治', '龈下刮治（每区）', '牙周翻瓣术', '牙周维护治疗'] },
  { category: '种植', items: ['种植体植入术（单颗）', '种植二期手术', '种植上部修复（全瓷冠）', '上颌窦提升术'] },
  { category: '正畸', items: ['Invisalign全口', '固定托槽矫正', '早期干预矫治', '保持器'] },
  { category: '修复', items: ['全瓷冠', '烤瓷冠', '嵌体修复', '活动义齿'] },
  { category: '美容', items: ['冷光美白', '家庭美白套装', '瓷贴面'] },
  { category: '手术', items: ['拔牙（简单）', '拔牙（复杂/阻生）', '囊肿摘除术', '系带修整术'] },
  { category: '儿童齿科', items: ['窝沟封闭', '涂氟', '乳牙拔除', '间隙保持器'] },
]
