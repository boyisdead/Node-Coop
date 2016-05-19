
/** academic_positions indexes **/
db.getCollection("academic_positions").ensureIndex({
  "_id": NumberInt(1)
},[
  
]);

/** applications indexes **/
db.getCollection("applications").ensureIndex({
  "_id": NumberInt(1)
},[
  
]);

/** companies indexes **/
db.getCollection("companies").ensureIndex({
  "_id": NumberInt(1)
},[
  
]);

/** counters indexes **/
db.getCollection("counters").ensureIndex({
  "_id": NumberInt(1)
},[
  
]);

/** job_positions indexes **/
db.getCollection("job_positions").ensureIndex({
  "_id": NumberInt(1)
},[
  
]);

/** students indexes **/
db.getCollection("students").ensureIndex({
  "_id": NumberInt(1)
},[
  
]);

/** teachers indexes **/
db.getCollection("teachers").ensureIndex({
  "_id": NumberInt(1)
},[
  
]);

/** teachers indexes **/
db.getCollection("teachers").ensureIndex({
  "contact.email": NumberInt(1)
},{
  "unique": true
});

/** title_names indexes **/
db.getCollection("title_names").ensureIndex({
  "_id": NumberInt(1)
},[
  
]);

/** academic_positions records **/
db.getCollection("academic_positions").insert({
  "_id": 4,
  "full": {
    "en": "Professor",
    "th": "ศาสตราจารย์"
  },
  "initial": {
    "en": "Prof",
    "th": "ศ."
  }
});
db.getCollection("academic_positions").insert({
  "_id": 1,
  "full": {
    "en": "Instructor",
    "th": "อาจารย์"
  },
  "initial": {
    "en": "Instructor",
    "th": "อ."
  }
});
db.getCollection("academic_positions").insert({
  "_id": 3,
  "full": {
    "en": "Associate Professor",
    "th": "รองศาสตราจารย์"
  },
  "initial": {
    "en": "Assoc. Prof.",
    "th": "รศ."
  }
});
db.getCollection("academic_positions").insert({
  "_id": 2,
  "full": {
    "en": "Assistant Professor",
    "th": "ผู้ช่วยศาสตราจารย์"
  },
  "initial": {
    "en": "Asst. Prof.",
    "th": "ผศ."
  }
});

/** applications records **/

/** companies records **/

/** counters records **/
db.getCollection("counters").insert({
  "_id": "companies",
  "seq": 0
});
db.getCollection("counters").insert({
  "_id": "announces",
  "seq": 0
});
db.getCollection("counters").insert({
  "_id": "dlcs",
  "seq": 0
});
db.getCollection("counters").insert({
  "_id": "teachers",
  "seq": 0
});
db.getCollection("counters").insert({
  "_id": "attachments",
  "seq": 0
});

/** job_positions records **/
db.getCollection("job_positions").insert({
  "_id": 1,
  "name": "หัวหน้าฝ่ายบุคคล"
});
db.getCollection("job_positions").insert({
  "_id": 2,
  "name": "กรรมการผู้จัดการ"
});
db.getCollection("job_positions").insert({
  "_id": 3,
  "name": "กรรมการบริหาร"
});
db.getCollection("job_positions").insert({
  "_id": 4,
  "name": "ผู้จัดการฝ่ายบุคคล"
});
db.getCollection("job_positions").insert({
  "_id": 5,
  "name": "Head of Software Research"
});

/** students records **/

/** teachers records **/
db.getCollection("teachers").insert({
  "_id": "PS0001",
  "sex": "หญิง",
  "tel": "0802623441",
  "name": {
    "first": "เบญจมาศ",
    "last": "ปัญญางาม",
    "title": "นาง"
  },
  "academic_pos": "อาจารย์",
  "password": "sha1$6403fbb6$1$ed6f9a56e93154a35de99fe9c0edefaa3313579a",
  "contact": {
    "email": "bpanyangam@yahoo.com",
    "tel": "080808880"
  }
});

/** title_names records **/
db.getCollection("title_names").insert({
  "_id": 1,
  "th": "นาย",
  "en": "Mr."
});
db.getCollection("title_names").insert({
  "_id": 3,
  "th": "นาง",
  "en": "Mrs."
});
db.getCollection("title_names").insert({
  "_id": 2,
  "th": "นางสาว",
  "en": "Ms."
});
