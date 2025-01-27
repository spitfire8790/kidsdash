import React from 'react';
import { Baby, Calendar, Clock, User, X } from 'lucide-react';
import { cn } from './lib/utils';

interface ChildCardProps {
  name: string;
  birthDate: string;
  birthTime: string;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function AgeCounter({ birthDate, birthTime }: { birthDate: string; birthTime: string }) {
  const [age, setAge] = React.useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  React.useEffect(() => {
    const birth = new Date(`${birthDate}T${birthTime}+10:00`); // Sydney timezone

    const updateAge = () => {
      const now = new Date();
      const sydneyTime = new Date(now.toLocaleString('en-US', { timeZone: 'Australia/Sydney' }));
      const diffTime = sydneyTime.getTime() - birth.getTime();
      
      const years = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
      const months = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
      const days = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);

      setAge({ years, months, days, hours, minutes, seconds });
    };

    updateAge();
    const interval = setInterval(updateAge, 1000);
    return () => clearInterval(interval);
  }, [birthDate, birthTime]);

  return (
    <div className="flex gap-3">
      {Object.entries(age).map(([unit, value]) => (
        <div
          key={unit}
          className="bg-card rounded-lg p-3 shadow-lg border border-border/50 backdrop-blur-sm flex-1"
        >
          <div className="text-2xl font-bold text-primary">{value}</div>
          <div className="text-sm text-muted-foreground capitalize">{unit}</div>
        </div>
      ))}
    </div>
  );
}

function ChildCard({ name, birthDate, birthTime }: ChildCardProps) {
  const formattedTime = new Date(`2000-01-01T${birthTime}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="bg-card rounded-xl shadow-xl border border-border/50 backdrop-blur-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          {name === "Hunter" ? (
            <User className="w-8 h-8 text-primary" />
          ) : (
            <Baby className="w-8 h-8 text-primary" />
          )}
          <h2 className="text-2xl font-bold text-card-foreground">{name}</h2>
        </div>

        <div className="flex items-center gap-2 mb-6 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{formatDate(birthDate)}</span>
          <Clock className="w-4 h-4 ml-2" />
          <span className="text-sm">{formattedTime}</span>
        </div>

        <AgeCounter birthDate={birthDate} birthTime={birthTime} />
      </div>
    </div>
  );
}

interface MilestoneInfo {
  title: string;
  sections: {
    title: string;
    items: string[];
  }[];
  warningSigns: string[];
}

const MILESTONES: Record<string, MilestoneInfo> = {
  '4-8m': {
    title: "4-8 Months: Learning & Development",
    sections: [
      {
        title: "How can you encourage your baby's learning?",
        items: [
          "Mimic their sounds and actions e.g. clapping, waving",
          "Encourage their motor skills e.g. place a toy out of reach and urge them to crawl towards it",
          "Play games e.g. peek-a-boo, splash time in the bath, go to the mirror and show their reflection",
          "Play together on the floor to encourage your baby to stretch, wriggle and roll",
          "Tickle and laugh with your baby",
          "Read them books with simple, bright pictures"
        ]
      },
      {
        title: "Physical",
        items: [
          "plays with feet and toes",
          "makes an effort to sit alone, but needs hand support",
          "raises head and chest when lying on stomach",
          "tries to crawl when lying on stomach",
          "rolls from back to stomach",
          "reaches for and grasp objects, using one hand to grasp",
          "crawls using both hands and feet",
          "eyes smoothly follow an object or person",
          "able to take weight on feet when standing",
          "watches activities across room and eyes move in unison",
          "turns head to sound of voices"
        ]
      },
      {
        title: "Social",
        items: [
          "reacts when approaching or around another baby or toddler",
          "responds to own name",
          "smiles often and shows excitement when seeing food being made or at bath time",
          "recognises familiar people and stretches arms to be picked up"
        ]
      },
      {
        title: "Emotional",
        items: [
          "is becoming more settled in eating and sleeping patterns",
          "laughs, especially in social interactions",
          "may soothe self when tired or upset by sucking thumb or dummy",
          "begins to show wariness of strangers",
          "may fret when parent leaves the room",
          "happy to see faces they know"
        ]
      },
      {
        title: "Cognitive",
        items: [
          "swipes at dangling objects",
          "shakes and stares at toy placed in hand",
          "becomes bored if left alone for long periods of time",
          "repeats accidentally caused actions that are interesting",
          "enjoys games such as peek-a-boo or pat-a-cake",
          "will search for partly hidden objects",
          "enjoys toys, banging objects, scrunching paper",
          "explores objects by looking at and mouthing them",
          "develops preferences for foods"
        ]
      },
      {
        title: "Language",
        items: [
          "enjoys games such as peek-a-boo or pat-a-cake",
          "babbles and repeat sounds",
          "makes talking sounds in response to others talking",
          "copies sounds",
          "smiles and babbles at own image in mirror",
          "responds to own name"
        ]
      }
    ],
    warningSigns: [
      "not learning to make sounds",
      "not responding to familiar faces",
      "not learning to roll when playing on the floor",
      "not responsive to carers",
      "not babbling and making sounds",
      "not playing with feet/swapping objects between hands"
    ]
  },
  '8-12m': {
    title: "8-12 Months: Learning & Development",
    sections: [
      {
        title: "How can you encourage your baby's learning?",
        items: [
          "Provide opportunities that challenge, intrigue and surprise them",
          "Encourage them when they try to explore e.g. try to crawl to get something",
          "Share their achievements with family and people around them",
          "Look at books together, naming and pointing to the pictures",
          "Talk to your baby in simple language",
          "Take turns in playing simple games e.g. clapping, blowing bubbles or finger and toe songs and games",
          "Sing nursery rhymes with actions e.g. round and round the garden",
          "Place a toy out of reach and encourage them to crawl or walk to it",
          "Give them finger foods, using different tastes and textures",
          "Give them space to crawl and pull themselves up on furniture",
          "Encourage them to mimic you using simple sounds and words",
          "Always let them know you or another family member is there with them"
        ]
      },
      {
        title: "Physical",
        items: [
          "pulls self to standing position when hands held",
          "raises self to sitting position",
          "sits without support",
          "stands by pulling themselves up using furniture",
          "steps around furniture",
          "successfully reaches out and grasps toy",
          "transfers objects from hand to hand",
          "picks up and pokes small objects with thumb and finger",
          "picks up and throws small objects",
          "holds simple, familiar objects, such as biscuit or bottle",
          "crawls quickly and fluently",
          "may stand alone momentarily",
          "may attempt to crawl up stairs",
          "grasps spoon in palm, but poor aim of food to mouth",
          "uses hands to feed self",
          "has alert peripheral vision",
          "rolls ball and crawls to retrieve it"
        ]
      },
      {
        title: "Social",
        items: [
          "shows definite anxiety or wariness at appearance of strangers"
        ]
      },
      {
        title: "Emotional",
        items: [
          "actively seeks to be near parent or primary caregiver",
          "shows signs of anxiety or stress if parent goes away",
          "offers toy to adult but does not release it",
          "shows signs of empathy to distress of others (but often soothes self)",
          "actively explores and plays when parent present, returning now and then for assurance and interaction"
        ]
      },
      {
        title: "Cognitive",
        items: [
          "moves obstacle to get at desired toy",
          "bangs two objects held in hands together",
          "responds to own name",
          "makes gestures to communicate and to symbolize objects, e.g. points to something they want",
          "seems to understand some things parent or familiar adults say to them",
          "drops toys to be retrieved; when handed back, drops again and looks in direction of dropped toy",
          "smiles at image in mirror",
          "likes playing with water",
          "shows an interest in picture books",
          "understands gestures/responds to 'bye, bye'",
          "listens with pleasure to sound-making toys and music",
          "notices differences and shows surprise"
        ]
      },
      {
        title: "Language",
        items: [
          "responds to own name being called",
          "responds to family names and familiar objects",
          "babbles tunefully",
          "says words like 'dada' or 'mama'",
          "waves goodbye",
          "imitates hand clapping",
          "imitates actions and sounds",
          "enjoys finger-rhymes",
          "shouts to attract attention",
          "vocalises loudly using most vowels and consonants – beginning to sound like conversation"
        ]
      }
    ],
    warningSigns: [
      "not responsive to carers",
      "not babbling and making sounds",
      "not beginning to sit, crawl, or pull to stand",
      "not playing with feet, swapping objects between hands",
      "not interested in holding toys",
      "not learning to eat solids"
    ]
  },
  '1-2y': {
    title: "1-2 Years: Learning & Development",
    sections: [
      {
        title: "How can you encourage your toddler's learning?",
        items: [
          "Encourage your toddler to ask questions and face new challenges e.g. what's the right way to go down the stairs – walk through each problem with them",
          "Help your toddler to experiment with everyday things e.g. show and explain why some things float in the bath and others sink",
          "Do simple experiments together like making play dough, blowing bubbles and looking at insects",
          "Talk with them about the technology and objects we use each day and how it helps us to live e.g. cups, pencils, TVs and computers",
          "Explore the outdoors together and talk about how things change during the day or over the year e.g. the weather or the seasons",
          "Pull things apart and put them back together again (e.g. a toy) and discuss what each part does"
        ]
      },
      {
        title: "Physical",
        items: [
          "walks, climbs and runs",
          "takes two to three steps without support, legs wide and hands up for balance",
          "crawls up steps",
          "dances in place to music",
          "climbs on to a chair",
          "kicks and throws a ball",
          "feeds themselves",
          "begins to run (hurried walk)",
          "scribbles with pencil or crayon held in fist",
          "turns pages of book, two or three pages at a time",
          "rolls large ball, using both hands and arms",
          "finger feeds efficiently",
          "begins to walk alone in a 'tottering way', with frequent falls",
          "squats to pick up an object",
          "reverts to crawling if in a hurry",
          "can drink from a cup",
          "tries to use spoon/fork"
        ]
      },
      {
        title: "Social",
        items: [
          "begins to cooperate with others when playing",
          "may play alongside other toddlers, doing what they do but without seeming to interact (parallel play)",
          "curious and energetic, but depends on adult presence for reassurance"
        ]
      },
      {
        title: "Emotional",
        items: [
          "may show anxiety when separated from significant people in their lives",
          "seeks comfort when upset or afraid",
          "takes cue from parent or primary carer regarding attitude to strangers",
          "may become upset easily if tired or frustrated",
          "assists others in distress by patting, making sympathetic noises or offering material objects"
        ]
      },
      {
        title: "Cognitive",
        items: [
          "repeats actions that lead to interesting/ predictable results, e.g. bangs spoon on saucepan",
          "points to objects when named",
          "knows some body parts and points to body parts in a game",
          "recognises self in photo or mirror",
          "mimics household activities, e.g. bathing baby, sweeping floor",
          "may signal when she/he has finished using the toilet",
          "spends a lot of time exploring and manipulating objects, putting them in mouth, shaking and banging them",
          "stacks and knocks over items",
          "selects games and puts them away",
          "calls self by name, uses 'I', 'mine', 'I do it myself'",
          "will search for hidden toys"
        ]
      },
      {
        title: "Language",
        items: [
          "comprehends and follows simple questions/commands",
          "says first name",
          "says many words (mostly naming objects)",
          "begins to use one to two word sentences e.g. 'want milk'",
          "reciprocal imitation of another toddler: will imitate each other's actions",
          "enjoys rhymes and songs"
        ]
      }
    ],
    warningSigns: [
      "not using words or actions to communicate such as waving or raising arms to be lifted",
      "not wanting to move around",
      "not responding to others",
      "not seeking the attention of familiar people"
    ]
  },
  '2-3y': {
    title: "2-3 Years: Learning & Development",
    sections: [
      {
        title: "How can you encourage your child's learning?",
        items: [
          "Give them more experiences by going to different places e.g. park, beach, public swimming pool, shops",
          "Sing songs, listen to music and dance together",
          "Describe things they can see and hear in their environment e.g. hot, cold, big, loud, green",
          "Ask them to solve everyday problems e.g. It's raining, what do we need to take when we go outside?",
          "Try to start toilet training. Start with 'wees' first",
          "Give them boxes and blocks for building things e.g. pretend houses and bridges",
          "Help them develop their motor skills and understand concepts such as 'under' and 'over' by creating obstacle courses in the home e.g. going 'over' pillows, 'through' the tunnel, 'under' the chair",
          "Encourage your child to use their imagination and develop the muscles in their hands by using crayons, paints or chalk"
        ]
      },
      {
        title: "Physical",
        items: [
          "walks, runs, climbs, kicks and jumps easily",
          "uses steps one at a time",
          "squats to play and rises without using hands for support",
          "catches ball rolled to him/her",
          "walks towards a ball to kick it",
          "jumps from a low step or over low objects",
          "attempts to balance on one foot",
          "avoids obstacles",
          "able to open doors",
          "stops readily",
          "moves to music",
          "turns pages one at a time",
          "holds crayon with fingers",
          "uses a pencil to draw or scribble in circles and lines; may still be held in fist",
          "gets dressed with help",
          "self-feeds using utensils and a cup"
        ]
      },
      {
        title: "Social",
        items: [
          "plays with other children",
          "takes part in simple make-believe play",
          "may prefer same sex playmates and toys",
          "unlikely to share toys without protest"
        ]
      },
      {
        title: "Emotional",
        items: [
          "shows strong attachment to a parent (or main family carer)",
          "shows distress and protest when a parent or other caregiver leaves and wants that person to do things for them",
          "begins to show guilt or remorse for misdeeds",
          "may be less likely to willingly share toys with peers",
          "may demand adult attention"
        ]
      },
      {
        title: "Cognitive",
        items: [
          "builds a tower of five to seven objects",
          "lines up objects in 'train' fashion",
          "recognises and identifies common objects and pictures by pointing",
          "enjoys playing with sand, water, dough; explores what these materials feel like, rather than making things with them",
          "uses symbolic play, e.g. uses a block as a car",
          "shows knowledge of gender-role stereotypes",
          "identifies a child in a picture as a boy or girl",
          "engages in make-believe and pretend play",
          "begins to count with numbers",
          "recognises similarities and differences",
          "imitates rhythms and animal movements",
          "is becoming aware of space through physical activity",
          "can follow two or more directions"
        ]
      },
      {
        title: "Language",
        items: [
          "uses two or three words together, e.g. 'go potty now'",
          "'explosion' of vocabulary and use of some correct grammatical forms of language",
          "refers to self by name and often says 'mine'",
          "asks lots of questions",
          "uses pronouns and prepositions, simple sentences and phrases",
          "labels own gender",
          "copies words and actions",
          "makes music, sings and dances",
          "likes listening to stories and books"
        ]
      }
    ],
    warningSigns: [
      "is not interested in playing",
      "is falling a lot",
      "finds it hard to use small objects",
      "does not understand simple instructions",
      "is not using many words",
      "is not joining words in meaningful phrases",
      "is not interested in food",
      "is not interested in others"
    ]
  },
  '3-5y': {
    title: "3-5 Years: Learning & Development",
    sections: [
      {
        title: "How can you encourage your child's learning?",
        items: [
          "Encourage them to play outdoors",
          "Open them up to more experiences by taking them to different places e.g. wildlife park, museum, playgroup, aquarium, library",
          "Be creative in setting up play activities e.g. painting, music, arts and craft",
          "Build their self-esteem by involving them in your everyday activities and giving them simple helping tasks e.g. help setting the table for dinner",
          "Be interested in their questions and take the time to reply",
          "Show enjoyment in their success e.g. when they read a word correctly"
        ]
      },
      {
        title: "Physical",
        items: [
          "dresses and undresses with little help",
          "hops, jumps and runs with ease",
          "climbs steps with alternating feet",
          "gallops and skips by leading with one foot",
          "transfers weight forward to throw ball",
          "attempts to catch ball with hands",
          "climbs playground equipment with increasing agility",
          "holds crayon/pencil etc. between thumb and first two fingers",
          "exhibits hand preference",
          "imitates a variety of shapes when drawing, e.g. circles",
          "independently cuts paper with scissors",
          "can use the toilet themselves",
          "feeds self with minimum spills",
          "walks and runs more smoothly",
          "enjoys learning simple rhythm and movement routines",
          "develops ability to toilet train at night"
        ]
      },
      {
        title: "Social",
        items: [
          "enjoys playing with other children",
          "may have a particular friend",
          "shares, smiles and cooperates with peers",
          "jointly manipulates objects with one or two other peers",
          "developing independence and social skills they use for learning and getting on with others at pre school and school"
        ]
      },
      {
        title: "Emotional",
        items: [
          "understands when someone is hurt and comforts them",
          "attains gender stability (sure she/he is a girl/boy)",
          "may show stronger preference for same-sex playmates",
          "may enforce gender-role norms with peers",
          "may show bouts of aggression with peers",
          "likes to give and receive affection from parents",
          "may praise themselves and be boastful"
        ]
      },
      {
        title: "Cognitive",
        items: [
          "understands opposites (e.g. big/little) and positional words (middle, end)",
          "uses objects and materials to build or construct things, e.g. block tower, puzzle, clay, sand and water",
          "builds tower eight to 10 blocks",
          "answers simple questions",
          "counts five to 10 things",
          "has a longer attention span",
          "talks to self during play - to help guide what he/she does",
          "follows simple instructions",
          "follows simple rules and enjoys helping others",
          "may write some numbers and letters",
          "engages in dramatic play, taking on pretend character roles",
          "recalls events correctly",
          "counts by rote, having memorised numbers",
          "touches objects to count - starting to understand relationship between numbers and objects",
          "can recount a recent story",
          "copies letters and may write some unprompted",
          "can match and name some colours"
        ]
      },
      {
        title: "Language",
        items: [
          "speaks in sentences and uses many different words",
          "answers simple questions",
          "asks many questions",
          "tells stories",
          "talks constantly",
          "enjoys talking and may like to experiment with new words",
          "uses adult forms of speech",
          "takes part in conversations",
          "enjoys jokes, rhymes and stories",
          "will assert self with words"
        ]
      }
    ],
    warningSigns: [
      "is not understood by others",
      "has speech fluency problems or stammers",
      "is not playing with other children",
      "is not able to have a conversation",
      "is not able to go to the toilet or wash him/herself"
    ]
  }
};

function MilestonePopup({ milestone, onClose }: { milestone: MilestoneInfo; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">{milestone.title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {milestone.sections.map((section, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">{section.title}</h3>
              <ul className="list-disc pl-6 space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
          ))}
          <div className="mt-8 p-4 bg-red-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-red-800">When to seek advice</h3>
            <p className="mb-2 text-red-700">Please seek advice from your local community health worker or doctor if your baby is:</p>
            <ul className="list-disc pl-6 space-y-2">
              {milestone.warningSigns.map((sign, index) => (
                <li key={index} className="text-red-700">{sign}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Timeline({ children }: { children: Array<{ name: string; birthDate: string; birthTime: string }> }) {
  const [timelinePositions, setTimelinePositions] = React.useState<Array<{ name: string; position: number }>>([]);
  const [selectedMilestone, setSelectedMilestone] = React.useState<string | null>(null);

  React.useEffect(() => {
    const updatePositions = () => {
      const now = new Date();
      const sydneyTime = new Date(now.toLocaleString('en-US', { timeZone: 'Australia/Sydney' }));

      const positions = children.map(child => {
        const birth = new Date(`${child.birthDate}T${child.birthTime}+10:00`);
        const ageInMonths = (sydneyTime.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
        const position = Math.min((ageInMonths / 60) * 100, 100); // 60 months = 5 years
        return { name: child.name, position };
      });

      setTimelinePositions(positions);
    };

    updatePositions();
    const interval = setInterval(updatePositions, 1000);
    return () => clearInterval(interval);
  }, [children]);

  // Calculate milestone positions
  const milestoneRanges = [
    { id: '4-8m', start: 4, end: 8 },
    { id: '8-12m', start: 8, end: 12 },
    { id: '1-2y', start: 12, end: 24 },
    { id: '2-3y', start: 24, end: 36 },
    { id: '3-5y', start: 36, end: 60 }
  ];

  return (
    <div className="bg-card rounded-xl shadow-xl border border-border/50 backdrop-blur-sm p-6 mt-6">
      <h3 className="text-xl font-semibold mb-6">Age Timeline (0-5 years)</h3>
      <div className="relative h-24">
        {/* Timeline base */}
        <div className="absolute w-full h-2 bg-gray-200 rounded-full top-1/2 -translate-y-1/2">
          {/* Year markers */}
          {[0, 1, 2, 3, 4, 5].map(year => (
            <div key={year} className="absolute h-4 w-0.5 bg-gray-400" style={{ left: `${(year / 5) * 100}%`, top: '50%', transform: 'translateY(-50%)' }}>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm text-gray-600">{year}y</span>
            </div>
          ))}

          {/* Milestone bars */}
          {milestoneRanges.map(({ id, start, end }) => {
            const startPos = (start / 60) * 100; // Convert to percentage
            const endPos = (end / 60) * 100;
            const width = endPos - startPos;

            return (
              <div 
                key={id}
                className="absolute h-4 cursor-pointer transition-colors"
                style={{ 
                  left: `${startPos}%`,
                  width: `${width}%`,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  borderRadius: '4px',
                  background: selectedMilestone === id ? 'rgba(236, 72, 153, 0.5)' : 'rgba(236, 72, 153, 0.3)',
                }}
                onClick={() => setSelectedMilestone(id)}
              >
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-medium text-gray-700">
                  {id}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Child markers */}
        {timelinePositions.map(({ name, position }) => (
          <div
            key={name}
            className="absolute -bottom-2 -translate-x-1/2 transition-all duration-1000 z-10"
            style={{ left: `${position}%` }}
          >
            <div className="flex flex-col items-center">
              <div 
                className="w-6 h-6 rounded-full bg-primary border-2 border-white"
                style={{
                  animation: 'pulse 2s infinite, glow 2s infinite',
                  animationDelay: name === "Hunter" ? "0s" : "1s" // Offset animations
                }}
              />
              <span className="text-sm font-medium mt-2">{name}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Milestone Popup */}
      {selectedMilestone && MILESTONES[selectedMilestone] && (
        <MilestonePopup 
          milestone={MILESTONES[selectedMilestone]} 
          onClose={() => setSelectedMilestone(null)} 
        />
      )}
    </div>
  );
}

function App() {
  const children = [
    {
      name: "Hunter",
      birthDate: "2021-09-07",
      birthTime: "06:36"
    },
    {
      name: "Casper",
      birthDate: "2024-06-03",
      birthTime: "09:04"
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center text-primary mb-6">Children Timeline</h1>
      {children.map((child, index) => (
        <ChildCard
          key={index}
          name={child.name}
          birthDate={child.birthDate}
          birthTime={child.birthTime}
        />
      ))}
      <Timeline>{children}</Timeline>
    </div>
  );
}

export default App;