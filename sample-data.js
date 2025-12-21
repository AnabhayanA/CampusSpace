// Sample course data based on NJIT schedule
// This data represents typical course schedules with room assignments

module.exports = [
  // KUPF Building
  {
    section: "002",
    crn: "10001",
    days: "TR",
    times: "1:00 PM - 2:20 PM",
    location: "KUPF 207",
    status: "Closed",
    maxStudents: 43,
    enrolled: 43,
    instructor: "Li, Nichole",
    deliveryMode: "Face-to-Face"
  },
  {
    section: "004",
    crn: "10002",
    days: "TF",
    times: "10:00 AM - 11:20 AM",
    location: "KUPF 103",
    status: "Open",
    maxStudents: 43,
    enrolled: 34,
    instructor: "Ma, Yue",
    deliveryMode: "Face-to-Face"
  },
  {
    section: "102",
    crn: "10003",
    days: "T",
    times: "6:00 PM - 8:50 PM",
    location: "KUPF 105",
    status: "Open",
    maxStudents: 43,
    enrolled: 20,
    instructor: "Li, Nichole",
    deliveryMode: "Face-to-Face"
  },
  {
    section: "002",
    crn: "10004",
    days: "MR",
    times: "2:30 PM - 3:50 PM",
    location: "KUPF 202",
    status: "Closed",
    maxStudents: 43,
    enrolled: 43,
    instructor: "Li, Nichole",
    deliveryMode: "Face-to-Face"
  },
  {
    section: "102",
    crn: "10005",
    days: "M",
    times: "6:00 PM - 8:50 PM",
    location: "KUPF 202",
    status: "Closed",
    maxStudents: 43,
    enrolled: 43,
    instructor: "Li, Nichole",
    deliveryMode: "Face-to-Face"
  },
  {
    section: "002",
    crn: "10006",
    days: "MR",
    times: "2:30 PM - 3:50 PM",
    location: "KUPF 105",
    status: "Open",
    maxStudents: 43,
    enrolled: 33,
    instructor: "Tamke, William",
    deliveryMode: "Face-to-Face"
  },
  {
    section: "004",
    crn: "10007",
    days: "MR",
    times: "11:30 AM - 12:50 PM",
    location: "KUPF 206",
    status: "Open",
    maxStudents: 43,
    enrolled: 42,
    instructor: "Tamke, William",
    deliveryMode: "Face-to-Face"
  },
  {
    section: "102",
    crn: "10008",
    days: "T",
    times: "6:00 PM - 8:50 PM",
    location: "KUPF 202",
    status: "Open",
    maxStudents: 43,
    enrolled: 33,
    instructor: "Tamke, William",
    deliveryMode: "Face-to-Face"
  },
  {
    section: "102",
    crn: "10014",
    days: "R",
    times: "6:00 PM - 8:50 PM",
    location: "KUPF 209",
    status: "Open",
    maxStudents: 43,
    enrolled: 9,
    instructor: "Ma, Yue",
    deliveryMode: "Hybrid"
  },
  
  // FMH Building
  {
    section: "002",
    crn: "10010",
    days: "TR",
    times: "2:30 PM - 3:50 PM",
    location: "FMH 408",
    status: "Open",
    maxStudents: 43,
    enrolled: 16,
    instructor: "Taylor, Ming",
    deliveryMode: "Face-to-Face"
  },
  {
    section: "003",
    crn: "20001",
    days: "MWF",
    times: "9:00 AM - 9:50 AM",
    location: "FMH 204",
    status: "Open",
    maxStudents: 35,
    enrolled: 28,
    instructor: "Johnson, Sarah",
    deliveryMode: "Face-to-Face"
  },
  {
    section: "005",
    crn: "20002",
    days: "TR",
    times: "8:30 AM - 9:50 AM",
    location: "FMH 310",
    status: "Open",
    maxStudents: 40,
    enrolled: 35,
    instructor: "Davis, Michael",
    deliveryMode: "Face-to-Face"
  },
  
  // CAB Building
  {
    section: "102",
    crn: "10009",
    days: "M",
    times: "6:00 PM - 8:50 PM",
    location: "CAB 2020",
    status: "Open",
    maxStudents: 43,
    enrolled: 13,
    instructor: "Micale, Joseph",
    deliveryMode: "Face-to-Face"
  },
  {
    section: "102",
    crn: "10012",
    days: "W",
    times: "6:00 PM - 8:50 PM",
    location: "CAB 2020",
    status: "Open",
    maxStudents: 43,
    enrolled: 7,
    instructor: "Tamke, William",
    deliveryMode: "Face-to-Face"
  },
  {
    section: "003",
    crn: "30001",
    days: "MWF",
    times: "10:00 AM - 10:50 AM",
    location: "CAB 310",
    status: "Open",
    maxStudents: 30,
    enrolled: 25,
    instructor: "Brown, Lisa",
    deliveryMode: "Face-to-Face"
  },
  
  // GITC Building
  {
    section: "001",
    crn: "40001",
    days: "TR",
    times: "11:30 AM - 12:50 PM",
    location: "GITC 1400",
    status: "Open",
    maxStudents: 50,
    enrolled: 45,
    instructor: "Wilson, Robert",
    deliveryMode: "Face-to-Face"
  },
  {
    section: "002",
    crn: "40002",
    days: "MWF",
    times: "1:00 PM - 1:50 PM",
    location: "GITC 2400",
    status: "Open",
    maxStudents: 45,
    enrolled: 40,
    instructor: "Anderson, Emily",
    deliveryMode: "Face-to-Face"
  },
  {
    section: "003",
    crn: "40003",
    days: "TR",
    times: "4:00 PM - 5:20 PM",
    location: "GITC 3400",
    status: "Open",
    maxStudents: 40,
    enrolled: 38,
    instructor: "Martinez, Carlos",
    deliveryMode: "Face-to-Face"
  },
  
  // CKB Building
  {
    section: "001",
    crn: "50001",
    days: "MWF",
    times: "11:00 AM - 11:50 AM",
    location: "CKB 216",
    status: "Open",
    maxStudents: 35,
    enrolled: 30,
    instructor: "Thompson, Jennifer",
    deliveryMode: "Face-to-Face"
  },
  {
    section: "002",
    crn: "50002",
    days: "TR",
    times: "1:00 PM - 2:20 PM",
    location: "CKB 227",
    status: "Open",
    maxStudents: 35,
    enrolled: 32,
    instructor: "White, David",
    deliveryMode: "Face-to-Face"
  },
  {
    section: "003",
    crn: "50003",
    days: "MWF",
    times: "2:00 PM - 2:50 PM",
    location: "CKB 304",
    status: "Open",
    maxStudents: 30,
    enrolled: 25,
    instructor: "Garcia, Maria",
    deliveryMode: "Face-to-Face"
  },
  
  // Tiernan Building
  {
    section: "001",
    crn: "60001",
    days: "TR",
    times: "10:00 AM - 11:20 AM",
    location: "Tiernan 101",
    status: "Open",
    maxStudents: 40,
    enrolled: 35,
    instructor: "Lee, James",
    deliveryMode: "Face-to-Face"
  },
  {
    section: "002",
    crn: "60002",
    days: "MWF",
    times: "3:00 PM - 3:50 PM",
    location: "Tiernan 205",
    status: "Open",
    maxStudents: 35,
    enrolled: 30,
    instructor: "Harris, Susan",
    deliveryMode: "Face-to-Face"
  },
  
  // Cullimore Building
  {
    section: "001",
    crn: "70001",
    days: "TR",
    times: "9:00 AM - 10:20 AM",
    location: "Cullimore 204",
    status: "Open",
    maxStudents: 45,
    enrolled: 40,
    instructor: "Clark, Richard",
    deliveryMode: "Face-to-Face"
  },
  {
    section: "002",
    crn: "70002",
    days: "MWF",
    times: "12:00 PM - 12:50 PM",
    location: "Cullimore 308",
    status: "Open",
    maxStudents: 40,
    enrolled: 38,
    instructor: "Lewis, Patricia",
    deliveryMode: "Face-to-Face"
  },
  
  // WEC Building
  {
    section: "001",
    crn: "80001",
    days: "TR",
    times: "3:30 PM - 4:50 PM",
    location: "WEC 201",
    status: "Open",
    maxStudents: 30,
    enrolled: 25,
    instructor: "Walker, Thomas",
    deliveryMode: "Face-to-Face"
  },
  {
    section: "002",
    crn: "80002",
    days: "MWF",
    times: "4:00 PM - 4:50 PM",
    location: "WEC 305",
    status: "Open",
    maxStudents: 30,
    enrolled: 28,
    instructor: "Hall, Nancy",
    deliveryMode: "Face-to-Face"
  }
];
