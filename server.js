const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Connection to MongoDB
mongoose.connect("mongodb url", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("connected to mongodb database successfully");

//schema have all the required fields we need
const employeeSchema = new mongoose.Schema({
  name: String,
  dateOfBirth: Date,
  gender: String,
  passport: String,
  email: String,
  number: Number,
  country: String,
  pinCode: Number,
  address: String,
  state: String,
  city: String,
  applications: [
    {
      university: String,
      course: String,
      tutionFees: Number,
      applicationCountry: String,
      applicationFees: Number,
    },
],
});

const Employee = mongoose.model("Employee", employeeSchema);

// Route for posting the information collected into the mongodb database
app.post("/registers", async (req, res) => {
  try {
    const {
        name,
        dateOfBirth,
        gender,
        passport,
        email,
        number,
        country,
        pinCode,
        address,
        state,
        city,
        applications,
    } = req.body;

    console.log(req.body);
    //below code will create a new document or user we can say in database
    const data = new Employee({
        name,
        dateOfBirth,
        gender,
        passport,
        email,
        number,
        country,
        pinCode,
        address,
        state,
        city,
        applications,
    });

    //below code will save the information into the database and if there is some error found then it will show error message
    await data.save();
    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed." });
  }
});




// app.get("/getuser", async (req, res) => {
//     // userList = await Employee.aggregate([{$unwind : "$applications"}]);
//     userList = await Employee.aggregate([
//         { $unwind: "$applications" },
//         { $project: { _id: 0, application: "$applications" } }
//       ])
//     if (userList.lenght == 0) {
//       return res.status(404);
//     }
//     res.status(200).json(userList);
//   });

  
  app.get("/getuser", async (req, res) => {
    userList = await Employee.aggregate([{$unwind : "$applications"}]);
    // userList = await Employee.aggregate([
    //     { $unwind: "$applications" },
    //     { $project: { _id: 0, application: "$applications" } }
    //   ])
    if (userList.lenght == 0) {
      return res.status(404);
    }
    res.status(200).json(userList);
  });
  
  
  
  app.delete("/userdelete/:userid/:id", async (req, res) => {
    const resourceId = req.params.id;
 

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
  
    try {
      
      const UserDetails = await Employee.findById(req.params.userid);

      if (UserDetails.applications && Array.isArray(UserDetails.applications)) {
       
        UserDetails.applications = UserDetails.applications.filter((application) => {
         
          if (application._id && application._id == resourceId) {
          
            return false;
          }
         
          return true;
        });
      }
    
      await UserDetails.save();
    
      return res.status(200).json(UserDetails);
    } catch (error) {
        console.log(error);
      return res.status(500).json(error);
    }
  });




  app.put("/useredit/:userid/:id", async (req, res) => {
    const resourceId = req.params.id;
 

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
  
    try {
      
      const UserDetails = await Employee.findById(req.params.userid);

      if (UserDetails.applications && Array.isArray(UserDetails.applications)) {
       
        UserDetails.applications = UserDetails.applications.filter((application) => {
         
          if (application._id && application._id == resourceId) {
          
            return false;
          }
         
          return true;
        });
      }

      UserDetails.applications.push(req.body);
    
      await UserDetails.save();
    
      return res.status(200).json(UserDetails);
    } catch (error) {
        console.log(error);
      return res.status(500).json(error);
    }
  });
  
  
  
  app.put("/userupdate/:id", async (req, res) => {
    const resourceId = req.params.id;
  
    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    try {
      // Find the resource by its ID and delete it
      const deletedResource = await Employee.findByIdAndUpdate(resourceId, req.body);
  
      if (!deletedResource) {
        return res.status(404).json({ error: "Employee not found" });
      }
      return res.status(200).json({ message: "Employee updated successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Server error" });
    }
  });
  
  
  //server will run at the port we give at the top of the code named const port : --
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  
