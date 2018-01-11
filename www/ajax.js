function ajax(obj){
    let opt = {
        url:'',
        data:{},
        method:'get',
        success:function(){},
        error:function(){},
        dataType:'json'
    }

    Object.assign(opt,obj);

    const ajax = new XMLHttpRequest;

    let arr = [];
    let str = '';
    for(var attr in opt.data){
        arr.push(attr+'='+opt.data[attr]);
        /*
            [user=momo,pass=123]
        */
    }
    str = arr.join('&'); //user=momo&pass=123


    if(opt.method === 'get'){
        ajax.open('get',opt.url + '?'+ str);
        ajax.onreadystatechange = fn;
        ajax.send();
    }else if(opt.method === 'post'){
        ajax.open('post',opt.url);
        ajax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        ajax.onreadystatechange = fn;
        ajax.send(str);
    }
    
    function fn(){
        if(ajax.readyState === 4){
            if(ajax.status >= 200 && ajax.status <= 207){
                if(opt.dataType === 'json'){
                    opt.success(JSON.parse(ajax.responseText));
                }else if(opt.dataType === 'xml'){
                    opt.success(ajax.responseXML);
                }else{
                    opt.success(ajax.responseText);
                }
            }else{
                opt.error(ajax.status);
            }
        }
    }
}