import type {Dataset,Project,Role,User} from '@/types/domain';
export type {Role,Project,Evidence} from '@/types/domain';
export const SNAPSHOT='2026-10-30';
export const roles:Role[]=['engineer','manager','director','customer','investor','admin','partner','property'];
export const points=['Front','Front right','Right','Rear','Left','Front left'];
export const projects:Project[]=[
{id:'lakeview',name:'Lakeview Residence',city:'Tirana',buildingCount:3,budget:8400000,remaining:4100000,delivery:'2027-09-15',managerId:'manager-1'},
{id:'komuna',name:'Komuna Park',city:'Tirana',buildingCount:2,budget:6100000,remaining:3600000,delivery:'2027-06-20',managerId:'manager-2'},
{id:'durres',name:'Durrës Coastal',city:'Durrës',buildingCount:3,budget:11200000,remaining:4150000,delivery:'2027-12-10',managerId:'manager-3'},
{id:'astir',name:'Astir Urban',city:'Tirana',buildingCount:2,budget:4800000,remaining:3100000,delivery:'2027-05-25',managerId:'manager-1'}];
const specs=[{count:3,actual:4900000,planned:4500000,progress:55,target:62,passed:43,issues:12,open:7},{count:2,actual:2250000,planned:2300000,progress:48,target:44,passed:46,issues:8,open:3},{count:3,actual:7500000,planned:7000000,progress:65,target:70,passed:41,issues:14,open:11},{count:2,actual:1550000,planned:1500000,progress:38,target:35,passed:47,issues:6,open:2}];
const engineerNames=['Arben Dervishi','Elira Kola','Bledi Hoxha','Sara Leka','Ilir Duka','Nora Meta','Andi Pasha','Mira Balla'];
const customerNames=['Ana Mema','Erion Lika','Lira Hasa','Artan Prifti','Dora Nika','Besnik Cela','Ema Deda','Flori Bala','Gerta Koci','Gent Lala'];
export function seed():Dataset{
 const data:Dataset={projects:structuredClone(projects),buildings:[],users:[],tasks:[],milestones:[],evidence:[],inspections:[],issues:[],observations:[],activities:[]};
 let buildingIndex=0;
 projects.forEach((project,p)=>{
 const spec=specs[p];
 for(let b=0;b<spec.count;b++){
 const index=buildingIndex++,id=project.id+'-'+(b+1),engineerId='engineer-'+(index%8+1);
 data.buildings.push({id,projectId:project.id,name:['Tower A','Tower B','Garden wing'][b],floors:p===3?4:p===2?20:12,model:p===3?'toptani_concept.glb':p===2?'aba_concept.glb':'lakeview_concept.glb',engineerId,unit:'Unit '+(b+1)+'-601'});
 for(let m=0;m<6;m++){
 const month='2026-'+String(m+5).padStart(2,'0'),factor=[.12,.26,.43,.63,.82,1][m];
 const portion=(total:number)=>Math.round(total*(m+1)/6/spec.count)-Math.round(total*m/6/spec.count);
 // Last building absorbs integer rounding so monthly totals reconcile exactly.
 const spend=(total:number)=>b===spec.count-1?Math.round(total*(m+1)/6)-Math.round(total*m/6)-(spec.count-1)*portion(total):portion(total);
 data.observations.push({id:id+'-obs-'+m,projectId:project.id,buildingId:id,month,actualSpend:spend(spec.actual),plannedSpend:spend(spec.planned),plannedProgress:Math.round(spec.target*factor)});
 const at=month+(m===5?(p===2?'-20':'-28'):'-25')+'T09:00:00Z';
 data.evidence.push({id:id+'-e-'+m,projectId:project.id,buildingId:id,engineerId,milestoneId:project.id+'-m-'+(b+1),floor:Math.max(1,Math.ceil((m+1)*data.buildings.at(-1)!.floors/6)),image:'/demo-photos/photo-'+String(index*6+m+1).padStart(2,'0')+'.png',images:['/demo-photos/photo-'+String(index*6+m+1).padStart(2,'0')+'.png'],point:points[m],note:'Synthetic site report: '+project.name+' '+['foundation','frame','slab','envelope','services','progress review'][m],completion:Math.round(spec.progress*factor),status:'approved',createdAt:at,reviewedAt:at,reviewerId:project.managerId,publicSummary:'Approved demonstration update: '+Math.round(spec.progress*factor)+'% building completion.',published:true,history:[{at,actor:project.managerId,action:'approved',note:'Seeded synthetic approval'}]});
 }
 for(let t=0;t<8;t++)data.tasks.push({id:id+'-task-'+t,projectId:project.id,buildingId:id,title:['Check concrete strength','Review slab reinforcement','Inspect balcony seals','Capture facade evidence','Validate electrical routing','Check safety barriers','Review finishing quality','Prepare handover package'][t],assignee:t===6?'partner-1':t===7?'property-1':engineerId,due:t<3?'2026-10-'+(20+t):'2026-11-'+String(t+1).padStart(2,'0'),createdAt:'2026-0'+(t%3+7)+'-01',status:t<2?'validated':t===3?'submitted':'active',validatedAt:t<2?'2026-10-'+(18+t)+'T10:00:00Z':undefined});
 }
 const bs=data.buildings.filter(b=>b.projectId===project.id);
 for(let m=0;m<8;m++)data.milestones.push({id:project.id+'-m-'+(m+1),projectId:project.id,buildingId:bs[m%bs.length].id,title:['Foundation approval','Structural frame','Facade installation','Roof completion','MEP inspection','Interior fit-out','Safety certification','Handover'][m],start:'2026-'+String(5+m%6).padStart(2,'0')+'-01',due:m<2?'2026-08-30':m<4?'2026-10-15':'2027-0'+(m-2)+'-15',actualDate:m<2?'2026-08-'+(25+m):undefined,completion:m<2?100:m<4?spec.progress:0,published:true});
 for(let i=0;i<50;i++)data.inspections.push({id:project.id+'-inspection-'+i,projectId:project.id,buildingId:bs[i%bs.length].id,engineerId:bs[i%bs.length].engineerId,title:['Concrete sampling','Waterproofing inspection','Facade alignment','Electrical safety','Fire barrier review'][i%5],passed:i<spec.passed,createdAt:'2026-'+String(5+i%6).padStart(2,'0')+'-'+String(10+i%18).padStart(2,'0')});
 for(let i=0;i<spec.issues;i++)data.issues.push({id:project.id+'-issue-'+i,projectId:project.id,buildingId:bs[i%bs.length].id,assignee:bs[i%bs.length].engineerId,title:['Balcony seal defect','Fire barrier discontinuity','Window alignment','Surface finish damage','Drainage obstruction'][i%5],severity:(['high','critical','medium','low'] as const)[i%4],status:i>=spec.open?'resolved':i%3===0?'in_progress':'open',createdAt:'2026-0'+(7+i%3)+'-12',resolvedAt:i>=spec.open?'2026-10-'+String(10+i).padStart(2,'0'):undefined});
 });
 const users:User[]=engineerNames.map((name,i)=>({id:'engineer-'+(i+1),name,role:'engineer',buildingIds:data.buildings.filter(b=>b.engineerId==='engineer-'+(i+1)).map(b=>b.id),projectIds:[]}));
 ['Dritan Shala','Elda Marku','Ardit Hysa'].forEach((name,i)=>users.push({id:'manager-'+(i+1),name,role:'manager',projectIds:projects.filter(p=>p.managerId==='manager-'+(i+1)).map(p=>p.id),buildingIds:[]}));
 users.push({id:'director-1',name:'Adela Kelmendi',role:'director',projectIds:projects.map(p=>p.id),buildingIds:[]},{id:'admin-1',name:'Demo administrator',role:'admin',projectIds:projects.map(p=>p.id),buildingIds:[]},{id:'partner-1',name:'Forma Works · partner',role:'partner',projectIds:projects.map(p=>p.id),buildingIds:data.buildings.map(b=>b.id)},{id:'property-1',name:'Bora Gjika · facilities',role:'property',projectIds:projects.map(p=>p.id),buildingIds:data.buildings.map(b=>b.id)});
 customerNames.forEach((name,i)=>users.push({id:'customer-'+(i+1),name,role:i===9?'investor':'customer',projectIds:[data.buildings[i].projectId],buildingIds:[data.buildings[i].id]}));
 data.users=users;
 data.activities=data.evidence.slice(-10).map(e=>({id:'activity-'+e.id,projectId:e.projectId,buildingId:e.buildingId,at:e.reviewedAt!,actor:e.reviewerId!,message:'Approved construction update: '+e.completion+'%',public:true,readBy:[]}));
 return data;
}


