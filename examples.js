//-----------BASICS-------------

//single var check
console.log(RecordValidator.check( 'number', 42 ));
//array of type
console.log(RecordValidator.check( ['number'], [42,23,34] ));
//mixed array
console.log(RecordValidator.check( ['number','string'], [42,'some text'] ));
//mixed array with missing any (middle) element
console.log(RecordValidator.check( 
	['number', ,'number'], 
	[42, 'this element can be any type', 23, 'not mentioned elements are allowed'] 
));

//any array
console.log(RecordValidator.check( [], [42,'as'] ));
console.log(RecordValidator.check( Array, [42,'as'] ));
//any object
console.log(RecordValidator.check( {}, {'a':42} ));
console.log(RecordValidator.check( Object, {'a':42} ));
//any function
console.log(RecordValidator.check( 'function', function(){} ));
console.log(RecordValidator.check( Function, function(){} ));

//instance of
function Person(){};
var p = new Person();

console.log(RecordValidator.check( Object, p));		
console.log(RecordValidator.check( Person, p ));

//try to parse before check
//set some parse implementation for "number"
/*
* @param data - field value to be parsed
* @return parsed value or throw error for unsuccess parse
*/
RecordValidator.parseImpls.number = function(data){
	var res = parseInt(data);
	if((res+'').length!=data.length){
		throw new Error('Not all characters are numbers')
	}else if(res=='NaN'){
		throw new Error('Not a number')
	}
	return res;
}
console.log(RecordValidator.check( 'parse-number', "42" ));

//---------ADVANCED / MIXED------------
console.log(RecordValidator.check( 
	{
		a: 'number',
		b: 'string',
		c: ['number'],
		d: {
			d1:'string',
			d2:'number'
		}
	}, 
	{
		a: 1,
		b: 'text here',
		c: [1,2,3],
		d: {
			d1:'other text',
			d2: 42
		}
	} 
));

//------- USE CASES -----------

//arguments check
function sum(a, b){
	if(RecordValidator.check(['number','number'],arguments)===true){
		return a+b;
	}
}
console.log( sum(1,2)==3 );

// db model

var UserModel = {
	id: 'number',
	first_name: 'string',
	last_name: 'string',
	children: [],
	projects: [
		{
			id: 'number',
			name: 'string'					
		}
	]
}
//can be recursive
UserModel.children = [UserModel];

var user1 = {
	id: 1,
	first_name: 'John',
	last_name: 'Doe',
	children: [
		{
			id: 2,
			first_name: 'Jane',
			last_name: 'Doe',
			children: [],
			projects: []
		},
		{
			id: 3,
			first_name: 'Mary',
			last_name: 'Doe',
			children: [],
			projects: [] 
		}
	],
	projects: [
		{
			id: 1,
			name: 'proj 1'					
		},
		{
			id: 2,
			name: 'proj 2'					
		}
	]
}

//N.B! if Array must have some inner elements empty array will return true!
console.log(RecordValidator.check(UserModel, user1));

//USE BUILDER (for minimized and capsulated checkers)
var UserModelChecker = RecordValidator.buildChecker(UserModel);
console.log(UserModelChecker(user1));


//long complex test
		
var schema1 = {
	'a': 'number',
	'b': 'number',
	'c': {
		'c1':'string',
		'c2':{
			'c21': 'number',
			'c22': ['number'],
			'c23': [{
				'c231':'string',
				'c232':'number'
			}],
			'c24': [
				['number']
			]
		}
	},
	'd': ['string'],
	'g': [
		[
			['number']
		]
	],
	h: Person,
	u: 'function',
	i: ['number','string'],
	j: [
		['number',,'string'],
		'number',
		{
			j1:'string',
			j2:['number']
		}
	]
}

var testVar = {
	'a':1,
	'b':2,
	'c':{
		'c1':'ada',
		'c2': {
			'c21': 3,
			'c22': [1,2,3],
			'c23': [
				{'c231':'asd', 'c232':2},
				{'c231':'sss', 'c232':4},						
			],
			'c24': [
				[2,2],
				[3,4],
			]
		}
	},
	'e':'aa',
	'd': ['ad','ad'],
	'g': [
		[
			[1,3,3],
			[4,5],
		],
		[
			[6,7]
		]
	],
	h: p,
	u: function(){},
	i: [3,'sd',4],
	j: [
		[1,3,'ss'],
		2,
		{
			j1:'asd',
			j2: [1,2,3]
		}
	]
}



console.log(RecordValidator.check(schema1, testVar));