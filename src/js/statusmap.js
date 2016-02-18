
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
                        return "ջ��";
                    }
                    else{
                        this.top++;
                        this.stack[this.top] = elem;
                    }
					*/
                },
                Pop:function(){
                    if(this.top==-1){
                        //return "��ջ,�޷�ɾ��ջ��Ԫ�أ�";
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
                        return "��ջ����Ԫ���޷���ֵ��";
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
     * ��ǰMap��ǰ����
     */
    this.size = function(){
        return this.keys.length;
    }
     
    /**
     * ���ֵ
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
     * ���ݵ�ǰkey��ȡvalue
     * @param {Object} key
     */
    this.get = function(key){
        return this.data[key];
    }
    /**
     * ���ݵ�ǰkey�Ƴ�Map��Ӧֵ
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
     * ���Map
     */
    this.clear = function(){
        for(var i=0, len = this.size(); i < len; i++){
            var key = this.keys[i];
            this.data[key] = null;
        }
        this.keys.length = 0;
    }
    /**
     * ��ǰkey�Ƿ����
     * @param {Object} key
     */
    this.containsKey = function(key){
        return this.data[key] != null;
    }
    /**
     * �Ƿ�Ϊ��
     */
    this.isEmpty = function(){
        return this.keys.length === 0;
    }
    /**
     * ����Java��Map.entrySet
     
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
     * ������ǰMap
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
     * ��ȡMap�� ��ǰkey ����ֵ
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
     * ��ȡMap�е�����valueֵ(Array)
     
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