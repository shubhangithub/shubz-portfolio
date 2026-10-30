import { VISIBLE_POSTS } from "./posts";

const records = [
  {id:"ross",title:"Malaria transmission threshold",slug:"ross-threshold",description:"Infection trajectories as mosquito density changes."},
  {id:"ross-controls",title:"Fewer mosquitoes or fewer bites",slug:"ross-threshold",description:"Compare the effects of density and biting reductions."},
  {id:"queue-ledger",title:"A queue, job by job",slug:"september-queue",description:"Arrival spacing, waiting and occupied time."},
  {id:"queue-capacity",title:"Capacity and waiting",slug:"september-queue",description:"Utilisation and mean time in an M/M/1 queue."},
  {id:"feedback-delay",title:"Delayed corrections",slug:"october-feedback",description:"Compare feedback using current and previous measurements."},
  {id:"feedback-roots",title:"Feedback stability",slug:"october-feedback",description:"Controller gain and roots of the delayed recurrence."},
  {id:"fisher",title:"Fisher’s travelling front",slug:"fisher-wave",description:"Growth rate and the advancing population front."},
  {id:"turing",title:"Reaction–diffusion patterns",slug:"turing-morphogenesis",description:"Feed and kill rates in the Gray–Scott simulation."},
  {id:"ecology",title:"Predator and prey",slug:"may-2026",description:"Predation and mortality in the population loop."},
  {id:"ensemble",title:"Recommendation weights",slug:"six-engines",description:"Engine weights and the resulting song ranking."},
  {id:"engines",title:"Six recommendation engines",slug:"six-engines",description:"Which engines agree on a candidate song."},
  {id:"bottlenecks",title:"Bottlenecks to progress",slug:"bluedot-unit1",description:"Compare the constraints across five domains."},
  {id:"frontier",title:"Capability development",slug:"bluedot-unit1",description:"Compare the two illustrated build-order scenarios."},
  {id:"readings",title:"Reading clusters",slug:"bluedot-unit1",description:"Explore the connections between course readings."},
  {id:"actors",title:"Who is “we”?",slug:"bluedot-unit1",description:"Explore the actors behind the collective pronoun."},
  {id:"assumptions",title:"Shared assumptions",slug:"bluedot-assumptions",description:"Compare assumptions across the course readings."},
  {id:"timelines",title:"Timeline anchors",slug:"bluedot-assumptions",description:"Explore the sources behind the timeline claims."},
  {id:"ideologies",title:"Ideology and scale",slug:"bluedot-civilization",description:"Explore readings by ideology and unit of analysis."},
  {id:"defence",title:"Defence pillars",slug:"bluedot-civilization",description:"Compare concentrated and distributed approaches."},
  {id:"phases",title:"Failure-scenario phases",slug:"bluedot-killchain",description:"Inspect each phase and its proposed defences."},
  {id:"wiring",title:"Course-to-scenario connections",slug:"bluedot-killchain",description:"Follow the connections from phases to course units."},
] as const;

export const LIVE_EXPERIMENTS = records.flatMap(record => {
  const post = VISIBLE_POSTS.find(post => post.slug === record.slug);
  return post ? [{...record, cat:post.nbAccent!, essayTitle:post.title}] : [];
});
