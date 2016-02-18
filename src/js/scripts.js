// Empty JS for your own code to be here

var globalData = function(){
	//游标
	var _current = 0;
	//前进后退标志
	this._direction = 1;
	this._playFlag=false;
	//keytrace 总数
	this.total= 0;
	//服务端数据
	this.traceList = [];
	//显示数据：
	this.currentAlarms = []; //alarm table
	this.curTrace = "";
	this.currenttime = "";
	this.curzNodes = null; //tree
	this.tabData = null; // status table
	this.curInterval = 300;
	//缓存 current为key
	this.alarmDictionary = {};
	this.alarmList = {};
	this.zNodesList = {};
	this.statusList = {};
	var timestampDictionary = {};
	var root = { "id":"ENB", "pId" : "0", "name" : "ENB", "open" : true, "isParent" : true};
	this.statusCss={};
	this.mostatustable = [];
	this.index = 0;
	
	this.initCssClass=function(){
		statusCss["fail"]="#A00000";
		statusCss["degrade"]="#FFA500";
		statusCss["disable"]="#A00000";
		statusCss["enable"]="#00AA00";
		statusCss["normal"]="#40B3DF";
	}
	this.selectCssClass=function(statusStr){
		           		if(statusStr.indexOf("FAIL")!=-1){
						return "fail";
            			//str= "<b style=\"color:#A00000;\">"+str+"</b>";
            		}else if(statusStr.indexOf("DEG")!=-1){
						return "degrade";
            			//str= "<b style=\"color:#FFFF00;\">"+str+"</b>";
            		}
					else if(statusStr.indexOf("DISABLED")!=-1){
						return "disable";
            			//str= "<b style=\"color:#A00000;\">"+str+"</b>";
            		}
					else if(statusStr.indexOf("ENABLED")!=-1){
						return "enable";
            			//str= "<b style=\"color:#00AA00;\">"+str+"</b>";
            		}
					else{
						return "normal";
            			//str= "<b style=\"color:#40B3DF;\">"+str+"</b>";
            		}
		
	}
	function updateStatusCss(css){
			return statusCss[css];
	}
	this.UpdateIndex = function(){
		if(this.index != _current){
			_current = this.index;
		}
		else{
			_current = _current + (this._direction);	
		}			
		if (_current >= this.total || _current < 0){
			_current = _current - (this._direction);
			return false;
		}
		return true;
	}
	this.InitTrace = function(data){
		var result = eval(data);	
		this.total = result.Endtime;
		console.log(this.total);
		this.traceList = result.traceResult;
		this.curzNodes = root;
		this.zNodesList[-1] = [];
		this.zNodesList[-1].push(root);
		this.statusList[-1] = [];
		for(var i = 0; i <this.total; i++){
			this.putStatus(i);
		}
		//console.log(JSON.stringify(this.statusList));
	}
	this.UpdateWebData = function() {
		console.log(_current);
		this.curTrace = this.traceList[_current];
		this.currenttime = this.curTrace['timestamp'];	
		this.keyTrace = this.curTrace['keyTrace'];
		this.index = _current;
		//console.log(_current);
		//如果已经存在：
		/*
		if(!this.statusList.hasOwnProperty(_current)){
			for(var i = 0; i <= _current; i++){
				this.putStatus(i);
			}
		}*/
		this.tabData = this.statusList[_current];
		this.curzNodes = this.zNodesList[_current];
	}
	this.getStatus = function(mo){
		//console.log(mo);
		if(_statusMap.get(mo)){
			return _statusMap.get(mo).Top();
		}
		return null;
	}
	
	
	this.toTime = function(timestamp) {
		
	}

	this.putNewTimeAlarm = function(i, mo, isAppear, alarmId, alarmSummary){
		var prestatuses = {};
		var alarms = null;
		var prestatus = null;
		
 		if(this.statusList.hasOwnProperty(i-1)){
			prestatuses = this.deepCopy(this.statusList[i-1]);
			if(prestatuses.hasOwnProperty(mo)){
				alarms = prestatuses[mo].alarms;
				prestatus = prestatuses[mo].status;
			}
		}
		//prestatuses[mo] = new StatusType(state, alarms);
		var alarm = new AlarmType(mo, alarmId, alarmSummary);
		
		if( isAppear == "DISAPP"){
			if(alarms != null){
				var index = alarms.indexOf(alarmId);
				if(index != -1){
					alarms.splice(index, 1);
				}			
				prestatuses[mo] = new StatusType(prestatus, alarms);
			}/*
			if(this.alarmList.length > 1){
				var alarmtabledata = this.alarmList[this.alarmList.length-1];
				var index = alarmtabledata.indexOf(alarm);
				if(index != -1){
					alarmtabledata.splice(index, 1);
				}		
				this.alarmList[i] = alarmtabledata;
			}*/			
		}
		else if( isAppear == "APPEAR"){
				//console.log(alarmlist);
				//this.data[key].Push(new StatusType(status.status, alarmlist));
			if(alarms != null){
				var index = alarms.indexOf(alarm);
				if(index == -1){
					prestatuses[mo] = new StatusType(prestatus, alarmId);
				}				
			}
			else{
				prestatuses[mo] = new StatusType(prestatus, alarmId);
			}/*
			if(this.alarmList.length > 1){
				var alarmtabledata = this.alarmList[this.alarmList.length-1];
				var index = alarmtabledata.indexOf(alarm);
				if(index != -1){
					alarmtabledata.splice(index, 1);
				}		
				this.alarmList[i] = alarmtabledata;
			}*/			
		}
		this.statusList[i] = prestatuses;
		return prestatuses[mo];
	}
	
	this.putNewTimeStatus = function(i, mo, state){
		var prestatuses = {};
		var alarms = null;
 		if(this.statusList.hasOwnProperty(i-1)){
			prestatuses = this.deepCopy(this.statusList[i-1]);
			if(prestatuses.hasOwnProperty(mo)){
				alarms = prestatuses[mo].alarms;
			}			
		}
		prestatuses[mo] = new StatusType(state, alarms);
		this.statusList[i] = prestatuses;
		return prestatuses[mo];
	}
	
	this.putStatus = function(i){
		var trace = this.traceList[i];
		var timestamp = trace['timestamp'];
		timestampDictionary[timestamp] = i;	
		var zNodes = this.zNodesList[i-1].slice(0); //znodes有0
		if("alarm" in trace){
			var mo = trace['MO'];
			//console.log(mo);
			var isAppear = trace['alarm']['alarmStatus'];
			var alarmId = trace['alarm']['alarmid'];
			var alarmSummary = trace['alarm']['alarmSummary'];
			this.alarmDictionary[alarmId] = alarmSummary;

			//if(!this.mostatustable.hasOwnProperty(mo)){
			//	this.mostatustable[mo] = new Array();
			//}			
			var retStatus = this.putNewTimeAlarm(i, mo, isAppear, alarmId, alarmSummary);
			if(this.mostatustable.hasOwnProperty(mo)){
				this.mostatustable[mo].push({"timestamp":timestamp, "status":retStatus});
			}	
		}		
		else if("status" in trace){
			var mo = trace['MO'];
			var state = trace['status']['status'].toString();
			//console.log(mo);
			//var color=updateStatusCss(selectCssClass(state));
			//this.keyTrace = trace['keyTrace'];
			if(!this.mostatustable.hasOwnProperty(mo)){
				this.mostatustable[mo] = new Array();
			}			
			var retStatus = this.putNewTimeStatus(i, mo, state);
			this.mostatustable[mo].push({"timestamp":timestamp, "status":retStatus});
			
		}else if("cellinfo" in trace){
			this.statusList[i] = this.deepCopy(this.statusList[i-1]);			
			var cellId = trace["cellinfo"]['CELL'];
			var isCellFound = false;
			var isChildFound = false;
			var isParentFound = false;
			var isMas = false;
			var parentId = "";
			var childId = "";
			var mbId = "";
			for(var value in trace["cellinfo"]){
				if(value == "CELL"){
					cellId = trace["cellinfo"]['CELL'];
				}
				else if(value == "AP"){
					childId = trace["cellinfo"]['AP'];
					parentId = trace["cellinfo"]['RRH'];
				}
				else if(value=="SLICE"){					
					parentId = trace["cellinfo"]['MAS'];
					childId = trace["cellinfo"]['SLICE'];
					mbId = "MB("+ parentId.substr(4,3)+"000)"; //MB(302000)
					isMas = true;
					console.log(mbId);
					//console.log(childId);
				}
			}	
			
			for(var j=0; j<zNodes.length; j++){
				if(zNodes[j].id == cellId){
					isCellFound = true;
				}
				if(zNodes[j].id == cellId+childId){
					isChildFound = true;
				}
				if(zNodes[j].id == cellId+parentId){
					isParentFound = true;
				}
			}
			if(!isCellFound){
				var value = cellId +　"<span name=" + cellId +"_status></span>";
				zNodes.push({"id" : cellId, "pId":"ENB","name":value,"isParent":true, open:true});
				//CfgMgrCB_LRD(101000)
				value = "CB(101000)" +　"<span name=" + "CFGMGRCB_LRD(101000)" +"_status></span>";
				zNodes.push({"id" : "CFGMGRCB_LRD(101000)", "pId":cellId,"name":value,"isParent":false, open:true});
			}
			if(!isParentFound){
				if(isMas){
					var value = mbId +　"<span name=" + mbId +"_status></span>";
					zNodes.push({"id" : cellId+mbId, "pId":cellId,"name":value,"isParent":true,open:true});
					//console.log(value);
					value = parentId +　"<span name=" + parentId +"_status></span>";
					zNodes.push({"id" : cellId+parentId, "pId":cellId+mbId,"name":value,"isParent":true,open:true});
					
				}
				else{
					var value = parentId +　"<span name=" + parentId +"_status></span>";
					zNodes.push({"id" : cellId+parentId, "pId":cellId,"name":value,"isParent":true,open:true});
				}

				//console.log(cellId+parentId);
			}
			if(!isChildFound){
				var value = childId +　"<span name=" + parentId + "_" + childId +"_status></span>";
				zNodes.push({"id" : cellId+childId, "pId":cellId+parentId,"name":value,open:true});
				//console.log(cellId+childId);
			}
		}
		this.zNodesList[i] = zNodes;
	}
	this.deepCopy = function(source){
		var cloneObject ={};
		for (var key in source){
			if(source.hasOwnProperty(key)) {
			cloneObject[key] = source[key];
			}
		}
		return cloneObject;
	}
}