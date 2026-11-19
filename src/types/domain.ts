export type Role='engineer'|'manager'|'director'|'customer'|'investor'|'admin'|'partner'|'property';
export type Project={id:string;name:string;city:string;buildingCount:number;budget:number;remaining:number;delivery:string;managerId:string};
export type Building={id:string;projectId:string;name:string;floors:number;model:string;engineerId:string;unit:string};
export type User={id:string;name:string;role:Role;buildingIds:string[];projectIds:string[]};
export type Task={id:string;projectId:string;buildingId:string;title:string;assignee:string;due:string;createdAt:string;status:'active'|'submitted'|'validated';validatedAt?:string};
export type Milestone={id:string;projectId:string;buildingId:string;title:string;start:string;due:string;actualDate?:string;completion:number;published:boolean};
export type Evidence={id:string;projectId:string;buildingId:string;engineerId:string;milestoneId:string;floor:number;image:string;images:string[];point:string;note:string;completion:number;status:'pending'|'approved'|'rejected';createdAt:string;reviewedAt?:string;reviewerId?:string;reviewNote?:string;publicSummary?:string;published:boolean;history:{at:string;actor:string;action:string;note:string}[]};
export type Inspection={id:string;projectId:string;buildingId:string;title:string;passed:boolean;createdAt:string;engineerId:string};
export type QualityIssue={id:string;projectId:string;buildingId:string;title:string;severity:'low'|'medium'|'high'|'critical';status:'open'|'in_progress'|'resolved';createdAt:string;resolvedAt?:string;assignee:string};
export type Observation={id:string;projectId:string;buildingId:string;month:string;plannedSpend:number;actualSpend:number;plannedProgress:number};
export type Activity={id:string;projectId:string;buildingId:string;at:string;actor:string;message:string;public:boolean;readBy:string[]};
export type Dataset={projects:Project[];buildings:Building[];users:User[];tasks:Task[];milestones:Milestone[];evidence:Evidence[];inspections:Inspection[];issues:QualityIssue[];observations:Observation[];activities:Activity[]};
export type DemoData=Dataset&{role:Role;userId:string;selectedProject:string;selectedBuilding:string;snapshotDate:string;revision:number};
export type Submission=Pick<Evidence,'buildingId'|'milestoneId'|'floor'|'images'|'point'|'note'|'completion'>;

