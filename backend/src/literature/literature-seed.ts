/**
 * 文学库种子数据
 * 包含作家、作品和段落的初始数据
 */

export interface AuthorSeed {
  name: string;
  nameEn?: string;
  era: string;
  nationality: string;
  styleTags: string[];
  bio: string;
  plantType: string;
  plantSymbol: string;
}

export interface WorkSeed {
  title: string;
  authorName: string;
  type: string;
  year?: string;
}

export interface PassageSeed {
  content: string;
  authorName: string;
  workTitle?: string;
  emotionTags: string[];
  imageryTags: string[];
  sceneTags: string[];
  themeTags: string[];
}

// 作家数据
export const authorSeeds: AuthorSeed[] = [
  {
    name: '李白',
    nameEn: 'Li Bai',
    era: '古代',
    nationality: '中国',
    styleTags: ['浪漫', '豪放', '飘逸'],
    bio: '唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。',
    plantType: '梅花',
    plantSymbol: '傲骨凌霜，独立不羁',
  },
  {
    name: '杜甫',
    nameEn: 'Du Fu',
    era: '古代',
    nationality: '中国',
    styleTags: ['现实', '沉郁', '忧国'],
    bio: '唐代伟大的现实主义诗人，被后人誉为"诗圣"。',
    plantType: '松树',
    plantSymbol: '坚韧不拔，心系苍生',
  },
  {
    name: '苏轼',
    nameEn: 'Su Shi',
    era: '古代',
    nationality: '中国',
    styleTags: ['豪放', '旷达', '多才'],
    bio: '北宋文学家、书画家，号东坡居士，豪放派词人代表。',
    plantType: '竹子',
    plantSymbol: '虚心有节，随遇而安',
  },
  {
    name: '李清照',
    nameEn: 'Li Qingzhao',
    era: '古代',
    nationality: '中国',
    styleTags: ['婉约', '细腻', '深情'],
    bio: '宋代女词人，婉约词派代表，号易安居士。',
    plantType: '海棠',
    plantSymbol: '温婉多情，才华横溢',
  },
  {
    name: '鲁迅',
    nameEn: 'Lu Xun',
    era: '近现代',
    nationality: '中国',
    styleTags: ['犀利', '深刻', '批判'],
    bio: '中国现代文学的奠基人，思想家、革命家。',
    plantType: '野草',
    plantSymbol: '坚韧顽强，直面现实',
  },
  {
    name: '林徽因',
    nameEn: 'Lin Huiyin',
    era: '近现代',
    nationality: '中国',
    styleTags: ['优美', '细腻', '浪漫'],
    bio: '中国著名建筑师、诗人、作家，新月派诗人。',
    plantType: '白玉兰',
    plantSymbol: '高洁优雅，才情兼备',
  },
  {
    name: '泰戈尔',
    nameEn: 'Rabindranath Tagore',
    era: '近现代',
    nationality: '印度',
    styleTags: ['哲理', '抒情', '自然'],
    bio: '印度诗人、哲学家，诺贝尔文学奖获得者。',
    plantType: '菩提树',
    plantSymbol: '智慧觉悟，博爱众生',
  },
  {
    name: '海子',
    nameEn: 'Hai Zi',
    era: '当代',
    nationality: '中国',
    styleTags: ['纯粹', '理想', '浪漫'],
    bio: '当代诗人，原名查海生，被誉为"麦地诗人"。',
    plantType: '向日葵',
    plantSymbol: '追逐光明，热爱生命',
  },
];

// 作品数据
export const workSeeds: WorkSeed[] = [
  { title: '静夜思', authorName: '李白', type: '诗', year: '唐' },
  { title: '将进酒', authorName: '李白', type: '诗', year: '唐' },
  { title: '春望', authorName: '杜甫', type: '诗', year: '唐' },
  { title: '登高', authorName: '杜甫', type: '诗', year: '唐' },
  { title: '水调歌头', authorName: '苏轼', type: '词', year: '宋' },
  { title: '定风波', authorName: '苏轼', type: '词', year: '宋' },
  { title: '如梦令', authorName: '李清照', type: '词', year: '宋' },
  { title: '声声慢', authorName: '李清照', type: '词', year: '宋' },
  { title: '野草', authorName: '鲁迅', type: '散文诗集', year: '1927' },
  { title: '你是人间的四月天', authorName: '林徽因', type: '诗', year: '1934' },
  { title: '飞鸟集', authorName: '泰戈尔', type: '诗集', year: '1916' },
  { title: '面朝大海，春暖花开', authorName: '海子', type: '诗', year: '1989' },
];

// 段落数据
export const passageSeeds: PassageSeed[] = [
  // 李白
  {
    content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
    authorName: '李白',
    workTitle: '静夜思',
    emotionTags: ['思念', '孤独', '平静'],
    imageryTags: ['月光', '霜', '夜晚'],
    sceneTags: ['夜晚', '室内'],
    themeTags: ['乡愁', '思念'],
  },
  {
    content: '君不见黄河之水天上来，奔流到海不复回。君不见高堂明镜悲白发，朝如青丝暮成雪。',
    authorName: '李白',
    workTitle: '将进酒',
    emotionTags: ['豪迈', '感慨', '悲伤'],
    imageryTags: ['黄河', '镜子', '白发'],
    sceneTags: ['自然', '室内'],
    themeTags: ['人生', '时光'],
  },
  {
    content: '人生得意须尽欢，莫使金樽空对月。天生我材必有用，千金散尽还复来。',
    authorName: '李白',
    workTitle: '将进酒',
    emotionTags: ['豪迈', '自信', '洒脱'],
    imageryTags: ['酒杯', '月亮'],
    sceneTags: ['宴会'],
    themeTags: ['人生', '自信'],
  },
  // 杜甫
  {
    content: '国破山河在，城春草木深。感时花溅泪，恨别鸟惊心。',
    authorName: '杜甫',
    workTitle: '春望',
    emotionTags: ['悲伤', '忧国', '感慨'],
    imageryTags: ['山河', '花', '鸟'],
    sceneTags: ['春天', '城市'],
    themeTags: ['战争', '离别'],
  },
  {
    content: '无边落木萧萧下，不尽长江滚滚来。万里悲秋常作客，百年多病独登台。',
    authorName: '杜甫',
    workTitle: '登高',
    emotionTags: ['悲伤', '孤独', '感慨'],
    imageryTags: ['落叶', '长江', '秋天'],
    sceneTags: ['秋天', '高处'],
    themeTags: ['人生', '漂泊'],
  },
  // 苏轼
  {
    content: '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。',
    authorName: '苏轼',
    workTitle: '水调歌头',
    emotionTags: ['思念', '豪迈', '哲思'],
    imageryTags: ['月亮', '酒', '天空'],
    sceneTags: ['夜晚', '中秋'],
    themeTags: ['思念', '人生'],
  },
  {
    content: '人有悲欢离合，月有阴晴圆缺，此事古难全。但愿人长久，千里共婵娟。',
    authorName: '苏轼',
    workTitle: '水调歌头',
    emotionTags: ['思念', '豁达', '祝福'],
    imageryTags: ['月亮'],
    sceneTags: ['夜晚'],
    themeTags: ['思念', '人生哲理'],
  },
  {
    content: '莫听穿林打叶声，何妨吟啸且徐行。竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。',
    authorName: '苏轼',
    workTitle: '定风波',
    emotionTags: ['豁达', '洒脱', '平静'],
    imageryTags: ['雨', '竹杖', '蓑衣'],
    sceneTags: ['雨天', '山林'],
    themeTags: ['人生态度', '豁达'],
  },
  // 李清照
  {
    content: '常记溪亭日暮，沉醉不知归路。兴尽晚回舟，误入藕花深处。争渡，争渡，惊起一滩鸥鹭。',
    authorName: '李清照',
    workTitle: '如梦令',
    emotionTags: ['欢乐', '自在', '惊喜'],
    imageryTags: ['溪水', '荷花', '鸥鹭', '小舟'],
    sceneTags: ['傍晚', '水边'],
    themeTags: ['青春', '自然'],
  },
  {
    content: '寻寻觅觅，冷冷清清，凄凄惨惨戚戚。乍暖还寒时候，最难将息。',
    authorName: '李清照',
    workTitle: '声声慢',
    emotionTags: ['悲伤', '孤独', '凄凉'],
    imageryTags: ['寒冷'],
    sceneTags: ['秋天', '室内'],
    themeTags: ['孤独', '思念'],
  },
  // 鲁迅
  {
    content: '当我沉默着的时候，我觉得充实；我将开口，同时感到空虚。',
    authorName: '鲁迅',
    workTitle: '野草',
    emotionTags: ['沉思', '矛盾', '深刻'],
    imageryTags: [],
    sceneTags: [],
    themeTags: ['人生', '思考'],
  },
  {
    content: '希望是本无所谓有，无所谓无的。这正如地上的路；其实地上本没有路，走的人多了，也便成了路。',
    authorName: '鲁迅',
    workTitle: '野草',
    emotionTags: ['希望', '坚定', '哲思'],
    imageryTags: ['路'],
    sceneTags: [],
    themeTags: ['希望', '人生'],
  },
  // 林徽因
  {
    content: '你是一树一树的花开，是燕在梁间呢喃，——你是爱，是暖，是希望，你是人间的四月天！',
    authorName: '林徽因',
    workTitle: '你是人间的四月天',
    emotionTags: ['爱', '温暖', '希望', '喜悦'],
    imageryTags: ['花', '燕子', '春天'],
    sceneTags: ['春天'],
    themeTags: ['爱情', '生命'],
  },
  // 泰戈尔
  {
    content: '世界以痛吻我，要我报之以歌。',
    authorName: '泰戈尔',
    workTitle: '飞鸟集',
    emotionTags: ['坚强', '豁达', '感恩'],
    imageryTags: [],
    sceneTags: [],
    themeTags: ['人生态度', '坚强'],
  },
  {
    content: '生如夏花之绚烂，死如秋叶之静美。',
    authorName: '泰戈尔',
    workTitle: '飞鸟集',
    emotionTags: ['平静', '豁达', '哲思'],
    imageryTags: ['夏花', '秋叶'],
    sceneTags: ['夏天', '秋天'],
    themeTags: ['生死', '人生'],
  },
  {
    content: '我们把世界看错，反说它欺骗了我们。',
    authorName: '泰戈尔',
    workTitle: '飞鸟集',
    emotionTags: ['哲思', '反省', '深刻'],
    imageryTags: [],
    sceneTags: [],
    themeTags: ['人生哲理', '认知'],
  },
  // 海子
  {
    content: '从明天起，做一个幸福的人。喂马、劈柴，周游世界。从明天起，关心粮食和蔬菜。我有一所房子，面朝大海，春暖花开。',
    authorName: '海子',
    workTitle: '面朝大海，春暖花开',
    emotionTags: ['希望', '向往', '平静', '幸福'],
    imageryTags: ['大海', '房子', '花'],
    sceneTags: ['海边', '春天'],
    themeTags: ['理想生活', '幸福'],
  },
  {
    content: '陌生人，我也为你祝福。愿你有一个灿烂的前程，愿你有情人终成眷属，愿你在尘世获得幸福。',
    authorName: '海子',
    workTitle: '面朝大海，春暖花开',
    emotionTags: ['祝福', '温暖', '善良'],
    imageryTags: [],
    sceneTags: [],
    themeTags: ['祝福', '善意'],
  },
];
