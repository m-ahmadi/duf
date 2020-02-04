export default [
	{ id: 1,   parent: '#', node: 'سهام عادی' },
	{ id: 300, parent: 1,   node: 'سهام' },
	{ id: 303, parent: 1,   node: 'آتیسی' },
	{ id: 309, parent: 1,   node: 'پایه' },
	{ id: 307, parent: 1,   node: 'تسهیلات فرابورس' },
	{ id: 313, parent: 1,   node: 'شرکتهای کوچک و متوسط' },
	{ id: 304, parent: 1,   node: 'آتی' },
	{ id: 311, parent: 1,   node: 'اختیار خرید' },
	{ id: 312, parent: 1,   node: 'اختیار فروش' },
	
	{ id: 2,   parent: '#', node: 'شاخص' },
	{ id: 68,  parent: 2,   node: 'شاخص' },
	{ id: 69,  parent: 2,   node: 'شاخص فرابورس' },
	{ id: 67,  parent: 2,   node: 'شاخص قیمت' },
	
	{ id: 3,   parent: '#', node: 'حق تقدم' },
	{ id: 400, parent: 3,   node: 'حق تقدم سهم' },
	{ id: 404, parent: 3,   node: 'حق تقدم پایه' },
	{ id: 403, parent: 3,   node: 'حق تقدم آتیسی' },
	
	{ id: 4,   parent: '#', node: 'اوراق مشاركت'},
	{ id: 306, parent: 4,   node: 'اوراق مشارکت آتیسی' },
	{ id: 208, parent: 4,   node: 'اوراق صكوك' },
	{ id: 706, parent: 4,   node: 'صکوک اختصاصی', alias: [70] },
	{ id: 200, parent: 4,   node: 'اوراق مشارکت انرژی' },
	{ id: 207, parent: 4,   node: 'اوراق مشارکت ارز صادراتی' },
	{ id: 301, parent: 4,   node: 'اوراق مشارکت' },
	{ id: 308, parent: 4,   node: 'اوراق مشارکت کالا' },
	
	{ id: 5,   parent: '#', node: 'صندوق سرمايه گذاري' },
	{ id: 305, parent: 5,   node: 'صندوق سرمايه گذاري در سهام بورس' },
	{ id: 315, parent: 5,   node: 'صندوق سرمایه گذاری قابل معامله انرژی' },
	
	{ id: 6,   parent: '#', node: 'اختیار' },
	{ id: 322, parent: 6,   node: 'اختیار خ اخزا (اسناد خزانه داری اسلامی)' },
	{ id: 323, parent: 6,   node: 'اختیارف اخزا (اسناد خزانه داری اسلامی)' },
	{ id: 321, parent: 6,   node: 'اختیار فولاد هرمزگان' },
	{ id: 601, parent: 6,   node: 'اختیار فروش تبعی (ذوب آهن اصفهان)' },
	{ id: 600, parent: 6,   node: 'اختیار فروش تبعی' },
	{ id: 602, parent: 6,   node: 'اختیار فروش تبعی فرابورس' },
	
	{ id: 903, parent: '#', node: 'دارایی فکری' },
	{ id: 701, parent: '#', node: 'گواهی سپرده کالایی' },
	{ id: 901, parent: '#', node: 'انرژی', alias: [902] },
	{ id: 801, parent: '#', node: 'سلف بورس انرژی', alias: [802,803,804] }
]