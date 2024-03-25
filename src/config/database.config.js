import mongoose, { connect, set } from "mongoose";
import { UserModel } from "../models/user.model.js";
import { ChatMessageModel } from "../models/livechat.model.js";
import { sample_user } from "../data.js";
import { sample_news } from "../data.js";
import bcrypt from "bcrypt";
import { NewsModel } from "../models/news.model.js";
const PASSWORD_HASH_SALT_ROUNDS = 10;
set("strictQuery", true);

const dbconnect = async (socket) => {
  try {
    await connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () => {
      console.log("Connected to database!");
      const chatMessageStream = ChatMessageModel.watch();
      chatMessageStream.on("change", async (change) => {
        if(change.operationType === 'insert'){
            socket.emit('newMessage', change.fullDocument);
            console.log('New message:', change.fullDocument);
        }
      });
    });

    // const userStream = UserModel.watch();
    // userStream.on('change', async (change) => {
    //     console.log(change);
    //     socket.emit('userChange', change);
    // });
    await seedUsers();
    await seedNews();
  } catch (error) {
    console.log(error);
  }
};

// async function watchUsers(){

//     const changeStream = UserModel.watch();

//     changeStream.on('change', async (change) => {
//         console.log(change);

//     const userList = await UserModel.find();
//     console.log('Updated user list:', userList);
//     });

//     await new Promise(()=>{});
// }

// async function watchMessages(){

//     const mesageStream = ChatMessageModel.watch();

//     mesageStream.on('change', async (change) => {
//         console.log(change);

//     const messageList = await ChatMessageModel.find();
//     console.log('Updated messages list:', messageList);
//     });

//     await new Promise(()=>{});
// }

async function seedUsers() {
  const usersCount = await UserModel.countDocuments();
  if (usersCount > 0) {
    console.log("User seed is already done!");
    return;
  }

  for (let user of sample_user) {
    user.password = await bcrypt.hash(user.password, PASSWORD_HASH_SALT_ROUNDS);
    await UserModel.create(user);
  }

  console.log("User seed is done!");
}

async function seedNews() {
  const newsCount = await NewsModel.countDocuments();

  if (newsCount > 0) {
    console.log("News seed is already done!");
    return;
  }

  for (let news of sample_news) {
    await NewsModel.create(news);
  }
  console.log("News seed is done!");
}

export default dbconnect;
