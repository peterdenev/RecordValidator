(function (root, factory) { // UMD from https://github.com/umdjs/umd/blob/master/returnExports.js
    if(typeof define === 'function' && define.amd) {
        define('RecordValidator', [], factory);
    }else if (typeof exports === 'object') {
        module.exports = factory();
    } else { // Browser globals
        root.RecordValidator = factory();
    }
}(this, function () {

	function chechRecordProp(record_i, elToCheck_i){
		var tmpRez = true;						
		if(typeof elToCheck_i !== 'undefined'){					
			if(typeof record_i === 'string'){
				//just check
				tmpRez = typeof elToCheck_i === record_i;
				if(tmpRez!==true){
					tmpRez = 'Must be '+record_i+', but '+(typeof elToCheck_i)+' given!'
				}
			}else if(Array.isArray(record_i)){
				//check all array items for current type
				if(Array.isArray(elToCheck_i)){							
					tmpRez = nestedArrRecord(record_i, elToCheck_i);										
				}else{
					tmpRez = 'is not an array';
				}
			}else if(typeof record_i === 'object'){	
				//check	all inner items' types
				if(typeof elToCheck_i === 'object'){
					tmpRez = checkRecord(record_i, elToCheck_i);
				}else{
					tmpRez = 'is not an Object';
				}
			//}else if(['object','function'].indexOf(typeof elToCheck_i)!==-1 && typeof record_i=='function'){
			}else if(typeof record_i=='function'){
				tmpRez = elToCheck_i instanceof record_i;
				if(tmpRez!==true){
					tmpRez = 'Must be instance of '+record_i.name;
				}
			}else{
				tmpRez = (typeof record_i)+' This record type is not implemented!';
			}
							
		}else{				
			tmpRez = ' does not exits!';
		}
		
		return tmpRez;
	}

	function checkRecord(record, elToCheck){		
		var tmpRez = true;	
		if(Array.isArray(record) || typeof record === 'object'){
			for(var i in record){		
				tmpRez = chechRecordProp(record[i], elToCheck[i]);
				if(tmpRez!==true){						
					tmpRez = '.'+i +' '+ tmpRez;
					break;
				}
			}
		}else{
			tmpRez = chechRecordProp(record, elToCheck);
			if(tmpRez!==true){					
				tmpRez = ' '+ tmpRez;					
			}
		}
		return tmpRez;
	}

	function nestedArrRecord(record,elToCheck){
		var tmpRez = true;
		var key='';		
		record = Array.isArray(record) ? record : [record]; // needed or not?		
		if(record.length==1){ // can be called chechRecordProp, but there will be more "if"-s (slow)
			//loop all elToCheck items
			if(typeof record[0] === 'string'){
				for(var j=0; j<elToCheck.length; j++){					
					tmpRez = typeof elToCheck[j] === record[0];
					if(tmpRez!==true){
						tmpRez = 'Must be '+record[0]+', but '+(typeof elToCheck[j])+' given!'									
						break;
					}
				}
			}else if(Array.isArray(record[0])){				
				for(var j=0; j<elToCheck.length; j++){
					tmpRez = nestedArrRecord(record[0], elToCheck[j]);
					if(tmpRez!==true){											
						break;
					}					
				}
			}else if(typeof record[0] === 'object'){
				for(var j=0; j<elToCheck.length; j++){
					tmpRez = checkRecord(record[0], elToCheck[j]);
					if(tmpRez!==true){	
						break;
					}
				}						
			}
		}else{
			//loop record indexes
			for(var r=0; r<record.length; r++){				
				tmpRez = checkRecord(record[r],elToCheck[r]);
				if(tmpRez!==true){
					key = '.'+r+' ';									
					break;
				}
			}
		}
		return tmpRez===true ? true : (key+tmpRez);
	}

	function buildChecker(record){
		return function(elToCheck){
			return checkRecord(record, elToCheck);
		}
	}

	return {
		check: checkRecord,
		buildChecker: buildChecker,
	}
}));