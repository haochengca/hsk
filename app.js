const HSK_CHARS = [
  {
    "char": "爱",
    "pinyin": "ài",
    "meaning": "love",
    "level": 1,
    "phrase": "爱",
    "sentence": "这是“爱”字。"
  },
  {
    "char": "八",
    "pinyin": "bā",
    "meaning": "eight",
    "level": 1,
    "phrase": "八",
    "sentence": "这是“八”字。"
  },
  {
    "char": "本",
    "pinyin": "běn",
    "meaning": "measure word for books",
    "level": 1,
    "phrase": "本",
    "sentence": "这是“本”字。"
  },
  {
    "char": "不",
    "pinyin": "bù",
    "meaning": "no; not",
    "level": 1,
    "phrase": "不",
    "sentence": "这是“不”字。"
  },
  {
    "char": "菜",
    "pinyin": "cài",
    "meaning": "dish (type of food); vegetables",
    "level": 1,
    "phrase": "菜",
    "sentence": "这是“菜”字。"
  },
  {
    "char": "茶",
    "pinyin": "chá",
    "meaning": "tea",
    "level": 1,
    "phrase": "茶",
    "sentence": "这是“茶”字。"
  },
  {
    "char": "吃",
    "pinyin": "chī",
    "meaning": "eat",
    "level": 1,
    "phrase": "吃",
    "sentence": "这是“吃”字。"
  },
  {
    "char": "大",
    "pinyin": "dà",
    "meaning": "big; large",
    "level": 1,
    "phrase": "大",
    "sentence": "这是“大”字。"
  },
  {
    "char": "的",
    "pinyin": "de",
    "meaning": "indicates possession, like adding 's to a noun",
    "level": 1,
    "phrase": "的",
    "sentence": "这是“的”字。"
  },
  {
    "char": "点",
    "pinyin": "diǎn",
    "meaning": "a dot; a little; o'clock",
    "level": 1,
    "phrase": "点",
    "sentence": "这是“点”字。"
  },
  {
    "char": "都",
    "pinyin": "dōu",
    "meaning": "all; both",
    "level": 1,
    "phrase": "都",
    "sentence": "这是“都”字。"
  },
  {
    "char": "读",
    "pinyin": "dú",
    "meaning": "to read; to study",
    "level": 1,
    "phrase": "读",
    "sentence": "这是“读”字。"
  },
  {
    "char": "多",
    "pinyin": "duō",
    "meaning": "many",
    "level": 1,
    "phrase": "多",
    "sentence": "这是“多”字。"
  },
  {
    "char": "二",
    "pinyin": "èr",
    "meaning": "two",
    "level": 1,
    "phrase": "二",
    "sentence": "这是“二”字。"
  },
  {
    "char": "个",
    "pinyin": "ge",
    "meaning": "general measure word",
    "level": 1,
    "phrase": "个",
    "sentence": "这是“个”字。"
  },
  {
    "char": "狗",
    "pinyin": "gǒu",
    "meaning": "dog",
    "level": 1,
    "phrase": "狗",
    "sentence": "这是“狗”字。"
  },
  {
    "char": "好",
    "pinyin": "hǎo",
    "meaning": "good",
    "level": 1,
    "phrase": "好",
    "sentence": "这是“好”字。"
  },
  {
    "char": "号",
    "pinyin": "hào",
    "meaning": "number; day of a month",
    "level": 1,
    "phrase": "号",
    "sentence": "这是“号”字。"
  },
  {
    "char": "喝",
    "pinyin": "hē",
    "meaning": "to drink",
    "level": 1,
    "phrase": "喝",
    "sentence": "这是“喝”字。"
  },
  {
    "char": "和",
    "pinyin": "hé",
    "meaning": "and; with",
    "level": 1,
    "phrase": "和",
    "sentence": "这是“和”字。"
  },
  {
    "char": "很",
    "pinyin": "hěn",
    "meaning": "very; quite",
    "level": 1,
    "phrase": "很",
    "sentence": "这是“很”字。"
  },
  {
    "char": "回",
    "pinyin": "huí",
    "meaning": "to return; to reply; to go back",
    "level": 1,
    "phrase": "回",
    "sentence": "这是“回”字。"
  },
  {
    "char": "会",
    "pinyin": "huì",
    "meaning": "know how to",
    "level": 1,
    "phrase": "会",
    "sentence": "这是“会”字。"
  },
  {
    "char": "几",
    "pinyin": "jǐ",
    "meaning": "how many; several; a few",
    "level": 1,
    "phrase": "几",
    "sentence": "这是“几”字。"
  },
  {
    "char": "家",
    "pinyin": "jiā",
    "meaning": "family; home",
    "level": 1,
    "phrase": "家",
    "sentence": "这是“家”字。"
  },
  {
    "char": "叫",
    "pinyin": "jiào",
    "meaning": "to be called",
    "level": 1,
    "phrase": "叫",
    "sentence": "这是“叫”字。"
  },
  {
    "char": "九",
    "pinyin": "jiǔ",
    "meaning": "nine",
    "level": 1,
    "phrase": "九",
    "sentence": "这是“九”字。"
  },
  {
    "char": "开",
    "pinyin": "kāi",
    "meaning": "to open; to start; to operate (a vehicle)",
    "level": 1,
    "phrase": "开",
    "sentence": "这是“开”字。"
  },
  {
    "char": "看",
    "pinyin": "kàn",
    "meaning": "see; look at; to watch",
    "level": 1,
    "phrase": "看",
    "sentence": "这是“看”字。"
  },
  {
    "char": "块",
    "pinyin": "kuài",
    "meaning": "lump; piece; sum of money",
    "level": 1,
    "phrase": "块",
    "sentence": "这是“块”字。"
  },
  {
    "char": "来",
    "pinyin": "lái",
    "meaning": "come; arrive; ever since; next",
    "level": 1,
    "phrase": "来",
    "sentence": "这是“来”字。"
  },
  {
    "char": "了",
    "pinyin": "le",
    "meaning": "indicates a completed or finished action",
    "level": 1,
    "phrase": "了",
    "sentence": "这是“了”字。"
  },
  {
    "char": "冷",
    "pinyin": "lěng",
    "meaning": "cold",
    "level": 1,
    "phrase": "冷",
    "sentence": "这是“冷”字。"
  },
  {
    "char": "里",
    "pinyin": "lǐ",
    "meaning": "inside; Chinese mile (~.5 km)",
    "level": 1,
    "phrase": "里",
    "sentence": "这是“里”字。"
  },
  {
    "char": "六",
    "pinyin": "liù",
    "meaning": "six",
    "level": 1,
    "phrase": "六",
    "sentence": "这是“六”字。"
  },
  {
    "char": "吗",
    "pinyin": "ma",
    "meaning": "indicates a yes/no question (added to a statement)",
    "level": 1,
    "phrase": "吗",
    "sentence": "这是“吗”字。"
  },
  {
    "char": "买",
    "pinyin": "mǎi",
    "meaning": "to buy",
    "level": 1,
    "phrase": "买",
    "sentence": "这是“买”字。"
  },
  {
    "char": "猫",
    "pinyin": "māo",
    "meaning": "cat",
    "level": 1,
    "phrase": "猫",
    "sentence": "这是“猫”字。"
  },
  {
    "char": "哪",
    "pinyin": "nǎa",
    "meaning": "which; how",
    "level": 1,
    "phrase": "哪",
    "sentence": "这是“哪”字。"
  },
  {
    "char": "那",
    "pinyin": "nà",
    "meaning": "that; then",
    "level": 1,
    "phrase": "那",
    "sentence": "这是“那”字。"
  },
  {
    "char": "呢",
    "pinyin": "ne",
    "meaning": "indicates a question; how about...?;",
    "level": 1,
    "phrase": "呢",
    "sentence": "这是“呢”字。"
  },
  {
    "char": "能",
    "pinyin": "néng",
    "meaning": "can; be able",
    "level": 1,
    "phrase": "能",
    "sentence": "这是“能”字。"
  },
  {
    "char": "你",
    "pinyin": "nǐ",
    "meaning": "you (singular)",
    "level": 1,
    "phrase": "你",
    "sentence": "这是“你”字。"
  },
  {
    "char": "年",
    "pinyin": "nián",
    "meaning": "year",
    "level": 1,
    "phrase": "年",
    "sentence": "这是“年”字。"
  },
  {
    "char": "七",
    "pinyin": "qī",
    "meaning": "seven",
    "level": 1,
    "phrase": "七",
    "sentence": "这是“七”字。"
  },
  {
    "char": "钱",
    "pinyin": "qián",
    "meaning": "money; coin",
    "level": 1,
    "phrase": "钱",
    "sentence": "这是“钱”字。"
  },
  {
    "char": "请",
    "pinyin": "qǐng",
    "meaning": "please; invite; to treat someone to something",
    "level": 1,
    "phrase": "请",
    "sentence": "这是“请”字。"
  },
  {
    "char": "去",
    "pinyin": "qù",
    "meaning": "go; to leave",
    "level": 1,
    "phrase": "去",
    "sentence": "这是“去”字。"
  },
  {
    "char": "热",
    "pinyin": "rè",
    "meaning": "heat; hot",
    "level": 1,
    "phrase": "热",
    "sentence": "这是“热”字。"
  },
  {
    "char": "人",
    "pinyin": "rén",
    "meaning": "person; man; people",
    "level": 1,
    "phrase": "人",
    "sentence": "这是“人”字。"
  },
  {
    "char": "三",
    "pinyin": "sān",
    "meaning": "three",
    "level": 1,
    "phrase": "三",
    "sentence": "这是“三”字。"
  },
  {
    "char": "上",
    "pinyin": "shàng",
    "meaning": "above; up",
    "level": 1,
    "phrase": "上",
    "sentence": "这是“上”字。"
  },
  {
    "char": "少",
    "pinyin": "shǎo",
    "meaning": "few; little",
    "level": 1,
    "phrase": "少",
    "sentence": "这是“少”字。"
  },
  {
    "char": "谁",
    "pinyin": "shéi",
    "meaning": "who",
    "level": 1,
    "phrase": "谁",
    "sentence": "这是“谁”字。"
  },
  {
    "char": "十",
    "pinyin": "shí",
    "meaning": "ten",
    "level": 1,
    "phrase": "十",
    "sentence": "这是“十”字。"
  },
  {
    "char": "是",
    "pinyin": "shì",
    "meaning": "be; is; are; am",
    "level": 1,
    "phrase": "是",
    "sentence": "这是“是”字。"
  },
  {
    "char": "书",
    "pinyin": "shū",
    "meaning": "book; letter",
    "level": 1,
    "phrase": "书",
    "sentence": "这是“书”字。"
  },
  {
    "char": "水",
    "pinyin": "shuǐ",
    "meaning": "water",
    "level": 1,
    "phrase": "水",
    "sentence": "这是“水”字。"
  },
  {
    "char": "说",
    "pinyin": "shuō",
    "meaning": "speak",
    "level": 1,
    "phrase": "说",
    "sentence": "这是“说”字。"
  },
  {
    "char": "四",
    "pinyin": "sì",
    "meaning": "four",
    "level": 1,
    "phrase": "四",
    "sentence": "这是“四”字。"
  },
  {
    "char": "岁",
    "pinyin": "suì",
    "meaning": "years old; age",
    "level": 1,
    "phrase": "岁",
    "sentence": "这是“岁”字。"
  },
  {
    "char": "他",
    "pinyin": "tā",
    "meaning": "he; him",
    "level": 1,
    "phrase": "他",
    "sentence": "这是“他”字。"
  },
  {
    "char": "她",
    "pinyin": "tā",
    "meaning": "she",
    "level": 1,
    "phrase": "她",
    "sentence": "这是“她”字。"
  },
  {
    "char": "太",
    "pinyin": "tài",
    "meaning": "too (much)",
    "level": 1,
    "phrase": "太",
    "sentence": "这是“太”字。"
  },
  {
    "char": "听",
    "pinyin": "tīng",
    "meaning": "listen; hear",
    "level": 1,
    "phrase": "听",
    "sentence": "这是“听”字。"
  },
  {
    "char": "喂",
    "pinyin": "wèi",
    "meaning": "hello (on the phone)",
    "level": 1,
    "phrase": "喂",
    "sentence": "这是“喂”字。"
  },
  {
    "char": "我",
    "pinyin": "wǒ",
    "meaning": "I; me",
    "level": 1,
    "phrase": "我",
    "sentence": "这是“我”字。"
  },
  {
    "char": "五",
    "pinyin": "wǔ",
    "meaning": "five",
    "level": 1,
    "phrase": "五",
    "sentence": "这是“五”字。"
  },
  {
    "char": "下",
    "pinyin": "xià",
    "meaning": "fall; below",
    "level": 1,
    "phrase": "下",
    "sentence": "这是“下”字。"
  },
  {
    "char": "想",
    "pinyin": "xiǎng",
    "meaning": "think; believe; suppose; would like to",
    "level": 1,
    "phrase": "想",
    "sentence": "这是“想”字。"
  },
  {
    "char": "小",
    "pinyin": "xiǎo",
    "meaning": "small; young",
    "level": 1,
    "phrase": "小",
    "sentence": "这是“小”字。"
  },
  {
    "char": "些",
    "pinyin": "xiē",
    "meaning": "some; few; several",
    "level": 1,
    "phrase": "些",
    "sentence": "这是“些”字。"
  },
  {
    "char": "写",
    "pinyin": "xiě",
    "meaning": "to write; to compose",
    "level": 1,
    "phrase": "写",
    "sentence": "这是“写”字。"
  },
  {
    "char": "一",
    "pinyin": "yī",
    "meaning": "one; once; a",
    "level": 1,
    "phrase": "一",
    "sentence": "这是“一”字。"
  },
  {
    "char": "有",
    "pinyin": "yǒu",
    "meaning": "have",
    "level": 1,
    "phrase": "有",
    "sentence": "这是“有”字。"
  },
  {
    "char": "月",
    "pinyin": "yuè",
    "meaning": "moon; month",
    "level": 1,
    "phrase": "月",
    "sentence": "这是“月”字。"
  },
  {
    "char": "在",
    "pinyin": "zài",
    "meaning": "at; on; in; indicates an action in progress",
    "level": 1,
    "phrase": "在",
    "sentence": "这是“在”字。"
  },
  {
    "char": "这",
    "pinyin": "zhè",
    "meaning": "this",
    "level": 1,
    "phrase": "这",
    "sentence": "这是“这”字。"
  },
  {
    "char": "住",
    "pinyin": "zhù",
    "meaning": "to live; reside; to stop",
    "level": 1,
    "phrase": "住",
    "sentence": "这是“住”字。"
  },
  {
    "char": "字",
    "pinyin": "zì",
    "meaning": "letter; character",
    "level": 1,
    "phrase": "字",
    "sentence": "这是“字”字。"
  },
  {
    "char": "坐",
    "pinyin": "zuò",
    "meaning": "sit",
    "level": 1,
    "phrase": "坐",
    "sentence": "这是“坐”字。"
  },
  {
    "char": "做",
    "pinyin": "zuò",
    "meaning": "do; make",
    "level": 1,
    "phrase": "做",
    "sentence": "这是“做”字。"
  },
  {
    "char": "吧",
    "pinyin": "ba",
    "meaning": "particle indicating polite suggestion; | onomatopoeia | bar (serving drinks, providing internet access, etc.)",
    "level": 2,
    "phrase": "吧",
    "sentence": "这是“吧”字。"
  },
  {
    "char": "白",
    "pinyin": "bái",
    "meaning": "white; snowy; pure; bright; empty (Kangxi radical 106)",
    "level": 2,
    "phrase": "白",
    "sentence": "这是“白”字。"
  },
  {
    "char": "百",
    "pinyin": "bǎi",
    "meaning": "hundred",
    "level": 2,
    "phrase": "百",
    "sentence": "这是“百”字。"
  },
  {
    "char": "比",
    "pinyin": "bǐ",
    "meaning": "compare; (indicates comparison) (Kangxi radical 81); to gesticulate as one talks",
    "level": 2,
    "phrase": "比",
    "sentence": "这是“比”字。"
  },
  {
    "char": "别",
    "pinyin": "bié",
    "meaning": "don't do something; don't | depart; | other; difference; distinguish",
    "level": 2,
    "phrase": "别",
    "sentence": "这是“别”字。"
  },
  {
    "char": "出",
    "pinyin": "chū",
    "meaning": "go out; occur",
    "level": 2,
    "phrase": "出",
    "sentence": "这是“出”字。"
  },
  {
    "char": "穿",
    "pinyin": "chuān",
    "meaning": "to wear; put on; penetrate",
    "level": 2,
    "phrase": "穿",
    "sentence": "这是“穿”字。"
  },
  {
    "char": "次",
    "pinyin": "cì",
    "meaning": "(mw for number of times of occurrence); nth; order",
    "level": 2,
    "phrase": "次",
    "sentence": "这是“次”字。"
  },
  {
    "char": "从",
    "pinyin": "cóng",
    "meaning": "from; obey; observe",
    "level": 2,
    "phrase": "从",
    "sentence": "这是“从”字。"
  },
  {
    "char": "错",
    "pinyin": "cuò",
    "meaning": "mistake; error; blunder; miss an opportunity",
    "level": 2,
    "phrase": "错",
    "sentence": "这是“错”字。"
  },
  {
    "char": "到",
    "pinyin": "dào",
    "meaning": "arrive (at a place); until (a time)",
    "level": 2,
    "phrase": "到",
    "sentence": "这是“到”字。"
  },
  {
    "char": "得",
    "pinyin": "de",
    "meaning": "(complement particle)",
    "level": 2,
    "phrase": "得",
    "sentence": "这是“得”字。"
  },
  {
    "char": "等",
    "pinyin": "děng",
    "meaning": "to wait; rank; equal; etc.",
    "level": 2,
    "phrase": "等",
    "sentence": "这是“等”字。"
  },
  {
    "char": "懂",
    "pinyin": "dǒng",
    "meaning": "understand; know",
    "level": 2,
    "phrase": "懂",
    "sentence": "这是“懂”字。"
  },
  {
    "char": "对",
    "pinyin": "duì",
    "meaning": "correct; a pair; to face; be opposite; to; towards",
    "level": 2,
    "phrase": "对",
    "sentence": "这是“对”字。"
  },
  {
    "char": "高",
    "pinyin": "gāo",
    "meaning": "high; tall (Kangxi radical 189)",
    "level": 2,
    "phrase": "高",
    "sentence": "这是“高”字。"
  },
  {
    "char": "给",
    "pinyin": "gěi",
    "meaning": "to give; to grant; (passive particle)",
    "level": 2,
    "phrase": "给",
    "sentence": "这是“给”字。"
  },
  {
    "char": "贵",
    "pinyin": "guì",
    "meaning": "expensive; noble; honorable; Guizhou province (abbreviation)",
    "level": 2,
    "phrase": "贵",
    "sentence": "这是“贵”字。"
  },
  {
    "char": "过",
    "pinyin": "guò",
    "meaning": "to pass; to cross; go over; (indicates a past experience)",
    "level": 2,
    "phrase": "过",
    "sentence": "这是“过”字。"
  },
  {
    "char": "还",
    "pinyin": "hái",
    "meaning": "still; yet; in addition; even",
    "level": 2,
    "phrase": "还",
    "sentence": "这是“还”字。"
  },
  {
    "char": "黑",
    "pinyin": "hēi",
    "meaning": "black; dark (Kangxi radical 203); Heilongjiang province (abbreviation)",
    "level": 2,
    "phrase": "黑",
    "sentence": "这是“黑”字。"
  },
  {
    "char": "红",
    "pinyin": "hóng",
    "meaning": "red; symbol of success; bonus; popular",
    "level": 2,
    "phrase": "红",
    "sentence": "这是“红”字。"
  },
  {
    "char": "件",
    "pinyin": "jiàn",
    "meaning": "(mw for things, clothes, and items)",
    "level": 2,
    "phrase": "件",
    "sentence": "这是“件”字。"
  },
  {
    "char": "近",
    "pinyin": "jìn",
    "meaning": "near; close (to)",
    "level": 2,
    "phrase": "近",
    "sentence": "这是“近”字。"
  },
  {
    "char": "进",
    "pinyin": "jìn",
    "meaning": "enter; come in",
    "level": 2,
    "phrase": "进",
    "sentence": "这是“进”字。"
  },
  {
    "char": "就",
    "pinyin": "jiù",
    "meaning": "then; at once; just; only; with regard to",
    "level": 2,
    "phrase": "就",
    "sentence": "这是“就”字。"
  },
  {
    "char": "课",
    "pinyin": "kè",
    "meaning": "class; subject; lesson; course",
    "level": 2,
    "phrase": "课",
    "sentence": "这是“课”字。"
  },
  {
    "char": "快",
    "pinyin": "kuài",
    "meaning": "fast; quick; swift",
    "level": 2,
    "phrase": "快",
    "sentence": "这是“快”字。"
  },
  {
    "char": "累",
    "pinyin": "lèi",
    "meaning": "tired",
    "level": 2,
    "phrase": "累",
    "sentence": "这是“累”字。"
  },
  {
    "char": "离",
    "pinyin": "lí",
    "meaning": "leave; depart; go away; apart from",
    "level": 2,
    "phrase": "离",
    "sentence": "这是“离”字。"
  },
  {
    "char": "两",
    "pinyin": "liǎng",
    "meaning": "two; 2; both; (unit of weight equal to 50 grams)",
    "level": 2,
    "phrase": "两",
    "sentence": "这是“两”字。"
  },
  {
    "char": "零",
    "pinyin": "líng",
    "meaning": "zero; remnant",
    "level": 2,
    "phrase": "零",
    "sentence": "这是“零”字。"
  },
  {
    "char": "路",
    "pinyin": "lù",
    "meaning": "road; path; journey; route",
    "level": 2,
    "phrase": "路",
    "sentence": "这是“路”字。"
  },
  {
    "char": "卖",
    "pinyin": "mài",
    "meaning": "to sell",
    "level": 2,
    "phrase": "卖",
    "sentence": "这是“卖”字。"
  },
  {
    "char": "慢",
    "pinyin": "màn",
    "meaning": "slow",
    "level": 2,
    "phrase": "慢",
    "sentence": "这是“慢”字。"
  },
  {
    "char": "忙",
    "pinyin": "máng",
    "meaning": "busy",
    "level": 2,
    "phrase": "忙",
    "sentence": "这是“忙”字。"
  },
  {
    "char": "每",
    "pinyin": "měi",
    "meaning": "each; every",
    "level": 2,
    "phrase": "每",
    "sentence": "这是“每”字。"
  },
  {
    "char": "门",
    "pinyin": "mén",
    "meaning": "door; opening; gate (Kangxi radical 169)",
    "level": 2,
    "phrase": "门",
    "sentence": "这是“门”字。"
  },
  {
    "char": "男",
    "pinyin": "nán",
    "meaning": "male",
    "level": 2,
    "phrase": "男",
    "sentence": "这是“男”字。"
  },
  {
    "char": "您",
    "pinyin": "nín",
    "meaning": "you (polite)",
    "level": 2,
    "phrase": "您",
    "sentence": "这是“您”字。"
  },
  {
    "char": "女",
    "pinyin": "nǚ",
    "meaning": "woman; female (Kangxi radical 38)",
    "level": 2,
    "phrase": "女",
    "sentence": "这是“女”字。"
  },
  {
    "char": "票",
    "pinyin": "piào",
    "meaning": "ticket; bank note; a vote",
    "level": 2,
    "phrase": "票",
    "sentence": "这是“票”字。"
  },
  {
    "char": "千",
    "pinyin": "qiān",
    "meaning": "one thousand",
    "level": 2,
    "phrase": "千",
    "sentence": "这是“千”字。"
  },
  {
    "char": "晴",
    "pinyin": "qíng",
    "meaning": "clear; fine (as of weather)",
    "level": 2,
    "phrase": "晴",
    "sentence": "这是“晴”字。"
  },
  {
    "char": "让",
    "pinyin": "ràng",
    "meaning": "ask; let; yield",
    "level": 2,
    "phrase": "让",
    "sentence": "这是“让”字。"
  },
  {
    "char": "日",
    "pinyin": "rì",
    "meaning": "sun; day; date; time (Kangxi radical 72)",
    "level": 2,
    "phrase": "日",
    "sentence": "这是“日”字。"
  },
  {
    "char": "送",
    "pinyin": "sòng",
    "meaning": "deliver; to carry; to give; send",
    "level": 2,
    "phrase": "送",
    "sentence": "这是“送”字。"
  },
  {
    "char": "它",
    "pinyin": "tā",
    "meaning": "it",
    "level": 2,
    "phrase": "它",
    "sentence": "这是“它”字。"
  },
  {
    "char": "题",
    "pinyin": "tí",
    "meaning": "topic; subject; question on a test or assignment",
    "level": 2,
    "phrase": "题",
    "sentence": "这是“题”字。"
  },
  {
    "char": "外",
    "pinyin": "wài",
    "meaning": "outer; outside; in addition; foreign",
    "level": 2,
    "phrase": "外",
    "sentence": "这是“外”字。"
  },
  {
    "char": "完",
    "pinyin": "wán",
    "meaning": "to finish; be over; complete",
    "level": 2,
    "phrase": "完",
    "sentence": "这是“完”字。"
  },
  {
    "char": "玩",
    "pinyin": "wán",
    "meaning": "to play; have a good time; visit; enjoy",
    "level": 2,
    "phrase": "玩",
    "sentence": "这是“玩”字。"
  },
  {
    "char": "往",
    "pinyin": "wǎng",
    "meaning": "to go (in a direction); towards; in the past",
    "level": 2,
    "phrase": "往",
    "sentence": "这是“往”字。"
  },
  {
    "char": "问",
    "pinyin": "wèn",
    "meaning": "ask; inquire",
    "level": 2,
    "phrase": "问",
    "sentence": "这是“问”字。"
  },
  {
    "char": "洗",
    "pinyin": "xǐ",
    "meaning": "to wash; bathe",
    "level": 2,
    "phrase": "洗",
    "sentence": "这是“洗”字。"
  },
  {
    "char": "笑",
    "pinyin": "xiào",
    "meaning": "to laugh; to smile",
    "level": 2,
    "phrase": "笑",
    "sentence": "这是“笑”字。"
  },
  {
    "char": "新",
    "pinyin": "xīn",
    "meaning": "new; Xinjiang autonomous region (abbreviation)",
    "level": 2,
    "phrase": "新",
    "sentence": "这是“新”字。"
  },
  {
    "char": "姓",
    "pinyin": "xìng",
    "meaning": "surname; family name",
    "level": 2,
    "phrase": "姓",
    "sentence": "这是“姓”字。"
  },
  {
    "char": "雪",
    "pinyin": "xuě",
    "meaning": "snow",
    "level": 2,
    "phrase": "雪",
    "sentence": "这是“雪”字。"
  },
  {
    "char": "药",
    "pinyin": "yào",
    "meaning": "medicine; drug; cure; chemical",
    "level": 2,
    "phrase": "药",
    "sentence": "这是“药”字。"
  },
  {
    "char": "要",
    "pinyin": "yào",
    "meaning": "to want; to need; will/shall; important",
    "level": 2,
    "phrase": "要",
    "sentence": "这是“要”字。"
  },
  {
    "char": "也",
    "pinyin": "yě",
    "meaning": "also; too",
    "level": 2,
    "phrase": "也",
    "sentence": "这是“也”字。"
  },
  {
    "char": "阴",
    "pinyin": "yīn",
    "meaning": "cloudy (weather); yin (the negative principle of Yin and Yang); secret; the moon; negative; shade",
    "level": 2,
    "phrase": "阴",
    "sentence": "这是“阴”字。"
  },
  {
    "char": "鱼",
    "pinyin": "yú",
    "meaning": "fish (Kangxi radical 195)",
    "level": 2,
    "phrase": "鱼",
    "sentence": "这是“鱼”字。"
  },
  {
    "char": "远",
    "pinyin": "yuǎn",
    "meaning": "far; distant; remote",
    "level": 2,
    "phrase": "远",
    "sentence": "这是“远”字。"
  },
  {
    "char": "再",
    "pinyin": "zài",
    "meaning": "again; once more",
    "level": 2,
    "phrase": "再",
    "sentence": "这是“再”字。"
  },
  {
    "char": "长",
    "pinyin": "cháng, zhǎng",
    "meaning": "long; length | grow; chief (Kangxi radical 168)",
    "level": 2,
    "phrase": "长",
    "sentence": "这是“长”字。"
  },
  {
    "char": "找",
    "pinyin": "zhǎo",
    "meaning": "try to find; look for; seek; to give change",
    "level": 2,
    "phrase": "找",
    "sentence": "这是“找”字。"
  },
  {
    "char": "着",
    "pinyin": "zhe",
    "meaning": "-ing (indicating action in progress)",
    "level": 2,
    "phrase": "着",
    "sentence": "这是“着”字。"
  },
  {
    "char": "真",
    "pinyin": "zhēn",
    "meaning": "real; true; genuine",
    "level": 2,
    "phrase": "真",
    "sentence": "这是“真”字。"
  },
  {
    "char": "走",
    "pinyin": "zǒu",
    "meaning": "to walk; to go; to move (Kangxi radical 156)",
    "level": 2,
    "phrase": "走",
    "sentence": "这是“走”字。"
  },
  {
    "char": "最",
    "pinyin": "zuì",
    "meaning": "the most; -est; (indicator for superlative)",
    "level": 2,
    "phrase": "最",
    "sentence": "这是“最”字。"
  },
  {
    "char": "啊",
    "pinyin": "a",
    "meaning": "ah; (particle showing elation, doubt, puzzled surprise, or approval)",
    "level": 3,
    "phrase": "啊",
    "sentence": "这是“啊”字。"
  },
  {
    "char": "矮",
    "pinyin": "ǎi",
    "meaning": "short; low",
    "level": 3,
    "phrase": "矮",
    "sentence": "这是“矮”字。"
  },
  {
    "char": "把",
    "pinyin": "bǎ",
    "meaning": "(mw for things with handles); (pretransitive particle); to hold",
    "level": 3,
    "phrase": "把",
    "sentence": "这是“把”字。"
  },
  {
    "char": "班",
    "pinyin": "bān",
    "meaning": "team; class; squad",
    "level": 3,
    "phrase": "班",
    "sentence": "这是“班”字。"
  },
  {
    "char": "搬",
    "pinyin": "bān",
    "meaning": "to move; to transport",
    "level": 3,
    "phrase": "搬",
    "sentence": "这是“搬”字。"
  },
  {
    "char": "半",
    "pinyin": "bàn",
    "meaning": "half; semi-; incomplete",
    "level": 3,
    "phrase": "半",
    "sentence": "这是“半”字。"
  },
  {
    "char": "包",
    "pinyin": "bāo",
    "meaning": "to cover; to wrap; to hold; include; (mw for containers, packages, etc.)",
    "level": 3,
    "phrase": "包",
    "sentence": "这是“包”字。"
  },
  {
    "char": "饱",
    "pinyin": "bǎo",
    "meaning": "eat until full; satisfied",
    "level": 3,
    "phrase": "饱",
    "sentence": "这是“饱”字。"
  },
  {
    "char": "被",
    "pinyin": "bèi",
    "meaning": "by (indicates passive voice sentences); a quilt/blanket",
    "level": 3,
    "phrase": "被",
    "sentence": "这是“被”字。"
  },
  {
    "char": "才",
    "pinyin": "cái",
    "meaning": "ability; talent; just now; not until",
    "level": 3,
    "phrase": "才",
    "sentence": "这是“才”字。"
  },
  {
    "char": "草",
    "pinyin": "cǎo",
    "meaning": "grass; straw; draft (of a document)",
    "level": 3,
    "phrase": "草",
    "sentence": "这是“草”字。"
  },
  {
    "char": "层",
    "pinyin": "céng",
    "meaning": "(mw for layers, floors of buildings)",
    "level": 3,
    "phrase": "层",
    "sentence": "这是“层”字。"
  },
  {
    "char": "差",
    "pinyin": "chà",
    "meaning": "differ from; fall short of; poor; inferior",
    "level": 3,
    "phrase": "差",
    "sentence": "这是“差”字。"
  },
  {
    "char": "船",
    "pinyin": "chuán",
    "meaning": "a boat; vessel; ship",
    "level": 3,
    "phrase": "船",
    "sentence": "这是“船”字。"
  },
  {
    "char": "春",
    "pinyin": "chūn",
    "meaning": "spring (season); joyful",
    "level": 3,
    "phrase": "春",
    "sentence": "这是“春”字。"
  },
  {
    "char": "带",
    "pinyin": "dài",
    "meaning": "band; belt; ribbon; carry; bring; take along; bring up (kids)",
    "level": 3,
    "phrase": "带",
    "sentence": "这是“带”字。"
  },
  {
    "char": "地",
    "pinyin": "dì, de",
    "meaning": "earth; ground | (adverbial particle)",
    "level": 3,
    "phrase": "地",
    "sentence": "这是“地”字。"
  },
  {
    "char": "灯",
    "pinyin": "dēng",
    "meaning": "lamp; light",
    "level": 3,
    "phrase": "灯",
    "sentence": "这是“灯”字。"
  },
  {
    "char": "东",
    "pinyin": "dōng",
    "meaning": "East",
    "level": 3,
    "phrase": "东",
    "sentence": "这是“东”字。"
  },
  {
    "char": "冬",
    "pinyin": "dōng",
    "meaning": "winter",
    "level": 3,
    "phrase": "冬",
    "sentence": "这是“冬”字。"
  },
  {
    "char": "短",
    "pinyin": "duǎn",
    "meaning": "short (in length, duration, or height); lack",
    "level": 3,
    "phrase": "短",
    "sentence": "这是“短”字。"
  },
  {
    "char": "段",
    "pinyin": "duàn",
    "meaning": "paragraph; segment; section",
    "level": 3,
    "phrase": "段",
    "sentence": "这是“段”字。"
  },
  {
    "char": "饿",
    "pinyin": "è",
    "meaning": "hungry",
    "level": 3,
    "phrase": "饿",
    "sentence": "这是“饿”字。"
  },
  {
    "char": "发",
    "pinyin": "fā, fà",
    "meaning": "send out; to issue; to show (one's feelings) | hair",
    "level": 3,
    "phrase": "发",
    "sentence": "这是“发”字。"
  },
  {
    "char": "放",
    "pinyin": "fàng",
    "meaning": "put; to place; to release; to free",
    "level": 3,
    "phrase": "放",
    "sentence": "这是“放”字。"
  },
  {
    "char": "分",
    "pinyin": "fēn, fèn",
    "meaning": "divide; part; minute; cent | component; share; ingredient",
    "level": 3,
    "phrase": "分",
    "sentence": "这是“分”字。"
  },
  {
    "char": "跟",
    "pinyin": "gēn",
    "meaning": "to follow; go with; heel",
    "level": 3,
    "phrase": "跟",
    "sentence": "这是“跟”字。"
  },
  {
    "char": "更",
    "pinyin": "gèng",
    "meaning": "more; even more",
    "level": 3,
    "phrase": "更",
    "sentence": "这是“更”字。"
  },
  {
    "char": "关",
    "pinyin": "guān",
    "meaning": "to close; shut; concern; relationship; turn off; mountain pass",
    "level": 3,
    "phrase": "关",
    "sentence": "这是“关”字。"
  },
  {
    "char": "花",
    "pinyin": "huā",
    "meaning": "flower; blossom; spend money; cost",
    "level": 3,
    "phrase": "花",
    "sentence": "这是“花”字。"
  },
  {
    "char": "画",
    "pinyin": "huà",
    "meaning": "draw; picture; painting",
    "level": 3,
    "phrase": "画",
    "sentence": "这是“画”字。"
  },
  {
    "char": "坏",
    "pinyin": "huài",
    "meaning": "bad; broken",
    "level": 3,
    "phrase": "坏",
    "sentence": "这是“坏”字。"
  },
  {
    "char": "换",
    "pinyin": "huàn",
    "meaning": "change; to exchange; to barter; to trade",
    "level": 3,
    "phrase": "换",
    "sentence": "这是“换”字。"
  },
  {
    "char": "极",
    "pinyin": "jí",
    "meaning": "an extreme; pole; very",
    "level": 3,
    "phrase": "极",
    "sentence": "这是“极”字。"
  },
  {
    "char": "讲",
    "pinyin": "jiǎng",
    "meaning": "to talk; to lecture; to explain; a speech",
    "level": 3,
    "phrase": "讲",
    "sentence": "这是“讲”字。"
  },
  {
    "char": "角",
    "pinyin": "jiǎo, jué",
    "meaning": "horn; angle; unit of money (1/10 yuan); corner (Kangxi radical 148) | role (theater)",
    "level": 3,
    "phrase": "角",
    "sentence": "这是“角”字。"
  },
  {
    "char": "脚",
    "pinyin": "jiǎo",
    "meaning": "foot (body part)",
    "level": 3,
    "phrase": "脚",
    "sentence": "这是“脚”字。"
  },
  {
    "char": "教",
    "pinyin": "jiāo, jiào",
    "meaning": "teach; instruct | religion; teaching",
    "level": 3,
    "phrase": "教",
    "sentence": "这是“教”字。"
  },
  {
    "char": "接",
    "pinyin": "jiē",
    "meaning": "connect; to meet; to pick up (somebody); to receive",
    "level": 3,
    "phrase": "接",
    "sentence": "这是“接”字。"
  },
  {
    "char": "借",
    "pinyin": "jiè",
    "meaning": "lend; borrow; excuse",
    "level": 3,
    "phrase": "借",
    "sentence": "这是“借”字。"
  },
  {
    "char": "久",
    "pinyin": "jiǔ",
    "meaning": "long (time)",
    "level": 3,
    "phrase": "久",
    "sentence": "这是“久”字。"
  },
  {
    "char": "旧",
    "pinyin": "jiù",
    "meaning": "old; past; used",
    "level": 3,
    "phrase": "旧",
    "sentence": "这是“旧”字。"
  },
  {
    "char": "渴",
    "pinyin": "kě",
    "meaning": "thirsty",
    "level": 3,
    "phrase": "渴",
    "sentence": "这是“渴”字。"
  },
  {
    "char": "刻",
    "pinyin": "kè",
    "meaning": "quarter (hour); (mw for short time intervals); carve; to cut",
    "level": 3,
    "phrase": "刻",
    "sentence": "这是“刻”字。"
  },
  {
    "char": "口",
    "pinyin": "kǒu",
    "meaning": "mouth (Kangxi radical 30)",
    "level": 3,
    "phrase": "口",
    "sentence": "这是“口”字。"
  },
  {
    "char": "哭",
    "pinyin": "kū",
    "meaning": "cry; weep",
    "level": 3,
    "phrase": "哭",
    "sentence": "这是“哭”字。"
  },
  {
    "char": "蓝",
    "pinyin": "lán",
    "meaning": "blue",
    "level": 3,
    "phrase": "蓝",
    "sentence": "这是“蓝”字。"
  },
  {
    "char": "老",
    "pinyin": "lǎo",
    "meaning": "old; aged; tough; often (Kangxi radical 125)",
    "level": 3,
    "phrase": "老",
    "sentence": "这是“老”字。"
  },
  {
    "char": "脸",
    "pinyin": "liǎn",
    "meaning": "face",
    "level": 3,
    "phrase": "脸",
    "sentence": "这是“脸”字。"
  },
  {
    "char": "辆",
    "pinyin": "liàng",
    "meaning": "(mw for vehicles)",
    "level": 3,
    "phrase": "辆",
    "sentence": "这是“辆”字。"
  },
  {
    "char": "楼",
    "pinyin": "lóu",
    "meaning": "story; floor; (multi-story) building",
    "level": 3,
    "phrase": "楼",
    "sentence": "这是“楼”字。"
  },
  {
    "char": "绿",
    "pinyin": "lǜ",
    "meaning": "green",
    "level": 3,
    "phrase": "绿",
    "sentence": "这是“绿”字。"
  },
  {
    "char": "马",
    "pinyin": "mǎ",
    "meaning": "horse (Kangxi radical 187)",
    "level": 3,
    "phrase": "马",
    "sentence": "这是“马”字。"
  },
  {
    "char": "米",
    "pinyin": "mǐ",
    "meaning": "rice; meter (Kangxi radical 119)",
    "level": 3,
    "phrase": "米",
    "sentence": "这是“米”字。"
  },
  {
    "char": "拿",
    "pinyin": "ná",
    "meaning": "carry in your hand; seize; to catch",
    "level": 3,
    "phrase": "拿",
    "sentence": "这是“拿”字。"
  },
  {
    "char": "南",
    "pinyin": "nán",
    "meaning": "South",
    "level": 3,
    "phrase": "南",
    "sentence": "这是“南”字。"
  },
  {
    "char": "难",
    "pinyin": "nán",
    "meaning": "difficult",
    "level": 3,
    "phrase": "难",
    "sentence": "这是“难”字。"
  },
  {
    "char": "鸟",
    "pinyin": "niǎo",
    "meaning": "bird (Kangxi radical 196)",
    "level": 3,
    "phrase": "鸟",
    "sentence": "这是“鸟”字。"
  },
  {
    "char": "胖",
    "pinyin": "pàng",
    "meaning": "fat; plump",
    "level": 3,
    "phrase": "胖",
    "sentence": "这是“胖”字。"
  },
  {
    "char": "骑",
    "pinyin": "qí",
    "meaning": "to ride (an animal or bike); to sit astride",
    "level": 3,
    "phrase": "骑",
    "sentence": "这是“骑”字。"
  },
  {
    "char": "秋",
    "pinyin": "qiū",
    "meaning": "autumn; fall; harvest time",
    "level": 3,
    "phrase": "秋",
    "sentence": "这是“秋”字。"
  },
  {
    "char": "伞",
    "pinyin": "sǎn",
    "meaning": "umbrella; parasol",
    "level": 3,
    "phrase": "伞",
    "sentence": "这是“伞”字。"
  },
  {
    "char": "试",
    "pinyin": "shì",
    "meaning": "to try; to test; examination",
    "level": 3,
    "phrase": "试",
    "sentence": "这是“试”字。"
  },
  {
    "char": "瘦",
    "pinyin": "shòu",
    "meaning": "thin; tight; lean",
    "level": 3,
    "phrase": "瘦",
    "sentence": "这是“瘦”字。"
  },
  {
    "char": "树",
    "pinyin": "shù",
    "meaning": "tree",
    "level": 3,
    "phrase": "树",
    "sentence": "这是“树”字。"
  },
  {
    "char": "双",
    "pinyin": "shuāng",
    "meaning": "two; double; (mw for pairs)",
    "level": 3,
    "phrase": "双",
    "sentence": "这是“双”字。"
  },
  {
    "char": "疼",
    "pinyin": "téng",
    "meaning": "ache; sore; (it) hurts; love fondly",
    "level": 3,
    "phrase": "疼",
    "sentence": "这是“疼”字。"
  },
  {
    "char": "甜",
    "pinyin": "tián",
    "meaning": "sweet",
    "level": 3,
    "phrase": "甜",
    "sentence": "这是“甜”字。"
  },
  {
    "char": "条",
    "pinyin": "tiáo",
    "meaning": "strip; (mw for long thin objects); item",
    "level": 3,
    "phrase": "条",
    "sentence": "这是“条”字。"
  },
  {
    "char": "腿",
    "pinyin": "tuǐ",
    "meaning": "leg",
    "level": 3,
    "phrase": "腿",
    "sentence": "这是“腿”字。"
  },
  {
    "char": "碗",
    "pinyin": "wǎn",
    "meaning": "bowl; cup",
    "level": 3,
    "phrase": "碗",
    "sentence": "这是“碗”字。"
  },
  {
    "char": "万",
    "pinyin": "wàn",
    "meaning": "ten thousand",
    "level": 3,
    "phrase": "万",
    "sentence": "这是“万”字。"
  },
  {
    "char": "为",
    "pinyin": "wèi",
    "meaning": "for; because of; to; for the sake of",
    "level": 3,
    "phrase": "为",
    "sentence": "这是“为”字。"
  },
  {
    "char": "位",
    "pinyin": "wèi",
    "meaning": "position; location; (polite mw for people)",
    "level": 3,
    "phrase": "位",
    "sentence": "这是“位”字。"
  },
  {
    "char": "西",
    "pinyin": "xī",
    "meaning": "West (Kangxi radical 146)",
    "level": 3,
    "phrase": "西",
    "sentence": "这是“西”字。"
  },
  {
    "char": "夏",
    "pinyin": "xià",
    "meaning": "summer",
    "level": 3,
    "phrase": "夏",
    "sentence": "这是“夏”字。"
  },
  {
    "char": "先",
    "pinyin": "xiān",
    "meaning": "first; early; before",
    "level": 3,
    "phrase": "先",
    "sentence": "这是“先”字。"
  },
  {
    "char": "向",
    "pinyin": "xiàng",
    "meaning": "direction; towards; to turn; to face",
    "level": 3,
    "phrase": "向",
    "sentence": "这是“向”字。"
  },
  {
    "char": "像",
    "pinyin": "xiàng",
    "meaning": "be like; resemble; appearance; appear",
    "level": 3,
    "phrase": "像",
    "sentence": "这是“像”字。"
  },
  {
    "char": "用",
    "pinyin": "yòng",
    "meaning": "to use (Kangxi radical 101)",
    "level": 3,
    "phrase": "用",
    "sentence": "这是“用”字。"
  },
  {
    "char": "又",
    "pinyin": "yòu",
    "meaning": "(once) again; also; both (Kangxi radical 29)",
    "level": 3,
    "phrase": "又",
    "sentence": "这是“又”字。"
  },
  {
    "char": "元",
    "pinyin": "yuán",
    "meaning": "Chinese monetary unit; dollar; first; principal",
    "level": 3,
    "phrase": "元",
    "sentence": "这是“元”字。"
  },
  {
    "char": "越",
    "pinyin": "yuè",
    "meaning": "even more; the more; exceed",
    "level": 3,
    "phrase": "越",
    "sentence": "这是“越”字。"
  },
  {
    "char": "站",
    "pinyin": "zhàn",
    "meaning": "stand; a station; be on one's feet; service center",
    "level": 3,
    "phrase": "站",
    "sentence": "这是“站”字。"
  },
  {
    "char": "张",
    "pinyin": "zhāng",
    "meaning": "(mw for flat objects); to spread out; (common surname)",
    "level": 3,
    "phrase": "张",
    "sentence": "这是“张”字。"
  },
  {
    "char": "只",
    "pinyin": "zhī, zhǐ",
    "meaning": "but; only; merely; just | (mw for birds and certain animals)",
    "level": 3,
    "phrase": "只",
    "sentence": "这是“只”字。"
  },
  {
    "char": "种",
    "pinyin": "zhǒng",
    "meaning": "type; breed; race; seed",
    "level": 3,
    "phrase": "种",
    "sentence": "这是“种”字。"
  },
  {
    "char": "嘴",
    "pinyin": "zuǐ",
    "meaning": "mouth",
    "level": 3,
    "phrase": "嘴",
    "sentence": "这是“嘴”字。"
  },
  {
    "char": "棒",
    "pinyin": "bàng",
    "meaning": "stick; club; good; excellent",
    "level": 4,
    "phrase": "棒",
    "sentence": "这是“棒”字。"
  },
  {
    "char": "抱",
    "pinyin": "bào",
    "meaning": "to hold; to hug; carry in one's arms; to cradle",
    "level": 4,
    "phrase": "抱",
    "sentence": "这是“抱”字。"
  },
  {
    "char": "倍",
    "pinyin": "bèi",
    "meaning": "(two, three, etc)-fold; times (multiplier)",
    "level": 4,
    "phrase": "倍",
    "sentence": "这是“倍”字。"
  },
  {
    "char": "笨",
    "pinyin": "bèn",
    "meaning": "stupid; foolish; silly; dumb; clumsy",
    "level": 4,
    "phrase": "笨",
    "sentence": "这是“笨”字。"
  },
  {
    "char": "遍",
    "pinyin": "biàn",
    "meaning": "a time; everywhere; turn; (mw for times or turns)",
    "level": 4,
    "phrase": "遍",
    "sentence": "这是“遍”字。"
  },
  {
    "char": "擦",
    "pinyin": "cā",
    "meaning": "to wipe; to rub; to polish",
    "level": 4,
    "phrase": "擦",
    "sentence": "这是“擦”字。"
  },
  {
    "char": "猜",
    "pinyin": "cāi",
    "meaning": "to guess",
    "level": 4,
    "phrase": "猜",
    "sentence": "这是“猜”字。"
  },
  {
    "char": "尝",
    "pinyin": "cháng",
    "meaning": "to taste; flavor; (past tense marker)",
    "level": 4,
    "phrase": "尝",
    "sentence": "这是“尝”字。"
  },
  {
    "char": "场",
    "pinyin": "chǎng",
    "meaning": "courtyard; place; field; (mw for games, performances, etc.)",
    "level": 4,
    "phrase": "场",
    "sentence": "这是“场”字。"
  },
  {
    "char": "存",
    "pinyin": "cún",
    "meaning": "exist; to deposit; to store",
    "level": 4,
    "phrase": "存",
    "sentence": "这是“存”字。"
  },
  {
    "char": "戴",
    "pinyin": "dài",
    "meaning": "put on; to wear; to respect",
    "level": 4,
    "phrase": "戴",
    "sentence": "这是“戴”字。"
  },
  {
    "char": "当",
    "pinyin": "dāng",
    "meaning": "should; act as; work as; manage; match; (sound of bells)",
    "level": 4,
    "phrase": "当",
    "sentence": "这是“当”字。"
  },
  {
    "char": "刀",
    "pinyin": "dāo",
    "meaning": "knife; blade (Kangxi radical 18)",
    "level": 4,
    "phrase": "刀",
    "sentence": "这是“刀”字。"
  },
  {
    "char": "倒",
    "pinyin": "dǎo, dào",
    "meaning": "to collapse; to fall; fail; to exchange | to pour; contrary to expectations",
    "level": 4,
    "phrase": "倒",
    "sentence": "这是“倒”字。"
  },
  {
    "char": "低",
    "pinyin": "dī",
    "meaning": "low; to lower (one's head); droop",
    "level": 4,
    "phrase": "低",
    "sentence": "这是“低”字。"
  },
  {
    "char": "底",
    "pinyin": "dǐ",
    "meaning": "bottom; background; base",
    "level": 4,
    "phrase": "底",
    "sentence": "这是“底”字。"
  },
  {
    "char": "掉",
    "pinyin": "diào",
    "meaning": "to drop; to fall",
    "level": 4,
    "phrase": "掉",
    "sentence": "这是“掉”字。"
  },
  {
    "char": "丢",
    "pinyin": "diū",
    "meaning": "lose (something); throw; put aside",
    "level": 4,
    "phrase": "丢",
    "sentence": "这是“丢”字。"
  },
  {
    "char": "而",
    "pinyin": "ér",
    "meaning": "and; but; yet; while (Kangxi radical 126)",
    "level": 4,
    "phrase": "而",
    "sentence": "这是“而”字。"
  },
  {
    "char": "份",
    "pinyin": "fèn",
    "meaning": "part; portion; (mw for documents, papers, jobs, etc.)",
    "level": 4,
    "phrase": "份",
    "sentence": "这是“份”字。"
  },
  {
    "char": "富",
    "pinyin": "fù",
    "meaning": "wealthy",
    "level": 4,
    "phrase": "富",
    "sentence": "这是“富”字。"
  },
  {
    "char": "赶",
    "pinyin": "gǎn",
    "meaning": "catch up; overtake; drive away",
    "level": 4,
    "phrase": "赶",
    "sentence": "这是“赶”字。"
  },
  {
    "char": "敢",
    "pinyin": "gǎn",
    "meaning": "to dare",
    "level": 4,
    "phrase": "敢",
    "sentence": "这是“敢”字。"
  },
  {
    "char": "干",
    "pinyin": "gān",
    "meaning": "to concern; shield; dry; clean (Kangxi radical 51)",
    "level": 4,
    "phrase": "干",
    "sentence": "这是“干”字。"
  },
  {
    "char": "刚",
    "pinyin": "gāng",
    "meaning": "just (indicating the immediate past); recently; firm",
    "level": 4,
    "phrase": "刚",
    "sentence": "这是“刚”字。"
  },
  {
    "char": "各",
    "pinyin": "gè",
    "meaning": "each; every",
    "level": 4,
    "phrase": "各",
    "sentence": "这是“各”字。"
  },
  {
    "char": "够",
    "pinyin": "gòu",
    "meaning": "enough; to reach",
    "level": 4,
    "phrase": "够",
    "sentence": "这是“够”字。"
  },
  {
    "char": "挂",
    "pinyin": "guà",
    "meaning": "hang; put up; suspend",
    "level": 4,
    "phrase": "挂",
    "sentence": "这是“挂”字。"
  },
  {
    "char": "光",
    "pinyin": "guāng",
    "meaning": "light; ray; bright; only; merely; used up",
    "level": 4,
    "phrase": "光",
    "sentence": "这是“光”字。"
  },
  {
    "char": "逛",
    "pinyin": "guàng",
    "meaning": "to stroll; to visit; go window shopping",
    "level": 4,
    "phrase": "逛",
    "sentence": "这是“逛”字。"
  },
  {
    "char": "汗",
    "pinyin": "hàn",
    "meaning": "sweat; perspiration; Khan",
    "level": 4,
    "phrase": "汗",
    "sentence": "这是“汗”字。"
  },
  {
    "char": "厚",
    "pinyin": "hòu",
    "meaning": "thick (for flat things); generous",
    "level": 4,
    "phrase": "厚",
    "sentence": "这是“厚”字。"
  },
  {
    "char": "火",
    "pinyin": "huǒ",
    "meaning": "fire (Kangxi radical 86)",
    "level": 4,
    "phrase": "火",
    "sentence": "这是“火”字。"
  },
  {
    "char": "寄",
    "pinyin": "jì",
    "meaning": "send by mail",
    "level": 4,
    "phrase": "寄",
    "sentence": "这是“寄”字。"
  },
  {
    "char": "假",
    "pinyin": "jiǎ, jià",
    "meaning": "fake; if; borrow | vacation; holiday",
    "level": 4,
    "phrase": "假",
    "sentence": "这是“假”字。"
  },
  {
    "char": "交",
    "pinyin": "jiāo",
    "meaning": "deliver; turn over; intersect; to pay (money); friendship",
    "level": 4,
    "phrase": "交",
    "sentence": "这是“交”字。"
  },
  {
    "char": "节",
    "pinyin": "jié",
    "meaning": "section; part; festival; moral integrity; save; (mw for class periods)",
    "level": 4,
    "phrase": "节",
    "sentence": "这是“节”字。"
  },
  {
    "char": "举",
    "pinyin": "jǔ",
    "meaning": "lift; raise; cite",
    "level": 4,
    "phrase": "举",
    "sentence": "这是“举”字。"
  },
  {
    "char": "棵",
    "pinyin": "kē",
    "meaning": "(mw for plants)",
    "level": 4,
    "phrase": "棵",
    "sentence": "这是“棵”字。"
  },
  {
    "char": "空",
    "pinyin": "kōng, kòng",
    "meaning": "empty; sky | leave blank; leisure",
    "level": 4,
    "phrase": "空",
    "sentence": "这是“空”字。"
  },
  {
    "char": "苦",
    "pinyin": "kǔ",
    "meaning": "bitter; miserable",
    "level": 4,
    "phrase": "苦",
    "sentence": "这是“苦”字。"
  },
  {
    "char": "困",
    "pinyin": "kùn",
    "meaning": "sleepy; surround; hard-pressed",
    "level": 4,
    "phrase": "困",
    "sentence": "这是“困”字。"
  },
  {
    "char": "拉",
    "pinyin": "lā",
    "meaning": "to pull; to play (string instruments); to drag",
    "level": 4,
    "phrase": "拉",
    "sentence": "这是“拉”字。"
  },
  {
    "char": "辣",
    "pinyin": "là",
    "meaning": "hot (spicy)",
    "level": 4,
    "phrase": "辣",
    "sentence": "这是“辣”字。"
  },
  {
    "char": "懒",
    "pinyin": "lǎn",
    "meaning": "lazy",
    "level": 4,
    "phrase": "懒",
    "sentence": "这是“懒”字。"
  },
  {
    "char": "俩",
    "pinyin": "liǎng",
    "meaning": "(colloquial) two (people)",
    "level": 4,
    "phrase": "俩",
    "sentence": "这是“俩”字。"
  },
  {
    "char": "连",
    "pinyin": "lián",
    "meaning": "even; including; join",
    "level": 4,
    "phrase": "连",
    "sentence": "这是“连”字。"
  },
  {
    "char": "留",
    "pinyin": "liú",
    "meaning": "to leave (behind, a message); to retain; to stay",
    "level": 4,
    "phrase": "留",
    "sentence": "这是“留”字。"
  },
  {
    "char": "乱",
    "pinyin": "luàn",
    "meaning": "disorder; confusion; arbitrarily",
    "level": 4,
    "phrase": "乱",
    "sentence": "这是“乱”字。"
  },
  {
    "char": "满",
    "pinyin": "mǎn",
    "meaning": "full; abbreviation for Manchurian",
    "level": 4,
    "phrase": "满",
    "sentence": "这是“满”字。"
  },
  {
    "char": "毛",
    "pinyin": "máo",
    "meaning": "hair; fur; feather; dime (Kangxi radical 82)",
    "level": 4,
    "phrase": "毛",
    "sentence": "这是“毛”字。"
  },
  {
    "char": "梦",
    "pinyin": "mèng",
    "meaning": "to dream",
    "level": 4,
    "phrase": "梦",
    "sentence": "这是“梦”字。"
  },
  {
    "char": "秒",
    "pinyin": "miǎo",
    "meaning": "second (unit of time or angle)",
    "level": 4,
    "phrase": "秒",
    "sentence": "这是“秒”字。"
  },
  {
    "char": "内",
    "pinyin": "nèi",
    "meaning": "inside; inner; internal; within",
    "level": 4,
    "phrase": "内",
    "sentence": "这是“内”字。"
  },
  {
    "char": "弄",
    "pinyin": "nòng",
    "meaning": "do; manage; to handle; make",
    "level": 4,
    "phrase": "弄",
    "sentence": "这是“弄”字。"
  },
  {
    "char": "陪",
    "pinyin": "péi",
    "meaning": "accompany; keep company",
    "level": 4,
    "phrase": "陪",
    "sentence": "这是“陪”字。"
  },
  {
    "char": "篇",
    "pinyin": "piān",
    "meaning": "sheet; (mw for articles); piece of writing",
    "level": 4,
    "phrase": "篇",
    "sentence": "这是“篇”字。"
  },
  {
    "char": "骗",
    "pinyin": "piàn",
    "meaning": "to cheat; to swindle; deceive",
    "level": 4,
    "phrase": "骗",
    "sentence": "这是“骗”字。"
  },
  {
    "char": "破",
    "pinyin": "pò",
    "meaning": "broken; damaged; to split",
    "level": 4,
    "phrase": "破",
    "sentence": "这是“破”字。"
  },
  {
    "char": "敲",
    "pinyin": "qiāo",
    "meaning": "knock; blackmail",
    "level": 4,
    "phrase": "敲",
    "sentence": "这是“敲”字。"
  },
  {
    "char": "桥",
    "pinyin": "qiáo",
    "meaning": "bridge",
    "level": 4,
    "phrase": "桥",
    "sentence": "这是“桥”字。"
  },
  {
    "char": "轻",
    "pinyin": "qīng",
    "meaning": "light; easy; gentle; soft",
    "level": 4,
    "phrase": "轻",
    "sentence": "这是“轻”字。"
  },
  {
    "char": "穷",
    "pinyin": "qióng",
    "meaning": "poor; exhausted",
    "level": 4,
    "phrase": "穷",
    "sentence": "这是“穷”字。"
  },
  {
    "char": "取",
    "pinyin": "qǔ",
    "meaning": "to take; get; choose",
    "level": 4,
    "phrase": "取",
    "sentence": "这是“取”字。"
  },
  {
    "char": "却",
    "pinyin": "què",
    "meaning": "but; yet; however",
    "level": 4,
    "phrase": "却",
    "sentence": "这是“却”字。"
  },
  {
    "char": "扔",
    "pinyin": "rēng",
    "meaning": "to throw; throw away",
    "level": 4,
    "phrase": "扔",
    "sentence": "这是“扔”字。"
  },
  {
    "char": "深",
    "pinyin": "shēn",
    "meaning": "deep; profound; dark (of colors)",
    "level": 4,
    "phrase": "深",
    "sentence": "这是“深”字。"
  },
  {
    "char": "省",
    "pinyin": "shěng",
    "meaning": "to save; economize; omit; province",
    "level": 4,
    "phrase": "省",
    "sentence": "这是“省”字。"
  },
  {
    "char": "剩",
    "pinyin": "shèng",
    "meaning": "have as remainder; be left over; surplus",
    "level": 4,
    "phrase": "剩",
    "sentence": "这是“剩”字。"
  },
  {
    "char": "使",
    "pinyin": "shǐ",
    "meaning": "to use; to make; to cause; enable; envoy; messenger",
    "level": 4,
    "phrase": "使",
    "sentence": "这是“使”字。"
  },
  {
    "char": "收",
    "pinyin": "shōu",
    "meaning": "receive; accept; collect; to harvest",
    "level": 4,
    "phrase": "收",
    "sentence": "这是“收”字。"
  },
  {
    "char": "输",
    "pinyin": "shū",
    "meaning": "to transport; to lose (a game, etc.)",
    "level": 4,
    "phrase": "输",
    "sentence": "这是“输”字。"
  },
  {
    "char": "帅",
    "pinyin": "shuài",
    "meaning": "handsome; graceful; commander-in-chief",
    "level": 4,
    "phrase": "帅",
    "sentence": "这是“帅”字。"
  },
  {
    "char": "死",
    "pinyin": "sǐ",
    "meaning": "to die; dead; fixed; impassible; extremely",
    "level": 4,
    "phrase": "死",
    "sentence": "这是“死”字。"
  },
  {
    "char": "酸",
    "pinyin": "suān",
    "meaning": "sour; sore; ache",
    "level": 4,
    "phrase": "酸",
    "sentence": "这是“酸”字。"
  },
  {
    "char": "台",
    "pinyin": "tái",
    "meaning": "platform; Taiwan (abbr.); desk; stage; typhoon; (mw for machines); (classical) you (in letters)",
    "level": 4,
    "phrase": "台",
    "sentence": "这是“台”字。"
  },
  {
    "char": "抬",
    "pinyin": "tái",
    "meaning": "to lift; to raise (with both palms up); carry (together)",
    "level": 4,
    "phrase": "抬",
    "sentence": "这是“抬”字。"
  },
  {
    "char": "谈",
    "pinyin": "tán",
    "meaning": "to talk; to chat; discuss",
    "level": 4,
    "phrase": "谈",
    "sentence": "这是“谈”字。"
  },
  {
    "char": "汤",
    "pinyin": "tāng",
    "meaning": "soup; broth",
    "level": 4,
    "phrase": "汤",
    "sentence": "这是“汤”字。"
  },
  {
    "char": "糖",
    "pinyin": "táng",
    "meaning": "sugar; candy; sweets",
    "level": 4,
    "phrase": "糖",
    "sentence": "这是“糖”字。"
  },
  {
    "char": "躺",
    "pinyin": "tǎng",
    "meaning": "recline; lie down (on back or side)",
    "level": 4,
    "phrase": "躺",
    "sentence": "这是“躺”字。"
  },
  {
    "char": "趟",
    "pinyin": "tàng, tāng",
    "meaning": "(mw for trips times) | to wade",
    "level": 4,
    "phrase": "趟",
    "sentence": "这是“趟”字。"
  },
  {
    "char": "提",
    "pinyin": "tí",
    "meaning": "to carry; to lift; to raise (an issue)",
    "level": 4,
    "phrase": "提",
    "sentence": "这是“提”字。"
  },
  {
    "char": "停",
    "pinyin": "tíng",
    "meaning": "to stop; to halt; to park (a car)",
    "level": 4,
    "phrase": "停",
    "sentence": "这是“停”字。"
  },
  {
    "char": "挺",
    "pinyin": "tǐng",
    "meaning": "straighten up; stick out; rather (good); very",
    "level": 4,
    "phrase": "挺",
    "sentence": "这是“挺”字。"
  },
  {
    "char": "推",
    "pinyin": "tuī",
    "meaning": "to push; to scrape; to decline; postpone; elect",
    "level": 4,
    "phrase": "推",
    "sentence": "这是“推”字。"
  },
  {
    "char": "脱",
    "pinyin": "tuō",
    "meaning": "to shed; take off; to escape",
    "level": 4,
    "phrase": "脱",
    "sentence": "这是“脱”字。"
  },
  {
    "char": "无",
    "pinyin": "wú",
    "meaning": "have not; without; not (Kangxi radical 71)",
    "level": 4,
    "phrase": "无",
    "sentence": "这是“无”字。"
  },
  {
    "char": "咸",
    "pinyin": "xián",
    "meaning": "salty; salted; all",
    "level": 4,
    "phrase": "咸",
    "sentence": "这是“咸”字。"
  },
  {
    "char": "香",
    "pinyin": "xiāng",
    "meaning": "fragrant; savory (Kangxi radical 186)",
    "level": 4,
    "phrase": "香",
    "sentence": "这是“香”字。"
  },
  {
    "char": "响",
    "pinyin": "xiǎng",
    "meaning": "make a sound; to ring; echo",
    "level": 4,
    "phrase": "响",
    "sentence": "这是“响”字。"
  },
  {
    "char": "行",
    "pinyin": "xíng",
    "meaning": "walk; be current; do; will do; okay",
    "level": 4,
    "phrase": "行",
    "sentence": "这是“行”字。"
  },
  {
    "char": "醒",
    "pinyin": "xǐng",
    "meaning": "wake up",
    "level": 4,
    "phrase": "醒",
    "sentence": "这是“醒”字。"
  },
  {
    "char": "呀",
    "pinyin": "ya",
    "meaning": "ah; oh; (used for 啊 after words ending with a, e, i, o, or ü)",
    "level": 4,
    "phrase": "呀",
    "sentence": "这是“呀”字。"
  },
  {
    "char": "盐",
    "pinyin": "yán",
    "meaning": "salt",
    "level": 4,
    "phrase": "盐",
    "sentence": "这是“盐”字。"
  },
  {
    "char": "页",
    "pinyin": "yè",
    "meaning": "page; leaf (Kangxi radical 181)",
    "level": 4,
    "phrase": "页",
    "sentence": "这是“页”字。"
  },
  {
    "char": "以",
    "pinyin": "yǐ",
    "meaning": "to use; according to; so as to; for; by",
    "level": 4,
    "phrase": "以",
    "sentence": "这是“以”字。"
  },
  {
    "char": "赢",
    "pinyin": "yíng",
    "meaning": "to win; to beat; to profit",
    "level": 4,
    "phrase": "赢",
    "sentence": "这是“赢”字。"
  },
  {
    "char": "由",
    "pinyin": "yóu",
    "meaning": "follow; from; by; through",
    "level": 4,
    "phrase": "由",
    "sentence": "这是“由”字。"
  },
  {
    "char": "与",
    "pinyin": "yǔ",
    "meaning": "(formal) and; to give; together with; participate; final particle expressing doubt or surprise",
    "level": 4,
    "phrase": "与",
    "sentence": "这是“与”字。"
  },
  {
    "char": "云",
    "pinyin": "yún",
    "meaning": "cloud; Yunnan province | say; speak",
    "level": 4,
    "phrase": "云",
    "sentence": "这是“云”字。"
  },
  {
    "char": "脏",
    "pinyin": "zāng",
    "meaning": "filthy; dirty",
    "level": 4,
    "phrase": "脏",
    "sentence": "这是“脏”字。"
  },
  {
    "char": "照",
    "pinyin": "zhào",
    "meaning": "to shine; illuminate; according to",
    "level": 4,
    "phrase": "照",
    "sentence": "这是“照”字。"
  },
  {
    "char": "之",
    "pinyin": "zhī",
    "meaning": "(literary equivalent to 的); (pronoun); of",
    "level": 4,
    "phrase": "之",
    "sentence": "这是“之”字。"
  },
  {
    "char": "指",
    "pinyin": "zhǐ",
    "meaning": "finger; to point (at, to, out); refer to",
    "level": 4,
    "phrase": "指",
    "sentence": "这是“指”字。"
  },
  {
    "char": "重",
    "pinyin": "zhòng",
    "meaning": "heavy; serious; important",
    "level": 4,
    "phrase": "重",
    "sentence": "这是“重”字。"
  },
  {
    "char": "转",
    "pinyin": "zhuǎn, zhuàn",
    "meaning": "to turn; to change; pass on | revolve; rotate",
    "level": 4,
    "phrase": "转",
    "sentence": "这是“转”字。"
  },
  {
    "char": "赚",
    "pinyin": "zhuàn",
    "meaning": "earn; make a profit",
    "level": 4,
    "phrase": "赚",
    "sentence": "这是“赚”字。"
  },
  {
    "char": "租",
    "pinyin": "zū",
    "meaning": "to rent",
    "level": 4,
    "phrase": "租",
    "sentence": "这是“租”字。"
  },
  {
    "char": "座",
    "pinyin": "zuò",
    "meaning": "(mw for mountains, bridges, tall buildings, etc.); | seat; base; stand; constellation",
    "level": 4,
    "phrase": "座",
    "sentence": "这是“座”字。"
  },
  {
    "char": "哎",
    "pinyin": "āi",
    "meaning": "hey!; (interjection of surprise or dissatisfaction)",
    "level": 5,
    "phrase": "哎",
    "sentence": "这是“哎”字。"
  },
  {
    "char": "唉",
    "pinyin": "ài",
    "meaning": "(an exclamation indicating resignation); oh well; oh; mm",
    "level": 5,
    "phrase": "唉",
    "sentence": "这是“唉”字。"
  },
  {
    "char": "岸",
    "pinyin": "àn",
    "meaning": "bank; shore; beach; coast",
    "level": 5,
    "phrase": "岸",
    "sentence": "这是“岸”字。"
  },
  {
    "char": "暗",
    "pinyin": "àn",
    "meaning": "dark; gloomy; hidden; secret",
    "level": 5,
    "phrase": "暗",
    "sentence": "这是“暗”字。"
  },
  {
    "char": "摆",
    "pinyin": "bǎi",
    "meaning": "to put (on); arrange; to sway; pendulum",
    "level": 5,
    "phrase": "摆",
    "sentence": "这是“摆”字。"
  },
  {
    "char": "薄",
    "pinyin": "báo",
    "meaning": "thin; flimsy; weak (first two pronunciations)",
    "level": 5,
    "phrase": "薄",
    "sentence": "这是“薄”字。"
  },
  {
    "char": "背",
    "pinyin": "bēi",
    "meaning": "carry on one's back; to bear",
    "level": 5,
    "phrase": "背",
    "sentence": "这是“背”字。"
  },
  {
    "char": "便",
    "pinyin": "biàn, pián",
    "meaning": "plain; convenient; excretion; formal equivalent to 就 | cheap",
    "level": 5,
    "phrase": "便",
    "sentence": "这是“便”字。"
  },
  {
    "char": "布",
    "pinyin": "bù",
    "meaning": "cloth; announce; to spread",
    "level": 5,
    "phrase": "布",
    "sentence": "这是“布”字。"
  },
  {
    "char": "踩",
    "pinyin": "cǎi",
    "meaning": "step upon; to tread; to stamp",
    "level": 5,
    "phrase": "踩",
    "sentence": "这是“踩”字。"
  },
  {
    "char": "册",
    "pinyin": "cè",
    "meaning": "book; (mw for books)",
    "level": 5,
    "phrase": "册",
    "sentence": "这是“册”字。"
  },
  {
    "char": "插",
    "pinyin": "chā",
    "meaning": "to insert; stick in; pierce",
    "level": 5,
    "phrase": "插",
    "sentence": "这是“插”字。"
  },
  {
    "char": "拆",
    "pinyin": "chāi",
    "meaning": "unravel; to tear; demolish",
    "level": 5,
    "phrase": "拆",
    "sentence": "这是“拆”字。"
  },
  {
    "char": "抄",
    "pinyin": "chāo",
    "meaning": "to copy; plagiarize; search and confiscate",
    "level": 5,
    "phrase": "抄",
    "sentence": "这是“抄”字。"
  },
  {
    "char": "朝",
    "pinyin": "cháo",
    "meaning": "to face; towards; dynasty",
    "level": 5,
    "phrase": "朝",
    "sentence": "这是“朝”字。"
  },
  {
    "char": "吵",
    "pinyin": "chǎo",
    "meaning": "to quarrel; make noise",
    "level": 5,
    "phrase": "吵",
    "sentence": "这是“吵”字。"
  },
  {
    "char": "炒",
    "pinyin": "chǎo",
    "meaning": "to stir-fry; saute",
    "level": 5,
    "phrase": "炒",
    "sentence": "这是“炒”字。"
  },
  {
    "char": "趁",
    "pinyin": "chèn",
    "meaning": "avail oneself of; take advantage of (an opportunity or situation)",
    "level": 5,
    "phrase": "趁",
    "sentence": "这是“趁”字。"
  },
  {
    "char": "称",
    "pinyin": "chēng",
    "meaning": "weigh; to call; be called",
    "level": 5,
    "phrase": "称",
    "sentence": "这是“称”字。"
  },
  {
    "char": "冲",
    "pinyin": "chōng",
    "meaning": "to rush; to clash; to rinse; thoroughfare",
    "level": 5,
    "phrase": "冲",
    "sentence": "这是“冲”字。"
  },
  {
    "char": "丑",
    "pinyin": "chǒu",
    "meaning": "ugly; disgraceful (2nd Earthly Branch)",
    "level": 5,
    "phrase": "丑",
    "sentence": "这是“丑”字。"
  },
  {
    "char": "臭",
    "pinyin": "chòu",
    "meaning": "stench; stink",
    "level": 5,
    "phrase": "臭",
    "sentence": "这是“臭”字。"
  },
  {
    "char": "闯",
    "pinyin": "chuǎng",
    "meaning": "rush; break through; to temper oneself (by battling difficulties)",
    "level": 5,
    "phrase": "闯",
    "sentence": "这是“闯”字。"
  },
  {
    "char": "吹",
    "pinyin": "chuī",
    "meaning": "to blow; to blast; to puff",
    "level": 5,
    "phrase": "吹",
    "sentence": "这是“吹”字。"
  },
  {
    "char": "醋",
    "pinyin": "cù",
    "meaning": "vinegar",
    "level": 5,
    "phrase": "醋",
    "sentence": "这是“醋”字。"
  },
  {
    "char": "催",
    "pinyin": "cuī",
    "meaning": "to press; to urge; to hurry",
    "level": 5,
    "phrase": "催",
    "sentence": "这是“催”字。"
  },
  {
    "char": "呆",
    "pinyin": "dāi",
    "meaning": "stupid; foolish; blank; dumbstruck; to stay",
    "level": 5,
    "phrase": "呆",
    "sentence": "这是“呆”字。"
  },
  {
    "char": "淡",
    "pinyin": "dàn",
    "meaning": "diluted; weak; thin",
    "level": 5,
    "phrase": "淡",
    "sentence": "这是“淡”字。"
  },
  {
    "char": "挡",
    "pinyin": "dǎng",
    "meaning": "to block; hinder; gear; equipment",
    "level": 5,
    "phrase": "挡",
    "sentence": "这是“挡”字。"
  },
  {
    "char": "滴",
    "pinyin": "dī",
    "meaning": "to drip; drop; (mw for drops of liquid)",
    "level": 5,
    "phrase": "滴",
    "sentence": "这是“滴”字。"
  },
  {
    "char": "递",
    "pinyin": "dì",
    "meaning": "hand over; to pass; to give",
    "level": 5,
    "phrase": "递",
    "sentence": "这是“递”字。"
  },
  {
    "char": "钓",
    "pinyin": "diào",
    "meaning": "to fish",
    "level": 5,
    "phrase": "钓",
    "sentence": "这是“钓”字。"
  },
  {
    "char": "顶",
    "pinyin": "dǐng",
    "meaning": "top; roof; carry on one's head; prop up; to butt; (mw for headwear, i.e. hats)",
    "level": 5,
    "phrase": "顶",
    "sentence": "这是“顶”字。"
  },
  {
    "char": "冻",
    "pinyin": "dòng",
    "meaning": "to freeze",
    "level": 5,
    "phrase": "冻",
    "sentence": "这是“冻”字。"
  },
  {
    "char": "洞",
    "pinyin": "dòng",
    "meaning": "cave; hole",
    "level": 5,
    "phrase": "洞",
    "sentence": "这是“洞”字。"
  },
  {
    "char": "逗",
    "pinyin": "dòu",
    "meaning": "to tease; amuse; to stay; to stop; funny",
    "level": 5,
    "phrase": "逗",
    "sentence": "这是“逗”字。"
  },
  {
    "char": "断",
    "pinyin": "duàn",
    "meaning": "to break; decide; absolutely (usually negative)",
    "level": 5,
    "phrase": "断",
    "sentence": "这是“断”字。"
  },
  {
    "char": "堆",
    "pinyin": "duī",
    "meaning": "pile; heap; stack; crowd",
    "level": 5,
    "phrase": "堆",
    "sentence": "这是“堆”字。"
  },
  {
    "char": "吨",
    "pinyin": "dūn",
    "meaning": "ton",
    "level": 5,
    "phrase": "吨",
    "sentence": "这是“吨”字。"
  },
  {
    "char": "蹲",
    "pinyin": "dūn",
    "meaning": "to crouch; to squat",
    "level": 5,
    "phrase": "蹲",
    "sentence": "这是“蹲”字。"
  },
  {
    "char": "顿",
    "pinyin": "dùn",
    "meaning": "pause; arrange; stamp feet; suddenly; (mw for meals)",
    "level": 5,
    "phrase": "顿",
    "sentence": "这是“顿”字。"
  },
  {
    "char": "朵",
    "pinyin": "duǒ",
    "meaning": "(mw for flowers and clouds)",
    "level": 5,
    "phrase": "朵",
    "sentence": "这是“朵”字。"
  },
  {
    "char": "翻",
    "pinyin": "fān",
    "meaning": "to turn over; capsize; translate",
    "level": 5,
    "phrase": "翻",
    "sentence": "这是“翻”字。"
  },
  {
    "char": "方",
    "pinyin": "fāng",
    "meaning": "square; direction; side (Kangxi radical 70)",
    "level": 5,
    "phrase": "方",
    "sentence": "这是“方”字。"
  },
  {
    "char": "非",
    "pinyin": "fēi",
    "meaning": "non-; un-; not be; wrongdoing; simply must (Kangxi radical 175)",
    "level": 5,
    "phrase": "非",
    "sentence": "这是“非”字。"
  },
  {
    "char": "扶",
    "pinyin": "fú",
    "meaning": "to support with hand; to help somebody up",
    "level": 5,
    "phrase": "扶",
    "sentence": "这是“扶”字。"
  },
  {
    "char": "幅",
    "pinyin": "fú",
    "meaning": "width of cloth; size; (mw for pictures, paintings, textiles)",
    "level": 5,
    "phrase": "幅",
    "sentence": "这是“幅”字。"
  },
  {
    "char": "盖",
    "pinyin": "gài",
    "meaning": "lid; top; cover; to build",
    "level": 5,
    "phrase": "盖",
    "sentence": "这是“盖”字。"
  },
  {
    "char": "搞",
    "pinyin": "gǎo",
    "meaning": "do; make; be engaged in",
    "level": 5,
    "phrase": "搞",
    "sentence": "这是“搞”字。"
  },
  {
    "char": "根",
    "pinyin": "gēn",
    "meaning": "root; base; (mw for long, slender objects)",
    "level": 5,
    "phrase": "根",
    "sentence": "这是“根”字。"
  },
  {
    "char": "乖",
    "pinyin": "guāi",
    "meaning": "(of a child) obedient; well-behaved; clever; perverse; contrary to reason",
    "level": 5,
    "phrase": "乖",
    "sentence": "这是“乖”字。"
  },
  {
    "char": "官",
    "pinyin": "guān",
    "meaning": "an official; organ; governmental",
    "level": 5,
    "phrase": "官",
    "sentence": "这是“官”字。"
  },
  {
    "char": "滚",
    "pinyin": "gǔn",
    "meaning": "to roll; get lost; to boil",
    "level": 5,
    "phrase": "滚",
    "sentence": "这是“滚”字。"
  },
  {
    "char": "锅",
    "pinyin": "guō",
    "meaning": "pot; pan; boiler",
    "level": 5,
    "phrase": "锅",
    "sentence": "这是“锅”字。"
  },
  {
    "char": "哈",
    "pinyin": "hā",
    "meaning": "exhale; sip; (sound of laughter)",
    "level": 5,
    "phrase": "哈",
    "sentence": "这是“哈”字。"
  },
  {
    "char": "喊",
    "pinyin": "hǎn",
    "meaning": "call; cry; shout",
    "level": 5,
    "phrase": "喊",
    "sentence": "这是“喊”字。"
  },
  {
    "char": "恨",
    "pinyin": "hèn",
    "meaning": "to hate",
    "level": 5,
    "phrase": "恨",
    "sentence": "这是“恨”字。"
  },
  {
    "char": "壶",
    "pinyin": "hú",
    "meaning": "pot; kettle; jug; (mw for bottled liquids)",
    "level": 5,
    "phrase": "壶",
    "sentence": "这是“壶”字。"
  },
  {
    "char": "滑",
    "pinyin": "huá",
    "meaning": "slippery; cunning; crafty",
    "level": 5,
    "phrase": "滑",
    "sentence": "这是“滑”字。"
  },
  {
    "char": "划",
    "pinyin": "huà, huá",
    "meaning": "delimit; to transfer; assign | to row; to paddle; to scratch",
    "level": 5,
    "phrase": "划",
    "sentence": "这是“划”字。"
  },
  {
    "char": "灰",
    "pinyin": "huī",
    "meaning": "ash; gray (grey); dust; lime",
    "level": 5,
    "phrase": "灰",
    "sentence": "这是“灰”字。"
  },
  {
    "char": "挥",
    "pinyin": "huī",
    "meaning": "to wave; brandish; wield; wipe away",
    "level": 5,
    "phrase": "挥",
    "sentence": "这是“挥”字。"
  },
  {
    "char": "甲",
    "pinyin": "jiǎ",
    "meaning": "one; armor (1st Heavenly Stem)",
    "level": 5,
    "phrase": "甲",
    "sentence": "这是“甲”字。"
  },
  {
    "char": "嫁",
    "pinyin": "jià",
    "meaning": "marry (a husband); take a husband",
    "level": 5,
    "phrase": "嫁",
    "sentence": "这是“嫁”字。"
  },
  {
    "char": "捡",
    "pinyin": "jiǎn",
    "meaning": "to pick up; collect; gather",
    "level": 5,
    "phrase": "捡",
    "sentence": "这是“捡”字。"
  },
  {
    "char": "浇",
    "pinyin": "jiāo",
    "meaning": "to water; irrigate; to pour; to sprinkle",
    "level": 5,
    "phrase": "浇",
    "sentence": "这是“浇”字。"
  },
  {
    "char": "戒",
    "pinyin": "jiè",
    "meaning": "warn against; swear off",
    "level": 5,
    "phrase": "戒",
    "sentence": "这是“戒”字。"
  },
  {
    "char": "届",
    "pinyin": "jiè",
    "meaning": "arrive at; period; session; (mw for events; meetings; etc.)",
    "level": 5,
    "phrase": "届",
    "sentence": "这是“届”字。"
  },
  {
    "char": "救",
    "pinyin": "jiù",
    "meaning": "to save (life); to assist; to rescue",
    "level": 5,
    "phrase": "救",
    "sentence": "这是“救”字。"
  },
  {
    "char": "捐",
    "pinyin": "juān",
    "meaning": "to contribute; to donate; to subsribe to; to abandon; to relinquish; contribution; tax",
    "level": 5,
    "phrase": "捐",
    "sentence": "这是“捐”字。"
  },
  {
    "char": "砍",
    "pinyin": "kǎn",
    "meaning": "to chop; cut down",
    "level": 5,
    "phrase": "砍",
    "sentence": "这是“砍”字。"
  },
  {
    "char": "靠",
    "pinyin": "kào",
    "meaning": "depend on; lean on; near; to trust",
    "level": 5,
    "phrase": "靠",
    "sentence": "这是“靠”字。"
  },
  {
    "char": "颗",
    "pinyin": "kē",
    "meaning": "(mw for hearts and small, round things like seeds, grains, beans, etc.)",
    "level": 5,
    "phrase": "颗",
    "sentence": "这是“颗”字。"
  },
  {
    "char": "克",
    "pinyin": "kè",
    "meaning": "gram; overcome; restrain",
    "level": 5,
    "phrase": "克",
    "sentence": "这是“克”字。"
  },
  {
    "char": "夸",
    "pinyin": "kuā",
    "meaning": "to boast; to praise; exaggerate",
    "level": 5,
    "phrase": "夸",
    "sentence": "这是“夸”字。"
  },
  {
    "char": "宽",
    "pinyin": "kuān",
    "meaning": "wide; broad; relaxed; lenient",
    "level": 5,
    "phrase": "宽",
    "sentence": "这是“宽”字。"
  },
  {
    "char": "拦",
    "pinyin": "lán",
    "meaning": "to block; to cut off; hinder",
    "level": 5,
    "phrase": "拦",
    "sentence": "这是“拦”字。"
  },
  {
    "char": "烂",
    "pinyin": "làn",
    "meaning": "overcooked; rotten; soft; mushy",
    "level": 5,
    "phrase": "烂",
    "sentence": "这是“烂”字。"
  },
  {
    "char": "雷",
    "pinyin": "léi",
    "meaning": "thunder",
    "level": 5,
    "phrase": "雷",
    "sentence": "这是“雷”字。"
  },
  {
    "char": "梨",
    "pinyin": "lí",
    "meaning": "pear",
    "level": 5,
    "phrase": "梨",
    "sentence": "这是“梨”字。"
  },
  {
    "char": "亮",
    "pinyin": "liàng",
    "meaning": "bright; light; shiny",
    "level": 5,
    "phrase": "亮",
    "sentence": "这是“亮”字。"
  },
  {
    "char": "铃",
    "pinyin": "líng",
    "meaning": "bell",
    "level": 5,
    "phrase": "铃",
    "sentence": "这是“铃”字。"
  },
  {
    "char": "龙",
    "pinyin": "lóng",
    "meaning": "dragon (Kangxi radical 212)",
    "level": 5,
    "phrase": "龙",
    "sentence": "这是“龙”字。"
  },
  {
    "char": "漏",
    "pinyin": "lòu",
    "meaning": "to leak; to funnel; to let out",
    "level": 5,
    "phrase": "漏",
    "sentence": "这是“漏”字。"
  },
  {
    "char": "骂",
    "pinyin": "mà",
    "meaning": "scold; curse; condemn; verbally abuse",
    "level": 5,
    "phrase": "骂",
    "sentence": "这是“骂”字。"
  },
  {
    "char": "摸",
    "pinyin": "mō",
    "meaning": "to touch; to stroke; fish out; feel out",
    "level": 5,
    "phrase": "摸",
    "sentence": "这是“摸”字。"
  },
  {
    "char": "某",
    "pinyin": "mǒu",
    "meaning": "a certain; some",
    "level": 5,
    "phrase": "某",
    "sentence": "这是“某”字。"
  },
  {
    "char": "嫩",
    "pinyin": "nèn",
    "meaning": "tender; inexperienced",
    "level": 5,
    "phrase": "嫩",
    "sentence": "这是“嫩”字。"
  },
  {
    "char": "嗯",
    "pinyin": "ēn",
    "meaning": "(interjection expressing what?, huh? hmm? why? ok, etc.)",
    "level": 5,
    "phrase": "嗯",
    "sentence": "这是“嗯”字。"
  },
  {
    "char": "念",
    "pinyin": "niàn",
    "meaning": "read aloud; to study; to miss or think of somebody",
    "level": 5,
    "phrase": "念",
    "sentence": "这是“念”字。"
  },
  {
    "char": "浓",
    "pinyin": "nóng",
    "meaning": "concentrated; dense",
    "level": 5,
    "phrase": "浓",
    "sentence": "这是“浓”字。"
  },
  {
    "char": "拍",
    "pinyin": "pāi",
    "meaning": "to clap; to pat; to shoot (pictures, a film); send (a telegram)",
    "level": 5,
    "phrase": "拍",
    "sentence": "这是“拍”字。"
  },
  {
    "char": "派",
    "pinyin": "pài",
    "meaning": "dispatch; (mw for political groups; schools of thought; etc.)",
    "level": 5,
    "phrase": "派",
    "sentence": "这是“派”字。"
  },
  {
    "char": "盆",
    "pinyin": "pén",
    "meaning": "basin; (flower) pot",
    "level": 5,
    "phrase": "盆",
    "sentence": "这是“盆”字。"
  },
  {
    "char": "碰",
    "pinyin": "pèng",
    "meaning": "to touch; to bump; to encounter",
    "level": 5,
    "phrase": "碰",
    "sentence": "这是“碰”字。"
  },
  {
    "char": "批",
    "pinyin": "pī",
    "meaning": "criticize; to comment; wholesale; (mw for batches, lots, etc.)",
    "level": 5,
    "phrase": "批",
    "sentence": "这是“批”字。"
  },
  {
    "char": "披",
    "pinyin": "pī",
    "meaning": "drape over one's shoulders; split open; open",
    "level": 5,
    "phrase": "披",
    "sentence": "这是“披”字。"
  },
  {
    "char": "匹",
    "pinyin": "pǐ",
    "meaning": "ordinary person; (mw for horses, bolt of cloth)",
    "level": 5,
    "phrase": "匹",
    "sentence": "这是“匹”字。"
  },
  {
    "char": "片",
    "pinyin": "piàn, piān",
    "meaning": "(mw for pieces of things); a slice; a flake (Kangxi radical 91) | film; photo",
    "level": 5,
    "phrase": "片",
    "sentence": "这是“片”字。"
  },
  {
    "char": "飘",
    "pinyin": "piāo",
    "meaning": "to float; flutter",
    "level": 5,
    "phrase": "飘",
    "sentence": "这是“飘”字。"
  },
  {
    "char": "平",
    "pinyin": "píng",
    "meaning": "flat; level; equal; ordinary",
    "level": 5,
    "phrase": "平",
    "sentence": "这是“平”字。"
  },
  {
    "char": "凭",
    "pinyin": "píng",
    "meaning": "lean against; evidence; proof; no matter (what/how/etc.)",
    "level": 5,
    "phrase": "凭",
    "sentence": "这是“凭”字。"
  },
  {
    "char": "签",
    "pinyin": "qiān",
    "meaning": "bamboo used for drawing lots; toothpick; to sign (one's name)",
    "level": 5,
    "phrase": "签",
    "sentence": "这是“签”字。"
  },
  {
    "char": "浅",
    "pinyin": "qiǎn",
    "meaning": "shallow; simple; superficial; light (of colors)",
    "level": 5,
    "phrase": "浅",
    "sentence": "这是“浅”字。"
  },
  {
    "char": "欠",
    "pinyin": "qiàn",
    "meaning": "yawn; to lack; owe (Kangxi radical 76)",
    "level": 5,
    "phrase": "欠",
    "sentence": "这是“欠”字。"
  },
  {
    "char": "枪",
    "pinyin": "qiāng",
    "meaning": "gun; spear",
    "level": 5,
    "phrase": "枪",
    "sentence": "这是“枪”字。"
  },
  {
    "char": "墙",
    "pinyin": "qiáng",
    "meaning": "wall",
    "level": 5,
    "phrase": "墙",
    "sentence": "这是“墙”字。"
  },
  {
    "char": "抢",
    "pinyin": "qiǎng, qiāng",
    "meaning": "fight over; vie for; grab; rush | bump against",
    "level": 5,
    "phrase": "抢",
    "sentence": "这是“抢”字。"
  },
  {
    "char": "瞧",
    "pinyin": "qiáo",
    "meaning": "look at; see (colloquial)",
    "level": 5,
    "phrase": "瞧",
    "sentence": "这是“瞧”字。"
  },
  {
    "char": "切",
    "pinyin": "qiē, qiè",
    "meaning": "to cut; to chop | correspond to; absolutely; ardently",
    "level": 5,
    "phrase": "切",
    "sentence": "这是“切”字。"
  },
  {
    "char": "青",
    "pinyin": "qīng",
    "meaning": "blue; green; young (Kangxi radical 174); Qinghai province (abbr.)",
    "level": 5,
    "phrase": "青",
    "sentence": "这是“青”字。"
  },
  {
    "char": "娶",
    "pinyin": "qǔ",
    "meaning": "marry (a wife); take a wife",
    "level": 5,
    "phrase": "娶",
    "sentence": "这是“娶”字。"
  },
  {
    "char": "圈",
    "pinyin": "quān",
    "meaning": "circle; ring; (mw for loops, orbits, etc.)",
    "level": 5,
    "phrase": "圈",
    "sentence": "这是“圈”字。"
  },
  {
    "char": "劝",
    "pinyin": "quàn",
    "meaning": "advise; to urge; persuade",
    "level": 5,
    "phrase": "劝",
    "sentence": "这是“劝”字。"
  },
  {
    "char": "群",
    "pinyin": "qún",
    "meaning": "crowd; group; (mw for groups, flocks, or swarms)",
    "level": 5,
    "phrase": "群",
    "sentence": "这是“群”字。"
  },
  {
    "char": "绕",
    "pinyin": "rào",
    "meaning": "to wind; to coil; move round",
    "level": 5,
    "phrase": "绕",
    "sentence": "这是“绕”字。"
  },
  {
    "char": "软",
    "pinyin": "ruǎn",
    "meaning": "soft",
    "level": 5,
    "phrase": "软",
    "sentence": "这是“软”字。"
  },
  {
    "char": "弱",
    "pinyin": "ruò",
    "meaning": "weak; feeble; young",
    "level": 5,
    "phrase": "弱",
    "sentence": "这是“弱”字。"
  },
  {
    "char": "洒",
    "pinyin": "sǎ",
    "meaning": "to sprinkle; to spray; to spill",
    "level": 5,
    "phrase": "洒",
    "sentence": "这是“洒”字。"
  },
  {
    "char": "杀",
    "pinyin": "shā",
    "meaning": "to kill; to murder",
    "level": 5,
    "phrase": "杀",
    "sentence": "这是“杀”字。"
  },
  {
    "char": "傻",
    "pinyin": "shǎ",
    "meaning": "foolish; fool",
    "level": 5,
    "phrase": "傻",
    "sentence": "这是“傻”字。"
  },
  {
    "char": "晒",
    "pinyin": "shài",
    "meaning": "to dry in the sun; shine upon; to sun; bask",
    "level": 5,
    "phrase": "晒",
    "sentence": "这是“晒”字。"
  },
  {
    "char": "蛇",
    "pinyin": "shé",
    "meaning": "snake; serpent",
    "level": 5,
    "phrase": "蛇",
    "sentence": "这是“蛇”字。"
  },
  {
    "char": "伸",
    "pinyin": "shēn",
    "meaning": "to stretch; extend",
    "level": 5,
    "phrase": "伸",
    "sentence": "这是“伸”字。"
  },
  {
    "char": "升",
    "pinyin": "shēng",
    "meaning": "rise; hoist; promote; liter",
    "level": 5,
    "phrase": "升",
    "sentence": "这是“升”字。"
  },
  {
    "char": "诗",
    "pinyin": "shī",
    "meaning": "poem; poetry; verse",
    "level": 5,
    "phrase": "诗",
    "sentence": "这是“诗”字。"
  },
  {
    "char": "首",
    "pinyin": "shǒu",
    "meaning": "head; chief; first; (mw for poems and songs) (Kangxi radical 185)",
    "level": 5,
    "phrase": "首",
    "sentence": "这是“首”字。"
  },
  {
    "char": "数",
    "pinyin": "shù, shǔ",
    "meaning": "number | to count; to rank",
    "level": 5,
    "phrase": "数",
    "sentence": "这是“数”字。"
  },
  {
    "char": "甩",
    "pinyin": "shuǎi",
    "meaning": "to throw; to fling; to swing; cast off",
    "level": 5,
    "phrase": "甩",
    "sentence": "这是“甩”字。"
  },
  {
    "char": "税",
    "pinyin": "shuì",
    "meaning": "tax",
    "level": 5,
    "phrase": "税",
    "sentence": "这是“税”字。"
  },
  {
    "char": "撕",
    "pinyin": "sī",
    "meaning": "to tear (something)",
    "level": 5,
    "phrase": "撕",
    "sentence": "这是“撕”字。"
  },
  {
    "char": "碎",
    "pinyin": "suì",
    "meaning": "broken; break into pieces",
    "level": 5,
    "phrase": "碎",
    "sentence": "这是“碎”字。"
  },
  {
    "char": "所",
    "pinyin": "suǒ",
    "meaning": "place; that which; (mw for houses, buildings)",
    "level": 5,
    "phrase": "所",
    "sentence": "这是“所”字。"
  },
  {
    "char": "锁",
    "pinyin": "suǒ",
    "meaning": "lock",
    "level": 5,
    "phrase": "锁",
    "sentence": "这是“锁”字。"
  },
  {
    "char": "烫",
    "pinyin": "tàng",
    "meaning": "to scald; to burn; scalding hot; to iron",
    "level": 5,
    "phrase": "烫",
    "sentence": "这是“烫”字。"
  },
  {
    "char": "逃",
    "pinyin": "táo",
    "meaning": "to escape; run away; flee",
    "level": 5,
    "phrase": "逃",
    "sentence": "这是“逃”字。"
  },
  {
    "char": "桃",
    "pinyin": "táo",
    "meaning": "peach",
    "level": 5,
    "phrase": "桃",
    "sentence": "这是“桃”字。"
  },
  {
    "char": "套",
    "pinyin": "tào",
    "meaning": "cover; (mw for sets of things); tie together",
    "level": 5,
    "phrase": "套",
    "sentence": "这是“套”字。"
  },
  {
    "char": "偷",
    "pinyin": "tōu",
    "meaning": "steal; pilfer",
    "level": 5,
    "phrase": "偷",
    "sentence": "这是“偷”字。"
  },
  {
    "char": "吐",
    "pinyin": "tǔ, tù",
    "meaning": "to spit | to vomit; throw up",
    "level": 5,
    "phrase": "吐",
    "sentence": "这是“吐”字。"
  },
  {
    "char": "团",
    "pinyin": "tuán",
    "meaning": "round; ball; group; unite; dumpling; (mw for ball-like things)",
    "level": 5,
    "phrase": "团",
    "sentence": "这是“团”字。"
  },
  {
    "char": "退",
    "pinyin": "tuì",
    "meaning": "to retreat; decline; withdraw",
    "level": 5,
    "phrase": "退",
    "sentence": "这是“退”字。"
  },
  {
    "char": "歪",
    "pinyin": "wāi",
    "meaning": "askew; crooked; devious; recline to take a rest (colloquial)",
    "level": 5,
    "phrase": "歪",
    "sentence": "这是“歪”字。"
  },
  {
    "char": "胃",
    "pinyin": "wèi",
    "meaning": "stomach",
    "level": 5,
    "phrase": "胃",
    "sentence": "这是“胃”字。"
  },
  {
    "char": "闻",
    "pinyin": "wén",
    "meaning": "hear; to smell; news; reputation",
    "level": 5,
    "phrase": "闻",
    "sentence": "这是“闻”字。"
  },
  {
    "char": "吻",
    "pinyin": "wěn",
    "meaning": "kiss; lips",
    "level": 5,
    "phrase": "吻",
    "sentence": "这是“吻”字。"
  },
  {
    "char": "勿",
    "pinyin": "wù",
    "meaning": "not; do not",
    "level": 5,
    "phrase": "勿",
    "sentence": "这是“勿”字。"
  },
  {
    "char": "雾",
    "pinyin": "wù",
    "meaning": "fog; mist",
    "level": 5,
    "phrase": "雾",
    "sentence": "这是“雾”字。"
  },
  {
    "char": "系",
    "pinyin": "xì, jì",
    "meaning": "be; relate to; system; fasten; department; faculty; connect | to tie",
    "level": 5,
    "phrase": "系",
    "sentence": "这是“系”字。"
  },
  {
    "char": "瞎",
    "pinyin": "xiā",
    "meaning": "blind",
    "level": 5,
    "phrase": "瞎",
    "sentence": "这是“瞎”字。"
  },
  {
    "char": "吓",
    "pinyin": "xià",
    "meaning": "frighten; to scare; intimidate",
    "level": 5,
    "phrase": "吓",
    "sentence": "这是“吓”字。"
  },
  {
    "char": "县",
    "pinyin": "xiàn",
    "meaning": "county; district",
    "level": 5,
    "phrase": "县",
    "sentence": "这是“县”字。"
  },
  {
    "char": "项",
    "pinyin": "xiàng",
    "meaning": "nape (of the neck); sum (of money); mw item",
    "level": 5,
    "phrase": "项",
    "sentence": "这是“项”字。"
  },
  {
    "char": "歇",
    "pinyin": "xiē",
    "meaning": "to rest; to go to bed; to take a break",
    "level": 5,
    "phrase": "歇",
    "sentence": "这是“歇”字。"
  },
  {
    "char": "斜",
    "pinyin": "xié",
    "meaning": "slanting; tilted",
    "level": 5,
    "phrase": "斜",
    "sentence": "这是“斜”字。"
  },
  {
    "char": "胸",
    "pinyin": "xiōng",
    "meaning": "chest; bosom; heart",
    "level": 5,
    "phrase": "胸",
    "sentence": "这是“胸”字。"
  },
  {
    "char": "血",
    "pinyin": "xuè",
    "meaning": "blood (Kangxi radical 143)",
    "level": 5,
    "phrase": "血",
    "sentence": "这是“血”字。"
  },
  {
    "char": "痒",
    "pinyin": "yǎng",
    "meaning": "to itch; itchy",
    "level": 5,
    "phrase": "痒",
    "sentence": "这是“痒”字。"
  },
  {
    "char": "腰",
    "pinyin": "yāo",
    "meaning": "waist; lower back; pocket",
    "level": 5,
    "phrase": "腰",
    "sentence": "这是“腰”字。"
  },
  {
    "char": "摇",
    "pinyin": "yáo",
    "meaning": "to shake; to rock",
    "level": 5,
    "phrase": "摇",
    "sentence": "这是“摇”字。"
  },
  {
    "char": "咬",
    "pinyin": "yǎo",
    "meaning": "to bite; to nip",
    "level": 5,
    "phrase": "咬",
    "sentence": "这是“咬”字。"
  },
  {
    "char": "夜",
    "pinyin": "yè",
    "meaning": "night; darkness",
    "level": 5,
    "phrase": "夜",
    "sentence": "这是“夜”字。"
  },
  {
    "char": "乙",
    "pinyin": "yǐ",
    "meaning": "two; twist (2nd Heavenly Stem) (Kangxi radical 5)",
    "level": 5,
    "phrase": "乙",
    "sentence": "这是“乙”字。"
  },
  {
    "char": "亿",
    "pinyin": "yì",
    "meaning": "one hundred million (100,000,000)",
    "level": 5,
    "phrase": "亿",
    "sentence": "这是“亿”字。"
  },
  {
    "char": "银",
    "pinyin": "yín",
    "meaning": "silver (the element)",
    "level": 5,
    "phrase": "银",
    "sentence": "这是“银”字。"
  },
  {
    "char": "硬",
    "pinyin": "yìng",
    "meaning": "hard; stiff; obstinately",
    "level": 5,
    "phrase": "硬",
    "sentence": "这是“硬”字。"
  },
  {
    "char": "圆",
    "pinyin": "yuán",
    "meaning": "round; circular; formal unit of Chinese currency",
    "level": 5,
    "phrase": "圆",
    "sentence": "这是“圆”字。"
  },
  {
    "char": "晕",
    "pinyin": "yūn",
    "meaning": "dizzy; to fain",
    "level": 5,
    "phrase": "晕",
    "sentence": "这是“晕”字。"
  },
  {
    "char": "则",
    "pinyin": "zé",
    "meaning": "standard; regulation; however; in that case",
    "level": 5,
    "phrase": "则",
    "sentence": "这是“则”字。"
  },
  {
    "char": "摘",
    "pinyin": "zhāi",
    "meaning": "to pick (flowers, fruit, etc.); to pluck; to take; to borrow",
    "level": 5,
    "phrase": "摘",
    "sentence": "这是“摘”字。"
  },
  {
    "char": "窄",
    "pinyin": "zhǎi",
    "meaning": "narrow; petty; hard-up",
    "level": 5,
    "phrase": "窄",
    "sentence": "这是“窄”字。"
  },
  {
    "char": "占",
    "pinyin": "zhàn",
    "meaning": "occupy; seize; to constitute",
    "level": 5,
    "phrase": "占",
    "sentence": "这是“占”字。"
  },
  {
    "char": "涨",
    "pinyin": "zhǎng, zhàng",
    "meaning": "to rise (of prices, rivers); to go up | to swell; to bloat",
    "level": 5,
    "phrase": "涨",
    "sentence": "这是“涨”字。"
  },
  {
    "char": "阵",
    "pinyin": "zhèn",
    "meaning": "short period; disposition of troops; wave",
    "level": 5,
    "phrase": "阵",
    "sentence": "这是“阵”字。"
  },
  {
    "char": "挣",
    "pinyin": "zhèng, zhēng",
    "meaning": "to earn | to struggle",
    "level": 5,
    "phrase": "挣",
    "sentence": "这是“挣”字。"
  },
  {
    "char": "睁",
    "pinyin": "zhēng",
    "meaning": "to open (eyes)",
    "level": 5,
    "phrase": "睁",
    "sentence": "这是“睁”字。"
  },
  {
    "char": "正",
    "pinyin": "zhèng",
    "meaning": "straight; currently; correct; just (right); pure; precisely",
    "level": 5,
    "phrase": "正",
    "sentence": "这是“正”字。"
  },
  {
    "char": "支",
    "pinyin": "zhī",
    "meaning": "branch; support; put up; (mw for long; narrow objects) (Kangxi radical 65)",
    "level": 5,
    "phrase": "支",
    "sentence": "这是“支”字。"
  },
  {
    "char": "直",
    "pinyin": "zhí",
    "meaning": "straight; vertical; frank; directly; continuously",
    "level": 5,
    "phrase": "直",
    "sentence": "这是“直”字。"
  },
  {
    "char": "猪",
    "pinyin": "zhū",
    "meaning": "pig",
    "level": 5,
    "phrase": "猪",
    "sentence": "这是“猪”字。"
  },
  {
    "char": "煮",
    "pinyin": "zhǔ",
    "meaning": "to boil; to cook",
    "level": 5,
    "phrase": "煮",
    "sentence": "这是“煮”字。"
  },
  {
    "char": "抓",
    "pinyin": "zhuā",
    "meaning": "to carry in your hand holding strongly; catch; arrest",
    "level": 5,
    "phrase": "抓",
    "sentence": "这是“抓”字。"
  },
  {
    "char": "装",
    "pinyin": "zhuāng",
    "meaning": "to load; dress up; pretend; clothing; to install",
    "level": 5,
    "phrase": "装",
    "sentence": "这是“装”字。"
  },
  {
    "char": "撞",
    "pinyin": "zhuàng",
    "meaning": "to hit; collide; run into",
    "level": 5,
    "phrase": "撞",
    "sentence": "这是“撞”字。"
  },
  {
    "char": "追",
    "pinyin": "zhuī",
    "meaning": "pursue; chase",
    "level": 5,
    "phrase": "追",
    "sentence": "这是“追”字。"
  },
  {
    "char": "紫",
    "pinyin": "zǐ",
    "meaning": "purple",
    "level": 5,
    "phrase": "紫",
    "sentence": "这是“紫”字。"
  },
  {
    "char": "组",
    "pinyin": "zǔ",
    "meaning": "compose; team up; group",
    "level": 5,
    "phrase": "组",
    "sentence": "这是“组”字。"
  },
  {
    "char": "醉",
    "pinyin": "zuì",
    "meaning": "intoxicated; become drunk",
    "level": 5,
    "phrase": "醉",
    "sentence": "这是“醉”字。"
  },
  {
    "char": "挨",
    "pinyin": "āi",
    "meaning": "get close to; in sequence",
    "level": 6,
    "phrase": "挨",
    "sentence": "这是“挨”字。"
  },
  {
    "char": "熬",
    "pinyin": "áo",
    "meaning": "endure; to boil",
    "level": 6,
    "phrase": "熬",
    "sentence": "这是“熬”字。"
  },
  {
    "char": "扒",
    "pinyin": "bā",
    "meaning": "dig up; pull down; take off",
    "level": 6,
    "phrase": "扒",
    "sentence": "这是“扒”字。"
  },
  {
    "char": "疤",
    "pinyin": "bā",
    "meaning": "scar",
    "level": 6,
    "phrase": "疤",
    "sentence": "这是“疤”字。"
  },
  {
    "char": "掰",
    "pinyin": "bāi",
    "meaning": "break with both hands",
    "level": 6,
    "phrase": "掰",
    "sentence": "这是“掰”字。"
  },
  {
    "char": "斑",
    "pinyin": "bān",
    "meaning": "variety; speckled; spot; colored patch; stripe",
    "level": 6,
    "phrase": "斑",
    "sentence": "这是“斑”字。"
  },
  {
    "char": "磅",
    "pinyin": "bàng",
    "meaning": "pound; weigh; scale",
    "level": 6,
    "phrase": "磅",
    "sentence": "这是“磅”字。"
  },
  {
    "char": "甭",
    "pinyin": "béng",
    "meaning": "need not; (contraction of 不 and 用)",
    "level": 6,
    "phrase": "甭",
    "sentence": "这是“甭”字。"
  },
  {
    "char": "蹦",
    "pinyin": "bèng",
    "meaning": "jump; bounce; hop",
    "level": 6,
    "phrase": "蹦",
    "sentence": "这是“蹦”字。"
  },
  {
    "char": "臂",
    "pinyin": "bì",
    "meaning": "arm",
    "level": 6,
    "phrase": "臂",
    "sentence": "这是“臂”字。"
  },
  {
    "char": "扁",
    "pinyin": "biǎn",
    "meaning": "flat",
    "level": 6,
    "phrase": "扁",
    "sentence": "这是“扁”字。"
  },
  {
    "char": "憋",
    "pinyin": "biē",
    "meaning": "hold in (urine); hold (breath); choke",
    "level": 6,
    "phrase": "憋",
    "sentence": "这是“憋”字。"
  },
  {
    "char": "丙",
    "pinyin": "bǐng",
    "meaning": "bright; fire (3rd Heavenly Stem)",
    "level": 6,
    "phrase": "丙",
    "sentence": "这是“丙”字。"
  },
  {
    "char": "拨",
    "pinyin": "bō",
    "meaning": "to dial; move with a hand/foot; stir; poke; allocate (money)",
    "level": 6,
    "phrase": "拨",
    "sentence": "这是“拨”字。"
  },
  {
    "char": "舱",
    "pinyin": "cāng",
    "meaning": "cabin; hold (of a ship or airplane)",
    "level": 6,
    "phrase": "舱",
    "sentence": "这是“舱”字。"
  },
  {
    "char": "岔",
    "pinyin": "chà",
    "meaning": "fork in the road; turn off; diverge",
    "level": 6,
    "phrase": "岔",
    "sentence": "这是“岔”字。"
  },
  {
    "char": "搀",
    "pinyin": "chān",
    "meaning": "assist by the arm; mix; support; sustain",
    "level": 6,
    "phrase": "搀",
    "sentence": "这是“搀”字。"
  },
  {
    "char": "馋",
    "pinyin": "chán",
    "meaning": "gluttonous; greedy",
    "level": 6,
    "phrase": "馋",
    "sentence": "这是“馋”字。"
  },
  {
    "char": "乘",
    "pinyin": "chéng",
    "meaning": "to ride; to mount; make use of; multiply",
    "level": 6,
    "phrase": "乘",
    "sentence": "这是“乘”字。"
  },
  {
    "char": "橙",
    "pinyin": "chéng",
    "meaning": "orange (color); orange (fruit, tree)",
    "level": 6,
    "phrase": "橙",
    "sentence": "这是“橙”字。"
  },
  {
    "char": "秤",
    "pinyin": "chèng",
    "meaning": "balance; scale; steelyard",
    "level": 6,
    "phrase": "秤",
    "sentence": "这是“秤”字。"
  },
  {
    "char": "除",
    "pinyin": "chú",
    "meaning": "besides; except; remove; to divide (mathematics)",
    "level": 6,
    "phrase": "除",
    "sentence": "这是“除”字。"
  },
  {
    "char": "串",
    "pinyin": "chuàn",
    "meaning": "string together; conspire; gang up; mix up; bunch",
    "level": 6,
    "phrase": "串",
    "sentence": "这是“串”字。"
  },
  {
    "char": "幢",
    "pinyin": "zhuàng",
    "meaning": "(mw for houses, buildings); tent",
    "level": 6,
    "phrase": "幢",
    "sentence": "这是“幢”字。"
  },
  {
    "char": "锤",
    "pinyin": "chuí",
    "meaning": "hammer; weight",
    "level": 6,
    "phrase": "锤",
    "sentence": "这是“锤”字。"
  },
  {
    "char": "刺",
    "pinyin": "cì",
    "meaning": "thorn; to sting; to prick; pierce; stab",
    "level": 6,
    "phrase": "刺",
    "sentence": "这是“刺”字。"
  },
  {
    "char": "丛",
    "pinyin": "cóng",
    "meaning": "crowd together; thicket; collection",
    "level": 6,
    "phrase": "丛",
    "sentence": "这是“丛”字。"
  },
  {
    "char": "窜",
    "pinyin": "cuàn",
    "meaning": "to flee; to escape; run away",
    "level": 6,
    "phrase": "窜",
    "sentence": "这是“窜”字。"
  },
  {
    "char": "搓",
    "pinyin": "cuō",
    "meaning": "rub or roll between the hands or fingers; to twist",
    "level": 6,
    "phrase": "搓",
    "sentence": "这是“搓”字。"
  },
  {
    "char": "搭",
    "pinyin": "dā",
    "meaning": "to erect; to build; travel by (car, plane, etc.); to hang; to join",
    "level": 6,
    "phrase": "搭",
    "sentence": "这是“搭”字。"
  },
  {
    "char": "党",
    "pinyin": "dǎng",
    "meaning": "party; club; association",
    "level": 6,
    "phrase": "党",
    "sentence": "这是“党”字。"
  },
  {
    "char": "蹬",
    "pinyin": "dēng",
    "meaning": "press down with the foot; step back or into something",
    "level": 6,
    "phrase": "蹬",
    "sentence": "这是“蹬”字。"
  },
  {
    "char": "瞪",
    "pinyin": "dèng",
    "meaning": "stare at; to glower",
    "level": 6,
    "phrase": "瞪",
    "sentence": "这是“瞪”字。"
  },
  {
    "char": "垫",
    "pinyin": "diàn",
    "meaning": "cushion; to pad; pay for somebody and expect to be repaid",
    "level": 6,
    "phrase": "垫",
    "sentence": "这是“垫”字。"
  },
  {
    "char": "叼",
    "pinyin": "diāo",
    "meaning": "hold sth. in the mouth",
    "level": 6,
    "phrase": "叼",
    "sentence": "这是“叼”字。"
  },
  {
    "char": "吊",
    "pinyin": "diào",
    "meaning": "hang; suspend",
    "level": 6,
    "phrase": "吊",
    "sentence": "这是“吊”字。"
  },
  {
    "char": "跌",
    "pinyin": "diē",
    "meaning": "to fall down; to drop",
    "level": 6,
    "phrase": "跌",
    "sentence": "这是“跌”字。"
  },
  {
    "char": "丁",
    "pinyin": "dīng",
    "meaning": "male adult; robust; cubes (of food); T-shaped (4th Heavenly Stem)",
    "level": 6,
    "phrase": "丁",
    "sentence": "这是“丁”字。"
  },
  {
    "char": "盯",
    "pinyin": "dīng",
    "meaning": "to stare; to gaze",
    "level": 6,
    "phrase": "盯",
    "sentence": "这是“盯”字。"
  },
  {
    "char": "栋",
    "pinyin": "dòng",
    "meaning": "roof beam; (mw for buildings)",
    "level": 6,
    "phrase": "栋",
    "sentence": "这是“栋”字。"
  },
  {
    "char": "兜",
    "pinyin": "dōu",
    "meaning": "pocket; bag; wrap up (in a piece of cloth); move around (in a circle); canvass (solicit); take responsibility",
    "level": 6,
    "phrase": "兜",
    "sentence": "这是“兜”字。"
  },
  {
    "char": "端",
    "pinyin": "duān",
    "meaning": "end; beginning; extremity; carry holding something from the sides",
    "level": 6,
    "phrase": "端",
    "sentence": "这是“端”字。"
  },
  {
    "char": "番",
    "pinyin": "fān",
    "meaning": "(mw for acts or deeds); foreign",
    "level": 6,
    "phrase": "番",
    "sentence": "这是“番”字。"
  },
  {
    "char": "肺",
    "pinyin": "fèi",
    "meaning": "lung",
    "level": 6,
    "phrase": "肺",
    "sentence": "这是“肺”字。"
  },
  {
    "char": "逢",
    "pinyin": "féng",
    "meaning": "to meet; come upon",
    "level": 6,
    "phrase": "逢",
    "sentence": "这是“逢”字。"
  },
  {
    "char": "副",
    "pinyin": "fù",
    "meaning": "vice-; secondary; auxiliary; deputy; assistant; classifier for pairs (i.e. glasses)",
    "level": 6,
    "phrase": "副",
    "sentence": "这是“副”字。"
  },
  {
    "char": "钙",
    "pinyin": "gài",
    "meaning": "calcium",
    "level": 6,
    "phrase": "钙",
    "sentence": "这是“钙”字。"
  },
  {
    "char": "割",
    "pinyin": "gē",
    "meaning": "to cut (apart/off)",
    "level": 6,
    "phrase": "割",
    "sentence": "这是“割”字。"
  },
  {
    "char": "搁",
    "pinyin": "gē",
    "meaning": "to place; put aside",
    "level": 6,
    "phrase": "搁",
    "sentence": "这是“搁”字。"
  },
  {
    "char": "罐",
    "pinyin": "guàn",
    "meaning": "can; jar; pot; pitcher; jug",
    "level": 6,
    "phrase": "罐",
    "sentence": "这是“罐”字。"
  },
  {
    "char": "跪",
    "pinyin": "guì",
    "meaning": "kneel",
    "level": 6,
    "phrase": "跪",
    "sentence": "这是“跪”字。"
  },
  {
    "char": "嗨",
    "pinyin": "hāi",
    "meaning": "hey/hi (loanword); oh; alas;",
    "level": 6,
    "phrase": "嗨",
    "sentence": "这是“嗨”字。"
  },
  {
    "char": "呵",
    "pinyin": "hē",
    "meaning": "breathe out; scold",
    "level": 6,
    "phrase": "呵",
    "sentence": "这是“呵”字。"
  },
  {
    "char": "嘿",
    "pinyin": "hēi",
    "meaning": "hey; interjection for calling attention",
    "level": 6,
    "phrase": "嘿",
    "sentence": "这是“嘿”字。"
  },
  {
    "char": "哼",
    "pinyin": "hēng",
    "meaning": "groan; snort; to hum; croon",
    "level": 6,
    "phrase": "哼",
    "sentence": "这是“哼”字。"
  },
  {
    "char": "横",
    "pinyin": "héng",
    "meaning": "horizontal; across; (horizontal character stroke)",
    "level": 6,
    "phrase": "横",
    "sentence": "这是“横”字。"
  },
  {
    "char": "哄",
    "pinyin": "hǒng",
    "meaning": "fool; coax; to amuse (a child)",
    "level": 6,
    "phrase": "哄",
    "sentence": "这是“哄”字。"
  },
  {
    "char": "烘",
    "pinyin": "hōng",
    "meaning": "to dry or warm by the fire; to bake; to heat by fire; to set off by contrast",
    "level": 6,
    "phrase": "烘",
    "sentence": "这是“烘”字。"
  },
  {
    "char": "吼",
    "pinyin": "hǒu",
    "meaning": "roar; howl",
    "level": 6,
    "phrase": "吼",
    "sentence": "这是“吼”字。"
  },
  {
    "char": "晃",
    "pinyin": "huàng",
    "meaning": "to sway; to shake",
    "level": 6,
    "phrase": "晃",
    "sentence": "这是“晃”字。"
  },
  {
    "char": "荤",
    "pinyin": "hūn",
    "meaning": "meat or fish dish; pungent vegetables forbidden to Buddhist vegetarians",
    "level": 6,
    "phrase": "荤",
    "sentence": "这是“荤”字。"
  },
  {
    "char": "煎",
    "pinyin": "jiān",
    "meaning": "pan-fry; fry in shallow oil",
    "level": 6,
    "phrase": "煎",
    "sentence": "这是“煎”字。"
  },
  {
    "char": "拣",
    "pinyin": "jiǎn",
    "meaning": "choose; select; sort out",
    "level": 6,
    "phrase": "拣",
    "sentence": "这是“拣”字。"
  },
  {
    "char": "剑",
    "pinyin": "jiàn",
    "meaning": "sword",
    "level": 6,
    "phrase": "剑",
    "sentence": "这是“剑”字。"
  },
  {
    "char": "溅",
    "pinyin": "jiàn",
    "meaning": "to splash",
    "level": 6,
    "phrase": "溅",
    "sentence": "这是“溅”字。"
  },
  {
    "char": "桨",
    "pinyin": "jiǎng",
    "meaning": "oar; paddle",
    "level": 6,
    "phrase": "桨",
    "sentence": "这是“桨”字。"
  },
  {
    "char": "皆",
    "pinyin": "jiē",
    "meaning": "all; each and every; in all cases",
    "level": 6,
    "phrase": "皆",
    "sentence": "这是“皆”字。"
  },
  {
    "char": "茎",
    "pinyin": "jīng",
    "meaning": "stalk; stem",
    "level": 6,
    "phrase": "茎",
    "sentence": "这是“茎”字。"
  },
  {
    "char": "井",
    "pinyin": "jǐng",
    "meaning": "a well",
    "level": 6,
    "phrase": "井",
    "sentence": "这是“井”字。"
  },
  {
    "char": "卷",
    "pinyin": "juǎn",
    "meaning": "to roll (up); to coil; (mw for tapes)",
    "level": 6,
    "phrase": "卷",
    "sentence": "这是“卷”字。"
  },
  {
    "char": "扛",
    "pinyin": "káng",
    "meaning": "to carry on one's shoulder",
    "level": 6,
    "phrase": "扛",
    "sentence": "这是“扛”字。"
  },
  {
    "char": "磕",
    "pinyin": "kē",
    "meaning": "knock; tap",
    "level": 6,
    "phrase": "磕",
    "sentence": "这是“磕”字。"
  },
  {
    "char": "啃",
    "pinyin": "kěn",
    "meaning": "gnaw; nibble; bite",
    "level": 6,
    "phrase": "啃",
    "sentence": "这是“啃”字。"
  },
  {
    "char": "坑",
    "pinyin": "kēng",
    "meaning": "pit; hole; defraud",
    "level": 6,
    "phrase": "坑",
    "sentence": "这是“坑”字。"
  },
  {
    "char": "孔",
    "pinyin": "kǒng",
    "meaning": "hole",
    "level": 6,
    "phrase": "孔",
    "sentence": "这是“孔”字。"
  },
  {
    "char": "扣",
    "pinyin": "kòu",
    "meaning": "to fasten; to button; button; buckle; knot; to arrest; to confiscate; to deduct (money); discount; to knock; put upside down; to smash or spike (a ball); to cover (with a bowl etc); fig. to tag a label on sb",
    "level": 6,
    "phrase": "扣",
    "sentence": "这是“扣”字。"
  },
  {
    "char": "挎",
    "pinyin": "kuà",
    "meaning": "carry over one's shoulder or slung on one's side",
    "level": 6,
    "phrase": "挎",
    "sentence": "这是“挎”字。"
  },
  {
    "char": "跨",
    "pinyin": "kuà",
    "meaning": "step across; stride; straddle; to cross",
    "level": 6,
    "phrase": "跨",
    "sentence": "这是“跨”字。"
  },
  {
    "char": "筐",
    "pinyin": "kuāng",
    "meaning": "basket",
    "level": 6,
    "phrase": "筐",
    "sentence": "这是“筐”字。"
  },
  {
    "char": "啦",
    "pinyin": "la",
    "meaning": "sentence-final particle: a contraction of 了 (le) and 啊 (a)",
    "level": 6,
    "phrase": "啦",
    "sentence": "这是“啦”字。"
  },
  {
    "char": "捞",
    "pinyin": "lāo",
    "meaning": "dredge up; fish up",
    "level": 6,
    "phrase": "捞",
    "sentence": "这是“捞”字。"
  },
  {
    "char": "愣",
    "pinyin": "lèng",
    "meaning": "dumbfounded; stupefied; distracted; (spoken) blunt; rash",
    "level": 6,
    "phrase": "愣",
    "sentence": "这是“愣”字。"
  },
  {
    "char": "粒",
    "pinyin": "lì",
    "meaning": "a grain; granule; (mw for grain-like things)",
    "level": 6,
    "phrase": "粒",
    "sentence": "这是“粒”字。"
  },
  {
    "char": "晾",
    "pinyin": "liàng",
    "meaning": "dry in the air/sun; (colloquial) snub or ignore",
    "level": 6,
    "phrase": "晾",
    "sentence": "这是“晾”字。"
  },
  {
    "char": "淋",
    "pinyin": "lín",
    "meaning": "to drain; to drip; drench",
    "level": 6,
    "phrase": "淋",
    "sentence": "这是“淋”字。"
  },
  {
    "char": "溜",
    "pinyin": "liū",
    "meaning": "slip away; to skate; to glide",
    "level": 6,
    "phrase": "溜",
    "sentence": "这是“溜”字。"
  },
  {
    "char": "搂",
    "pinyin": "lǒu",
    "meaning": "to hug; to embrace",
    "level": 6,
    "phrase": "搂",
    "sentence": "这是“搂”字。"
  },
  {
    "char": "嘛",
    "pinyin": "ma, má",
    "meaning": "(used to persuade somebody to do something); (particle indicating obviousness) | (colloqial) what?",
    "level": 6,
    "phrase": "嘛",
    "sentence": "这是“嘛”字。"
  },
  {
    "char": "迈",
    "pinyin": "mài",
    "meaning": "to step; stride",
    "level": 6,
    "phrase": "迈",
    "sentence": "这是“迈”字。"
  },
  {
    "char": "枚",
    "pinyin": "méi",
    "meaning": "(mw for coins, rings, medals)",
    "level": 6,
    "phrase": "枚",
    "sentence": "这是“枚”字。"
  },
  {
    "char": "眯",
    "pinyin": "mī",
    "meaning": "to squint; to take a nap",
    "level": 6,
    "phrase": "眯",
    "sentence": "这是“眯”字。"
  },
  {
    "char": "膜",
    "pinyin": "mó",
    "meaning": "membrane; film",
    "level": 6,
    "phrase": "膜",
    "sentence": "这是“膜”字。"
  },
  {
    "char": "捏",
    "pinyin": "niē",
    "meaning": "to pinch (with one's fingers); knead",
    "level": 6,
    "phrase": "捏",
    "sentence": "这是“捏”字。"
  },
  {
    "char": "拧",
    "pinyin": "níng",
    "meaning": "wring; to pinch",
    "level": 6,
    "phrase": "拧",
    "sentence": "这是“拧”字。"
  },
  {
    "char": "挪",
    "pinyin": "nuó",
    "meaning": "shift; move",
    "level": 6,
    "phrase": "挪",
    "sentence": "这是“挪”字。"
  },
  {
    "char": "哦",
    "pinyin": "ò",
    "meaning": "oh (indicates understanding)",
    "level": 6,
    "phrase": "哦",
    "sentence": "这是“哦”字。"
  },
  {
    "char": "趴",
    "pinyin": "pā",
    "meaning": "lie on one's stomach",
    "level": 6,
    "phrase": "趴",
    "sentence": "这是“趴”字。"
  },
  {
    "char": "畔",
    "pinyin": "pàn",
    "meaning": "riverbank; side; boundary",
    "level": 6,
    "phrase": "畔",
    "sentence": "这是“畔”字。"
  },
  {
    "char": "捧",
    "pinyin": "pěng",
    "meaning": "hold or carry with both hands facing up",
    "level": 6,
    "phrase": "捧",
    "sentence": "这是“捧”字。"
  },
  {
    "char": "劈",
    "pinyin": "pī",
    "meaning": "split in two; to divide",
    "level": 6,
    "phrase": "劈",
    "sentence": "这是“劈”字。"
  },
  {
    "char": "撇",
    "pinyin": "piě",
    "meaning": "left-curving stroke (丿); throw; fling",
    "level": 6,
    "phrase": "撇",
    "sentence": "这是“撇”字。"
  },
  {
    "char": "坡",
    "pinyin": "pō",
    "meaning": "slope",
    "level": 6,
    "phrase": "坡",
    "sentence": "这是“坡”字。"
  },
  {
    "char": "泼",
    "pinyin": "pō",
    "meaning": "to splash; to spill; rude and unreasonable; brutish",
    "level": 6,
    "phrase": "泼",
    "sentence": "这是“泼”字。"
  },
  {
    "char": "颇",
    "pinyin": "pō",
    "meaning": "rather; quite; inclined to one side",
    "level": 6,
    "phrase": "颇",
    "sentence": "这是“颇”字。"
  },
  {
    "char": "扑",
    "pinyin": "pū",
    "meaning": "to assault; rush at; throw oneself on",
    "level": 6,
    "phrase": "扑",
    "sentence": "这是“扑”字。"
  },
  {
    "char": "铺",
    "pinyin": "pù, pū",
    "meaning": "bed; store | to spread; to lay",
    "level": 6,
    "phrase": "铺",
    "sentence": "这是“铺”字。"
  },
  {
    "char": "掐",
    "pinyin": "qiā",
    "meaning": "pick (flowers); pinch; clutch",
    "level": 6,
    "phrase": "掐",
    "sentence": "这是“掐”字。"
  },
  {
    "char": "牵",
    "pinyin": "qiān",
    "meaning": "to lead along; to pull (an animal on a tether)",
    "level": 6,
    "phrase": "牵",
    "sentence": "这是“牵”字。"
  },
  {
    "char": "翘",
    "pinyin": "qiào",
    "meaning": "stick up; bend upwards",
    "level": 6,
    "phrase": "翘",
    "sentence": "这是“翘”字。"
  },
  {
    "char": "犬",
    "pinyin": "quǎn",
    "meaning": "dog (Kangxi radical 94)",
    "level": 6,
    "phrase": "犬",
    "sentence": "这是“犬”字。"
  },
  {
    "char": "瘸",
    "pinyin": "qué",
    "meaning": "lame",
    "level": 6,
    "phrase": "瘸",
    "sentence": "这是“瘸”字。"
  },
  {
    "char": "染",
    "pinyin": "rǎn",
    "meaning": "dye; to catch (a disease)",
    "level": 6,
    "phrase": "染",
    "sentence": "这是“染”字。"
  },
  {
    "char": "嚷",
    "pinyin": "rǎng",
    "meaning": "blurt out; shout",
    "level": 6,
    "phrase": "嚷",
    "sentence": "这是“嚷”字。"
  },
  {
    "char": "揉",
    "pinyin": "róu",
    "meaning": "knead; to massage; to rub",
    "level": 6,
    "phrase": "揉",
    "sentence": "这是“揉”字。"
  },
  {
    "char": "啥",
    "pinyin": "shá",
    "meaning": "(spoken) what",
    "level": 6,
    "phrase": "啥",
    "sentence": "这是“啥”字。"
  },
  {
    "char": "捎",
    "pinyin": "shāo",
    "meaning": "bring or take (along); deliver (a message)",
    "level": 6,
    "phrase": "捎",
    "sentence": "这是“捎”字。"
  },
  {
    "char": "梢",
    "pinyin": "shāo",
    "meaning": "tip of a branch",
    "level": 6,
    "phrase": "梢",
    "sentence": "这是“梢”字。"
  },
  {
    "char": "哨",
    "pinyin": "shào",
    "meaning": "a whistle; sentry post",
    "level": 6,
    "phrase": "哨",
    "sentence": "这是“哨”字。"
  },
  {
    "char": "盛",
    "pinyin": "chéng, shèng",
    "meaning": "contain; to ladle; to fill | flourishing; grand; abundant",
    "level": 6,
    "phrase": "盛",
    "sentence": "这是“盛”字。"
  },
  {
    "char": "拾",
    "pinyin": "shí",
    "meaning": "pick up; ten (banker's anti-fraud numeral)",
    "level": 6,
    "phrase": "拾",
    "sentence": "这是“拾”字。"
  },
  {
    "char": "束",
    "pinyin": "shù",
    "meaning": "to tie; to bind; restrain; (mw for bunches, bundles, bouquets, etc.)",
    "level": 6,
    "phrase": "束",
    "sentence": "这是“束”字。"
  },
  {
    "char": "竖",
    "pinyin": "shù",
    "meaning": "vertical; to erect; vertical stroke",
    "level": 6,
    "phrase": "竖",
    "sentence": "这是“竖”字。"
  },
  {
    "char": "耍",
    "pinyin": "shuǎ",
    "meaning": "play/mess around with; juggle",
    "level": 6,
    "phrase": "耍",
    "sentence": "这是“耍”字。"
  },
  {
    "char": "耸",
    "pinyin": "sǒng",
    "meaning": "shrug; towering; shock (alarm)",
    "level": 6,
    "phrase": "耸",
    "sentence": "这是“耸”字。"
  },
  {
    "char": "艘",
    "pinyin": "sōu",
    "meaning": "(mw for boats and ships)",
    "level": 6,
    "phrase": "艘",
    "sentence": "这是“艘”字。"
  },
  {
    "char": "塌",
    "pinyin": "tā",
    "meaning": "collapse; fall down; crumple",
    "level": 6,
    "phrase": "塌",
    "sentence": "这是“塌”字。"
  },
  {
    "char": "塔",
    "pinyin": "tǎ",
    "meaning": "pagoda; tower",
    "level": 6,
    "phrase": "塔",
    "sentence": "这是“塔”字。"
  },
  {
    "char": "摊",
    "pinyin": "tān",
    "meaning": "to spread out; vendor's stand; booth; fry; (mw for puddles)",
    "level": 6,
    "phrase": "摊",
    "sentence": "这是“摊”字。"
  },
  {
    "char": "掏",
    "pinyin": "tāo",
    "meaning": "fish out (from pocket)",
    "level": 6,
    "phrase": "掏",
    "sentence": "这是“掏”字。"
  },
  {
    "char": "舔",
    "pinyin": "tiǎn",
    "meaning": "to lick",
    "level": 6,
    "phrase": "舔",
    "sentence": "这是“舔”字。"
  },
  {
    "char": "铜",
    "pinyin": "tóng",
    "meaning": "copper",
    "level": 6,
    "phrase": "铜",
    "sentence": "这是“铜”字。"
  },
  {
    "char": "秃",
    "pinyin": "tū",
    "meaning": "bald; blunt",
    "level": 6,
    "phrase": "秃",
    "sentence": "这是“秃”字。"
  },
  {
    "char": "哇",
    "pinyin": "wa",
    "meaning": "wow; (sound of crying or surprise)",
    "level": 6,
    "phrase": "哇",
    "sentence": "这是“哇”字。"
  },
  {
    "char": "丸",
    "pinyin": "wán",
    "meaning": "pill; pellet",
    "level": 6,
    "phrase": "丸",
    "sentence": "这是“丸”字。"
  },
  {
    "char": "窝",
    "pinyin": "wō",
    "meaning": "nest; den",
    "level": 6,
    "phrase": "窝",
    "sentence": "这是“窝”字。"
  },
  {
    "char": "溪",
    "pinyin": "xī",
    "meaning": "creek",
    "level": 6,
    "phrase": "溪",
    "sentence": "这是“溪”字。"
  },
  {
    "char": "霞",
    "pinyin": "xiá",
    "meaning": "red clouds",
    "level": 6,
    "phrase": "霞",
    "sentence": "这是“霞”字。"
  },
  {
    "char": "弦",
    "pinyin": "xián",
    "meaning": "bow string; string of musical instruments",
    "level": 6,
    "phrase": "弦",
    "sentence": "这是“弦”字。"
  },
  {
    "char": "嫌",
    "pinyin": "xián",
    "meaning": "to dislike; suspicion; grudge",
    "level": 6,
    "phrase": "嫌",
    "sentence": "这是“嫌”字。"
  },
  {
    "char": "巷",
    "pinyin": "xiàng",
    "meaning": "lane; alley",
    "level": 6,
    "phrase": "巷",
    "sentence": "这是“巷”字。"
  },
  {
    "char": "屑",
    "pinyin": "xiè",
    "meaning": "crumbs; filings; worth while",
    "level": 6,
    "phrase": "屑",
    "sentence": "这是“屑”字。"
  },
  {
    "char": "腥",
    "pinyin": "xīng",
    "meaning": "fishy (smell)",
    "level": 6,
    "phrase": "腥",
    "sentence": "这是“腥”字。"
  },
  {
    "char": "绣",
    "pinyin": "xiù",
    "meaning": "embroider; embroidery",
    "level": 6,
    "phrase": "绣",
    "sentence": "这是“绣”字。"
  },
  {
    "char": "削",
    "pinyin": "xuē",
    "meaning": "to pare/peel with a knife; to cut; to chop",
    "level": 6,
    "phrase": "削",
    "sentence": "这是“削”字。"
  },
  {
    "char": "亦",
    "pinyin": "yì",
    "meaning": "also",
    "level": 6,
    "phrase": "亦",
    "sentence": "这是“亦”字。"
  },
  {
    "char": "翼",
    "pinyin": "yì",
    "meaning": "wings; fins on fish; shelter",
    "level": 6,
    "phrase": "翼",
    "sentence": "这是“翼”字。"
  },
  {
    "char": "玉",
    "pinyin": "yù",
    "meaning": "jade (Kangxi radical 96)",
    "level": 6,
    "phrase": "玉",
    "sentence": "这是“玉”字。"
  },
  {
    "char": "愈",
    "pinyin": "yù",
    "meaning": "recover; heal; the more ... the more",
    "level": 6,
    "phrase": "愈",
    "sentence": "这是“愈”字。"
  },
  {
    "char": "熨",
    "pinyin": "yùn",
    "meaning": "iron; press",
    "level": 6,
    "phrase": "熨",
    "sentence": "这是“熨”字。"
  },
  {
    "char": "砸",
    "pinyin": "zá",
    "meaning": "to smash; to pound; to break; fail",
    "level": 6,
    "phrase": "砸",
    "sentence": "这是“砸”字。"
  },
  {
    "char": "咋",
    "pinyin": "zǎ",
    "meaning": "how/why (contraction of 怎么)",
    "level": 6,
    "phrase": "咋",
    "sentence": "这是“咋”字。"
  },
  {
    "char": "宰",
    "pinyin": "zǎi",
    "meaning": "slaughter; butcher; govern; rule; imperial official in dynastic China",
    "level": 6,
    "phrase": "宰",
    "sentence": "这是“宰”字。"
  },
  {
    "char": "攒",
    "pinyin": "zǎn",
    "meaning": "save; hoard",
    "level": 6,
    "phrase": "攒",
    "sentence": "这是“攒”字。"
  },
  {
    "char": "贼",
    "pinyin": "zéi",
    "meaning": "thief",
    "level": 6,
    "phrase": "贼",
    "sentence": "这是“贼”字。"
  },
  {
    "char": "扎",
    "pinyin": "zhā",
    "meaning": "to prick; push a needle into; penetrating",
    "level": 6,
    "phrase": "扎",
    "sentence": "这是“扎”字。"
  },
  {
    "char": "渣",
    "pinyin": "zhā",
    "meaning": "dregs; slag",
    "level": 6,
    "phrase": "渣",
    "sentence": "这是“渣”字。"
  },
  {
    "char": "眨",
    "pinyin": "zhǎ",
    "meaning": "wink; blink",
    "level": 6,
    "phrase": "眨",
    "sentence": "这是“眨”字。"
  },
  {
    "char": "折",
    "pinyin": "zhé",
    "meaning": "to break; to fracture; convert into; to fold",
    "level": 6,
    "phrase": "折",
    "sentence": "这是“折”字。"
  },
  {
    "char": "枝",
    "pinyin": "zhī",
    "meaning": "branch; twig; (mw for sticks, rods, pencils)",
    "level": 6,
    "phrase": "枝",
    "sentence": "这是“枝”字。"
  },
  {
    "char": "州",
    "pinyin": "zhōu",
    "meaning": "province; sub-prefecture; (United States) state",
    "level": 6,
    "phrase": "州",
    "sentence": "这是“州”字。"
  },
  {
    "char": "舟",
    "pinyin": "zhōu",
    "meaning": "boat (Kangxi radical 137)",
    "level": 6,
    "phrase": "舟",
    "sentence": "这是“舟”字。"
  },
  {
    "char": "粥",
    "pinyin": "zhōu",
    "meaning": "porridge; congee; gruel",
    "level": 6,
    "phrase": "粥",
    "sentence": "这是“粥”字。"
  },
  {
    "char": "株",
    "pinyin": "zhū",
    "meaning": "stem; root; trunk; (mw for plants)",
    "level": 6,
    "phrase": "株",
    "sentence": "这是“株”字。"
  },
  {
    "char": "拄",
    "pinyin": "zhǔ",
    "meaning": "post; lean on a stick; prop",
    "level": 6,
    "phrase": "拄",
    "sentence": "这是“拄”字。"
  },
  {
    "char": "拽",
    "pinyin": "zhuài",
    "meaning": "drag; haul",
    "level": 6,
    "phrase": "拽",
    "sentence": "这是“拽”字。"
  },
  {
    "char": "砖",
    "pinyin": "zhuān",
    "meaning": "brick",
    "level": 6,
    "phrase": "砖",
    "sentence": "这是“砖”字。"
  },
  {
    "char": "坠",
    "pinyin": "zhuì",
    "meaning": "fall; drop",
    "level": 6,
    "phrase": "坠",
    "sentence": "这是“坠”字。"
  },
  {
    "char": "揍",
    "pinyin": "zòu",
    "meaning": "(informal) beat; hit; (regional) smash; break",
    "level": 6,
    "phrase": "揍",
    "sentence": "这是“揍”字。"
  }
];

const SESSION_KEY = "hsk_session_v1";
const API_BASE = "";

const SOURCE_WORDS = Array.isArray(window.HSK_WORDS) ? window.HSK_WORDS : [];

function buildCharItems() {
  const accentedToPlain = {
    ā: "a",
    á: "a",
    ǎ: "a",
    à: "a",
    ē: "e",
    é: "e",
    ě: "e",
    è: "e",
    ī: "i",
    í: "i",
    ǐ: "i",
    ì: "i",
    ō: "o",
    ó: "o",
    ǒ: "o",
    ò: "o",
    ū: "u",
    ú: "u",
    ǔ: "u",
    ù: "u",
    ǖ: "v",
    ǘ: "v",
    ǚ: "v",
    ǜ: "v",
    ü: "v",
    ń: "n",
    ň: "n",
    ǹ: "n",
    ḿ: "m"
  };

  const normalizePinyinToken = (value, stripTone = false) => {
    const source = String(value || "").toLowerCase();
    let out = "";
    for (const ch of source) {
      if (/[a-z]/.test(ch)) out += ch;
      else if (ch === "'") continue;
      else if (stripTone && accentedToPlain[ch]) out += accentedToPlain[ch];
      else if (!stripTone && (accentedToPlain[ch] || ch === "ü")) out += ch;
      else if (stripTone && ch === "ü") out += "v";
    }
    return out;
  };

  const splitRawTokens = (pinyin) => String(pinyin || "").trim().split(/\s+/).filter(Boolean);
  const knownPlainByChar = new Map();
  HSK_CHARS.forEach((it) => {
    if (!it || !it.char || !it.pinyin) return;
    const plain = normalizePinyinToken(it.pinyin, true);
    if (!plain) return;
    if (!knownPlainByChar.has(it.char)) knownPlainByChar.set(it.char, plain);
  });

  const validSyllables = new Set();
  knownPlainByChar.forEach((plain) => {
    if (plain) validSyllables.add(plain);
  });

  function splitCompactPinyin(chars, pinyin) {
    const rawCompact = normalizePinyinToken(pinyin, false);
    const plainCompact = normalizePinyinToken(pinyin, true);
    if (!rawCompact || !plainCompact || rawCompact.length !== plainCompact.length) return null;
    const n = chars.length;
    const memo = new Map();

    const solve = (idxChar, idxPos) => {
      const key = `${idxChar}:${idxPos}`;
      if (memo.has(key)) return memo.get(key);
      if (idxChar === n && idxPos === plainCompact.length) return { score: 0, lens: [] };
      if (idxChar >= n || idxPos >= plainCompact.length) return null;
      const remainChars = n - idxChar;
      const remainLen = plainCompact.length - idxPos;
      if (remainLen < remainChars || remainLen > remainChars * 7) return null;

      let best = null;
      const minLen = 1;
      const maxLen = Math.min(7, remainLen - (remainChars - 1));
      for (let len = minLen; len <= maxLen; len += 1) {
        const seg = plainCompact.slice(idxPos, idxPos + len);
        const char = chars[idxChar];
        const known = knownPlainByChar.get(char);
        const next = solve(idxChar + 1, idxPos + len);
        if (!next) continue;

        let score = next.score;
        if (validSyllables.has(seg)) score += 8;
        else if (len >= 2 && len <= 6) score += 2;
        else score -= 2;
        if (known) {
          if (seg === known) score += 12;
          else score -= 6;
        }
        // 优先把轻声常见后缀（de/ma/ne/ba/le）切成独立音节。
        if (["de", "ma", "ne", "ba", "le", "zi", "men"].includes(seg)) score += 1;

        const candidate = { score, lens: [len, ...next.lens] };
        if (!best || candidate.score > best.score) best = candidate;
      }
      memo.set(key, best);
      return best;
    };

    const best = solve(0, 0);
    if (!best || !best.lens || best.lens.length !== n) return null;
    const result = [];
    let pos = 0;
    for (const len of best.lens) {
      result.push(rawCompact.slice(pos, pos + len));
      pos += len;
    }
    return result.length === n ? result : null;
  }

  function splitWordPinyin(word, pinyin) {
    const chars = [...String(word || "")];
    if (!chars.length) return null;
    const rawTokens = splitRawTokens(pinyin);
    if (rawTokens.length === chars.length) return rawTokens.map((t) => normalizePinyinToken(t, false));
    return splitCompactPinyin(chars, pinyin);
  }

  const charPinyinHints = new Map();
  SOURCE_WORDS.forEach((w) => {
    const text = String((w && w.word) || "");
    const chars = [...text];
    const pyParts = splitWordPinyin(text, w && w.pinyin);
    if (!chars.length || !pyParts || pyParts.length !== chars.length) return;
    chars.forEach((ch, idx) => {
      if (!ch) return;
      if (!charPinyinHints.has(ch)) charPinyinHints.set(ch, pyParts[idx]);
    });
  });

  const map = new Map();
  HSK_CHARS.forEach((it) => {
    if (!it || !it.char) return;
    if (!map.has(it.char)) {
      map.set(it.char, {
        type: "char",
        text: it.char,
        pinyin: it.pinyin || "-",
        meaning: it.meaning || "-",
        level: Number(it.level) || 1,
        phrase: it.phrase || it.char,
        sentence: it.sentence || `这是“${it.char}”字。`
      });
      return;
    }
    const current = map.get(it.char);
    if (current && (!current.pinyin || current.pinyin === "-")) {
      current.pinyin = it.pinyin || charPinyinHints.get(it.char) || "-";
    }
  });

  // 将词汇拆分为单字并去重，统一并入汉字集合。
  SOURCE_WORDS.forEach((w) => {
    const level = Number(w && w.level) || 1;
    const word = String((w && w.word) || "");
    const chars = [...new Set([...word])];
    chars.forEach((ch) => {
      if (map.has(ch)) return;
      map.set(ch, {
        type: "char",
        text: ch,
        pinyin: charPinyinHints.get(ch) || "-",
        meaning: w && w.meaning ? `来自词汇：${w.meaning}` : "来自词汇",
        level,
        phrase: ch,
        sentence: `这是“${ch}”字。`
      });
    });
  });

  return [...map.values()].sort((a, b) => a.level - b.level || a.text.localeCompare(b.text, "zh-Hans-CN"));
}

const CHAR_ITEMS = buildCharItems();
const WORD_ITEMS = SOURCE_WORDS.map((it) => ({
  type: "word",
  text: it.word,
  pinyin: it.pinyin,
  meaning: it.meaning,
  level: it.level,
  phrase: it.phrase || it.word,
  sentence: it.sentence || `我正在学习“${it.word}”。`
}));

const CHAR_MAP = new Map(CHAR_ITEMS.map((it) => [it.text, it]));
const WORD_MAP = new Map(WORD_ITEMS.map((it) => [it.text, it]));
const CHAR_PHRASE_MAP = buildCharPhraseMap();
const BASE_ITEM_SNAPSHOT = new Map();
CHAR_ITEMS.forEach((it) => {
  BASE_ITEM_SNAPSHOT.set(`char:${it.text}`, { pinyin: it.pinyin || "", prompt1: "", prompt2: "" });
});
WORD_ITEMS.forEach((it) => {
  BASE_ITEM_SNAPSHOT.set(`word:${it.text}`, { pinyin: it.pinyin || "", prompt1: "", prompt2: "" });
});

function buildCharPhraseMap() {
  const map = new Map();
  const words = WORD_ITEMS.filter((w) => [...w.text].length >= 2);
  for (const c of CHAR_ITEMS) map.set(c.text, []);

  words
    .slice()
    .sort((a, b) => a.level - b.level || [...a.text].length - [...b.text].length || a.text.localeCompare(b.text, "zh-Hans-CN"))
    .forEach((w) => {
      const chars = [...new Set([...w.text])];
      for (const ch of chars) {
        if (!map.has(ch)) continue;
        const list = map.get(ch);
        if (!list.includes(w.text)) list.push(w.text);
      }
    });

  for (const [ch, list] of map.entries()) {
    if (list.length >= 2) continue;
    const fallback = CHAR_MAP.get(ch)?.phrase || ch;
    if (!list.includes(fallback)) list.unshift(fallback);
    if (list.length < 2) list.push(`${ch}${ch}`);
    map.set(ch, list.slice(0, 2));
  }
  return map;
}

const state = {
  auth: { loggedIn: false, role: "", username: "", token: "", linkedParentUsername: "", linkedChildren: [] },
  lang: "zh",
  lexiconOverrides: {},
  tab: "learn",
  level: "all",
  learnType: "char",
  learnIndex: 0,
  learnCharSearch: "",
  learnCharPage: 1,
  learnCharPageSize: 50,
  learnListTypeFilter: "all",
  learnSelectedKeys: [],
  writeListSearch: "",
  writeListPage: 1,
  writeListPageSize: 50,
  writeSelectedChars: [],
  writeBatchPlaying: false,
  writeBatchToken: 0,
  learnRandomMode: false,
  learnAutoSpeak: false,
  reviewType: "char",
  reviewLevel: "all",
  reviewCount: "10",
  reviewWrongMixRatio: "30",
  reviewPreviewMode: "0",
  reviewSessionSource: "normal",
  reviewList: [],
  reviewIndex: 0,
  reviewActive: false,
  reviewSessionPointsEarned: 0,
  reviewMessage: "请选择默写类型、等级和字数，然后点击“开始默写”。",
  progress: {},
  wrongBook: [],
  wrongLevelFilter: "all",
  wrongDictationCount: "10",
  rewards: { totalPoints: 0, weeklyPoints: 0, weeklyCorrect: 0, currentWeekKey: "", lastUpdatedAt: Date.now() },
  submissions: [],
  wrongQueue: [],
  dictationPad: null,
  dictationPads: [],
  reviewPreviewTimer: null,
  reviewPreviewCountdownTimer: null,
  reviewPreviewToken: 0,
  reviewPreviewRunning: false,
  strokeWriter: null,
  strokeChar: "",
  refreshWriteCanvas: null,
  advanceTimer: null,
  syncTimer: null,
  reviewDraftActive: false,
  reviewSessionSnapshot: null,
  pendingSubmissionPayloads: [],
  adminWordReviewDrafts: {},
  adminWrongBookQueryUser: "",
  adminWrongBookItems: [],
  adminUsers: [],
  adminItemsTypeFilter: "all",
  adminItemsLevelFilter: "all",
  adminItemsSearch: "",
  adminItemsPage: 1,
  adminItemsPageSize: 50,
  adminItemsDrafts: {},
  adminItemsSaving: false
};

const tabs = Array.from(document.querySelectorAll(".tab"));
const panels = {
  learn: document.getElementById("learn-panel"),
  write: document.getElementById("write-panel"),
  review: document.getElementById("review-panel"),
  wrong: document.getElementById("wrong-panel"),
  admin: document.getElementById("admin-panel"),
  "admin-users": document.getElementById("admin-users-panel"),
  "admin-wrong": document.getElementById("admin-wrong-panel"),
  "admin-items": document.getElementById("admin-items-panel"),
  records: document.getElementById("records-panel")
};
const authScreen = document.getElementById("auth-screen");
const appShell = document.getElementById("app-shell");
const authTabLogin = document.getElementById("auth-tab-login");
const authTabRegister = document.getElementById("auth-tab-register");
const authUsername = document.getElementById("auth-username");
const authPassword = document.getElementById("auth-password");
const authPasswordConfirmRow = document.getElementById("auth-password-confirm-row");
const authPasswordConfirm = document.getElementById("auth-password-confirm");
const authRoleRow = document.getElementById("auth-role-row");
const authRoleSelect = document.getElementById("auth-role-select");
const authParentUsernameRow = document.getElementById("auth-parent-username-row");
const authParentUsername = document.getElementById("auth-parent-username");
const authTogglePassword = document.getElementById("auth-toggle-password");
const authLangSelect = document.getElementById("auth-lang-select");
const authLogin = document.getElementById("auth-login");
const authRegister = document.getElementById("auth-register");
const authMsg = document.getElementById("auth-msg");
const logoutBtn = document.getElementById("logout-btn");
const userBadge = document.getElementById("user-badge");
const appLangSelect = document.getElementById("app-lang-select");
const adminTab = document.getElementById("admin-tab");
const adminUsersTab = document.getElementById("admin-users-tab");
const adminWrongTab = document.getElementById("admin-wrong-tab");
const adminItemsTab = document.getElementById("admin-items-tab");
const recordsTab = document.getElementById("records-tab");
const adminCount = document.getElementById("admin-count");
const adminList = document.getElementById("admin-list");
const adminUserFilter = document.getElementById("admin-user-filter");
const adminTimeFilter = document.getElementById("admin-time-filter");
const adminFilterApply = document.getElementById("admin-filter-apply");
const adminWrongSearchUser = document.getElementById("admin-wrong-search-user");
const adminWrongSearch = document.getElementById("admin-wrong-search");
const adminWrongCount = document.getElementById("admin-wrong-count");
const adminWrongList = document.getElementById("admin-wrong-list");
const adminWrongMsg = document.getElementById("admin-wrong-msg");
const adminUsersCount = document.getElementById("admin-users-count");
const adminUsersRefresh = document.getElementById("admin-users-refresh");
const adminUsersMsg = document.getElementById("admin-users-msg");
const adminUsersList = document.getElementById("admin-users-list");
const adminItemsCount = document.getElementById("admin-items-count");
const adminItemsTypeFilter = document.getElementById("admin-items-type-filter");
const adminItemsLevelFilter = document.getElementById("admin-items-level-filter");
const adminItemsSearch = document.getElementById("admin-items-search");
const adminItemsPageSize = document.getElementById("admin-items-page-size");
const adminItemsSaveAll = document.getElementById("admin-items-save-all");
const adminItemsPrev = document.getElementById("admin-items-prev");
const adminItemsNext = document.getElementById("admin-items-next");
const adminItemsPageInfo = document.getElementById("admin-items-page-info");
const adminItemsMsg = document.getElementById("admin-items-msg");
const adminItemsList = document.getElementById("admin-items-list");
const recordsCount = document.getElementById("records-count");
const recordsList = document.getElementById("records-list");
const recordsStats = document.getElementById("records-stats");

const learnTabBtn = document.querySelector('.tab[data-tab="learn"]');
const writeTabBtn = document.querySelector('.tab[data-tab="write"]');
const reviewTabBtn = document.querySelector('.tab[data-tab="review"]');
const wrongTabBtn = document.querySelector('.tab[data-tab="wrong"]');

const levelFilter = document.getElementById("level-filter");
const learnTypeFilter = document.getElementById("learn-type-filter");
const learnChar = document.getElementById("learn-char");
const learnPinyin = document.getElementById("learn-pinyin");
const learnMeaning = document.getElementById("learn-meaning");
const learnProgress = document.getElementById("learn-progress");
const learnCharSearch = document.getElementById("learn-char-search");
const learnListTypeFilter = document.getElementById("learn-list-type-filter");
const learnCharList = document.getElementById("learn-char-list");
const learnListSummary = document.getElementById("learn-list-summary");
const learnCharPageSize = document.getElementById("learn-char-page-size");
const learnCharPrev = document.getElementById("learn-char-prev");
const learnCharNext = document.getElementById("learn-char-next");
const learnCharPageInfo = document.getElementById("learn-char-page-info");
const learnSelectPage = document.getElementById("learn-select-page");
const learnClearSelected = document.getElementById("learn-clear-selected");
const learnDemoSelected = document.getElementById("learn-demo-selected");
const learnDictateSelected = document.getElementById("learn-dictate-selected");
const learnCard = document.getElementById("learn-card");

const writeSelect = document.getElementById("write-char-select");
const writePrevChar = document.getElementById("write-prev-char");
const writeNextChar = document.getElementById("write-next-char");
const targetChar = document.getElementById("target-char");
const targetMeta = document.getElementById("target-meta");
const writeFeedback = document.getElementById("write-feedback");
const strokeDemoPlay = document.getElementById("stroke-demo-play");
const strokeDemoReplay = document.getElementById("stroke-demo-replay");
const strokeDemo = document.getElementById("stroke-demo");
const strokeDemoMsg = document.getElementById("stroke-demo-msg");
const writeListSearch = document.getElementById("write-list-search");
const writeListPageSize = document.getElementById("write-list-page-size");
const writeListPrev = document.getElementById("write-list-prev");
const writeListNext = document.getElementById("write-list-next");
const writeListPageInfo = document.getElementById("write-list-page-info");
const writeListSummary = document.getElementById("write-list-summary");
const writeListSelectPage = document.getElementById("write-list-select-page");
const writeListClearSelected = document.getElementById("write-list-clear-selected");
const writeListPlaySelected = document.getElementById("write-list-play-selected");
const writeListStopPlay = document.getElementById("write-list-stop-play");
const writeCharList = document.getElementById("write-char-list");

const dueCount = document.getElementById("due-count");
const reviewTypeFilter = document.getElementById("review-type-filter");
const reviewLevelFilter = document.getElementById("review-level-filter");
const reviewCountFilter = document.getElementById("review-count-filter");
const reviewWrongMixFilter = document.getElementById("review-wrong-mix-filter");
const reviewPreviewFilter = document.getElementById("review-preview-filter");
const reviewBegin = document.getElementById("review-begin");
const reviewRestart = document.getElementById("review-restart");
const reviewPinyin = document.getElementById("review-pinyin");
const reviewMeaning = document.getElementById("review-meaning");
const reviewPreview = document.getElementById("review-preview");
const reviewPreviewTimer = document.getElementById("review-preview-timer");
const reviewPreviewTimeText = document.getElementById("review-preview-time-text");
const reviewPreviewProgressBar = document.getElementById("review-preview-progress-bar");
const dictationWriterHost = document.getElementById("dictation-writer");
const reviewFeedback = document.getElementById("review-feedback");
const reviewAnswer = document.getElementById("review-answer");
const reviewStartBtn = document.getElementById("review-start");
const reviewResetBtn = document.getElementById("review-reset");
const reviewStopBtn = document.getElementById("review-stop");
const wordAnswerRow = document.getElementById("word-answer-row");
const wordReviewInput = document.getElementById("word-review-input");
const wordReviewSubmit = document.getElementById("word-review-submit");

const wrongCount = document.getElementById("wrong-count");
const wrongList = document.getElementById("wrong-list");
const wrongLevelFilters = document.getElementById("wrong-level-filters");
const wrongDictationCount = document.getElementById("wrong-dictation-count");
const clearWrongBtn = document.getElementById("clear-wrong");
const startWrongDictation = document.getElementById("start-wrong-dictation");

const statsText = document.getElementById("stats-text");
const rewardText = document.getElementById("reward-text");
const pointsGainFx = document.getElementById("points-gain-fx");
const pointsFireworks = document.getElementById("points-fireworks");

const LANG_KEY = "hsk_ui_lang";
const SUPPORTED_LANGS = ["zh", "en", "fr", "es"];
const I18N = {
  zh: {
    "app.title": "HSK 汉字学习与书写复习",
    "lang.label": "语言",
    "auth.welcome": "欢迎使用",
    "auth.subtitle": "登录后开始汉字学习、书写练习与默写复习。",
    "auth.loginTab": "登录",
    "auth.registerTab": "注册",
    "auth.username": "用户名",
    "auth.password": "密码",
    "auth.confirmPassword": "确认密码",
    "auth.role": "账号角色",
    "auth.roleParent": "父母",
    "auth.roleChild": "孩子",
    "auth.parentUsername": "关联父母账号",
    "auth.usernamePlaceholder": "请输入用户名",
    "auth.passwordPlaceholder": "请输入密码",
    "auth.confirmPasswordPlaceholder": "请再次输入密码",
    "auth.parentUsernamePlaceholder": "请输入已注册父母账号用户名",
    "auth.showPassword": "显示密码",
    "auth.hidePassword": "隐藏密码",
    "auth.login": "登录",
    "auth.register": "注册账号",
    "auth.loggingIn": "登录中...",
    "auth.registering": "注册中...",
    "auth.enterUsernamePassword": "请输入用户名和密码。",
    "auth.fillAllFields": "请完整填写注册信息。",
    "auth.passwordNotMatch": "两次密码不一致。",
    "auth.needParentUsername": "孩子账号必须填写关联父母账号用户名。",
    "auth.registerSuccess": "注册成功，请点击“登录”进入系统。",
    "auth.loginFailed": "登录失败",
    "auth.registerFailed": "注册失败",
    "auth.loggedOut": "已退出登录。",
    "auth.needLogin": "请先登录后使用。",
    "top.logout": "退出登录",
    "top.roleAdmin": "管理员",
    "top.roleParent": "父母",
    "top.roleChild": "孩子",
    "top.linkedParent": "关联父母：{username}",
    "top.linkedChildrenCount": "关联孩子：{count} 个",
    "top.currentUser": "当前用户：{username}（{role}）",
    "top.notLoggedIn": "未登录",
    "nav.learn": "学习",
    "nav.write": "写字",
    "nav.review": "默写测验",
    "nav.wrong": "错题本",
    "review.stop": "停止默写",
    "review.stopConfirm": "停止后将取消本轮默写且数据不保存，是否继续？",
    "nav.records": "我的记录",
    "nav.adminReview": "默写判定审核",
    "nav.adminWrong": "题本管理",
    "adminWrong.title": "题本管理",
    "adminWrong.username": "用户名",
    "adminWrong.usernamePlaceholder": "输入用户名后查询",
    "adminWrong.search": "查询错题本",
    "adminWrong.count": "错题：{count} 条",
    "adminWrong.onlyAdmin": "仅管理员或父母可查看。",
    "adminWrong.promptQuery": "请输入用户名并点击“查询错题本”。",
    "adminWrong.empty": "该用户当前没有错题。",
    "adminWrong.delete": "删除",
    "adminWrong.enterUsername": "请输入用户名。",
    "adminWrong.queryOk": "已查询用户 {username} 的错题本。",
    "adminWrong.queryFailed": "查询失败",
    "adminWrong.deleted": "已删除：{text}",
    "adminWrong.deleteFailed": "删除失败",
    "adminWrong.confirmDelete": "确认从 {username} 的错题本删除「{text}」吗？"
  },
  en: {
    "app.title": "HSK Chinese Characters Study & Writing Review",
    "lang.label": "Language",
    "auth.welcome": "Welcome",
    "auth.subtitle": "Sign in to start learning characters, handwriting practice, and dictation review.",
    "auth.loginTab": "Login",
    "auth.registerTab": "Register",
    "auth.username": "Username",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm Password",
    "auth.role": "Account Role",
    "auth.roleParent": "Parent",
    "auth.roleChild": "Child",
    "auth.parentUsername": "Linked Parent Account",
    "auth.usernamePlaceholder": "Enter username",
    "auth.passwordPlaceholder": "Enter password",
    "auth.confirmPasswordPlaceholder": "Enter password again",
    "auth.parentUsernamePlaceholder": "Enter an existing parent username",
    "auth.showPassword": "Show Password",
    "auth.hidePassword": "Hide Password",
    "auth.login": "Login",
    "auth.register": "Create Account",
    "auth.loggingIn": "Signing in...",
    "auth.registering": "Registering...",
    "auth.enterUsernamePassword": "Please enter username and password.",
    "auth.fillAllFields": "Please complete all registration fields.",
    "auth.passwordNotMatch": "Passwords do not match.",
    "auth.needParentUsername": "Child account must provide a linked parent username.",
    "auth.registerSuccess": "Registration successful. Please click Login to continue.",
    "auth.loginFailed": "Login failed",
    "auth.registerFailed": "Registration failed",
    "auth.loggedOut": "Logged out.",
    "auth.needLogin": "Please log in first.",
    "top.logout": "Log out",
    "top.roleAdmin": "Admin",
    "top.roleParent": "Parent",
    "top.roleChild": "Child",
    "top.linkedParent": "Linked parent: {username}",
    "top.linkedChildrenCount": "Linked children: {count}",
    "top.currentUser": "Current user: {username} ({role})",
    "top.notLoggedIn": "Not logged in",
    "nav.learn": "Learn",
    "nav.write": "Write",
    "nav.review": "Dictation",
    "nav.wrong": "Wrong Book",
    "review.stop": "Stop Dictation",
    "review.stopConfirm": "Stopping will cancel this dictation session and discard unsaved data. Continue?",
    "nav.records": "My Records",
    "nav.adminReview": "Dictation Review",
    "nav.adminWrong": "Wrong-Book Admin",
    "adminWrong.title": "Wrong-Book Management",
    "adminWrong.username": "Username",
    "adminWrong.usernamePlaceholder": "Enter username and query",
    "adminWrong.search": "Query Wrong Book",
    "adminWrong.count": "Wrong items: {count}",
    "adminWrong.onlyAdmin": "Admin or parent access only.",
    "adminWrong.promptQuery": "Enter a username and click Query Wrong Book.",
    "adminWrong.empty": "This user has no wrong items.",
    "adminWrong.delete": "Delete",
    "adminWrong.enterUsername": "Please enter a username.",
    "adminWrong.queryOk": "Loaded wrong-book items for {username}.",
    "adminWrong.queryFailed": "Query failed",
    "adminWrong.deleted": "Deleted: {text}",
    "adminWrong.deleteFailed": "Delete failed",
    "adminWrong.confirmDelete": "Remove \"{text}\" from {username}'s wrong book?"
  },
  fr: {
    "app.title": "HSK Étude des caractères chinois et révision d'écriture",
    "lang.label": "Langue",
    "auth.welcome": "Bienvenue",
    "auth.subtitle": "Connectez-vous pour apprendre les caractères, pratiquer l'écriture et faire des dictées.",
    "auth.loginTab": "Connexion",
    "auth.registerTab": "Inscription",
    "auth.username": "Nom d'utilisateur",
    "auth.password": "Mot de passe",
    "auth.confirmPassword": "Confirmer le mot de passe",
    "auth.role": "Rôle du compte",
    "auth.roleParent": "Parent",
    "auth.roleChild": "Enfant",
    "auth.parentUsername": "Compte parent lié",
    "auth.usernamePlaceholder": "Entrez le nom d'utilisateur",
    "auth.passwordPlaceholder": "Entrez le mot de passe",
    "auth.confirmPasswordPlaceholder": "Entrez encore le mot de passe",
    "auth.parentUsernamePlaceholder": "Entrez un nom d'utilisateur parent existant",
    "auth.showPassword": "Afficher",
    "auth.hidePassword": "Masquer",
    "auth.login": "Se connecter",
    "auth.register": "Créer un compte",
    "auth.loggingIn": "Connexion...",
    "auth.registering": "Inscription...",
    "auth.enterUsernamePassword": "Veuillez entrer le nom d'utilisateur et le mot de passe.",
    "auth.fillAllFields": "Veuillez remplir tous les champs d'inscription.",
    "auth.passwordNotMatch": "Les mots de passe ne correspondent pas.",
    "auth.needParentUsername": "Le compte enfant doit renseigner un compte parent lié.",
    "auth.registerSuccess": "Inscription réussie. Cliquez sur Connexion pour continuer.",
    "auth.loginFailed": "Échec de la connexion",
    "auth.registerFailed": "Échec de l'inscription",
    "auth.loggedOut": "Déconnecté.",
    "auth.needLogin": "Veuillez vous connecter d'abord.",
    "top.logout": "Déconnexion",
    "top.roleAdmin": "Administrateur",
    "top.roleParent": "Parent",
    "top.roleChild": "Enfant",
    "top.linkedParent": "Parent lié : {username}",
    "top.linkedChildrenCount": "Enfants liés : {count}",
    "top.currentUser": "Utilisateur actuel : {username} ({role})",
    "top.notLoggedIn": "Non connecté",
    "nav.learn": "Apprendre",
    "nav.write": "Écrire",
    "nav.review": "Dictée",
    "nav.wrong": "Cahier d'erreurs",
    "review.stop": "Arrêter la dictée",
    "review.stopConfirm": "Arrêter annulera cette session de dictée et les données non enregistrées seront perdues. Continuer ?",
    "nav.records": "Mes records",
    "nav.adminReview": "Revue de dictée",
    "nav.adminWrong": "Gestion du cahier",
    "adminWrong.title": "Gestion du cahier d'erreurs",
    "adminWrong.username": "Nom d'utilisateur",
    "adminWrong.usernamePlaceholder": "Entrez le nom et lancez la recherche",
    "adminWrong.search": "Rechercher",
    "adminWrong.count": "Erreurs : {count}",
    "adminWrong.onlyAdmin": "Accès administrateur ou parent uniquement.",
    "adminWrong.promptQuery": "Entrez un nom d'utilisateur puis cliquez sur Rechercher.",
    "adminWrong.empty": "Cet utilisateur n'a aucune erreur.",
    "adminWrong.delete": "Supprimer",
    "adminWrong.enterUsername": "Veuillez entrer un nom d'utilisateur.",
    "adminWrong.queryOk": "Cahier d'erreurs chargé pour {username}.",
    "adminWrong.queryFailed": "Échec de la recherche",
    "adminWrong.deleted": "Supprimé : {text}",
    "adminWrong.deleteFailed": "Échec de la suppression",
    "adminWrong.confirmDelete": "Supprimer « {text} » du cahier d'erreurs de {username} ?"
  },
  es: {
    "app.title": "HSK Estudio de caracteres chinos y repaso de escritura",
    "lang.label": "Idioma",
    "auth.welcome": "Bienvenido",
    "auth.subtitle": "Inicia sesión para aprender caracteres, practicar escritura y repasar dictado.",
    "auth.loginTab": "Iniciar sesión",
    "auth.registerTab": "Registrarse",
    "auth.username": "Usuario",
    "auth.password": "Contraseña",
    "auth.confirmPassword": "Confirmar contraseña",
    "auth.role": "Rol de cuenta",
    "auth.roleParent": "Padre/Madre",
    "auth.roleChild": "Hijo/a",
    "auth.parentUsername": "Cuenta de padre/madre vinculada",
    "auth.usernamePlaceholder": "Ingresa usuario",
    "auth.passwordPlaceholder": "Ingresa contraseña",
    "auth.confirmPasswordPlaceholder": "Ingresa la contraseña de nuevo",
    "auth.parentUsernamePlaceholder": "Ingresa un usuario de padre/madre existente",
    "auth.showPassword": "Mostrar",
    "auth.hidePassword": "Ocultar",
    "auth.login": "Entrar",
    "auth.register": "Crear cuenta",
    "auth.loggingIn": "Iniciando...",
    "auth.registering": "Registrando...",
    "auth.enterUsernamePassword": "Ingresa usuario y contraseña.",
    "auth.fillAllFields": "Completa todos los campos de registro.",
    "auth.passwordNotMatch": "Las contraseñas no coinciden.",
    "auth.needParentUsername": "La cuenta infantil debe indicar un usuario de padre/madre vinculado.",
    "auth.registerSuccess": "Registro exitoso. Haz clic en Iniciar sesión para continuar.",
    "auth.loginFailed": "Error de inicio de sesión",
    "auth.registerFailed": "Error de registro",
    "auth.loggedOut": "Sesión cerrada.",
    "auth.needLogin": "Inicia sesión primero.",
    "top.logout": "Cerrar sesión",
    "top.roleAdmin": "Administrador",
    "top.roleParent": "Padre/Madre",
    "top.roleChild": "Hijo/a",
    "top.linkedParent": "Padre/madre vinculado: {username}",
    "top.linkedChildrenCount": "Hijos vinculados: {count}",
    "top.currentUser": "Usuario actual: {username} ({role})",
    "top.notLoggedIn": "Sin iniciar sesión",
    "nav.learn": "Aprender",
    "nav.write": "Escribir",
    "nav.review": "Dictado",
    "nav.wrong": "Cuaderno de errores",
    "review.stop": "Detener dictado",
    "review.stopConfirm": "Detener cancelará esta sesión de dictado y no se guardarán los datos. ¿Continuar?",
    "nav.records": "Mis registros",
    "nav.adminReview": "Revisión de dictado",
    "nav.adminWrong": "Gestión de errores",
    "adminWrong.title": "Gestión del cuaderno de errores",
    "adminWrong.username": "Usuario",
    "adminWrong.usernamePlaceholder": "Ingresa usuario y consulta",
    "adminWrong.search": "Consultar",
    "adminWrong.count": "Errores: {count}",
    "adminWrong.onlyAdmin": "Solo administradores o padres/madres.",
    "adminWrong.promptQuery": "Ingresa un usuario y pulsa Consultar.",
    "adminWrong.empty": "Este usuario no tiene errores.",
    "adminWrong.delete": "Eliminar",
    "adminWrong.enterUsername": "Ingresa un usuario.",
    "adminWrong.queryOk": "Cuaderno de errores cargado para {username}.",
    "adminWrong.queryFailed": "Error de consulta",
    "adminWrong.deleted": "Eliminado: {text}",
    "adminWrong.deleteFailed": "Error al eliminar",
    "adminWrong.confirmDelete": "¿Eliminar \"{text}\" del cuaderno de errores de {username}?"
  }
};

function normalizeLang(lang) {
  return SUPPORTED_LANGS.includes(lang) ? lang : "zh";
}

function isLearnerRole(role) {
  return role === "parent" || role === "child" || role === "user";
}

function isManagerRole(role) {
  return role === "admin" || role === "parent";
}

function isSuperAdmin(role) {
  return role === "admin";
}

function canAccessReviewAudit(role) {
  return role === "parent";
}

function t(key, vars = {}) {
  const langPack = I18N[state.lang] || I18N.zh;
  const fallback = I18N.zh[key] || key;
  const template = langPack[key] || fallback;
  return String(template).replace(/\{(\w+)\}/g, (_, k) => (vars[k] == null ? "" : String(vars[k])));
}

function updateAuthTogglePasswordLabel() {
  if (!authTogglePassword) return;
  authTogglePassword.textContent = authPassword.type === "password" ? t("auth.showPassword") : t("auth.hidePassword");
}

function translateStaticText() {
  document.title = t("app.title");
  document.documentElement.lang = state.lang === "zh" ? "zh-CN" : state.lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    el.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (!key) return;
    el.setAttribute("placeholder", t(key));
  });
  updateAuthTogglePasswordLabel();
}

function refreshUserBadgeText() {
  if (!userBadge) return;
  if (!state.auth.loggedIn || !state.auth.username) {
    userBadge.textContent = t("top.notLoggedIn");
    return;
  }
  const roleLabel = getRoleLabel(state.auth.role);
  const extras = [];
  if (state.auth.role === "child" && state.auth.linkedParentUsername) {
    extras.push(t("top.linkedParent", { username: state.auth.linkedParentUsername }));
  }
  if (state.auth.role === "parent" && Array.isArray(state.auth.linkedChildren) && state.auth.linkedChildren.length > 0) {
    extras.push(t("top.linkedChildrenCount", { count: state.auth.linkedChildren.length }));
  }
  const suffix = extras.length ? ` · ${extras.join(" · ")}` : "";
  userBadge.textContent = `${t("top.currentUser", { username: state.auth.username, role: roleLabel })}${suffix}`;
}

function getRoleLabel(role) {
  if (role === "admin") return t("top.roleAdmin");
  if (role === "parent") return t("top.roleParent");
  return t("top.roleChild");
}

function setLanguage(lang, persist = true) {
  state.lang = normalizeLang(lang);
  if (persist) localStorage.setItem(LANG_KEY, state.lang);
  if (authLangSelect) authLangSelect.value = state.lang;
  if (appLangSelect) appLangSelect.value = state.lang;
  translateStaticText();
  refreshUserBadgeText();
  renderAdminWrongBookPanel();
  renderAdminUsersPanel();
}

function loadProgress(username = state.auth.username) {
  return state.progress || {};
}

function loadWrongBook(username = state.auth.username) {
  return Array.isArray(state.wrongBook) ? state.wrongBook : [];
}

function loadRewards(username = state.auth.username) {
  return state.rewards || {
    totalPoints: 0,
    weeklyPoints: 0,
    weeklyCorrect: 0,
    currentWeekKey: "",
    lastUpdatedAt: Date.now()
  };
}

function loadReviewPrefs(username = state.auth.username) {
  const allowedMixRatios = new Set(["0", "10", "20", "30", "40", "50", "70", "100"]);
  const normalizeMixRatio = (value) => (allowedMixRatios.has(String(value)) ? String(value) : "30");
  const allowedPreview = new Set(["0", "all"]);
  const normalizePreview = (value) => (allowedPreview.has(String(value)) ? String(value) : "0");
  return {
    reviewType: state.reviewType === "word" ? "word" : "char",
    reviewLevel: state.reviewLevel === "all" ? "all" : String(state.reviewLevel || "all"),
    reviewCount: state.reviewCount === "all" ? "all" : String(state.reviewCount || "10"),
    reviewWrongMixRatio: normalizeMixRatio(state.reviewWrongMixRatio),
    reviewPreviewMode: normalizePreview(state.reviewPreviewMode)
  };
}

function normalizeAccuracyPercent(value) {
  if (typeof value === "string") {
    const cleaned = value.replace("%", "").trim();
    const parsed = Number(cleaned);
    if (Number.isFinite(parsed)) value = parsed;
  }
  if (!Number.isFinite(value)) return 0;
  let num = Number(value);
  if (num >= 0 && num <= 1) num *= 100;
  return Math.max(0, Math.min(100, Math.round(num)));
}

function saveProgress() {
  if (state.reviewDraftActive) return;
  queueUserDataSync();
}

function saveWrongBook() {
  if (state.reviewDraftActive) return;
  queueUserDataSync();
}

function saveRewards() {
  if (state.reviewDraftActive) return;
  queueUserDataSync();
}

function saveReviewPrefs() {
  queueUserDataSync();
}

function saveSubmissions() {
  return;
}

function loadSession() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    if (!parsed || !parsed.username || !parsed.role || !parsed.token) return null;
    parsed.linkedParentUsername = String(parsed.linkedParentUsername || "");
    parsed.linkedChildren = Array.isArray(parsed.linkedChildren) ? parsed.linkedChildren : [];
    return parsed;
  } catch {
    return null;
  }
}

function saveSession() {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      username: state.auth.username,
      role: state.auth.role,
      token: state.auth.token,
      loggedIn: state.auth.loggedIn,
      linkedParentUsername: state.auth.linkedParentUsername,
      linkedChildren: state.auth.linkedChildren
    })
  );
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

async function apiRequest(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (state.auth.token) headers.Authorization = `Bearer ${state.auth.token}`;
  const resp = await fetch(`${API_BASE}${path}`, { ...options, headers });
  let body = {};
  try {
    body = await resp.json();
  } catch {
    body = {};
  }
  if (!resp.ok || body.ok === false) {
    throw new Error(body.message || `请求失败(${resp.status})`);
  }
  return body;
}

function queueUserDataSync() {
  if (!state.auth.loggedIn || !state.auth.username || !isLearnerRole(state.auth.role)) return;
  if (state.syncTimer) clearTimeout(state.syncTimer);
  state.syncTimer = setTimeout(() => {
    state.syncTimer = null;
    syncUserDataToServer();
  }, 300);
}

function beginReviewDraftSession() {
  state.reviewDraftActive = true;
  state.reviewSessionSnapshot = {
    progress: JSON.parse(JSON.stringify(state.progress || {})),
    wrongBook: JSON.parse(JSON.stringify(state.wrongBook || [])),
    rewards: JSON.parse(JSON.stringify(state.rewards || {}))
  };
  state.pendingSubmissionPayloads = [];
}

function rollbackReviewDraftSession() {
  if (!state.reviewDraftActive || !state.reviewSessionSnapshot) return;
  state.progress = JSON.parse(JSON.stringify(state.reviewSessionSnapshot.progress || {}));
  state.wrongBook = JSON.parse(JSON.stringify(state.reviewSessionSnapshot.wrongBook || []));
  state.rewards = JSON.parse(JSON.stringify(state.reviewSessionSnapshot.rewards || {}));
  state.reviewDraftActive = false;
  state.reviewSessionSnapshot = null;
  state.pendingSubmissionPayloads = [];
  rebuildWrongQueue();
  refreshStats();
  refreshRewards();
  renderAdminPanel();
  renderUserRecords();
}

function endReviewDraftSession() {
  state.reviewDraftActive = false;
  state.reviewSessionSnapshot = null;
  state.pendingSubmissionPayloads = [];
}

async function postSubmissionPayload(payload) {
  const resp = await apiRequest("/api/submissions", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  if (resp && resp.submission) state.submissions.unshift(resp.submission);
  renderLearnCharList();
}

async function commitReviewDraftSession() {
  if (!state.reviewDraftActive) return;
  const pending = [...state.pendingSubmissionPayloads];
  endReviewDraftSession();
  await syncUserDataToServer();
  for (const payload of pending) {
    try {
      await postSubmissionPayload(payload);
    } catch (err) {
      console.warn("record submission failed:", err && err.message ? err.message : err);
    }
  }
  renderAdminPanel();
  renderUserRecords();
  renderLearnCharList();
}

async function syncUserDataToServer() {
  if (!state.auth.loggedIn || !state.auth.username || !isLearnerRole(state.auth.role)) return;
  try {
    await apiRequest("/api/user-data", {
      method: "PUT",
      body: JSON.stringify({
        progress: state.progress,
        wrongBook: state.wrongBook,
        rewards: state.rewards,
        reviewPrefs: {
          reviewType: state.reviewType,
          reviewLevel: state.reviewLevel,
          reviewCount: state.reviewCount,
          reviewWrongMixRatio: state.reviewWrongMixRatio,
          reviewPreviewMode: state.reviewPreviewMode
        }
      })
    });
  } catch (err) {
    console.warn("sync user data failed:", err && err.message ? err.message : err);
  }
}

function getWeekKey(d = new Date()) {
  const date = new Date(d);
  const day = date.getDay() || 7;
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - day + 1);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function getWeekRangeLabel(weekKey) {
  if (!weekKey) return "-";
  const start = new Date(`${weekKey}T00:00:00`);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const fmt = (x) => `${x.getMonth() + 1}/${x.getDate()}`;
  return `${fmt(start)} - ${fmt(end)}`;
}

function ensureWeeklyRewards() {
  const nowWeekKey = getWeekKey();
  if (state.rewards.currentWeekKey === nowWeekKey) return;
  state.rewards.currentWeekKey = nowWeekKey;
  state.rewards.weeklyPoints = 0;
  state.rewards.weeklyCorrect = 0;
  state.rewards.lastUpdatedAt = Date.now();
  saveRewards();
}

let fireworksRaf = 0;
let fireworksToken = 0;
let fireworksParticles = [];

function stopPointsFireworks() {
  fireworksToken += 1;
  if (fireworksRaf) {
    cancelAnimationFrame(fireworksRaf);
    fireworksRaf = 0;
  }
  fireworksParticles = [];
  if (!pointsFireworks) return;
  const ctx = pointsFireworks.getContext("2d");
  if (ctx) ctx.clearRect(0, 0, pointsFireworks.width, pointsFireworks.height);
  pointsFireworks.classList.remove("is-show");
}

function resizeFireworksCanvas() {
  if (!pointsFireworks) return { width: 0, height: 0 };
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const width = Math.max(1, Math.floor(window.innerWidth));
  const height = Math.max(1, Math.floor(window.innerHeight));
  pointsFireworks.width = Math.floor(width * dpr);
  pointsFireworks.height = Math.floor(height * dpr);
  pointsFireworks.style.width = `${width}px`;
  pointsFireworks.style.height = `${height}px`;
  const ctx = pointsFireworks.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { width, height };
}

function spawnCenterBurst(centerX, centerY, nowMs, strength = 1) {
  const colors = ["#8fd2ff", "#4aa3ff", "#c8e7ff", "#9f8bff", "#5be7ff", "#ffffff"];
  const count = Math.round(48 + 24 * strength);
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.22;
    const speed = (1.5 + Math.random() * 3.4) * (0.65 + strength * 0.6);
    fireworksParticles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 750 + Math.random() * 620,
      bornAt: nowMs,
      size: 1.2 + Math.random() * 2.8,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
}

function runPointsFireworks(durationMs) {
  if (!pointsFireworks) return;
  stopPointsFireworks();
  pointsFireworks.classList.add("is-show");
  const { width, height } = resizeFireworksCanvas();
  if (!width || !height) return;
  const ctx = pointsFireworks.getContext("2d");
  if (!ctx) return;
  const startAt = performance.now();
  const token = ++fireworksToken;
  const centerX = width / 2;
  const centerY = height / 2;
  const launchPlan = [
    { t: 40, s: 0.95 },
    { t: 280, s: 1.1 },
    { t: 560, s: 1.2 },
    { t: 860, s: 1.35 },
    { t: 1220, s: 1.05 },
    { t: 1620, s: 0.9 }
  ];
  let launchIdx = 0;
  let lastMs = startAt;

  const frame = (nowMs) => {
    if (token !== fireworksToken) return;
    const elapsed = nowMs - startAt;
    const dt = Math.max(0.008, Math.min(0.033, (nowMs - lastMs) / 1000));
    lastMs = nowMs;

    while (launchIdx < launchPlan.length && elapsed >= launchPlan[launchIdx].t) {
      spawnCenterBurst(centerX, centerY, nowMs, launchPlan[launchIdx].s);
      launchIdx += 1;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";
    fireworksParticles = fireworksParticles.filter((p) => {
      const age = nowMs - p.bornAt;
      const k = 1 - age / p.life;
      if (k <= 0) return false;
      p.vx *= 0.988;
      p.vy = p.vy * 0.988 + 0.07;
      p.x += p.vx * 60 * dt;
      p.y += p.vy * 60 * dt;
      const alpha = Math.max(0, Math.min(1, k));
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha * 0.9;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (0.58 + k * 0.7), 0, Math.PI * 2);
      ctx.fill();
      return true;
    });
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    if (elapsed < durationMs || fireworksParticles.length > 0) {
      fireworksRaf = requestAnimationFrame(frame);
      return;
    }
    stopPointsFireworks();
  };

  fireworksRaf = requestAnimationFrame(frame);
}

function playPointsGainEffect(amount, title = "本次") {
  if (!pointsGainFx || !amount || amount <= 0) return;
  runPointsFireworks(POINTS_FX_MS);
  pointsGainFx.textContent = `${title} +${amount} 分`;
  pointsGainFx.classList.remove("is-show");
  // Force reflow so repeated gains retrigger animation.
  void pointsGainFx.offsetWidth;
  pointsGainFx.classList.add("is-show");
  setTimeout(() => {
    pointsGainFx.classList.remove("is-show");
  }, POINTS_FX_MS);
}

function addPoints(amount) {
  if (!amount || amount <= 0) return;
  ensureWeeklyRewards();
  state.rewards.totalPoints += amount;
  state.rewards.weeklyPoints += amount;
  state.rewards.weeklyCorrect += 1;
  state.rewards.lastUpdatedAt = Date.now();
  saveRewards();
  refreshRewards();
}

function refreshRewards() {
  ensureWeeklyRewards();
  rewardText.textContent = `本周积分 ${state.rewards.weeklyPoints}（正确 ${state.rewards.weeklyCorrect} 次）｜总积分 ${state.rewards.totalPoints} ｜ 周期 ${getWeekRangeLabel(state.rewards.currentWeekKey)}`;
}

async function loadUserData() {
  const boot = await apiRequest("/api/bootstrap");
  if (boot.user && typeof boot.user === "object") {
    state.auth.role = boot.user.role || state.auth.role;
    state.auth.linkedParentUsername = String(boot.user.linkedParentUsername || "");
    state.auth.linkedChildren = Array.isArray(boot.user.linkedChildren) ? boot.user.linkedChildren : [];
    refreshUserBadgeText();
    saveSession();
  }
  const data = boot.data || {};
  applyLexiconOverrides(boot.lexiconOverrides || {});
  state.adminWordReviewDrafts = {};
  state.submissions = Array.isArray(boot.submissions)
    ? boot.submissions.map((row) => ({
        ...row,
        accuracyPercent: normalizeAccuracyPercent(row.accuracyPercent),
        wordCharResults: Array.isArray(row.wordCharResults)
          ? row.wordCharResults.map((x) => ({
              ...x,
              accuracyPercent: normalizeAccuracyPercent(x && x.accuracyPercent)
            }))
          : row.wordCharResults
      }))
    : [];
  state.progress = data.progress && typeof data.progress === "object" ? data.progress : {};
  state.wrongBook = Array.isArray(data.wrongBook) ? data.wrongBook : [];
  state.rewards =
    data.rewards && typeof data.rewards === "object"
      ? data.rewards
      : { totalPoints: 0, weeklyPoints: 0, weeklyCorrect: 0, currentWeekKey: "", lastUpdatedAt: Date.now() };
  const prefs = data.reviewPrefs && typeof data.reviewPrefs === "object" ? data.reviewPrefs : {};
  state.learnType = "char";
  state.reviewType = prefs.reviewType === "word" ? "word" : "char";
  state.reviewLevel = prefs.reviewLevel === "all" ? "all" : String(prefs.reviewLevel || "all");
  state.reviewCount = prefs.reviewCount === "all" ? "all" : String(prefs.reviewCount || "10");
  state.reviewWrongMixRatio = String(prefs.reviewWrongMixRatio || "30");
  state.reviewPreviewMode = String(prefs.reviewPreviewMode || "0");
  rebuildWrongQueue();
  refreshStats();
  refreshRewards();
  renderAdminPanel();
  renderAdminWrongBookPanel();
  renderAdminUsersPanel();
  renderAdminItemsPanel();
  renderUserRecords();
  if (isSuperAdmin(state.auth.role)) fetchAdminUsers();
  initWriteSelect();
  initLevelFilter();
  initReviewSettings();
  renderLearnCharList();
}

function renderWordCharResultsHtml(it, editable = false) {
  const wordResults = getWordCharResultsForRender(it);
  if (it.type !== "word" || !Array.isArray(wordResults) || wordResults.length === 0) return "";
  const blocks = wordResults
    .map((x, idx) => {
      const status = x.isGood ? "正确" : "错误";
      const img = x.handwritingImage ? `<img class="admin-img" src="${x.handwritingImage}" alt="词汇第${idx + 1}字手写图" />` : "";
      const toggle = editable
        ? `<div class="admin-char-row">
            <p class="admin-char-title">第${idx + 1}字「${x.char || "-"}」：${status}</p>
            <div class="actions">
              <button class="ghost admin-char-toggle ${x.isGood ? "is-good" : ""}" data-action="set-char-status" data-index="${idx}" data-value="true">判为正确</button>
              <button class="ghost admin-char-toggle ${!x.isGood ? "is-bad" : ""}" data-action="set-char-status" data-index="${idx}" data-value="false">判为错误</button>
            </div>
          </div>`
        : `<p>第${idx + 1}字「${x.char || "-"}」：${status}</p>`;
      return `<div class="word-char-result">${toggle}${img}</div>`;
    })
    .join("");
  const finalStatus = wordResults.every((x) => x.isGood) ? "正确" : "错误";
  return `<div class="word-char-results"><p class="word-char-summary">本词判定：${finalStatus}</p>${blocks}</div>`;
}

function ensureSubmissionWordCharResults(row) {
  if (!row || row.type !== "word") return;
  if (Array.isArray(row.wordCharResults) && row.wordCharResults.length > 0) return;
  const chars = [...String(row.target || "")];
  const legacyImages = String(row.handwritingImage || "")
    .split("||")
    .map((x) => x.trim())
    .filter(Boolean);
  row.wordCharResults = chars.map((ch, idx) => ({
    char: ch,
    isGood: Boolean(row.finalResult),
    accuracyPercent: 0,
    handwritingImage: legacyImages[idx] || ""
  }));
}

function getWordCharResultsForRender(row) {
  if (!row || row.type !== "word") return [];
  ensureSubmissionWordCharResults(row);
  const draft = state.adminWordReviewDrafts[row.id];
  if (Array.isArray(draft) && draft.length > 0) return draft;
  return row.wordCharResults || [];
}

function renderAdminPanel() {
  if (!canAccessReviewAudit(state.auth.role)) {
    adminCount.textContent = "记录：0 条";
    adminList.innerHTML = "<p>仅父母可查看。</p>";
    return;
  }
  const keyword = (adminUserFilter?.value || "").trim().toLowerCase();
  const range = adminTimeFilter?.value || "all";
  const now = Date.now();
  const rangeMs = range === "7" ? 7 * 24 * 60 * 60 * 1000 : range === "30" ? 30 * 24 * 60 * 60 * 1000 : 0;

  const rows = state.submissions
    .filter((x) => x && x.username)
    .filter((x) => (keyword ? String(x.username).toLowerCase().includes(keyword) : true))
    .filter((x) => (rangeMs ? now - Number(x.createdAt || 0) <= rangeMs : true))
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  adminCount.textContent = `记录：${rows.length} 条`;
  if (rows.length === 0) {
    adminList.innerHTML = "<p>暂无用户默写记录。</p>";
    return;
  }
  adminList.innerHTML = rows
    .map((it) => {
      ensureSubmissionWordCharResults(it);
      const displayWordResults = getWordCharResultsForRender(it);
      const status =
        it.type === "word" && displayWordResults.length > 0
          ? displayWordResults.every((x) => x.isGood)
            ? "正确"
            : "错误"
          : it.finalResult
            ? "正确"
            : "错误";
      const system = it.systemResult ? "正确" : "错误";
      const detail = it.type === "word" ? `逐字判定：${it.userAnswer || "-"}` : "";
      const img = it.type === "char" && it.handwritingImage ? `<img class=\"admin-img\" src=\"${it.handwritingImage}\" alt=\"手写图\" />` : "";
      const wordDetails = renderWordCharResultsHtml(it, true);
      const time = new Date(it.createdAt || Date.now()).toLocaleString();
      const actions =
        it.type === "word"
          ? `<button class="good" data-action="apply-char-review">保存本词判定</button>`
          : `<button class="good" data-action="mark-correct">判为正确</button>
             <button class="warn" data-action="mark-wrong">判为错误</button>`;
      return `<div class=\"admin-item\" data-id=\"${it.id}\">
        <p><strong>${it.username}</strong> · ${it.type === "word" ? "词汇" : "汉字"} · 目标：${it.target}</p>
        <p>系统判定：${system} ｜ 最终判定：${status}</p>
        <p>时间：${time}</p>
        ${detail ? `<p>${detail}</p>` : ""}
        ${img}
        ${wordDetails}
        <div class=\"actions\">
          ${actions}
        </div>
      </div>`;
    })
    .join("");
}

function renderAdminWrongBookPanel() {
  if (!isManagerRole(state.auth.role)) {
    if (adminWrongCount) adminWrongCount.textContent = t("adminWrong.count", { count: 0 });
    if (adminWrongList) adminWrongList.innerHTML = `<p>${t("adminWrong.onlyAdmin")}</p>`;
    if (adminWrongMsg) adminWrongMsg.textContent = "";
    return;
  }
  const items = Array.isArray(state.adminWrongBookItems) ? state.adminWrongBookItems : [];
  if (adminWrongCount) adminWrongCount.textContent = t("adminWrong.count", { count: items.length });
  if (adminWrongSearchUser) adminWrongSearchUser.value = state.adminWrongBookQueryUser || "";
  if (!adminWrongList) return;
  if (!state.adminWrongBookQueryUser) {
    adminWrongList.innerHTML = `<p>${t("adminWrong.promptQuery")}</p>`;
    return;
  }
  if (!items.length) {
    adminWrongList.innerHTML = `<p>${t("adminWrong.empty")}</p>`;
    return;
  }
  adminWrongList.innerHTML = items
    .map((it) => {
      return `<div class="admin-item">
        <div class="admin-wrong-row">
          <p><strong>${it.text || "-"}</strong></p>
          <button class="warn" data-action="delete-wrong-item" data-type="${it.type || "char"}" data-text="${it.text || ""}">${t("adminWrong.delete")}</button>
        </div>
      </div>`;
    })
    .join("");
}

async function fetchAdminUsers() {
  if (!isSuperAdmin(state.auth.role)) return;
  try {
    const resp = await apiRequest("/api/admin/users");
    state.adminUsers = Array.isArray(resp.users) ? resp.users : [];
    if (adminUsersMsg) adminUsersMsg.textContent = "";
    renderAdminUsersPanel();
  } catch (err) {
    state.adminUsers = [];
    if (adminUsersMsg) adminUsersMsg.textContent = err && err.message ? err.message : "加载用户列表失败";
    renderAdminUsersPanel();
  }
}

function renderAdminUsersPanel() {
  if (!adminUsersList || !adminUsersCount) return;
  if (!isSuperAdmin(state.auth.role)) {
    adminUsersCount.textContent = "用户：0 个";
    adminUsersList.innerHTML = "<tr><td colspan=\"5\">仅管理员可查看。</td></tr>";
    if (adminUsersMsg) adminUsersMsg.textContent = "";
    return;
  }
  const users = Array.isArray(state.adminUsers) ? state.adminUsers : [];
  adminUsersCount.textContent = `用户：${users.length} 个`;
  if (!users.length) {
    adminUsersList.innerHTML = "<tr><td colspan=\"5\">暂无用户。</td></tr>";
    return;
  }
  adminUsersList.innerHTML = users
    .map((u) => {
      const role = String(u.role || "");
      const relation =
        role === "child"
          ? u.linkedParentUsername
            ? `父母：${u.linkedParentUsername}`
            : "-"
          : role === "parent"
            ? Array.isArray(u.linkedChildren) && u.linkedChildren.length > 0
              ? `孩子：${u.linkedChildren.join("、")}`
              : "-"
            : "-";
      const time = u.createdAt ? new Date(u.createdAt).toLocaleString() : "-";
      const canDelete = role !== "admin" && u.username !== state.auth.username;
      return `<tr>
        <td>${escapeHtmlAttr(u.username || "-")}</td>
        <td>${escapeHtmlAttr(getRoleLabel(role))}</td>
        <td>${escapeHtmlAttr(relation)}</td>
        <td>${escapeHtmlAttr(time)}</td>
        <td><button class="${canDelete ? "warn" : "ghost"}" data-action="delete-user" data-username="${escapeHtmlAttr(u.username || "")}" ${canDelete ? "" : "disabled"}>删除</button></td>
      </tr>`;
    })
    .join("");
}

function getAdminEditableItems() {
  const merged = [...CHAR_ITEMS, ...WORD_ITEMS];
  const typeFilter = state.adminItemsTypeFilter || "all";
  const levelFilter = state.adminItemsLevelFilter || "all";
  const keyword = String(state.adminItemsSearch || "").trim().toLowerCase();
  return merged.filter((it) => {
    if (typeFilter !== "all" && it.type !== typeFilter) return false;
    if (levelFilter !== "all" && String(it.level) !== String(levelFilter)) return false;
    if (!keyword) return true;
    return (
      String(it.text || "").includes(keyword) ||
      String(it.pinyin || "").toLowerCase().includes(keyword) ||
      String(it.meaning || "").toLowerCase().includes(keyword)
    );
  });
}

function parseAdminItemKey(key) {
  const raw = String(key || "");
  if (!raw.includes(":")) return null;
  const [typeRaw, ...rest] = raw.split(":");
  return {
    key: raw,
    type: typeRaw === "word" ? "word" : "char",
    text: rest.join(":")
  };
}

function getAdminItemByKey(key) {
  const parsed = parseAdminItemKey(key);
  if (!parsed || !parsed.text) return null;
  const item = parsed.type === "word" ? WORD_MAP.get(parsed.text) : CHAR_MAP.get(parsed.text);
  return item && item.type === parsed.type ? item : null;
}

function getAdminDraftValue(key, field, fallback) {
  const draft = state.adminItemsDrafts && state.adminItemsDrafts[key];
  if (draft && Object.prototype.hasOwnProperty.call(draft, field)) return String(draft[field] || "");
  return String(fallback || "");
}

function isAdminItemDirty(key, item) {
  if (!key || !item) return false;
  const [prompt1, prompt2] = getPromptPhrases(item);
  const pinyinValue = getAdminDraftValue(key, "pinyin", item.pinyin || "").trim();
  const prompt1Value = getAdminDraftValue(key, "prompt1", prompt1 || "").trim();
  const prompt2Value = getAdminDraftValue(key, "prompt2", prompt2 || "").trim();
  return pinyinValue !== String(item.pinyin || "").trim() || prompt1Value !== String(prompt1 || "").trim() || prompt2Value !== String(prompt2 || "").trim();
}

function setAdminDraftField(key, field, value) {
  if (!key || !["pinyin", "prompt1", "prompt2"].includes(field)) return;
  const item = getAdminItemByKey(key);
  if (!item) return;
  const nextDraft = { ...(state.adminItemsDrafts[key] || {}) };
  nextDraft[field] = String(value || "");
  state.adminItemsDrafts[key] = nextDraft;
}

function clearAdminDraft(key) {
  if (!key || !state.adminItemsDrafts[key]) return;
  const next = { ...state.adminItemsDrafts };
  delete next[key];
  state.adminItemsDrafts = next;
}

function buildAdminOverridePayload(key) {
  const parsed = parseAdminItemKey(key);
  const item = getAdminItemByKey(key);
  if (!parsed || !item) return null;
  const [prompt1, prompt2] = getPromptPhrases(item);
  return {
    type: parsed.type,
    text: parsed.text,
    pinyin: getAdminDraftValue(key, "pinyin", item.pinyin || "").trim(),
    prompt1: getAdminDraftValue(key, "prompt1", prompt1 || "").trim(),
    prompt2: getAdminDraftValue(key, "prompt2", prompt2 || "").trim()
  };
}

function getDirtyAdminItemKeys() {
  return Object.keys(state.adminItemsDrafts || {}).filter((key) => isAdminItemDirty(key, getAdminItemByKey(key)));
}

function refreshAdminItemsDirtyUi() {
  const dirtyKeys = getDirtyAdminItemKeys();
  const dirtySet = new Set(dirtyKeys);
  const dirtyCount = dirtyKeys.length;
  if (adminItemsSaveAll) {
    adminItemsSaveAll.disabled = state.adminItemsSaving || dirtyCount === 0;
    adminItemsSaveAll.textContent = dirtyCount > 0 ? `批量保存（${dirtyCount}）` : "批量保存";
  }
  if (!adminItemsList) return;
  const rows = adminItemsList.querySelectorAll("tr[data-admin-key]");
  rows.forEach((row) => {
    const key = String(row.getAttribute("data-admin-key") || "");
    const dirty = dirtySet.has(key);
    row.classList.toggle("is-dirty", dirty);
    const rowSaveBtn = row.querySelector("button[data-action='save-admin-item']");
    if (rowSaveBtn) rowSaveBtn.disabled = state.adminItemsSaving || !dirty;
  });
  if (adminItemsMsg && !state.adminItemsSaving) {
    adminItemsMsg.textContent = dirtyCount > 0 ? `当前有 ${dirtyCount} 项未保存修改` : "";
  }
}

async function saveAdminItemOverrideByKey(key) {
  const payload = buildAdminOverridePayload(key);
  if (!payload || !payload.text) throw new Error("无效学习项");
  const resp = await apiRequest("/api/admin/learning-item-override", {
    method: "PUT",
    body: JSON.stringify(payload)
  });
  clearAdminDraft(key);
  return resp;
}

function escapeHtmlAttr(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderAdminItemsPanel() {
  if (!adminItemsList || !adminItemsCount) return;
  if (state.auth.role !== "admin") {
    adminItemsCount.textContent = "项目：0 条";
    adminItemsList.innerHTML = "<tr><td colspan=\"7\">仅管理员可查看。</td></tr>";
    if (adminItemsMsg) adminItemsMsg.textContent = "";
    return;
  }

  const levels = [...new Set([...CHAR_ITEMS, ...WORD_ITEMS].map((it) => Number(it.level) || 1))].sort((a, b) => a - b);
  if (adminItemsLevelFilter) {
    const levelOptions = [`<option value="all">全部</option>`, ...levels.map((lv) => `<option value="${lv}">HSK ${lv}</option>`)].join("");
    if (adminItemsLevelFilter.innerHTML !== levelOptions) adminItemsLevelFilter.innerHTML = levelOptions;
    adminItemsLevelFilter.value = state.adminItemsLevelFilter || "all";
  }
  if (adminItemsTypeFilter) adminItemsTypeFilter.value = state.adminItemsTypeFilter || "all";
  if (adminItemsSearch) adminItemsSearch.value = state.adminItemsSearch || "";

  const all = getAdminEditableItems();
  const pageSize = Math.max(1, Number(state.adminItemsPageSize) || 50);
  const totalPages = Math.max(1, Math.ceil(all.length / pageSize));
  state.adminItemsPage = Math.max(1, Math.min(state.adminItemsPage, totalPages));
  const start = (state.adminItemsPage - 1) * pageSize;
  const pageItems = all.slice(start, start + pageSize);
  adminItemsCount.textContent = `项目：${all.length} 条`;
  if (adminItemsPageSize) adminItemsPageSize.value = String(pageSize);
  if (adminItemsPageInfo) adminItemsPageInfo.textContent = `第 ${state.adminItemsPage} / ${totalPages} 页`;
  if (adminItemsPrev) adminItemsPrev.disabled = state.adminItemsPage <= 1;
  if (adminItemsNext) adminItemsNext.disabled = state.adminItemsPage >= totalPages;

  if (!pageItems.length) {
    adminItemsList.innerHTML = "<tr><td colspan=\"7\">没有匹配项目。</td></tr>";
    refreshAdminItemsDirtyUi();
    return;
  }

  adminItemsList.innerHTML = pageItems
    .map((it) => {
      const [prompt1, prompt2] = getPromptPhrases(it);
      const key = `${it.type}:${it.text}`;
      const dirty = isAdminItemDirty(key, it);
      const pinyinValue = getAdminDraftValue(key, "pinyin", it.pinyin || "");
      const prompt1Value = getAdminDraftValue(key, "prompt1", prompt1 || "");
      const prompt2Value = getAdminDraftValue(key, "prompt2", prompt2 || "");
      return `<tr data-admin-key="${escapeHtmlAttr(key)}" class="${dirty ? "is-dirty" : ""}">
        <td class="${it.type === "char" ? "char-cell" : ""}">${it.text}</td>
        <td>${it.type === "word" ? "词汇" : "汉字"}</td>
        <td>${it.level}</td>
        <td><input data-admin-item="pinyin" data-key="${key}" value="${escapeHtmlAttr(pinyinValue)}" /></td>
        <td><input data-admin-item="prompt1" data-key="${key}" value="${escapeHtmlAttr(prompt1Value)}" /></td>
        <td><input data-admin-item="prompt2" data-key="${key}" value="${escapeHtmlAttr(prompt2Value)}" /></td>
        <td><button class="good" data-action="save-admin-item" data-key="${key}" ${state.adminItemsSaving || !dirty ? "disabled" : ""}>保存</button></td>
      </tr>`;
    })
    .join("");
  refreshAdminItemsDirtyUi();
}

async function queryAdminWrongBook(username) {
  const name = String(username || "").trim();
  if (!name) {
    if (adminWrongMsg) adminWrongMsg.textContent = t("adminWrong.enterUsername");
    return;
  }
  try {
    const resp = await apiRequest(`/api/admin/users/${encodeURIComponent(name)}/wrong-book`);
    state.adminWrongBookQueryUser = name;
    state.adminWrongBookItems = Array.isArray(resp.wrongBook) ? resp.wrongBook : [];
    if (adminWrongMsg) adminWrongMsg.textContent = t("adminWrong.queryOk", { username: name });
    renderAdminWrongBookPanel();
  } catch (err) {
    state.adminWrongBookQueryUser = "";
    state.adminWrongBookItems = [];
    if (adminWrongMsg) adminWrongMsg.textContent = err && err.message ? err.message : t("adminWrong.queryFailed");
    renderAdminWrongBookPanel();
  }
}

function renderUserRecords() {
  if (!state.auth.username || !isLearnerRole(state.auth.role)) {
    recordsCount.textContent = "记录：0 条";
    recordsStats.innerHTML = "<p>仅父母或孩子可查看自己的统计。</p>";
    recordsList.innerHTML = "<p>仅父母或孩子可查看自己的记录。</p>";
    return;
  }
  const rows = state.submissions
    .filter((x) => x && x.username === state.auth.username)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  renderUserRecordStats(rows);
  recordsCount.textContent = `记录：${rows.length} 条`;
  if (rows.length === 0) {
    recordsList.innerHTML = "<p>你还没有默写记录。</p>";
    return;
  }
  recordsList.innerHTML = rows
    .map((it) => {
      ensureSubmissionWordCharResults(it);
      const status = it.finalResult ? "正确" : "错误";
      const system = it.systemResult ? "正确" : "错误";
      const reviewed = it.reviewedBy ? `（审核人 ${it.reviewedBy} 已复判）` : "";
      const detail = it.type === "word" ? `逐字判定：${it.userAnswer || "-"}` : "";
      const img = it.type === "char" && it.handwritingImage ? `<img class=\"admin-img\" src=\"${it.handwritingImage}\" alt=\"手写图\" />` : "";
      const wordDetails = renderWordCharResultsHtml(it, false);
      const time = new Date(it.createdAt || Date.now()).toLocaleString();
      return `<div class=\"admin-item\">
        <p>${it.type === "word" ? "词汇" : "汉字"} · 目标：${it.target}</p>
        <p>系统判定：${system} ｜ 最终判定：${status}${reviewed}</p>
        <p>时间：${time}</p>
        ${detail ? `<p>${detail}</p>` : ""}
        ${img}
        ${wordDetails}
      </div>`;
    })
    .join("");
}

function renderUserRecordStats(rows) {
  const total = rows.length;
  const correct = rows.filter((x) => x.finalResult).length;
  const wrong = total - correct;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  const charRows = rows.filter((x) => x.type === "char");
  const wordRows = rows.filter((x) => x.type === "word");
  const charCorrect = charRows.filter((x) => x.finalResult).length;
  const wordCorrect = wordRows.filter((x) => x.finalResult).length;
  const charAccuracy = charRows.length > 0 ? Math.round((charCorrect / charRows.length) * 100) : 0;
  const wordAccuracy = wordRows.length > 0 ? Math.round((wordCorrect / wordRows.length) * 100) : 0;

  const nowTs = Date.now();
  const within7d = rows.filter((x) => nowTs - Number(x.createdAt || 0) <= 7 * 24 * 60 * 60 * 1000);
  const within30d = rows.filter((x) => nowTs - Number(x.createdAt || 0) <= 30 * 24 * 60 * 60 * 1000);
  const within7dCorrect = within7d.filter((x) => x.finalResult).length;
  const within30dCorrect = within30d.filter((x) => x.finalResult).length;
  const acc7d = within7d.length > 0 ? Math.round((within7dCorrect / within7d.length) * 100) : 0;
  const acc30d = within30d.length > 0 ? Math.round((within30dCorrect / within30d.length) * 100) : 0;

  const latestTs = rows[0] && rows[0].createdAt ? Number(rows[0].createdAt) : 0;
  const latestText = latestTs ? new Date(latestTs).toLocaleString() : "-";
  recordsStats.innerHTML = [
    { label: "总默写次数", value: `${total}` },
    { label: "总正确率", value: `${accuracy}%` },
    { label: "正确 / 错误", value: `${correct} / ${wrong}` },
    { label: "汉字正确率", value: `${charAccuracy}% (${charCorrect}/${charRows.length})` },
    { label: "词汇正确率", value: `${wordAccuracy}% (${wordCorrect}/${wordRows.length})` },
    { label: "最近7天", value: `${within7d.length} 次 · ${acc7d}%` },
    { label: "最近30天", value: `${within30d.length} 次 · ${acc30d}%` },
    { label: "最近一次默写", value: latestText }
  ]
    .map((it) => `<div class="records-stat"><p class="label">${it.label}</p><p class="value">${it.value}</p></div>`)
    .join("");
}

function updateUserRewardsFromReview(username, pointsDelta, correctDelta) {
  return { username, pointsDelta, correctDelta };
}

function updateUserWrongBookFromReview(username, row, isCorrect) {
  return { username, row, isCorrect };
}

async function setAuthState(username, role, token, profile = {}) {
  state.auth.username = username;
  state.auth.role = role;
  state.auth.token = token;
  state.auth.linkedParentUsername = String(profile.linkedParentUsername || "");
  state.auth.linkedChildren = Array.isArray(profile.linkedChildren) ? profile.linkedChildren : [];
  state.auth.loggedIn = true;
  saveSession();
  authScreen.classList.add("hidden");
  appShell.classList.remove("hidden");
  refreshUserBadgeText();
  const manager = isManagerRole(role);
  const superAdmin = isSuperAdmin(role);
  const reviewAuditor = canAccessReviewAudit(role);
  rewardText.classList.toggle("hidden", manager);
  statsText.classList.toggle("hidden", manager);
  learnTabBtn.classList.toggle("hidden", manager);
  writeTabBtn.classList.toggle("hidden", manager);
  reviewTabBtn.classList.toggle("hidden", manager);
  wrongTabBtn.classList.toggle("hidden", manager);
  recordsTab.classList.toggle("hidden", manager);
  adminTab.classList.toggle("hidden", !reviewAuditor);
  if (adminUsersTab) adminUsersTab.classList.toggle("hidden", !superAdmin);
  if (adminWrongTab) adminWrongTab.classList.toggle("hidden", !manager);
  if (adminItemsTab) adminItemsTab.classList.toggle("hidden", !superAdmin);
  if (!manager && (state.tab === "admin" || state.tab === "admin-users" || state.tab === "admin-wrong" || state.tab === "admin-items")) {
    state.tab = "learn";
  }
  if (!reviewAuditor && state.tab === "admin") {
    state.tab = superAdmin ? "admin-users" : "admin-wrong";
  }
  if (reviewAuditor) switchTab("admin");
  else if (superAdmin) switchTab("admin-users");
  else if (manager) switchTab("admin-wrong");
  else switchTab("learn");
  await loadUserData();
  renderReviewCard();
  renderAdminPanel();
  renderAdminWrongBookPanel();
  renderAdminUsersPanel();
  renderAdminItemsPanel();
  renderUserRecords();
  if (superAdmin) fetchAdminUsers();
}

async function logout() {
  if (state.reviewActive || state.reviewPreviewRunning) {
    const ok = window.confirm("正在默写中。退出登录将取消本轮默写且数据不保存，是否继续？");
    if (!ok) return;
    cancelReviewSessionWithoutSave();
  }
  try {
    if (state.auth.token) await apiRequest("/api/logout", { method: "POST" });
  } catch (err) {
    console.warn("logout failed:", err && err.message ? err.message : err);
  }
  state.auth = { loggedIn: false, role: "", username: "", token: "", linkedParentUsername: "", linkedChildren: [] };
  state.adminWordReviewDrafts = {};
  state.adminWrongBookQueryUser = "";
  state.adminWrongBookItems = [];
  state.adminUsers = [];
  clearSession();
  statsText.classList.remove("hidden");
  rewardText.classList.remove("hidden");
  appShell.classList.add("hidden");
  authScreen.classList.remove("hidden");
  authMsg.textContent = t("auth.loggedOut");
  refreshUserBadgeText();
}

function switchAuthMode(mode) {
  const isLogin = mode === "login";
  authTabLogin.classList.toggle("good", isLogin);
  authTabLogin.classList.toggle("ghost", !isLogin);
  authTabRegister.classList.toggle("good", !isLogin);
  authTabRegister.classList.toggle("ghost", isLogin);
  authPasswordConfirmRow.classList.toggle("hidden", isLogin);
  if (authRoleRow) authRoleRow.classList.toggle("hidden", isLogin);
  authLogin.classList.toggle("hidden", !isLogin);
  authRegister.classList.toggle("hidden", isLogin);
  authPassword.type = "password";
  authPasswordConfirm.type = "password";
  if (authRoleSelect && (!authRoleSelect.value || !["parent", "child"].includes(authRoleSelect.value))) authRoleSelect.value = "child";
  refreshAuthRegisterRoleUi();
  updateAuthTogglePasswordLabel();
  authMsg.textContent = "";
}

function refreshAuthRegisterRoleUi() {
  const isRegister = !authRegister.classList.contains("hidden");
  const role = authRoleSelect ? authRoleSelect.value : "child";
  const showParentRow = isRegister && role === "child";
  if (authParentUsernameRow) authParentUsernameRow.classList.toggle("hidden", !showParentRow);
  if (!showParentRow && authParentUsername) authParentUsername.value = "";
}

function setAuthPending(pending, mode = "login") {
  const isLogin = mode === "login";
  authUsername.disabled = pending;
  authPassword.disabled = pending;
  authPasswordConfirm.disabled = pending;
  if (authRoleSelect) authRoleSelect.disabled = pending;
  if (authParentUsername) authParentUsername.disabled = pending;
  authTabLogin.disabled = pending;
  authTabRegister.disabled = pending;
  authTogglePassword.disabled = pending;
  authLogin.disabled = pending;
  authRegister.disabled = pending;
  authLogin.textContent = pending && isLogin ? t("auth.loggingIn") : t("auth.login");
  authRegister.textContent = pending && !isLogin ? t("auth.registering") : t("auth.register");
}

async function handleLogin() {
  if (authLogin.disabled) return;
  const username = authUsername.value.trim();
  const password = authPassword.value;
  if (!username || !password) {
    authMsg.textContent = t("auth.enterUsernamePassword");
    return;
  }
  setAuthPending(true, "login");
  try {
    const resp = await apiRequest("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    });
    authMsg.textContent = "";
    await setAuthState(resp.user.username, resp.user.role, resp.token, resp.user || {});
  } catch (err) {
    authMsg.textContent = err && err.message ? err.message : t("auth.loginFailed");
  } finally {
    setAuthPending(false, "login");
  }
}

async function handleRegister() {
  if (authRegister.disabled) return;
  const username = authUsername.value.trim();
  const password = authPassword.value;
  const confirm = authPasswordConfirm.value;
  const role = authRoleSelect ? authRoleSelect.value : "child";
  const linkedParentUsername = authParentUsername ? authParentUsername.value.trim() : "";
  if (!username || !password || !confirm) {
    authMsg.textContent = t("auth.fillAllFields");
    return;
  }
  if (!["parent", "child"].includes(role)) {
    authMsg.textContent = t("auth.fillAllFields");
    return;
  }
  if (password !== confirm) {
    authMsg.textContent = t("auth.passwordNotMatch");
    return;
  }
  if (role === "child" && !linkedParentUsername) {
    authMsg.textContent = t("auth.needParentUsername");
    return;
  }
  setAuthPending(true, "register");
  try {
    await apiRequest("/api/register", {
      method: "POST",
      body: JSON.stringify({ username, password, role, linkedParentUsername })
    });
    authMsg.textContent = t("auth.registerSuccess");
    authPassword.value = "";
    authPasswordConfirm.value = "";
    if (authParentUsername) authParentUsername.value = "";
    if (authRoleSelect) authRoleSelect.value = "child";
    switchAuthMode("login");
  } catch (err) {
    authMsg.textContent = err && err.message ? err.message : t("auth.registerFailed");
  } finally {
    setAuthPending(false, "register");
  }
}

function recordSubmission(item, isGood, accuracyPercent, meta = {}) {
  if (!isLearnerRole(state.auth.role) || !state.auth.username) return;
  const points = meta.points ?? (item.type === "word" ? 10 : 8);
  const payload = {
    username: state.auth.username,
    type: item.type,
    target: item.text,
    pinyin: item.pinyin || "",
    userAnswer: meta.userAnswer || "",
    handwritingImage: meta.handwritingImage || "",
    accuracyPercent: normalizeAccuracyPercent(accuracyPercent),
    systemResult: Boolean(isGood),
    finalResult: Boolean(isGood),
    pointsAwarded: points,
    wordCharResults: Array.isArray(meta.wordCharResults) ? meta.wordCharResults : []
  };
  if (state.reviewDraftActive) {
    state.pendingSubmissionPayloads.push(payload);
    return;
  }
  postSubmissionPayload(payload)
    .then(() => {
      renderUserRecords();
      renderAdminPanel();
    })
    .catch((err) => {
      console.warn("record submission failed:", err && err.message ? err.message : err);
    });
}

function makeItemKey(item) {
  return `${item.type}:${item.text}`;
}

function getProgress(item) {
  const key = makeItemKey(item);
  if (!state.progress[key]) {
    state.progress[key] = {
      streak: 0,
      success: 0,
      attempts: 0,
      nextReviewAt: Date.now(),
      lastAttemptAt: 0,
      lastResult: null,
      intervalDays: 1
    };
  }
  const p = state.progress[key];
  if (typeof p.streak !== "number") p.streak = 0;
  if (typeof p.success !== "number") p.success = 0;
  if (typeof p.attempts !== "number") p.attempts = 0;
  if (typeof p.nextReviewAt !== "number") p.nextReviewAt = Date.now();
  if (typeof p.lastAttemptAt !== "number") p.lastAttemptAt = 0;
  if (typeof p.intervalDays !== "number" || !Number.isFinite(p.intervalDays) || p.intervalDays <= 0) p.intervalDays = 1;
  if (typeof p.lastResult !== "boolean") p.lastResult = null;
  return state.progress[key];
}

function scheduleProgress(item, isGood) {
  const p = getProgress(item);
  const now = Date.now();
  p.attempts += 1;
  p.success += isGood ? 1 : 0;
  p.streak = isGood ? p.streak + 1 : 0;
  p.lastAttemptAt = now;
  p.lastResult = Boolean(isGood);

  // 记忆曲线：答对后逐步拉长复习间隔，答错后缩短到1天。
  if (isGood) {
    const accuracy = p.attempts > 0 ? p.success / p.attempts : 1;
    const growth = 1.7 + Math.min(0.8, p.streak * 0.06) + Math.max(0, (accuracy - 0.6) * 0.6);
    p.intervalDays = Math.min(45, Math.max(1, Math.round(p.intervalDays * growth)));
  } else {
    p.intervalDays = 1;
  }
  p.nextReviewAt = now + p.intervalDays * 24 * 60 * 60 * 1000;
  saveProgress();
}

function getDataset(type) {
  return type === "word" ? WORD_ITEMS : CHAR_ITEMS;
}

function currentLearnList() {
  const source = getDataset(state.learnType);
  if (state.level === "all") return source;
  return source.filter((it) => String(it.level) === state.level);
}

function pickRandomLearnIndex(listLength, currentIndex) {
  if (listLength <= 1) return 0;
  let next = currentIndex;
  let guard = 0;
  while (next === currentIndex && guard < 12) {
    next = Math.floor(Math.random() * listLength);
    guard += 1;
  }
  return next;
}

function moveLearn(step) {
  const list = currentLearnList();
  if (!list.length) return;
  if (state.learnRandomMode) {
    state.learnIndex = pickRandomLearnIndex(list.length, state.learnIndex);
  } else {
    state.learnIndex = Math.max(0, Math.min(list.length - 1, state.learnIndex + step));
  }
  renderLearnCard();
}

let cachedZhVoice = null;
let speechSeqToken = 0;
const POINTS_FX_MS = 2400;

function getChineseVoice() {
  if (!("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  if (!voices.length) return null;
  if (cachedZhVoice && voices.some((v) => v.voiceURI === cachedZhVoice.voiceURI)) return cachedZhVoice;
  const zhVoices = voices.filter((v) => /^zh\b/i.test(String(v.lang || "")));
  if (!zhVoices.length) return null;
  const preferKeywords = [
    "xiaoxiao",
    "xiaoyi",
    "xiaomo",
    "yunxi",
    "tingting",
    "huihui",
    "kangkang",
    "sin-ji",
    "mei-jia",
    "hanhan"
  ];
  const scoreVoice = (v) => {
    const name = String(v.name || "").toLowerCase();
    const lang = String(v.lang || "").toLowerCase();
    let score = 0;
    if (lang.includes("zh-cn")) score += 45;
    else if (lang.includes("zh-hans")) score += 36;
    else if (lang.includes("zh")) score += 28;
    if (v.localService) score += 12;
    const idx = preferKeywords.findIndex((x) => name.includes(x));
    if (idx !== -1) score += 30 - idx;
    return score;
  };
  cachedZhVoice = zhVoices
    .slice()
    .sort((a, b) => scoreVoice(b) - scoreVoice(a))[0];
  return cachedZhVoice || null;
}

function buildChineseUtterance(text, { rate = 0.88, pitch = 1, volume = 1 } = {}) {
  const utter = new SpeechSynthesisUtterance(String(text || ""));
  const voice = getChineseVoice();
  utter.lang = voice && voice.lang ? voice.lang : "zh-CN";
  if (voice) utter.voice = voice;
  utter.rate = rate;
  utter.pitch = pitch;
  utter.volume = volume;
  return utter;
}

function clampNumber(num, min, max) {
  return Math.max(min, Math.min(max, num));
}

function humanizeValue(base, jitter, min, max) {
  const rand = (Math.random() * 2 - 1) * Math.max(0, jitter || 0);
  return clampNumber(base + rand, min, max);
}

function splitSpeechText(text) {
  const value = String(text || "").trim();
  if (!value) return [];
  return value
    .split(/[，,、；;。！？!?\s]+/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function speakChineseSegments(segments, { cancel = true } = {}) {
  if (!("speechSynthesis" in window)) return;
  const rawItems = (Array.isArray(segments) ? segments : [])
    .map((it) => ({
      text: String((it && it.text) || "").trim(),
      rate: Number(it && it.rate),
      pitch: Number(it && it.pitch),
      volume: Number(it && it.volume),
      pauseMs: Number(it && it.pauseMs),
      split: Boolean(it && it.split)
    }))
    .filter((it) => it.text);
  const items = [];
  rawItems.forEach((it) => {
    if (!it.split) {
      items.push(it);
      return;
    }
    const parts = splitSpeechText(it.text);
    if (!parts.length) return;
    parts.forEach((part, idx) => {
      items.push({
        ...it,
        text: part,
        pauseMs: idx < parts.length - 1 ? Math.max(90, Number(it.pauseMs) || 140) : Number(it.pauseMs)
      });
    });
  });
  if (!items.length) return;
  if (cancel) window.speechSynthesis.cancel();
  const token = ++speechSeqToken;
  const speakNext = (idx) => {
    if (token !== speechSeqToken || idx >= items.length) return;
    const cur = items[idx];
    const baseRate = Number.isFinite(cur.rate) ? cur.rate : 0.88;
    const basePitch = Number.isFinite(cur.pitch) ? cur.pitch : 1;
    const baseVolume = Number.isFinite(cur.volume) ? cur.volume : 1;
    const utter = buildChineseUtterance(cur.text, {
      // slight random variation makes TTS sound less mechanical.
      rate: humanizeValue(baseRate, 0.02, 0.72, 1.02),
      pitch: humanizeValue(basePitch, 0.04, 0.86, 1.18),
      volume: humanizeValue(baseVolume, 0.03, 0.85, 1)
    });
    utter.onend = () => {
      if (token !== speechSeqToken) return;
      const delay = Number.isFinite(cur.pauseMs) ? Math.max(0, cur.pauseMs) : 120;
      window.setTimeout(() => speakNext(idx + 1), delay);
    };
    window.speechSynthesis.speak(utter);
  };
  speakNext(0);
}

function initSpeechEngine() {
  if (!("speechSynthesis" in window)) return;
  getChineseVoice();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedZhVoice = null;
    getChineseVoice();
  };
}

function speakLearnItem(item) {
  if (!("speechSynthesis" in window) || !item) return;
  speakChineseSegments(
    [
      {
        text: String(item.text || ""),
        rate: 0.78,
        pitch: 1.04,
        pauseMs: 170,
        split: true
      }
    ],
    { cancel: true }
  );
}

function applyReviewSettings(list) {
  const levelFiltered =
    state.reviewLevel === "all" ? list : list.filter((it) => String(it.level) === state.reviewLevel);
  if (state.reviewCount === "all") return levelFiltered;
  const limit = Number(state.reviewCount) || 10;
  return levelFiltered.slice(0, limit);
}

function shuffleList(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function weightedSampleWithoutReplacement(list, count, getWeight) {
  const pool = [...list];
  const result = [];
  const target = Math.max(0, Math.min(count, pool.length));
  while (result.length < target && pool.length > 0) {
    const weights = pool.map((it) => {
      const value = Number(getWeight(it));
      return Number.isFinite(value) ? Math.max(0.01, value) : 0.01;
    });
    const total = weights.reduce((sum, x) => sum + x, 0);
    if (!Number.isFinite(total) || total <= 0) {
      result.push(...shuffleList(pool).slice(0, target - result.length));
      break;
    }
    let r = Math.random() * total;
    let idx = 0;
    for (; idx < pool.length; idx += 1) {
      r -= weights[idx];
      if (r <= 0) break;
    }
    const pickIdx = Math.min(idx, pool.length - 1);
    result.push(pool[pickIdx]);
    pool.splice(pickIdx, 1);
  }
  return result;
}

function buildMemoryCurveWeight(item, context = {}) {
  const dayMs = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const p = getProgress(item);
  const attempts = Math.max(0, Number(p.attempts) || 0);
  const success = Math.max(0, Number(p.success) || 0);
  const streak = Math.max(0, Number(p.streak) || 0);
  const accuracy = attempts > 0 ? success / attempts : 0;
  const nextReviewAt = Number(p.nextReviewAt) || now;
  const lastAttemptAt = Number(p.lastAttemptAt) || 0;
  const overdueDays = Math.max(0, (now - nextReviewAt) / dayMs);
  const lastSeenGapDays = lastAttemptAt > 0 ? Math.max(0, (now - lastAttemptAt) / dayMs) : 30;

  const newItemBoost = attempts === 0 ? 2.4 : 1;
  const difficultyBoost = 1 + (1 - accuracy) * 2.2;
  const overdueBoost = 1 + Math.min(3.2, overdueDays * 0.4);
  const gapBoost = 0.7 + Math.min(2.3, lastSeenGapDays * 0.08);
  const recentFailBoost = p.lastResult === false ? 1.7 : 1;
  const stablePenalty = 1 / (1 + Math.min(8, streak) * 0.16);
  const wrongBookBoost = context.inWrongBook ? 1.35 : 1;

  const weight =
    newItemBoost * difficultyBoost * overdueBoost * gapBoost * recentFailBoost * stablePenalty * wrongBookBoost;
  return Math.max(0.05, Math.min(60, weight));
}

function buildReviewSessionList(source) {
  const typed = source.filter((it) => it.type === state.reviewType);
  const levelFiltered =
    state.reviewLevel === "all" ? typed : typed.filter((it) => String(it.level) === state.reviewLevel);
  const uniqueByKey = (arr) => {
    const map = new Map();
    arr.forEach((it) => map.set(makeItemKey(it), it));
    return [...map.values()];
  };

  if (state.reviewType !== "char") {
    const weightedPool = uniqueByKey(levelFiltered);
    if (state.reviewCount === "all") {
      return weightedSampleWithoutReplacement(weightedPool, weightedPool.length, (it) => buildMemoryCurveWeight(it));
    }
    const limit = Number(state.reviewCount) || 10;
    return weightedSampleWithoutReplacement(weightedPool, limit, (it) => buildMemoryCurveWeight(it));
  }

  const wrongChars = uniqueByKey(
    state.wrongBook
      .filter((x) => x.type === "char")
      .map((x) => CHAR_MAP.get(x.text))
      .filter(Boolean)
      .filter((it) => (state.reviewLevel === "all" ? true : String(it.level) === state.reviewLevel))
  );

  const base = uniqueByKey(levelFiltered);
  const exclude = new Set();
  const ratioPercent = Math.max(0, Math.min(100, Number(state.reviewWrongMixRatio) || 0));
  const ratio = ratioPercent / 100;
  const wrongSet = new Set(wrongChars.map((it) => makeItemKey(it)));
  const weighted = (it) => buildMemoryCurveWeight(it, { inWrongBook: wrongSet.has(makeItemKey(it)) });

  if (state.reviewCount === "all") {
    const merged = uniqueByKey([...base, ...wrongChars]);
    return weightedSampleWithoutReplacement(merged, merged.length, weighted);
  }

  const limit = Number(state.reviewCount) || 10;
  let wrongQuota = Math.floor(limit * ratio);
  if (ratio > 0 && wrongQuota === 0) wrongQuota = 1;
  wrongQuota = Math.min(limit, wrongChars.length, Math.max(0, wrongQuota));
  const selectedWrong = weightedSampleWithoutReplacement(wrongChars, wrongQuota, weighted);
  selectedWrong.forEach((it) => exclude.add(makeItemKey(it)));

  const normalPool = base.filter((it) => !exclude.has(makeItemKey(it)));
  const selectedNormal = weightedSampleWithoutReplacement(normalPool, Math.max(0, limit - selectedWrong.length), weighted);
  const merged = uniqueByKey([...selectedNormal, ...selectedWrong]);
  return weightedSampleWithoutReplacement(merged, Math.min(limit, merged.length), weighted);
}

function currentReviewItem() {
  return state.reviewList[state.reviewIndex] || null;
}

function clearAdvanceTimer() {
  if (state.advanceTimer) {
    clearTimeout(state.advanceTimer);
    state.advanceTimer = null;
  }
}

function clearReviewPreviewTimer() {
  if (state.reviewPreviewTimer) {
    clearTimeout(state.reviewPreviewTimer);
    state.reviewPreviewTimer = null;
  }
}

function clearReviewPreviewCountdownTimer() {
  if (state.reviewPreviewCountdownTimer) {
    clearInterval(state.reviewPreviewCountdownTimer);
    state.reviewPreviewCountdownTimer = null;
  }
}

function resetPreviewTimerUi() {
  if (reviewPreviewTimer) reviewPreviewTimer.classList.add("is-hidden");
  if (reviewPreviewTimeText) reviewPreviewTimeText.textContent = "倒计时 0.0 秒";
  if (reviewPreviewProgressBar) reviewPreviewProgressBar.style.width = "100%";
}

function stopReviewPreviewSequence() {
  state.reviewPreviewToken += 1;
  state.reviewPreviewRunning = false;
  clearReviewPreviewTimer();
  clearReviewPreviewCountdownTimer();
  resetPreviewTimerUi();
  if (reviewPreview) {
    reviewPreview.textContent = "";
    reviewPreview.classList.add("is-hidden");
  }
}

function getDefaultPromptPair(item) {
  if (!item) return ["", ""];
  if (item.type === "word") {
    const a = item.text || "";
    const b = item.meaning || item.text || "";
    return [a, b];
  }
  const list = CHAR_PHRASE_MAP.get(item.text) || [];
  const first = list[0] || item.phrase || item.text || "";
  const second = list[1] || item.phrase || `${item.text || ""}${item.text || ""}`;
  return [first, second];
}

function applyLexiconOverrides(overrides) {
  const map = overrides && typeof overrides === "object" ? overrides : {};
  state.lexiconOverrides = map;

  CHAR_ITEMS.forEach((item) => {
    const base = BASE_ITEM_SNAPSHOT.get(`char:${item.text}`) || { pinyin: item.pinyin || "", prompt1: "", prompt2: "" };
    item.pinyin = base.pinyin || item.pinyin || "-";
    item.prompt1 = base.prompt1 || "";
    item.prompt2 = base.prompt2 || "";
  });
  WORD_ITEMS.forEach((item) => {
    const base = BASE_ITEM_SNAPSHOT.get(`word:${item.text}`) || { pinyin: item.pinyin || "", prompt1: "", prompt2: "" };
    item.pinyin = base.pinyin || item.pinyin || "-";
    item.prompt1 = base.prompt1 || "";
    item.prompt2 = base.prompt2 || "";
  });

  Object.values(map).forEach((x) => {
    if (!x || !x.text) return;
    const type = x.type === "word" ? "word" : "char";
    const item = type === "word" ? WORD_MAP.get(x.text) : CHAR_MAP.get(x.text);
    if (!item) return;
    if (typeof x.pinyin === "string" && x.pinyin.trim()) item.pinyin = x.pinyin.trim();
    if (typeof x.prompt1 === "string") item.prompt1 = x.prompt1.trim();
    if (typeof x.prompt2 === "string") item.prompt2 = x.prompt2.trim();
  });
}

function getPromptPhrases(item) {
  const [base1, base2] = getDefaultPromptPair(item);
  return [item && item.prompt1 ? item.prompt1 : base1, item && item.prompt2 ? item.prompt2 : base2];
}

function refreshStats() {
  const all = CHAR_ITEMS.length + WORD_ITEMS.length;
  const seen = Object.keys(state.progress).length;
  const mastered = Object.values(state.progress).filter((x) => x && x.success >= 3).length;
  statsText.textContent = `已接触 ${seen}/${all} 项（字+词），稳定掌握 ${mastered} 项，错题 ${state.wrongBook.length} 个`;
}

function initLevelFilter() {
  const levels = [...new Set(CHAR_ITEMS.concat(WORD_ITEMS).map((it) => it.level))].sort((a, b) => a - b);
  levelFilter.innerHTML = [`<option value="all">全部</option>`, ...levels.map((lv) => `<option value="${lv}">HSK ${lv}</option>`)].join("");
  levelFilter.value = state.level;
}

function initWriteSelect() {
  writeSelect.innerHTML = CHAR_ITEMS.map(
    (it) => `<option value="${it.text}">HSK${it.level} · ${it.text} · ${it.pinyin}</option>`
  ).join("");
  updateWriteTarget(writeSelect.value || CHAR_ITEMS[0].text);
}

function setWriteBatchPlaying(playing) {
  state.writeBatchPlaying = Boolean(playing);
  if (writeListPlaySelected) {
    const selectedCount = (state.writeSelectedChars || []).length;
    writeListPlaySelected.disabled = state.writeBatchPlaying || selectedCount === 0;
  }
  if (writeListStopPlay) writeListStopPlay.disabled = !state.writeBatchPlaying;
}

function getLearnSelectedCharItems() {
  const keys = Array.isArray(state.learnSelectedKeys) ? state.learnSelectedKeys : [];
  const chars = [];
  const seen = new Set();
  keys.forEach((key) => {
    const [type, ...rest] = String(key || "").split(":");
    if (type !== "char") return;
    const text = rest.join(":");
    const item = CHAR_MAP.get(text);
    if (!item || seen.has(item.text)) return;
    seen.add(item.text);
    chars.push(item);
  });
  return chars;
}

function getWriteNavigationItems() {
  const selectedChars = getLearnSelectedCharItems();
  return selectedChars.length ? selectedChars : CHAR_ITEMS;
}

function updateWriteNavButtons() {
  const list = getWriteNavigationItems();
  const disabled = list.length <= 1;
  if (writePrevChar) writePrevChar.disabled = disabled;
  if (writeNextChar) writeNextChar.disabled = disabled;
}

function moveWriteTarget(step) {
  const list = getWriteNavigationItems();
  if (!list.length) return;
  const current = writeSelect.value;
  let index = list.findIndex((it) => it.text === current);
  if (index < 0) index = 0;
  else index = (index + step + list.length) % list.length;
  const next = list[index];
  if (!next) return;
  writeSelect.value = next.text;
  updateWriteTarget(next.text);
  playStrokeDemo(true);
  writeFeedback.textContent = `已切换到“${next.text}”。`;
}

function syncWriteListFromLearnSelection(options = {}) {
  const sourceSet = new Set(getLearnSelectedCharItems().map((it) => it.text));
  const prev = Array.isArray(state.writeSelectedChars) ? state.writeSelectedChars : [];
  const next = prev.filter((ch) => sourceSet.has(ch));
  if (next.length !== prev.length) state.writeSelectedChars = next;
  if (options && options.resetPage) state.writeListPage = 1;
  if (!sourceSet.size && state.writeBatchPlaying) stopWriteBatchDemo();
  renderWriteCharList();
  updateWriteNavButtons();
}

function renderWriteCharList() {
  if (!writeCharList || !writeListSummary) return;
  const keyword = String(state.writeListSearch || "").trim().toLowerCase();
  const sourceChars = getLearnSelectedCharItems();
  const sourceSet = new Set(sourceChars.map((it) => it.text));
  const selectedInSource = (state.writeSelectedChars || []).filter((ch) => sourceSet.has(ch));
  if (selectedInSource.length !== (state.writeSelectedChars || []).length) state.writeSelectedChars = selectedInSource;
  const selectedSet = new Set(selectedInSource);
  const filtered = sourceChars.filter((it) => {
    if (!keyword) return true;
    return (
      String(it.text || "").includes(keyword) ||
      String(it.pinyin || "").toLowerCase().includes(keyword) ||
      String(it.meaning || "").toLowerCase().includes(keyword)
    );
  });
  const pageSize = Math.max(1, Number(state.writeListPageSize) || 50);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  state.writeListPage = Math.max(1, Math.min(state.writeListPage, totalPages));
  const start = (state.writeListPage - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  writeListSummary.textContent = sourceChars.length
    ? `学习页已选 ${sourceChars.length} 个汉字；当前显示 ${filtered.length} 个，已勾选 ${selectedSet.size} 个用于批量演示`
    : "请先在学习页面勾选要演示的汉字。";
  if (writeListPageSize) writeListPageSize.value = String(pageSize);
  if (writeListPageInfo) writeListPageInfo.textContent = `第 ${state.writeListPage} / ${totalPages} 页`;
  if (writeListPrev) writeListPrev.disabled = state.writeListPage <= 1;
  if (writeListNext) writeListNext.disabled = state.writeListPage >= totalPages;
  if (writeListSelectPage) writeListSelectPage.disabled = pageItems.length === 0;
  if (writeListClearSelected) writeListClearSelected.disabled = selectedSet.size === 0;
  if (writeListPlaySelected) writeListPlaySelected.disabled = state.writeBatchPlaying || selectedSet.size === 0;

  if (!pageItems.length) {
    const msg = sourceChars.length ? "没有匹配的汉字，请调整搜索条件。" : "学习页尚未选择汉字。";
    writeCharList.innerHTML = `<tr><td colspan="5">${msg}</td></tr>`;
    return;
  }

  writeCharList.innerHTML = pageItems
    .map((it) => {
      const checked = selectedSet.has(it.text) ? "checked" : "";
      return `<tr>
        <td><input type="checkbox" data-action="write-select-item" data-char="${it.text}" ${checked} /></td>
        <td class="char-cell demo-char-cell" data-action="write-demo-item" data-char="${it.text}" title="点击演示笔画">${it.text}</td>
        <td>${it.pinyin || "-"}</td>
        <td>${it.level}</td>
        <td><button class="ghost" data-action="write-demo-item" data-char="${it.text}">演示</button></td>
      </tr>`;
    })
    .join("");
}

function startCharStrokeDemo(text) {
  const item = CHAR_MAP.get(text);
  if (!item) return;
  writeSelect.value = item.text;
  updateWriteTarget(item.text);
  switchTab("write");
  playStrokeDemo(true);
  writeFeedback.textContent = `已切换到“${item.text}”，可边看笔画边练写。`;
}

function setStrokeDemoButtonsEnabled(enabled) {
  if (strokeDemoPlay) strokeDemoPlay.disabled = !enabled;
  if (strokeDemoReplay) strokeDemoReplay.disabled = !enabled;
}

function initStrokeWriter(char) {
  if (!strokeDemo) return false;
  const target = String(char || "").trim();
  if (!target) return false;
  if (!window.HanziWriter || typeof window.HanziWriter.create !== "function") {
    strokeDemo.innerHTML = "";
    if (strokeDemoMsg) strokeDemoMsg.textContent = "笔画演示加载失败，请检查网络后重试。";
    state.strokeWriter = null;
    state.strokeChar = "";
    setStrokeDemoButtonsEnabled(false);
    return false;
  }
  const size = Math.max(170, Math.min(240, Math.floor(strokeDemo.clientWidth || 220)));
  strokeDemo.innerHTML = "";
  try {
    state.strokeWriter = window.HanziWriter.create("stroke-demo", target, {
      width: size,
      height: size,
      padding: 5,
      showOutline: true,
      strokeAnimationSpeed: 0.95,
      delayBetweenStrokes: 220,
      strokeColor: "#111827",
      radicalColor: "#1f2937",
      outlineColor: "#d8ccb0"
    });
    state.strokeChar = target;
    if (strokeDemoMsg) strokeDemoMsg.textContent = "";
    setStrokeDemoButtonsEnabled(true);
    return true;
  } catch (err) {
    strokeDemo.innerHTML = "";
    if (strokeDemoMsg) strokeDemoMsg.textContent = "该字暂无笔画演示数据。";
    state.strokeWriter = null;
    state.strokeChar = "";
    setStrokeDemoButtonsEnabled(false);
    return false;
  }
}

function playStrokeDemo(forceRebuild = false) {
  const item = CHAR_MAP.get(writeSelect.value) || CHAR_ITEMS[0];
  if (!item) return Promise.resolve(false);
  const needBuild = forceRebuild || !state.strokeWriter || state.strokeChar !== item.text;
  if (needBuild && !initStrokeWriter(item.text)) return Promise.resolve(false);
  if (!state.strokeWriter || typeof state.strokeWriter.animateCharacter !== "function") return Promise.resolve(false);
  if (strokeDemoMsg) strokeDemoMsg.textContent = `正在演示“${item.text}”的笔画...`;
  return Promise.resolve(state.strokeWriter.animateCharacter())
    .then(() => {
      if (strokeDemoMsg) strokeDemoMsg.textContent = `“${item.text}”笔画演示完成。`;
      return true;
    })
    .catch(() => {
      if (strokeDemoMsg) strokeDemoMsg.textContent = "笔画演示失败，请重试。";
      return false;
    });
}

function stopWriteBatchDemo() {
  state.writeBatchToken += 1;
  setWriteBatchPlaying(false);
}

async function playWriteBatchDemo() {
  const selected = new Set(state.writeSelectedChars || []);
  const queue = getLearnSelectedCharItems().filter((it) => selected.has(it.text));
  if (!queue.length) {
    if (strokeDemoMsg) strokeDemoMsg.textContent = "请先在右侧列表选择至少一个汉字。";
    return;
  }
  const token = state.writeBatchToken + 1;
  state.writeBatchToken = token;
  setWriteBatchPlaying(true);
  for (let i = 0; i < queue.length; i += 1) {
    if (state.writeBatchToken !== token) break;
    const item = queue[i];
    writeSelect.value = item.text;
    updateWriteTarget(item.text);
    if (strokeDemoMsg) strokeDemoMsg.textContent = `批量演示 ${i + 1}/${queue.length}：${item.text}`;
    await playStrokeDemo(true);
    await new Promise((resolve) => setTimeout(resolve, 260));
  }
  const finished = state.writeBatchToken === token;
  setWriteBatchPlaying(false);
  if (finished && strokeDemoMsg) strokeDemoMsg.textContent = `批量演示完成，共 ${queue.length} 个汉字。`;
}

function initReviewSettings() {
  const levels = [...new Set(CHAR_ITEMS.concat(WORD_ITEMS).map((it) => it.level))].sort((a, b) => a - b);
  reviewLevelFilter.innerHTML = [`<option value="all">全部</option>`, ...levels.map((lv) => `<option value="${lv}">HSK ${lv}</option>`)].join("");
  reviewTypeFilter.value = state.reviewType;
  reviewLevelFilter.value = state.reviewLevel;
  reviewCountFilter.value = state.reviewCount;
  reviewWrongMixFilter.value = state.reviewWrongMixRatio;
  if (reviewPreviewFilter) reviewPreviewFilter.value = state.reviewPreviewMode;
}

function updateWriteTarget(text) {
  const item = CHAR_MAP.get(text) || CHAR_ITEMS[0];
  targetChar.textContent = item.text;
  targetMeta.textContent = `${item.pinyin} · ${item.meaning}`;
  initStrokeWriter(item.text);
  if (typeof state.refreshWriteCanvas === "function") state.refreshWriteCanvas({ clear: true });
  updateWriteNavButtons();
}

function renderLearnCard() {
  const list = currentLearnList();
  state.learnIndex = Math.max(0, Math.min(state.learnIndex, Math.max(0, list.length - 1)));
  const fallback = getDataset(state.learnType)[0] || CHAR_ITEMS[0];
  const item = list[state.learnIndex] || fallback;
  learnChar.textContent = item.text;
  learnPinyin.textContent = item.pinyin || "-";
  learnMeaning.textContent = item.meaning || "-";
  learnProgress.textContent = `学习进度：${list.length ? state.learnIndex + 1 : 0}/${list.length || 0}（${state.learnRandomMode ? "随机" : "顺序"}）`;
  learnChar.classList.toggle("char", item.type === "char");
  const modeBtn = document.getElementById("learn-mode-toggle");
  const autoBtn = document.getElementById("learn-auto-speak");
  if (modeBtn) modeBtn.textContent = state.learnRandomMode ? "随机学习" : "顺序学习";
  if (autoBtn) autoBtn.textContent = `自动朗读：${state.learnAutoSpeak ? "开" : "关"}`;
  if (state.learnAutoSpeak && list.length) speakLearnItem(item);
}

function getUserDictatedCharSet() {
  if (!state.auth.username) return new Set();
  const rows = state.submissions.filter((x) => x && x.username === state.auth.username);
  return new Set(rows.map((x) => `${x.type}:${x.target}`));
}

function renderLearnCharList() {
  if (!learnCharList || !learnListSummary) return;
  const keyword = String(state.learnCharSearch || "").trim().toLowerCase();
  const merged = [...CHAR_ITEMS, ...WORD_ITEMS];
  const typeFilter = state.learnListTypeFilter || "all";
  const selectedSet = new Set(state.learnSelectedKeys || []);
  const allItems = merged.filter((it) => {
    if (typeFilter !== "all" && it.type !== typeFilter) return false;
    if (!keyword) return true;
    return (
      String(it.text || "").includes(keyword) ||
      String(it.pinyin || "").toLowerCase().includes(keyword) ||
      String(it.meaning || "").toLowerCase().includes(keyword)
    );
  });
  const pageSize = Math.max(1, Number(state.learnCharPageSize) || 50);
  const totalPages = Math.max(1, Math.ceil(allItems.length / pageSize));
  state.learnCharPage = Math.max(1, Math.min(state.learnCharPage, totalPages));
  const start = (state.learnCharPage - 1) * pageSize;
  const pageItems = allItems.slice(start, start + pageSize);
  const dictatedSet = getUserDictatedCharSet();
  const wrongSet = new Set(state.wrongBook.filter((x) => x && x.key).map((x) => x.key));
  learnListSummary.textContent = `共 ${allItems.length} 项（汉字 ${CHAR_ITEMS.length}，词汇 ${WORD_ITEMS.length}，已选 ${selectedSet.size}）`;
  if (learnCharPageSize) learnCharPageSize.value = String(pageSize);
  if (learnListTypeFilter) learnListTypeFilter.value = typeFilter;
  learnCharPageInfo.textContent = `第 ${state.learnCharPage} / ${totalPages} 页`;
  learnCharPrev.disabled = state.learnCharPage <= 1;
  learnCharNext.disabled = state.learnCharPage >= totalPages;
  if (learnDictateSelected) learnDictateSelected.disabled = selectedSet.size === 0;
  if (learnDemoSelected) {
    const hasSelectedChar = [...selectedSet].some((key) => String(key).startsWith("char:"));
    learnDemoSelected.disabled = !hasSelectedChar;
  }
  learnCharList.innerHTML = pageItems
    .map((it) => {
      const key = `${it.type}:${it.text}`;
      const dictated = dictatedSet.has(key);
      const inWrong = wrongSet.has(key);
      const checked = selectedSet.has(key) ? "checked" : "";
      const charCellClass = it.type === "char" ? "char-cell demo-char-cell" : "char-cell";
      const charCellAttrs =
        it.type === "char" ? `data-action="show-stroke-demo" data-char="${it.text}" title="点击演示笔画"` : "";
      return `<tr>
        <td><input type="checkbox" data-action="select-item" data-key="${key}" ${checked} /></td>
        <td class="${charCellClass}" ${charCellAttrs}>${it.text}</td>
        <td>${it.type === "word" ? "词汇" : "汉字"}</td>
        <td>${it.pinyin || "-"}</td>
        <td>${it.level}</td>
        <td class="${dictated ? "status-yes" : "status-no"}">${dictated ? "是" : "否"}</td>
        <td class="${inWrong ? "status-no" : "status-yes"}">${inWrong ? "是" : "否"}</td>
      </tr>`;
    })
    .join("");
}

function normalizeWrongItem(x) {
  if (!x || !x.key) return null;
  const [type, ...rest] = String(x.key).split(":");
  const text = rest.join(":");
  const item = type === "word" ? WORD_MAP.get(text) : CHAR_MAP.get(text);
  if (!item) return null;
  const wordCorrectHits = Number(x.wordCorrectHits) || 0;
  return {
    key: makeItemKey(item),
    type: item.type,
    text: item.text,
    level: item.level,
    pinyin: item.pinyin,
    meaning: item.meaning,
    // keep legacy field name, now used for both char and word wrong-book hit count.
    wordCorrectHits: Math.max(0, wordCorrectHits)
  };
}

function rebuildWrongQueue() {
  state.wrongBook = state.wrongBook.map(normalizeWrongItem).filter(Boolean);
  const typeFiltered = state.wrongBook.filter((it) => it.type === state.reviewType);
  state.wrongQueue = typeFiltered
    .map((it) => (it.type === "word" ? WORD_MAP.get(it.text) : CHAR_MAP.get(it.text)))
    .filter(Boolean);
  saveWrongBook();
  renderWrongBook();
  renderLearnCharList();
}

function addWrongItem(item) {
  const key = makeItemKey(item);
  const existIdx = state.wrongBook.findIndex((x) => x.key === key);
  if (existIdx >= 0) {
    // 错题再次写错，重置“连续写对次数”。
    const prev = state.wrongBook[existIdx];
    if ((prev.wordCorrectHits || 0) !== 0) {
      state.wrongBook[existIdx] = { ...prev, wordCorrectHits: 0 };
      saveWrongBook();
      rebuildWrongQueue();
    }
    return;
  }
  state.wrongBook.push({
    key,
    type: item.type,
    text: item.text,
    level: item.level,
    pinyin: item.pinyin,
    meaning: item.meaning,
    wordCorrectHits: 0
  });
  saveWrongBook();
  rebuildWrongQueue();
}

function removeWrongItem(item) {
  const key = makeItemKey(item);
  const idx = state.wrongBook.findIndex((x) => x.key === key);
  if (idx < 0) return;

  const current = state.wrongBook[idx];
  const hits = (Number(current.wordCorrectHits) || 0) + 1;
  // 全部错题（汉字/词汇）都需连续写对 5 次才从错题本移除。
  if (hits >= 5) {
    state.wrongBook = state.wrongBook.filter((x) => x.key !== key);
  } else {
    state.wrongBook[idx] = { ...current, wordCorrectHits: hits };
  }
  saveWrongBook();
  rebuildWrongQueue();
}

function renderWrongBook() {
  const all = Array.isArray(state.wrongBook) ? state.wrongBook : [];
  const levels = [...new Set(all.map((it) => Number(it.level) || 1))].sort((a, b) => a - b);
  if (state.wrongLevelFilter !== "all" && !levels.includes(Number(state.wrongLevelFilter))) {
    state.wrongLevelFilter = "all";
  }
  const filtered =
    state.wrongLevelFilter === "all" ? all : all.filter((it) => String(it.level) === String(state.wrongLevelFilter));
  const selectedCount =
    state.wrongDictationCount === "all" ? filtered.length : Math.min(filtered.length, Number(state.wrongDictationCount) || 10);

  wrongCount.textContent =
    state.wrongLevelFilter === "all"
      ? `错题本：${all.length} 个`
      : `错题本：${filtered.length}/${all.length} 个（HSK ${state.wrongLevelFilter}）`;

  if (wrongLevelFilters) {
    wrongLevelFilters.innerHTML = [
      `<button class="${state.wrongLevelFilter === "all" ? "is-active" : "ghost"}" data-level="all">全部</button>`,
      ...levels.map(
        (lv) =>
          `<button class="${String(state.wrongLevelFilter) === String(lv) ? "is-active" : "ghost"}" data-level="${lv}">HSK ${lv}</button>`
      )
    ].join("");
  }

  if (wrongDictationCount) wrongDictationCount.value = state.wrongDictationCount;
  if (startWrongDictation) startWrongDictation.disabled = selectedCount <= 0;

  wrongList.innerHTML = filtered.map((it) => `<button class="chip" data-key="${it.key}">${it.text}</button>`).join("");
}

function switchTab(tab) {
  state.tab = tab;
  tabs.forEach((el) => el.classList.toggle("is-active", el.dataset.tab === tab));
  Object.entries(panels).forEach(([key, node]) => node.classList.toggle("is-active", key === tab));
  if (tab === "write") syncWriteListFromLearnSelection();
}

function speakPrompt(item) {
  if (!("speechSynthesis" in window) || !item) return;
  const [p1, p2] = getPromptPhrases(item);
  speakChineseSegments(
    [
      { text: String(item.text || ""), rate: 0.77, pitch: 1.05, pauseMs: 260, split: true },
      { text: String(p1 || ""), rate: 0.84, pitch: 1.01, pauseMs: 220, split: true },
      { text: String(p2 || ""), rate: 0.84, pitch: 1.01, pauseMs: 150, split: true }
    ],
    { cancel: true }
  );
}

function waitPreviewTick(ms) {
  return new Promise((resolve) => {
    clearReviewPreviewTimer();
    state.reviewPreviewTimer = setTimeout(() => {
      state.reviewPreviewTimer = null;
      resolve();
    }, ms);
  });
}

async function runPreReviewPreviewAndStart() {
  const list = Array.isArray(state.reviewList) ? state.reviewList : [];
  if (!list.length) {
    state.reviewPreviewRunning = false;
    state.reviewActive = false;
    renderReviewCard();
    return;
  }

  const enablePreview = state.reviewPreviewMode === "all";
  if (!enablePreview) {
    state.reviewPreviewRunning = false;
    resetPreviewTimerUi();
    state.reviewActive = true;
    renderReviewCard();
    return;
  }

  const token = state.reviewPreviewToken + 1;
  state.reviewPreviewToken = token;
  state.reviewPreviewRunning = true;
  state.reviewActive = false;
  cleanupAllDictationPads();
  reviewFeedback.textContent = "";
  reviewAnswer.textContent = "";
  reviewAnswer.classList.add("is-hidden");
  reviewStartBtn.classList.add("hidden");
  reviewResetBtn.classList.add("hidden");
  wordAnswerRow.classList.add("hidden");
  const totalChars = list.reduce((sum, it) => sum + [...String((it && it.text) || "")].length, 0);
  const totalMs = Math.max(0, totalChars) * 500;
  const totalSec = totalMs / 1000;
  if (reviewPreviewTimer) reviewPreviewTimer.classList.remove("is-hidden");
  const updatePreviewCountdownText = () => {
    const remainMs = Math.max(0, totalMs - (Date.now() - previewStartAt));
    const remainSec = remainMs / 1000;
    const ratio = totalMs > 0 ? Math.max(0, Math.min(1, remainMs / totalMs)) : 0;
    dueCount.textContent = `预览中：共 ${totalChars} 字（总时长 ${totalSec.toFixed(1)} 秒）`;
    if (reviewPreviewTimeText) reviewPreviewTimeText.textContent = `倒计时 ${remainSec.toFixed(1)} 秒`;
    if (reviewPreviewProgressBar) reviewPreviewProgressBar.style.width = `${(ratio * 100).toFixed(1)}%`;
  };
  const previewStartAt = Date.now();
  updatePreviewCountdownText();
  clearReviewPreviewCountdownTimer();
  state.reviewPreviewCountdownTimer = setInterval(() => {
    if (state.reviewPreviewToken !== token) return;
    updatePreviewCountdownText();
  }, 100);
  if (reviewPreview) {
    reviewPreview.textContent = list.map((it) => it.text).join(" ");
    reviewPreview.classList.remove("is-hidden");
  }
  await waitPreviewTick(totalMs);
  clearReviewPreviewCountdownTimer();
  resetPreviewTimerUi();

  if (state.reviewPreviewToken !== token) return;
  state.reviewPreviewRunning = false;
  if (reviewPreview) {
    reviewPreview.textContent = "";
    reviewPreview.classList.add("is-hidden");
  }
  state.reviewActive = true;
  renderReviewCard();
}

function startReviewSession(source, emptyMessage) {
  clearAdvanceTimer();
  stopReviewPreviewSequence();
  if (state.reviewDraftActive) rollbackReviewDraftSession();
  const filtered = buildReviewSessionList(source);
  state.reviewList = filtered;
  state.reviewIndex = 0;
  state.reviewActive = false;
  state.reviewSessionSource = "normal";
  state.reviewSessionPointsEarned = 0;
  state.reviewMessage = filtered.length > 0 ? "默写前预览中..." : emptyMessage;
  if (filtered.length > 0) beginReviewDraftSession();
  runPreReviewPreviewAndStart();
}

function resolveItemByKey(key) {
  if (!key) return null;
  const [type, ...rest] = String(key).split(":");
  const text = rest.join(":");
  if (type === "word") return WORD_MAP.get(text) || null;
  return CHAR_MAP.get(text) || null;
}

function startDirectReviewSession(items, emptyMessage, options = {}) {
  clearAdvanceTimer();
  stopReviewPreviewSequence();
  if (state.reviewDraftActive) rollbackReviewDraftSession();
  const unique = [];
  const seen = new Set();
  items.forEach((it) => {
    if (!it) return;
    const key = `${it.type}:${it.text}`;
    if (seen.has(key)) return;
    seen.add(key);
    unique.push(it);
  });
  state.reviewList = unique;
  state.reviewIndex = 0;
  state.reviewActive = false;
  state.reviewSessionSource = options && options.source ? String(options.source) : "normal";
  state.reviewSessionPointsEarned = 0;
  state.reviewMessage = unique.length > 0 ? "默写前预览中..." : emptyMessage;
  if (unique.length > 0) beginReviewDraftSession();
  runPreReviewPreviewAndStart();
}

function cancelReviewSessionWithoutSave() {
  clearAdvanceTimer();
  stopReviewPreviewSequence();
  rollbackReviewDraftSession();
  state.reviewActive = false;
  state.reviewList = [];
  state.reviewIndex = 0;
  state.reviewSessionSource = "normal";
  state.reviewSessionPointsEarned = 0;
  state.reviewMessage = "已取消本轮默写，数据未保存。";
  renderReviewCard();
}

function renderReviewCard() {
  clearAdvanceTimer();
  const item = state.reviewActive ? currentReviewItem() : null;
  reviewBegin.disabled = Boolean(state.reviewActive) || state.reviewPreviewRunning;
  reviewRestart.disabled = !state.reviewActive || state.reviewPreviewRunning;
  if (reviewStopBtn) {
    reviewStopBtn.disabled = !state.reviewActive || state.reviewPreviewRunning;
    reviewStopBtn.title = state.reviewActive ? t("review.stop") : "";
  }
  reviewBegin.title = state.reviewPreviewRunning
    ? "默写前预览进行中，当前不可点击开始。"
    : state.reviewActive
      ? "默写进行中，当前不可点击开始。"
      : "点击开始本轮默写。";
  reviewRestart.title = state.reviewPreviewRunning
    ? "默写前预览进行中，暂不可重启。"
    : state.reviewActive
      ? "点击后重新开始本轮默写。"
      : "当前没有进行中的默写，无法重启。";
  const total = state.reviewList.length;
  const current = state.reviewActive ? state.reviewIndex + 1 : 0;
  const levelText = state.reviewLevel === "all" ? "全部" : `HSK${state.reviewLevel}`;
  const countText = state.reviewCount === "all" ? "全部" : `${state.reviewCount}个`;
  const mixText = state.reviewType === "char" ? `，错题混入${state.reviewWrongMixRatio}%` : "";
  dueCount.textContent = `进度: ${current}/${total}（${state.reviewType === "word" ? "词汇" : "汉字"}，${levelText}，${countText}${mixText}）`;

  reviewFeedback.textContent = "";
  reviewAnswer.textContent = "";
  reviewAnswer.classList.add("is-hidden");
  wordReviewInput.value = "";

  if (!item) {
    cleanupAllDictationPads();
    resetPreviewTimerUi();
    reviewPinyin.textContent = "拼音：-";
    reviewMeaning.textContent = "英语解释：-";
    if (reviewPreview && !state.reviewPreviewRunning) {
      reviewPreview.textContent = "";
      reviewPreview.classList.add("is-hidden");
    }
    dictationWriterHost.innerHTML = `<span>${state.reviewMessage}</span>`;
    reviewStartBtn.classList.add("hidden");
    reviewResetBtn.classList.add("hidden");
    if (reviewStopBtn) reviewStopBtn.classList.add("hidden");
    wordAnswerRow.classList.add("hidden");
    return;
  }

  reviewPinyin.textContent = `拼音：${item.pinyin || "-"}`;
  reviewMeaning.textContent = `英语解释：${item.meaning || "-"}`;
  if (!state.reviewPreviewRunning) resetPreviewTimerUi();
  if (item.type === "char") {
    wordAnswerRow.classList.add("hidden");
    reviewStartBtn.classList.remove("hidden");
    reviewResetBtn.classList.remove("hidden");
    if (reviewStopBtn) reviewStopBtn.classList.remove("hidden");
    initDictationPad();
  } else {
    initWordDictationPads(item);
    reviewStartBtn.classList.remove("hidden");
    reviewResetBtn.classList.remove("hidden");
    if (reviewStopBtn) reviewStopBtn.classList.remove("hidden");
    wordAnswerRow.classList.add("hidden");
  }

  speakPrompt(item);
}

function finalizeReviewResult(item, isGood, accuracyPercent, meta = {}) {
  const isWrongBookSinglePractice = state.reviewSessionSource === "wrongbook-single";
  const earnedPoints = 1;
  if (isGood) {
    reviewFeedback.textContent = `${item.type === "word" ? "词语" : "默写"}正确${isWrongBookSinglePractice ? "（练习模式）" : ""}`;
    if (!isWrongBookSinglePractice) {
      scheduleProgress(item, true);
      removeWrongItem(item);
      addPoints(earnedPoints);
      state.reviewSessionPointsEarned += earnedPoints;
    }
  } else {
    reviewFeedback.textContent = `${item.type === "word" ? "词语" : "默写"}不正确`;
    reviewAnswer.textContent = `正确答案：${item.text}（${item.meaning || ""}）`;
    reviewAnswer.classList.remove("is-hidden");
    if (!isWrongBookSinglePractice) {
      scheduleProgress(item, false);
      addWrongItem(item);
    }
  }

  if (!isWrongBookSinglePractice && item.type === "char" && isGood && Array.isArray(meta.mlFeature)) {
    updateCharMlPrototype(item.text, meta.mlFeature);
  }
  if (!isWrongBookSinglePractice && item.type === "word" && Array.isArray(meta.mlUpdates)) {
    meta.mlUpdates.forEach((x) => {
      if (!x || !x.isGood || !x.char || !Array.isArray(x.feature)) return;
      updateCharMlPrototype(x.char, x.feature);
    });
  }

  if (!isWrongBookSinglePractice) saveProgress();
  refreshStats();
  if (!isWrongBookSinglePractice) {
    recordSubmission(item, isGood, accuracyPercent, { ...meta, points: earnedPoints });
  }
  renderAdminPanel();
  renderUserRecords();

  clearAdvanceTimer();
  state.advanceTimer = setTimeout(() => {
    state.reviewIndex += 1;
    if (state.reviewIndex >= state.reviewList.length) {
      const sessionPoints = Math.max(0, Number(state.reviewSessionPointsEarned) || 0);
      state.reviewSessionPointsEarned = 0;
      if (!isWrongBookSinglePractice) {
        commitReviewDraftSession().catch((err) => {
          console.warn("commit review draft failed:", err && err.message ? err.message : err);
        });
      } else {
        endReviewDraftSession();
      }
      state.reviewActive = false;
      state.reviewSessionSource = "normal";
      state.reviewMessage = `本轮默写已结束，共完成 ${state.reviewList.length} 个${state.reviewType === "word" ? "词" : "字"}。`;
      state.reviewList = [];
      state.reviewIndex = 0;
      renderReviewCard();
      if (sessionPoints > 0) playPointsGainEffect(sessionPoints, "本轮默写");
      rebuildWrongQueue();
      return;
    }
    renderReviewCard();
    rebuildWrongQueue();
  }, 1400);
}

function evaluateWordInput() {
  evaluateWordDrawing();
}

function getBinaryData(ctx, size) {
  const image = ctx.getImageData(0, 0, size, size).data;
  const bits = new Uint8Array(size * size);
  for (let i = 0; i < bits.length; i += 1) {
    const idx = i * 4;
    const luminance = image[idx] * 0.299 + image[idx + 1] * 0.587 + image[idx + 2] * 0.114;
    bits[i] = luminance < 220 ? 1 : 0;
  }
  return bits;
}

function findBoundingBox(bits, size) {
  let minX = size;
  let minY = size;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (!bits[y * size + x]) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (maxX < minX || maxY < minY) return null;
  return { minX, minY, maxX, maxY };
}

function normalizeBits(bits, size, targetSize = 96, padding = 8) {
  const out = new Uint8Array(targetSize * targetSize);
  const box = findBoundingBox(bits, size);
  if (!box) return out;

  const sourceW = box.maxX - box.minX + 1;
  const sourceH = box.maxY - box.minY + 1;
  const drawW = Math.max(1, targetSize - padding * 2);
  const drawH = Math.max(1, targetSize - padding * 2);
  const scale = Math.max(0.01, Math.min(drawW / sourceW, drawH / sourceH));
  const mappedW = Math.max(1, Math.round(sourceW * scale));
  const mappedH = Math.max(1, Math.round(sourceH * scale));
  const offsetX = Math.floor((targetSize - mappedW) / 2);
  const offsetY = Math.floor((targetSize - mappedH) / 2);

  for (let y = 0; y < mappedH; y += 1) {
    const sy = box.minY + Math.min(sourceH - 1, Math.floor(y / scale));
    for (let x = 0; x < mappedW; x += 1) {
      const sx = box.minX + Math.min(sourceW - 1, Math.floor(x / scale));
      if (bits[sy * size + sx]) out[(offsetY + y) * targetSize + (offsetX + x)] = 1;
    }
  }
  return out;
}

function dilateBits(bits, size, radius = 1) {
  if (radius <= 0) return bits;
  const out = new Uint8Array(bits.length);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (!bits[y * size + x]) continue;
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          const ny = y + dy;
          const nx = x + dx;
          if (ny < 0 || ny >= size || nx < 0 || nx >= size) continue;
          out[ny * size + nx] = 1;
        }
      }
    }
  }
  return out;
}

function shiftBits(bits, size, dx, dy) {
  const out = new Uint8Array(bits.length);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (!bits[y * size + x]) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || nx >= size || ny < 0 || ny >= size) continue;
      out[ny * size + nx] = 1;
    }
  }
  return out;
}

function denoiseBits(bits, size) {
  const out = new Uint8Array(bits.length);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const idx = y * size + x;
      if (!bits[idx]) continue;
      let neighbors = 0;
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || nx >= size || ny < 0 || ny >= size) continue;
          if (bits[ny * size + nx]) neighbors += 1;
        }
      }
      if (neighbors >= 1) out[idx] = 1;
    }
  }
  return out;
}

function scoreWritingBase(userBits, templateBits, size) {
  let userCount = 0;
  let templateCount = 0;
  let overlapWithTemplateTol = 0;
  let overlapWithUserTol = 0;

  const templateTol = dilateBits(templateBits, size, 2);
  const userTol = dilateBits(userBits, size, 2);

  for (let i = 0; i < userBits.length; i += 1) {
    if (userBits[i]) userCount += 1;
    if (templateBits[i]) templateCount += 1;
    if (userBits[i] && templateTol[i]) overlapWithTemplateTol += 1;
    if (templateBits[i] && userTol[i]) overlapWithUserTol += 1;
  }

  if (userCount < 20) return { pass: false, score: 0 };
  const precision = overlapWithTemplateTol / Math.max(1, userCount);
  const recall = overlapWithUserTol / Math.max(1, templateCount);
  const sizeBalance = 1 - Math.min(1, Math.abs(userCount - templateCount) / Math.max(templateCount, 1));
  const score = 0.35 * precision + 0.55 * recall + 0.1 * sizeBalance;
  return { pass: score >= 0.58, score };
}

function countActiveBits(bits) {
  let c = 0;
  for (let i = 0; i < bits.length; i += 1) {
    if (bits[i]) c += 1;
  }
  return c;
}

function buildProjectionProfiles(bits, size) {
  const row = new Float32Array(size);
  const col = new Float32Array(size);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (!bits[y * size + x]) continue;
      row[y] += 1;
      col[x] += 1;
    }
  }
  return { row, col };
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i += 1) {
    const av = a[i];
    const bv = b[i];
    dot += av * bv;
    na += av * av;
    nb += bv * bv;
  }
  if (na <= 0 || nb <= 0) return 0;
  return dot / Math.sqrt(na * nb);
}

function scoreProjectionEngine(userBits, templateBits, size) {
  const u = buildProjectionProfiles(userBits, size);
  const t = buildProjectionProfiles(templateBits, size);
  const rowSim = cosineSimilarity(u.row, t.row);
  const colSim = cosineSimilarity(u.col, t.col);
  const score = Math.max(0, Math.min(1, 0.5 * rowSim + 0.5 * colSim));
  return score;
}

function buildGridDensity(bits, size, cells = 8) {
  const grid = new Float32Array(cells * cells);
  const cellW = size / cells;
  const cellH = size / cells;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (!bits[y * size + x]) continue;
      const gx = Math.min(cells - 1, Math.floor(x / cellW));
      const gy = Math.min(cells - 1, Math.floor(y / cellH));
      grid[gy * cells + gx] += 1;
    }
  }
  return grid;
}

function scoreGridEngine(userBits, templateBits, size) {
  const u = buildGridDensity(userBits, size, 8);
  const t = buildGridDensity(templateBits, size, 8);
  const score = cosineSimilarity(u, t);
  return Math.max(0, Math.min(1, score));
}

function downsampleProfile(profile, bins = 12) {
  const n = profile.length;
  const out = new Float32Array(bins);
  if (!n || bins <= 0) return out;
  const step = n / bins;
  for (let i = 0; i < bins; i += 1) {
    const start = Math.floor(i * step);
    const end = Math.max(start + 1, Math.floor((i + 1) * step));
    let sum = 0;
    let cnt = 0;
    for (let j = start; j < Math.min(n, end); j += 1) {
      sum += profile[j];
      cnt += 1;
    }
    out[i] = cnt > 0 ? sum / cnt : 0;
  }
  return out;
}

function extractMlFeature(bits, size) {
  const total = Math.max(1, countActiveBits(bits));
  const grid = buildGridDensity(bits, size, 8);
  const gridNorm = Array.from(grid, (x) => x / total);
  const proj = buildProjectionProfiles(bits, size);
  const row = downsampleProfile(proj.row, 12);
  const col = downsampleProfile(proj.col, 12);
  const rowNorm = Array.from(row, (x) => x / size);
  const colNorm = Array.from(col, (x) => x / size);
  const box = findBoundingBox(bits, size);
  const boxW = box ? box.maxX - box.minX + 1 : 1;
  const boxH = box ? box.maxY - box.minY + 1 : 1;
  const aspect = Math.max(0.2, Math.min(3, boxW / Math.max(1, boxH)));
  const cover = Math.max(0, Math.min(1, (boxW * boxH) / (size * size)));
  const density = Math.max(0, Math.min(1, total / Math.max(1, boxW * boxH)));
  return [...gridNorm, ...rowNorm, ...colNorm, aspect / 3, cover, density];
}

function updateCharMlPrototype(char, feature) {
  if (!char || !Array.isArray(feature) || feature.length === 0) return;
  const item = CHAR_MAP.get(char);
  if (!item) return;
  const p = getProgress(item);
  const cur = Array.isArray(p.mlFeatureMean) ? p.mlFeatureMean : null;
  const count = Math.max(0, Number(p.mlFeatureCount) || 0);
  if (!cur || cur.length !== feature.length) {
    p.mlFeatureMean = [...feature];
    p.mlFeatureCount = 1;
    return;
  }
  const alpha = count < 10 ? 0.22 : 0.12;
  const next = new Array(feature.length);
  for (let i = 0; i < feature.length; i += 1) {
    const prevV = Number(cur[i]) || 0;
    const newV = Number(feature[i]) || 0;
    next[i] = (1 - alpha) * prevV + alpha * newV;
  }
  p.mlFeatureMean = next;
  p.mlFeatureCount = count + 1;
}

function scorePersonalMlForChar(char, userBits, size) {
  const item = CHAR_MAP.get(char);
  if (!item) return null;
  const p = getProgress(item);
  const proto = Array.isArray(p.mlFeatureMean) ? p.mlFeatureMean : null;
  if (!proto || proto.length === 0) return null;
  const feat = extractMlFeature(userBits, size);
  if (proto.length !== feat.length) return null;
  const sim = cosineSimilarity(proto, feat);
  return Math.max(0, Math.min(1, sim));
}

function scoreWriting(userBits, templateBits, size) {
  const cleanUser = denoiseBits(userBits, size);
  const cleanTemplate = denoiseBits(templateBits, size);
  const minInk = 20;
  if (countActiveBits(cleanUser) < minInk) {
    return { pass: false, score: 0, engines: { overlap: 0, projection: 0, grid: 0 } };
  }

  let best = { score: 0, overlap: 0, projection: 0, grid: 0 };
  for (let dy = -2; dy <= 2; dy += 1) {
    for (let dx = -2; dx <= 2; dx += 1) {
      const shifted = dx === 0 && dy === 0 ? cleanUser : shiftBits(cleanUser, size, dx, dy);
      const overlap = scoreWritingBase(shifted, cleanTemplate, size).score;
      const projection = scoreProjectionEngine(shifted, cleanTemplate, size);
      const grid = scoreGridEngine(shifted, cleanTemplate, size);
      const combined = 0.52 * overlap + 0.28 * projection + 0.2 * grid;
      if (combined > best.score) best = { score: combined, overlap, projection, grid };
    }
  }
  const pass = best.score >= 0.62;
  return {
    pass,
    score: Math.max(0, Math.min(1, best.score)),
    engines: {
      overlap: Math.max(0, Math.min(1, best.overlap)),
      projection: Math.max(0, Math.min(1, best.projection)),
      grid: Math.max(0, Math.min(1, best.grid))
    }
  };
}

function drawStrokesToCanvas(strokes, sourceSize, size) {
  const out = document.createElement("canvas");
  out.width = size;
  out.height = size;
  const ctx = out.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, size, size);

  const scale = size / sourceSize;
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 8 * scale;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  strokes.forEach((stroke) => {
    ctx.beginPath();
    stroke.forEach((point, idx) => {
      const x = point.x * scale;
      const y = point.y * scale;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  });
  return out;
}

function drawPadStrokesToCanvas(pad, size) {
  return drawStrokesToCanvas(pad.strokes, pad && pad.canvas ? pad.canvas.width : 320, size);
}

function evaluateDrawing() {
  const item = currentReviewItem();
  if (!item || item.type !== "char") return;
  if (!state.dictationPad) {
    reviewFeedback.textContent = "画布未初始化，请点击重写本题。";
    return;
  }
  if (state.dictationPad.strokeCount === 0) {
    reviewFeedback.textContent = "请先写完字，再点击完成并判定。";
    return;
  }

  const size = 96;
  const userCanvas = drawPadStrokesToCanvas(state.dictationPad, size);
  const userCtx = userCanvas.getContext("2d");

  const templateCanvas = document.createElement("canvas");
  templateCanvas.width = size;
  templateCanvas.height = size;
  const templateCtx = templateCanvas.getContext("2d");
  templateCtx.fillStyle = "#fff";
  templateCtx.fillRect(0, 0, size, size);
  templateCtx.fillStyle = "#000";
  templateCtx.font = "76px 'Noto Serif SC'";
  templateCtx.textAlign = "center";
  templateCtx.textBaseline = "middle";
  templateCtx.fillText(item.text, size / 2, size / 2 + 2);

  const userBits = normalizeBits(getBinaryData(userCtx, size), size, size, 10);
  const templateBits = normalizeBits(getBinaryData(templateCtx, size), size, size, 10);
  const result = scoreWriting(userBits, templateBits, size);
  const mlScore = scorePersonalMlForChar(item.text, userBits, size);
  const blendedScore =
    typeof mlScore === "number" ? 0.78 * result.score + 0.22 * mlScore : result.score;
  const finalPass = typeof mlScore === "number" ? blendedScore >= 0.61 || (mlScore >= 0.93 && result.score >= 0.5) : result.pass;
  const accuracy = Math.max(0, Math.min(100, Math.round(blendedScore * 100)));
  const handwritingImage = userCanvas.toDataURL("image/png");
  finalizeReviewResult(item, finalPass, accuracy, {
    handwritingImage,
    mlFeature: extractMlFeature(userBits, size)
  });
}

function createTemplateBitsForChar(char, size) {
  const templateCanvas = document.createElement("canvas");
  templateCanvas.width = size;
  templateCanvas.height = size;
  const templateCtx = templateCanvas.getContext("2d");
  templateCtx.fillStyle = "#fff";
  templateCtx.fillRect(0, 0, size, size);
  templateCtx.fillStyle = "#000";
  templateCtx.font = "76px 'Noto Serif SC'";
  templateCtx.textAlign = "center";
  templateCtx.textBaseline = "middle";
  templateCtx.fillText(char, size / 2, size / 2 + 2);
  return normalizeBits(getBinaryData(templateCtx, size), size, size, 10);
}

function evaluateWordDrawing() {
  const item = currentReviewItem();
  if (!item || item.type !== "word") return;
  if (!Array.isArray(state.dictationPads) || state.dictationPads.length === 0) {
    reviewFeedback.textContent = "词汇手写框未初始化，请点击重写本题。";
    return;
  }

  const chars = [...item.text];
  const size = 96;
  if (chars.length !== state.dictationPads.length) {
    reviewFeedback.textContent = "手写框数量与词汇字符数不一致，请重写本题。";
    return;
  }

  const charResults = [];
  const mlUpdates = [];
  for (let i = 0; i < chars.length; i += 1) {
    const pad = state.dictationPads[i];
    if (!pad || pad.strokeCount === 0) {
      reviewFeedback.textContent = `请先完成第 ${i + 1} 个字的书写。`;
      return;
    }
    const userCanvas = drawPadStrokesToCanvas(pad, size);
    const userCtx = userCanvas.getContext("2d");
    const userBits = normalizeBits(getBinaryData(userCtx, size), size, size, 10);
    const templateBits = createTemplateBitsForChar(chars[i], size);
    const result = scoreWriting(userBits, templateBits, size);
    const mlScore = scorePersonalMlForChar(chars[i], userBits, size);
    const blendedScore =
      typeof mlScore === "number" ? 0.78 * result.score + 0.22 * mlScore : result.score;
    const isGood =
      typeof mlScore === "number" ? blendedScore >= 0.61 || (mlScore >= 0.93 && result.score >= 0.5) : result.pass;
    const accuracy = Math.max(0, Math.min(100, Math.round(blendedScore * 100)));
    mlUpdates.push({ char: chars[i], feature: extractMlFeature(userBits, size), isGood });
    charResults.push({
      char: chars[i],
      isGood,
      accuracyPercent: accuracy,
      handwritingImage: userCanvas.toDataURL("image/png")
    });
  }

  const isGood = charResults.every((x) => x.isGood);
  const accuracyPercent = Math.round(charResults.reduce((sum, x) => sum + x.accuracyPercent, 0) / Math.max(1, charResults.length));
  const detailText = charResults.map((x, idx) => `第${idx + 1}字${x.isGood ? "正确" : "错误"}(${x.accuracyPercent}%)`).join("，");
  finalizeReviewResult(item, isGood, accuracyPercent, {
    userAnswer: detailText,
    wordCharResults: charResults,
    mlUpdates,
    handwritingImage: charResults.map((x) => x.handwritingImage).join("||")
  });
}

function cleanupDictationPad() {
  if (state.dictationPad && typeof state.dictationPad.cleanup === "function") {
    state.dictationPad.cleanup();
  }
  state.dictationPad = null;
}

function cleanupAllDictationPads() {
  cleanupDictationPad();
  if (Array.isArray(state.dictationPads)) {
    state.dictationPads.forEach((pad) => {
      if (pad && typeof pad.cleanup === "function") pad.cleanup();
    });
  }
  state.dictationPads = [];
  dictationWriterHost.classList.remove("word-mode");
}

function createHandwritingPad(container, canvasSize = 320) {
  const canvas = document.createElement("canvas");
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  canvas.className = "dictation-canvas";
  canvas.setAttribute("aria-label", "汉字默写画布");
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const pad = { canvas, ctx, drawing: false, currentStroke: [], strokes: [], strokeCount: 0, cleanup: null };

  function drawPad() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#e6dcc2";
    ctx.lineWidth = 1;
    [
      [0, 0, canvas.width, canvas.height],
      [canvas.width, 0, 0, canvas.height],
      [0, canvas.height / 2, canvas.width, canvas.height / 2],
      [canvas.width / 2, 0, canvas.width / 2, canvas.height]
    ].forEach((line) => {
      ctx.beginPath();
      ctx.moveTo(line[0], line[1]);
      ctx.lineTo(line[2], line[3]);
      ctx.stroke();
    });

    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    pad.strokes.forEach((stroke) => {
      ctx.beginPath();
      stroke.forEach((point, idx) => {
        if (idx === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    });
  }

  function getPoint(event) {
    const rect = canvas.getBoundingClientRect();
    const source = event.touches ? event.touches[0] : event;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (source.clientX - rect.left) * scaleX, y: (source.clientY - rect.top) * scaleY };
  }

  function start(event) {
    pad.drawing = true;
    pad.currentStroke = [getPoint(event)];
  }

  function move(event) {
    if (!pad.drawing) return;
    event.preventDefault();
    pad.currentStroke.push(getPoint(event));
    drawPad();
    ctx.beginPath();
    pad.currentStroke.forEach((point, idx) => {
      if (idx === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
  }

  function end() {
    if (!pad.drawing) return;
    pad.drawing = false;
    if (pad.currentStroke.length > 1) {
      pad.strokes.push(pad.currentStroke);
      pad.strokeCount += 1;
    }
    pad.currentStroke = [];
    drawPad();
  }

  canvas.addEventListener("mousedown", start);
  canvas.addEventListener("mousemove", move);
  window.addEventListener("mouseup", end);
  canvas.addEventListener("touchstart", start, { passive: false });
  canvas.addEventListener("touchmove", move, { passive: false });
  window.addEventListener("touchend", end);

  pad.cleanup = () => {
    canvas.removeEventListener("mousedown", start);
    canvas.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", end);
    canvas.removeEventListener("touchstart", start);
    canvas.removeEventListener("touchmove", move);
    window.removeEventListener("touchend", end);
  };

  drawPad();
  return pad;
}

function initDictationPad() {
  cleanupAllDictationPads();
  dictationWriterHost.classList.remove("word-mode");
  dictationWriterHost.innerHTML = "";
  state.dictationPad = createHandwritingPad(dictationWriterHost, 320);
}

function initWordDictationPads(item) {
  cleanupAllDictationPads();
  dictationWriterHost.classList.add("word-mode");
  const chars = [...(item && item.text ? item.text : "")];
  dictationWriterHost.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "word-dictation-grid";
  const pads = [];
  chars.forEach((_, idx) => {
    const cell = document.createElement("div");
    cell.className = "word-dictation-cell";
    const label = document.createElement("p");
    label.className = "word-dictation-label";
    label.textContent = `第 ${idx + 1} 字`;
    const host = document.createElement("div");
    host.className = "word-dictation-canvas-host";
    cell.appendChild(label);
    cell.appendChild(host);
    grid.appendChild(cell);
    pads.push(createHandwritingPad(host, 220));
  });
  dictationWriterHost.appendChild(grid);
  state.dictationPads = pads;
}

function wireLearn() {
  document.getElementById("prev-char").addEventListener("click", () => {
    moveLearn(-1);
  });

  document.getElementById("next-char").addEventListener("click", () => {
    moveLearn(1);
  });

  document.getElementById("learn-play").addEventListener("click", () => {
    const item = currentLearnList()[state.learnIndex];
    if (!item) return;
    speakLearnItem(item);
  });

  document.getElementById("learn-mode-toggle").addEventListener("click", () => {
    state.learnRandomMode = !state.learnRandomMode;
    renderLearnCard();
  });

  document.getElementById("learn-auto-speak").addEventListener("click", () => {
    state.learnAutoSpeak = !state.learnAutoSpeak;
    renderLearnCard();
  });

  document.getElementById("toggle-detail").addEventListener("click", () => {
    learnCard.querySelector(".meta").classList.toggle("is-hidden");
  });

  learnTypeFilter.addEventListener("change", (e) => {
    state.learnType = e.target.value;
    state.learnIndex = 0;
    state.learnCharPage = 1;
    renderLearnCard();
    renderLearnCharList();
  });

  levelFilter.addEventListener("change", (e) => {
    state.level = e.target.value;
    state.learnIndex = 0;
    state.learnCharPage = 1;
    renderLearnCard();
    renderLearnCharList();
  });

  learnCharSearch.addEventListener("input", (event) => {
    state.learnCharSearch = event.target.value || "";
    state.learnCharPage = 1;
    renderLearnCharList();
  });

  learnListTypeFilter.addEventListener("change", (event) => {
    state.learnListTypeFilter = event.target.value || "all";
    state.learnCharPage = 1;
    renderLearnCharList();
  });

  learnCharPageSize.addEventListener("change", (event) => {
    state.learnCharPageSize = Number(event.target.value) || 50;
    state.learnCharPage = 1;
    renderLearnCharList();
  });

  learnCharPrev.addEventListener("click", () => {
    state.learnCharPage = Math.max(1, state.learnCharPage - 1);
    renderLearnCharList();
  });

  learnCharNext.addEventListener("click", () => {
    state.learnCharPage += 1;
    renderLearnCharList();
  });

  learnCharList.addEventListener("click", (event) => {
    const ck = event.target.closest("input[data-action='select-item']");
    if (ck) {
      const key = ck.dataset.key;
      const set = new Set(state.learnSelectedKeys || []);
      if (ck.checked) set.add(key);
      else set.delete(key);
      state.learnSelectedKeys = [...set];
      renderLearnCharList();
      syncWriteListFromLearnSelection();
      return;
    }
    const strokeCell = event.target.closest("td[data-action='show-stroke-demo']");
    if (strokeCell) {
      startCharStrokeDemo(strokeCell.dataset.char);
      return;
    }
  });

  learnSelectPage.addEventListener("click", () => {
    const checks = Array.from(learnCharList.querySelectorAll("input[data-action='select-item']"));
    const set = new Set(state.learnSelectedKeys || []);
    checks.forEach((x) => set.add(x.dataset.key));
    state.learnSelectedKeys = [...set];
    renderLearnCharList();
    syncWriteListFromLearnSelection();
  });

  learnClearSelected.addEventListener("click", () => {
    state.learnSelectedKeys = [];
    renderLearnCharList();
    syncWriteListFromLearnSelection({ resetPage: true });
  });

  learnDemoSelected.addEventListener("click", () => {
    const chars = getLearnSelectedCharItems();
    if (!chars.length) {
      learnListSummary.textContent = "请先在列表中勾选至少一个汉字，再进行批量演示。";
      return;
    }
    state.writeSelectedChars = chars.map((it) => it.text);
    syncWriteListFromLearnSelection({ resetPage: true });
    switchTab("write");
    playWriteBatchDemo();
  });

  learnDictateSelected.addEventListener("click", () => {
    const keys = state.learnSelectedKeys || [];
    const items = keys.map(resolveItemByKey).filter(Boolean);
    if (!items.length) return;
    const firstType = items[0].type;
    const mixed = items.some((x) => x.type !== firstType);
    state.reviewType = mixed ? "char" : firstType;
    reviewTypeFilter.value = state.reviewType;
    switchTab("review");
    startDirectReviewSession(items, "未找到选中的默写项目。");
  });

  document.addEventListener("keydown", (event) => {
    if (state.tab !== "learn" || !isLearnerRole(state.auth.role)) return;
    if (event.target && ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)) return;
    if (event.key === "ArrowLeft") moveLearn(-1);
    if (event.key === "ArrowRight") moveLearn(1);
    if (event.key.toLowerCase() === "p") {
      const item = currentLearnList()[state.learnIndex];
      if (item) speakLearnItem(item);
    }
  });
}

function wireReview() {
  reviewBegin.addEventListener("click", () => {
    const source = getDataset(state.reviewType);
    startReviewSession(source, "当前筛选下没有可默写的项目。");
  });

  reviewRestart.addEventListener("click", () => {
    if (!state.reviewActive) {
      reviewFeedback.textContent = "当前没有进行中的默写。";
      return;
    }
    const ok = window.confirm("重新开始将取消当前默写进度，且本轮数据不保存，是否继续？");
    if (!ok) return;
    const source = getDataset(state.reviewType);
    startReviewSession(source, "当前筛选下没有可默写的项目。");
  });

  document.getElementById("review-play").addEventListener("click", () => {
    if (!state.reviewActive) return;
    const item = currentReviewItem();
    if (!item) return;
    speakPrompt(item);
  });

  document.getElementById("review-replay").addEventListener("click", () => {
    if (!state.reviewActive) return;
    const item = currentReviewItem();
    if (!item) return;
    speakPrompt(item);
  });

  reviewStartBtn.addEventListener("click", () => {
    if (!state.reviewActive) return;
    if (state.reviewType === "word") evaluateWordDrawing();
    else evaluateDrawing();
  });

  reviewResetBtn.addEventListener("click", () => {
    if (!state.reviewActive) return;
    if (state.reviewType === "word") initWordDictationPads(currentReviewItem());
    else initDictationPad();
    reviewFeedback.textContent = "已清空，请重新书写后再判定。";
    reviewAnswer.classList.add("is-hidden");
  });

  wordReviewSubmit.addEventListener("click", () => {
    if (!state.reviewActive || state.reviewType !== "word") return;
    evaluateWordDrawing();
  });

  wordReviewInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") evaluateWordDrawing();
  });

  if (reviewStopBtn) {
    reviewStopBtn.addEventListener("click", () => {
      if (!state.reviewActive && !state.reviewPreviewRunning) return;
      const ok = window.confirm(t("review.stopConfirm"));
      if (!ok) return;
      cancelReviewSessionWithoutSave();
    });
  }

  reviewTypeFilter.addEventListener("change", (event) => {
    if (state.reviewDraftActive) rollbackReviewDraftSession();
    state.reviewType = event.target.value;
    saveReviewPrefs();
    state.reviewActive = false;
    state.reviewList = [];
    state.reviewIndex = 0;
    state.reviewMessage = "默写类型已切换，请点击“开始默写”。";
    rebuildWrongQueue();
    renderReviewCard();
  });

  reviewLevelFilter.addEventListener("change", (event) => {
    if (state.reviewDraftActive) rollbackReviewDraftSession();
    state.reviewLevel = event.target.value;
    saveReviewPrefs();
    state.reviewActive = false;
    state.reviewList = [];
    state.reviewIndex = 0;
    state.reviewMessage = "设置已更新，请点击“开始默写”。";
    renderReviewCard();
  });

  reviewCountFilter.addEventListener("change", (event) => {
    if (state.reviewDraftActive) rollbackReviewDraftSession();
    state.reviewCount = event.target.value;
    saveReviewPrefs();
    state.reviewActive = false;
    state.reviewList = [];
    state.reviewIndex = 0;
    state.reviewMessage = "设置已更新，请点击“开始默写”。";
    renderReviewCard();
  });

  reviewWrongMixFilter.addEventListener("change", (event) => {
    if (state.reviewDraftActive) rollbackReviewDraftSession();
    state.reviewWrongMixRatio = event.target.value;
    saveReviewPrefs();
    state.reviewActive = false;
    state.reviewList = [];
    state.reviewIndex = 0;
    state.reviewMessage = "设置已更新，请点击“开始默写”。";
    renderReviewCard();
  });

  if (reviewPreviewFilter) {
    reviewPreviewFilter.addEventListener("change", (event) => {
      if (state.reviewDraftActive) rollbackReviewDraftSession();
      state.reviewPreviewMode = event.target.value || "0";
      saveReviewPrefs();
      state.reviewActive = false;
      state.reviewList = [];
      state.reviewIndex = 0;
      state.reviewMessage = "设置已更新，请点击“开始默写”。";
      renderReviewCard();
    });
  }
}

function wireWrongBook() {
  if (clearWrongBtn) {
    clearWrongBtn.addEventListener("click", () => {
      state.wrongBook = [];
      saveWrongBook();
      rebuildWrongQueue();
      refreshStats();
    });
  }

  startWrongDictation.addEventListener("click", () => {
    const source =
      state.wrongLevelFilter === "all"
        ? state.wrongQueue
        : state.wrongQueue.filter((it) => String(it.level) === String(state.wrongLevelFilter));
    const limit = state.wrongDictationCount === "all" ? source.length : Number(state.wrongDictationCount) || 10;
    const picked =
      state.wrongDictationCount === "all"
        ? [...source]
        : weightedSampleWithoutReplacement(source, Math.min(limit, source.length), (it) => buildMemoryCurveWeight(it, { inWrongBook: true }));
    switchTab("review");
    startDirectReviewSession(picked, "当前筛选下没有错题可默写。");
  });

  if (wrongLevelFilters) {
    wrongLevelFilters.addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-level]");
      if (!btn) return;
      state.wrongLevelFilter = btn.dataset.level || "all";
      renderWrongBook();
    });
  }

  if (wrongDictationCount) {
    wrongDictationCount.addEventListener("change", (event) => {
      state.wrongDictationCount = event.target.value || "10";
      renderWrongBook();
    });
  }

  wrongList.addEventListener("click", (event) => {
    const target = event.target.closest("button[data-key]");
    if (!target) return;
    const [type, ...rest] = target.dataset.key.split(":");
    const text = rest.join(":");
    const item = type === "word" ? WORD_MAP.get(text) : CHAR_MAP.get(text);
    if (!item) return;
    state.reviewType = item.type;
    reviewTypeFilter.value = item.type;
    switchTab("review");
    startDirectReviewSession([item], "该项目不存在。", { source: "wrongbook-single" });
  });
}

function wireTabs() {
  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (isManagerRole(state.auth.role) && !["admin", "admin-users", "admin-wrong", "admin-items"].includes(btn.dataset.tab)) return;
      if (btn.dataset.tab === "admin" && !canAccessReviewAudit(state.auth.role)) return;
      if (btn.dataset.tab === "admin-users" && !isSuperAdmin(state.auth.role)) return;
      if (btn.dataset.tab === "admin-wrong" && !isManagerRole(state.auth.role)) return;
      if (btn.dataset.tab === "admin-items" && !isSuperAdmin(state.auth.role)) return;
      if ((state.reviewActive || state.reviewPreviewRunning) && state.tab === "review" && btn.dataset.tab !== "review") {
        const ok = window.confirm("正在默写中。切换菜单将取消本轮默写且数据不保存，是否继续？");
        if (!ok) return;
        cancelReviewSessionWithoutSave();
      }
      switchTab(btn.dataset.tab);
      if (btn.dataset.tab === "admin") renderAdminPanel();
      if (btn.dataset.tab === "admin-users") {
        renderAdminUsersPanel();
        fetchAdminUsers();
      }
      if (btn.dataset.tab === "admin-wrong") renderAdminWrongBookPanel();
      if (btn.dataset.tab === "admin-items") renderAdminItemsPanel();
      if (btn.dataset.tab === "records") renderUserRecords();
    });
  });
}

function wireAuth() {
  authTabLogin.addEventListener("click", () => switchAuthMode("login"));
  authTabRegister.addEventListener("click", () => switchAuthMode("register"));
  authLogin.addEventListener("click", handleLogin);
  authRegister.addEventListener("click", handleRegister);
  if (authRoleSelect) {
    authRoleSelect.addEventListener("change", () => refreshAuthRegisterRoleUi());
  }
  if (authLangSelect) {
    authLangSelect.addEventListener("change", (event) => {
      setLanguage(event.target.value, true);
    });
  }
  if (appLangSelect) {
    appLangSelect.addEventListener("change", (event) => {
      setLanguage(event.target.value, true);
    });
  }
  authTogglePassword.addEventListener("click", () => {
    const show = authPassword.type === "password";
    authPassword.type = show ? "text" : "password";
    authPasswordConfirm.type = show ? "text" : "password";
    updateAuthTogglePasswordLabel();
  });
  authPassword.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    if (authRegister.classList.contains("hidden")) handleLogin();
    else handleRegister();
  });
  authPasswordConfirm.addEventListener("keydown", (event) => {
    if (event.key === "Enter") handleRegister();
  });
  if (authParentUsername) {
    authParentUsername.addEventListener("keydown", (event) => {
      if (event.key === "Enter") handleRegister();
    });
  }
  logoutBtn.addEventListener("click", logout);
}

function wireAdmin() {
  adminFilterApply.addEventListener("click", renderAdminPanel);
  adminUserFilter.addEventListener("keydown", (event) => {
    if (event.key === "Enter") renderAdminPanel();
  });
  adminTimeFilter.addEventListener("change", renderAdminPanel);
  if (adminUsersRefresh) {
    adminUsersRefresh.addEventListener("click", () => {
      fetchAdminUsers();
    });
  }
  if (adminUsersList) {
    adminUsersList.addEventListener("click", async (event) => {
      const btn = event.target.closest("button[data-action='delete-user']");
      if (!btn || state.auth.role !== "admin") return;
      const username = String(btn.dataset.username || "").trim();
      if (!username) return;
      const ok = window.confirm(`确认删除用户「${username}」吗？该用户的学习数据和记录会被一并删除。`);
      if (!ok) return;
      try {
        await apiRequest(`/api/admin/users/${encodeURIComponent(username)}`, {
          method: "DELETE"
        });
        if (adminUsersMsg) adminUsersMsg.textContent = `已删除用户：${username}`;
        if (state.adminWrongBookQueryUser === username) {
          state.adminWrongBookQueryUser = "";
          state.adminWrongBookItems = [];
          renderAdminWrongBookPanel();
        }
        state.submissions = state.submissions.filter((x) => x && x.username !== username && x.reviewedBy !== username);
        renderAdminPanel();
        renderUserRecords();
        await fetchAdminUsers();
      } catch (err) {
        if (adminUsersMsg) adminUsersMsg.textContent = err && err.message ? err.message : "删除用户失败";
      }
    });
  }
  if (adminWrongSearch) {
    adminWrongSearch.addEventListener("click", () => {
      queryAdminWrongBook((adminWrongSearchUser && adminWrongSearchUser.value) || "");
    });
  }
  if (adminWrongSearchUser) {
    adminWrongSearchUser.addEventListener("keydown", (event) => {
      if (event.key === "Enter") queryAdminWrongBook(adminWrongSearchUser.value || "");
    });
  }
  if (adminWrongList) {
    adminWrongList.addEventListener("click", async (event) => {
      const btn = event.target.closest("button[data-action='delete-wrong-item']");
      if (!btn || !isManagerRole(state.auth.role)) return;
      const username = String(state.adminWrongBookQueryUser || "").trim();
      const type = btn.dataset.type === "word" ? "word" : "char";
      const text = String(btn.dataset.text || "").trim();
      if (!username || !text) return;
      const ok = window.confirm(t("adminWrong.confirmDelete", { username, text }));
      if (!ok) return;
      try {
        const resp = await apiRequest(`/api/admin/users/${encodeURIComponent(username)}/wrong-book`, {
          method: "PUT",
          body: JSON.stringify({ action: "remove", type, text })
        });
        state.adminWrongBookItems = Array.isArray(resp.wrongBook) ? resp.wrongBook : [];
        if (adminWrongMsg) adminWrongMsg.textContent = t("adminWrong.deleted", { text });
        renderAdminWrongBookPanel();
      } catch (err) {
        if (adminWrongMsg) adminWrongMsg.textContent = err && err.message ? err.message : t("adminWrong.deleteFailed");
      }
    });
  }

  if (adminItemsTypeFilter) {
    adminItemsTypeFilter.addEventListener("change", (event) => {
      state.adminItemsTypeFilter = event.target.value || "all";
      state.adminItemsPage = 1;
      renderAdminItemsPanel();
    });
  }
  if (adminItemsLevelFilter) {
    adminItemsLevelFilter.addEventListener("change", (event) => {
      state.adminItemsLevelFilter = event.target.value || "all";
      state.adminItemsPage = 1;
      renderAdminItemsPanel();
    });
  }
  if (adminItemsSearch) {
    adminItemsSearch.addEventListener("input", (event) => {
      state.adminItemsSearch = event.target.value || "";
      state.adminItemsPage = 1;
      renderAdminItemsPanel();
    });
  }
  if (adminItemsPageSize) {
    adminItemsPageSize.addEventListener("change", (event) => {
      state.adminItemsPageSize = Number(event.target.value) || 50;
      state.adminItemsPage = 1;
      renderAdminItemsPanel();
    });
  }
  if (adminItemsPrev) {
    adminItemsPrev.addEventListener("click", () => {
      state.adminItemsPage = Math.max(1, state.adminItemsPage - 1);
      renderAdminItemsPanel();
    });
  }
  if (adminItemsNext) {
    adminItemsNext.addEventListener("click", () => {
      state.adminItemsPage += 1;
      renderAdminItemsPanel();
    });
  }
  if (adminItemsSaveAll) {
    adminItemsSaveAll.addEventListener("click", async () => {
      if (state.auth.role !== "admin" || state.adminItemsSaving) return;
      const keys = getDirtyAdminItemKeys();
      if (!keys.length) {
        if (adminItemsMsg) adminItemsMsg.textContent = "没有需要保存的修改";
        return;
      }
      state.adminItemsSaving = true;
      if (adminItemsMsg) adminItemsMsg.textContent = `正在保存 ${keys.length} 项...`;
      renderAdminItemsPanel();
      let okCount = 0;
      const failed = [];
      let latestOverrides = state.lexiconOverrides;
      for (const key of keys) {
        try {
          const resp = await saveAdminItemOverrideByKey(key);
          latestOverrides = (resp && resp.lexiconOverrides) || latestOverrides;
          okCount += 1;
        } catch (err) {
          const parsed = parseAdminItemKey(key);
          failed.push((parsed && parsed.text) || key);
        }
      }
      applyLexiconOverrides(latestOverrides || state.lexiconOverrides);
      initWriteSelect();
      renderLearnCard();
      renderLearnCharList();
      state.adminItemsSaving = false;
      renderAdminItemsPanel();
      if (adminItemsMsg) {
        adminItemsMsg.textContent =
          failed.length > 0
            ? `已保存 ${okCount} 项，失败 ${failed.length} 项：${failed.slice(0, 3).join("、")}${failed.length > 3 ? "..." : ""}`
            : `批量保存完成：${okCount} 项`;
      }
    });
  }
  if (adminItemsList) {
    adminItemsList.addEventListener("input", (event) => {
      const input = event.target.closest("input[data-admin-item]");
      if (!input || state.auth.role !== "admin") return;
      const key = String(input.dataset.key || "");
      const field = String(input.dataset.adminItem || "");
      setAdminDraftField(key, field, input.value || "");
      refreshAdminItemsDirtyUi();
    });

    adminItemsList.addEventListener("click", async (event) => {
      const btn = event.target.closest("button[data-action='save-admin-item']");
      if (!btn || state.auth.role !== "admin" || state.adminItemsSaving) return;
      const key = String(btn.dataset.key || "");
      const parsed = parseAdminItemKey(key);
      if (!parsed || !parsed.text) return;
      if (!isAdminItemDirty(key, getAdminItemByKey(key))) {
        if (adminItemsMsg) adminItemsMsg.textContent = `无修改：${parsed.text}`;
        return;
      }
      try {
        state.adminItemsSaving = true;
        renderAdminItemsPanel();
        const resp = await saveAdminItemOverrideByKey(key);
        applyLexiconOverrides((resp && resp.lexiconOverrides) || state.lexiconOverrides);
        initWriteSelect();
        renderLearnCard();
        renderLearnCharList();
        state.adminItemsSaving = false;
        renderAdminItemsPanel();
        if (adminItemsMsg) adminItemsMsg.textContent = `已保存：${parsed.text}`;
      } catch (err) {
        state.adminItemsSaving = false;
        renderAdminItemsPanel();
        if (adminItemsMsg) adminItemsMsg.textContent = err && err.message ? err.message : "保存失败";
      }
    });
  }

  adminList.addEventListener("click", async (event) => {
    const btn = event.target.closest("button[data-action]");
    const card = event.target.closest(".admin-item");
    if (!btn || !card || !canAccessReviewAudit(state.auth.role)) return;
    const id = card.dataset.id;
    const row = state.submissions.find((x) => x.id === id);
    if (!row) return;
    const beforeFinalResult = Boolean(row.finalResult);
    const action = btn.dataset.action;
    if (action === "set-char-status") {
      if (row.type !== "word") return;
      ensureSubmissionWordCharResults(row);
      const idx = Number(btn.dataset.index);
      const nextValue = btn.dataset.value === "true";
      const current = getWordCharResultsForRender(row).map((x) => ({ ...x }));
      if (!Number.isInteger(idx) || idx < 0 || idx >= current.length) return;
      current[idx].isGood = nextValue;
      state.adminWordReviewDrafts[id] = current;
      renderAdminPanel();
      return;
    }

    const reviewedCharResults =
      row.type === "word"
        ? getWordCharResultsForRender(row).map((x) => ({
            char: x.char || "",
            isGood: Boolean(x.isGood),
            accuracyPercent: normalizeAccuracyPercent(x.accuracyPercent),
            handwritingImage: x.handwritingImage || ""
          }))
        : null;
    const after = action === "apply-char-review"
      ? reviewedCharResults && reviewedCharResults.length > 0
        ? reviewedCharResults.every((x) => x.isGood)
        : false
      : action === "mark-correct";
    try {
      const resp = await apiRequest(`/api/submissions/${encodeURIComponent(id)}/review`, {
        method: "PUT",
        body: JSON.stringify({
          finalResult: after,
          wordCharResults: reviewedCharResults || undefined
        })
      });
      const idx = state.submissions.findIndex((x) => x.id === id);
      if (idx !== -1 && resp.submission) state.submissions[idx] = resp.submission;
      delete state.adminWordReviewDrafts[id];
      renderAdminPanel();
      renderUserRecords();
      const changed = Boolean(resp && resp.submission && resp.submission.finalResult) !== beforeFinalResult;
      window.alert(changed ? "复判完成：已更新错题本和积分。" : "复判完成：已更新错题本/积分（如有变更）。");
    } catch (err) {
      reviewFeedback.textContent = err && err.message ? err.message : "复判失败";
    }
  });
}

function setupCanvas() {
  const canvas = document.getElementById("write-canvas");
  const ctx = canvas.getContext("2d");
  const strokes = [];
  let drawing = false;
  let currentStroke = [];

  function drawGuide() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#e6dcc2";
    ctx.lineWidth = 1;
    [
      [0, 0, canvas.width, canvas.height],
      [canvas.width, 0, 0, canvas.height],
      [0, canvas.height / 2, canvas.width, canvas.height / 2],
      [canvas.width / 2, 0, canvas.width / 2, canvas.height]
    ].forEach((line) => {
      ctx.beginPath();
      ctx.moveTo(line[0], line[1]);
      ctx.lineTo(line[2], line[3]);
      ctx.stroke();
    });

    ctx.fillStyle = "rgba(19, 35, 47, 0.08)";
    ctx.font = "220px 'Noto Serif SC'";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(targetChar.textContent, canvas.width / 2, canvas.height / 2);

    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    strokes.forEach((stroke) => {
      ctx.beginPath();
      stroke.forEach((point, idx) => {
        if (idx === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    });
  }

  function getPoint(event) {
    const rect = canvas.getBoundingClientRect();
    const source = event.touches ? event.touches[0] : event;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (source.clientX - rect.left) * scaleX, y: (source.clientY - rect.top) * scaleY };
  }

  function start(event) {
    drawing = true;
    currentStroke = [getPoint(event)];
  }

  function move(event) {
    if (!drawing) return;
    event.preventDefault();
    currentStroke.push(getPoint(event));
    drawGuide();
    ctx.beginPath();
    currentStroke.forEach((point, idx) => {
      if (idx === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
  }

  function end() {
    if (!drawing) return;
    drawing = false;
    if (currentStroke.length > 1) strokes.push(currentStroke);
    currentStroke = [];
    drawGuide();
  }

  function refreshCanvas(options = {}) {
    if (options && options.clear) strokes.length = 0;
    drawGuide();
  }

  state.refreshWriteCanvas = refreshCanvas;

  canvas.addEventListener("mousedown", start);
  canvas.addEventListener("mousemove", move);
  window.addEventListener("mouseup", end);
  canvas.addEventListener("touchstart", start, { passive: false });
  canvas.addEventListener("touchmove", move, { passive: false });
  window.addEventListener("touchend", end);

  document.getElementById("clear-canvas").addEventListener("click", () => {
    strokes.length = 0;
    drawGuide();
    writeFeedback.textContent = "";
  });

  document.getElementById("undo-stroke").addEventListener("click", () => {
    strokes.pop();
    drawGuide();
    writeFeedback.textContent = "";
  });

  writeSelect.addEventListener("change", () => {
    updateWriteTarget(writeSelect.value);
    writeFeedback.textContent = "";
  });

  if (writePrevChar) {
    writePrevChar.addEventListener("click", () => {
      moveWriteTarget(-1);
    });
  }

  if (writeNextChar) {
    writeNextChar.addEventListener("click", () => {
      moveWriteTarget(1);
    });
  }

  if (writeListSearch) {
    writeListSearch.addEventListener("input", (event) => {
      state.writeListSearch = event.target.value || "";
      state.writeListPage = 1;
      renderWriteCharList();
    });
  }

  if (writeListPageSize) {
    writeListPageSize.addEventListener("change", (event) => {
      state.writeListPageSize = Number(event.target.value) || 50;
      state.writeListPage = 1;
      renderWriteCharList();
    });
  }

  if (writeListPrev) {
    writeListPrev.addEventListener("click", () => {
      state.writeListPage = Math.max(1, state.writeListPage - 1);
      renderWriteCharList();
    });
  }

  if (writeListNext) {
    writeListNext.addEventListener("click", () => {
      state.writeListPage += 1;
      renderWriteCharList();
    });
  }

  if (writeCharList) {
    writeCharList.addEventListener("click", (event) => {
      const ck = event.target.closest("input[data-action='write-select-item']");
      if (ck) {
        const char = ck.dataset.char;
        const set = new Set(state.writeSelectedChars || []);
        if (ck.checked) set.add(char);
        else set.delete(char);
        state.writeSelectedChars = [...set];
        renderWriteCharList();
        return;
      }
      const demoBtn = event.target.closest("[data-action='write-demo-item']");
      if (!demoBtn) return;
      const text = demoBtn.dataset.char;
      const item = CHAR_MAP.get(text);
      if (!item) return;
      stopWriteBatchDemo();
      writeSelect.value = item.text;
      updateWriteTarget(item.text);
      playStrokeDemo(true);
      writeFeedback.textContent = `正在演示“${item.text}”。`;
    });
  }

  if (writeListSelectPage) {
    writeListSelectPage.addEventListener("click", () => {
      if (!writeCharList) return;
      const checks = Array.from(writeCharList.querySelectorAll("input[data-action='write-select-item']"));
      const set = new Set(state.writeSelectedChars || []);
      checks.forEach((x) => set.add(x.dataset.char));
      state.writeSelectedChars = [...set];
      renderWriteCharList();
    });
  }

  if (writeListClearSelected) {
    writeListClearSelected.addEventListener("click", () => {
      state.writeSelectedChars = [];
      renderWriteCharList();
    });
  }

  if (writeListPlaySelected) {
    writeListPlaySelected.addEventListener("click", () => {
      playWriteBatchDemo();
    });
  }

  if (writeListStopPlay) {
    writeListStopPlay.addEventListener("click", () => {
      stopWriteBatchDemo();
      if (strokeDemoMsg) strokeDemoMsg.textContent = "已停止批量演示。";
    });
  }

  if (strokeDemoPlay) {
    strokeDemoPlay.addEventListener("click", () => {
      playStrokeDemo(false);
    });
  }

  if (strokeDemoReplay) {
    strokeDemoReplay.addEventListener("click", () => {
      playStrokeDemo(true);
    });
  }

  const writeCheckBtn = document.getElementById("write-check");
  if (writeCheckBtn) {
    writeCheckBtn.addEventListener("click", () => {
      const item = CHAR_MAP.get(writeSelect.value);
      if (!item) return;
      if (strokes.length === 0) {
        writeFeedback.textContent = "请先写字，再进行智能判定。";
        return;
      }

      const size = 96;
      const userCanvas = drawStrokesToCanvas(strokes, 340, size);
      const userCtx = userCanvas.getContext("2d");

      const templateCanvas = document.createElement("canvas");
      templateCanvas.width = size;
      templateCanvas.height = size;
      const templateCtx = templateCanvas.getContext("2d");
      templateCtx.fillStyle = "#fff";
      templateCtx.fillRect(0, 0, size, size);
      templateCtx.fillStyle = "#000";
      templateCtx.font = "76px 'Noto Serif SC'";
      templateCtx.textAlign = "center";
      templateCtx.textBaseline = "middle";
      templateCtx.fillText(item.text, size / 2, size / 2 + 2);

      const userBits = normalizeBits(getBinaryData(userCtx, size), size, size, 10);
      const templateBits = normalizeBits(getBinaryData(templateCtx, size), size, size, 10);
      const result = scoreWriting(userBits, templateBits, size);
      const mlScore = scorePersonalMlForChar(item.text, userBits, size);
      const blendedScore =
        typeof mlScore === "number" ? 0.78 * result.score + 0.22 * mlScore : result.score;
      const pass =
        typeof mlScore === "number" ? blendedScore >= 0.61 || (mlScore >= 0.93 && result.score >= 0.5) : result.pass;
      writeFeedback.textContent = pass ? "判定通过" : "判定未通过";

      scheduleProgress(item, pass);
      if (pass) {
        removeWrongItem(item);
        addPoints(1);
        updateCharMlPrototype(item.text, extractMlFeature(userBits, size));
      } else addWrongItem(item);
      refreshStats();
      rebuildWrongQueue();
    });
  }

  drawGuide();
}

async function init() {
  const storedLang = normalizeLang(localStorage.getItem(LANG_KEY) || "");
  state.lang = storedLang;
  setLanguage(state.lang, false);
  initSpeechEngine();
  initLevelFilter();
  initWriteSelect();
  syncWriteListFromLearnSelection({ resetPage: true });
  setWriteBatchPlaying(false);
  initReviewSettings();
  learnTypeFilter.value = state.learnType;
  wireAuth();
  wireTabs();
  wireLearn();
  wireReview();
  wireWrongBook();
  wireAdmin();
  setupCanvas();
  renderLearnCard();
  renderLearnCharList();
  switchAuthMode("login");

  const session = loadSession();
  if (session && session.loggedIn && session.username && session.role && session.token) {
    try {
      await setAuthState(session.username, session.role, session.token, session);
      return;
    } catch (err) {
      clearSession();
      state.auth = { loggedIn: false, role: "", username: "", token: "", linkedParentUsername: "", linkedChildren: [] };
    }
  }
  authScreen.classList.remove("hidden");
  appShell.classList.add("hidden");
  authMsg.textContent = t("auth.needLogin");
}

init().catch((err) => {
  console.error(err);
  authScreen.classList.remove("hidden");
  appShell.classList.add("hidden");
  authMsg.textContent = "初始化失败，请刷新重试。";
});
