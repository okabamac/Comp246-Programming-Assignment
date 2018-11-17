const document = [
  {
    team_name: "Dallas Cowboys",
    stadium: "AT&T Stadium",
    capacity: 100000
  },
  {
    team_name: "New York Giants",
    stadium: "Metlife Stadium",
    capacity: 82500
  },
  {
    team_name: "Philadelphia Eagles",
    stadium: "Lincoln Financial Field",
    capacity: 69176
  },
  {
    team_name: "Dallas Mavericks",
    stadium: "American Airlines Center",
    capacity: 21146
  },
  {
    team_name: "FC Dallas",
    stadium: "Toyota Stadium",
    capacity: 20500
  }
];

const MongoClient = require("mongodb").MongoClient;
const connectionString = "mongodb://localhost:27017";

(async () => {
  let client = await MongoClient.connect(
    connectionString,
    { useNewUrlParser: true }
  );
  //Create database
  let db = client.db("sports");
  //Create collection
  try {
    await db.createCollection("teams");
    console.log("Collection created");
  } catch (error) {
    console.error(error);
  }
  //Insert into collection
  try {
    await db.collection("teams").insertMany(document);
    console.log("5 documents inserted");
  } catch (error) {
    console.error(error);
  }

  //Query and return all documents
  try {
    const res = await db
      .collection("teams")
      .find()
      .toArray();
    console.log(res);
  } catch (error) {
    console.error(error);
  }
  //Find all teams in Dallas
  try {
    const res = await db
      .collection("teams")
      .find({ team_name: { $regex: ".*Dallas*" } })
      .toArray();
    console.log(res);
  } catch (error) {
    console.error(error);
  }

  //Delete the NYG team
  try {
    await db.collection("teams").deleteOne({ team_name: "New York Giants" });
    console.log("1 team deleted");
  } catch (error) {
    console.error(error);
  }

  //Query and return all documents
  try {
    const res = await db
      .collection("teams")
      .find()
      .toArray();
    console.log(res);
  } catch (error) {
    console.error(error);
  }

  //Drop the team collection
  try {
    await db.collection("teams").drop();
    console.log("Collection dropped");
  } catch (error) {
    console.error(error);
  }
  //Query and return all documents
  try {
    const res = await db
      .collection("teams")
      .find()
      .toArray();
    console.log(res);
  } catch (error) {
    console.error(error);
  } finally {
    client.close();
  }
})().catch(err => console.error(err));
