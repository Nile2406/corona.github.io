document.addEventListener('DOMContentLoaded',()=>
  {
   load=undefined;
   infos=new Map();
   allStates=[];
   spn=document.querySelector('span');
   const request=new XMLHttpRequest();
   request.open('GET','https://covidnigeria.herokuapp.com/api');
   
   request.onprogress=()=>
   {
     //Code to run when request is being handled.
     loader(spn);
   }
     
   request.onload=()=>
   {
     stat= request.status==200 ? true : false ;
     if(stat)
     {
      response=request.responseText;
      datas=JSON.parse(response);
      // For Nigeria.
      cases=datas.data.totalSamplesTested;
      confirmed=datas.data.totalConfirmedCases;
      active=datas.data.totalActiveCases;
      discharged=datas.data.discharged;
      death=datas.data.death;
    
      //Per state.
      states=datas.data.states;
      for (state of states)
      {
        allStates.push(state.state.toLowerCase());
        infos.set(state.state.toLowerCase(),
        {
          'state':state.state,
          'cases':state.confirmedCases,
          'admitted':state.casesOnAdmission,
          'discharged':state.discharged,
          'dead':state.death
        });
      }
      clearInterval(load);
     for(state of allStates) document.querySelector("#base").appendChild(perState(infos.get(state)));
     }
       
     else { /*Code to run if request wasn't successfull*/
           spn.innerHTML='Network error, could no fetch data';}
    }
    request.onerror=()=>{
      spn.innerHTML='Network error, could no fetch data';
    }
    request.send();
   });
 
perState=(val)=>
{
  b='&#x2022';
  post=document.createElement('div');
  post.className='sub';
  template=`<h3>${val.state} State.</h3>`
           +'<ul>'
           +`<li> Cases : ${val.cases}</li>`
           +`<li> Admitted : ${val.admitted}</li>`
           +`<li> Discharged : ${val.discharged}</li>`
           +`<li> Death : ${val.dead}</li>`
           +'</ul>';
 
  post.innerHTML=template;
  return post;
}
      

loader=(elem)=>
 {
    b='&#x2022';
    var itr=0;
    const loading=[`${b}` ,`${b} ${b}`,`${b} ${b} ${b}`];
    start=setInterval(()=>
    {
        elem.innerHTML=loading[itr++];
        itr= itr==3 ? 0 : itr;
    },1000);
    return start;
 }