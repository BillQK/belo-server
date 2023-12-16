import * as dao from "./dao.js";
import bcrypt from "bcrypt";

const saltRounds = 10; // or more

async function hashPassword(password) {
  return await bcrypt.hash(password, saltRounds);
}

async function comparePassword(inputPassword, hashedPassword) {
  return await bcrypt.compare(inputPassword, hashedPassword);
}

async function UserRoutes(app) {
  const findAllUsers = async (req, res) => {
    const users = await dao.findAllUsers();
    users.map((user) => delete user.password);
    res.json(users);
  };
  const findUserById = async (req, res) => {
    const { id } = req.params;
    const user = await dao.findUserById(id);
    res.json(user);
  };
  const findUserByUsername = async (req, res) => {
    const { username } = req.params;
    const user = await dao.findUserByUsername(username);
    res.json(user);
  };
  const createUser = async (req, res) => {
    const { userName, password, firstName, lastName } = req.params;
    const hashedPassword = await hashPassword(password);
    const user = await dao.createUser({
      userName,
      password: hashedPassword,
      firstName,
      lastName,
    });
    res.json(user);
  };

  const signin = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await dao.findUserByUsername(username);
    console.log(currentUser);
    req.session["currentUser"] = currentUser;
    if (!currentUser) {
      res.status(403).send("Username not found");
      return;
    }
    const isPasswordValid = await comparePassword(
      password,
      currentUser.password
    );
    if (!isPasswordValid) {
      res.status(403).send("Username or password incorrect");
      return;
    }
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };
  const signout = (req, res) => {
    req.session.destroy();
    // currentUser = null;
    res.sendStatus(200);
  };
  const signup = async (req, res) => {
    const { email, userName, password } = req.body;
    console.log(email);
    const user = await dao.findUserByUsername(userName);
    if (user) {
      res.status(403).send("Username already taken");
      return;
    }
    const currentUser = await dao.createUser({ userName, email, password });
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };
  const account = (req, res) => {
    const currentUser = req.session["currentUser"];
  
    res.json(currentUser);
  };

  const updateUser = async (req, res) => {
    const { id } = req.params;
    const user = req.body;
    console.log("Received data for update:", id, user);
    delete user._id;
    try {
      const status = await dao.updateUser(id, user);
      res.json(status);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/signup", signup);
  app.post("/api/users/account", account);

  app.get("/api/users", findAllUsers);
  app.get("/api/users/:id", findUserById);
  app.get("/api/users/username/:username", findUserByUsername);
  app.get("/api/users/:username/:password/:firstName/:lastName", createUser);
  app.post("/api/users", () => {});
  app.put("/api/users/:id", updateUser);
}

export default UserRoutes;
