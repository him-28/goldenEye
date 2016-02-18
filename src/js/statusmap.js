
function StatusType(status, alarmid) {
    this.status = status;
    this.alarms = new Array();
	if(alarmid != null){
		this.alarms = this.alarms.concat(alarmid);
	}
}

function AlarmType(mo, alarmid, alarmSummary) {
    this.mo = mo;
    this.alarmid = alarmid;
	this.alarmSummary = alarmSummary;
}


//status map 
var Stack = function(){}      
            Stack.prototype={
                Init:function(){
                    //this.STACKMAX = 100;
                    //this.stack = new Array(this.STACKMACK);
					this.stack = new Array();
                    this.top = -1;
                    return this.stack;
                },
                Empty:function(){
                    if(this.top==-1){
                        return true;
                    }
                    else{
                        return false;
                    }
                },
                Push:function(elem){
					this.top++;
                    this.stack[this.top] = elem;
					/*
                    if(this.top==this.STACKMAX-1){
                        return "栈满";
                    }
                    else{
                        this.top++;
                        this.stack[this.top] = elem;
                    }
					*/
                },
                Pop:function(){
                    if(this.top==-1){
                        //return "空栈,无法删除栈顶元素！";
						return null;
                    }
                    else{
                        var x = this.stack[this.top];
                        this.top--;
                        return x;
                    }
                },
                Top:function(){
                    if(this.top!=-1){
                        return this.stack[this.top];
                    }
                    else{
                        return "空栈，顶元素无返回值！";
                    }
                },
                Clear:function(){
                    this.top=-1;
                },
                Length:function(){
                    return this.top+1;
                }
            }
			
			
function StatusMap(){
 
    this.keys = new Array(); 
     
    this.data = new Object();
     
    var toString = Object.prototype.toString;
     
    /**
     * 当前Map当前长度
     */
    this.size = function(){
        return this.keys.length;
    }
     
    /**
     * 添加值
     * @param {Object} key
     * @param {Object} value
     */
	this.put = function(key, value){
        if(this.data[key] == null){
            this.data[key] = new Stack();
			this.data[key].Init();
        }
        this.keys.push(key);
		this.data[key].Push(value);
    }
	
    this.putStatus = function(key, value){
        if(this.data[key] == null){
            this.data[key] = new Stack();
			this.data[key].Init();
			this.keys.push(key);
			var status = new StatusType(value, null);
			this.data[key].Push(status);
        }
		else{
			var status = this.data[key].Top();
			this.data[key].Push(new StatusType(value, status.alarms));
		}

    }
	
	this.putAlarm = function(key, alarmid){
        if(this.data[key] == null){
            this.data[key] = new Stack();
			this.data[key].Init();
			this.keys.push(key);
			this.data[key].Push(new StatusType("", alarmid));
        }
		else{			
			var status = this.data[key].Top();
			var index = status.alarms.indexOf(alarmid);
			if(index != -1){
				this.data[key].Push(status);
			}
			else{
				var alarmlist = status.alarms;
				alarmlist.push(alarmid);
				//console.log(alarmlist);
				this.data[key].Push(new StatusType(status.status, alarmlist));
				//console.log("add alarm!!!");
			}	
		}

    }
	
	this.removeAlarm = function(key, alarmid){
        if(this.data[key] == null){
            this.data[key] = new Stack();
			this.data[key].Init();
			this.keys.push(key);
			this.data[key].Push(new StatusType("", null));
        }
		else{
			var status = this.data[key].Top();
			var index = status.alarms.indexOf(alarmid);
			if(index != -1){
				status.alarms.splice(index, 1);
				this.data[key].Push(status);
			}
			else{
				this.data[key].Push(status);
			}	
		}

    }
    /**
     * 根据当前key获取value
     * @param {Object} key
     */
    this.get = function(key){
        return this.data[key];
    }
    /**
     * 根据当前key移除Map对应值
     * @param {Object} key
     */
    this.remove = function(key){
        var index = this.indexOf(key);
        if(index != -1){
            this.keys.splice(index, 1);
        }
		delete this.data[key];
        this.data[key] = null;
    }
    /**
     * 清空Map
     */
    this.clear = function(){
        for(var i=0, len = this.size(); i < len; i++){
            var key = this.keys[i];
            this.data[key] = null;
        }
        this.keys.length = 0;
    }
    /**
     * 当前key是否存在
     * @param {Object} key
     */
    this.containsKey = function(key){
        return this.data[key] != null;
    }
    /**
     * 是否为空
     */
    this.isEmpty = function(){
        return this.keys.length === 0;
    }
    /**
     * 类型Java中Map.entrySet
     
    this.entrySet = function(){
        var size = this.size();
        var datas = new Array(size);
        for (var i = 0, len = size; i < len; i++) {
            var key = this.keys[i];
            var value = this.data[key];
            datas[i] = {
                'key' : key,
                'value':value   
            }
        }
        return datas;
    }*/
    /**
     * 遍历当前Map
     * var map = new Map();
     * map.put('key', 'value');
     * map.each(function(index, key, value){
     *      console.log("index:" + index + "--key:" + key + "--value:" + value)
     * })
     * @param {Object} fn
     
    this.each = function(fn){
        if(toString.call(fn) === '[object Function]'){
            for (var i = 0, len = this.size(); i < len; i++) {
                var key = this.keys[i];
                fn(i, key, this.data[key]);
            }
        }
        return null;
    }*/
    /**
     * 获取Map中 当前key 索引值
     * @param {Object} key
     
    this.indexOf = function(key){
        var size = this.size();
        if(size > 0){
            for(var i=0, len=size; i < len; i++){
                if(this.keys[i] == key)
                return i;
            }
        }
        return -1;
    }*/
    /**
     * Override toString
     
    this.toString = function(){
        var str = "{";
        for (var i = 0, len = this.size(); i < len; i++, str+=",") {
            var key = this.keys[i];
            var value = this.data[key];
            str += key + "=" + value; 
        }
        str = str.substring(0, str.length-1);
        str += "}";
        return str;
    }*/
    /**
     * 获取Map中的所有value值(Array)
     
    this.values = function(){
        var size = this.size();
        var values = new Array();
        for(var i = 0; i < size; i++){
            var key = this.keys[i];
            values.push(this.data[key]);
        }
        return values;
    }*/
     
}