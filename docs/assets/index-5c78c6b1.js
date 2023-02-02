import{R as a,r as n,j as c}from"./index-a3b6d2d0.js";import{S as b,P as d,B as w,M as i,a as y,W as m}from"./three-3ef9bf77.js";import{u}from"./useClass-051d4e64.js";const f="_absolute_20txh_1",p="_relative_20txh_5",v="_fixed_20txh_9",g="_sticky_20txh_13",j="_none_20txh_17",k="_flex_20txh_21",B="_b_20txh_234",C="_border_20txh_359",E="_shadow_20txh_368",M="_clearfix_20txh_855",W={absolute:f,relative:p,fixed:v,sticky:g,none:j,flex:k,"flex-1":"_flex-1_20txh_25","flex-direction-column":"_flex-direction-column_20txh_29","flex-1-hidden":"_flex-1-hidden_20txh_33","flex-1-auto":"_flex-1-auto_20txh_38","flex-1-overlay":"_flex-1-overlay_20txh_43","flex-column":"_flex-column_20txh_48","justify-start":"_justify-start_20txh_54","align-start":"_align-start_20txh_58","start-start":"_start-start_20txh_62","start-center":"_start-center_20txh_67","start-end":"_start-end_20txh_72","start-stretch":"_start-stretch_20txh_77","start-between":"_start-between_20txh_82","start-around":"_start-around_20txh_87","start-evenly":"_start-evenly_20txh_92","justify-center":"_justify-center_20txh_97","align-center":"_align-center_20txh_101","center-start":"_center-start_20txh_105","center-center":"_center-center_20txh_110","center-end":"_center-end_20txh_115","center-stretch":"_center-stretch_20txh_120","center-between":"_center-between_20txh_125","center-around":"_center-around_20txh_130","center-evenly":"_center-evenly_20txh_135","justify-end":"_justify-end_20txh_140","align-end":"_align-end_20txh_144","end-start":"_end-start_20txh_148","end-center":"_end-center_20txh_153","end-end":"_end-end_20txh_158","end-stretch":"_end-stretch_20txh_163","end-between":"_end-between_20txh_168","end-around":"_end-around_20txh_173","end-evenly":"_end-evenly_20txh_178","justify-stretch":"_justify-stretch_20txh_183","align-stretch":"_align-stretch_20txh_187","stretch-start":"_stretch-start_20txh_191","stretch-center":"_stretch-center_20txh_196","stretch-end":"_stretch-end_20txh_201","stretch-stretch":"_stretch-stretch_20txh_206","stretch-between":"_stretch-between_20txh_211","stretch-around":"_stretch-around_20txh_216","stretch-evenly":"_stretch-evenly_20txh_221","justify-between":"_justify-between_20txh_226","align-between":"_align-between_20txh_230","between-start":"_between-start_20txh_234","between-center":"_between-center_20txh_239","between-end":"_between-end_20txh_244","between-stretch":"_between-stretch_20txh_249","between-between":"_between-between_20txh_254","between-around":"_between-around_20txh_259","between-evenly":"_between-evenly_20txh_264","justify-around":"_justify-around_20txh_269","align-around":"_align-around_20txh_273","around-start":"_around-start_20txh_277","around-center":"_around-center_20txh_282","around-end":"_around-end_20txh_287","around-stretch":"_around-stretch_20txh_292","around-between":"_around-between_20txh_297","around-around":"_around-around_20txh_302","around-evenly":"_around-evenly_20txh_307","justify-evenly":"_justify-evenly_20txh_312","align-evenly":"_align-evenly_20txh_316","evenly-start":"_evenly-start_20txh_320","evenly-center":"_evenly-center_20txh_325","evenly-end":"_evenly-end_20txh_330","evenly-stretch":"_evenly-stretch_20txh_335","evenly-between":"_evenly-between_20txh_340","evenly-around":"_evenly-around_20txh_345","evenly-evenly":"_evenly-evenly_20txh_350",b:B,border:C,"m-center":"_m-center_20txh_363",shadow:E,"w-25":"_w-25_20txh_372","w-25w":"_w-25w_20txh_376","h-25":"_h-25_20txh_380","h-25h":"_h-25h_20txh_384","wh-25":"_wh-25_20txh_388","w-50":"_w-50_20txh_393","w-50w":"_w-50w_20txh_397","h-50":"_h-50_20txh_401","h-50h":"_h-50h_20txh_405","wh-50":"_wh-50_20txh_409","w-75":"_w-75_20txh_414","w-75w":"_w-75w_20txh_418","h-75":"_h-75_20txh_422","h-75h":"_h-75h_20txh_426","wh-75":"_wh-75_20txh_430","w-100":"_w-100_20txh_435","w-100w":"_w-100w_20txh_439","h-100":"_h-100_20txh_443","h-100h":"_h-100h_20txh_447","wh-100":"_wh-100_20txh_451","p-0":"_p-0_20txh_456","px-0":"_px-0_20txh_460","py-0":"_py-0_20txh_464","pt-0":"_pt-0_20txh_468","pr-0":"_pr-0_20txh_472","pb-0":"_pb-0_20txh_476","pl-0":"_pl-0_20txh_480","p-1":"_p-1_20txh_484","px-1":"_px-1_20txh_488","py-1":"_py-1_20txh_492","pt-1":"_pt-1_20txh_496","pr-1":"_pr-1_20txh_500","pb-1":"_pb-1_20txh_504","pl-1":"_pl-1_20txh_508","p-2":"_p-2_20txh_512","px-2":"_px-2_20txh_516","py-2":"_py-2_20txh_520","pt-2":"_pt-2_20txh_524","pr-2":"_pr-2_20txh_528","pb-2":"_pb-2_20txh_532","pl-2":"_pl-2_20txh_536","p-3":"_p-3_20txh_540","px-3":"_px-3_20txh_544","py-3":"_py-3_20txh_548","pt-3":"_pt-3_20txh_552","pr-3":"_pr-3_20txh_556","pb-3":"_pb-3_20txh_560","pl-3":"_pl-3_20txh_564","b-0":"_b-0_20txh_568","bx-0":"_bx-0_20txh_572","by-0":"_by-0_20txh_576","bt-0":"_bt-0_20txh_580","br-0":"_br-0_20txh_584","bb-0":"_bb-0_20txh_588","bl-0":"_bl-0_20txh_592","b-1":"_b-1_20txh_596","bx-1":"_bx-1_20txh_600","by-1":"_by-1_20txh_604","bt-1":"_bt-1_20txh_608","br-1":"_br-1_20txh_612","bb-1":"_bb-1_20txh_616","bl-1":"_bl-1_20txh_620","b-2":"_b-2_20txh_624","bx-2":"_bx-2_20txh_628","by-2":"_by-2_20txh_632","bt-2":"_bt-2_20txh_636","br-2":"_br-2_20txh_640","bb-2":"_bb-2_20txh_644","bl-2":"_bl-2_20txh_648","b-3":"_b-3_20txh_652","bx-3":"_bx-3_20txh_656","by-3":"_by-3_20txh_660","bt-3":"_bt-3_20txh_664","br-3":"_br-3_20txh_668","bb-3":"_bb-3_20txh_672","bl-3":"_bl-3_20txh_676","m-0":"_m-0_20txh_680","mx-0":"_mx-0_20txh_684","my-0":"_my-0_20txh_688","mt-0":"_mt-0_20txh_692","mr-0":"_mr-0_20txh_696","mb-0":"_mb-0_20txh_700","ml-0":"_ml-0_20txh_704","m-1":"_m-1_20txh_708","mx-1":"_mx-1_20txh_712","my-1":"_my-1_20txh_716","mt-1":"_mt-1_20txh_720","mr-1":"_mr-1_20txh_724","mb-1":"_mb-1_20txh_728","ml-1":"_ml-1_20txh_732","m-2":"_m-2_20txh_736","mx-2":"_mx-2_20txh_740","my-2":"_my-2_20txh_744","mt-2":"_mt-2_20txh_748","mr-2":"_mr-2_20txh_752","mb-2":"_mb-2_20txh_756","ml-2":"_ml-2_20txh_760","m-3":"_m-3_20txh_764","mx-3":"_mx-3_20txh_768","my-3":"_my-3_20txh_772","mt-3":"_mt-3_20txh_776","mr-3":"_mr-3_20txh_780","mb-3":"_mb-3_20txh_784","ml-3":"_ml-3_20txh_788","bgc-pirmary":"_bgc-pirmary_20txh_792","bgc-success":"_bgc-success_20txh_796","bgc-warning":"_bgc-warning_20txh_800","bgc-danger":"_bgc-danger_20txh_804","bgc-info":"_bgc-info_20txh_808","bgc-dark-fill":"_bgc-dark-fill_20txh_812","overflow-x-auto":"_overflow-x-auto_20txh_816","overflow-x-hidden":"_overflow-x-hidden_20txh_821","overflow-x-scroll":"_overflow-x-scroll_20txh_825","overflow-y-auto":"_overflow-y-auto_20txh_829","overflow-y-hidden":"_overflow-y-hidden_20txh_834","overflow-y-scroll":"_overflow-y-scroll_20txh_838","overflow-hidden":"_overflow-hidden_20txh_842","overflow-auto":"_overflow-auto_20txh_846","overflow-scroll":"_overflow-scroll_20txh_851",clearfix:M,"float-left":"_float-left_20txh_861","float-right":"_float-right_20txh_865","vis-hidden":"_vis-hidden_20txh_869","text-center":"_text-center_20txh_873","text-end":"_text-end_20txh_877","text-primary":"_text-primary_20txh_881","text-success":"_text-success_20txh_885","text-warning":"_text-warning_20txh_889","text-danger":"_text-danger_20txh_893","text-info":"_text-info_20txh_897","text-black":"_text-black_20txh_901","text-white":"_text-white_20txh_905"};function G(){const r=u(W),h=n.useId();return n.useEffect(()=>{const _=new b,t=new d(75,window.innerWidth/window.innerHeight,.1,1e3);t.position.set(0,0,10),_.add(t);const s=new w(1,1,1),o=new i({color:16776960}),l=new y(s,o);_.add(l);const e=new m;e.setSize(window.innerWidth,window.innerHeight);const x=document.getElementById(h);x.hasChildNodes()||x.appendChild(e.domElement),e.render(_,t)},[]),c("div",{id:h,className:r("")})}const H=a.memo(G);export{G as PageThreejs,H as default};
