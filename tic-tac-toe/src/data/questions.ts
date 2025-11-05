import { teamNames, countryNames } from './mappings';
// Helper: Shuffle an array randomly
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Helper: Pick N random elements from an array
const pickN = <T,>(arr: T[], n: number): T[] => 
  shuffleArray(arr).slice(0, Math.min(n, arr.length));

// Usage tracking for fair distribution
const getUsageCounts = (): { teams: Record<string, number>; countries: Record<string, number> } => {
  if (typeof window === 'undefined') {
    return { teams: {}, countries: {} };
  }
  
  try {
    const teamsData = localStorage.getItem('teamUsageCounts');
    const countriesData = localStorage.getItem('countryUsageCounts');
    return {
      teams: teamsData ? JSON.parse(teamsData) : {},
      countries: countriesData ? JSON.parse(countriesData) : {},
    };
  } catch {
    return { teams: {}, countries: {} };
  }
};

const updateUsageCounts = (teams: string[], countries: string[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const usage = getUsageCounts();
    
    teams.forEach(team => {
      usage.teams[team] = (usage.teams[team] || 0) + 1;
    });
    
    countries.forEach(country => {
      usage.countries[country] = (usage.countries[country] || 0) + 1;
    });
    
    localStorage.setItem('teamUsageCounts', JSON.stringify(usage.teams));
    localStorage.setItem('countryUsageCounts', JSON.stringify(usage.countries));
  } catch {
    // Ignore errors
  }
};

// Helper: Weighted pick by custom scores (higher score => more likely)
const weightedPickByScore = <T,>(items: T[], getScore: (item: T) => number): T | null => {
  if (items.length === 0) return null;
  const entries = items.map(item => ({ item, score: Math.max(0, getScore(item)) }));
  const total = entries.reduce((sum, e) => sum + e.score, 0);
  if (total <= 0) return items[Math.floor(Math.random() * items.length)];
  let r = Math.random() * total;
  for (const e of entries) {
    r -= e.score;
    if (r <= 0) return e.item;
  }
  return entries[entries.length - 1].item;
};

// Weighted selection: gives preference to less-used items
const weightedSelect = <T extends string>(
  items: T[],
  usageCounts: Record<string, number>,
  count: number,
  exclude: Set<T>
): T[] => {
  const available = items.filter(item => !exclude.has(item));
  
  if (available.length === 0) return [];
  if (available.length <= count) return available;
  
  // Calculate weights (higher weight = less used = more likely to be selected)
  // Weight = 1 / (usage + 1), so unused items get weight 1, used once get 0.5, etc.
  const weights = available.map(item => {
    const usage = usageCounts[item] || 0;
    return { item, weight: 1 / (usage + 1) };
  });
  
  const selected: T[] = [];
  
  for (let i = 0; i < count && weights.length > 0; i++) {
    // Normalize weights
    const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
    const normalizedWeights = weights.map(w => ({
      ...w,
      weight: w.weight / totalWeight,
    }));
    
    // Random selection based on weights
    let random = Math.random();
    let selectedItem: T | null = null;
    
    for (const { item, weight } of normalizedWeights) {
      random -= weight;
      if (random <= 0) {
        selectedItem = item;
        break;
      }
    }
    
    // Fallback to first item if floating point precision issues
    if (!selectedItem) {
      selectedItem = normalizedWeights[0].item;
    }
    
    selected.push(selectedItem);
    exclude.add(selectedItem);
    
    // Remove selected item from weights array
    const index = weights.findIndex(w => w.item === selectedItem);
    if (index > -1) {
      weights.splice(index, 1);
    }
  }
  
  return selected;
};

// Player list: team -> country -> [players]
// Note: This module supports BOTH orientations for backward compatibility.
// Preferred: team-first (team -> country -> players)
// Legacy: country-first (country -> team -> players)
export const playerList: Record<string, Record<string, string[]>> = {
 RR: {
    Afghanistan: [
      "Fazalhaq Farooqi"
    ],
    Australia: [
      "Darren Lehmann",
      "Rob Quiney",
      "Lee Carseldine",
      "Shane Harwood",
      "Adam Voges",
      "Damien Martyn",
      "Aaron Finch",
      "Shane Warne",
      "Shaun Tait",
      "Brad Hogg",
      "Brad Hodge",
      "Ben Cutting",
      "Kane Richardson",
      "Shane Watson",
      "James Faulkner",
      "D'Arcy Short",
      "Ben Laughlin",
      "Ashton Turner",
      "Steve Smith",
      "Andrew Tye",
      "Nathan Coulter-Nile",
      "Adam Zampa"
    ],
    Bangladesh: [
      "Mustafizur Rahman"
    ],
    England: [
      "Dimitri Mascarenhas",
      "Michael Lumb",
      "Nayan Doshi",
      "Owais Shah",
      "Tom Curran",
      "Ben Stokes",
      "Joe Root",
      "Jos Buttler",
      "Tom Kohler-Cadmore",
      "Jofra Archer"
    ],
    India: [
      "Dinesh Salunkhe",
      "Mohammad Kaif",
      "Taruwar Kohli",
      "Mahesh Rawat",
      "Ravindra Jadeja",
      "Niraj Patel",
      "Siddharth Chitnis",
      "Paul Valthaty",
      "Sumit Narwal",
      "Aditya Dole",
      "Amit Uniyal",
      "Swapnil Asnodkar",
      "Abhishek Raut",
      "Amit Paunikar",
      "Faiz Fazal",
      "Pinal Shah",
      "Pankaj Singh",
      "Amit Singh",
      "Shreevats Goswami",
      "Siddharth Trivedi",
      "Rahul Dravid",
      "Ankeet Chavan",
      "Ashok Menaria",
      "Ajit Chandila",
      "S. Sreesanth",
      "Sachin Baby",
      "Rahul Shukla",
      "Dishant Yagnik",
      "Vikramjeet Malik",
      "Unmukt Chand",
      "Abhishek Nayar",
      "Iqbal Abdullah",
      "Pravin Tambe",
      "Rajat Bhatia",
      "Deepak Hooda",
      "Barinder Sran",
      "Ankit Sharma",
      "Anureet Singh",
      "Ajinkya Rahane",
      "Stuart Binny",
      "Dhawal Kulkarni",
      "Prashant Chopra",
      "Rahul Tripathi",
      "Krishnappa Gowtham",
      "Sudhesan Midhun",
      "Varun Aaron",
      "Robin Uthappa",
      "Ankit Rajpoot",
      "Rahul Tewatia",
      "Shreyas Gopal",
      "Mahipal Lomror",
      "Jaydev Unadkat",
      "Kartik Tyagi",
      "Manan Vohra",
      "Anuj Rawat",
      "Akash Singh",
      "Mayank Markande",
      "Shivam Dube",
      "Chetan Sakariya",
      "Karun Nair",
      "Prasidh Krishna",
      "Kuldip Yadav",
      "Devdutt Padikkal",
      "Navdeep Saini",
      "Abdul Basith",
      "Murugan Ashwin",
      "KM Asif",
      "Ravichandran Ashwin",
      "Yuzvendra Chahal",
      "Kuldeep Sen",
      "Tanush Kotian",
      "Avesh Khan",
      "Sanju Samson",
      "Riyan Parag",
      "Yashasvi Jaiswal",
      "Dhruv Jurel",
      "Sandeep Sharma",
      "Shubham Dubey",
      "Nitish Rana",
      "Tushar Deshpande",
      "Kumar Kartikeya",
      "Vaibhav Sooryavanshi",
      "Yudhvir Singh"
    ],
    NewZealand: [
      "Ross Taylor",
      "Jacob Oram",
      "Tim Southee",
      "Ish Sodhi",
      "Glenn Phillips",
      "Daryl Mitchell",
      "James Neesham",
      "Trent Boult"
    ],
    Pakistan: [
      "Kamran Akmal",
      "Younis Khan",
      "Sohail Tanvir"
    ],
    SouthAfrica: [
      "Tyron Henderson",
      "Graeme Smith",
      "Morne Morkel",
      "Johan Botha",
      "Heinrich Klaasen",
      "Chris Morris",
      "David Miller",
      "Tabraiz Shamsi",
      "Rassie van der Dussen",
      "Donovan Ferreira",
      "Nandre Burger",
      "Keshav Maharaj"
    ],
    SriLanka: [
      "Kusal Perera",
      "Wanindu Hasaranga",
      "Maheesh Theekshana"
    ],
    UnitedStates: [
      "Harmeet Singh",
      "Rusty Theron"
    ],
    WestIndies: [
      "Samuel Badree",
      "Kevon Cooper",
      "Oshane Thomas",
      "Evin Lewis",
      "Obed McCoy",
      "Jason Holder",
      "Rovman Powell",
      "Shimron Hetmyer"
    ]
  },

  CSK: {
    Australia: [
      "Matthew Hayden",
      "Michael Hussey",
      "George Bailey",
      "Doug Bollinger",
      "Ben Hilfenhaus",
      "David Hussey",
      "John Hastings",
      "Shane Watson",
      "Josh Hazlewood",
      "Dirk Nannes",
      "Ben Laughlin"
    ],
    Bangladesh: [
      "Mustafizur Rahman"
    ],
    England: [
      "Andrew Flintoff",
      "Mark Wood",
      "Sam Billings",
      "David Willey",
      "Sam Curran",
      "Moeen Ali",
      "Chris Jordan",
      "Ben Stokes"
    ],
    India: [
      "Mahendra Singh Dhoni",
      "Joginder Sharma",
      "Manpreet Gony",
      "Palani Amarnath",
      "Parthiv Patel",
      "Subramaniam Badrinath",
      "Ravindra Jadeja",
      "Suresh Raina",
      "Vidyut Sivaramakrishnan",
      "Srikkanth Anirudha",
      "Lakshmipathy Balaji",
      "Abhinav Mukund",
      "Ravichandran Ashwin",
      "Shadab Jakati",
      "Sudeep Tyagi",
      "Murali Vijay",
      "Arun Karthik",
      "Chandrasekar Ganapathy",
      "Wriddhiman Saha",
      "Yo Mahesh",
      "Ankit Rajpoot",
      "Mohit Sharma",
      "Ashish Nehra",
      "Pawan Negi",
      "Ishwar Pandey",
      "Mithun Manhas",
      "Vijay Shankar",
      "Ronit More",
      "Ambati Rayudu",
      "Deepak Chahar",
      "Harbhajan Singh",
      "Kedar Jadhav",
      "Shardul Thakur",
      "Karn Sharma",
      "KM Asif",
      "Dhruv Shorey",
      "Ruturaj Gaikwad",
      "Narayan Jagadeesan",
      "Monu Kumar",
      "Robin Uthappa",
      "Shivam Dube",
      "Tushar Deshpande",
      "Mukesh Choudhary",
      "Simarjeet Singh",
      "Prashant Solanki",
      "Rajvardhan Hangargekar",
      "Ajinkya Rahane",
      "Akash Singh",
      "Sameer Rizvi"
    ],
    NewZealand: [
      "Jacob Oram",
      "Stephen Fleming",
      "Brendon McCullum",
      "Scott Styris",
      "Tim Southee",
      "Mitchell Santner",
      "Scott Kuggeleijn",
      "Adam Milne",
      "Devon Conway",
      "Daryl Mitchell",
      "Rachin Ravindra"
    ],
    SouthAfrica: [
      "Albie Morkel",
      "Makhaya Ntini",
      "Justin Kemp",
      "Faf du Plessis",
      "Imran Tahir",
      "Dwaine Pretorius",
      "Lungi Ngidi",
      "Chris Morris",
      "Sisanda Magala"
    ],
    SriLanka: [
      "Muttiah Muralitharan",
      "Chamara Kapugedera",
      "Thilan Thushara",
      "Thisara Perera",
      "Suraj Randiv",
      "Nuwan Kulasekara",
      "Maheesh Theekshana",
      "Matheesha Pathirana"
    ],
    WestIndies: [
      "Dwayne Bravo",
      "Dwayne Smith",
      "Jason Holder",
      "Samuel Badree"
    ]
  },
  MI: {
    Australia: [
      "Aaron Finch",
      "Aiden Blizzard",
      "Andrew Symonds",
      "Ben Cutting",
      "Ben Dunk",
      "Ben Hilfenhaus",
      "Cameron Green",
      "Chris Lynn",
      "Clint McKay",
      "Daniel Sams",
      "Dominic Thornely",
      "James Pattinson",
      "Jason Behrendorff",
      "Jhye Richardson",
      "Josh Hazlewood",
      "Michael Hussey",
      "Nathan Coulter-Nile",
      "Pat Cummins",
      "Phillip Hughes",
      "Ricky Ponting"
    ],
    England: [
      "Alex Hales",
      "Chris Jordan",
      "Jos Buttler",
      "Will Jacks"
    ],
    India: [
      "Abhimanyu Mithun",
      "Abhishek Nayar",
      "Abu Nechim",
      "Aditya Tare",
      "Ajinkya Rahane",
      "Akash Madhwal",
      "Akshay Wakhare",
      "Ali Murtaza",
      "Ambati Rayudu",
      "Amitoze Singh",
      "Ankeet Chavan",
      "Anmolpreet Singh",
      "Anshul Kamboj",
      "Anukul Roy",
      "Apoorv Wankhade",
      "Arjun Tendulkar",
      "Arshad Khan",
      "Aryan Juyal",
      "Ashish Nehra",
      "Ashwani Kumar",
      "Axar Patel",
      "Barinder Sran",
      "Basil Thampi",
      "Chandan Madan",
      "Chetanya Nanda",
      "Chidhambaram Gautam",
      "Dhawal Kulkarni",
      "Digvijay Deshmukh",
      "Dinesh Karthik",
      "Gaurav Dhiman",
      "Harbhajan Singh",
      "Hardik Pandya",
      "Hrithik Shokeen",
      "Ishan Kishan",
      "Ishan Malhotra",
      "Jagadeesha Suchith",
      "Jalaj Saxena",
      "Jasprit Bumrah",
      "Javed Khan",
      "Jayant Yadav",
      "Jaydev Shah",
      "Jaydev Unadkat",
      "Jitesh Sharma",
      "Karn Sharma",
      "Kishore Kamath",
      "Krishnappa Gowtham",
      "Krunal Pandya",
      "Kuldeep Yadav",
      "Kulwant Khejroliya",
      "Kumar Kartikeya",
      "Mayank Markande",
      "MD Nidheesh",
      "Moshin Khan",
      "Munaf Patel",
      "Musavir Khote",
      "Naman Dhir",
      "Nathu Singh",
      "Nehal Wadhera",
      "Nitish Rana",
      "Pankaj Jaswal",
      "Parthiv Patel",
      "Pawan Suyal",
      "Pinal Shah",
      "Piyush Chawla",
      "Pradeep Sangwan",
      "Pragyan Ojha",
      "Praveen Kumar",
      "Prince Balwant Rai",
      "Rahul Buddhi",
      "Rahul Chahar",
      "Rahul Shukla",
      "Rajagopal Sathish",
      "Raj Angad Bawa",
      "Ramandeep Singh",
      "Rasikh Salam",
      "Rishi Dhawan",
      "Robin Minz",
      "Rohan Raje",
      "Rohit Sharma",
      "Roosh Kalaria",
      "RP Singh",
      "Sachin Tendulkar",
      "Sandeep Warrier",
      "Santosh Yadav",
      "Sanjay Yadav",
      "Sarul Kanwar",
      "Satyanarayana Raju",
      "Saurabh Tiwary",
      "Shams Mulani",
      "Sharad Lumba",
      "Shikhar Dhawan",
      "Shivalik Sharma",
      "Shreyas Gopal",
      "Siddharth Chitnis",
      "Siddhesh Lad",
      "Simarjeet Singh",
      "Sujit Nayak",
      "Suryakumar Yadav",
      "Sushant Marathe",
      "Swapnil Singh",
      "Syed Shahabuddin",
      "Tajinder Singh",
      "Tilak Varma",
      "Tirumalasetti Suman",
      "Unmukt Chand",
      "Vignesh Puthur",
      "Vikrant Yeligati",
      "Vinay Kumar",
      "Vishnu Vinod",
      "Vipin Sevaram",
      "Yogesh Takawale",
      "Yudhvir Singh",
      "Yuvraj Singh",
      "Yuzvendra Chahal",
      "Zaheer Khan"
    ],
    NewZealand: [
      "Adam Milne",
      "Colin Munro",
      "Corey Anderson",
      "James Franklin",
      "Martin Guptill",
      "Mitchell McClenaghan",
      "Mitchell Santner",
      "Kyle Mills",
      "Luke Ronchi",
      "Tim Southee",
      "Trent Boult"
    ],
    SouthAfrica: [
      "Albie Morkel",
      "André Nel",
      "Beuran Hendricks",
      "Duan Jansen",
      "Dwaine Pretorius",
      "Gerald Coetzee",
      "JP Duminy",
      "Corbin Bosch",
      "Dewald Brevis",
      "Ryan Rickelton",
      "Lizaad Williams",
      "Marchant de Lange",
      "Moises Henriques",
      "Quinton de Kock",
      "Riley Meredith",
      "Robin Peterson",
      "Ryan McLaren"
    ],
    SriLanka: [
      "Akila Dananjaya",
      "Asela Gunaratne",
      "Dilhara Fernando",
      "Dilshan Madushanka",
      "Lasith Malinga",
      "Nuwan Thushara",
      "Sanath Jayasuriya",
      "Thisara Perera"
    ],
    WestIndies: [
      "Alzarri Joseph",
      "Dwayne Bravo",
      "Dwayne Smith",
      "Evin Lewis",
      "Fabian Allen",
      "Herschelle Gibbs",
      "Kieron Pollard",
      "Krishmar Santokie",
      "Lendl Simmons",
      "Nicholas Pooran",
      "Romario Shepherd",
      "Sherfane Rutherford"
    ],
    Afghanistan: [
      "Mujeeb Ur Rahman",
      "Mohammad Nabi"
    ],
    Bangladesh: [
      "Mustafizur Rahman",
      "Mohammad Ashraful"
    ],
    Singapore: [
      "Tim David"
    ]
  },
  KKR: {
    India: [
      "Iqbal Abdulla",
      "Ajit Agarkar",
      "Vaibhav Arora",
      "Lakshmipathy Balaji",
      "Sanjay Bangar",
      "Harpreet Singh Bhatia",
      "Rajat Bhatia",
      "Manvinder Bisla",
      "K.C. Cariappa",
      "Varun Chakravarthy",
      "Piyush Chawla",
      "Aakash Chopra",
      "Debabrata Das",
      "Ashok Dinda",
      "Paras Dogra",
      "Gautam Gambhir",
      "Sourav Ganguly",
      "Rohan Gavaskar",
      "Shubman Gill",
      "Shreevats Goswami",
      "Aman Hakim Khan",
      "Sheldon Jackson",
      "Narayan Jagadeesan",
      "Ishank Jaggi",
      "Dinesh Karthik",
      "Murali Kartik",
      "Kulwant Khejroliya",
      "Prasidh Krishna",
      "Vinay Kumar",
      "Sarabjit Ladda",
      "Siddhesh Lad",
      "Shivam Mavi",
      "Kamlesh Nagarkoti",
      "Nikhil Naik",
      "Sumit Narwal",
      "Manish Pandey",
      "Monish Parmar",
      "Yusuf Pathan",
      "Cheteshwar Pujara",
      "Angkrish Raghuvanshi",
      "Ajinkya Rahane",
      "Prithvi Raj",
      "Ankit Rajpoot",
      "Harshit Rana",
      "Nitish Rana",
      "Anukul Roy",
      "Wriddhiman Saha",
      "Chetan Sakariya",
      "Rasikh Salam Dar",
      "Pradeep Sangwan",
      "Sourav Sarkar",
      "Rajagopal Sathish",
      "Shoaib Shaikh",
      "Mohammed Shami",
      "Ishant Sharma",
      "Suyash Sharma",
      "Laxmi Ratan Shukla",
      "Anureet Singh",
      "Harbhajan Singh",
      "Mandeep Singh",
      "Ramandeep Singh",
      "Rinku Singh",
      "Yashpal Singh",
      "Shardul Thakur",
      "Manoj Tiwary",
      "Abhijeet Tomar",
      "Rahul Tripathi",
      "Jaydev Unadkat",
      "Robin Uthappa",
      "Kuldeep Yadav",
      "Suryakumar Yadav",
      "Umesh Yadav"
    ],
    Australia: [
      "Brad Hodge",
      "Ricky Ponting",
      "Shane Bond",
      "Mark Boucher",
      "Brad Haddin",
      "John Hastings",
      "Moises Henriques",
      "Brad Hogg",
      "David Hussey",
      "Mitchell Johnson",
      "Brett Lee",
      "Chris Lynn",
      "Mitchell Starc",
      "Aaron Finch",
      "Pat Cummins",
      "Nathan Coulter-Nile",
      "Tom Banton",
      "Shreyas Iyer",
      "Spencer Johnson"
    ],
    England: [
      "Moeen Ali",
      "Tom Banton",
      "Sam Billings",
      "Joe Denly",
      "Harry Gurney",
      "Eoin Morgan",
      "Jason Roy",
      "Phil Salt",
      "Chris Woakes"
    ],
    NewZealand: [
      "Trent Boult",
      "Brendon McCullum",
      "Colin de Grandhomme",
      "Lockie Ferguson",
      "Tim Seifert"
    ],
    SouthAfrica: [
      "Johan Botha",
      "Charl Langeveldt",
      "Ryan McLaren",
      "Morné Morkel",
      "David Wiese",
      "Marchant de Lange",
      "Chris Green"
    ],
    Pakistan: [
      "Shoaib Akhtar",
      "Salman Butt",
      "Umar Gul",
      "Mohammad Hafeez"
    ],
    WestIndies: [
      "Carlos Brathwaite",
      "Darren Bravo",
      "Chris Gayle",
      "Jason Holder",
      "Sunil Narine",
      "Andre Russell",
      "Javon Searles"
    ],
    SriLanka: [
      "Ajantha Mendis",
      "Angelo Mathews",
      "Sachithra Senanayake",
      "Dushmantha Chameera"
    ],
    Bangladesh: [
      "Shakib Al Hasan",
      "Litton Das",
      "Mashrafe Mortaza"
    ],
    Afghanistan: [
      "Rahmanullah Gurbaz"
    ],
    Ireland: [
      "Ryan ten Doeschate"
    ],
    Netherlands: [
      "Ryan ten Doeschate"
    ],
    Zimbabwe: [
      "Tatenda Taibu"
    ]
  },
  RCB: {
  India: [
    "Rahul Dravid",
    "Mayank Agarwal",
    "Arun Karthik",
    "Chidhambaram Gautam",
    "Mohammad Kaif",
    "Virat Kohli",
    "Karun Nair",
    "Cheteshwar Pujara",
    "Saurabh Tiwary",
    "Raju Bhatkal",
    "Ryan Ninan",
    "Balachandra Akhil",
    "Sunil Joshi",
    "Kedar Jadhav",
    "Bharat Chipli",
    "Shreevats Goswami",
    "Wasim Jaffer",
    "Manish Pandey",
    "Robin Uthappa",
    "Rajesh Bishnoi",
    "Ishank Jaggi",
    "Saurabh Bandekar",
    "Gaurav Dhiman",
    "KP Appanna",
    "Bhuvneshwar Kumar",
    "Praveen Kumar",
    "Abhimanyu Mithun",
    "Pankaj Singh",
    "Karn Sharma",
    "Vinay Kumar",
    "Jagadeesh Arunkumar",
    "Udit Patel",
    "Jitendra Patil",
    "Devraj Patil",
    "RK Sabharwal",
    "Tinu Yohannan",
    "Sridharan Sriram",
    "Anil Kumble",
    "BN Bharath",
    "Asad Pathan",
    "Abrar Kazi",
    "Jamaluddin Syed Mohammad",
    "Zaheer Khan",
    "Harshal Patel",
    "Prasanth Parameswaran",
    "S Thiyagarajan",
    "Vijay Zol",
    "Devdutt Padikkal",
    "Sreenath Aravind"
  ],
  SouthAfrica: [
    "AB de Villiers",
    "Mark Boucher",
    "Jacques Kallis",
    "Roelof van der Merwe",
    "Dillon du Preez",
    "Dale Steyn",
    "Rilee Rossouw",
    "Jonathan Vandiar",
    "Charl Langeveldt",
    "Johan van der Wath"
  ],
  NewZealand: [
    "Daniel Vettori"
  ],
  Australia: [
    "Cameron White",
    "Cameron Green",
    "Nathan Bracken",
    "Steven Smith",
    "Luke Pomersbach",
    "Dirk Nannes",
    "Andrew McDonald"
  ],
  England: [
    "Kevin Pietersen",
    "Eoin Morgan"
  ],
  SriLanka: [
    "Tillakaratne Dilshan",
    "Muthiah Muralidaran",
    "Nuwan Pradeep"
  ],
  WestIndies: [
    "Chris Gayle",
    "Shivnarine Chanderpaul"
  ],
  Bangladesh: [
    "Abdur Razzak"
  ],
  Pakistan: [
    "Misbah-ul-Haq"
  ]
},

  DC: {
    India: [
      "Rajat Bhatia",
      "Yo Mahesh",
      "Mithun Manhas",
      "Pradeep Sangwan",
      "Sarabjit Ladda",
      "Aavishkar Salvi",
      "Sridharan Sriram",
      "Ashok Dinda",
      "Yogesh Nagar",
      "Varun Aaron",
      "Sunny Gupta",
      "Virender Sehwag",
      "Amit Mishra",
      "Manprit Juneja",
      "Bharat Chipli",
      "Dinesh Karthik",
      "Siddarth Kaul",
      "Murali Vijay",
      "Laxmi Shukla",
      "Rahul Sharma",
      "Rahul Shukla",
      "Manoj Tiwary",
      "Kedar Jadhav",
      "C. M. Gautam",
      "Jaydev Unadkat",
      "Saurabh Tiwary",
      "Yuvraj Singh",
      "Domnic Joseph",
      "Jayant Yadav",
      "Mayank Agarwal",
      "Pawan Negi",
      "Prithvi Shaw",
      "Lalit Yadav",
      "Hanuma Vihari",
      "Harshal Patel",
      "Ajinkya Rahane",
      "Shreyas Iyer",
      "Axar Patel",
      "Mohit Sharma",
      "Kuldeep Yadav",
      "Abhishek Porel",
      "Mukesh Kumar",
      "Ashutosh Sharma",
      "Aman Khan",
      "Kumar Kushagra",
      "Yash Dhull",
      "Vipraj Nigam",
      "Sumit Kumar",
      "Ricky Bhui",
      "Ripal Patel",
      "Karun Nair",
      "Abhinav Manohar",
      "Rasikh Salam",
      "Chetan Sakariya",
      "Avesh Khan",
      "Tushar Deshpande",
      "Rishabh Pant",
      "Khaleel Ahmed"
    ],
    Australia: [
      "Brett Geeves",
      "Glenn McGrath",
      "Dirk Nannes",
      "Travis Birt",
      "Moises Henriques",
      "Andrew McDonald",
      "Matthew Wade",
      "James Hopes",
      "Aaron Finch",
      "Ben Rohrer",
      "Nathan Coulter-Nile",
      "Marcus Stoinis",
      "Alex Carey",
      "Daniel Sams",
      "Steve Smith",
      "Mitchell Marsh",
      "David Warner",
      "Jake Fraser-McGurk",
      "Jhye Richardson",
      "Pat Cummins",
      "Mitchell Starc"
    ],
    England: [
      "Owais Shah",
      "Paul Collingwood",
      "Kevin Pietersen",
      "Sam Billings",
      "Jason Roy",
      "Liam Plunkett",
      "Phil Salt",
      "Chris Woakes",
      "Tom Curran",
      "Joe Denly"
    ],
    Pakistan: [
      "Shoaib Malik",
      "Mohammad Asif"
    ],
    SouthAfrica: [
      "AB de Villiers",
      "Wayne Parnell",
      "Quinton de Kock",
      "JP Duminy",
      "Imran Tahir",
      "Morne Morkel",
      "Colin Ingram",
      "Chris Morris",
      "Kagiso Rabada",
      "Anrich Nortje",
      "Lizaad Williams",
      "Tristan Stubbs",
      "Faf du Plessis",
      "Donovan Ferreira",
      "Junior Dala"
    ],
    NewZealand: [
      "Daniel Vettori",
      "Doug Bracewell",
      "Ross Taylor",
      "James Neesham",
      "Colin Munro",
      "Tim Seifert"
    ],
    SriLanka: [
      "Tillakaratne Dilshan",
      "Farveez Maharoof",
      "Mahela Jayawardene",
      "Jeevan Mendis",
      "Angelo Mathews",
      "Dushmantha Chameera"
    ],
    WestIndies: [
      "Andre Russell",
      "Shimron Hetmyer",
      "Carlos Brathwaite",
      "Sherfane Rutherford",
      "Keemo Paul",
      "Rovman Powell",
      "Shai Hope"
    ],
    Bangladesh: [
      "Mustafizur Rahman"
    ],
    Afghanistan: [
      "Rahmanullah Gurbaz"
    ],
    UnitedStates: [
      "Unmukt Chand",
      "Corey Anderson"
    ],
    Netherlands: [
      "Roelof van der Merwe",
      "Ryan ten Doeschate"
    ],
    Zimbabwe: [
      "Tatenda Taibu"
    ]
  },
  LSG : {
  India: [
    "KL Rahul",
    "Ayush Badoni",
    "Mayank Yadav",
    "Ravi Bishnoi",
    "Mohsin Khan",
    "Krunal Pandya",
    "Deepak Hooda",
    "Avesh Khan",
    "Yash Thakur",
    "Manan Vohra",
    "Prerak Mankad",
    "Jaydev Unadkat",
    "Devdutt Padikkal",
    "K Gowtham",
    "Shivam Mavi",
    "Yudhvir Singh",
    "Arshin Kulkarni",
    "M. Siddharth",
    "Akash Deep",
    "Himmat Singh",
    "Digvesh Singh",
    "Shahbaz Ahmed",
    "Akash Singh",
    "Prince Yadav",
    "Yuvraj Chaudhary",
    "Rajvardhan Hangargekar",
    "Mohd. Arshad Khan",
    "Shardul Thakur",
    "Rishabh Pant"
  ],
  SouthAfrica: [
    "Quinton de Kock",
    "David Miller",
    "Matthew Breetzke"
  ],
  Australia: [
    "Marcus Stoinis",
    "Mitchell Marsh"
  ],
  WestIndies: [
    "Nicholas Pooran",
    "Kyle Mayers"
  ],
  Afghanistan: [
    "Naveen-ul-Haq"
  ],
  England: [
    "Mark Wood",
    "David Willey"
  ]
},

  GT: {
    India: [
      "Varun Aaron",
      "Pradeep Sangwan",
      "Hardik Pandya",
      "Mohammed Shami",
      "Yash Dayal",
      "Wriddhiman Saha",
      "Abhinav Manohar",
      "Vijay Shankar",
      "Darshan Nalkande",
      "Mohit Sharma",
      "BR Sharath",
      "Kartik Tyagi",
      "Sandeep Warrier",
      "Umesh Yadav",
      "Jayant Yadav",
      "Manav Suthar",
      "Sai Sudharsan",
      "Shubman Gill",
      "Rahul Tewatia",
      "Sai Kishore",
      "Shahrukh Khan"
    ],
    Australia: [
      "Matthew Wade",
      "Spencer Johnson"
    ],
    Afghanistan: [
      "Noor Ahmad",
      "Azmatullah Omarzai",
      "Rashid Khan"
    ],
    NewZealand: [
      "Lockie Ferguson",
      "Kane Williamson"
    ],
    SouthAfrica: [
      "David Miller",
      "Donovan Ferreira"
    ],
    WestIndies: [
      "Alzarri Joseph",
      "Sherfane Rutherford"
    ],
    Ireland: [
      "Josh Little"
    ],
    SriLanka: [
      "Dasun Shanaka",
      "Kusal Mendis",
      "Dushmantha Chameera"
    ],
    England: [
      "Jos Buttler"
    ]
  },
  DCG: {
    India: [
      "Shoaib Ahmed",
      "Sanjay Bangar",
      "Azhar Bilakhia",
      "Sumanth Bodapati",
      "Bharat Chipli",
      "Halhadar Das",
      "Kedar Devdhar",
      "Shikhar Dhawan",
      "Kalyankrishna Doddapaneni",
      "Ravi Teja Dwaraka",
      "Manpreet Gony",
      "Ishank Jaggi",
      "Abhishek Jhunjhunwala",
      "Abhinav Kumar",
      "Vijay Kumar",
      "Amit Mishra",
      "Mohnish Mishra",
      "Pragyan Ojha",
      "Parthiv Patel",
      "Anand Rajan",
      "Akshath Reddy",
      "Ashish Reddy",
      "Anirudh Singh",
      "Harmeet Singh",
      "Jaskaran Singh",
      "R. P. Singh",
      "Sunny Sohal",
      "Suman Tirumalasetti",
      "VVS Laxman",
      "Arjun Yadav",
      "Venugopal Rao",
      "Ishant Sharma",
      "Rahul Sharma",
      "Rohit Sharma",
      "Manpreet Gony",
      "Ashish Reddy",
      "Pragyan Ojha",
      "Venugopal Rao",
      "Ankit Sharma",
      "Ravi Teja Dwaraka"
    ],
    Australia: [
      "Dan Christian",
      "Adam Gilchrist",
      "Daniel Harris",
      "Ryan Harris",
      "Chris Lynn",
      "Mitchell Marsh",
      "Andrew Symonds",
      "Cameron White"
    ],
    SouthAfrica: [
      "JP Duminy",
      "Herschelle Gibbs",
      "Dale Steyn"
    ],
    WestIndies: [
      "Fidel Edwards",
      "Kemar Roach",
      "Dwayne Smith"
    ],
    SriLanka: [
      "Kumar Sangakkara",
      "Chaminda Vaas",
      "Nuwan Zoysa",
      "Chamara Silva"
    ],
    NewZealand: [
      "Scott Styris"
    ],
    Pakistan: [
      "Shahid Afridi"
    ]
  },
  KTK: {
    India: [
      "Balachandra Akhil",
      "Gnaneswara Rao",
      "Kedar Jadhav",
      "Padmanabhan Prasanth",
      "Parthiv Patel",
      "Prasanth Parameswaran",
      "Raiphi Gomez",
      "Ramesh Powar",
      "Ravindra Jadeja",
      "R. P. Singh",
      "Sreesanth",
      "Vinay Kumar",
      "VVS Laxman"
    ],
    Australia: [
      "Brad Hodge",
      "Michael Klinger"
    ],
    NewZealand: [
      "Brendon McCullum"
    ],
    SriLanka: [
      "Mahela Jayawardene",
      "Muttiah Muralitharan",
      "Thisara Perera"
    ],
    England: [
      "Owais Shah"
    ]
  },
  PWI: {
    India: [
      "Udit Birla",
      "Ashok Dinda",
      "Sourav Ganguly",
      "Raiphi Gomez",
      "Abhishek Jhunjhunwala",
      "Kamran Khan",
      "Murali Kartik",
      "Bhuvneshwar Kumar",
      "Anustup Majumdar",
      "Mithun Manhas",
      "Mohnish Mishra",
      "Shrikant Mundhe",
      "Ali Murtaza",
      "Abhishek Nayar",
      "Ashish Nehra",
      "Ishwar Pandey",
      "Manish Pandey",
      "Parvez Rasool",
      "Sachin Rana",
      "Mahesh Rawat",
      "Rahul Sharma",
      "Harpreet Singh",
      "Yuvraj Singh",
      "Tirumalasetti Suman",
      "Krishnakant Upadhyay",
      "Robin Uthappa",
      "Shrikant Wagh"
    ],
    Australia: [
      "Michael Clarke",
      "James Faulkner",
      "Callum Ferguson",
      "Aaron Finch",
      "Mitchell Marsh",
      "Tim Paine",
      "Kane Richardson",
      "Steve Smith"
    ],
    England: [
      "Luke Wright"
    ],
    NewZealand: [
      "Nathan McCullum",
      "Jesse Ryder",
      "Ross Taylor"
    ],
    SouthAfrica: [
      "Wayne Parnell",
      "Graeme Smith",
      "Alfonso Thomas"
    ],
    SriLanka: [
      "Angelo Mathews",
      "Ajantha Mendis"
    ],
    WestIndies: [
      "Marlon Samuels",
      "Jerome Taylor"
    ]
  },
  PBKS: {
    Australia: [
      "George Bailey",
      "Xavier Bartlett",
      "Nathan Ellis",
      "James Faulkner",
      "Aaron Finch",
      "Adam Gilchrist",
      "Ryan Harris",
      "Moises Henriques",
      "James Hopes",
      "David Hussey",
      "Josh Inglis",
      "Mitchell Johnson",
      "Simon Katich",
      "Brett Lee",
      "Shaun Marsh",
      "Glenn Maxwell",
      "Riley Meredith",
      "Michael Neser",
      "Luke Pomersbach",
      "Jhye Richardson",
      "Nathan Rimmington",
      "Matthew Short",
      "Marcus Stoinis",
      "Andrew Tye"
    ],
    Afghanistan: [
      "Azmatullah Omarzai",
      "Mujeeb Ur Rahman"
    ],
    England: [
      "Jonny Bairstow",
      "Ravi Bopara",
      "Sam Curran",
      "Chris Jordan",
      "Liam Livingstone",
      "Dawid Malan",
      "Dimitri Mascarenhas",
      "Eoin Morgan",
      "Adil Rashid"
    ],
    India: [
      "Varun Aaron",
      "Love Ablish",
      "Akshdeep Nath",
      "Mayank Agarwal",
      "Anureet Singh",
      "Vaibhav Arora",
      "Arshdeep Singh",
      "Priyansh Arya",
      "Murugan Ashwin",
      "Ravichandran Ashwin",
      "Parvinder Awana",
      "Lakshmipathy Balaji",
      "Raj Bawa",
      "Bhargav Bhatt",
      "Bipul Sharma",
      "Manvinder Bisla",
      "Ranadeb Bose",
      "KC Cariappa",
      "Yuzvendra Chahal",
      "Rahul Chahar",
      "Piyush Chawla",
      "Siddharth Chitnis",
      "Pankaj Dharmani",
      "Rishi Dhawan",
      "Shikhar Dhawan",
      "Paras Dogra",
      "Gagandeep Singh",
      "Karan Goel",
      "Manpreet Gony",
      "Krishnappa Gowtham",
      "Gurkeerat Mann",
      "Gurnoor Brar",
      "Harmeet Singh",
      "Harpreet Brar",
      "Harpreet Singh",
      "Deepak Hooda",
      "Shreyas Iyer",
      "Mohammad Kaif",
      "Karanveer Singh",
      "Dinesh Karthik",
      "Murali Kartik",
      "Uday Kaul",
      "Vidwath Kaverappa",
      "Sarfaraz Khan",
      "Taruwar Kohli",
      "Praveen Kumar",
      "Vikramjeet Malik",
      "Mandeep Singh",
      "Prerak Mankad",
      "Mohammed Shami",
      "Mohit Rathee",
      "Wilkin Mota",
      "Nikhil Naik",
      "Karun Nair",
      "T Natarajan",
      "Abhishek Nayar",
      "Axar Patel",
      "Harshal Patel",
      "Irfan Pathan",
      "Ishan Porel",
      "Ramesh Powar",
      "Prabhsimran Singh",
      "Cheteshwar Pujara",
      "KL Rahul",
      "Ankit Rajpoot",
      "Ravi Bishnoi",
      "Wriddhiman Saha",
      "Pardeep Sahu",
      "Nitin Saini",
      "Sandeep Sharma",
      "Rajagopal Sathish",
      "Jalaj Saxena",
      "Virender Sehwag",
      "Shahrukh Khan",
      "Ashutosh Sharma",
      "Ishant Sharma",
      "Jitesh Sharma",
      "Mohit Sharma",
      "Shashank Singh",
      "Shivam Sharma",
      "Shivam Singh",
      "VRV Singh",
      "Reetinder Sodhi",
      "Barinder Sran",
      "S Sreesanth",
      "Shalabh Srivastava",
      "Tanmay Srivastava",
      "Sunny Singh",
      "Suryansh Shedge",
      "Swapnil Singh",
      "Atharva Taide",
      "Rahul Tewatia",
      "Shardul Thakur",
      "Yash Thakur",
      "Manoj Tiwary",
      "Paul Valthaty",
      "Murali Vijay",
      "Manan Vohra",
      "Yuvraj Singh"
    ],
    NewZealand: [
      "Lockie Ferguson",
      "Martin Guptill",
      "Matt Henry",
      "James Neesham"
    ],
    Pakistan: [
      "Azhar Mahmood"
    ],
    SouthAfrica: [
      "Kyle Abbott",
      "Yusuf Abdullah",
      "Hashim Amla",
      "Farhaan Behardien",
      "Beuran Hendricks",
      "Marco Jansen",
      "Ryan McLaren",
      "Aiden Markram",
      "David Miller",
      "Kagiso Rabada",
      "Rilee Rossouw",
      "Hardus Viljoen"
    ],
    SriLanka: [
      "Mahela Jayawardene",
      "Thisara Perera",
      "Bhanuka Rajapaksa",
      "Kumar Sangakkara"
    ],
    UnitedStates: [
      "Sunny Sohal",
      "Rusty Theron"
    ],
    WestIndies: [
      "Fabian Allen",
      "Adrian Barath",
      "Sheldon Cottrell",
      "Chris Gayle",
      "Nicholas Pooran",
      "Ramnaresh Sarwan",
      "Odean Smith"
    ],
    Zimbabwe: [
      "Sikandar Raza"
    ]
  },
  SRH: {
    India: [
      "Abdul Samad",
      "Abhishek Sharma",
      "Khaleel Ahmed",
      "Anand Rajan",
      "Srikkanth Anirudha",
      "Ankit Sharma",
      "Ashish Reddy",
      "Basil Thampi",
      "Ricky Bhui",
      "Bipul Sharma",
      "Shikhar Dhawan",
      "Priyam Garg",
      "Shreyas Gopal",
      "Shreevats Goswami",
      "Deepak Hooda",
      "Kedar Jadhav",
      "Kartik Tyagi",
      "Siddarth Kaul",
      "Bhuvneshwar Kumar",
      "Praveen Kumar",
      "Mohammed Siraj",
      "Shahbaz Nadeem",
      "Thangarasu Natarajan",
      "Ashish Nehra",
      "Naman Ojha",
      "Manish Pandey",
      "Parvez Rasool",
      "Parthiv Patel",
      "Irfan Pathan",
      "Yusuf Pathan",
      "K.L. Rahul",
      "Dwaraka Ravi Teja",
      "Akshath Reddy",
      "Wriddhiman Saha",
      "Biplab Samantray",
      "Sandeep Sharma",
      "Vijay Shankar",
      "Ishant Sharma",
      "Karn Sharma",
      "Shashank Singh",
      "Barinder Sran",
      "Jagadeesha Suchith",
      "Aditya Tare",
      "Thalaivan Sargunam",
      "Rahul Tripathi",
      "Umran Malik",
      "Venugopal Rao",
      "Hanuma Vihari",
      "Virat Singh",
      "Washington Sundar",
      "Yuvraj Singh"
    ],
    Australia: [
      "Ben Cutting",
      "Aaron Finch",
      "Moisés Henriques",
      "Mitchell Marsh",
      "Billy Stanlake",
      "David Warner",
      "Cameron White"
    ],
    SouthAfrica: [
      "Sean Abbott",
      "Quinton de Kock",
      "JP Duminy",
      "Marco Jansen",
      "Aiden Markram",
      "Dale Steyn"
    ],
    England: [
      "Jonny Bairstow",
      "Ravi Bopara",
      "Alex Hales",
      "Chris Jordan",
      "Eoin Morgan",
      "Jason Roy"
    ],
    NewZealand: [
      "Trent Boult",
      "Martin Guptill",
      "Kane Williamson"
    ],
    WestIndies: [
      "Carlos Brathwaite",
      "Jason Holder",
      "Nicholas Pooran",
      "Darren Sammy",
      "Romario Shepherd"
    ],
    Afghanistan: [
      "Fazalhaq Farooqi",
      "Mohammad Nabi",
      "Mujeeb Ur Rahman",
      "Rashid Khan"
    ],
    Bangladesh: [
      "Mustafizur Rahman",
      "Shakib Al Hasan"
    ],
    SriLanka: [
      "Thisara Perera",
      "Kumar Sangakkara"
    ]
  }
  }
  export function getRandomStartOptions(count: number = 3): { 
    countries: string[]; 
    teams: string[] 
  } {
    const countryCodes = Object.keys(countryNames);
    const validTeamCodes = Object.keys(teamNames);
    const validPairs: { team: string; country: string }[] = [];

    // Step 1: Build all valid (team, country) pairs
    for (const team of validTeamCodes) {
      const teamData = (playerList as any)[team];
      if (!teamData) continue;

      for (const countryCode of countryCodes) {
        const countryName = countryNames[countryCode];
        const players = teamData[countryName] || teamData[countryCode];
        if (Array.isArray(players) && players.length > 0) {
          validPairs.push({ team, country: countryCode });
        }
      }
    }

    if (validPairs.length === 0) {
      console.warn("No valid team-country pairs found!");
      return { countries: [], teams: [] };
    }

    // Step 2: Get usage counts for fair distribution
    const usageCounts = getUsageCounts();
    
    // Step 3: Get all unique teams and countries that have valid pairs
    const availableTeams = new Set<string>();
    const availableCountries = new Set<string>();
    validPairs.forEach(pair => {
      availableTeams.add(pair.team);
      availableCountries.add(pair.country);
    });

    // Step 4: Use weighted selection to pick teams and countries
    // This ensures less-used items have higher probability of being selected
    const selectedTeams = weightedSelect(
      Array.from(availableTeams),
      usageCounts.teams,
      count,
      new Set<string>()
    );
    
    const selectedCountries = weightedSelect(
      Array.from(availableCountries),
      usageCounts.countries,
      count,
      new Set<string>()
    );

    // Step 5: Ensure we have valid pairs for selected teams and countries
    // Filter to only include pairs that exist in validPairs
    const teamsSet = new Set(selectedTeams);
    const countriesSet = new Set(selectedCountries);
    
    const finalTeams: string[] = [];
    const finalCountries: string[] = [];
    const usedTeams = new Set<string>();
    const usedCountries = new Set<string>();
    
    // Shuffle valid pairs to randomize selection
    const shuffledPairs = shuffleArray(validPairs);
    
    // First, try to get pairs that match both selected team and country
    for (const pair of shuffledPairs) {
      if (finalTeams.length >= count && finalCountries.length >= count) break;
      
      const teamMatches = teamsSet.has(pair.team) && !usedTeams.has(pair.team);
      const countryMatches = countriesSet.has(pair.country) && !usedCountries.has(pair.country);
      
      if (teamMatches && finalTeams.length < count) {
        finalTeams.push(pair.team);
        usedTeams.add(pair.team);
      }
      
      if (countryMatches && finalCountries.length < count) {
        finalCountries.push(pair.country);
        usedCountries.add(pair.country);
      }
    }
    
    // Fill remaining slots with weighted selection from remaining options
    const remainingTeams = Array.from(availableTeams).filter(t => !usedTeams.has(t));
    const remainingCountries = Array.from(availableCountries).filter(c => !usedCountries.has(c));
    
    while (finalTeams.length < count && remainingTeams.length > 0) {
      const additional = weightedSelect(remainingTeams, usageCounts.teams, 1, usedTeams);
      if (additional.length > 0) {
        finalTeams.push(additional[0]);
        usedTeams.add(additional[0]);
        const index = remainingTeams.indexOf(additional[0]);
        if (index > -1) remainingTeams.splice(index, 1);
      } else {
        break;
      }
    }
    
    while (finalCountries.length < count && remainingCountries.length > 0) {
      const additional = weightedSelect(remainingCountries, usageCounts.countries, 1, usedCountries);
      if (additional.length > 0) {
        finalCountries.push(additional[0]);
        usedCountries.add(additional[0]);
        const index = remainingCountries.indexOf(additional[0]);
        if (index > -1) remainingCountries.splice(index, 1);
      } else {
        break;
      }
    }
    
    // Fallback: fill up if still less than count
    while (finalTeams.length < count) {
      const t = pickN(validTeamCodes, 1)[0];
      if (!finalTeams.includes(t)) finalTeams.push(t);
    }
    while (finalCountries.length < count) {
      const c = pickN(countryCodes, 1)[0];
      if (!finalCountries.includes(c)) finalCountries.push(c);
    }

    // Step 6: Update usage counts
    updateUsageCounts(finalTeams, finalCountries);

    return { countries: finalCountries.slice(0, count), teams: finalTeams.slice(0, count) };
  }

  export function getGameOptionsByMode(
    mode: 'country-x-ipl' | 'ipl-x-ipl',
    count: number = 3
  ): { countries: string[]; teams: string[]; rowLabels?: string[]; colLabels?: string[] } {
    const validTeamCodes = Object.keys(teamNames);
    const countryCodes = Object.keys(countryNames);
    
    if (mode === 'country-x-ipl') {
    const usageCounts = getUsageCounts();

    // 1) Build mapping: team -> countries that actually have players in that team
    const teamToCountries = new Map<string, string[]>();
    for (const teamCode of validTeamCodes) {
      const teamData = (playerList as any)[teamCode];
      if (!teamData) continue;

      const countriesForTeam: string[] = [];
      for (const countryCode of countryCodes) {
        const countryName = countryNames[countryCode];
        const players = teamData[countryName] || teamData[countryCode];
        if (Array.isArray(players) && players.length > 0) {
          countriesForTeam.push(countryCode);
        }
      }

      if (countriesForTeam.length > 0) {
        teamToCountries.set(teamCode, countriesForTeam);
      }
    }

    // If nothing valid, return empty
    if (teamToCountries.size === 0) {
      console.warn('No valid teams with countries found!');
      return { countries: [], teams: [] };
    }

    // 2) Enumerate all team trios and compute their common countries
    const eligibleTeams = Array.from(teamToCountries.keys());
    const teamUsage = usageCounts.teams;
    type Trio = { teams: [string, string, string]; common: string[] };
    const trios: Trio[] = [];
    for (let i = 0; i < eligibleTeams.length; i++) {
      for (let j = i + 1; j < eligibleTeams.length; j++) {
        for (let k = j + 1; k < eligibleTeams.length; k++) {
          const t1 = eligibleTeams[i];
          const t2 = eligibleTeams[j];
          const t3 = eligibleTeams[k];
          const c1 = new Set(teamToCountries.get(t1) || []);
          const c2 = new Set(teamToCountries.get(t2) || []);
          const c3 = new Set(teamToCountries.get(t3) || []);
          const common = Array.from(c1).filter(c => c2.has(c) && c3.has(c));
          if (common.length > 0) trios.push({ teams: [t1, t2, t3], common });
        }
      }
    }

    if (trios.length === 0) {
      console.warn('Unable to form any team trio with overlapping countries');
      return { countries: [], teams: [] };
    }

    // Prefer trios with at least `count` common countries; if none, allow best we have
    const maxCommon = Math.max(...trios.map(t => t.common.length));
    const candidateTrios = trios.filter(t => t.common.length >= Math.min(count, maxCommon));

    // Weighted pick a trio based on team underuse to equalize chances
    const trio = weightedPickByScore(candidateTrios, (t) => {
      const w1 = 1 / ((teamUsage[t.teams[0]] || 0) + 1);
      const w2 = 1 / ((teamUsage[t.teams[1]] || 0) + 1);
      const w3 = 1 / ((teamUsage[t.teams[2]] || 0) + 1);
      // Slightly reward larger intersections to avoid dead-ends
      const bonus = t.common.length;
      return (w1 + w2 + w3) + 0.1 * bonus;
    });

    const selectedTeams = trio ? trio.teams : candidateTrios[0].teams;
    const intersectionCountries = trio ? trio.common : candidateTrios[0].common;

    // 3) Select `count` countries strictly from the intersection, weighted by country underuse
    const selectedCountries = weightedSelect(
      intersectionCountries,
      usageCounts.countries,
      Math.min(count, intersectionCountries.length),
      new Set<string>()
    );

    // If not enough by weight, fill randomly from intersection
    while (selectedCountries.length < count && selectedCountries.length < intersectionCountries.length) {
      const extras = pickN(intersectionCountries.filter(c => !selectedCountries.includes(c)), 1);
      if (extras.length === 0) break;
      selectedCountries.push(extras[0]);
    }

    const finalCountries = selectedCountries.slice(0, count);
    const finalTeams = selectedTeams.slice(0, count);

    updateUsageCounts(finalTeams, finalCountries);
    return { countries: finalCountries, teams: finalTeams };
  } else if (mode === 'ipl-x-ipl') {
      // Build team -> all players set
      const usageCounts = getUsageCounts();
      const teamToPlayers = new Map<string, Set<string>>();
      for (const teamCode of Object.keys(teamNames)) {
        const teamData = (playerList as any)[teamCode];
        if (!teamData) continue;
        const players = new Set<string>();
        Object.values(teamData).forEach((arr: any) => {
          if (Array.isArray(arr)) {
            for (const p of arr) players.add(p);
          }
        });
        if (players.size > 0) teamToPlayers.set(teamCode, players);
      }

      const teams = Array.from(teamToPlayers.keys());
      type Pair = { rowTeams: [string, string, string]; colTeams: [string, string, string] };
      const candidates: Pair[] = [];

      // Helper to check if two teams share at least one player
      const share = (a: string, b: string) => {
        const pa = teamToPlayers.get(a)!; const pb = teamToPlayers.get(b)!;
        for (const name of pa) if (pb.has(name)) return true;
        return false;
      };

      // Find disjoint rows and cols such that every row-col pair shares a player (aim K_{3,3})
      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          for (let k = j + 1; k < teams.length; k++) {
            const r: [string, string, string] = [teams[i], teams[j], teams[k]];
            for (let a = 0; a < teams.length; a++) {
              if (r.includes(teams[a])) continue;
              for (let b = a + 1; b < teams.length; b++) {
                if (r.includes(teams[b])) continue;
                for (let c = b + 1; c < teams.length; c++) {
                  if (r.includes(teams[c])) continue;
                  const cset: [string, string, string] = [teams[a], teams[b], teams[c]];
                  // Check every pair shares
                  let ok = true;
                  for (const rt of r) {
                    for (const ct of cset) {
                      if (!share(rt, ct)) { ok = false; break; }
                    }
                    if (!ok) break;
                  }
                  if (ok) candidates.push({ rowTeams: r, colTeams: cset });
                }
              }
            }
          }
        }
      }

      // If no perfect K_{3,3}, fallback to best density (maximize shared pairs)
      if (candidates.length === 0) {
        let best: { rowTeams: [string, string, string]; colTeams: [string, string, string]; score: number } | null = null;
        for (let i = 0; i < teams.length; i++) {
          for (let j = i + 1; j < teams.length; j++) {
            for (let k = j + 1; k < teams.length; k++) {
              const r: [string, string, string] = [teams[i], teams[j], teams[k]];
              for (let a = 0; a < teams.length; a++) {
                if (r.includes(teams[a])) continue;
                for (let b = a + 1; b < teams.length; b++) {
                  if (r.includes(teams[b])) continue;
                  for (let c = b + 1; c < teams.length; c++) {
                    if (r.includes(teams[c])) continue;
                    const cset: [string, string, string] = [teams[a], teams[b], teams[c]];
                    let edges = 0;
                    for (const rt of r) for (const ct of cset) if (share(rt, ct)) edges++;
                    const usageSum = (usageCounts.teams[r[0]]||0)+(usageCounts.teams[r[1]]||0)+(usageCounts.teams[r[2]]||0)+(usageCounts.teams[cset[0]]||0)+(usageCounts.teams[cset[1]]||0)+(usageCounts.teams[cset[2]]||0);
                    const score = edges * 100 - usageSum; // prefer more edges, less used
                    if (!best || score > best.score) best = { rowTeams: r, colTeams: cset, score };
                  }
                }
              }
            }
          }
        }
        if (!best) return { countries: [], teams: [] };
        updateUsageCounts([...best.rowTeams, ...best.colTeams], []);
        return { countries: [], teams: [], rowLabels: best.rowTeams, colLabels: best.colTeams };
      }

      // Weighted pick among candidates favoring least-used teams
      const pick = weightedPickByScore(candidates, (cand) => {
        const t = [...cand.rowTeams, ...cand.colTeams];
        const w = t.reduce((sum, tt) => sum + 1 / ((usageCounts.teams[tt] || 0) + 1), 0);
        return w;
      }) as Pair | null;
      const chosen = pick || candidates[0];
      updateUsageCounts([...chosen.rowTeams, ...chosen.colTeams], []);
      return { countries: [], teams: [], rowLabels: chosen.rowTeams, colLabels: chosen.colTeams };
    }
    // Default fallback to satisfy exhaustiveness
    return { countries: [], teams: [] };
  }
